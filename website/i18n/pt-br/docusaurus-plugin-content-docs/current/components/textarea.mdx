# Textarea

Um campo de texto de múltiplas linhas que cresce com o que é digitado nele. Ele
embrulha um `<textarea>` de verdade e reporta valor e validade ao `<form>` dono
através do `ElementInternals`, então submete como um controle nativo — com a
alça de redimensionamento manual removida, já que a altura é gerenciada para
você.

```html preview
<kb-textarea name="bio" placeholder="Conte sobre você" required>
  <kb-label>Bio</kb-label>
  <kb-helper>Uma ou duas frases.</kb-helper>
</kb-textarea>
```

## Uso

```html
<kb-textarea name="bio" required>
  <kb-label>Bio</kb-label>
</kb-textarea>
```

```js
document.querySelector('kb-textarea').addEventListener('changed', (event) => {
  console.log(event.detail) // o valor atual
})
```

## Quando usar

- **Texto livre mais longo que uma linha** — uma bio, uma anotação, uma
  mensagem, uma descrição.
- **Conteúdo cujo comprimento varia muito entre pessoas** — o campo cresce em
  vez de forçar uma rolagem dentro de uma caixa fixa.

## Quando não usar

- **Um valor de uma linha** — use o `<kb-input>`, que carrega o conjunto
  completo de atributos de restrição (`type`, `pattern`, `min`/`max`) que este
  elemento não tem.
- **Texto rico** — isto é texto puro: sem formatação, sem preview, sem barra de
  ferramentas.
- **Documentos muito longos** — um campo que cresce sem limite empurra a ação de
  submissão para fora da tela. Passando de alguns parágrafos, uma tela de editor
  serve melhor.

## Composição

- **Pode conter**: conteúdo para os três slots nomeados — `label`, `helper` e
  `validity`. Qualquer coisa sem slot é descartada. `<kb-label>`, `<kb-helper>`
  e `<kb-validity>` se atribuem ao slot correspondente ao conectar, então
  aninhá-los é toda a configuração.
- **Pode ser filho de**: um `<form>`, o template de um `<kb-form>`, ou de nada —
  ele funciona sozinho, só não tem formulário para o qual submeter.

```html preview
<kb-textarea name="note" required>
  <kb-label>Anotação</kb-label>
  <kb-validity state="valueMissing">Escreva algo primeiro.</kb-validity>
</kb-textarea>
```

## Altura e crescimento

O campo começa em `--textarea-size-min-height` (128px, cerca de quatro linhas) e
cresce a cada entrada: o tratador zera a altura e reaplica o `scrollHeight`,
então a caixa sempre se ajusta exatamente ao conteúdo.

Duas consequências:

- **Ele nunca encolhe abaixo do mínimo, e nunca rola.** `overflow: hidden` com
  `resize: none` significa que o conteúdo está sempre totalmente visível. Uma
  resposta longa faz um campo longo.
- **O crescimento é estilo inline no elemento interno**, aplicado por evento de
  entrada. Definir uma `height` de fora é sobrescrito assim que a pessoa digita
  — use `--textarea-size-min-height` para mudar o tamanho inicial.

Escolha a altura mínima para sinalizar o comprimento de resposta esperado: uma
caixa de duas linhas convida a uma frase, uma de oito linhas convida a um
parágrafo.

```html preview
<div style="--textarea-size-min-height: 72px;">
  <kb-textarea name="brief" placeholder="Uma frase basta">
    <kb-label>Resumo</kb-label>
  </kb-textarea>
</div>
```

## Validação

As restrições são declaradas como atributos e avaliadas pelo navegador; o
desfecho é espelhado no host como um custom state `invalid`.

- `required` é a restrição que se aplica aqui — as restrições de comprimento e
  formato do `<kb-input>` não são repassadas por este elemento.
- Leia o resultado por `checkValidity()`, `reportValidity()`, `validity` e
  `validationMessage`.
- Enquanto o host está `invalid`, o slot `helper` fica escondido, então a
  mensagem de erro substitui a dica em vez de empilhar embaixo.

