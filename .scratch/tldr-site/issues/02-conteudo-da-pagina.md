# As palavras que vão na página

Type: grilling
Status: resolved

## Question

Qual é, literalmente, o conteúdo da página? Sem isso o protótipo mente — não dá pra julgar
"cabe em 47 palavras e não rola" sem saber quais são as palavras.

Precisa sair daqui:

- **Nome e a linha embaixo dele.** Uma linha. Cargo? Frase? `Updated <data>`? Três das 16
  referências trocam a linha de cargo por outra coisa.
- **A bio.** Orçamento: 40 a 120 palavras, primeira pessoa. Ambrosino não escreve uma frase
  completa sequer; paco escreve 196 palavras. Onde nessa faixa?
- **Work:** quais empresas, quais cargos, qual o recorte de período. Todas, ou só as que provam
  alguma coisa? Vem do `resumeExperience` que já existe.
- **Projects:** quais 3-4, e a frase de ~10 palavras de cada um. Qual link cada um aponta
  (repositório, produto no ar, post)?
- **Writing:** quais 3 posts, e por quê esses.
- **Elsewhere:** quais perfis, e se contato é uma lista ou uma frase com links sublinhados.
- **O corte que dói:** o que você quer colocar mas não cabe.

Consultar `research/references/` — todas as 16 referências têm contagem de palavras registrada
seção a seção, e serve de régua.

## Answer

Conteúdo puxado do Contentful real (space de `felipe-bueno.com`, locale `en-US`) e decidido
com o Felipe em 6 perguntas. A página inteira, na ordem:

```
Felipe Bueno
Software engineer, backend-focused. Curitiba, Brazil.

I design services and APIs from scratch, make them fast, and get systems
that were never meant to talk to each other to agree on the same numbers.

Currently at Pilgrims Consulting, in Curitiba. I came into engineering
through a business degree — which is why messy operational data doesn't
throw me.

[condicional] Open to full-time and contract work, remote or relocating.

Work
  Pilgrims Consulting   Software engineer                           2025 —
  Before                Business roles I automated my way out of    2022 — 2023

Projects
  CLI Stealth Reader    Terminal e-reader rewritten in Rust.        Rust
                        Boot 339ms → 0.9ms.
  Bookclubinho          Book club platform. OAuth2, row-level       Next.js
                        security, live updates over SSE.
  Break Stuff           Breaks a task too big to start into         Nuxt
                        ordered, timed steps.

[condicional] Writing — não existe enquanto blogPost === 0

Elsewhere
  Email                 fe@felipe-bueno.com
  GitHub                fe-m-bueno
  LinkedIn              felipe-martins-bueno
  The long version      felipe-bueno.com
```

**~115 palavras.** Dentro da faixa das 16 referências (47–325), perto do jakub.kr (210).

### Decisões, uma a uma

1. **Writing sai por ora.** `blogPost` retorna `total: 0`. A seção não é renderizada enquanto
   não houver post publicado, e aparece sozinha quando houver. Vira critério de aceite do
   ticket 05.
2. **A linha sob o nome é cargo + lugar.** Recusadas: a afirmação ("I make slow systems fast"),
   cargo+empresa+fuso, e a data de atualização no lugar do cargo.
3. **Bio curta, 47 palavras.** Divisão de trabalho explícita: a bio posiciona, as listas provam.
   Por isso nenhum número aparece na bio — eles vivem nas linhas de Work e Projects.
4. **Work comprime os dois estágios não-técnicos numa linha "Before".** "Business roles I
   automated my way out of" — conecta com a última frase da bio e evita que
   "Compensation and Benefits Intern" seja a segunda coisa que um CTO lê.
5. **Projects: três, escolhidos por profundidade,** não pelo flag `featured` do site completo.
   CLI Stealth Reader (Rust, perf), Bookclubinho (fullstack, auth), Break Stuff (AI). Fora:
   Lederboxed (o mais fraco em engenharia dos 8) e Recollagefm, apesar de ambos serem `featured`.
   **O TLDR não espelha a curadoria do site completo** — público diferente.
6. **Elsewhere é lista de duas colunas,** no mesmo ritmo das outras seções, e não a frase de
   prosa que as 16 referências usam. Consequência: a disponibilidade não cabe ali e virou uma
   linha condicional sob a bio.

### Regra que emergiu e vale para a spec inteira

**Duas seções são condicionais e controladas pelo Contentful:** a linha de disponibilidade
(some quando `availabilityStatus` esvazia) e a seção Writing (some quando não há `blogPost`).
Uma regra, dois usos. Isso é requisito do ticket 05 — com build-time fetch só funciona se o
webhook do Contentful disparar rebuild.

### Insumos para os próximos tickets

- **Ticket 03:** a coluna direita de Projects está desenhada como a tecnologia principal
  (Rust / Next.js / Nuxt) e a de Work como período. Confirmar no protótipo — é a decisão de
  formato da linha.
- **Ticket 04:** `siteProfile.tldr` **já existe** no modelo atual e significa outra coisa (as
  pills da seção TLDR do site completo). Os types novos não podem colidir com esse nome.
- Fatos reais: e-mail `fe@felipe-bueno.com`, GitHub `fe-m-bueno`, LinkedIn `felipe-martins-bueno`.

## Emenda — revisão de texto (`/stop-slop`)

O Felipe estabeleceu que todo texto passa pelo skill `stop-slop` antes de ser gravado. A copy
acima foi revisada; **esta versão substitui a anterior** e é a canônica.

```
Felipe Bueno
Software engineer, backend-focused. Curitiba, Brazil.

I design services and APIs from scratch and make them fast. And I get systems
that were never meant to talk to each other to agree on the same numbers.

I work at Pilgrims Consulting, in Curitiba. I came into engineering through a
business degree, which is why messy operational data doesn't throw me.

[condicional] I'm open to full-time and contract work, remote or relocating.

Work
  Pilgrims Consulting   Software engineer                        2025 —
  Before                Business roles I automated my way out of 2022 — 2023

Projects
  CLI Stealth Reader    A terminal e-reader I rewrote in Rust.   Rust
                        Boot 339ms → 0.9ms.
  Bookclubinho          A book club platform with row-level      Next.js
                        security and live updates over SSE.
  Break Stuff           Breaks a task too big to start into      Nuxt
                        ordered, timed steps.

[condicional] Writing — não existe enquanto blogPost === 0

Elsewhere
  Email                 fe@felipe-bueno.com
  GitHub                fe-m-bueno
  LinkedIn              felipe-martins-bueno
  The long version      felipe-bueno.com
  Résumé                PDF, English
```

### O que mudou e por quê

| Antes | Depois | Regra |
|---|---|---|
| `business degree — which is why` | `business degree, which is why` | Nenhum travessão |
| `Terminal e-reader rewritten in Rust` | `A terminal e-reader I rewrote in Rust` | Voz ativa, sujeito humano |
| `OAuth2, row-level security, live SSE` | `row-level security and live updates over SSE` | Dois vencem três |
| `Currently at Pilgrims Consulting` | `I work at Pilgrims Consulting` | Sem advérbio, com verbo |
| `Open to full-time and contract work` | `I'm open to full-time and contract work` | Põe o leitor na sala |
| `design…, make…, and get…` numa frase | duas frases, a distintiva sozinha | Cadência tripla, ritmo variado |

Nota de modelo: `OAuth2` saiu da linha do Bookclubinho e não some do CMS — a linha exibe o que
o `tldrRow.detail` guardar, e o corte é editorial, não estrutural.
