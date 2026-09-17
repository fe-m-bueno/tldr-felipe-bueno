// Duas decisões da spec, em duas linhas.
//
// `prerender`: tudo é HTML gerado no build (ticket 05). Com o adapter-static em modo
// estrito, qualquer rota que escapar disso quebra o build em vez de virar função.
//
// `csr = false`: nenhum JavaScript vai pra página (ticket 08). Sem hidratação, sem
// bundle, sem analytics. O movimento da página é CSS, e o resto é HTML.
export const prerender = true;
export const csr = false;
