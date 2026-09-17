# TLDR

A versão curta do felipe-bueno.com: uma página, em inglês, que serve de cartão de visita
técnico. Vive num subdomínio, ao lado do site completo, e lê do mesmo espaço Contentful.

## Language

**TLDR**:
Este site. Uma página só, sem rota interna, onde todo link leva pra fora.
_Avoid_: portfólio, landing page, one-pager

**Site completo**:
O felipe-bueno.com, bilíngue, com blog e páginas internas. É o destino do "leia mais" do TLDR,
nunca o contrário.
_Avoid_: site principal, site antigo, site grande

**Linha**:
A unidade de conteúdo do TLDR: rótulo, detalhe, metadado e link. Existe um único tipo de linha,
usado igualmente em Work, Projects e Elsewhere.
_Avoid_: item, card, entrada, row

**Rótulo**:
O texto à esquerda de uma linha, sempre presente. Uma empresa, um nome de projeto, um serviço.
_Avoid_: título, nome, label

**Detalhe**:
O texto que segue o rótulo na mesma linha, em tom apagado. Um cargo, ou a frase de dez palavras
que descreve um projeto.
_Avoid_: descrição, subtítulo, resumo

**Metadado**:
O texto alinhado à direita de uma linha. Um período, uma tecnologia, um handle. Cada metadado
faz o trabalho de uma frase.
_Avoid_: tag, badge, coluna direita

**Override**:
O texto curto escrito à mão para o TLDR, em vez de reaproveitado do site completo. Todo texto
exibido numa linha é override — a entrada de origem só carrega o link.
_Avoid_: sobrescrita, customização

**Entrada de origem**:
O `project` ou `blogPost` do site completo ao qual uma linha opcionalmente aponta. Serve para a
linha herdar a URL, não o texto.
_Avoid_: referência, link, relação, ref

**Seção condicional**:
Uma seção que não é renderizada quando o Contentful não tem o que mostrar, e volta sozinha
quando tiver. Hoje são duas: a linha de disponibilidade e Writing.
_Avoid_: seção opcional, seção dinâmica

**Writing**:
A única seção que não é curada: uma consulta pelos três `blogPost` publicados mais recentes.
Não existe linha guardada para ela.
_Avoid_: blog, posts, artigos

**Highlights**:
As pills da seção "TLDR" do site completo, guardadas no campo `siteProfile.tldr`. Apesar do
nome do campo, não têm relação com este site.
_Avoid_: tldr, bullets
