<script lang="ts">
	import Icon from './Icon.svelte';

	// Imprime texto vindo do Contentful trocando a flecha pelo glifo da Inter em SVG.
	// O CMS guarda o caractere → normal; quem edita não precisa saber de nada disso.
	let { value }: { value: string } = $props();

	let parts = $derived(value.split('→'));
</script>

{#each parts as part, i (i)}{#if i > 0}<Icon
			name="arrow"
			kind="arrow"
			label="to"
		/>{/if}{part}{/each}
