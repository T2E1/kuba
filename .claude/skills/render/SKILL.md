---
name: render
model: sonnet
description: Renderização de custom elements pelos decorators `paint`, `repaint` e `retouch` — `paint` monta HTML e CSS na conexão, `repaint` reprocessa template e estilos quando a estrutura muda, `retouch` recalcula só os estilos quando apenas a aparência muda. Use ao criar componente visual, ao decidir qual decorator um setter recebe, ou ao investigar re-render desnecessário. Não use para estado que só afeta CSS via `:state()` — use a skill state.
---

# Render

## O que é

Três decorators cobrem todo o ciclo visual de um componente. A decisão que importa é
entre os dois de re-render:

| Decorator | Escopo | Renderiza | Custo |
|---|---|---|---|
| `paint` | Classe | HTML + CSS inicial | Uma vez, na conexão |
| `repaint` | Setter ou método | HTML + CSS | Alto — reprocessa template |
| `retouch` | Setter ou método | Só CSS | Baixo |

A regra: **se só a aparência muda, é `retouch`**. Usar `repaint` onde `retouch` bastaria
reprocessa o template inteiro para trocar uma cor.

## Quando usar

| Mudança | Decorator |
|---|---|
| `src`, `use`, `fallback` | `repaint` — o conteúdo muda |
| `color`, `size`, `variant` | `retouch` — só estilo |
| Texto interno | `repaint` |
| Visibilidade (display, opacity) | `retouch` |
| Adicionar ou remover elemento | `repaint` |
| Tema (variáveis CSS) | `retouch` |
| Limpar formulário | `repaint` |

## Como aplicar

### Ciclo de renderização

| Fase | Callback |
|---|---|
| Antes | `willPaintCallback` |
| HTML | `htmlCallback` |
| CSS | `cssCallback` |
| Depois | `didPaintCallback` |

`repaint` percorre `willPaint → html → css → didPaint`. `retouch` chama apenas
`cssCallback`.

### Garantias do sistema

- **Assíncrono.** Ambos usam `setImmediate`, então não bloqueiam a thread e agrupam
  atualizações do mesmo tick — várias atribuições em sequência produzem um render só.
- **Guard `isPainted`.** Nada renderiza antes de o componente estar conectado. É por isso
  que não se renderiza no constructor.

### As funções `component` e `style`

`paint` recebe as duas. Ambas são **puras** (rule 036): recebem o estado e devolvem
markup ou estilo, sem tocar o DOM nem disparar efeito. É o que torna o render previsível
e testável.

Os valores de estilo vêm de tokens, nunca de literais — skill `token`.

## Exemplos

| Caso | Correto | Incorreto |
|---|---|---|
| `retouch` para mudança de estilo, `repaint` para estrutura | [decorator-choice.valid.js](examples/decorator-choice.valid.js) | [decorator-choice.invalid.js](examples/decorator-choice.invalid.js) |

## Checklist

- [ ] Nenhum `repaint` onde `retouch` bastaria
- [ ] Nenhuma renderização no constructor
- [ ] `component` e `style` puras — sem efeito colateral
- [ ] Estilos usando tokens, não literais
- [ ] Nenhuma manipulação manual do DOM fora do ciclo
- [ ] Setter de estado usando `around` + contrato, não `repaint`/`retouch`

## Troubleshooting

### O componente re-renderiza várias vezes na inicialização

**Causa:** vários setters com `repaint` disparando na sequência de atributos.
**Solução:** `setImmediate` já agrupa o mesmo tick. Se persiste, algum setter dispara
render fora do tick — verificar se há `await` entre as atribuições.

### Mudar a cor recria o DOM inteiro e o foco se perde

**Causa:** `repaint` num setter que só afeta estilo.
**Solução:** `retouch`. A perda de foco é o sintoma clássico de `repaint` desnecessário.

### O render não acontece

**Causa:** o guard `isPainted` bloqueou — o componente ainda não conectou.
**Solução:** `paint` roda no `connectedCallback`. Se algo precisa acontecer antes, não é
renderização.

### O estado mudou mas o CSS não reagiu

**Causa:** estado não se renderiza — se reflete em `internals.states`.
**Solução:** skill `state`. O CSS reage por `:state()`, sem passar pelo ciclo de render.

## Rules relacionadas

- [036 — Restrição de Efeitos Colaterais](../../rules/036_restricao-funcoes-efeitos-colaterais.md): `component` e `style` são puras.
- [069 — Proibição de Otimização Prematura](../../rules/069_proibicao-otimizacao-prematura.md): escolher `retouch` não é otimização especulativa — é usar o decorator correto.
- [022 — Simplicidade e Clareza](../../rules/022_priorizacao-simplicidade-clareza.md): o ciclo tem quatro fases nomeadas, sem controle manual.
- [010 — Responsabilidade Única](../../rules/010_principio-responsabilidade-unica.md): HTML e CSS em funções separadas.
- [024 — Constantes Mágicas](../../rules/024_proibicao-constantes-magicas.md): valores de estilo são tokens.

## Skills relacionadas

- [setter](../setter/SKILL.md): depends on — é onde `repaint` e `retouch` são aplicados.
- [constructor](../constructor/SKILL.md): depends on — o render acontece depois, nunca ali.
- [token](../token/SKILL.md): depends on — os valores que a função `style` consome.
- [state](../state/SKILL.md): complements — estado não passa pelo ciclo de render.
- [anatomy](../anatomy/SKILL.md): depends on — onde os callbacks do ciclo são declarados.
- [big-o](../big-o/SKILL.md): complements — render em lista grande é onde o custo aparece.

---

**Criado em**: 2026-04-01
**Atualizado em**: 2026-08-10
**Versão**: 2.0
