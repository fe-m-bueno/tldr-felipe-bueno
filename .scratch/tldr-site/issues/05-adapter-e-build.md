# Adapter e estratégia de revalidação

Type: grilling
Status: resolved
Blocked by: 01

## Question

`adapter-static` com rebuild disparado por webhook do Contentful, ou `adapter-vercel` com ISR?

A pergunta de verdade por trás disso: **com que frequência esse conteúdo muda?** Se você edita
duas vezes por ano, static + webhook é mais simples e mais rápido. Se você mexe toda semana, o
atrito de um rebuild começa a pesar.

Decidir também:

- Se há preview de rascunho (o site atual tem `CONTENTFUL_PREVIEW_TOKEN`). Uma página só de
  cartão de visita provavelmente não precisa — confirmar.
- O que acontece se o build falhar: o site fica no ar com a versão anterior, ou cai?
- Se o TLDR compartilha o `CONTENTFUL_DELIVERY_TOKEN` do site atual ou ganha o seu.

Depende dos fatos levantados no ticket 01.

## Nota do ticket 01 (resolvido) — a pergunta mudou

A doc do `adapter-vercel` diz que `isr` **não tem efeito** numa rota com `prerender = true`.
Os dois caminhos são mutuamente exclusivos, então a decisão não é "qual adapter" e sim:

- **Build-time fetch** (`adapter-static` ou `adapter-vercel` sem ISR, com `prerender = true`):
  o token de delivery só existe em build. Atualizar conteúdo = rebuild, disparado por webhook
  do Contentful.
- **Runtime** (`adapter-vercel` com `isr.expiration` + `bypassToken`, sem prerender): o SDK roda
  a cada revalidação e o `CONTENTFUL_DELIVERY_TOKEN` vira segredo de runtime na Vercel.

**Requisito novo do ticket 02:** a seção Writing precisa aparecer *sozinha* quando o primeiro
`blogPost` for publicado. Com build-time isso exige o webhook configurado — senão a seção nunca
aparece. Com ISR aparece na próxima expiração. Isso agora é critério de aceite desta decisão.

## Answer

**Estático com rebuild por webhook.** `adapter-static`, `export const prerender = true`,
`strict: true` (padrão) para o build falhar se alguma rota escapar do prerender.

### Por que, contra o precedente

O site completo usa ISR do Next (`revalidate: 60` em `lib/blogContent.ts` e
`lib/contentfulContent.ts`) e por isso nunca precisou de webhook — o space tem **zero**
webhooks hoje. O TLDR adota mecânica diferente de propósito:

- O `CONTENTFUL_DELIVERY_TOKEN` nunca existe em runtime, só no build da Vercel.
- Sem função serverless: HTML de CDN, sem cold start, sem erro de runtime possível.
- Uma página de 115 palavras que muda meia dúzia de vezes por ano não justifica um servidor.

Custo aceito: uma mecânica nova de ~5 minutos, uma vez.

### Os dois webhooks (são dois, não um)

Filtros combinam com **E lógico**, e `sys.contentType.sys.id` só existe em eventos de Entry.
Um webhook único filtrado por content type descartaria silenciosamente todo evento de Asset.

**1 — Entradas.** Topics: `Entry.publish`, `Entry.unpublish`, `Entry.delete`.

```json
{
  "name": "TLDR rebuild (entries)",
  "url": "<deploy hook da Vercel>",
  "topics": ["Entry.publish", "Entry.unpublish", "Entry.delete"],
  "filters": [
    { "in": [{ "doc": "sys.environment.sys.id" }, ["master"]] },
    { "in": [{ "doc": "sys.contentType.sys.id" }, ["tldrProfile", "tldrRow", "blogPost", "project"]] }
  ]
}
```

`blogPost` entra porque Writing é consulta pelos posts mais recentes — publicar um post no site
completo precisa reconstruir o TLDR. `project` entra porque `tldrRow.ref` herda a URL dele.

**2 — Assets.** Topics: `Asset.publish`, `Asset.unpublish`. Sem filtro de content type — o
avatar e o PDF do currículo são assets, e assets não têm content type.

```json
{
  "name": "TLDR rebuild (assets)",
  "url": "<mesmo deploy hook>",
  "topics": ["Asset.publish", "Asset.unpublish"],
  "filters": [{ "in": [{ "doc": "sys.environment.sys.id" }, ["master"]] }]
}
```

Sem a propriedade `filters`, o Contentful só dispara no `master` por padrão — mas o filtro
explícito de environment fica, para o dia em que existir outro environment.

### Decisões menores, tomadas sem perguntar

- **Sem preview de rascunho.** `adapter-static` não tem runtime para servir draft; servir exigiria
  uma função serverless e mataria a propriedade que motivou a escolha. Para ver rascunho:
  `npm run dev` local com o `CONTENTFUL_PREVIEW_TOKEN`.
- **Token próprio de delivery**, não o mesmo do site completo. Custo zero, e permite revogar o do
  TLDR sem derrubar o felipe-bueno.com.
- **Build quebrado não derruba o site.** A Vercel mantém o deployment anterior servindo quando um
  build falha. É comportamento da plataforma, não decisão.

### Critério de aceite herdado do ticket 02

As duas seções condicionais só funcionam com o webhook de entradas no ar: publicar o primeiro
`blogPost` precisa fazer a seção Writing aparecer sem ninguém tocar no TLDR. **Testar isso é
parte da implementação**, não deste ticket.
