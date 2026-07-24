# Página de uso (`<name>.mdx`) — quando e como usar o componente

Isto é a Regra 5 do `SKILL.md`. Só escreva este arquivo quando o pedido for
por orientação de uso, não apenas por uma story/catálogo de atributos —
ver `references/accessibility-and-docs.md` § "MDX vs autodocs" para quando
essa evolução se justifica e o que ela substitui.

## Por que essa estrutura

Pesquisando como Material Design 3, Carbon (IBM), Atlassian Design System
e Shopify Polaris documentam seus componentes, a mesma estrutura se repete
sob nomes diferentes: propósito, hierarquia/variantes, cor como semântica
(não estética), tamanho como contexto de uso (não escolha visual), conteúdo
(regra de texto), composição, estados/acessibilidade, e pares do/don't
lado a lado. Nenhum desses sistemas gera essa prosa a partir de metadados
— é escrita à mão, uma vez, por quem entende o componente. `button.mdx`
(`packages/component/button/button.mdx`) é a implementação de referência
dessa estrutura neste repositório.

## Localização e conexão com o CSF

`packages/<categoria>/<nome>/<nome>.mdx`, ao lado de `<nome>.stories.js`,
`types.d.ts`, e o arquivo de implementação — mesmo princípio de colocação
das outras regras desta skill.

```js
import { Canvas, Controls, Meta } from '@storybook/addon-docs/blocks'
import * as ButtonStories from './button.stories.js'

<Meta of={ButtonStories} />
```

`.storybook/main.js` precisa incluir `../packages/**/*.mdx` no array
`stories` para que esse arquivo seja indexado — já configurado
repo-wide; não precisa ser refeito por componente.

## Seções, em ordem

1. **Título + parágrafo de propósito** (`# Nome`) — uma ou duas frases:
   o que o componente faz, e o que ele **não** faz (a fronteira mais
   comum de engano). Ex.: "A button triggers a synchronous action [...]
   It never changes the URL."
2. **Playground** — logo após o parágrafo de propósito, antes de qualquer
   `##`:
   ```js
   <Canvas of={ButtonStories.Primary} />
   <Controls />
   ```
   `<Controls />` sem `of=` herda a story ancorada pelo `<Meta of={...}/>`
   do topo e mostra **todos** os `argTypes` — é a mesma tabela que o
   autodocs geraria sozinho, preservada no topo da página manual. Não
   repita `<Controls>` filtrado (`include={[...]}`) dentro das seções de
   prosa abaixo só para reexibir uma linha que já apareceu aqui — é
   redundante e diverge se um dos dois for esquecido numa edição futura.
3. **When to use** — lista curta de cenários reais onde o componente é a
   escolha certa.
4. **When not to use** — o contraste mais importante: qual é a alternativa
   quando o componente parece servir mas não é o certo, e por quê. Esta é
   a seção que mais prova que a página foi pensada, não gerada — todo
   design system pesquisado a tem.
5. **Composition** — obrigatória sempre que o componente tiver slot ou
   posição significativa na árvore:
   - **Can contain**: quais elementos (kuba ou HTML puro) fazem sentido
     como filho, e por quê cada um. Cite o mecanismo real (ex.: `hidden`
     não intercepta clique porque `style.js` aplica `pointer-events: none`
     em `::slotted(*)`), não uma lista genérica.
     - Se filhos livres não fazem sentido (nenhum), diga isso
       explicitamente — "no meaningful children" — não omita a seção.
   - **Can be a child of**: restrições reais de onde o componente pode
     ser colocado, ou "anything" quando não há restrição — não deixe
     implícito.
   Um `<Canvas of={...}/>` mostrando um caso de composição real (não o
   `Primary`) ajuda mais aqui do que só prosa.
6. **Seções específicas do contrato do componente** — uma por atributo
   que carrega uma *regra*, não apenas uma *opção*. Nomeie pela pergunta
   que responde, não pelo nome do atributo cru:
   - `variant`/hierarquia de ênfase → tabela com emphasis + quando usar
     cada um, extraída dos estados reais em `style.js` (nunca invente um
     variant que o componente não implementa).
   - `color` → semântica de cada token, extraída de
     `packages/pixel/tokens/color.css` + o que o componente realmente faz
     com cada um (ex.: `danger` só para ação destrutiva).
   - `width`/tamanho → contexto de uso de cada valor, não a mecânica da
     normalização (essa já está em `description` do `argType`).
   - Atributos sem regra de uso (só forma) não precisam de seção própria
     — ficam só no playground do topo.
7. **Content** — regra de texto/label, quando o componente tiver um.
8. **States and accessibility** — comportamento de `hidden`/estados
   customizados, requisito de nome acessível para variantes só-ícone,
   pré-condições não óbvias (ex.: `type="submit"` é um no-op fora de um
   `<form>`).
9. **Do's and don'ts** — tabela GFM de duas colunas, pares que se
   correspondem linha a linha (a linha 1 da coluna Do e a linha 1 da
   coluna Don't devem tratar do mesmo aspecto). 3–5 pares já cobre o que
   importa; não liste toda combinação inválida possível
   (`.claude/rules/023_proibicao-funcionalidade-especulativa.md`).

## O que não escrever aqui

- Não repita a mecânica de normalização/coerção de um atributo (isso já
  está em `description` do `argType`, transcrita do `types.d.ts` — Regra
  2) — esta página é sobre *quando*, a `description` é sobre *o quê*.
- Não invente uma regra de uso sem base no código real (estados de
  `style.js`, tokens de `packages/pixel/tokens/`, comportamento
  documentado em `types.d.ts`) — cada afirmação de "use X para Y" deve
  ser rastreável a algo que o componente de fato faz.
- Não duplique a lista de stories — `tags: ['autodocs']` já gerava isso;
  como este `.mdx` substitui o autodocs (não some com a lista de
  stories), `<Controls />`/`<Canvas>` já bastam como demonstração viva.

## Depois de escrever

1. Remova `tags: ['autodocs']` do `.stories.js` correspondente (ver
   `references/accessibility-and-docs.md`).
2. Rode `bun run build` — um `<Meta of={...}/>` apontando para um CSF
   ainda marcado `autodocs` falha o build do Storybook com um erro de
   índice, não um aviso silencioso.
