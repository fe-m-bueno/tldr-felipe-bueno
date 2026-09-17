# Mapa: TLDR de felipe-bueno.com

Label: `wayfinder:map`

## Destination

Uma **spec travada** para o TLDR, pronta para entregar a uma sessão de implementação: direção
visual escolhida e validada em protótipo rodando, conteúdo real da página definido, modelo de
conteúdo `tldr*` no Contentful campo a campo, e estratégia de build decidida.

**Construir e publicar o site é um esforço separado.** Este mapa termina quando não sobrar nada
a decidir — não quando o site estiver no ar.

## Notes

**Domínio:** site pessoal de uma página, EN-only, em SvelteKit, lendo do mesmo espaço Contentful
que `felipe-bueno.com`.

**Restrições travadas na sessão de mapeamento** (2026-09-17) — não reabrir sem redesenhar o destino:

| | |
|---|---|
| Vive onde | Subdomínio, coexistindo com o site completo. O TLDR não substitui nada |
| Trabalho | Cartão de visita técnico: em 15s, quem é, o que faz bem, 3-4 provas, como achar |
| Idioma | Só EN. Sem i18next, sem cookie de locale, sem seletor |
| Páginas | **Duas:** a home e `/projects`. Decisão revista depois do mapa fechar, ver ticket 09 |
| Seções | nome → uma linha → bio curta → Work → Projects → Writing → Elsewhere |
| Conteúdo | Mesmo space, mesmo environment `master`, migration **aditiva** com prefixo `tldr*`. Modelo híbrido: perfil próprio + referências a `project`/`blogPost` com override curto |
| Condicionais | Duas seções somem sozinhas quando o Contentful esvazia: a linha de disponibilidade e a seção Writing (que hoje tem zero posts) |
| Stack | SvelteKit (não Svelte+Vite puro — precisa de `load` em build time e prerender). Felipe já escreve Svelte: Weather Now At e Stopwatch são SvelteKit |

**Skills que toda sessão deve consultar:**
- `svelte-code-writer` e `svelte-core-bestpractices` — obrigatórias para qualquer `.svelte` / `.svelte.ts`
- `mattpocock-skills:grilling` e `mattpocock-skills:domain-modeling` — default para tickets de decisão
- `mattpocock-skills:prototype` — para o ticket de direção visual
- Context7 MCP para qualquer fato de SvelteKit / Contentful SDK — não responder de memória

**Pesquisa já feita:** 16 sites de referência estudados com agent-browser em `research/references/`
(`group-a.md` a `group-d.md`, 15.312 palavras) + 55 screenshots em
`research/references/screenshots/`. Consultar antes de qualquer decisão visual ou de IA.

**Consenso dos 16 referências** (usar como default; desviar exige justificativa):
uma coluna centrada de 400–672px · sem navbar (15/16) · maior texto 24px, três sites usam um
único tamanho pra tudo · home entre 47 e 325 palavras · linha `título ....... metadado à direita`
como componente universal · contato é uma frase com link, nunca formulário (16/16) · sem case
study (15/16) · movimento só na entrada e no hover · uma indulgência, nunca duas.

**Comunicação:** PT-BR com o Felipe. O conteúdo do site é EN.

**Glossário do domínio:** `CONTEXT.md` na raiz. Consultar antes de nomear qualquer coisa.

## Decisions so far

<!-- uma linha por ticket fechado -->

