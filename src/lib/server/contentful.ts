// Leitura do Contentful. Só roda em build: `+page.server.ts` importa daqui e todas as
// rotas são prerenderizadas, então o delivery token nunca existe em runtime.
//
// O SDK v11 roda direto, sem wrapper. O que sai daqui são tipos de domínio planos —
// nada de entradas do Contentful atravessando o `load`, que precisa serializar por devalue.

import { createClient, type Asset, type Entry, type EntryFieldTypes } from 'contentful';
import { CONTENTFUL_SPACE_ID, CONTENTFUL_DELIVERY_TOKEN } from '$env/static/private';
import { parseBio } from '$lib/bio';
import { asIconName, type HomeData, type Profile, type Row } from '$lib/types';

const LOCALE = 'en-US'; // o TLDR é EN-only

const client = createClient({
	space: CONTENTFUL_SPACE_ID,
	accessToken: CONTENTFUL_DELIVERY_TOKEN
}).withoutUnresolvableLinks;

// ------------------------------------------------------------------ skeletons
// À mão: são dois types novos e dois emprestados do site completo. Só os campos
// que o TLDR lê aparecem aqui.

type ProjectSkeleton = {
	contentTypeId: 'project';
	fields: {
		title: EntryFieldTypes.Symbol;
		liveUrl: EntryFieldTypes.Symbol;
		githubUrl: EntryFieldTypes.Symbol;
		metrics: EntryFieldTypes.Array<EntryFieldTypes.Symbol>;
		technologies: EntryFieldTypes.Array<EntryFieldTypes.EntryLink<TechnologySkeleton>>;
		order: EntryFieldTypes.Integer;
		status: EntryFieldTypes.Symbol;
	};
};

type TechnologySkeleton = {
	contentTypeId: 'technology';
	fields: { name: EntryFieldTypes.Symbol };
};

type BlogPostSkeleton = {
	contentTypeId: 'blogPost';
	fields: {
		title: EntryFieldTypes.Symbol;
		slug: EntryFieldTypes.Symbol;
		publishedAt: EntryFieldTypes.Date;
		status: EntryFieldTypes.Symbol;
	};
};

type TldrRowSkeleton = {
	contentTypeId: 'tldrRow';
	fields: {
		label: EntryFieldTypes.Symbol;
		detail: EntryFieldTypes.Symbol;
		meta: EntryFieldTypes.Symbol;
		href: EntryFieldTypes.Symbol;
		icon: EntryFieldTypes.Symbol;
		ref: EntryFieldTypes.EntryLink<ProjectSkeleton | BlogPostSkeleton>;
		file: EntryFieldTypes.AssetLink;
	};
};

type TldrProfileSkeleton = {
	contentTypeId: 'tldrProfile';
	fields: {
		name: EntryFieldTypes.Symbol;
		headline: EntryFieldTypes.Symbol;
		bio: EntryFieldTypes.Text;
		availability: EntryFieldTypes.Symbol;
		avatar: EntryFieldTypes.AssetLink;
		work: EntryFieldTypes.Array<EntryFieldTypes.EntryLink<TldrRowSkeleton>>;
		projects: EntryFieldTypes.Array<EntryFieldTypes.EntryLink<TldrRowSkeleton>>;
		elsewhere: EntryFieldTypes.Array<EntryFieldTypes.EntryLink<TldrRowSkeleton>>;
	};
};

type Resolved<S extends { contentTypeId: string; fields: object }> = Entry<
	S,
	'WITHOUT_UNRESOLVABLE_LINKS',
	string
>;

type ResolvedAsset = Asset<'WITHOUT_UNRESOLVABLE_LINKS', string>;

// ------------------------------------------------------------------ helpers

function text(value: unknown): string | undefined {
	return typeof value === 'string' && value.trim() !== '' ? value : undefined;
}

function assetUrl(asset: ResolvedAsset | undefined): string | undefined {
	const url = asset?.fields?.file?.url;
	return url ? `https:${url}` : undefined;
}

const FULL_SITE = 'https://felipe-bueno.com';

function projectUrl(entry: Resolved<ProjectSkeleton>): string | undefined {
	return text(entry.fields.liveUrl) ?? text(entry.fields.githubUrl);
}

function postUrl(slug: string): string {
	return `${FULL_SITE}/words/${slug}`;
}

/**
 * A ordem do ticket 04: href explícito, senão a URL da entrada de origem, senão o asset.
 * Devolve junto se a URL saiu do asset — é isso, e não a extensão do arquivo, que faz a
 * linha do currículo ser um download.
 */