`reset()` limpa o valor e o estado inválido e dispara `reset`, que é como o reset
do `<kb-form>` chega ao campo.

## Atributos

| Atributo | Tipo | Padrão | Descrição |
|---|---|---|---|
| `name` | `string` | `''` | Nome do campo no `FormData` do formulário dono. |
| `value` | `string` | — | Valor atual. Defini-lo reexecuta a validação e dispara `changed`. |
| `placeholder` | `string` | — | Placeholder, repassado ao `<textarea>` interno. |
| `required` | `boolean` | `false` | Se um valor é obrigatório para a validade. |
| `disabled` | `boolean` | `false` | Desabilita o campo e o exclui da submissão. |
| `readonly` | `boolean` | `false` | Bloqueia a edição mas mantém o valor no `FormData`. |
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

É o mesmo nome de evento que o `<kb-input>` e o `<kb-fileupload>` publicam,
então um arco só funciona para qualquer um dos três campos.

## Estilo

| Custom property | Padrão | Controla |
|---|---|---|
| `--textarea-color-background` | `var(--color-master-lightest)` | Fundo do campo. |
| `--textarea-color-background_disabled` | `var(--color-master-lighter)` | Fundo quando desabilitado ou somente leitura. |
| `--textarea-color-border` | `var(--color-master-light)` | Borda em repouso. |
| `--textarea-color-focus` | `var(--color-primary)` | Borda no foco. |
| `--textarea-color-invalid` | `var(--color-danger)` | Borda enquanto `invalid`. |
| `--textarea-color-text` | `var(--color-master-darkest)` | Texto digitado. |
| `--textarea-color-text_disabled` | `var(--color-master)` | Texto quando desabilitado ou somente leitura. |
| `--textarea-color-placeholder` | `var(--color-master)` | Texto do placeholder. |
| `--textarea-font-family` | `var(--font-family-base)` | Família tipográfica. |
| `--textarea-font-size` | `var(--font-size-xxs)` | Tamanho da tipografia. |
| `--textarea-line-height` | `var(--line-height-lg)` | Entrelinha — a alavanca principal sobre quantas linhas cabem na altura inicial. |
| `--textarea-size-min-height` | `128px` | Altura inicial, antes de o campo crescer. |
| `--textarea-space-inset` | `var(--spacing_inset-nano) var(--spacing_inset-xs)` | Padding; aceita o atalho completo. |
| `--textarea-border-radius` | `var(--border-radius-sm)` | Arredondamento dos cantos. |
| `--textarea-space-gap` | `var(--spacing-nano)` | Espaçamento entre rótulo, campo e helper. |

A largura é um atributo, não uma custom property — defina `width` em vez de uma
regra CSS.

## Estados e acessibilidade

- `hidden` remove o campo do layout e da árvore de acessibilidade.
- `invalid` é um custom state derivado da API de Validação de Restrições, não um
  atributo que você define.
- O `<label for>` interno mira o textarea interno via `id`, caindo para o `name`
  — um campo sem nenhum dos dois tem um controle sem rótulo.
- Crescer o campo empurra tudo abaixo dele para baixo. Mantenha a ação de
  submissão numa posição que sobreviva a isso, para que ela não fuja enquanto a
  pessoa digita.
- `disabled` remove o campo da submissão; `readonly` mantém o valor dele no
  `FormData`.

## Certo e errado

| Faça | Não faça |
|---|---|
| Dimensionar `--textarea-size-min-height` conforme a resposta esperada | Publicar os 128px padrão para um campo que sempre guarda uma linha |
| Definir `name` (ou `id`) para o rótulo associar e o valor submeter | Contar com um `<kb-label>` visível sozinho para nomear o campo |
| Usar o `<kb-input>` quando a resposta é de uma linha | Recorrer a um textarea porque ele "parece mais espaçoso" |
| Fazer throttle antes de guiar uma requisição a partir do `changed` | Disparar uma requisição por tecla direto do evento |
