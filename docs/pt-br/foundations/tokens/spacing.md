# Espaçamento

Duas escalas, definidas em `packages/pixel/tokens/spacing.css`. Mantê-las
separadas é o ponto: um ajuste no espaço *entre* elementos nunca muda a
respiração interna de um componente.

| Escala | Governa | Usada por |
|---|---|---|
| `--spacing-*` | margens e gaps **entre** elementos | o gap do `<kb-stack>`, o ritmo do layout |
| `--spacing_inset-*` | padding **dentro** de um elemento | o padding próprio de cada componente |

## Spacing

Padroniza a composição e o ritmo vertical de uma interface.

| Token | Valor | Amostra |
|---|---|---|
| `--spacing-quarck` | 4px | <span class="bar" style="width: var(--spacing-quarck)"></span> |
| `--spacing-nano` | 8px | <span class="bar" style="width: var(--spacing-nano)"></span> |
| `--spacing-xxxs` | 16px | <span class="bar" style="width: var(--spacing-xxxs)"></span> |
| `--spacing-xxs` | 24px | <span class="bar" style="width: var(--spacing-xxs)"></span> |
| `--spacing-xs` | 32px | <span class="bar" style="width: var(--spacing-xs)"></span> |
| `--spacing-sm` | 40px | <span class="bar" style="width: var(--spacing-sm)"></span> |
| `--spacing-md` | 48px | <span class="bar" style="width: var(--spacing-md)"></span> |
| `--spacing-lg` | 56px | <span class="bar" style="width: var(--spacing-lg)"></span> |
| `--spacing-xl` | 64px | <span class="bar" style="width: var(--spacing-xl)"></span> |
| `--spacing-xxl` | 80px | <span class="bar" style="width: var(--spacing-xxl)"></span> |
| `--spacing-xxxl` | 120px | <span class="bar" style="width: var(--spacing-xxxl)"></span> |
| `--spacing-huge` | 160px | <span class="bar" style="width: var(--spacing-huge)"></span> |
| `--spacing-giant` | 200px | <span class="bar" style="width: var(--spacing-giant)"></span> |

## Inset

Espaçamento interno — o padding de um componente, com os quatro lados iguais.

| Token | Valor | Amostra |
|---|---|---|
| `--spacing_inset-quarck` | 4px | <span class="bar" style="width: var(--spacing_inset-quarck)"></span> |
| `--spacing_inset-nano` | 8px | <span class="bar" style="width: var(--spacing_inset-nano)"></span> |
| `--spacing_inset-xs` | 16px | <span class="bar" style="width: var(--spacing_inset-xs)"></span> |
| `--spacing_inset-sm` | 24px | <span class="bar" style="width: var(--spacing_inset-sm)"></span> |
| `--spacing_inset-md` | 32px | <span class="bar" style="width: var(--spacing_inset-md)"></span> |
| `--spacing_inset-lg` | 40px | <span class="bar" style="width: var(--spacing_inset-lg)"></span> |
| `--spacing_inset-huge` | 48px | <span class="bar" style="width: var(--spacing_inset-huge)"></span> |
| `--spacing_inset-giant` | 56px | <span class="bar" style="width: var(--spacing_inset-giant)"></span> |

?> As duas escalas compartilham nomes de passo até `nano` e divergem depois:
`--spacing-xs` é 32px enquanto `--spacing_inset-xs` é 16px. Ler o nome do passo
sem a escala não diz nada — carregue sempre o prefixo.

## Na prática

O atributo `spacing` do `<kb-stack>` resolve contra a escala **inset**, que é o
que mantém o gap dentro de um grupo proporcional ao padding em volta:

```html preview
<kb-stack direction="column" spacing="nano" align="stretch">
  <kb-card>
    <kb-text size="xxs">Gap de spacing_inset-nano entre estes cards</kb-text>
  </kb-card>
  <kb-card>
    <kb-text size="xxs">…e o padding do próprio card é spacing_inset-xs</kb-text>
  </kb-card>
</kb-stack>
```

| Passo | Use para |
|---|---|
| `quarck` / `nano` | Elementos que se leem como uma unidade — um ícone e seu rótulo, um campo e seu texto de apoio. |
| `xs` | O padrão: irmãos dentro de um grupo. |
| `sm` / `md` | Separar grupos entre si dentro de uma seção. |
| `lg` em diante | Separação em nível de seção. |
