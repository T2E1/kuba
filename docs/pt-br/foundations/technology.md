# Tecnologia

kuba é escrito em JavaScript puro, com **zero dependências de runtime**. Confira
o `package.json`: a seção `dependencies` está vazia.

Não foi por falta de opções. Decorre dos
[princípios](/pt-br/foundations/principles):

1. **Web Components são nativos.** Não precisam de framework para existir nem
   para se registrar.
2. **Uma dependência a menos é uma cadeia de suprimentos a menos** para auditar,
   atualizar e ver quebrar em produção.
3. **Curva de aprendizado mais suave.** Quem conhece DOM e `CustomEvent` já
   consegue ler o código-fonte do kuba.
4. **Todo desenvolvedor front-end sabe JavaScript**, seja qual for o framework
   do dia a dia.

## As APIs nativas em que se apoia

Nenhuma delas é dependência instalável. São capacidades que o navegador já traz,
e que o kuba expõe por uma API declarativa em vez de esconder atrás de uma
abstração própria.

| API | Usada para |
|---|---|
| **Custom Elements** | Toda tag `<kb-*>`, registrada pelo decorator `define`. |
| **Shadow DOM** | Markup e estilos de cada elemento, isolados da página. |
| **Constraint Validation API** | Validação nativa em `<kb-input>`, `<kb-textarea>`, `<kb-fileupload>`. |
| **`ElementInternals`** | Associação a formulário e estados customizados (`:state(invalid)`, `:state(hidden)`) sem reimplementar a semântica de `<form>`. |
| **`CustomEvent`** | Todo o barramento do Echo. Elementos se comunicam do jeito que o DOM já faz. |
| **Constructable stylesheets** | `adoptedStyleSheets`, para uma folha ser parseada uma vez e compartilhada entre instâncias. |
| **History API** | Navegação no cliente em `router` e `<kb-redirect>`. |
| **CSS `light-dark()`** | Valores claro e escuro num único token de cor, resolvidos pelo `color-scheme` da página. |
| **CSS custom properties** | Toda a superfície de temas, herdando através do shadow boundary. |

O único shim do código é o `setImmediate`, usado para agrupar repaints — poucas
linhas, não uma biblioteca.

## Estilo

Estilos são escritos por elemento num `style.js` e retornados como
`CSSStyleSheet` pelo helper `css`, não como folha global. Cada elemento adota a
sua, isolada pelo shadow DOM.

O único arquivo global é o `dist/kuba.css`, que carrega os design tokens — os
valores contra os quais os padrões de todo elemento resolvem.

## Ferramentas

O que está em `devDependencies` não é para consumir o kuba; é para construí-lo.

| Ferramenta | Papel |
|---|---|
| `vite` | Empacota o `dist/` no `bun run release`. |
| `vitest` + `playwright` | Roda a suíte de testes num Chromium real (`bun run test`). |
| `typescript` | Não compila nada — apenas verifica tipos contra os `types.d.ts` escritos à mão que documentam a superfície pública de cada elemento. |
| `@biomejs/biome` | Lint e formatação (`bun run check`). |
| `husky` + `lint-staged` | Rodam o Biome nos arquivos em stage antes do commit. |
| `commitlint` | Impõe Conventional Commits. |
| `docsify` | Renderiza esta documentação. Carregado de um CDN em runtime — não há etapa de build da doc. |

## Tipos sem etapa de build

kuba entrega tipos, mas nada é escrito em TypeScript. O contrato público de cada
elemento vive num `types.d.ts` escrito à mão ao lado da implementação, e
registra a tag em `HTMLElementTagNameMap`:

```ts
const input = document.querySelector('kb-input') // KUBAInputElement
```

A troca é deliberada. A implementação continua JavaScript puro, que roda no
navegador sem compilação, e a superfície de tipos fica pequena o bastante para
ser escrita à mão — o que também significa que ela descreve o que é *público*,
e não o que a implementação por acaso expõe.

## Como esta documentação é construída

Este site é markdown renderizado pelo docsify no navegador, e carrega o kuba **do
CDN numa versão fixada** — as mesmas duas tags que qualquer consumidor
escreveria.

Isso não é detalhe: todo exemplo ao vivo deste site roda contra o pacote
publicado. Se um release quebra, a documentação quebra de forma visível, em vez
de passar verde contra código-fonte que só existe na máquina de quem desenvolve.
