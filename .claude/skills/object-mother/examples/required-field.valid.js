import { mount } from '@test'

/** Object Mother: o cenário mais comum de kb-input, sempre o mesmo. */
export function requiredEmptyInput() {
  const body = mount('<kb-input name="who" required></kb-input>')
  return body.querySelector('kb-input')
}