- [SvelteKit + Contentful: o que é fato](issues/01-sveltekit-contentful.md) — svelte@5.57 / kit@2.70 (não existe Kit 3); `+page.server.ts` + `prerender=true` + `adapter-static{strict}` faz build-time fetch; SDK `contentful@11` roda sem wrapper; tipos à mão valem mais que gerador para ~2 types; **`isr` não tem efeito onde `prerender=true`** — prerender e ISR são mutuamente exclusivos por rota. Detalhes em `research/sveltekit-contentful.md`
- [As palavras que vão na página](issues/02-conteudo-da-pagina.md) — página fechada em ~115 palavras: cargo+lugar sob o nome, bio de 47 palavras que posiciona sem números, Work com os dois estágios comprimidos numa linha "Before", 3 projetos escolhidos por profundidade (não pelo `featured`), Elsewhere como lista de duas colunas. Disponibilidade e Writing são **condicionais**, controladas pelo Contentful
- [Direção visual](issues/03-direcao-visual.md) — variante **D**: Inter variável a 600px, um tamanho de corpo com hierarquia por meio-pesos (400/460/500/560), fundo `#fdfdfc` claro e `#0f0f0e` escuro por `prefers-color-scheme` sem toggle, títulos de seção minúsculos e espaçados a 38%. Mais avatar de 44px (de `heroImage`, não `profileImage`), ícones SVG inline sem dependência, e o currículo como linha do Elsewhere. Única animação: no hover as linhas irmãs apagam para 30% e um condutor pontilhado cresce na linha apontada, ligando texto e metadado (ver emenda do ticket 03)
- [Modelo de conteúdo `tldr*`](issues/04-modelo-conteudo-tldr.md) — dois types: `tldrRow` (o primitivo universal das quatro listas) e `tldrProfile` (singleton com três arrays ordenados). Writing virou **consulta** pelos 3 posts mais recentes, não lista curada — era a única forma de "aparece sozinha" ser verdade. Migration aditiva escrita e **não rodada** em `contentful/migrations/003-tldr-model.js`; glossário em `CONTEXT.md`
- [Adapter e revalidação](issues/05-adapter-e-build.md) — `adapter-static` + `prerender = true`, contra o precedente do site completo (que usa ISR a 60s). O token só existe no build, sem função serverless. Atualização por **dois** webhooks do Contentful apontando pro mesmo deploy hook: um de entradas filtrado em `tldrProfile`/`tldrRow`/`blogPost`/`project`, outro de assets sem filtro — porque filtro de content type descartaria os assets
- [Hostname e relação entre os sites](issues/06-hostname-e-relacao.md) — `tldr.felipe-bueno.com`, projeto separado na Vercel, deploys desacoplados. A entrada é um **botão "TLDR" no site completo**, que continua sendo o endereço oficial. Link recíproco, e o TLDR é `noindex` para não competir com ele em busca
- [Contraste](issues/07-contraste.md) — a variante D reprovava em **4 dos 6 tiers** no tema claro. Corrigido na variante **E**: opacidades a 0.60 (claro) e 0.50 (escuro), todos os tiers em WCAG AA. A medição desmentiu a hipótese do ticket: a hierarquia não colapsou, porque nunca vinha da cor — vem dos meio-pesos da fonte variável
- [Acabamento](issues/08-acabamento.md) — favicon é o ƒ do site completo invertido (preto sobre `#ebebeb`), já gerado em `static/`. OG reusa `/felipe-bueno.png` com título e descrição novos. **Nenhum analytics**: a página fica com zero JavaScript, e o clique no botão se mede no site completo. Sem `llms.txt`
- [A segunda rota: /projects](issues/09-rota-projects.md) — revê a decisão de "uma página, ponto". `/projects` é **consulta** sobre todos os `project` publicados, sem content type novo e sem texto novo: as linhas usam o campo `metrics`, que já guarda fragmentos curtos. Home ganha uma linha `All projects`

## Not yet specified

_(vazio — nada mais a especificar. O mapa chegou ao destino.)_

## Out of scope

- **Construir e publicar o site.** O destino é a spec. Implementação, deploy na Vercel e DNS são
  um esforço separado que começa quando este mapa fechar.
- **Aposentar ou mexer no `felipe-bueno.com`.** O site completo continua exatamente como está.
- **PT no TLDR.** Decidido na sessão de mapeamento: quem quer português vai pro site completo.
- **Formulário de contato, Resend, API routes, Last.fm, blog hospedado, efeitos pesados**
  (liquid glass, mouse gradient, hero 3D, scroll reveal, OGL). Cortados na sessão de mapeamento.
- **O botão "TLDR" no site completo, e a instrumentação do clique nele.** Trabalho no repo
  `felipe-bueno`, não neste.
- **Regerar a imagem de OG.** Ela diz "Fullstack Engineer" e a página diz "backend-focused".
  Registrado no ticket 08; é trabalho de design.
- **Case study / página de detalhe de projeto.** Consequência direta de "uma página, ponto" —
  e 15 dos 16 referências também abandonaram.
