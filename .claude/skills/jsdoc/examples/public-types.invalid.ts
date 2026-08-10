// ❌ Contrato público documentado como se fosse código interno.
// Correto em: public-types.valid.ts

export default class Button extends HTMLElement {
  // Sem descrição, sem @default. O consumidor TypeScript vê apenas
  // `color: string` no autocomplete e não faz ideia de:
  //
  // - quais valores são aceitos;
  // - qual é o valor quando o atributo é omitido;
  // - que o atributo é refletido no DOM.
  //
  // Aqui o "o quê" É a informação que falta — a implementação não é
  // visível para quem consome (rule 026, segundo nível).
  color: string

  /** Sets the value. */
  value: string

  // Evento disparado sem nenhuma menção: quem consome não descobre que
  // ele existe, nem o que vem em `detail`.
  click(): void
}
