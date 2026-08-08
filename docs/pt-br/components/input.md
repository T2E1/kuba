# Input

Um campo de texto de uma linha que se comporta como um nativo do ponto de vista
do formulário: ele embrulha um `<input>` de verdade no shadow DOM e reporta
valor e validade ao `<form>` dono através do `ElementInternals`. Associado a
formulário, então ele submete sem campo escondido nem etapa manual de
`FormData`.

```html preview
<kb-input name="email" type="email" placeholder="voce@exemplo.com" required>
  <kb-label>Email</kb-label>
  <kb-helper>Nunca vamos compartilhar.</kb-helper>
</kb-input>
```

## Uso

```html
<kb-input name="email" type="email" required>
  <kb-label>Email</kb-label>
</kb-input>
```

```js
document.querySelector('kb-input').addEventListener('changed', (event) => {
  console.log(event.detail) // o valor atual
})
```

## Quando usar

- **Qualquer valor de uma linha** — email, nome, quantidade, data — dentro de um
  `<form>` ou de um `<kb-form>`.
- **Campos que precisam validar nativamente** — `required`, `pattern`, `min`,
  `max`, `minlength`, `maxlength` e `type` são repassados ao input interno,
  então o navegador faz a checagem.
- **Campos que publicam mudanças**, que o Echo consegue ligar a outro elemento
  sem listener.

## Quando não usar

- **Texto de múltiplas linhas** — use o `<kb-textarea>`, que cresce com o
  conteúdo.
- **Um arquivo** — use o `<kb-fileupload>`, que mostra preview da seleção e a
  codifica para submissão.
- **Escolher entre opções conhecidas** — um campo que espera um de cinco valores
  deveria ser um select ou um grupo de rádio. `pattern` não substitui um
  controle restrito.

## Composição

- **Pode conter**: conteúdo para os três slots nomeados — `label`, `helper` e
  `validity`. Qualquer coisa sem slot é descartada. `<kb-label>`, `<kb-helper>`
  e `<kb-validity>` se atribuem ao slot correspondente ao conectar, então
  aninhá-los é toda a configuração; mais de um `<kb-validity>` pode compartilhar
  o slot.
- **Pode ser filho de**: um `<form>`, o template de um `<kb-form>`, ou de nada —
  ele funciona sozinho, só não tem formulário para o qual submeter.

```html preview
<kb-input name="password" type="password" required minlength="8">
  <kb-label>Senha</kb-label>
  <kb-helper>Pelo menos 8 caracteres.</kb-helper>
  <kb-validity state="valueMissing">Escolha uma senha.</kb-validity>
  <kb-validity state="tooShort">Pelo menos 8 caracteres.</kb-validity>
</kb-input>
```

## Validação

As restrições são declaradas como atributos e avaliadas pelo navegador; o
resultado é espelhado no host como um custom state `invalid`, ao qual o estilo e
o `<kb-validity>` reagem.

- Defina `required`, `pattern`, `min`/`max`, `minlength`/`maxlength` e `type` no
  elemento — eles chegam ao input interno sem alteração.
- Leia o desfecho por `checkValidity()`, `reportValidity()`, `validity` e
  `validationMessage`, a mesma API que um input nativo expõe.
- Enquanto o host está `invalid`, o slot `helper` fica escondido, então a
  mensagem de erro substitui a dica em vez de empilhar embaixo. Uma dica e o
  erro dela não deveriam repetir um ao outro.
- Dê a cada falha o próprio `<kb-validity state="…">`. Uma mensagem genérica
  força a pessoa a adivinhar qual regra quebrou.

`reset()` limpa o valor e o estado inválido e dispara `reset` — é assim que o
reset do `<kb-form>` flui para cada campo.

## Eventos

`changed` dispara a cada mudança de valor, carregando o valor novo:

```html preview
<kb-input name="query" placeholder="Digite aqui">
  <kb-label>Eco ao vivo</kb-label>
</kb-input>
<kb-render>
  <kb-on value="query/changed:method/render"></kb-on>
  <template>Você digitou: {}</template>
</kb-render>
```

Ele dispara **por tecla**, não no blur, e se chama `changed`, não o nativo
`change`. Filtros de arco não conseguem fazer debounce dele — são transformações
síncronas de payload e não conseguem adiar o destino — então faça throttle
dentro do método de destino, ou use um listener comum, antes de guiar uma
requisição.

## Atributos

