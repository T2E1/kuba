# Level 4 — Code

[Descrição da implementação interna de um componente específico em código. Mostra as classes, mixins e contratos que compõem o componente, os padrões aplicados e como se relacionam. Este nível é destinado ao desenvolvedor que vai implementar ou modificar o componente.]

Este nível raramente vale a pena manter escrito: ele envelhece a cada commit. Documente-o
apenas para o elemento cuja composição é difícil de deduzir lendo o arquivo.

## Componente em Foco: [Nome do Componente]

[Identificar qual componente está sendo detalhado. Ex: "`<kb-button>` — elemento de `src/component/button/`, que despacha `clicked` e participa de formulários."]

## Diagrama de Composição

Num sistema de custom elements, o Level 4 mostra a **cadeia de mixins** e os **contratos de
Symbol** — não hierarquia de herança única nem injeção de dependência.

```
┌─────────────────────────────────────────────────────────────────────┐
│                [NomeDoElemento] — cadeia de mixins                   │
│                                                                     │
│   HTMLElement                                                       │
│        ▲                                                            │
│        │ estende                                                    │
│   [Mixin de dimensão]     ex: Width(HTMLElement)                    │
│        ▲                                                            │
│        │                                                            │
│   [Mixin de valor]        ex: Value(...)                            │
│        ▲                                                            │
│        │                                                            │
│   [Mixin de visibilidade] ex: Hidden(...)                           │
│        ▲                                                            │
│        │                                                            │
│   Echo                    obrigatório para despachar evento         │
│        ▲                                                            │
│        │                                                            │
│   [NomeDoElemento]                                                  │
│   ┌──────────────────────────────────────────┐                      │
│   │ #campoPrivado                            │                      │
│   │ #internals    ← um único attachInternals │                      │
│   │                                          │                      │
│   │ get propriedade()                        │                      │
│   │ set propriedade(valor)  @attributeChanged│                      │
│   │ [contratoSymbol]()      bracket notation │                      │
│   └──────────────────────────────────────────┘                      │
│                                                                     │
│   Os mixins são aplicados da direita para a esquerda:               │
│   Echo(Hidden(Value(Width(HTMLElement))))                           │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│                [NomeDoElemento] — decorators e contratos             │
│                                                                     │
│  @define('[prefixo]-[nome]')   registra no customElements           │
│  @paint(component, style)      escreve o shadow root                │
│  @attributeChanged('[attr]')   reflete atributo em propriedade      │
│  @before([validador])          valida antes de atribuir             │
│  @on.[evento]                  escuta no shadowRoot                 │
│  @dispatchEvent('[nome]')      despacha, com composed: true         │
│                                                                     │
│  interfaces.js:                                                     │
│    Symbol('[nome]')      contrato interno ao pacote                 │
│    Symbol.for('[nome]')  contrato que atravessa pacote              │
└─────────────────────────────────────────────────────────────────────┘
```

## Tabela de Arquivos do Pacote

| Arquivo | Papel | Responsabilidade | Restrição |
|---------|-------|-----------------|-----------|
| `[nome].ts` | Classe do elemento | Estado privado, propriedades, comportamento | Máximo 50 linhas (rule 007) |
| `component.js` | Markup | Estrutura do shadow root, via `html` | Sem lógica de negócio |
| `style.js` | Estilo | CSS via `css`, com token e custom property | Zero valor fixo temático (rule 024) |
| `interfaces.js` | Contratos | Os Symbols que o pacote publica | Nome pela taxonomia da skill `naming` |
| `index.js` | Fachada | Só o que é público | Nada além do necessário |
| `types.d.ts` | Contrato público | Atributo, propriedade, evento | É o que quebra consumidor se mudar |
| `[nome].test.js` | Testes | Comportamento pela superfície pública | Navegador real, sem mock de módulo |

## Restrições de Implementação

| Restrição | Regra | Critério |
|-----------|-------|---------|
| Máximo 50 linhas por classe | rule 007 | Excluindo linhas em branco e comentários |
| Máximo 15 linhas por método | rule 055 | Excluindo linhas em branco |
| Máximo 3 parâmetros por função | rule 033 | Usar objeto de parâmetro para mais de 3 |
| Complexidade ciclomática ≤ 5 | rule 022 | Por método |
| Zero getters/setters puros | rule 008 | Método com intenção de domínio |
| Zero import com `../` | rule 031 | Path alias — `@dom`, `@echo`, `@mixin` |
| Um único `attachInternals()` | plataforma | O navegador lança na segunda chamada |
| `composed: true` em evento público | plataforma | Sem isso o evento não sai do shadow root |
| `Echo` na cadeia para despachar | arquitetura | É quem instala o mecanismo |
| Estado visual em `internals.states` | arquitetura | Permite `:host(:state(...))`, não classe |

---

## Relacionado a

- [c4model Level 3 — Component](03_component.md): depende — Level 4 detalha a implementação de um componente de Level 3
- [gof patterns](../../gof/SKILL.md): complementa — patterns aplicados nas classes aqui diagramadas
- [skill mixin](../../mixin/SKILL.md): depende — a cadeia diagramada aqui é o assunto dela
- [skill bracket](../../bracket/SKILL.md): depende — os contratos de Symbol e sua invocação
- [skill anatomy](../../anatomy/SKILL.md): complementa — a ordem dos membros dentro da classe
- [rule 007 Limite de Linhas](../../../rules/007_limite-maximo-linhas-classe.md): reforça — máximo 50 linhas por classe
- [rule 010 SRP](../../../rules/010_principio-responsabilidade-unica.md): reforça — cada classe tem responsabilidade única
- [rule 031 Imports Relativos](../../../rules/031_restricao-imports-relativos.md): reforça — path alias obrigatório
- [rule 029 Imutabilidade](../../../rules/029_imutabilidade-objetos-freeze.md): reforça — Value Objects são frozen

---

**Author:** [Nome] · [Link]
