---
name: method
model: sonnet
description: Forma dos métodos de classe — nome em verbo imperativo revelando intenção, `return this` em comandos para habilitar encadeamento fluente, guard clauses no lugar de `else`, até 3 parâmetros e 15 linhas, e decorators de ciclo de vida (`connected`, `disconnected`, `didPaint`, `on.*`). Use ao criar método de ação numa classe, ao nomear uma operação de domínio, ou ao revisar método que não retorna nada e impede encadeamento. Não use para leitura ou escrita de um campo — use as skills getter e setter.
---

# Method

## O que é

A convenção para métodos que **fazem** alguma coisa — as operações do objeto, distintas
dos acessores. Duas decisões definem a forma: o nome carrega a intenção de negócio, e o
retorno é `this` quando o método é comando.

## Quando usar

| Situação | Ação |
|---|---|
| Operação de negócio no objeto | Método com nome de intenção |
| Coordenação entre colaboradores | Método |
| Resposta a evento ou ciclo de vida | Método com decorator |
| Ler ou escrever um campo | Não é aqui — `getter` / `setter` |

## Como aplicar

### Nomenclatura

Verbo imperativo que revela a intenção de negócio, não a mecânica interna (rule 034).
`cancelar(motivo)`, não `setStatus('cancelado')`. `agendarReuniao()`, não
`updateFlag(true)`.

Nomes genéricos como `process`, `handle` e `execute` sinalizam que a responsabilidade
não foi definida — se o método faz algo específico, o nome pode dizer o quê.

### Retorno

| Situação | Retorno |
|---|---|
| Comando que altera estado | `this` — habilita encadeamento |
| Consulta com valor | O valor |
| Comando assíncrono | `this` via Promise |
| Handler de evento | Livre |

O `return this` é o que permite a interface fluente. Não se aplica a consultas — misturar
comando e consulta no mesmo método viola CQS (rule 038).

### Decorators de ciclo de vida

| Decorator | Momento |
|---|---|
| `on.{event}` | Vincula o método a um evento DOM |
| `connected` | Elemento entrou no documento |
| `disconnected` | Elemento saiu do documento |
| `didPaint` | Depois da renderização |
| `before` / `after` / `around` | Envolvem o método principal — `around` é o que liga um setter a seu método de contrato de estado (skill `state`) |

### Limites

- Até 3 parâmetros (rule 033). Acima disso, Parameter Object.
- Até 15 linhas (rule 007).
- CC até 5 (rule 022).
- Guard clause em vez de `else` (rule 002).
- Uma responsabilidade (rule 010). Num método de contrato de estado (`[algoAvel]()`,
  skill `state`), a responsabilidade é o estado que o próprio Symbol nomeia — nunca
  também a atribuição do campo, que já é do setter que o `around` chamou antes.

## Exemplos

| Caso | Correto | Incorreto |
|---|---|---|
| Nome de intenção e `return this` para encadeamento | [fluent.valid.js](examples/fluent.valid.js) | [fluent.invalid.js](examples/fluent.invalid.js) |

## Checklist

- [ ] Nome começa com verbo imperativo e revela intenção
- [ ] Nenhum nome genérico (`process`, `handle`, `execute`) escondendo responsabilidade
- [ ] Comandos retornam `this`
- [ ] Nenhum método híbrido comando + consulta
- [ ] Até 3 parâmetros, até 15 linhas, CC até 5
- [ ] Nenhum `else` — guard clauses
- [ ] Efeito colateral anunciado pelo nome
- [ ] Nenhum método concentra mais de uma responsabilidade — cada uma extraída para seu próprio método/Symbol
- [ ] Todo método sem valor de retorno próprio devolve `this`

## Troubleshooting

### O método faz duas coisas e o nome tem "e"

**Causa:** `validateAndSave` é duas responsabilidades declaradas no próprio nome.
**Solução:** dois métodos. O nome já diagnosticou (rule 010).

### O método faz mais de uma coisa e a Complexidade Ciclomática sobe

**Causa:** responsabilidades diferentes (ex.: interagir com o form e notificar um evento)
acumuladas no mesmo método elevam a CC e misturam duas razões para mudar — mesmo sem um
`else` ou um nome com "e" no meio (rule 010, rule 022).
**Solução:** cada responsabilidade vira seu próprio método, endereçado por Symbol (skill
`bracket`) quando é privado à classe, orquestrado por `before`/`around`/`after` (skill
`middleware`) em vez de chamado inline. Cada método resultante mira CC 1: um único
caminho de execução, uma única razão de existir. Precedente: `dispatch` em
`src/form/input/input.ts` e `src/form/fileupload/fileupload.ts`.

### Um método sem valor de retorno próprio quebra o encadeamento

**Causa:** depois de extrair a responsabilidade que exigia devolver um valor (ex.:
`detail` de um evento), o método que sobra não tem nada natural para retornar.
**Solução:** `return this` — é comando, não consulta (CQS, rule 038). Vale tanto para o
método público quanto para o método por Symbol extraído; nenhum dos dois deve devolver
`undefined` por omissão.

### `return this` num método que devolve valor

**Causa:** a regra do encadeamento aplicada onde não cabe.
**Solução:** `return this` é para comando. Consulta devolve o valor — CQS (rule 038).

### O encadeamento ficou difícil de depurar

**Causa:** cadeia longa numa linha só.
**Solução:** uma chamada por linha (rule 005). O encadeamento fluente é a exceção
permitida da regra, mas a legibilidade continua valendo.

## Rules relacionadas

- [034 — Nomes Consistentes](../../rules/034_nomes-classes-metodos-consistentes.md): método é verbo, em `camelCase`.
- [009 — Diga, Não Pergunte](../../rules/009_diga-nao-pergunte.md): o método é a forma de dizer.
- [038 — Separação Command-Query](../../rules/038_conformidade-principio-inversao-consulta.md): comando devolve `this`; consulta devolve valor.
- [010 — Responsabilidade Única](../../rules/010_principio-responsabilidade-unica.md): uma responsabilidade por método.
- [033 — Limite de Parâmetros](../../rules/033_limite-parametros-funcao.md): máximo 3.
- [007 — Máximo de Linhas](../../rules/007_limite-maximo-linhas-classe.md) e [055 — Linhas por Método](../../rules/055_limite-maximo-linhas-metodo.md): 15 linhas.
- [002 — Proibição de ELSE](../../rules/002_proibicao-clausula-else.md): guard clauses.
- [037 — Argumentos Sinalizadores](../../rules/037_proibicao-argumentos-sinalizadores.md): nenhuma flag decidindo o caminho.

## Skills relacionadas

- [anatomy](../anatomy/SKILL.md): depends on — métodos formam o grupo 5.
- [getter](../getter/SKILL.md) e [setter](../setter/SKILL.md): complements — o que é acessor não é método.
- [bracket](../bracket/SKILL.md): complements — método privado por Symbol.
- [complexity](../complexity/SKILL.md): reinforces — o limite de CC 5 se aplica aqui.
- [event](../event/SKILL.md): complements — métodos decorados com `on.*` respondem a eventos.
- [gof](../gof/SKILL.md): complements — a interface fluente é o Builder.

---

**Criado em**: 2026-04-01
**Atualizado em**: 2026-08-21
**Versão**: 2.2
