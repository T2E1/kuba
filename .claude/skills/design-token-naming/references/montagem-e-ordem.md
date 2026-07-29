# Montagem, ordem e quantos níveis usar

## A ordem relativa é fixa

Os grupos sempre aparecem nesta sequência no nome:

```
namespace  →  object  →  base  →  modifier
```

- **Namespace** prefixa primeiro (system, depois theme, depois domain).
- **Object** estabelece contexto antes do base/modifier.
- **Base** é a espinha dorsal (category · concept · property).
- **Modifier** anexa por último (variant · state · scale · mode).

Dentro do base, a ordem convencional é `category · concept · property`.
Dentro dos modifiers, `variant · state · scale · mode`. Não há uma ordem
"universalmente correta" imposta pelo autor — o essencial é **escolher uma e
manter idêntica** em todo o sistema.

## Quantos níveis usar?

Regra única: **inclua só os níveis necessários para distinguir a intenção**
deste token de qualquer outro token real. Empilhar todos os níveis é erro.

Gradação do genérico ao específico (todos válidos, para propósitos diferentes):

- `esds-color-neutral-42` — token genérico/primitivo (uma cor da paleta).
- `esds-color-feedback-background-error` — token de propósito (semântico).
- `esds-input-left-icon-color-fill` — token com escopo de elemento aninhado.
- `esds-marquee-space-inset-2-x-media-query-s` — com object + scale +
  responsividade.

Se remover um nível não gera ambiguidade nem colisão, remova-o.

## Polihierarquia e aliasing

Às vezes uma decisão poderia morar em mais de um nível ao mesmo tempo — por
exemplo, a cor de erro de um controle de UI é conceitualmente "a cor de
feedback de erro" **e** "a cor de texto do grupo ui-controls". Duplicar o
valor cria duas fontes de verdade que divergem.

**Solução: alias.** Um token de propósito (mais específico, no ponto de uso)
aponta para um token base (mais genérico, a fonte de verdade):

```
$ui-controls-color-text-error  =  $color-feedback-error
```

Benefícios:
- Mantém a **completude semântica** onde o token é consumido
  (`ui-controls-color-text-error` lê bem no componente).
- Preserva **uma única fonte de verdade** (`color-feedback-error`).
- **Protege contra divergência futura**: se amanhã o erro do ui-controls
  precisar diferir do feedback global, você quebra o alias em um só lugar,
  sem renomear consumidores.

Quando **não** aliasar: se o token de propósito e o base sempre serão o mesmo
valor e o base já é legível no uso, o alias vira middle man inútil. Alie
quando há intenção semântica distinta ou risco real de divergência.

## Camadas de tokens (mental model)

O aliasing naturalmente organiza os tokens em camadas:

1. **Base/primitivos** — genéricos, sem semântica de uso
   (`color-neutral-42`). Muitos valores, poucos nomes semânticos.
2. **Semânticos/de propósito** — apontam para primitivos via alias
   (`color-feedback-error → color-red-50`).
3. **De componente** — locais, apontam para semânticos quando possível
   (`input-color-border-error → color-feedback-error`).

Consumidores devem preferir a camada mais semântica disponível; primitivos
são o alicerce, não o que a UI referencia diretamente.
