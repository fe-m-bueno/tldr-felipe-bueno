<script lang="ts">
	import Icon from '$lib/components/Icon.svelte';
	import Row from '$lib/components/Row.svelte';
	import Text from '$lib/components/Text.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
	let { profile, writing, projectCount } = $derived(data);
</script>

<svelte:head>
	<title>Felipe Bueno, the short version</title>
</svelte:head>

<div class="hd">
	{#if profile.avatar}
		<img src={profile.avatar.src} alt={profile.avatar.alt} width="44" height="44" />
	{/if}
	<span>
		<span class="nm">{profile.name}</span>
		<span class="sub">{profile.headline}</span>
	</span>
</div>

{#each profile.bio as paragraph, i (i)}
	<p>
		{#each paragraph as segment, j (j)}{#if segment.href}<a class="lk" href={segment.href}
					>{#if segment.icon}<Icon name={segment.icon} />{/if}<Text value={segment.text} /></a
				>{:else}<Text value={segment.text} />{/if}{/each}
	</p>
{/each}

<!-- Condicional: some quando o campo `availability` do Contentful esvazia. -->
{#if profile.availability}
	<p class="avail">{profile.availability}</p>
{/if}

<section>
	<h2>work</h2>
	<div class="rows">
		{#each profile.work as row (row.label)}
			<Row {row} />
		{/each}
	</div>
</section>

<section>
	<h2>projects</h2>
	<div class="rows">
		{#each profile.projects as row (row.label)}
			<Row {row} />
		{/each}
		<!-- A segunda rota, do ticket 09. O metadado é a contagem, e ela cresce sozinha. -->
		<Row row={{ label: 'All projects', meta: String(projectCount), href: '/projects' }} weak />
	</div>
</section>

<!-- Condicional: a seção não existe enquanto não houver `blogPost` publicado, e aparece
     sozinha quando houver — é o webhook do Contentful que reconstrói o site. -->
{#if writing.length > 0}
	<section>
		<h2>writing</h2>
		<div class="rows">
			{#each writing as row (row.href)}
				<Row {row} />
			{/each}
		</div>
	</section>
{/if}

<section>
	<h2>elsewhere</h2>
	<div class="rows">
		{#each profile.elsewhere as row (row.label)}
			<Row {row} link="meta" />
		{/each}
	</div>
</section>