| Atributo | Tipo | Padrão | Descrição |
|---|---|---|---|
| `name` | `string` | `''` | Nome do campo no `FormData` do formulário dono. |
| `type` | `string` | — | Tipo do input, repassado ao `<input>` interno. |
| `value` | `string` | — | Valor atual. Defini-lo reexecuta a validação e dispara `changed`. |
| `placeholder` | `string` | — | Placeholder, repassado. |
| `required` | `boolean` | `false` | Se um valor é obrigatório para a validade. |
| `disabled` | `boolean` | `false` | Desabilita o campo e o exclui da submissão. |
| `readonly` | `boolean` | `false` | Bloqueia a edição mas mantém o valor no `FormData`. |
| `pattern` | `string` | — | Expressão regular com a qual o valor precisa casar. |
| `min` / `max` | `string` | — | Limites do valor, repassados. |
| `minlength` / `maxlength` | `string` | — | Limites de comprimento, repassados. |
| `step` | `string` | — | Intervalo de passo para tipos numéricos e de data. |
| `inputmode` | `string` | — | Dica de teclado virtual, repassada. |
| `id` | `string` | cai para `name` | Usado pelo `<label for>` interno. |
| `width` | `auto` \| `fill` \| comprimento | `auto` | Como o campo preenche o contêiner. |
| `hidden` | `boolean` | `false` | Remove o campo do layout e da árvore de acessibilidade. |

## Métodos

| Método | Devolve | Descrição |
|---|---|---|
| `checkValidity()` | `boolean` | Valida e dispara `invalid` se falhar. |
| `reportValidity()` | `boolean` | Valida e reporta o problema para a pessoa. |
| `reset()` | `this` | Limpa o valor e o estado inválido, dispara `reset`. |

## Eventos

| Evento | Dispara quando | `detail` |
|---|---|---|
| `changed` | o valor muda, a cada tecla | o valor novo |

## Estilo

| Custom property | Padrão | Controla |
|---|---|---|
| `--input-color-background` | `var(--color-master-lightest)` | Fundo do campo. |
| `--input-color-background_disabled` | `var(--color-master-lighter)` | Fundo quando desabilitado ou somente leitura. |
| `--input-color-border` | `var(--color-master-light)` | Borda em repouso. |
| `--input-color-focus` | `var(--color-primary)` | Borda no foco. |
| `--input-color-invalid` | `var(--color-danger)` | Borda enquanto `invalid`. |
| `--input-color-text` | `var(--color-master-dark)` | Texto digitado. |
| `--input-color-text_disabled` | `var(--color-master)` | Texto quando desabilitado ou somente leitura. |
| `--input-color-placeholder` | `var(--color-master)` | Texto do placeholder. |
| `--input-font-family` | `var(--font-family-base)` | Família tipográfica. |
| `--input-font-size` | `var(--font-size-xxs)` | Tamanho da tipografia. |
| `--input-size-height` | `40px` | Altura do campo. |
| `--input-space-inset` | `var(--spacing_inset-nano) var(--spacing_inset-xs)` | Padding; aceita o atalho completo. |
| `--input-border-radius` | `var(--border-radius-sm)` | Arredondamento dos cantos. |
| `--input-space-gap` | `var(--spacing-nano)` | Espaçamento entre rótulo, campo e helper. |

A largura é um atributo, não uma custom property — defina `width` em vez de uma
regra CSS.

```html preview
<div style="--input-size-height: 56px; --input-font-size: 20px;">
  <kb-input name="hero" placeholder="Um campo maior">
    <kb-label>Uma pergunta por etapa</kb-label>
  </kb-input>
</div>
```

## Estados e acessibilidade

- `hidden` remove o campo do layout e da árvore de acessibilidade.
- `invalid` é um custom state definido a partir da API de Validação de
  Restrições, não um atributo que você define. Estilize com `:state(invalid)`;
  não force.
- O `<label for>` interno aponta para o input interno usando o `id`, caindo para
  o `name`. **Um campo sem nenhum dos dois tem um input sem rótulo** — o
  `<kb-label>` visível sozinho não o nomeia para a tecnologia assistiva.
- `disabled` remove o campo da submissão por completo; `readonly` o mantém no
  `FormData`. Escolha pelo critério de o valor ainda dever ser enviado ou não.
- A mensagem de erro substitui o helper visualmente. Se a dica carrega uma
  exigência que a pessoa ainda precisa enquanto corrige o erro, repita-a na
  mensagem do `<kb-validity>`.

## Certo e errado

| Faça | Não faça |
|---|---|
| Definir `name` (ou `id`) para o rótulo associar e o valor submeter | Contar com um `<kb-label>` visível sozinho para nomear o campo |
| Dar a cada restrição o próprio `<kb-validity state="…">` | Publicar um "Entrada inválida" genérico para toda falha |
| Fazer throttle antes de guiar uma requisição a partir do `changed` | Disparar uma requisição por tecla direto do evento |
| Usar `type` e `pattern` para o navegador validar | Reimplementar checagem de formato em script e definir o estado à mão |
