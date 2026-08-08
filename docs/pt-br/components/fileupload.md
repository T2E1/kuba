# Fileupload

Um alvo de clique para escolher **uma imagem**, que ele mostra em preview no
lugar e submete como data URL em base64. Associado a formulário, então a imagem
codificada viaja no `FormData` do formulário como qualquer outro campo — sem
tratamento de multipart na página.

```html preview
<kb-fileupload name="avatar" required>
  <kb-label>Envie uma foto</kb-label>
  <kb-helper>PNG ou JPG, até 5MB</kb-helper>
</kb-fileupload>
```

## Uso

```html
<kb-fileupload name="avatar" required>
  <kb-label>Envie uma foto</kb-label>
</kb-fileupload>
```

```js
document.querySelector('kb-fileupload').addEventListener('changed', (event) => {
  console.log(event.detail) // 'data:image/png;base64,…'
})
```

## Quando usar

- **Uma única imagem atrelada a um registro** — um avatar, uma capa, um logo —
  onde ver a escolha antes de submeter importa.
- **Formulários que publicam JSON** — o valor já é uma string, então cabe num
  corpo JSON sem um endpoint de upload separado.

## Quando não usar

- **Múltiplos arquivos.** O input interno aceita um arquivo e o elemento guarda
  um valor; uma galeria precisa de outro controle.
- **Arquivos que não são imagem.** O input interno é `accept="image/*"` e o
  preview é um `<img>` — um seletor de PDF mostraria um preview quebrado.
- **Arquivos grandes.** O base64 infla o payload em cerca de um terço, e a
  string inteira fica na memória e é publicada inline. Passando de alguns
  megabytes, envie para um endpoint de armazenamento e submeta a URL resultante.

## Composição

- **Pode conter**: conteúdo para os três slots nomeados — `label`, `helper` e
  `validity`. Os dois primeiros renderizam dentro do próprio alvo,
  centralizados sob o ícone; o `validity` renderiza abaixo dele. Os três se
  atribuem sozinhos ao conectar.
- **Pode ser filho de**: um `<form>`, o template de um `<kb-form>`, ou de nada.

```html preview
<kb-fileupload name="cover" required>
  <kb-label>Imagem de capa</kb-label>
  <kb-helper>Em paisagem funciona melhor.</kb-helper>
  <kb-validity state="valueMissing">Uma imagem é obrigatória.</kb-validity>
</kb-fileupload>
```

## O valor

`file` guarda a imagem selecionada como data URL em base64, produzida por um
`FileReader` quando a pessoa escolhe algo. Essa única escolha explica a maior
parte do comportamento do elemento:

- **É uma string.** Defina `file` com uma data URL guardada para pré-preencher o
  preview ao editar um registro existente, e leia de volta da mesma forma.
- **O preview é o valor.** A camada de preview aparece exatamente quando `file`
  não está vazio, então não há um estado separado de "tem seleção" para
  rastrear.
- **O tamanho é responsabilidade sua.** Nem o elemento nem o input interno impõem
  um máximo — declare o limite no texto do helper e cheque na submissão, ou o
  formulário publica em silêncio um payload grande demais.

`reset()` limpa o arquivo e o estado inválido e dispara `reset`. O botão de
excluir no canto do preview faz o mesmo pela pessoa.

## Validação

- `required` é a única restrição: com ele definido e nenhum arquivo escolhido, o
  elemento reporta `valueMissing`.
- Leia o desfecho com `checkValidity()`, `reportValidity()`, `validity` e
  `validationMessage`, como em qualquer controle nativo.
- Diferente do `<kb-input>` e do `<kb-textarea>`, o texto do helper **não** fica
  escondido enquanto inválido — a dica (formatos, limite de tamanho) continua
  visível ao lado do erro, que aqui costuma ser o que você quer.

## Atributos

