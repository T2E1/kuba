# Cores

Os tokens trocados por marca e por tema, definidos em
`packages/pixel/tokens/color.css`.

Toda cor é declarada com o `light-dark()` do CSS, carregando um valor claro e um
escuro num único token:

```css
--color-master-dark: light-dark(#2c2c2c, #c9c9c9);
```

Qual deles se aplica é decidido pelo `color-scheme` da página — veja
[Modo escuro](/pt-br/build-ui/theming) para saber como ativar. As amostras abaixo
renderizam o valor ativo no seu navegador agora.

Cada família tem cinco tons (`lighter`, `light`, base, `dark`, `darker`), exceto
`master`, com sete, e `menu`, com três.

## Master

A escala neutra — texto, superfícies e bordas. A base de qualquer composição,
independente da marca.

| | Token | Claro | Escuro |
|---|---|---|---|
| <span class="swatch" style="background: var(--color-master-lightest)"></span> | `--color-master-lightest` | `#fafafa` | `#1f1f1f` |
| <span class="swatch" style="background: var(--color-master-lighter)"></span> | `--color-master-lighter` | `#f0f0f0` | `#3d3d3d` |
| <span class="swatch" style="background: var(--color-master-light)"></span> | `--color-master-light` | `#e6e6e6` | `#5c5c5c` |
| <span class="swatch" style="background: var(--color-master)"></span> | `--color-master` | `#626262` | `#a3a3a3` |
| <span class="swatch" style="background: var(--color-master-dark)"></span> | `--color-master-dark` | `#2c2c2c` | `#c9c9c9` |
| <span class="swatch" style="background: var(--color-master-darker)"></span> | `--color-master-darker` | `#1a1a1a` | `#e1e1e1` |
| <span class="swatch" style="background: var(--color-master-darkest)"></span> | `--color-master-darkest` | `#0a0a0a` | `#f5f5f5` |

Repare que a rampa **inverte** entre os modos: `master-lightest` é a superfície
mais clara no modo claro e a mais escura no escuro. É isso que faz um componente
estilizado com passos da rampa funcionar nos dois sem um único override.

## Primary

Os tons principais da marca — botões e elementos interativos.

| | Token |
|---|---|
| <span class="swatch" style="background: var(--color-primary-lighter)"></span> | `--color-primary-lighter` |
| <span class="swatch" style="background: var(--color-primary-light)"></span> | `--color-primary-light` |
| <span class="swatch" style="background: var(--color-primary)"></span> | `--color-primary` |
| <span class="swatch" style="background: var(--color-primary-dark)"></span> | `--color-primary-dark` |
| <span class="swatch" style="background: var(--color-primary-darker)"></span> | `--color-primary-darker` |

## Complete

Status de conclusão, progresso, sucesso informativo.

| | Token |
|---|---|
| <span class="swatch" style="background: var(--color-complete-lighter)"></span> | `--color-complete-lighter` |
| <span class="swatch" style="background: var(--color-complete-light)"></span> | `--color-complete-light` |
| <span class="swatch" style="background: var(--color-complete)"></span> | `--color-complete` |
| <span class="swatch" style="background: var(--color-complete-dark)"></span> | `--color-complete-dark` |
| <span class="swatch" style="background: var(--color-complete-darker)"></span> | `--color-complete-darker` |

## Success

Confirmações e desfechos positivos.

| | Token |
|---|---|
| <span class="swatch" style="background: var(--color-success-lighter)"></span> | `--color-success-lighter` |
| <span class="swatch" style="background: var(--color-success-light)"></span> | `--color-success-light` |
| <span class="swatch" style="background: var(--color-success)"></span> | `--color-success` |
| <span class="swatch" style="background: var(--color-success-dark)"></span> | `--color-success-dark` |
| <span class="swatch" style="background: var(--color-success-darker)"></span> | `--color-success-darker` |

## Warning

Alertas que pedem atenção mas não bloqueiam o fluxo.

| | Token |
|---|---|
| <span class="swatch" style="background: var(--color-warning-lighter)"></span> | `--color-warning-lighter` |
| <span class="swatch" style="background: var(--color-warning-light)"></span> | `--color-warning-light` |
| <span class="swatch" style="background: var(--color-warning)"></span> | `--color-warning` |
| <span class="swatch" style="background: var(--color-warning-dark)"></span> | `--color-warning-dark` |
| <span class="swatch" style="background: var(--color-warning-darker)"></span> | `--color-warning-darker` |

## Danger

Erros e ações destrutivas.

| | Token |
|---|---|
| <span class="swatch" style="background: var(--color-danger-lighter)"></span> | `--color-danger-lighter` |
| <span class="swatch" style="background: var(--color-danger-light)"></span> | `--color-danger-light` |
| <span class="swatch" style="background: var(--color-danger)"></span> | `--color-danger` |
| <span class="swatch" style="background: var(--color-danger-dark)"></span> | `--color-danger-dark` |
| <span class="swatch" style="background: var(--color-danger-darker)"></span> | `--color-danger-darker` |

## Info

Tons informativos — texto de apoio, notificações neutras.

| | Token |
|---|---|
| <span class="swatch" style="background: var(--color-info-lighter)"></span> | `--color-info-lighter` |
| <span class="swatch" style="background: var(--color-info-light)"></span> | `--color-info-light` |
| <span class="swatch" style="background: var(--color-info)"></span> | `--color-info` |
| <span class="swatch" style="background: var(--color-info-dark)"></span> | `--color-info-dark` |
| <span class="swatch" style="background: var(--color-info-darker)"></span> | `--color-info-darker` |

## Menu

Superfícies de navegação — barras laterais, menus. Três tons em vez de cinco,
já que menus raramente precisam de gradação fina.

| | Token |
|---|---|
| <span class="swatch" style="background: var(--color-menu-light)"></span> | `--color-menu-light` |
| <span class="swatch" style="background: var(--color-menu)"></span> | `--color-menu` |
| <span class="swatch" style="background: var(--color-menu-dark)"></span> | `--color-menu-dark` |

## Pure

| | Token | Valor |
|---|---|---|
| <span class="swatch" style="background: var(--color-pure-white)"></span> | `--color-pure-white` | `#fff` |
| <span class="swatch" style="background: var(--color-pure-black)"></span> | `--color-pure-black` | `#000` |

Os dois únicos tokens sem variação `light-dark()` — representam os extremos
absolutos da escala, não uma cor semântica, então não mudam com o tema.

!> Isso também os torna os dois a evitar numa superfície que responde ao tema. Um
fundo `--color-pure-white` continua branco no modo escuro; use
`--color-master-lightest` quando quiser dizer "a superfície mais clara", não
"branco".

## Usando cor

Escolha pelo significado, não pela aparência:

```html preview
<kb-stack direction="row" spacing="nano">
  <kb-button color="primary">Salvar</kb-button>
  <kb-button color="danger">Excluir</kb-button>
  <kb-button color="success">Confirmar</kb-button>
</kb-stack>
```

Qualquer sufixo de `--color-*` funciona no atributo `color` de um elemento — o
valor é interpolado em `var(--color-{valor})`, então um nome desconhecido resolve
silenciosamente para nada em vez de falhar de forma visível.
