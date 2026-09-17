# Modelo de conteúdo `tldr*`, campo a campo

Type: grilling
Status: resolved

## Question

Quais content types novos, com quais campos exatos, para a migration aditiva no environment
`master`?

Ponto de partida (modelo híbrido, já decidido):

- `tldrProfile` — singleton próprio. Candidatos: `name`, `headline`, `bio`, `updatedAt`,
  `elsewhere` (links), e as referências ordenadas para cada lista.
- Algum mecanismo de **override curto por item**: a frase de ~10 palavras do projeto no TLDR não
  é a `description` do `project`, que é longa e bilíngue. Isso é um content type intermediário
  (`tldrItem { ref, shortText, metaRight, url }`), um campo JSON no perfil, ou outra coisa?

Perguntas em aberto:

- As listas Work / Projects / Writing / Elsewhere são quatro campos distintos no perfil, ou uma
  lista única de itens com um campo de seção?
- O metadado à direita de cada linha (ano, período, data, contagem) vem de onde — do type
  referenciado, ou é escrito à mão no override? Depende do que o ticket 03 fechar sobre o formato
  da linha.
- Work vem do `resumeExperience` existente por referência, ou é reescrito? Os cargos no TLDR
  provavelmente são mais curtos que os do currículo completo.
- Os campos novos são localizados? Decisão travada diz EN-only — então não. Confirmar que isso
  não cria problema se o PT voltar um dia.
- Nomes dos campos e do type seguem a convenção do `001-initial-content-model.js`.

Entregável: o arquivo de migration escrito (`contentful/migrations/003-tldr-model.js` no repo do
site atual, ou equivalente aqui) — **não rodado**. Rodar é implementação.

Usar `mattpocock-skills:domain-modeling`.

## Answer

Migration escrita em `contentful/migrations/003-tldr-model.js` — **aditiva, e não rodada**.
Rodar é implementação. Validada executando o módulo contra um stub: cria 2 types e 17 campos,
sem tocar em nada existente. Glossário do domínio em `CONTEXT.md`.

### Dois types, não quatro

**`tldrRow`** — o primitivo universal. As quatro listas da página têm a mesma forma, então há
um tipo de linha, não um por seção. O modelo espelha o design.

| Campo | Tipo | Nota |
|---|---|---|
| `internalName` | Symbol, obrigatório | displayField |
| `label` | Symbol, obrigatório | o texto à esquerda |
| `detail` | Symbol | cargo, ou a frase de dez palavras |
| `meta` | Symbol | a coluna da direita |
| `href` | Symbol | URL explícita |
| `icon` | Symbol, dropdown | `mail`/`github`/`linkedin`/`web`/`pdf`/`company` |
| `ref` | Link → `project`\|`blogPost` | opcional, só pela URL |
| `file` | Link → Asset | o PDF do currículo |

**`tldrProfile`** — singleton: `internalName`, `name`, `headline`, `bio`, `availability`,
`avatar`, e três arrays de `tldrRow` (`work`, `projects`, `elsewhere`).

### Decisões

1. **Writing não é conteúdo, é consulta.** Os três `blogPost` publicados mais recentes.
   Nenhum type, nenhuma linha guardada — é a única forma de "aparecer sozinha" ser verdade.
   Isso resolveu uma contradição entre o ticket 02 (aparece sozinha) e a curadoria manual
   das outras três listas.
2. **Um `tldrRow` para tudo.** Recusado um type por seção: três types que renderizam idêntico
   fariam o modelo mentir sobre a página ter um só tipo de linha. Custo aceito: no editor os
   campos chamam `label` e `meta`, não `empresa` e `período`.
3. **A ordem é a ordem do array.** Sem campo `order` — diferente do modelo do site completo,
   que usa inteiros. Um array ordenado já é ordenado.
4. **`ref` sobrevive, mas encolheu.** O protótipo mostrou que todo texto exibido é override,
   então a referência carrega só a URL. Resolução do link: `href` → `ref.liveUrl` → `file.url`.
5. **O currículo é uma linha, não um campo do perfil.** `tldrRow.file` aponta pro asset. Assim
   o Résumé é só mais uma linha do Elsewhere, sem caso especial. Isso derrubou o `resumePdf`
   que estava previsto no perfil.
6. **Avatar vem de `heroImage`,** não de `profileImage` — descoberto no ticket 03. O campo
   `avatar` do `tldrProfile` recebe o mesmo asset, recortado por `?w=160&h=160&fit=thumb&f=face`.
7. **Nada localizado.** EN-only. Ligar localização depois é migration aditiva e não perde dados.
8. **Nome mantido `tldr*`,** apesar de `siteProfile.tldr` já significar outra coisa (as pills do
   site completo). A colisão é semântica, não técnica, e "TLDR" é a palavra que o Felipe usa.
   `CONTEXT.md` registra o campo antigo como **Highlights** para desambiguar.

### Pendência que o modelo não resolve

O runner de migration (`npm run contentful:migrate`) vive no repo do site completo. Enquanto
este repo não tiver o seu, a migration roda de lá apontando pro caminho relativo.
