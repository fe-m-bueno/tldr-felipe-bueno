// Seed do TLDR: cria (ou atualiza) o singleton `tldrProfile` e as linhas `tldrRow`
// com a copy canônica do ticket 02 — a versão revisada pelo /stop-slop.
//
// Idempotente: cada entrada tem id explícito, na convenção do modelo existente
// (`site-profile-main`, `project-bookclubinho`). Rodar de novo reescreve e republica,
// não duplica.
//
// ATENÇÃO: reescrever significa sobrescrever. Uma edição feita no app do Contentful
// volta ao texto daqui na próxima execução. Se o texto mudou por lá e deve ficar,
// traga a mudança para este arquivo antes de rodar de novo — foi o que aconteceu com
// "2025 — Present", editado no app e revertido sem querer.
//
//   node contentful/seed-tldr.mjs           # escreve e publica
//   node contentful/seed-tldr.mjs --dry     # só imprime o que faria
//
// Sem dependência: a CMA é HTTP e o Node 22 tem fetch. O SDK `contentful` só entra
// no site, para ler.

import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const DRY = process.argv.includes('--dry');
const LOCALE = 'en-US'; // o TLDR é EN-only: nenhum campo `tldr*` é localizado

// ---------------------------------------------------------------- env
process.loadEnvFile(resolve(here, '..', '.env.local'));
const SPACE = process.env.CONTENTFUL_SPACE_ID;
const TOKEN = process.env.CONTENTFUL_MANAGEMENT_TOKEN;
const ENV = process.env.CONTENTFUL_ENVIRONMENT_ID || 'master';
if (!SPACE || !TOKEN) throw new Error('faltam CONTENTFUL_SPACE_ID / CONTENTFUL_MANAGEMENT_TOKEN');

const BASE = `https://api.contentful.com/spaces/${SPACE}/environments/${ENV}`;

// ---------------------------------------------------------------- helpers
const one = (v) => (v === undefined || v === '' ? undefined : { [LOCALE]: v });
const entryLink = (id) => ({ sys: { type: 'Link', linkType: 'Entry', id } });
const assetLink = (id) => ({ sys: { type: 'Link', linkType: 'Asset', id } });

function fields(obj) {
	const out = {};
	for (const [k, v] of Object.entries(obj)) {
		const wrapped = one(v);
		if (wrapped !== undefined) out[k] = wrapped;
	}
	return out;
}

async function cma(path, { method = 'GET', body, headers = {} } = {}) {
	const res = await fetch(BASE + path, {
		method,
		headers: {
			Authorization: `Bearer ${TOKEN}`,
			'Content-Type': 'application/vnd.contentful.management.v1+json',
			...headers
		},
		body: body ? JSON.stringify(body) : undefined
	});
	if (!res.ok) throw new Error(`${method} ${path} → ${res.status} ${await res.text()}`);
	return res.status === 204 ? null : res.json();
}

async function currentVersion(id) {
	const res = await fetch(`${BASE}/entries/${id}`, {
		headers: { Authorization: `Bearer ${TOKEN}` }
	});
	if (res.status === 404) return null;
	if (!res.ok) throw new Error(`GET /entries/${id} → ${res.status}`);
	return (await res.json()).sys.version;
}

async function upsert({ id, contentType, fields: f }) {
	if (DRY) {
		console.log(`· ${id} (${contentType})`, JSON.stringify(f).slice(0, 110) + '…');
		return;
	}
	const version = await currentVersion(id);
	const entry = await cma(`/entries/${id}`, {
		method: 'PUT',
		body: { fields: f },
		headers: {
			'X-Contentful-Content-Type': contentType,
			...(version === null ? {} : { 'X-Contentful-Version': String(version) })
		}
	});
	await cma(`/entries/${id}/published`, {
		method: 'PUT',
		headers: { 'X-Contentful-Version': String(entry.sys.version) }
	});
	console.log(`${version === null ? 'criada ' : 'atualizada'}  ${id}`);
}

// ---------------------------------------------------------------- conteúdo
// A ordem destes arrays é a ordem na página: `tldrRow` não tem campo de ordem.
const WORK = [
	{
		id: 'tldr-row-work-pilgrims',
		internalName: 'TLDR · Work · Pilgrims Consulting',
		label: 'Pilgrims Consulting',
		detail: 'Software engineer',
		meta: '2025 — Present'
	},
	{
		id: 'tldr-row-work-before',
		internalName: 'TLDR · Work · Before',
		label: 'Before',
		detail: 'Business roles I automated my way out of',
		meta: '2022 – 2023'
	}
];

