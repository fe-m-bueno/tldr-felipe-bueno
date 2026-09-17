import adapter from '@sveltejs/adapter-static';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

// A config do Kit vive aqui, não em svelte.config.js — desde o Kit 2.62 o plugin aceita
// as opções do namespace `kit` no mesmo nível. Quando ela está aqui, svelte.config.js é
// ignorado, então existe um lugar só.
export default defineConfig({
	plugins: [
		sveltekit({
			compilerOptions: {
				// Runes obrigatórias no projeto, menos em libs. Removível no Svelte 6.
				runes: ({ filename }) =>
					filename.split(/[/\\]/).includes('node_modules') ? undefined : true
			},
			// `strict: true` (padrão) faz o build falhar se alguma rota escapar do prerender.
			// É o alarme que garante que o site inteiro é HTML de CDN, sem função serverless.
			adapter: adapter({ strict: true })
		})
	]
});
