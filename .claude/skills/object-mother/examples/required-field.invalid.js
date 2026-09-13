import { mount } from '@test'

// Viola a rule 037: a "mother" recebe flags que decidem o cenário — não é mais
// uma instância fixa, é um Test Data Builder disfarçado de nome de cenário.
export function makeInput(required, value, disabled) {
  const attrs = [
    required ? 'required' : '',
    value ? `value="${value}"` : '',
    disabled ? 'disabled' : '',
  ].join(' ')
  const body = mount(`<kb-input name="who" ${attrs}></kb-input>`)
  return body.querySelector('kb-input')
}
