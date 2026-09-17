# SvelteKit + Contentful: levantamento de fatos

Pesquisa feita em 2026-09-17. Fonte primária: Context7 MCP sobre a doc oficial
(`svelte.dev/docs/kit`, `svelte.dev/docs/svelte`, `contentful.js`), complementada por
consultas diretas ao registro npm (`npm view`) e ao GitHub para datas de versão.

Contexto do alvo: página única, estática, só em inglês, conteúdo vindo do Contentful em
build time. Este documento levanta fatos; a decisão de adapter é do ticket 05.

---

## 1. Versões atuais de Svelte e SvelteKit, e o que mudou que importa

Versões publicadas no npm em 2026-09-17 (via `npm view <pkg> version`):

| Pacote | Versão |
| --- | --- |
| `svelte` | `5.57.0` |
| `@sveltejs/kit` | `2.70.3` |
| `@sveltejs/vite-plugin-svelte` | `7.3.0` |
| `@sveltejs/adapter-static` | `3.0.10` |
| `@sveltejs/adapter-vercel` | `6.3.4` |
| `@sveltejs/adapter-auto` | `7.0.1` |
| `vite` | `8.3.0` |
| `contentful` | `11.12.10` |

Ou seja: **Svelte 5 e SvelteKit 2** são as linhas correntes. Não existe "SvelteKit 3"; o
SvelteKit ficou em `2.x` enquanto o Svelte pulou para `5.x`, o que confunde quem chega de
fora. Um projeto novo hoje nasce em Svelte 5 + SvelteKit 2.

### 1.1 Runes (Svelte 5)

