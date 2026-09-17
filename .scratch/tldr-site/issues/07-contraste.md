# Contraste: a estética das referências reprova em WCAG?

Type: prototype
Status: resolved

## Question

A variante D usa escalas de opacidade herdadas das 16 referências: títulos de seção a 38%,
metadado a 42%, subtítulo a 55%, detalhe a 62% — sobre `#fdfdfc` no claro e `#0f0f0e` no escuro.

Medir o contraste real de cada par e decidir o que fazer com o que reprovar:

- Calcular a razão de contraste de cada tier, nos dois temas. WCAG AA pede 4.5:1 para texto
  normal e 3:1 para texto grande — e nada aqui é texto grande, porque a página inteira é 13,5px
  e 16px.
- Os títulos de seção a 38% quase certamente reprovam. O metadado a 42% provavelmente também.
- Decidir: subir as opacidades até passar, aceitar a reprovação como escolha estética, ou um
  meio-termo (passar no essencial — nome, bio, rótulos, links — e aceitar falha no decorativo).

**Isso pode invalidar o ticket 03.** Se as opacidades subirem, a hierarquia por meio-peso muda
de calibragem, porque parte do contraste vinha da cor.

Contexto que pesa na decisão: o Break Stuff, um dos três projetos que o TLDR exibe, tem
"WCAG AA in light and dark" como uma das suas métricas declaradas. Um cartão de visita técnico
que reprova em contraste enquanto exibe um projeto que se gaba de passar é uma contradição que
um revisor atento nota.

Resolver medindo no protótipo, não discutindo — as razões são calculáveis.

## Answer

**Variante E.** Todos os 6 tiers passam em WCAG AA (4.5:1) nos dois temas.

### Medição da variante D, antes

| Tier | Alfa | Claro | Escuro |
|---|---|---|---|
| corpo / rótulo | 1.00 | 17.10 ✅ | 15.63 ✅ |
| detalhe | 0.62 / 0.60 | 4.87 ✅ | 6.08 ✅ |
| subtítulo | 0.55 | **3.88 ❌** | 5.26 ✅ |
| metadado | 0.42 / 0.40 | **2.63 ❌** | **3.33 ❌** |
| título de seção | 0.38 / 0.36 | **2.37 ❌** | **2.91 ❌** |
| sublinhado de link | 0.25 / 0.28 | **1.71 ❌** | **2.23 ❌** |

Nada na página se qualifica como "texto grande" (precisaria de 24px normal ou 18.66px negrito),
então o limiar é 4.5:1 em tudo. O tema claro era o pior: 4 de 6 reprovando.

### Correção

Subtítulo, metadado, título de seção e sublinhado vão para alfa **0.60 no claro** e **0.50 no
escuro**. Corpo e detalhe ficam como estavam.

### O que a medição desmentiu

A hipótese do ticket era que subir as opacidades colapsaria a hierarquia e invalidaria o
ticket 03. **Colapsou no CSS e não mudou nada na tela.** D e E são visualmente quase
indistinguíveis, porque a hierarquia da variante D nunca veio da cor — vem dos meio-pesos da
fonte variável (400/460/500/560) e do tamanho. A opacidade era reforço redundante.

Consequência: o ticket 03 **não** foi invalidado. Só os valores de opacidade mudam; a decisão de
hierarquia por meio-peso sai confirmada, e mais forte do que entrou — sobreviveu a perder a cor.
