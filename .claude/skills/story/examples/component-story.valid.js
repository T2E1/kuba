// ✅ Story transcrevendo o types.d.ts de packages/component/card/.
//
// Contrato documentado lá: direction: 'row' | 'column' (@default 'column'),
// value: string, e um método click() que dispara o evento `clicked`.

export default {
  title: 'Components/Card',
  tags: ['autodocs'],

  parameters: {
    // Regra 3: evento declarado, sem listener manual.
    actions: { handles: ['clicked'] },
    // Regra 4: 'todo' até o componente ser auditado — deliberado, não omitido.
    a11y: { test: 'todo' },
  },

  // Sem lit: o markup é uma string de template. Padrão de primeira classe
  // do Storybook, e mantém a rule 068 (nenhum framework só para a story).
  render: ({ direction, value, content }) =>
    `<kb-card direction="${direction}" value="${value}">${content}</kb-card>`,

  // Regra 2: cada atributo refletido do types.d.ts vira uma entrada, com a
  // description reaproveitada do JSDoc e o defaultValue transcrito do @default.
  argTypes: {
    direction: {
      control: { type: 'select' },
      options: ['row', 'column'],
      description: "Flex layout direction for the card's content.",
      table: { defaultValue: { summary: 'column' } },
    },
    value: {
      control: 'text',
      description: 'Arbitrary payload sent as the detail of the `clicked` event.',
    },
    content: { control: 'text' },
  },

  args: { direction: 'column', value: '42', content: 'Card content' },
}

// Uma story por estado significativamente distinto — não por permutação.
export const Column = {}
export const Row = { args: { direction: 'row' } }
