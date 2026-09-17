// Acrescenta `pilgrims` ao dropdown `icon` do `tldrRow`.
//
// A validação do campo é uma lista fechada: sem esta migration o Contentful recusa o
// valor novo, e o ícone só existiria no código. A lista vive em dois lugares por
// natureza — aqui e em `src/lib/types.ts` — e os dois precisam concordar.
//
// Rodar:
//   contentful space migration --space-id $CONTENTFUL_SPACE_ID --environment-id master \
//     --management-token $CONTENTFUL_MANAGEMENT_TOKEN --yes contentful/migrations/004-icon-pilgrims.cjs

const rowIcons = ["mail", "github", "linkedin", "web", "pdf", "company", "pilgrims"];

module.exports = function (migration) {
  migration
    .editContentType("tldrRow")
    .editField("icon")
    .validations([{ in: rowIcons }]);
};
