import { mount } from '@test'
import { beforeEach, expect, test } from 'vitest'

// Viola o propósito da fixture: o `beforeEach` decide, com `if`, um cenário diferente
// por teste — a variação deveria estar no Arrange de cada teste, não escondida aqui
// (também aproxima da rule 002, cláusula condicional decidindo fluxo).
let input

beforeEach((context) => {
  if (context.task.name.includes('required')) {
    input = mount('<kb-input name="who" required></kb-input>').querySelector('kb-input')
  } else {
    input = mount('<kb-input name="who"></kb-input>').querySelector('kb-input')
  }
})

test('required field reports valueMissing', () => {
  expect(input.validity.valueMissing).toBe(true)
})

test('optional field allows empty value', () => {
  expect(input.validity.valueMissing).toBe(false)
})
