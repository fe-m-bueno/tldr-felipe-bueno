# Acabamento: favicon, OG, analytics, llms.txt

Type: grilling
Status: resolved

## Question

Os quatro itens que tinham sido postos fora de escopo por serem acabamento de implementação.
O Felipe puxou de volta e decidiu os quatro de uma vez.

## Answer

### Favicon — feito

O ƒ do `felipe-bueno.com` com as cores invertidas: ƒ preto sobre `#ebebeb`. Gerado invertendo os
canais RGB do `public/favicon.ico` original e preservando o alfa, o que dá `#ebebeb` em vez de
branco puro (o preto original não era `#000`). O Felipe aprovou o `#ebebeb`.

Arquivos já gravados:
- `static/favicon.ico` — 16, 32, 48, 64, 128 e 256px
- `static/apple-touch-icon.png` — 180px

### Open Graph

Reusa a imagem que o site completo já serve: `/felipe-bueno.png`, 1200×630.

Título e descrição são novos, alinhados à copy revisada:

```
og:title        Felipe Bueno, the short version
og:description  I design services and APIs from scratch and make them fast.
                And I get systems that were never meant to talk to each
                other to agree on the same numbers.
og:image        /felipe-bueno.png  (1200×630)
og:type         website
og:locale       en_US
twitter:card    summary_large_image
```

O título espelha a linha "The long version" do Elsewhere, que aponta pro site completo.

**Inconsistência conhecida, não resolvida:** a imagem tem "Fullstack Engineer" impresso, e a
página diz "Software engineer, backend-focused". Quem vê o preview lê uma coisa e clica pra ler
outra. Regerar a imagem é trabalho de design, não de spec — fica registrado para quem
implementar decidir se vale.

### Analytics — nenhum

O TLDR não carrega script de analytics. Mantém a página com **zero JavaScript**, que era a
consequência natural de `adapter-static` com `prerender = true`.

A única pergunta que interessa — "alguém clicou no botão TLDR?" — se responde no site completo,
que já roda `@vercel/analytics`. Recusado o Vercel Web Analytics no TLDR justamente porque seria
o primeiro JS da página.

**Fora do escopo deste mapa:** instrumentar o clique do botão é trabalho no repo `felipe-bueno`.

### llms.txt — não

Recusado. Dois dos 16 sites de referência servem variante legível por agente (pqoqubbw com
`/llms.txt`, jakub com `index.md` no rodapé), mas o Felipe dispensou.
