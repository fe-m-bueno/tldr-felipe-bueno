import { asIconName, type BioSegment } from './types';

/**
 * A bio chega do Contentful como um campo de texto só. Ela guarda duas coisas que o
 * campo sozinho não expressa: a quebra de parágrafo, e o link com ícone da variante E
 * ("I work at [ícone] Pilgrims Consulting").
 *
 * Convenção, e é a única sintaxe que a página interpreta:
 *   - parágrafos separados por linha em branco
 *   - link em markdown, com o nome do ícone no título: [texto](url "company")
 *
 * O título é opcional; sem ele o link sai sem ícone. Um nome de ícone desconhecido é
 * ignorado em vez de quebrar o build — o editor do Contentful não valida esta sintaxe.
 */
const LINK = /\[([^\]]+)\]\(([^)\s]+)(?:\s+"([^"]*)")?\)/g;

export function parseBio(source: string): BioSegment[][] {
	return source
		.split(/\r?\n\s*\r?\n/)
		.map((p) => p.trim())
		.filter(Boolean)
		.map(parseParagraph);
}

function parseParagraph(paragraph: string): BioSegment[] {
	const segments: BioSegment[] = [];
	let cursor = 0;

	for (const match of paragraph.matchAll(LINK)) {
		const [whole, text, href, iconName] = match;
		const before = paragraph.slice(cursor, match.index);
		if (before) segments.push({ text: before });
		segments.push({ text, href, icon: asIconName(iconName) });
		cursor = match.index + whole.length;
	}

	const rest = paragraph.slice(cursor);
	if (rest) segments.push({ text: rest });

	return segments;
}
