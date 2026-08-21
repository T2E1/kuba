# Instalação

kuba é distribuído como módulos ES e não exige etapa de build. Escolha a
configuração que combina com o seu projeto.

## Por CDN

O caminho mais rápido, e o que esta própria documentação usa: duas tags na sua
página, sem ferramenta nenhuma.

```html
<link
  rel="stylesheet"
  href="https://cdn.jsdelivr.net/npm/@t2e1/kuba@0.1.0-alpha.33/dist/kuba.css"
/>
<script
  type="module"
  src="https://cdn.jsdelivr.net/npm/@t2e1/kuba@0.1.0-alpha.33/dist/kuba.js"
></script>
```

A folha de estilo carrega os design tokens (`--color-*`, `--spacing-*`,
`--font-size-*`…) contra os quais os padrões de todo componente resolvem. Sem
ela, os componentes renderizam sem estilo — referenciam tokens que não existem.

O script registra todos os custom elements. É um módulo, então já vem adiado por
padrão, e os elementos são atualizados assim que ele avalia, estivessem eles no
HTML inicial ou adicionados depois.

?> **Fixe a versão.** kuba está em alpha e mudanças incompatíveis saem com
frequência — nomes de evento e de tag já mudaram. `@latest` significa que sua
página muda sem você tocar nela.

## Por npm

```bash
npm install @t2e1/kuba
```

Importe a biblioteca inteira, o que registra todos os elementos:

```js
import '@t2e1/kuba'
import '@t2e1/kuba/dist/kuba.css'
```

Ou importe apenas os pacotes primitivos de que precisa, sem registrar elemento
algum:

```js
import { define, connected } from '@t2e1/kuba/directive'
import { paint, repaint } from '@t2e1/kuba/dom'
import { Hidden, Width } from '@t2e1/kuba/mixin'
```

Os subcaminhos exportados são `cookie`, `directive`, `dom`, `echo`, `event`,
`middleware`, `mixin`, `renderer`, `result`, `router` e `spark`. Veja
**[Reference › Packages](/pt-br/build-elements/)** para o que cada um contém.

## Verificando a instalação

Coloque isto numa página. Se aparecer um botão que registra o clique, está tudo
conectado.

```html preview
<kb-button id="ping" value="pong">Clique em mim</kb-button>
<kb-text id="ping-output" size="xxs" color="master">ainda não clicado</kb-text>

<script type="module">
  const button = document.querySelector('#ping')
  const output = document.querySelector('#ping-output')
  button.addEventListener('clicked', (event) => {
    output.textContent = `clicado, detail: ${event.detail}`
  })
</script>
```

Se o botão aparecer como texto puro em vez de um controle estilizado, o script
não carregou ou ainda não avaliou. Se aparecer sem estilo — formato certo, cores
e espaçamento errados — falta a folha de estilo.

## Suporte de navegador

kuba usa custom elements, shadow DOM, `ElementInternals`, estados customizados
(`:state()`) e constructable stylesheets, sem polyfill para nenhum deles além de
um pequeno shim de `setImmediate`. Isso significa Chrome, Edge, Firefox e Safari
atuais. Não há build legado, e não haverá — a biblioteca existe para usar essas
APIs, não para abstrair a ausência delas.

## TypeScript

Os tipos são escritos à mão e vêm no pacote. O contrato público de cada elemento
vive no seu próprio `types.d.ts`, e a tag é registrada em
`HTMLElementTagNameMap`, então `document.querySelector('kb-input')` já vem tipado
sem configuração extra.
