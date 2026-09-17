# Direção visual: qual registro, e qual é a indulgência

Type: prototype
Status: resolved

## Question

Qual é a cara do site? As 16 referências concordam em quase tudo e discordam em exatamente
quatro eixos — esses quatro são a decisão:

1. **Registro tipográfico.** Mono integral (evilrabbit, danielwhite) vs. sans com prosa em
   primeira pessoa (okfrank, paco, jakub) vs. sans com serifa pontual (paco usa Newsreader
   itálico numa palavra só).
2. **Largura da coluna.** jib aposta em 400px, rauchg e ambrosino em 672px. Mediana dos 16: ~570px.
   Isso muda o caráter do site inteiro, não é detalhe.
3. **Tema padrão.** Grupo B é dark-first nos 4; grupo A é light-first nos 4. Ninguém usa toggle —
   é `prefers-color-scheme` e acabou. Off-white morno (`#f6f5f3`, `#fdfdfc`), nunca `#fff`.
4. **Como dar hierarquia sem tamanho.** Por opacidade (ambrosino, grupo D) vs. por meio-peso de
   fonte variável — 450, 460, 550 (pqoqubbw, jakub).

E a quinta pergunta, que é a que dá alma: **qual é a sua única indulgência?** Todos os 16 têm
exatamente uma, nunca duas. Relógio analógico em CSS var (paco), colagem arrastável (shed),
nome de cliente com `blur(6px)` e tooltip "Nice try" (grizz), pill que vira menu com mola
`linear()` estourando em 1.16 (deets), shader WebGL de fundo (miles).

**Resolver com protótipo rodando**, não com conversa: usar `/mattpocock-skills:prototype` para
montar 2-3 direções lado a lado com o conteúdo real do ticket 02, e o Felipe escolhe vendo.
Linkar os protótipos como assets deste ticket.

Carregar `svelte-code-writer` e `svelte-core-bestpractices` antes de escrever `.svelte`.

## Protótipo (aguardando escolha do Felipe)

`prototype/visual-directions.prototype.html` — três variantes, conteúdo real do ticket 02,
trocáveis por `?variant=A|B|C`, setas ← → ou a barra flutuante. `&bar=0` esconde a barra.
Abrir direto com `file://`, sem servidor. Capturas em `prototype/shot-*.png`.