// `ref` carrega só a URL — todo texto exibido é override.
const PROJECTS = [
	{
		id: 'tldr-row-project-cli-stealth-reader',
		internalName: 'TLDR · Projects · CLI Stealth Reader',
		label: 'CLI Stealth Reader',
		detail: 'A terminal e-reader I rewrote in Rust. Boot 339ms → 0.9ms.',
		meta: 'Rust',
		ref: 'project-code-review-crew'
	},
	{
		id: 'tldr-row-project-bookclubinho',
		internalName: 'TLDR · Projects · Bookclubinho',
		label: 'Bookclubinho',
		detail: 'A book club platform with row-level security and live updates over SSE.',
		meta: 'Next.js',
		ref: 'project-bookclubinho'
	},
	{
		id: 'tldr-row-project-break-stuff',
		internalName: 'TLDR · Projects · Break Stuff',
		label: 'Break Stuff',
		detail: 'Breaks a task too big to start into ordered, timed steps.',
		meta: 'Nuxt',
		ref: 'project-breakstuff'
	}
];

const ELSEWHERE = [
	{
		id: 'tldr-row-elsewhere-email',
		internalName: 'TLDR · Elsewhere · Email',
		label: 'Email',
		meta: 'fe@felipe-bueno.com',
		href: 'mailto:fe@felipe-bueno.com',
		icon: 'mail'
	},
	{
		id: 'tldr-row-elsewhere-github',
		internalName: 'TLDR · Elsewhere · GitHub',
		label: 'GitHub',
		meta: 'fe-m-bueno',
		href: 'https://github.com/fe-m-bueno',
		icon: 'github'
	},
	{
		id: 'tldr-row-elsewhere-linkedin',
		internalName: 'TLDR · Elsewhere · LinkedIn',
		label: 'LinkedIn',
		meta: 'felipe-martins-bueno',
		href: 'https://linkedin.com/in/felipe-martins-bueno',
		icon: 'linkedin'
	},
	{
		id: 'tldr-row-elsewhere-site',
		internalName: 'TLDR · Elsewhere · The long version',
		label: 'The long version',
		meta: 'felipe-bueno.com',
		href: 'https://felipe-bueno.com',
		icon: 'web'
	},
	{
		// Sem `href`: a URL sai do asset. Resolução é href → ref.liveUrl → file.url.
		id: 'tldr-row-elsewhere-resume',
		internalName: 'TLDR · Elsewhere · Résumé',
		label: 'Résumé',
		meta: 'PDF, English',
		icon: 'pdf',
		file: 'asset-pdfs-resume_2026_en-pdf'
	}
];

// A bio guarda dois parágrafos separados por linha em branco, e o link com ícone
// da variante E em sintaxe markdown com o nome do ícone no título:
//   [texto](url "pilgrims")
const BIO = `I design services and APIs from scratch and make them fast. And I get systems that were never meant to talk to each other to agree on the same numbers.

I work at [Pilgrims Consulting](https://pilgrimsconsulting.com.br "pilgrims"), in Curitiba. I came into engineering through a business degree, which is why messy operational data doesn't throw me.`;

const PROFILE = {
	id: 'tldr-profile-main',
	internalName: 'TLDR profile',
	name: 'Felipe Bueno',
	headline: 'Software engineer, backend-focused. Curitiba, Brazil.',
	bio: BIO,
	// Esvaziar este campo apaga a linha da página. É uma das duas seções condicionais.
	availability: "I'm open to full-time and contract work, remote or relocating.",
	avatar: 'asset-hero-jpg' // heroImage, não profileImage: o outro é logotipo e some em 44px
};

// ---------------------------------------------------------------- execução
const rowFields = (r) =>
	Object.assign(
		fields({
			internalName: r.internalName,
			label: r.label,
			detail: r.detail,
			meta: r.meta,
			href: r.href,
			icon: r.icon
		}),
		r.ref ? { ref: { [LOCALE]: entryLink(r.ref) } } : {},
		r.file ? { file: { [LOCALE]: assetLink(r.file) } } : {}
	);

for (const row of [...WORK, ...PROJECTS, ...ELSEWHERE]) {
	await upsert({ id: row.id, contentType: 'tldrRow', fields: rowFields(row) });
}

await upsert({
	id: PROFILE.id,
	contentType: 'tldrProfile',
	fields: {
		...fields({
			internalName: PROFILE.internalName,
			name: PROFILE.name,
			headline: PROFILE.headline,
			bio: PROFILE.bio,
			availability: PROFILE.availability
		}),
		avatar: { [LOCALE]: assetLink(PROFILE.avatar) },
		work: { [LOCALE]: WORK.map((r) => entryLink(r.id)) },
		projects: { [LOCALE]: PROJECTS.map((r) => entryLink(r.id)) },
		elsewhere: { [LOCALE]: ELSEWHERE.map((r) => entryLink(r.id)) }
	}
});

console.log(DRY ? '\ndry run, nada escrito' : '\nseed publicado');
