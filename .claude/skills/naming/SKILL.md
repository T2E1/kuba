---
name: naming
model: sonnet
description: Convenção de nomes deste repositório — classes de custom element em PascalCase espelhando o tag name, mixins como função que recebe a superclasse e devolve a classe, campos privados `#` espelhando o acessor público, contratos Symbol com sufixo `-able` para capacidade e `verbCallback` para ciclo de vida, funções utilitárias de palavra única com arquivo homônimo, e `component`/`style` com o parâmetro nomeado pelo elemento. Use ao criar classe, mixin, método, getter, setter, contrato Symbol, função utilitária ou arquivo novo em `packages/`, e ao revisar nome que não segue o padrão. Não use para nomear design tokens — use a skill token.
---

# Naming

## O que é

O vocabulário de nomes de `packages/`. Cada categoria de construto tem uma forma fixa, e
a forma carrega informação: pelo nome se sabe se algo é um mixin, um contrato de
capacidade, um hook de ciclo de vida ou um filtro puro.

As rules 006, 034 e 035 dão os princípios gerais — nome por extenso, classe é
substantivo, método é verbo, nome não mente. Esta skill é a aplicação deles às
construções que existem aqui.

## Quando usar

| Situação | Ação |
|---|---|
| Criando custom element | Classe PascalCase espelhando o tag |
| Criando mixin | `Super => class C`, PascalCase |
| Criando contrato Symbol | Sufixo pela natureza do contrato |
| Criando função utilitária, filtro ou directive | Palavra única, arquivo homônimo |
| Nomeando campo privado | Espelha o acessor público |
| Criando arquivo num pacote | Nome canônico da tabela |

Não use para design tokens — a taxonomia por níveis é a skill `token`.

## Como aplicar

### Custom element

| Construto | Forma | Exemplo |
|---|---|---|
| Classe | PascalCase, substantivo singular | `Button`, `Fileupload` |
| Tag | `kb-` + o mesmo nome em minúsculas | `kb-button`, `kb-fileupload` |
| Export | `export default Button` no fim do arquivo | — |

O tag é **palavra única sem hífen interno**: `kb-fileupload`, não `kb-file-upload`. A
classe é a mesma palavra em PascalCase — `Fileupload`. É o que permite derivar um do
outro sem tabela de exceções, e é a premissa de `<PascalName>` na skill `types`.

### Mixin

Função que recebe `Super` e devolve a classe. Nome em PascalCase, adjetivo ou substantivo
de capacidade: `Hidden`, `Width`, `Value`, `Identity`, `Headless`.

A classe interna chama-se **sempre `C`** — ela não tem identidade própria, é o produto da
composição. Nomeá-la sugeriria que ela existe fora dali.

### Campos, getters e setters

Campo privado `#camelCase` espelhando exatamente o acessor público: `#alt`/`alt`,
`#internals`/`internals`. Getter antes do setter (skill `anatomy`), com o default no
getter via `??=`.

### Métodos

camelCase, verbo imperativo: `click()`, `go()`, `clear()`. Sem prefixo, sem underscore.

### Contratos Symbol

O sufixo **classifica o contrato**: pelo nome se sabe quem chama o método, quando e o
que ele faz. O nome se deriva por três perguntas, nesta ordem:

```
1. Quem invoca?          → a FORMA
2. Sobre qual conceito?  → a RAIZ
3. Atravessa pacote?     → Symbol() ou Symbol.for()
```

| Quem invoca | Forma | Natureza | Exemplos |
|---|---|---|---|
| Decorator, publicando semântica na plataforma | `<raiz>able` | Capacidade | `hideable`, `variantable`, `measurable`, `identifiable`, `validatable` |
| Decorator, como passo mecânico | verbo imperativo | Transformação | `cleanup`, `abort`, `dispatch`, `resize` |
| Decorator de evento DOM (`@on.*`) | particípio | Fato consumado | `submitted`, `resetted`, `rendered` |
| Pipeline de renderização | `<momento>Callback` | Ciclo de vida | `willPaintCallback`, `htmlCallback` |
| Outro pacote | `verbNoun` | Operação exportada | `connectArc`, `setHeader` |
| Ninguém — é um valor guardado | substantivo | Recurso | `controller`, `role`, `setter` |
| Verificação booleana | `is<Estado>` | Predicado | `isPainted` |

**Teste do `-able`:** o nome tem de caber na frase *"este elemento é ___"*. `hideable`,
`measurable`, `identifiable` cabem. Se não cabe, não é capacidade — é transformação, e
leva verbo.

