# ✅ §05 com decomposição em níveis, sem detalhe de código

```markdown
# §05 — Visão de Blocos de Construção

## Nível 1 — Visão geral do sistema

| Bloco | Responsabilidade |
|---|---|
| `src/` | Custom elements publicados, um por diretório |
| `packages/mixin/` | Comportamento reutilizável entre elementos |
| `packages/infrastructure/` | Utilitários de baixo nível (Echo, decorators) |

## Nível 2 — Dentro de `src/button/`

| Bloco | Responsabilidade |
|---|---|
| `component.js` | Classe do custom element, composição de mixins |
| `style.js` | Tokens e CSS-in-JS do Shadow DOM |
| `types.d.ts` | Contrato público — attributes, properties, events |

## Justificativa da decomposição

A fronteira entre Nível 1 e Nível 2 segue `colocation`: tudo que muda junto
para o mesmo componente fica no mesmo diretório. Nenhum bloco do Nível 2
aparece descontextualizado no Nível 1 — quem lê a visão geral não precisa
saber que `style.js` existe até abrir o bloco correspondente.
```

## O que torna isso legível

| Elemento | Papel |
|---|---|
| Um nível por seção | Quem lê o Nível 1 não é forçado a entender `component.js` |
| Responsabilidade em uma frase | Cada bloco responde "por que existe", não "o que contém" |
| Justificativa da fronteira | Liga a decomposição a um critério do repositório, não a gosto |

O par com `c4-model` é direto: Nível 1 aqui é o Container do C4, Nível 2 é o
Component — a mesma disciplina de não misturar granularidade.
