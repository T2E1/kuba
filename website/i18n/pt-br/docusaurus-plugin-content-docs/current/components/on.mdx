# On

Anexa um arco adicional — `origem/evento:tipo/destino` — ao host Echo que é seu
pai. Não renderiza nada e nunca liga nada em nome próprio. Se um host precisa de
uma assinatura só, use o atributo `on` dele; o `<kb-on>` existe porque um
elemento só consegue carregar um desses.

```html preview
<kb-input name="live" placeholder="Digite para ver dois arcos dispararem">
  <kb-label>Origem</kb-label>
</kb-input>

<kb-render>
  <kb-on value="live/changed:method/render"></kb-on>
  <template>
    <kb-text size="xxs">Você digitou: {}</kb-text>
  </template>
</kb-render>
```

## Uso

```html
<kb-render>
  <kb-on value="api/succeeded:method/render"></kb-on>
  <kb-on value="api/failed:method/clear"></kb-on>
  <template>{name}</template>
</kb-render>
```

## Quando usar

- **Um host precisa de uma segunda (ou terceira) assinatura** além do que o
  próprio atributo `on` consegue expressar — a gramática suporta exatamente um
  arco por atributo, então todo arco adicional precisa ser um filho `<kb-on>`.
- **Manter cada assinatura legível de forma independente** no markup, uma por
  linha, em vez de um valor de atributo longo.

## Quando não usar

- **Uma assinatura única** — defina o atributo `on` do próprio host. Um filho
  `<kb-on>` adiciona um elemento e uma etapa de upgrade sem benefício.
- **Ligação que não é orientada a evento.** Isto só faz a ponte entre um
  `CustomEvent` no barramento compartilhado do Echo e um método, atributo ou
  propriedade do seu pai.

## Composição

- **Pode conter**: nada. Não tem slot e não renderiza shadow DOM; existe pelo
  seu atributo `value` e pelo efeito que causa no `parentElement`.
- **Pode ser filho de**: qualquer elemento construído com o mixin `Echo` — o que
  significa todo custom element do kuba. Sob um elemento HTML comum ou um custom
  element não-Echo ele não tem efeito, já que a ligação mira o `parentElement`
  diretamente.

Ele espera por `customElements.whenDefined(parentElement.localName)` antes de
ligar, então declará-lo antes de o pai ter subido é seguro.

## A string do arco

O `value` recebe a mesma gramática do atributo `on` — veja
[Eventos e Echo](/foundations/events-and-echo) para a referência
completa:

```
origem/evento:tipo/destino|filtro=valor
```

| Segmento | Significado |
|---|---|
| `origem` | `*` (qualquer), `#id`, um `name`, ou um nome de tag |
| `evento` | o evento a escutar no barramento compartilhado |
| `tipo` | `method`, `setter` ou `attribute` |
| `destino` | o método, propriedade ou atributo a aplicar no pai |
| `filtro` | transformações opcionais separadas por `\|`, aplicadas em ordem |

## Atributos

| Atributo | Tipo | Padrão | Descrição |
|---|---|---|---|
| `value` | string de arco | — | O arco a anexar ao host Echo que é o pai. |

Este elemento não dispara eventos e não renderiza nada.

## Tempo de vida

Cada arco recebe seu próprio `AbortController`. Mudar o `value` desmonta a
assinatura antiga e cria a nova; remover o `<kb-on>` — ou o pai dele — desmonta
tudo. Não há nada para cancelar manualmente.

## Certo e errado

| Faça | Não faça |
|---|---|
| Usar o atributo `on` do próprio host para uma assinatura única | Embrulhar um único arco num filho `<kb-on>` quando o atributo resolveria |
| Adicionar um `<kb-on>` por arco extra no mesmo host | Concatenar vários arcos num só `on` — a gramática suporta um |
| Aninhá-lo diretamente sob o host Echo que ele liga | Colocá-lo sob um elemento não-Echo e esperar que funcione |
