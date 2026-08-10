# Level 2 — Container

[Descrição do sistema decomposto em containers: cada processo, aplicação, armazenamento ou canal de comunicação que compõe o sistema. Mostra a tecnologia de cada parte e como os containers se comunicam entre si.]

## Diagrama de Containers

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                            [Nome do Sistema]                                  │
│                                                                              │
│  ┌──────────────────────┐              ┌──────────────────────┐             │
│  │   [Bundle]           │              │   [Folha de tokens]  │             │
│  │   [Tecnologia]       │─── var() ───►│   [Tecnologia]       │             │
│  │                      │              │                      │             │
│  │  [Responsabilidade]  │              │  [Responsabilidade]  │             │
│  └──────────┬───────────┘              └──────────────────────┘             │
│             │                                                                │
│             │ acompanha                                                      │
│             ▼                                                                │
│  ┌──────────────────────┐              ┌──────────────────────┐             │
│  │   [Declarações .d.ts]│              │  [Site de docs]      │             │
│  │   [Tecnologia]       │              │  [Tecnologia]        │             │
│  │                      │              │                      │             │
│  │  [Responsabilidade]  │              │  [Responsabilidade]  │             │
│  └──────────────────────┘              └──────────┬───────────┘             │
└───────────────────────────────────────────────────┼──────────────────────────┘
         │                                          │
         │ instalado / carregado                    │ carrega versão pinada
         ▼                                          ▼
┌───────────────────────┐                 ┌───────────────────────┐
│                       │                 │                       │
│  [Aplicação do        │                 │  [Registro / CDN]     │
│   consumidor]         │                 │                       │
│  [Sistema Externo]    │                 │  [Sistema Externo]    │
│                       │                 │                       │
└───────────────────────┘                 └───────────────────────┘
```

## Containers do Sistema

| Container | Tipo | Tecnologia | Responsabilidade |
|-----------|------|------------|-----------------|
| **[Bundle]** | Módulo ESM publicado | [ex: `dist/kuba.js`, JavaScript puro] | [Define os custom elements no registro do navegador] |
| **[Folha de tokens]** | CSS publicado | [ex: `dist/kuba.css`, custom properties] | [Fornece os tokens que os elementos consomem] |
| **[Declarações de tipo]** | `.d.ts` publicados | [ex: `packages/**/types.d.ts`] | [Descreve o contrato público para o editor do consumidor] |
| **[Site de documentação]** | Site estático | [ex: docsify, markdown no navegador] | [Ensina o uso; roda os exemplos contra o pacote publicado] |

Uma biblioteca tem poucos containers, e nenhum deles é um processo em execução — o
runtime é o navegador de quem consome. Se o seu Level 2 tem servidor, banco e fila, você
está documentando uma aplicação, não uma biblioteca.

## Interações entre Containers

| De | Para | Protocolo | Formato | Descrição |
|----|------|-----------|---------|-----------|
| [Aplicação do consumidor] | Bundle | `import` / `<script type="module">` | ESM | Carrega e registra os custom elements |
| [Aplicação do consumidor] | Folha de tokens | `<link rel="stylesheet">` | CSS | Declara as custom properties no `:root` |
| Bundle | Folha de tokens | `var(--token)` | CSS | O elemento lê o token com fallback próprio |
| Elemento | Elemento | `CustomEvent` com `composed: true` | `detail` | Comunicação declarativa por arcos do `Echo` |
| Site de documentação | CDN | HTTPS | ESM + CSS | Carrega a versão pinada; exemplo ao vivo prova o pacote real |

## Tecnologias por Container

| Container | Runtime | Linguagem | Dependências | Publicação |
|-----------|---------|-----------|--------------|------------|
| **[Bundle]** | [ex: navegador do consumidor] | JavaScript | [ex: nenhuma em runtime] | [ex: npm, servido pelo jsDelivr] |
| **[Folha de tokens]** | [ex: navegador do consumidor] | CSS | — | [ex: npm, no mesmo pacote] |
| **[Site de documentação]** | [ex: navegador do leitor] | Markdown | [ex: docsify via CDN] | [ex: GitHub Pages] |

Repare na coluna de dependências: uma biblioteca de componentes que adiciona dependência
de runtime a transfere para todo consumidor. Aqui ela é vazia por decisão.

---

## Relacionado a

- [arc42 §3 — Contexto e Escopo](../../arc42/references/03_context_and_scope.md): complementa — §3 mostra sistemas externos; Level 2 mostra o interior do sistema
- [arc42 §5 — Building Block View](../../arc42/references/05_building_block_view.md): equivalente — Nível 1 de §5 corresponde aos containers aqui
- [c4model Level 1 — System Context](01_system-context.md): depende — Level 2 decompõe o sistema mostrado em Level 1
- [c4model Level 3 — Component](03_component.md): complementa — Level 3 decompõe internamente cada container aqui listado

---

**Author:** [Nome] · [Link]