| | Registro | Largura | Tema | Hierarquia | Altura desktop |
|---|---|---|---|---|---|
| A — Ledger | JetBrains Mono, 14px único | 560px | light-first | opacidade + condutor pontilhado | 1306px |
| B — Prosa | Inter variável, 16px único | 600px | light-first (#f6f5f3) | meio-pesos 460/500/560 | **1222px** |
| C — Estreito | Inter, 13,5px | 400px | **dark-first** | opacidade + espaço | 1514px |

**Não verificado:** comportamento em mobile (o flag de viewport do agent-browser não aplicou).
Conferir redimensionando a janela antes de fechar a decisão.

## Answer

**Variante D** — construída pela mistura que o Felipe pediu ao ver A, B e C rodando.
Altura desktop: 1247px (a mais curta depois de B, apesar de carregar avatar e currículo).

### Os quatro eixos

| Eixo | Decisão | De onde veio |
|---|---|---|
| Registro tipográfico | Inter variável, sans | B |
| Largura | 600px | B |
| Tema | claro por padrão, `#fdfdfc`; escuro `#0f0f0e` via `prefers-color-scheme`, **sem toggle** | fundo de A, regra das 16 referências |
| Hierarquia | meio-pesos de fonte variável — 400 corpo, 460 disponibilidade, 500 título de linha, 560 nome | B |
| Títulos de seção | minúsculo, 13,5px, `letter-spacing: .06em`, 38% de opacidade | C |

### Acrescentado a pedido

- **Avatar 44px ao lado do nome**, padrão jakub.kr. Fonte: **`heroImage`**, não `profileImage` —
  este último é um logotipo e fica ilegível em 44px. O recorte usa a API de imagem do Contentful
  (`?w=160&h=160&fit=thumb&f=face`).
- **Ícones inline em SVG**, sprite de `<symbol>` no próprio HTML, zero dependência: e-mail,
  GitHub, LinkedIn, globo, PDF, prédio. Alinhados por `vertical-align:-.13em` para não empurrar
  a linha de base.
- **Link com ícone dentro da prosa** ("Currently at [ícone] Pilgrims Consulting"), o padrão de
  favicon inline do jakub.kr.
- **Currículo como linha do Elsewhere** (`Résumé → PDF, English`), não como botão solto. O botão
  com tooltip foi construído, mostrado e recusado. Fonte: `siteProfile.resumePdf`, localizado —
  o TLDR usa só o `en-US`.

### Herdado de B, e é a indulgência atual

Passar o mouse numa lista apaga as linhas irmãs para 30% em 140ms. É o único movimento da
página inteira — nenhuma entrada animada, nenhum parallax, nenhum cursor custom.

### Rugosidade conhecida, não resolvida

Nas linhas de Projects a descrição longa quebra e deixa a segunda linha órfã à esquerda
enquanto a tecnologia fica alinhada à direita ("0.9ms." e "SSE."). Resolver exige encurtar as
descrições — que o ticket 02 travou — ou mudar o formato da linha. Não mexi por conta própria.

Protótipo em `prototype/visual-directions.prototype.html` (`?variant=A|B|C|D`).

## Emenda (ticket 07)

Os valores de opacidade acima foram substituídos pela variante **E**: subtítulo, metadado,
título de seção e sublinhado vão para alfa 0.60 no claro e 0.50 no escuro, para passar em
WCAG AA. A hierarquia por meio-peso fica como está — ver `issues/07-contraste.md`.

## Emenda — comportamento em mobile (verificado)

Medido em 390×844. A variante E não tinha overflow horizontal, mas **a linha de duas colunas
quebrava**: o detalhe passava para a segunda linha enquanto o metadado ficava ancorado à direita
da primeira, e o texto corria por baixo dele.

Regra acrescentada: abaixo de 560px, empilham **só as linhas que têm detalhe**
(`.row:has(.d)`), com o metadado indo para baixo. As linhas de Elsewhere não têm detalhe e
continuam em duas colunas, onde funcionam bem. O desktop não muda — confirmado que
`flex-direction` segue `row` em 1440px.

Altura em 390px: 1,91 telas.

## Emenda — a indulgência, decidida

Quatro ideias foram prototipadas em `?variant=H`, todas CSS puro para respeitar o zero
JavaScript decidido no ticket 08. O Felipe escolheu **a mistura de 1 com 4**:

1. **Apagar as irmãs.** Passar o mouse numa lista leva as outras linhas a 30% em 140ms.
2. **O condutor que se completa.** A linha sob o cursor ganha um traço pontilhado crescendo da
   esquerda para a direita, ligando o texto ao metadado. Gradiente repetido com `background-size`
   indo de `0%` a `100%` em 420ms, suavização expo `cubic-bezier(.16,1,.3,1)`.

A página fica calma parada; a linha se completa quando alguém aponta. É também a forma de trazer
o traço da variante A, que o Felipe tinha elogiado, sem ele estar presente o tempo todo.

### Detalhes que só apareceram montando

- **O condutor precisa da sobra da linha.** Primeira tentativa deu `flex:1` a ele e ao bloco de
  texto, que então dividiram o espaço igualmente e forçaram quebra de linha no desktop. Correção:
  o texto é `flex:0 1 auto` e dimensiona pelo conteúdo, o condutor é `flex:1 1 auto` e fica com a
  sobra. Isso corrigiu de lambuja uma quebra que já existia na linha "Before".
- **Em Projects o traço fica curto**, porque a descrição quase preenche a linha. Em Work e
  Elsewhere sobra bastante espaço e o efeito aparece inteiro.
- **No mobile o condutor some.** Abaixo de 560px as linhas com detalhe empilham, e não há vão
  entre texto e metadado para ligar.

Altura da página não mudou: 1287px.
