// ❌ Consumo de custom element do kuba com premissas de componente React.
// Correto em: custom-element.valid.jsx

function Checkout({ order }) {
  return (
    <kb-button
      // Em React < 19, `onClicked` não faz nada: a sintaxe `on*` só liga
      // eventos sintéticos do React, não CustomEvent do DOM. Falha em
      // silêncio — nenhum erro, nenhum warning, só não funciona.
      onClicked={handleClick}

      // Atributo HTML é sempre string. Um objeto vira "[object Object]".
      order={order}

      // Booleano como atributo: `disabled={false}` renderiza disabled="false",
      // que é uma string não vazia — e portanto verdadeira para o componente.
      disabled={false}
    >
      Finalizar
    </kb-button>
  )
}

// Os três erros têm a mesma raiz: tratar um custom element como componente
// React. Ele é um elemento do DOM — atributos são strings, eventos são
// CustomEvent, e propriedades precisam ser atribuídas via ref.
