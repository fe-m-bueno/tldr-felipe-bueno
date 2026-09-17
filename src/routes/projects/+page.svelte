<script lang="ts">
	import Icon from '$lib/components/Icon.svelte';
	import Row from '$lib/components/Row.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
	let { projects } = $derived(data);
</script>

<svelte:head>
	<title>Projects — Felipe Bueno</title>
</svelte:head>

<p>
	<a class="back" href="/"
		><Icon name="arrow-left" kind="arrow" label="Back to" />
		Felipe Bueno</a
	>
</p>

<h1>Projects</h1>
<p class="sub">Everything I've shipped and kept online. Three of these are on the front page.</p>

<section>
	<div class="rows">
		{#each projects as row (row.label)}
			<Row {row} />
		{/each}
	</div>
</section>
