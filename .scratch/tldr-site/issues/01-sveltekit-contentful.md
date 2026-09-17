# SvelteKit + Contentful: o que é fato

Type: research
Status: resolved

## Question

O que exatamente o SvelteKit oferece hoje para uma página única, estática, cujo conteúdo vem do
Contentful em build time? Levantar fatos, não opiniões:

- Como se faz fetch em build time num `+page.server.ts` e como se garante prerender total
  (`export const prerender = true`, `svelte.config.js`).
- Quais adapters existem e o que cada um dá: `adapter-static`, `adapter-vercel` (ISR?),
  `adapter-auto`. Qual o comportamento real de revalidação em cada um.
- Como o SDK `contentful` (já usado no site atual) se comporta em build — precisa de algum
  wrapper, ou funciona direto?
- Geração de tipos TypeScript a partir do modelo do Contentful: o que existe e vale a pena.
- Fontes variáveis em SvelteKit: como servir e pré-carregar sem FOUT, já que a hierarquia
  tipográfica pode depender de meio-pesos (450/460/550).
- Qual a versão atual do Svelte e do SvelteKit, e o que mudou que eu preciso saber (runes).

Usar Context7 MCP como fonte primária. Registrar os achados em
`research/sveltekit-contentful.md` com links para a doc oficial.

Isto **não** decide o adapter — isso é o ticket 05. Aqui só se levantam os fatos que a decisão
precisa.

## Answer

Levantamento completo em [`research/sveltekit-contentful.md`](../../../research/sveltekit-contentful.md)
(caminho absoluto: `/home/felipe/Development/tldr-felipe-bueno/research/sveltekit-contentful.md`),
com link para a doc oficial em cada afirmação e marcações `NÃO CONFIRMADO` onde a doc é omissa.

**Versões (2026-09-17).** `svelte@5.57.0`, `@sveltejs/kit@2.70.3`, `adapter-static@3.0.10`,
`adapter-vercel@6.3.4`, `adapter-auto@7.0.1`, `vite@8.3.0`, `contentful@11.12.10`. Não existe
SvelteKit 3 — o Kit ficou em `2.x` enquanto o Svelte foi para `5.x`. Svelte 5 = runes:
`$state`, `$props()` no lugar de `export let`, `$derived`/`$effect`, snippets + `{@render}`
no lugar de `<slot>`, `onclick` no lugar de `on:click`. Legacy mode ainda existe mas é
irrelevante para projeto novo.

**Build-time fetching.** `+page.server.ts` (só servidor) é o lugar do Contentful; `+page.ts`
é universal e roda também no browser, então não pode ver `$env/static/private`. Prerender
total = `export const prerender = true` (no layout raiz cobre tudo abaixo) + `adapter-static`
com `strict: true` (default), que **falha o build** se alguma rota escapar. `kit.prerender`
aceita `entries`, `crawl`, `handleUnseenRoutes`, `origin` etc. Durante o build, `building`
de `$app/environment` é `true` e os módulos importados pelos `+page(.server)` **são
executados**. Bloqueios de prerender: form actions, `url.searchParams`, `ssr: false`.

**Contentful SDK.** Funciona direto, sem wrapper. v11 é `"type": "module"` com `exports`
dual (ESM + CJS), `engines: node >=18`. Restrições são do SvelteKit, não do SDK: só importar
em `.server.ts` / `src/lib/server/`, token via `$env/static/private`, retorno de `load`
serializável por `devalue` (normalizar para tipos de domínio, como o site Next.js já faz).

**Tipos TS.** O `contentful-cli` **não** gera tipos. A ferramenta é `cf-content-types-generator`
(`3.0.1`, org `contentful-userland` = comunidade, não oficial; último commit 2026-06-30),
que emite `EntrySkeletonType` do v10+. Para ~2 content types, o skeleton à mão custa 20–40
linhas contra uma devDependency + management token no ambiente de build.

**Fontes variáveis.** SvelteKit **não** preloada fontes por padrão. Existe o filtro
`preload` em `resolve()` no hook `handle` — mas ele **não roda em dev**, só após `vite build`.
Caminho mais determinístico: copiar só o `.woff2` do subset latino para `static/fonts/`
(servido sem hash, diferente de import via CSS de `node_modules`, que o Vite hasheia),
`@font-face` próprio, `<link rel="preload">` em `app.html`. Meio-pesos 450/460/550 funcionam:
o `@font-face` variable declara `font-weight: 100 900` no eixo `wght`.

### Impacto no ticket 05 (adapter)

O fato que decide: **`isr` numa rota com `export const prerender = true` não tem efeito
nenhum** (doc do `adapter-vercel`, textual). ISR e prerender são mutuamente exclusivos na
mesma rota. Ou o Contentful é lido em build (revalidar = rebuildar, tipicamente por webhook)
ou a rota vira função serverless com `isr.expiration` + `bypassToken`, e aí o SDK roda em
runtime e o delivery token vira segredo de runtime. Segundo fato: `adapter-auto` **não aceita
nenhuma opção** — sem `images`, `regions`, `memory`. Terceiro: com `adapter-static` numa rota
única totalmente prerenderizada nada quebra; perde-se capacidade (form actions, `+server.js`
dinâmico, `$env/dynamic/private` em runtime), não estabilidade.
