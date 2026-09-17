# Hostname, e como os dois sites se falam

Type: grilling
Status: resolved

## Question

- **Qual o hostname?** `tldr.felipe-bueno.com` é o óbvio, mas é também uma palavra que só
  desenvolvedor entende. Alternativas: um subdomínio curto, ou um domínio próprio.
- **O link é recíproco?** O TLDR aponta pro site completo — isso já está decidido, é o "leia
  mais". Mas o `felipe-bueno.com` aponta de volta pro TLDR? Se não apontar, o TLDR só existe
  pra quem recebe o link direto — o que pode ser exatamente a intenção.
- **Qual link você manda?** Quando alguém pede seu site, você manda qual dos dois? Se a resposta
  for sempre o TLDR, vale reabrir a decisão de "coexiste" que foi travada na sessão de mapeamento.
- **Canonical e indexação.** Dois sites sobre a mesma pessoa competem em busca. O TLDR é
  indexável, ou `noindex` por ser link-direto?

## Answer

- **Hostname:** `tldr.felipe-bueno.com`. Um CNAME, projeto separado na Vercel, deploys
  desacoplados — um build quebrado do site completo não derruba o TLDR. Recusado o
  `felipe-bueno.com/tldr` por rewrite: daria melhor sensação de "trocar de modo", mas acoplaria
  os dois deploys e exigiria config no `next.config.mjs` do site completo.
- **A entrada é um botão "TLDR" no site completo.** O felipe-bueno.com continua sendo o endereço
  oficial; o TLDR não é o link que o Felipe manda.
- **O link é recíproco:** o site completo aponta pro TLDR pelo botão, e o TLDR aponta de volta
  na linha "The long version" do Elsewhere.
- **`noindex`.** Quem busca "Felipe Bueno" acha o site completo. O TLDR continua funcionando por
  link direto e mantém preview de link em WhatsApp/LinkedIn — `noindex` não bloqueia nem uma
  coisa nem outra. Evita que uma página estática de 115 palavras ranqueie acima do site oficial.

### Reenquadramento que essa resposta causou

O trabalho travado na sessão de mapeamento era "cartão de visita técnico para quem recebeu seu
link". Com a entrada sendo um botão, o visitante **já está** no site completo quando chega. O
trabalho continua o mesmo — a versão rápida, legível em 15s — mas o caminho até ele mudou.
Nada na spec precisa mudar por isso.

### Fora do escopo deste mapa

Construir o botão "TLDR" no site completo é trabalho no repo `felipe-bueno`, não neste.
