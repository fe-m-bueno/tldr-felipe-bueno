<script lang="ts">
	import '../app.css';

	let { children } = $props();

	// A imagem de OG é a que o site completo já serve, em URL absoluta — este site vive
	// num subdomínio e `/felipe-bueno.png` aqui não existe.
	const OG_IMAGE = 'https://felipe-bueno.com/felipe-bueno.png';
	const DESCRIPTION =
		'I design services and APIs from scratch and make them fast. And I get systems that were never meant to talk to each other to agree on the same numbers.';
</script>

<svelte:head>
	<meta name="description" content={DESCRIPTION} />
	<!-- Quem busca "Felipe Bueno" acha o site completo. Isto aqui é link direto, e não
	     compete com ele em busca. `follow` porque os links daqui apontam pra lá. -->
	<meta name="robots" content="noindex, follow" />

	<meta property="og:title" content="Felipe Bueno, the short version" />
	<meta property="og:description" content={DESCRIPTION} />
	<meta property="og:image" content={OG_IMAGE} />
	<meta property="og:type" content="website" />
	<meta property="og:locale" content="en_US" />
	<meta name="twitter:card" content="summary_large_image" />
</svelte:head>

<div class="col">
	{@render children()}
</div>
