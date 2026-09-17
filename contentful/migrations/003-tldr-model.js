// Modelo de conteúdo do TLDR (tldr.felipe-bueno.com).
//
// ADITIVA: cria apenas `tldrProfile` e `tldrRow`. Não toca em nenhum type existente,
// então o felipe-bueno.com não sente nada. Roda no MESMO space e no MESMO environment
// (`master`) — é o único jeito de `tldrRow.ref` conseguir apontar para `project` e
// `blogPost`, já que referência entre environments não existe no Contentful.
//
// NÃO LOCALIZADO de propósito: o TLDR é EN-only. Se o PT voltar um dia, ligar localização
// num campo existente é uma migration posterior e não descarta conteúdo.
//
// Rodar com o runner do repo felipe-bueno enquanto este repo não tiver o seu:
//   npm run contentful:migrate -- ../tldr-felipe-bueno/contentful/migrations/003-tldr-model.js

const rowIcons = ["mail", "github", "linkedin", "web", "pdf", "company"];

function symbolField(contentType, id, name, { required = false, validations = [] } = {}) {
  return contentType.createField(id).name(name).type("Symbol").required(required).validations(validations);
}

function textField(contentType, id, name, { required = false } = {}) {
  return contentType.createField(id).name(name).type("Text").required(required);
}

function assetField(contentType, id, name, { validations = [] } = {}) {
  return contentType.createField(id).name(name).type("Link").linkType("Asset").required(false).validations(validations);
}

function entryField(contentType, id, name, linkedContentTypes) {
  return contentType
    .createField(id)
    .name(name)
    .type("Link")
    .linkType("Entry")
    .required(false)
    .validations([{ linkContentType: linkedContentTypes }]);
}

function rowArrayField(contentType, id, name) {
  return contentType
    .createField(id)
    .name(name)
    .type("Array")
    .required(false)
    .items({ type: "Link", linkType: "Entry", validations: [{ linkContentType: ["tldrRow"] }] });
}

module.exports = function (migration) {
  // ---------------------------------------------------------------- tldrRow
  // O primitivo universal. As quatro listas da página têm a mesma forma
  // (ícone? · rótulo · detalhe? · metadado? · link?), então há UM tipo de linha,
  // não um por seção. O modelo espelha o design.
  const row = migration.createContentType("tldrRow", {
    name: "TLDR row",
    description:
      "Uma linha do TLDR. Serve Work, Projects e Elsewhere sem distinção. " +
      "A ordem de exibição é a ordem do array no tldrProfile — não há campo de ordem.",
    displayField: "internalName",
  });

  symbolField(row, "internalName", "Internal name", { required: true });
  symbolField(row, "label", "Label", { required: true });
  symbolField(row, "detail", "Detail");
  symbolField(row, "meta", "Meta (right column)");
  symbolField(row, "href", "Explicit URL");
  symbolField(row, "icon", "Icon", { validations: [{ in: rowIcons }] });
  entryField(row, "ref", "Source entry", ["project", "blogPost"]);
  assetField(row, "file", "File");

  row.changeEditorInterface("icon", "dropdown");

  // ------------------------------------------------------------ tldrProfile
  // Singleton. Só existe uma entrada; o código pega a primeira.
  const profile = migration.createContentType("tldrProfile", {
    name: "TLDR profile",
    description:
      "Singleton com a página inteira do TLDR. Writing não aparece aqui: é uma consulta " +
      "pelos blogPost publicados mais recentes, não uma lista curada.",
    displayField: "internalName",
  });

  symbolField(profile, "internalName", "Internal name", { required: true });
  symbolField(profile, "name", "Name", { required: true });
  symbolField(profile, "headline", "Headline", { required: true });
  textField(profile, "bio", "Bio", { required: true });

  // Vazio = a linha some da página. Mesma regra condicional da seção Writing.
  symbolField(profile, "availability", "Availability line");

  assetField(profile, "avatar", "Avatar", { validations: [{ linkMimetypeGroup: ["image"] }] });

  rowArrayField(profile, "work", "Work rows");
  rowArrayField(profile, "projects", "Project rows");
  rowArrayField(profile, "elsewhere", "Elsewhere rows");
};
