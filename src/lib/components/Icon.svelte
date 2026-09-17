<script lang="ts">
	import type { SpriteId } from '$lib/types';

	let {
		name,
		// Ícone de linha (`.ic`) ou seta no lugar de um caractere (`.arrow`): a diferença
		// é a caixa. O ícone alinha pela altura-x; a seta usa a caixa do glifo da Inter.
		kind = 'ic',
		// Sem rótulo o ícone é decorativo — o texto ao lado já diz o que é. Com rótulo ele
		// substitui um caractere que faltava na fonte, e precisa ser lido.
		label
	}: { name: SpriteId; kind?: 'ic' | 'arrow'; label?: string } = $props();
</script>

{#if label}
	<svg class={kind} role="img" aria-label={label}><use href="#i-{name}" /></svg>
{:else}
	<svg class={kind} aria-hidden="true" focusable="false"><use href="#i-{name}" /></svg>
{/if}