| Atributo | Tipo | Padrão | Descrição |
|---|---|---|---|
| `name` | `string` | `''` | Nome do campo no `FormData` do formulário dono. |
| `file` | `string` | `''` | A imagem como data URL em base64. Defini-la atualiza o preview e dispara `changed`. |
| `required` | `boolean` | `false` | Se um arquivo precisa ser selecionado para a validade. |
| `width` | `auto` \| `fill` \| comprimento | `auto` | Como o alvo preenche o contêiner. |
| `hidden` | `boolean` | `false` | Remove o campo do layout e da árvore de acessibilidade. |

## Métodos

| Método | Devolve | Descrição |
|---|---|---|
| `checkValidity()` | `boolean` | Valida e dispara `invalid` se falhar. |
| `reportValidity()` | `boolean` | Valida e reporta o problema para a pessoa. |
| `reset()` | `this` | Limpa o arquivo e o estado inválido, dispara `reset`. |

## Eventos

| Evento | Dispara quando | `detail` |
|---|---|---|
| `changed` | um arquivo é escolhido ou limpo | a data URL em base64 |

O payload é a imagem inteira, então prefira um listener que a guarde a um arco
que a repassa por vários elementos.

## Estilo

| Custom property | Padrão | Controla |
|---|---|---|
| `--fileupload-aspect-ratio` | `1.95/1` | Formato do alvo **e** do preview — mantenha iguais para a caixa não pular quando uma imagem chega. |
| `--fileupload-color-background` | `transparent` | Fundo do alvo vazio. |
| `--fileupload-color-border` | `var(--color-master-light)` | Borda do alvo. |
| `--fileupload-color-border_hover` | `var(--color-primary)` | Borda no hover — a affordance de que é clicável. |
| `--fileupload-color-icon-background` | `var(--color-primary-lighter)` | Disco atrás do ícone de upload. |
| `--fileupload-border-radius` | `var(--border-radius-sm)` | Arredondamento dos cantos do alvo e do preview. |
| `--fileupload-space-inset` | `var(--spacing-xl) var(--spacing-md)` | Padding do alvo; aceita o atalho completo. |
| `--fileupload-preview-fit` | `cover` | `object-fit` do preview; `contain` mostra a imagem inteira em vez de recortar. |
| `--fileupload-space-gap` | `var(--spacing-nano)` | Espaçamento entre o alvo e a mensagem de validade. |

```html preview
<div style="--fileupload-aspect-ratio: 1/1; --fileupload-preview-fit: contain;">
  <kb-fileupload name="square">
    <kb-label>Avatar quadrado</kb-label>
  </kb-fileupload>
</div>
```

## Estados e acessibilidade

- `hidden` remove o campo do layout e da árvore de acessibilidade.
- O `<input type="file">` interno fica escondido com `display: none` mas
  permanece no DOM, envolvido pelo `<label>` — é isso que torna o alvo inteiro
  clicável e alcançável por teclado. Não replique o clique via script.
- O rótulo não é associado por `for`/`id` aqui; o input fica aninhado dentro
  dele. O conteúdo encaixado em `label` nomeia o controle apenas enquanto
  permanece dentro do alvo — mantenha-o ali.
- O `<img>` do preview renderiza com `alt` vazio, então é anunciado como
  decorativo. É o texto do rótulo que diz a quem usa leitor de tela o que o
  campo guarda.
- O botão de excluir fica dentro do shadow DOM, então o nome acessível dele não
  pode ser definido de fora — vale saber ao auditar o formulário.

## Certo e errado

| Faça | Não faça |
|---|---|
| Declarar os limites de tamanho e formato no texto do helper | Supor que o elemento rejeita um arquivo grande demais — ele não rejeita |
| Pré-preencher o `file` com uma data URL guardada ao editar | Reconstruir o preview você mesmo a partir de um elemento de imagem separado |
| Manter alvo e preview na mesma proporção | Mudar só um e deixar a caixa redimensionar quando uma imagem chega |
| Enviar mídia grande para um endpoint de armazenamento e submeter a URL | Publicar base64 de vários megabytes inline porque é conveniente |
