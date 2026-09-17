# A segunda rota: /projects

Type: prototype
Status: resolved

## Question

O Felipe pediu um clique em Projects que leve a uma página com os outros projetos.

**Isso derruba uma decisão travada no mapeamento:** "uma página, ponto — zero rota interna,
todo link leva pra fora". Foi essa decisão que colapsou roteamento, template secundário e
metade do schema. Também é o ponto onde 15 das 16 referências foram na direção oposta.

Decisão do Felipe, registrada. A mudança é contida: `adapter-static` prerenderiza duas rotas
sem alteração de arquitetura, e o `noindex` vale para as duas.

## Answer

**`/projects` é uma consulta, não uma lista curada.** Lista todo `project` com status
publicado ou destacado, ordenado por `order`, direto do Contentful. Hoje traz os 8.

### Consequências no que já estava fechado

| Ticket | O que muda |
|---|---|
| 02 | O inventário deixa de ser uma página e passa a ser duas. A home segue igual |
| 03 | Ganha um template secundário, que reusa o mesmo primitivo de linha |
| 04 | **Nenhum type novo.** Mesmo padrão do Writing: a rota consulta `project` direto |
| 05 | Nenhuma mudança. `adapter-static` prerenderiza as duas rotas |
| 06 | `noindex` nas duas |

### O texto das linhas vem de `metrics`, não de `description`

Como é consulta direta, o texto exibido teria que sair do `project`. A `description` tem 200+
caracteres e é bilíngue, e quebraria a estética. O campo **`metrics`** já guarda fragmentos
curtos e nativos de TLDR (`Boot 339ms → 0.9ms`, `Row level security`, `500K+ titles`). A linha
mostra os dois primeiros, unidos por `·`.

Isso significa que **a segunda página não exige escrever nada novo** e cresce sozinha quando o
Felipe publica um projeto.

### Forma

- Home: as 3 linhas curadas, mais uma linha `All projects` com metadado `8` apontando pra rota.
- `/projects`: um link `← Felipe Bueno` no topo, título, uma linha de subtítulo, e a lista.
- Desktop: 900px de altura. Cabe numa tela, sem rolar.
- Mobile em 390px: 1,45 telas, sem overflow horizontal.

Protótipo em `?variant=P`.
