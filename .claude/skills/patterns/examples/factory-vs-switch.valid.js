// A Factory é a exceção da rule 011 que centraliza a ramificação num único ponto
const fieldFactories = new Map([
  ["text", (field) => new TextField(field)],
  ["select", (field) => new SelectField(field)],
  ["checkbox", (field) => new CheckboxField(field)],
]);

function createField(field) {
  const factory = fieldFactories.get(field.type);
  if (!factory) throw new Error(`tipo desconhecido: ${field.type}`);
  return factory(field);
}
