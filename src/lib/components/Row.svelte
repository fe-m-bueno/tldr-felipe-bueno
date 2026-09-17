<script lang="ts">
	import Icon from './Icon.svelte';
	import Text from './Text.svelte';
	import type { Row } from '$lib/types';

	let {
		row,
		// Onde o link vive. Em Work e Projects é o rótulo que leva pra fora; em Elsewhere
		// quem carrega o endereço é o metadado, e é ele que fica clicável.
		link = 'label',
		// A linha `All projects` navega dentro do site e não compete com os projetos
		// curados acima dela: fica no peso do corpo, sem o meio-peso 500 do rótulo.
		weak = false
	}: { row: Row; link?: 'label' | 'meta'; weak?: boolean } = $props();

	let href = $derived(row.href);
	// Baixar só faz sentido quando a URL é de um arquivo do Contentful, e quem sabe disso
	// é a resolução do href — não a extensão do arquivo.
	let download = $derived(row.isFile ? '' : undefined);
</script>

<!-- Espaços aqui são significativos: a linha é uma só, e `&nbsp;` segura o detalhe colado
	 ao rótulo quando o texto quebra. Por isso o encadeamento apertado de tags. -->
{#snippet cell(value: string, linked: boolean)}{#if linked}<a {href} {download}><Text {value} /></a
		>{:else}<Text {value} />{/if}{/snippet}

<div class="row">
	<span class="l"
		><span class={['t', weak && 'weak']}
			>{#if row.icon}<Icon name={row.icon} />{/if}{@render cell(
				row.label,
				Boolean(href) && link === 'label'
			)}</span
		>{#if row.detail}{' '}&nbsp;<span class="d"><Text value={row.detail} /></span>{/if}</span
	>
	<span class="lead-dots"></span>
	{#if row.meta}<span class="m">{@render cell(row.meta, Boolean(href) && link === 'meta')}</span
		>{/if}
</div>
