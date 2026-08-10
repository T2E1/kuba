# Level 3 — Component

[Descrição da organização interna de um container específico em componentes. Mostra como o container é estruturado, quais são as responsabilidades de cada componente e como eles se comunicam entre si. Este nível é destinado ao time de desenvolvimento — quem vai implementar ou modificar o container.]

## Container em Foco: [Nome do Container]

[Identificar qual container está sendo decomposto. Ex: "Bundle — o módulo ESM publicado, que define os custom elements no registro do navegador."]

## Diagrama de Componentes

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                          [Nome do Container]                                  │
│                          [Tecnologia do Container]                            │
│                                                                              │
│  ┌───────────────────────────────────────────────────────────────────────┐   │
│  │  [Elementos visíveis]                                                 │   │
│  │                                                                       │   │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────┐  ┌───────────────┐ │   │
│  │  │  component/  │  │    form/     │  │ layout/  │  │  typography/  │ │   │
│  │  │              │  │              │  │          │  │               │ │   │
│  │  │ kb-button    │  │ kb-input     │  │ kb-stack │  │ kb-text       │ │   │
│  │  │ kb-icon      │  │ kb-textarea  │  │ kb-inset │  │ kb-label      │ │   │
│  │  └──────┬───────┘  └──────┬───────┘  └────┬─────┘  └───────┬───────┘ │   │
│  └─────────┼─────────────────┼───────────────┼────────────────┼─────────┘   │
│            │                 │               │                │             │
│            └─────────────────┴───────┬───────┴────────────────┘             │
│                                      ▼                                       │
│  ┌───────────────────────────────────────────────────────────────────────┐   │
│  │  [Comportamento compartilhado]                                        │   │
│  │  mixin/ — Width, Height, Hidden, Headless, Identity, Template, Value  │   │
│  └───────────────────────────────────┬───────────────────────────────────┘   │
│                                      ▼                                       │
│  ┌──────────────────────────┐   ┌──────────────────────────────────────────┐ │
│  │  [Infraestrutura]        │   │  [Comunicação]                           │ │
│  │  dom/ — paint, css, html │   │  echo/ — o barramento de arcos           │ │
│  │  directive/ — define     │   │  event/ — on, stop                       │ │
│  │  renderer/               │   │  middleware/ — before, after, around     │ │
│  └──────────────────────────┘   └──────────────────────────────────────────┘ │
│                                                                              │
│  ┌───────────────────────────────────────────────────────────────────────┐   │
│  │  [Elementos sem representação visual]                                 │   │
│  │  data/ — kb-fetch, kb-dataset    ·    behavior/, router/, http/       │   │
│  └───────────────────────────────────────────────────────────────────────┘   │
└──────────────────────────────────────────────────────────────────────────────┘
                                        │
          ┌─────────────────────────────┼─────────────────────────────┐
          ▼                             ▼                             ▼
  ┌───────────────┐           ┌──────────────────┐          ┌─────────────────┐
  │ [Folha de     │           │ [Plataforma:     │          │ [Aplicação do   │
  │  tokens]      │           │  Shadow DOM,     │          │  consumidor]    │
  │ [Container]   │           │  ElementInternals│          │ [Externo]       │
  └───────────────┘           └──────────────────┘          └─────────────────┘
```

## Componentes do Container

| Componente | Diretório | Responsabilidade | Interface Pública |
|------------|-----------|-----------------|-------------------|
| **Elementos visíveis** | `packages/component/`, `form/`, `layout/`, `typography/` | Custom elements com Shadow DOM que o consumidor escreve no HTML | Prefixo `kb-`, configurados por atributo |
| **Elementos headless** | `packages/data/`, `behavior/` | Comportamento sem representação visual — busca, coleção, redirecionamento | Prefixo `k-`, ou `kb-` quando renderizam conteúdo |
| **Mixins** | `packages/mixin/` | Comportamento compartilhado aplicado por composição de classes | `(Super) => class extends Super`, aplicados da direita para a esquerda |
| **Render** | `packages/dom/` | `@paint`, `@repaint`, `@retouch`, `css`, `html` — escreve no shadow root | Decorators e template tags |
| **Definição** | `packages/directive/` | `@define` registra o elemento no `customElements` | Decorator |
| **Comunicação** | `packages/echo/`, `event/` | Arcos declarativos `on="fonte/evento:tipo/destino"` e escuta no shadow root | `Echo` na cadeia, `@on.*`, `@dispatchEvent` |
| **Middleware** | `packages/middleware/` | `@before`, `@after`, `@around` — valida e transforma antes de atribuir | Decorators |
| **Tokens** | `packages/pixel/` | Custom properties de cor, espaço, tipografia e borda | `index.css`, importado pelo consumidor |

## Dependências entre Componentes

| Componente | Depende de | Tipo de Dependência | Direção |
|------------|-----------|---------------------|---------|
| Elemento visível | Mixin | Composição na cadeia de `extends` | Elemento → Mixin |
| Elemento visível | `dom/` | Decorator `@paint` e template tags | Elemento → Infra |
| Elemento que despacha evento | `echo/` | `Echo` obrigatório na cadeia | Elemento → Echo |
| Elemento | `directive/` | `@define` para registrar | Elemento → Directive |
| Elemento | `pixel/` | `var(--token)` no `style.js` | Elemento → Tokens |
| Mixin | Plataforma | `ElementInternals`, `internals.states` | Mixin → Navegador |

O grafo aponta sempre dos elementos para a infraestrutura, e nunca de volta — é o que
mantém `packages/dom/` e `packages/echo/` reutilizáveis por qualquer elemento novo
(rule 018, dependências acíclicas).

## Estrutura de Diretórios Correspondente

```
packages/
└── [categoria]/          ← component, form, layout, typography, data, mixin...
    └── [nome]/
        ├── [nome].ts     ← a classe do elemento, com decorators e mixins
        ├── component.js  ← o markup do shadow root
        ├── style.js      ← o CSS, com tokens e custom properties
        ├── interfaces.js ← os Symbols que formam o contrato
        ├── index.js      ← o que é exportado
        ├── types.d.ts    ← o contrato público: atributo, propriedade, evento
        └── [nome].test.js ← testes de comportamento em navegador real
```

---

## Relacionado a

- [arc42 §5 — Building Block View](../../arc42/references/05_building_block_view.md): equivalente — Nível 2 de §5 corresponde aos componentes aqui
- [c4model Level 2 — Container](02_container.md): depende — Level 3 decompõe um container específico de Level 2
- [c4model Level 4 — Code](04_code.md): complementa — Level 4 mostra a implementação interna de cada componente aqui
- [rule 010 SRP](../../../rules/010_principio-responsabilidade-unica.md): reforça — cada componente deve ter responsabilidade única
- [rule 018 ADP](../../../rules/018_principio-dependencias-aciclicas.md): reforça — o grafo entre pacotes é acíclico
- [skill colocation](../../colocation/SKILL.md): complementa — define onde cada arquivo do pacote mora

---

**Author:** [Nome] · [Link]
