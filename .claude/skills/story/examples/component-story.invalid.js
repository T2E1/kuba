// ❌ Quatro problemas numa story de dez linhas.
// Correto em: component-story.valid.js

export default {
  title: 'Components/Card',

  render: () => {
    // Regra 3: listener manual para observar o evento. Os eventos do kuba são
    // CustomEvent com bubbling — parameters.actions.handles já captura isso
    // declarativamente. Este padrão vem de frameworks que não têm o atalho.
    const element = document.createElement('kb-card')
    element.addEventListener('clicked', console.log)
    return element
  },

  // Regra 2: `direction` é 'row' | 'column' no types.d.ts, mas aqui virou
  // campo de texto livre. O controle deixa de documentar o contrato, e nada
  // impede digitar um valor inválido.
  // Falta também table.defaultValue.summary — a coluna "Default" do painel
  // fica em branco, porque sem manifest o Storybook não infere nada.
  argTypes: {
    direction: { control: 'text' },
  },

  // Regra 4: parâmetro de a11y omitido. Omitido não é a mesma coisa que
  // { test: 'todo' } deliberado — não dá para distinguir "ainda não auditamos"
  // de "esqueceram".
}

// Regra 6: nenhuma story com play. O evento `clicked` aparece no painel
// Actions se alguém clicar, mas nada prova que ele é disparado de fato.