A fronteira entre os dois está lado a lado em `mixin/hidden/hidden.ts`: `[cleanup]`
remove o atributo (mecânica, verbo) e `[hideable]` reflete o estado em
`internals.states` (semântica publicada, `-able`).

Três regras que valem para todos:

1. **A descrição é idêntica ao nome da constante.** `Symbol('hideable')`, nunca
   `Symbol('hide state')` — é o que aparece no stack trace e o que torna o símbolo
   pesquisável pelo nome do import.
2. **`Symbol.for()` só quando o contrato atravessa pacotes ou bundles**; `Symbol()` no
   resto, com o porquê comentado — como em `echo/interfaces.js` e `dom/interfaces.js`.
3. **JSDoc citando o decorator acionador e o arquivo**, para que o `interfaces.js` se
   explique sem abrir a implementação.

Derivação completa, inventário dos 30 contratos e fluxo passo a passo em
[taxonomia-symbol.md](references/taxonomia-symbol.md).

### Funções utilitárias, directives e filtros

Palavra única em camelCase, e o **nome do arquivo é o nome da função é o nome do export
default**: `prevent.js` → `function prevent` → `export default prevent`. Multi-palavra
quando inevitável, em camelCase: `attributeChanged.js`, `customEvent.js`, `formData.js`.

Filtros e directives usam a forma que descreve o que fazem no ponto de uso: `stop`,
`prevent`, `value`, `detail`, `before`, `after`, `around`, `connected`.

### Arquivos canônicos do pacote

| Arquivo | Conteúdo |
|---|---|
| `<nome>.ts` | Implementação |
| `component.js` | Função `component` |
| `style.js` | Função `style` |
| `element.js` | Elemento interno associado (formulários) |
| `interfaces.js` | Symbols de contrato — **plural, sempre**, mesmo com um só |
| `index.js` | Superfície pública |
| `types.d.ts` | Contrato tipado |
| `<nome>.stories.js` | Story do Storybook |
| `<nome>.test.js` | Teste |

As funções em `component.js` e `style.js` chamam-se sempre `component` e `style`. O
**parâmetro é nomeado pelo elemento** — `component(button)`, `style(card)`,
`style(progress)` — e é omitido quando não usado. Nunca `self`: com quinze `style.js`
abertos, o parâmetro é o que identifica qual componente está ali.

### Decorators

Palavra única em camelCase, nomeando **o momento ou o efeito**, nunca o mecanismo:

| Família | Nomes |
|---|---|
| Ciclo de vida do elemento | `connected`, `disconnected`, `adopted`, `attributeChanged` |
| Ciclo de vida do formulário | `formAssociated`, `formDisabled`, `formReset`, `formStateRestore` |
| Renderização | `paint`, `repaint`, `retouch` |
| Middleware | `before`, `after`, `around` |
| Definição | `define`, `execute` |

Lidos no ponto de uso, formam frase: `@attributeChanged('color')`, `@before(cleanup)`,
`@on.click('*', stop)`.

### Eventos customizados

Minúsculas, **verbo no particípio** — o evento anuncia um fato consumado, não um pedido:
`clicked`, `submitted`, `uploaded`. Nunca `onClick` (isso é handler) nem `doSubmit`
(isso é comando). Nome usado em mais de um lugar vira constante (skill `enum`).

### Tag names

`kb-` + palavra única em minúsculas, sem hífen interno: `kb-fileupload`, `kb-textarea`,
`kb-progress`. A classe é a mesma palavra em PascalCase.

## Exemplos

| Caso | Correto | Incorreto |
|---|---|---|
| Classe, campos, acessores e método de custom element | [element.valid.ts](examples/element.valid.ts) | [element.invalid.ts](examples/element.invalid.ts) |
| Contratos Symbol por natureza, e `Symbol` vs `Symbol.for` | [contracts.valid.js](examples/contracts.valid.js) | [contracts.invalid.js](examples/contracts.invalid.js) |
| Mixin, função utilitária e funções do pacote | [module.valid.js](examples/module.valid.js) | [module.invalid.js](examples/module.invalid.js) |

## Checklist

