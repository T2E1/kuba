import { mount } from '@test'

// Viola a rule 037: parâmetros booleanos soltos em vez de builder fluente — a ordem dos
// argumentos vira fonte de erro, e cada novo atributo exige mudar a assinatura inteira.
export function makeInput(name, required, value, disabled) {
  const attrs = [
    `name="${name}"`,
    required ? 'required' : '',
    value ? `value="${value}"` : '',
    disabled ? 'disabled' : '',
  ]
    .filter(Boolean)
    .join(' ')
  return mount(`<kb-input ${attrs}></kb-input>`).querySelector('kb-input')
}
