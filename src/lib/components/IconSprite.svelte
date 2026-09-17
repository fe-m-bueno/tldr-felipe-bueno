<script lang="ts">
	import type { SpriteId } from '$lib/types';

	// Cada rota pede os seus. /projects usa duas setas e mais nada; mandar os seis
	// ícones de linha junto seriam 1,7KB de símbolo que aquele documento nunca aponta.
	let { ids }: { ids: SpriteId[] } = $props();

	let has = $derived(new Set<SpriteId>(ids));
</script>

<!--
	O sprite de ícones, inline e uma vez por documento. SVG no HTML, zero dependência e
	zero requisição — o `<use href="#i-…">` de cada linha aponta para cá.
	Os ids espelham o dropdown `icon` do `tldrRow`, mais as duas setas.
-->
<svg
	xmlns="http://www.w3.org/2000/svg"
	aria-hidden="true"
	style="position:absolute;width:0;height:0;overflow:hidden"
>
	{#if has.has('mail')}<symbol id="i-mail" viewBox="0 0 16 16">
			<path
				fill="none"
				stroke="currentColor"
				stroke-width="1.3"
				d="M1.7 3.7h12.6v8.6H1.7zM1.9 4.2l6.1 4.3 6.1-4.3"
			/>
		</symbol>{/if}
	{#if has.has('github')}<symbol id="i-github" viewBox="0 0 16 16">
			<path
				fill="currentColor"
				d="M8 .8a7.2 7.2 0 0 0-2.3 14c.36.07.5-.15.5-.34v-1.2c-2 .44-2.43-.97-2.43-.97-.33-.83-.8-1.05-.8-1.05-.66-.45.05-.44.05-.44.73.05 1.11.75 1.11.75.65 1.11 1.7.79 2.11.6.07-.47.25-.79.46-.97-1.6-.18-3.28-.8-3.28-3.56 0-.79.28-1.43.74-1.93-.07-.19-.32-.92.07-1.91 0 0 .6-.19 1.97.74a6.9 6.9 0 0 1 3.6 0c1.37-.93 1.97-.74 1.97-.74.39.99.14 1.72.07 1.91.46.5.74 1.14.74 1.93 0 2.77-1.69 3.38-3.29 3.56.26.22.49.66.49 1.33v1.97c0 .19.13.42.5.34A7.2 7.2 0 0 0 8 .8"
			/>
		</symbol>{/if}
	{#if has.has('linkedin')}<symbol id="i-linkedin" viewBox="0 0 16 16">
			<path
				fill="currentColor"
				d="M3.4 1.6a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3M2.1 6.1h2.6v8.3H2.1zM6.6 6.1h2.5v1.14h.04c.35-.63 1.2-1.3 2.47-1.3 2.64 0 3.13 1.65 3.13 3.8v4.66h-2.6v-4.13c0-.99-.02-2.26-1.42-2.26-1.42 0-1.64 1.08-1.64 2.19v4.2H6.6z"
			/>
		</symbol>{/if}
	{#if has.has('web')}<symbol id="i-web" viewBox="0 0 16 16">
			<g fill="none" stroke="currentColor" stroke-width="1.3">
				<circle cx="8" cy="8" r="6.3" />
				<path d="M1.7 8h12.6M8 1.7c3.4 3.6 3.4 9 0 12.6-3.4-3.6-3.4-9 0-12.6" />
			</g>
		</symbol>{/if}
	{#if has.has('pdf')}<symbol id="i-pdf" viewBox="0 0 16 16">
			<g
				fill="none"
				stroke="currentColor"
				stroke-width="1.3"
				stroke-linecap="round"
				stroke-linejoin="round"
			>
				<path d="M8 1.9v7.6M5.2 6.9 8 9.7l2.8-2.8" />
				<path d="M2.4 11v2.2c0 .5.4.9.9.9h9.4c.5 0 .9-.4.9-.9V11" />
			</g>
		</symbol>{/if}
	{#if has.has('company')}<symbol id="i-company" viewBox="0 0 16 16">
			<g fill="none" stroke="currentColor" stroke-width="1.3">
				<path
					d="M2.4 14V3.1c0-.4.3-.7.7-.7h6c.4 0 .7.3.7.7V14M10 14V6.6h2.9c.4 0 .7.3.7.7V14M1.2 14h13.6"
				/>
				<path d="M4.7 5.2h1.4M4.7 7.8h1.4M4.7 10.4h1.4" />
			</g>
		</symbol>{/if}
	<!--
		A flecha de "Boot 339ms → 0.9ms". É o glifo rightArrow (U+2192) da própria Inter,
		extraído da instância wght 400 / opsz 16 — o subset latino de fábrica não traz esse
		ponto de código, e sem isso a flecha cairia numa fonte de sistema no meio da linha.
		A caixa é a do glifo: 1947 de avanço por 2478 de altura (ascendente 1984, descendente
		-494, em de 2048). O `translate`+`scale(1,-1)` só converte o y do tipo para o do SVG.
	-->
	{#if has.has('arrow')}<symbol id="i-arrow" viewBox="0 0 1947 2478">
			<g transform="translate(0 1984) scale(1 -1)"
				><path
					fill="currentColor"
					d="M1096 0 981 116 1192 326Q1231 364 1277.0 405.0Q1323 446 1372.0 487.5Q1421 529 1466.5 566.0Q1512 603 1551 633L1527 599Q1486 591 1444.5 584.5Q1403 578 1361.5 573.5Q1320 569 1278 569H252V735H1278Q1320 735 1361.5 730.5Q1403 726 1444.5 720.0Q1486 714 1527 705L1551 671Q1500 711 1436.0 763.5Q1372 816 1308.0 871.5Q1244 927 1192 978L981 1188L1096 1304L1748 652Z"
				/></g
			>
		</symbol>{/if}
	<!-- A seta do link de volta em /projects (U+2190), pelo mesmo motivo da de cima. -->
	{#if has.has('arrow-left')}<symbol id="i-arrow-left" viewBox="0 0 1947 2478">
			<g transform="translate(0 1984) scale(1 -1)"
				><path
					fill="currentColor"
					d="M850 0 198 652 850 1304 966 1188 755 978Q704 927 639.5 871.5Q575 816 511.0 763.5Q447 711 395 671L419 705Q461 714 502.5 720.0Q544 726 585.5 730.5Q627 735 668 735H1694V569H668Q627 569 585.5 573.5Q544 578 502.5 584.5Q461 591 419 599L395 633Q434 603 480.0 566.0Q526 529 575.0 487.5Q624 446 670.0 405.0Q716 364 755 326L966 116Z"
				/></g
			>
		</symbol>{/if}
	<!-- O P da Pilgrims, do SVG que o Felipe mandou. Caixa própria (927×999, não 16×16)
		 porque é um logotipo e não um ícone do conjunto; o `preserveAspectRatio` padrão
		 encaixa ele no quadrado de 1em sem distorcer. O path passou pelo svgo em precisão
		 zero: 24,8KB viraram 2,4KB, e em 16px não dá para distinguir do original. -->
	{#if has.has('pilgrims')}<symbol id="i-pilgrims" viewBox="0 0 927 999">
			<path
				fill="currentColor"
				fill-rule="evenodd"
				clip-rule="evenodd"
				d="m584 8-10 1-9 1h-10l-10 1-9 1-10 1-9 2-10 1-9 2-10 1-9 2-9 2-9 2-9 2-10 2-9 2-9 3-9 2-9 3-9 3-8 2-9 3-9 3-9 4-8 3-9 3-9 4-8 3-9 4-8 4-9 4-8 4-8 4-8 4-9 4-8 5-8 4-8 5-8 5-8 4-8 5-8 5-8 6-8 5-8 6-7 5-8 5-8 6-7 5-8 7-8 6-7 5-8 7-7 6-7 6-8 7-7 7-7 6-7 7-7 7-7 7-7 8-6 7-7 8-6 7-11 15-5 8-5 8-8 17-5 18 1 10 2 9 3 8 4 9 4 8 5 9 4 8 10 15 6 8 6 8 6 7 7 7 7 8 7 6 7 6 24 15q4 3 9 2 3-1 5-6l2-9 2-10 2-9 5-18 3-9 3-8 3-9 4-8 4-9 4-8 4-8 5-9 9-16 5-7 5-8 6-8 6-8 5-7 7-8 6-7 6-8 7-7 6-7 7-7 7-7 8-7 7-6 7-7 8-6 7-6 8-6 8-6 7-5 8-6q4 1 5 4l-3 9-4 9-3 8-3 9-4 8-3 9-4 9-3 8-4 9-3 8-4 9-4 8-4 9-3 8-4 9-4 8-4 9-4 8-3 8-4 9-4 8-4 9-4 8-4 8-4 9-3 8-5 9-3 8-4 8-4 9-4 8-4 9-4 8-4 8-4 9-4 8-4 8-4 9-4 8-4 8-5 9-4 8-4 9-4 8-4 8-4 8-4 9-4 8-4 8-5 9-4 8-4 8-4 9-4 8-4 8-5 8-4 9-4 8-4 8-5 8-4 9-4 8-5 8-4 8-4 9-4 8-5 8-4 8-4 9-5 8-4 8-4 9-4 8-4 8-5 8-4 9-4 8-4 8-4 9-1 9 1 10 3 9 5 8 6 7 6 7 8 7 7 7 8 6 7 5 8 5 8 5 16 9 9 4 8 4 9 3 9 4 18 5 9 2 9 2 9 1 10 2h20l9-1 7-7 3-9 1-9 3-29 1-10 2-9 1-9 3-10 2-9 2-9 2-9 3-9 2-9 3-9 6-17 3-9 3-9 3-9 3-8 3-9 4-9 3-8 3-9 4-8 3-9 4-9 4-8 3-8 4-9 4-8 4-9 4-8 4-9 4-8 8-16 5-9 4-8 4-8 5-8q4-2 8-1l6 7 8 7 7 4a110 110 0 0 0 37 10h10l9-1 19-2 10-1 9-2 9-2 10-2 9-2 9-2 9-3 9-2 9-3 9-2 9-3 9-2 9-3 17-6 9-3 9-3 8-3 9-4 9-3 8-3 9-4 9-4 8-3 8-4 9-4 8-3 9-5 8-4 9-4 8-4 8-4 8-5 8-4 8-5 8-5 8-5 8-6 8-5 30-23 8-7 7-7 7-6 6-7 8-7 12-15 6-8 5-8 6-8 17-32 4-9 3-9 3-8 2-10 3-9 3-18 1-10 1-9 1-10v-10l-1-10v-10l-1-9-1-10-2-9-2-9-2-9-2-10-3-8-3-9-3-9-4-8-4-9-3-8-5-8-5-9-5-8-5-7-6-8-6-8-13-14-7-6-8-7-7-6-8-6-8-5-8-5-8-5-16-8-9-4-9-3-8-3-9-3-9-3-9-2-9-3-9-2-9-1-10-2-9-1-10-2h-10l-9-1-10-1zm14 86 10-1h10l10 1h9l10 2 9 1a161 161 0 0 1 36 12l8 4 8 4 8 6 7 5 8 8 7 7 5 7 6 8 4 8 5 9 3 8 2 9 2 9 3 30-1 9-1 10-2 9-2 9-2 9-4 9-3 9-4 8-4 8-5 8-4 8-11 16-6 8-6 8-5 7-7 8-6 7-6 7-7 7-8 8-7 7-7 7-7 6-7 7-8 7-7 5-8 7-7 6-8 6-8 6-7 5-8 6-8 5-8 6-7 5-8 5-8 5-8 5-8 4-9 5-8 5-8 4-8 4-9 4-8 4-9 3-8 4-9 3-9 3-9 2-9 3-10 1-9 1-20-1-9-2-7-5q-1-4 2-9l4-8 4-8 5-9 4-8 4-9 4-8 4-8 4-8 4-9 4-8 4-8 5-9 4-8 4-8 4-9 4-8 4-8 5-9 4-8 8-17 3-8 5-9 3-8 4-9 3-8 3-9 1-10 1-9-1-10-6-17-10-16-7-8-6-7-8-7-7-7-7-5-8-6-8-6-8-5-7-5-9-5-8-5-8-5-8-4q-1-3 1-8l8-5 8-5 8-5 8-4 8-4 9-5 8-4 17-8 8-3 9-4 9-3 8-3 9-3 9-3 9-2 9-3 9-2 9-2 10-2 9-2 9-1 10-2 9-1 10-1z"
			/>
		</symbol>{/if}
</svg>