function rowHref(row: Resolved<TldrRowSkeleton>): { href?: string; isFile: boolean } {
	const explicit = text(row.fields.href);
	if (explicit) return { href: explicit, isFile: false };

	const ref = row.fields.ref;
	if (ref) {
		if (ref.sys.contentType.sys.id === 'project') {
			return { href: projectUrl(ref as Resolved<ProjectSkeleton>), isFile: false };
		}
		const slug = text((ref as Resolved<BlogPostSkeleton>).fields.slug);
		if (slug) return { href: postUrl(slug), isFile: false };
	}

	const file = assetUrl(row.fields.file);
	return { href: file, isFile: Boolean(file) };
}

function toRow(row: Resolved<TldrRowSkeleton>): Row {
	const { href, isFile } = rowHref(row);
	return {
		label: text(row.fields.label) ?? '',
		detail: text(row.fields.detail),
		meta: text(row.fields.meta),
		href,
		icon: asIconName(row.fields.icon),
		isFile
	};
}

/**
 * O SDK remove os links não resolvíveis em runtime, mas o tipo do array continua
 * admitindo buracos — daí o filtro, que aqui é exigência do tipo e não desconfiança.
 */
function rows(list: (Resolved<TldrRowSkeleton> | undefined)[] | undefined): Row[] {
	return (list ?? []).filter((row) => row !== undefined).map(toRow);
}

/** O que o site completo considera visível. Vale para a lista e para a contagem. */
const PUBLISHED = ['published', 'featured'];

const MONTH_YEAR = new Intl.DateTimeFormat('en-US', {
	month: 'short',
	year: 'numeric',
	timeZone: 'UTC'
});

// ------------------------------------------------------------------ consultas

async function getProfile(): Promise<Profile> {
	const entries = await client.getEntries<TldrProfileSkeleton>({
		content_type: 'tldrProfile',
		locale: LOCALE,
		include: 2,
		limit: 1
	});

	const profile = entries.items[0];
	if (!profile) throw new Error('Contentful: nenhuma entrada `tldrProfile` publicada');

	const avatarUrl = assetUrl(profile.fields.avatar);

	return {
		name: text(profile.fields.name) ?? '',
		headline: text(profile.fields.headline) ?? '',
		bio: parseBio(text(profile.fields.bio) ?? ''),
		availability: text(profile.fields.availability),
		// Recorte pela API de imagem do Contentful: 44px na tela, 2× para telas densas.
		// `fm=webp` corta a mesma imagem de 9,7KB para 3,6KB — é o terceiro maior arquivo
		// da página depois da fonte e do favicon.
		avatar: avatarUrl
			? {
					src: `${avatarUrl}?w=112&h=112&fit=thumb&f=face&fm=webp&q=80`,
					alt: text(profile.fields.name) ?? ''
				}
			: undefined,
		work: rows(profile.fields.work),
		projects: rows(profile.fields.projects),
		elsewhere: rows(profile.fields.elsewhere)
	};
}

/**
 * Writing não é lista curada: são os três `blogPost` publicados mais recentes.
 * Zero posts = zero linhas, e a seção não é renderizada. É uma das duas condicionais.
 */
async function getWriting(): Promise<Row[]> {
	const posts = await client.getEntries<BlogPostSkeleton>({
		content_type: 'blogPost',
		locale: LOCALE,
		'fields.status': 'published',
		order: ['-fields.publishedAt'],
		limit: 3
	});

	return posts.items.map((post) => {
		const published = text(post.fields.publishedAt);
		return {
			label: text(post.fields.title) ?? '',
			meta: published ? MONTH_YEAR.format(new Date(published)) : undefined,
			href: postUrl(text(post.fields.slug) ?? '')
		};
	});
}

/** A rota `/projects`: consulta sobre todos os `project`, sem lista curada e sem texto novo. */
export async function getProjectRows(): Promise<Row[]> {
	const projects = await client.getEntries<ProjectSkeleton>({
		content_type: 'project',
		locale: LOCALE,
		include: 1,
		'fields.status[in]': PUBLISHED,
		order: ['fields.order'],
		limit: 100
	});

	return projects.items.map((project) => {
		// `metrics` já guarda fragmentos curtos e nativos de TLDR. Dois cabem na linha.
		const metrics = (project.fields.metrics ?? []).filter((m): m is string => Boolean(text(m)));

		return {
			label: text(project.fields.title) ?? '',
			detail: metrics.slice(0, 2).join(' · ') || undefined,
			meta: text(project.fields.technologies?.[0]?.fields?.name),
			href: projectUrl(project)
		};
	});
}

/** Só o número da linha `All projects`. O envelope do Contentful já traz a contagem. */
async function countProjects(): Promise<number> {
	const projects = await client.getEntries<ProjectSkeleton>({
		content_type: 'project',
		'fields.status[in]': PUBLISHED,
		limit: 0
	});

	return projects.total;
}

export async function getHomeData(): Promise<HomeData> {
	const [profile, writing, projectCount] = await Promise.all([
		getProfile(),
		getWriting(),
		countProjects()
	]);

	return { profile, writing, projectCount };
}
