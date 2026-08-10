// ❌ types.d.ts alcançando o vocabulário de outro pacote — viola a Regra 1.
// Correto em: isolation.valid.ts

// packages/behavior/redirect/types.d.ts

// Dois componentes usam o mesmo mixin e produzem uma forma idêntica, então
// a tentação é compartilhar o tipo. O custo do compartilhamento:
//
// - Acopla o contrato PÚBLICO do redirect ao do on. Quem consome
//   <kb-redirect> passa a precisar saber que <kb-on> existe (rule 017).
// - O vocabulário de <kb-on> deixa de poder mudar sem forçar um release de
//   <kb-redirect> (rule 015).
// - "KUBAOnValueAttribute" não significa nada no contexto do redirect: o
//   nome descreve o atributo `value` de outro elemento.
import type { KUBAOnValueAttribute } from '@behavior/on/types'

export default class KUBARedirectElement extends HTMLElement {
  on: KUBAOnValueAttribute | (string & {})
}
