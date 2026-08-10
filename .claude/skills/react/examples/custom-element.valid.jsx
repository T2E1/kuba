// ✅ Consumo correto de custom element do kuba em React < 19.

import { useEffect, useRef } from 'react'

function Checkout({ order, onFinish }) {
  const buttonRef = useRef(null)

  useEffect(() => {
    const button = buttonRef.current

    // CustomEvent se escuta por addEventListener, não por prop `on*`.
    // O evento precisa ter composed: true no componente para atravessar o
    // Shadow DOM e chegar aqui (skill event).
    const handleClicked = (event) => onFinish(event.detail)
    button.addEventListener('clicked', handleClicked)

    // Objeto vai por PROPRIEDADE, não por atributo — atributo é string.
    // O types.d.ts do componente diz qual é qual.
    button.order = order

    return () => button.removeEventListener('clicked', handleClicked)
  }, [order, onFinish])

  return (
    <kb-button
      ref={buttonRef}
      // Atributo booleano: presente ou ausente, nunca `="false"`.
      {...(order.isEmpty && { disabled: '' })}
    >
      Finalizar
    </kb-button>
  )
}

// Em React 19 o suporte a custom elements é nativo: propriedades e eventos
// são passados corretamente, e o ref deixa de ser necessário para isso.
// Verificar a versão antes de escolher a forma.
