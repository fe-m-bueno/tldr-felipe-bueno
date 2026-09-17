// Os tipos de domínio do TLDR. Escritos à mão, não gerados: são dois content types,
// e o gerador custaria uma devDependency mais um management token no build.
//
// O vocabulário aqui é o do CONTEXT.md: linha, rótulo, detalhe, metadado.

export const ICONS = ['mail', 'github', 'linkedin', 'web', 'pdf', 'company', 'pilgrims'] as const;
export type IconName = (typeof ICONS)[number];

/** Os dois símbolos do sprite que não são ícone de linha: as setas que faltam na fonte. */
export type SpriteId = IconName | 'arrow' | 'arrow-left';

/** O dropdown `icon` do Contentful é texto livre do ponto de vista do SDK. */
export function asIconName(value: unknown): IconName | undefined {
	return ICONS.includes(value as IconName) ? (value as IconName) : undefined;
}

/** Uma linha. Serve Work, Projects, Writing e Elsewhere sem distinção. */
export interface Row {
	/** O texto à esquerda, sempre presente. */
	label: string;
	/** O texto em tom apagado que segue o rótulo. */
	detail?: string;
	/** O texto alinhado à direita. */
	meta?: string;
	/** Já resolvido: href → ref.liveUrl → file.url. */
	href?: string;
	icon?: IconName;
	/** O href aponta para um asset do Contentful, e não para uma página. */
	isFile?: boolean;
}

/** Um trecho de bio: texto puro, ou texto com link e ícone opcional. */
export interface BioSegment {
	text: string;
	href?: string;
	icon?: IconName;
}

export interface Avatar {
	src: string;
	alt: string;
}

export interface Profile {
	name: string;
	headline: string;
	/** Parágrafos, cada um já quebrado em trechos com e sem link. */
	bio: BioSegment[][];
	/** Vazio no Contentful = a linha não é renderizada. Seção condicional. */
	availability?: string;
	avatar?: Avatar;
	work: Row[];
	projects: Row[];
	elsewhere: Row[];
}

export interface HomeData {
	profile: Profile;
	/** Os três posts mais recentes. Vazio = a seção Writing não existe. */
	writing: Row[];
	/** Quantos `project` publicados existem, para o metadado da linha `All projects`. */
	projectCount: number;
}
