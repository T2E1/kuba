// Viola rule 011 (OCP): switch por tipo espalhado no código cliente
function renderField(field) {
  if (field.type === "text") return new TextField(field);
  if (field.type === "select") return new SelectField(field);
  if (field.type === "checkbox") return new CheckboxField(field);
  throw new Error(`tipo desconhecido: ${field.type}`);
}