- [ ] Classe em PascalCase igual ao segmento do tag
- [ ] Tag `kb-` + palavra única, sem hífen interno
- [ ] Mixin em PascalCase, classe interna nomeada `C`
- [ ] Campo privado espelhando o acessor público
- [ ] Sufixo do Symbol coerente com a natureza do contrato
- [ ] Descrição do Symbol idêntica ao nome da constante
- [ ] `Symbol.for()` só onde atravessa pacote, com o porquê comentado
- [ ] JSDoc do Symbol citando o decorator acionador e o arquivo
- [ ] Arquivo, função e export default com o mesmo nome
- [ ] `interfaces.js` no plural
- [ ] Parâmetro de `component`/`style` nomeado pelo elemento, nunca `self`
- [ ] Evento customizado no particípio
- [ ] Nenhuma abreviação fora de acrônimo ubíquo (rule 006)

## Troubleshooting

### O tag tem duas palavras e não sei se leva hífen

**Causa:** a especificação de custom elements exige ao menos um hífen, e `kb-` já o
fornece.
**Solução:** o segmento após `kb-` é palavra única — `kb-fileupload`. Isso mantém a
derivação `Fileupload` mecânica, que a skill `types` pressupõe.

### O contrato é uma capacidade mas `-able` soa forçado

**Causa:** nem todo conceito tem adjetivo natural em `-able`.
**Solução:** adjetivo simples resolve, como `decorative`. O que não vale é cair em
substantivo, que sinalizaria recurso e não capacidade.

### Dois pacotes precisam do mesmo Symbol e não se reconhecem

**Causa:** `Symbol()` produz identidade nova a cada chamada.
**Solução:** é exatamente o caso de `Symbol.for()`. Documentar o porquê no arquivo, como
`echo/interfaces.js` faz.

### O parâmetro de `style` está como `self`

**Causa:** convenção antiga, ainda presente em quatro arquivos.
**Solução:** o padrão dominante é o nome do elemento (`style(card)`). `self` não diz que
elemento é, e a Regra do Escoteiro (rule 039) pede a correção ao tocar o arquivo.

### O contrato é um passo mecânico mas quis chamá-lo de `-able`

**Causa:** o sufixo `-able` aplicado por hábito, não por natureza.
**Solução:** `-able` é para quem **publica semântica na plataforma** (`internals.states`,
`role`, ARIA). Passo mecânico leva verbo — é a diferença entre `[hideable]` e `[cleanup]`
em `mixin/hidden/hidden.ts`.

## Referências

- `references/taxonomia-symbol.md` — derivação dos nomes de contrato pelas três perguntas,
  inventário completo dos 30 Symbols do repositório, e exemplo trabalhado.

## Rules relacionadas

- [034 — Nomes de Classes e Métodos Consistentes](../../rules/034_nomes-classes-metodos-consistentes.md): classe é substantivo, método é verbo, `PascalCase` e `camelCase`.
- [035 — Proibição de Nomes Enganosos](../../rules/035_proibicao-nomes-enganosos.md): o sufixo do Symbol promete a natureza do contrato — e precisa cumprir.
- [006 — Proibição de Nomes Abreviados](../../rules/006_proibicao-nomes-abreviados.md): nome por extenso; a descrição do Symbol é o que se lê ao depurar.
- [024 — Proibição de Constantes Mágicas](../../rules/024_proibicao-constantes-magicas.md): nome de atributo e evento vira constante nomeada, como `on` em `echo/interfaces.js`.
- [022 — Simplicidade e Clareza](../../rules/022_priorizacao-simplicidade-clareza.md): arquivo, função e export com o mesmo nome eliminam a indireção mental.
- [013 — Segregação de Interfaces](../../rules/013_principio-segregacao-interfaces.md): um Symbol, um contrato.
- [039 — Regra do Escoteiro](../../rules/039_regra-escoteiro-refatoracao-continua.md): nome fora do padrão no arquivo tocado é corrigido.

## Skills relacionadas

- [bracket](../bracket/SKILL.md): depends on — decide quando usar Symbol; esta decide como nomeá-lo.
- [anatomy](../anatomy/SKILL.md): complements — a ordem dos membros que estes nomes ocupam.
- [types](../types/SKILL.md): depends on — a taxonomia `KUBA<PascalName>Element` deriva do nome da classe.
- [mixin](../mixin/SKILL.md): complements — a forma da função que estes nomes descrevem.
- [enum](../enum/SKILL.md): reinforces — `UPPER_SNAKE_CASE` para as constantes de valor.
- [token](../token/SKILL.md): complements — a taxonomia paralela, para nomes de design token.
- [revelation](../revelation/SKILL.md): complements — o `index.js` reexporta com estes nomes.
- [method](../method/SKILL.md): reinforces — verbo imperativo revelando intenção.

---

**Criado em**: 2026-08-10
**Atualizado em**: 2026-08-10
**Versão**: 1.0