O Svelte 5 troca a reatividade implícita por *runes*, símbolos com `$` que o compilador
reconhece ([guia de migração v5](https://svelte.dev/docs/svelte/v5-migration-guide)):

- `let count = 0` deixa de ser reativo por si só; passa a ser `let count = $state(0)`.
  A variável continua sendo lida e escrita diretamente, sem `.value`.
- `export let foo` some; props vêm por desestruturação de `$props()`:
  `let { optional = 'unset', required } = $props()`. Renomear, rest e forward viram
  sintaxe JS padrão: `let { class: klass, ...rest } = $props()`.
- `$derived` substitui `$: x = ...` para valores derivados e `$effect` substitui
  `$: { ... }` para efeitos colaterais.
- `<slot>` nomeados são substituídos por *snippets* passados como props e renderizados com
  `{@render header()}` ([mesma página](https://svelte.dev/docs/svelte/v5-migration-guide)).
- Eventos passam a ser atributos: `onclick` em vez de `on:click`.

O Svelte 5 mantém **legacy mode**: componentes escritos em sintaxe 3/4 continuam
funcionando, e um componente entra em *runes mode* assim que usa uma rune ou recebe a
opção de compilador `runes: true` — momento em que as features legadas ficam desabilitadas
*naquele* componente ([legacy overview](https://svelte.dev/docs/svelte/legacy-overview)).
Para um projeto novo isso é irrelevante na prática: escreva tudo em runes desde o início.

### 1.2 Mudanças do SvelteKit 2 que valem saber

Da [página de migração para o SvelteKit 2](https://svelte.dev/docs/kit/migrating-to-sveltekit-2):

- `error()` e `redirect()` **não são mais lançados por você**: basta chamar
  `error(500, 'something went wrong')`, sem `throw`.
- `cookies.set()`, `cookies.delete()` e `cookies.serialize()` exigem `path` explícito.
- **Promises de topo não são mais aguardadas automaticamente** no retorno de `load`. Se
  você retorna `{ data: fetchData() }` e quer bloquear, precisa de `await` explícito; para
  várias, `Promise.all` para não criar waterfall. Isso é uma pegadinha real ao portar
  código de tutoriais antigos.
- `resolvePath` foi substituído por `resolveRoute` (e este já inclui `base`, então não se
  prefixa `base` manualmente).
- Requisitos mínimos declarados na migração: Node.js `>= 18.13`, `svelte@4`, `vite@5`,
  `typescript@5`, `@sveltejs/vite-plugin-svelte@3`. Esses são os mínimos do 2.0; as versões
  atuais dos pacotes (tabela acima) estão bem acima disso. **NÃO CONFIRMADO:** a doc não
  lista, numa tabela única e atualizada, os mínimos exigidos por `@sveltejs/kit@2.70.x`
  especificamente — a página de migração fala dos mínimos do salto 1.x → 2.0.
- `$app/stores` deu lugar a `$app/state` a partir de SvelteKit 2.12 com Svelte 5:
  `import { page } from '$app/state'` e uso direto `page.data` (sem o `$` de store)
  ([load / $app/state](https://svelte.dev/docs/kit/load)).

Não há mudança de *sistema de rotas* no 2.x: continua sendo roteamento por sistema de
arquivos em `src/routes/` com os arquivos `+page.svelte`, `+page.ts`, `+page.server.ts`,
`+layout.svelte`, `+server.ts`
([project structure](https://svelte.dev/docs/kit/project-structure),
[routing](https://svelte.dev/docs/kit/routing)).

---

## 2. Fetch em build time: `+page.server.ts` vs `+page.ts`, e como garantir prerender total

### 2.1 Qual dos dois roda no build

Os dois rodam no build, **desde que a rota esteja marcada como prerenderizável**. A
diferença não é "quem roda no build", é *onde mais* a função pode rodar:

- `+page.server.ts` exporta um `load` que **só roda no servidor** — é onde você pode
  acessar banco de dados e variáveis de ambiente privadas. O retorno precisa ser
  serializável por `devalue`, porque ele é enviado ao cliente para navegações subsequentes
  ([routing / +page.server.js](https://svelte.dev/docs/kit/routing)).
- `+page.ts` exporta um `load` *universal*: roda no servidor na primeira renderização e
  **também no navegador** em navegações client-side ([load](https://svelte.dev/docs/kit/load)).

Para conteúdo de Contentful puxado em build time, `+page.server.ts` é o lugar correto,
porque o token de delivery entra por `$env/static/private` e nunca pode vazar para o
bundle do cliente. Numa página 100% prerenderizada o `load` universal *também* rodaria só
no build (não há navegação client-side numa página única), mas o token ainda assim não
poderia ser importado ali: `$env/static/private` **não pode ser importado em código de
cliente** ([$env/static/private](https://svelte.dev/docs/kit/%24env-static-private)), e o
SvelteKit falha o build com a mensagem "Cannot import $lib/server/… into code that runs in
the browser" quando detecta a cadeia de import
([server-only modules](https://svelte.dev/docs/kit/server-only-modules)).

Durante o build, `building` de `$app/environment` é `true` — inclusive durante o
prerender. A doc é explícita: o SvelteKit **carrega e executa** seus arquivos
`+page/layout(.server).js` (e tudo que eles importam) para análise durante o build, e
qualquer código que não deva rodar nessa etapa precisa checar `building`
([building your app](https://svelte.dev/docs/kit/building-your-app)). Isso significa que
imports de topo no seu módulo de Contentful *serão avaliados* no build.

### 2.2 Como garantir prerender total

Três camadas, e vale usar todas:

1. **Page option.** `export const prerender = true` em `+page.ts`, `+page.server.ts` ou
   `+server.ts`. Colocando em um layout raiz (`+layout.ts` / `+layout.server.ts`), todas as
   rotas abaixo são prerenderizadas exceto as que marcarem `prerender = false`. Existe
   ainda `prerender = 'auto'`, que prerenderiza mas mantém a rota no manifesto para
   renderização dinâmica ([page options](https://svelte.dev/docs/kit/page-options)).

2. **Crawler + entries.** O prerenderer começa na raiz e varre `<a>` para descobrir outras
   páginas prerenderizáveis. Quando um destino não é alcançável por link (tipicamente rotas
   com `[parameters]`), ele precisa ser declarado em `config.kit.prerender.entries` no
   `svelte.config.js` ou por uma função `entries()` exportada da rota dinâmica
   ([page options](https://svelte.dev/docs/kit/page-options)):

   ```javascript
   /** @type {import('./$types').EntryGenerator} */
   export function entries() {
       return [{ slug: 'hello-world' }, { slug: 'another-blog-post' }];
   }

   export const prerender = true;
   ```

   Para uma página única em `/`, o crawler resolve sozinho e nada disso é necessário.

3. **Config do `kit.prerender`.** O tipo, conforme a
   [referência de configuração](https://svelte.dev/docs/kit/configuration):

   ```typescript
   prerender?: {
       concurrency?: number;
       crawl?: boolean;
       entries?: Array<"*" | `/${string}`>;
       handleHttpError?: PrerenderHttpErrorHandlerValue;
       handleMissingId?: PrerenderMissingIdHandlerValue;
       handleEntryGeneratorMismatch?: PrerenderEntryGeneratorMismatchHandlerValue;
       handleUnseenRoutes?: PrerenderUnseenRoutesHandlerValue;
       handleInvalidUrl?: PrerenderInvalidUrlHandlerValue;
       origin?: string;
   } | undefined
   ```

   `handleUnseenRoutes` controla exatamente o erro "The following routes were marked as
   prerenderable, but were not prerendered"
   ([configuration](https://svelte.dev/docs/kit/configuration)).

### 2.3 O que impede o prerender

Da seção ["When not to prerender"](https://svelte.dev/docs/kit/page-options):

- A regra base: dois usuários quaisquer batendo direto na página têm que receber o mesmo
  conteúdo do servidor.
- **Páginas com form actions não podem ser prerenderizadas**, porque um servidor precisa
  tratar o `POST`.
- **Acessar `url.searchParams` durante prerender é proibido**; se precisar, só no browser
  (`onMount`).
- Com `adapter-static`, `ssr` não pode ser `false`, senão o prerender produz uma casca
  vazia ([adapter-static](https://svelte.dev/docs/kit/adapter-static)).

Detalhe útil: uma rota `+server.js` herda o status de prerender da página que a consome via
`fetch` no `load` ([page options](https://svelte.dev/docs/kit/page-options)) — então
endpoints JSON internos também são materializados como arquivos no build.

---

## 3. Adapters: `adapter-static`, `adapter-vercel`, `adapter-auto`

### 3.1 `adapter-static`

Gera arquivos estáticos servíveis por qualquer webserver. Opções e defaults, direto da
[doc do adapter-static](https://svelte.dev/docs/kit/adapter-static):

```javascript
import adapter from '@sveltejs/adapter-static';

/** @type {import('@sveltejs/kit').Config} */
const config = {
    kit: {
        adapter: adapter({
            pages: 'build',
            assets: 'build',
            fallback: undefined,
            precompress: false,
            strict: true
        })
    }
};

export default config;
```

A doc avisa dois pontos na mesma página: ajustar `trailingSlash` conforme o host, e não
deixar `ssr: false`, senão o prerender gera casca vazia.

**Revalidação:** não existe. O conteúdo é o que foi gerado no build; atualizar o conteúdo
do Contentful exige um novo build (tipicamente disparado por webhook do Contentful para o
CI/host).

**O que quebra com `adapter-static` numa rota única totalmente prerenderizada:** na
prática, nada. Esse é exatamente o caso de uso citado pela doc de page options ("If your
entire app is suitable for prerendering, you can use `adapter-static`"). O que você perde é
capacidade, não estabilidade:

- Nada de form actions (já proibidas em rota prerenderizada de qualquer forma).
- Nada de `+server.js` dinâmico em runtime — endpoints só existem se forem prerenderizados
  para arquivo.
- Nada de `$env/dynamic/private` em runtime: a doc de `$env/dynamic/private` diz que, em
  produção, o `.env` só é incluído se `$env/static/private` **não** for usado no projeto, e
  o módulo não pode ser importado em código de cliente
  ([$env/dynamic/private](https://svelte.dev/docs/kit/%24env-dynamic-private)). Num site
  estático não há processo servidor para ler env em runtime.
- `strict: true` (default) faz o build **falhar** se alguma rota ficar sem ser
  prerenderizada, o que é desejável aqui: é a rede de segurança que garante que o site é
  realmente 100% estático.
- Se você quiser SPA fallback (não é o caso aqui), usa-se `fallback: '200.html'`
  ([single-page apps](https://svelte.dev/docs/kit/single-page-apps)).

### 3.2 `adapter-vercel`

Da [doc do adapter-vercel](https://svelte.dev/docs/kit/adapter-vercel), as opções aplicáveis
a todas as funções:

- `runtime`: `'edge'`, `'nodejs20.x'` ou `'nodejs22.x'`. Por padrão o adapter escolhe o
  `nodejs<version>.x` correspondente à versão de Node configurada no dashboard da Vercel.
  **A própria doc marca essa opção como deprecada**, a ser removida numa versão futura,
  quando todas as funções passarão a usar a versão de Node do projeto na Vercel.
- `regions`: array de regiões (default `["iad1"]` para serverless) ou `'all'` para edge.
  Múltiplas regiões em serverless só em plano Enterprise.
- `split`: `true` faz a rota virar função própria; no nível do adapter, todas as rotas.
- Só para edge: `external` (deps que o esbuild trata como externas).
- Só para serverless: `memory` (default `1024` MB, de `128` a `3008` em incrementos de
  64 MB em Pro/Enterprise), `maxDuration` (default `10` s em Hobby, `15` em Pro, `900` em
  Enterprise) e `isr`.

Config em um layout se aplica a todas as rotas abaixo, salvo override mais granular.

Também suporta otimização de imagem da Vercel via `images` no `svelte.config.js`:

```javascript
import adapter from '@sveltejs/adapter-vercel';

/** @type {import('@sveltejs/kit').Config} */
const config = {
    kit: {
        adapter: adapter({
            images: {
                sizes: [640, 828, 1200, 1920, 3840],
                formats: ['image/avif', 'image/webp'],
                minimumCacheTTL: 300,
                domains: ['example-app.vercel.app'],
            }
        })
    }
};
```

**ISR: sim, é suportado.** Configura-se por rota, exportando `config.isr`
([adapter-vercel](https://svelte.dev/docs/kit/adapter-vercel)):

```javascript
import { BYPASS_TOKEN } from '$env/static/private';

/** @type {import('@sveltejs/adapter-vercel').Config} */
export const config = {
    isr: {
        expiration: 60,
        bypassToken: BYPASS_TOKEN,
        allowQuery: ['search']
    }
};
```

`expiration` é obrigatório; o resto é opcional. Duas advertências literais da doc:

> Use ISR only on routes where every visitor should see the same content (much like when
> you prerender). If there's anything user-specific happening (like session cookies), they
> should happen on the client via JavaScript only to not leak sensitive information across
> visits

> Using ISR on a route with `export const prerender = true` will have no effect, since the
> route is prerendered at build time

**Este é o ponto que decide o ticket 05:** ISR e `prerender = true` são mutuamente
exclusivos na mesma rota. Ou a página é materializada no build (e revalidar = rebuildar),
ou ela é uma função serverless com cache ISR (e revalida sozinha a cada `expiration`
segundos, com `bypassToken` para purge sob demanda) — mas aí o SDK do Contentful roda em
*runtime*, não em build, e o token de delivery passa a ser um segredo de runtime.

### 3.3 `adapter-auto`

Da [doc do adapter-auto](https://svelte.dev/docs/kit/adapter-auto): é o default de um
projeto novo e detecta o ambiente de deploy, cobrindo Cloudflare Pages, Netlify, Vercel,
Azure Static Web Apps, AWS via SST e Google Cloud Run. A doc recomenda substituí-lo pelo
adapter específico assim que a plataforma estiver decidida, para que ele entre no lockfile
e o CI instale mais rápido.

Limitação dura: **`adapter-auto` não aceita nenhuma opção.** A doc é literal — "To add
configuration options, such as `{ edge: true }` in `adapter-vercel` and `adapter-netlify`,
you must install the underlying adapter — `adapter-auto` does not take any options". Logo,
com `adapter-auto` não dá para configurar `images`, `regions`, `memory` nem nada do
adapter-vercel. O `isr` por rota é exportado da própria rota, não do adapter —
**NÃO CONFIRMADO** se `config.isr` numa rota funciona sob `adapter-auto` resolvendo para
Vercel; a doc não trata desse caso.

### 3.4 Resumo de revalidação por adapter

| Adapter | Como o conteúdo se atualiza |
| --- | --- |
| `adapter-static` | Só com novo build. Sem runtime. |
| `adapter-vercel` + `prerender = true` | Só com novo build (ISR não tem efeito). |
| `adapter-vercel` + `isr.expiration` | Revalida em runtime a cada N segundos; purge via `bypassToken`. Contentful é consultado em runtime. |
| `adapter-auto` | Herda o comportamento do adapter que ele resolver, sem poder configurá-lo. |

---

## 4. O SDK `contentful` dentro de um build SvelteKit

**Funciona direto, sem wrapper nem shim.** Fatos:

- A partir da v11, o pacote declara `"type": "module"` no `package.json` (ESM por padrão) e
  mantém suporte a CJS pelo campo `exports`
  ([MIGRATION.md, seção "Module support and package configuration"](https://github.com/contentful/contentful.js/blob/master/MIGRATION.md)).
  Confirmado no registro (`npm view contentful exports`):

  ```
  { '.': { types: './dist/types/index.d.ts',
           import: './dist/esm/index.js',
           require: './dist/contentful.cjs' } }
  ```

  Ou seja, o dual-package está resolvido corretamente e o Vite/Rollup pega a entrada ESM.
- `engines` declara `node: '>=18'` (`npm view contentful engines`). Compatível com o mínimo
  do SvelteKit 2 (Node 18.13) e com o Node 22 local.
- Import padrão ESM, como já é feito no site Next.js atual
  ([ADVANCED.md](https://github.com/contentful/contentful.js/blob/master/ADVANCED.md)):

  ```javascript
  import { createClient } from "contentful";
  const client = createClient({...});
  ```

Pegadinhas específicas de SvelteKit (não do SDK):

1. **Só importe em código de servidor.** O `createClient` e o token precisam viver em
   `+page.server.ts` ou em um módulo sob `src/lib/server/`. O SvelteKit tem detecção
   estática de *server-only modules*: qualquer cadeia de import que leve código de
   navegador até `$lib/server/*` falha o build com a mensagem listando a cadeia
   ([server-only modules](https://svelte.dev/docs/kit/server-only-modules)). Isso é
   proteção, não obstáculo.
2. **Imports de topo são avaliados no build.** Como o SvelteKit executa os arquivos
   `+page(.server).js` e tudo que eles importam durante a análise de build
   ([building your app](https://svelte.dev/docs/kit/building-your-app)), se você criar o
   client no escopo de módulo, ele é criado no build. Se algo não deve rodar ali, use a
   guarda `if (!building) { ... }` com `building` de `$app/environment`.
3. **Credenciais.** `import { CONTENTFUL_DELIVERY_TOKEN } from '$env/static/private'`
   — variáveis injetadas estaticamente no build; o módulo não pode ser importado em código
   de cliente ([$env/static/private](https://svelte.dev/docs/kit/%24env-static-private)).
   Para um build estático essa é a escolha certa (o valor é consumido em build time e não
   precisa existir em runtime).
4. **Serialização.** O retorno de `load` de `+page.server.ts` precisa ser serializável por
   `devalue` ([routing](https://svelte.dev/docs/kit/routing)). As respostas do Contentful
   são JSON simples, com uma ressalva: objetos `Date`... — o SDK devolve datas como
   *strings* ISO em `sys.createdAt`/`sys.updatedAt`, então não há problema. Ainda assim,
   o padrão recomendado (e o que o site Next.js atual já faz em `lib/contentfulContent.ts`)
   é **normalizar a resposta para tipos próprios do domínio** antes de retornar, em vez de
   entregar a árvore crua do Contentful ao componente. Isso reduz o payload embutido no
   HTML prerenderizado.

**NÃO CONFIRMADO:** não encontrei, nem na doc do SvelteKit nem na do contentful.js,
qualquer nota sobre incompatibilidade entre os dois. Não há guia oficial "Contentful +
SvelteKit" da Contentful — os tutoriais oficiais cobrem Next.js, Gatsby, Angular, Nuxt.

---

## 5. Geração de tipos TypeScript a partir do modelo de conteúdo

### 5.1 O que o SDK já dá sem ferramenta nenhuma

O contentful.js v10+ foi reescrito em TypeScript e tipa as queries a partir de um
*entry skeleton* que você declara à mão
([TYPESCRIPT.md](https://github.com/contentful/contentful.js/blob/master/TYPESCRIPT.md)):

```typescript
import * as contentful from 'contentful'

type CategoryEntrySkeleton = {
  contentTypeId: 'category'
  fields: {
    categoryName: contentful.EntryFieldTypes.Text
  }
}

type ProductEntrySkeleton = {
  contentTypeId: 'product'
  fields: {
    productName: contentful.EntryFieldTypes.Text
    image: contentful.EntryFieldTypes.AssetLink
    price: contentful.EntryFieldTypes.Number
    categories: contentful.EntryFieldTypes.Array<
      contentful.EntryFieldTypes.EntryLink<CategoryEntrySkeleton>
    >
    location: contentful.EntryFieldTypes.Location
  }
}
```

Com o skeleton declarado, o SDK dá autocomplete nas chaves de query e tipa a resposta. Os
*chain modifiers* mudam o tipo do retorno: `client.withoutUnresolvableLinks.getEntries()`
remove do tipo os links não resolvíveis (entrada apagada ou não publicada);
`client.withoutLinkResolution.withAllLocales.getEntries()` muda a forma para "todos os
locales" ([README.md](https://github.com/contentful/contentful.js/blob/master/README.md),
[TYPESCRIPT.md](https://github.com/contentful/contentful.js/blob/master/TYPESCRIPT.md)).
A [doc oficial](https://www.contentful.com/developers/docs/sdks/javascript/tutorials/typescript-in-javascript-client-library)
diz que definir a shape do content type é o primeiro passo e que "it is recommended to
automate this step by generating type definitions for your Contentful content models" —
mas **não nomeia a ferramenta** naquela página.

### 5.2 Ferramentas

- **`cf-content-types-generator`** — o que mais se aproxima de padrão. Vive em
  [`contentful-userland/cf-content-types-generator`](https://github.com/contentful-userland/cf-content-types-generator),
  MIT, CLI `cf-content-types-generator [FILE]` com `-o` (saída), `-s` (space), `-t`
  (management token), `-e` (environment). Gera tipos no formato `EntrySkeletonType` do
  contentful.js v10+, e não o padrão antigo `Entry<TypeFields>`. Estado em 2026-09-17:
  versão `3.0.1` publicada no npm, `time.modified` de 2026-04-01; último commit no repo em
  2026-06-30. **É comunidade, não Contentful oficial** — a org `contentful-userland` é
  explicitamente userland. Não há marca de deprecated nem de experimental.
- **`contentful-typescript-codegen`** — `3.4.0`, `time.modified` 2026-06-10. Alternativa
  mais antiga; gera interfaces no estilo pré-v10. **NÃO CONFIRMADO** se já emite o formato
  `EntrySkeletonType` exigido pelo contentful v11.
- **`contentful-cli`** (`4.0.10`) — **não** gera tipos TypeScript. O README lista export,
  import, migrations, geração de *migration scripts*, seed e extensions; não há comando de
  geração de tipos. (O PHP SDK tem `generate:entry-classes`, mas isso é outro ecossistema.)

### 5.3 Vale a pena para um modelo de ~2 content types?

Fato, não opinião: para 2 content types, o skeleton escrito à mão tem talvez 20–40 linhas
de TypeScript, contra adicionar uma devDependency de terceiros, um *management token*
(escopo maior que o de delivery) no ambiente de build/dev, e um passo de geração que
precisa ser re-rodado e versionado. O ganho de automação cresce com o número de content
types e com a frequência de mudança do modelo. O time do Contentful só recomenda
"automatizar" genericamente, sem prescrever ferramenta.

Caminho intermediário, se quiser garantir que os tipos não divirjam do modelo: escrever os
skeletons à mão e manter o modelo versionado nas migrations (o repositório irmão já tem
`contentful/migrations/`), tratando a migration como fonte de verdade.

---

## 6. Fontes variáveis em SvelteKit: self-host e preload sem FOUT

### 6.1 O que o SvelteKit faz e não faz

Da [página de performance](https://svelte.dev/docs/kit/performance), seção "Fonts":

> SvelteKit automatically preloads critical `.js` and `.css` files when the user visits a
> page, but it does *not* preload fonts by default, since this may cause unnecessary files
> (such as font weights that are referenced by your CSS but not actually used on the
> current page) to be downloaded.

A doc então aponta dois caminhos: o filtro `preload` no hook `handle`, e subsetting das
fontes.

### 6.2 Preload via hook `handle`

O `resolve` do hook `handle` aceita um segundo parâmetro com, entre outros,
`preload(input: { type: 'js' | 'css' | 'font' | 'asset', path: string }): boolean`
([hooks](https://svelte.dev/docs/kit/hooks)):

```javascript
/// file: src/hooks.server.js
/** @type {import('@sveltejs/kit').Handle} */
export async function handle({ event, resolve }) {
    const response = await resolve(event, {
        transformPageChunk: ({ html }) => html.replace('old', 'new'),
        filterSerializedResponseHeaders: (name) => name.startsWith('x-'),
        preload: ({ type, path }) => type === 'js' || path.includes('/important/')
    });

    return response;
}
```

Detalhes que a doc de hooks explicita e que importam aqui:

- Os arquivos preloadados entram como `<link>` no `<head>`; se `output.linkHeaderPreload`
  estiver ligado, páginas renderizadas dinamicamente usam o header `Link` em vez disso.
- O método é chamado com cada arquivo encontrado **em build time** ao montar os chunks.
- **Em modo dev o `preload` não é chamado**, porque depende de análise que só existe no
  build. Ou seja: você não consegue verificar o preload rodando `npm run dev` — só em
  `vite build && vite preview`. Essa é a pegadinha número um aqui.
- Por padrão só `js` e `css` são preloadados; `asset` não é preloadado de forma alguma
  atualmente.

**NÃO CONFIRMADO explicitamente na doc:** que o hook `handle` (e portanto o filtro
`preload`) roda durante o *prerender*, fazendo os `<link rel="preload">` ficarem gravados
no HTML estático. É o comportamento esperado — o prerender renderiza as páginas passando
pelo servidor, e a doc diz que os `<link>` vão para o `<head>` — mas não achei uma frase
que afirme isso para o caso prerenderizado. **Verificar empiricamente** inspecionando o
`build/index.html` gerado.

### 6.3 Caminho mais direto e determinístico para uma página única

Para este projeto (rota única, estática), o caminho com menos partes móveis é não depender
do filtro `preload` e escrever as tags à mão:

1. Colocar os `.woff2` em `static/fonts/`. Arquivos em `static/` são servidos **como
   estão**, sem hashing de nome ([project structure](https://svelte.dev/docs/kit/project-structure)),
   o que dá um caminho estável para escrever no HTML. Fontes importadas via CSS de
   `node_modules` passam pelo pipeline do Vite e **ganham hash no nome**, o que impede
   escrever um `<link rel="preload">` estável em `src/app.html`.
2. Declarar `@font-face` próprio no CSS global, com `font-display` e o range de peso do
   eixo variável.
3. Pôr o `<link rel="preload" as="font" type="font/woff2" crossorigin>` direto em
   `src/app.html`, usando `%sveltekit.assets%` como prefixo — ou `asset()` de
   `$app/paths`, que resolve a URL de um arquivo do `static` prefixando com
   `config.kit.paths.assets` ou com o base path ([$app/paths](https://svelte.dev/docs/kit/%24app-paths)).

### 6.4 Eixos variáveis e meio-pesos (450/460/550)

Isso é CSS puro, não específico de SvelteKit, e funciona desde que o `@font-face` declare o
range. Verificado no pacote `@fontsource-variable/inter` já instalado no site irmão
(`node_modules/@fontsource-variable/inter/index.css`):

```css
@font-face {
  font-family: 'Inter Variable';
  font-style: normal;
  font-display: swap;
  font-weight: 100 900;
  src: url(./files/inter-cyrillic-ext-wght-normal.woff2) format('woff2-variations');
  unicode-range: U+0460-052F,U+1C80-1C8A,U+20B4,U+2DE0-2DFF,U+A640-A69F,U+FE2E-FE2F;
}
```

Pontos concretos:

- `font-weight: 100 900` é o range do eixo `wght`. Com isso, `font-weight: 450`,
  `460` e `550` são valores válidos e resolvidos pelo eixo — não há fallback para 400 ou
  500 sintético. Os meio-pesos que a hierarquia tipográfica quer estão disponíveis.
- O pacote quebra a fonte em vários `@font-face` por `unicode-range` (latin, latin-ext,
  cyrillic, greek, vietnamese...). O browser só baixa os subsets efetivamente usados —
  para um site só em inglês, só o `latin`. **Mas isso complica o preload:** você precisa
  preloadar o arquivo `*-latin-wght-normal.woff2` especificamente, não o "pacote". Mais um
  argumento para copiar só o subset latino para `static/fonts/` e escrever o `@font-face` à
  mão.
- Os exports do pacote v5 (`npm view @fontsource-variable/inter`, e o `package.json`
  instalado) expõem `index.css`, `wght.css`, `standard.css`, `opsz.css` e variantes
  itálicas, além de `./files/*.woff2` — **mas não há um CSS por subset** para os pacotes
  variable. Todos os arquivos CSS contêm todos os subsets, separados por `unicode-range`.
  Copiar o `.woff2` latino direto de `node_modules/@fontsource-variable/<fonte>/files/`
  para `static/fonts/` é o caminho para ter nome de arquivo estável.
- `font-display: swap` (o default do Fontsource) troca FOIT por FOUT. Para *eliminar* o
  FOUT, e não só encurtá-lo, as opções são `font-display: optional` (o browser desiste da
  fonte se ela não chegar a tempo, sem reflow — mas às vezes a primeira visita renderiza na
  fallback) ou `font-display: block` com preload (FOIT curto em vez de FOUT). Não há
  mecanismo do SvelteKit que resolva isso; é decisão de CSS. A doc do SvelteKit se limita a
  recomendar preload + subsetting ([performance](https://svelte.dev/docs/kit/performance)).
- Subsetting mais agressivo (só os glifos usados) reduz mais ainda; a doc de performance
  recomenda explicitamente, sem prescrever ferramenta.

Ferramenta relacionada: `@sveltejs/enhanced-img` (`0.11.0`) existe para imagens, não para
fontes — não ajuda aqui.

---

## 7. Outras pegadinhas para quem vem do Next.js App Router

Nenhuma delas é bug; são diferenças de modelo que custam tempo na primeira semana.

1. **Não existe `'use client'` / `'use server'`.** A fronteira é o *nome do arquivo*:
   `.server.ts` é só servidor, o resto é universal, e `src/lib/server/` é blindado por
   análise estática de imports ([server-only modules](https://svelte.dev/docs/kit/server-only-modules)).
   Não há "Server Components": todo componente `.svelte` é renderizado no servidor **e**
   hidratado no cliente (salvo `csr = false`).

2. **`load` não é `fetch` dentro do componente.** Os dados vêm por uma prop `data`, não por
   `await` no corpo do componente ([load](https://svelte.dev/docs/kit/load)):

   ```svelte
   <script lang="ts">
       import type { PageProps } from './$types';
       let { data }: PageProps = $props();
   </script>

   <p>{data.a} + {data.b} = {data.c}</p>
   ```

3. **Layouts recebem o filho como *snippet*, não como prop `children` de React.** Precisa
   de `{@render children()}` ([load](https://svelte.dev/docs/kit/load)):

   ```svelte
   <script>
       /** @type {import('./$types').LayoutProps} */
       let { data, children } = $props();
   </script>

   <main>{@render children()}</main>
   ```

4. **Tipos gerados por rota em `./$types`.** `PageProps`, `LayoutProps`, `PageServerLoad`,
   `EntryGenerator` vêm de `import type { ... } from './$types'` — gerados pelo SvelteKit,
   não escritos à mão. Se o editor reclamar que `./$types` não existe, é porque o
   `svelte-kit sync` ainda não rodou.

5. **Promises de topo em `load` não são mais aguardadas** (ver §1.2). Vindo do App Router,
   onde `await` é a norma, isso silenciosamente entrega uma Promise ao componente.

6. **`$app/state` e não `$app/stores`** em Svelte 5 / SvelteKit ≥ 2.12: `page.data`, sem o
   `$` de store ([migrating-to-sveltekit-2](https://svelte.dev/docs/kit/migrating-to-sveltekit-2)).

7. **ISR não é a mesma abstração que o `revalidate` do Next.** No Next, `revalidate` e
   geração estática convivem na mesma rota. No adapter-vercel do SvelteKit, `isr` numa rota
   com `prerender = true` **não tem efeito nenhum** ([adapter-vercel](https://svelte.dev/docs/kit/adapter-vercel)).
   É um ou outro.

8. **Prerender é por crawling, não por `generateStaticParams`.** O prerenderer segue `<a>`
   a partir da raiz; rotas dinâmicas não alcançáveis por link precisam de `entries()` ou de
   `kit.prerender.entries` ([page options](https://svelte.dev/docs/kit/page-options)).
   Para uma página única isso é não-evento, mas é bom saber antes de adicionar uma segunda
   rota.

9. **`static/` não é exatamente `public/`.** É o mesmo conceito (servido verbatim), mas o
   acesso idiomático é `asset('/potato.jpg')` de `$app/paths`, que respeita
   `config.kit.paths.assets` e o base path ([$app/paths](https://svelte.dev/docs/kit/%24app-paths)).

10. **`trailingSlash` importa para o host.** A doc do adapter-static pede explicitamente
    para ajustar conforme o host ([adapter-static](https://svelte.dev/docs/kit/adapter-static)).
    Vindo do Next/Vercel, onde isso é transparente, é fácil esquecer.

11. **O filtro `preload` não roda em dev** (ver §6.2) — qualquer verificação de performance
    de fontes tem que ser feita em `vite build` + `vite preview`.

12. **`inlineStyleThreshold`** existe no `kit` para inlinar CSS no HTML
    ([configuration](https://svelte.dev/docs/kit/configuration); exemplo de uso com
    `Infinity` na [doc de SEO/AMP](https://svelte.dev/docs/kit/seo)). Para uma página única
    estática, inlinar o CSS crítico elimina um round-trip — vale considerar, mas medir.

---

## Fontes

- SvelteKit — page options / prerendering: https://svelte.dev/docs/kit/page-options
- SvelteKit — load: https://svelte.dev/docs/kit/load
- SvelteKit — routing: https://svelte.dev/docs/kit/routing
- SvelteKit — configuration: https://svelte.dev/docs/kit/configuration
- SvelteKit — building your app: https://svelte.dev/docs/kit/building-your-app
- SvelteKit — adapter-static: https://svelte.dev/docs/kit/adapter-static
- SvelteKit — adapter-vercel: https://svelte.dev/docs/kit/adapter-vercel
- SvelteKit — adapter-auto: https://svelte.dev/docs/kit/adapter-auto
- SvelteKit — single-page apps: https://svelte.dev/docs/kit/single-page-apps
- SvelteKit — hooks: https://svelte.dev/docs/kit/hooks
- SvelteKit — performance: https://svelte.dev/docs/kit/performance
- SvelteKit — server-only modules: https://svelte.dev/docs/kit/server-only-modules
- SvelteKit — $env/static/private: https://svelte.dev/docs/kit/%24env-static-private
- SvelteKit — $env/dynamic/private: https://svelte.dev/docs/kit/%24env-dynamic-private
- SvelteKit — $app/paths: https://svelte.dev/docs/kit/%24app-paths
- SvelteKit — project structure: https://svelte.dev/docs/kit/project-structure
- SvelteKit — migrating to SvelteKit 2: https://svelte.dev/docs/kit/migrating-to-sveltekit-2
- Svelte — v5 migration guide: https://svelte.dev/docs/svelte/v5-migration-guide
- Svelte — legacy overview: https://svelte.dev/docs/svelte/legacy-overview
- contentful.js — README: https://github.com/contentful/contentful.js/blob/master/README.md
- contentful.js — TYPESCRIPT.md: https://github.com/contentful/contentful.js/blob/master/TYPESCRIPT.md
- contentful.js — ADVANCED.md: https://github.com/contentful/contentful.js/blob/master/ADVANCED.md
- contentful.js — MIGRATION.md: https://github.com/contentful/contentful.js/blob/master/MIGRATION.md
- Contentful — TypeScript in JavaScript client library: https://www.contentful.com/developers/docs/sdks/javascript/tutorials/typescript-in-javascript-client-library
- cf-content-types-generator: https://github.com/contentful-userland/cf-content-types-generator
