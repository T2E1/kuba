# Label

O nome de um campo de formulário: um estilo tipográfico fixo, um pouco mais
pesado que o texto corrido, que atribui a si mesmo `slot="label"` ao conectar. É
o nome visível — **não** é um `<label>` nativo, então clicar nele não foca o
campo.

```html preview
<kb-input name="fullname">
  <kb-label>Nome completo</kb-label>
</kb-input>
```

## Uso

```html
<kb-input name="email">
  <kb-label>Email</kb-label>
</kb-input>
```

## Quando usar

- **Nomeando um campo** — dentro de `<kb-input>`, `<kb-textarea>` ou
  `<kb-fileupload>`, que todos expõem um slot `label`.
- **Nomeando um grupo de controles**, onde um título seria alto demais e o texto
  corrido, baixo demais.

## Quando não usar

- **Explicando ou restringindo a entrada** — isso é o `<kb-helper>`, a linha
  menor abaixo do campo. Um rótulo continua sendo um nome.
- **Uma mensagem atrelada à validação** — use o `<kb-validity>`, que só aparece
  para a chave de `ValidityState` que ele observa.
- **Qualquer outro texto** — o `<kb-text>` é o elemento de uso geral, com
  atributos de tamanho, cor e peso. Este não tem nenhum, de propósito: todo
  rótulo de campo no produto tem a mesma aparência.
- **Um título de seção** — use `<kb-text size="lg" weight="bold">`, ou um
  elemento de heading de verdade para o outline do documento. Um rótulo não
  carrega semântica de título.

## Composição

- **Pode conter**: texto e markup inline — o shadow root é um único `<slot>` sem
  nome. Um marcador de obrigatório ou um `<kb-icon>` inline funcionam; conteúdo
  de nível de bloco não, já que o host é `inline-flex`.
- **Pode ser filho de**: qualquer componente que exponha um slot `label`.
  Colocado em qualquer outro lugar ele ainda renderiza, mas o `slot="label"` que
  define em si mesmo não casa com nada.

O elemento define o próprio atributo `slot` ao conectar, então você aninha e não
escreve mais nada:

```html preview
<kb-textarea name="bio">
  <kb-label>Bio</kb-label>
  <kb-helper>Uma ou duas frases sobre você.</kb-helper>
</kb-textarea>
```

## Conteúdo

Nomeie o campo com o menor número de palavras possível, com inicial maiúscula
apenas na primeira: "Nome completo", não "Por favor digite seu nome completo
aqui". Qualquer coisa mais longa pertence a um `<kb-helper>`.

Mantenha o rótulo estável — um nome que muda enquanto a pessoa digita, ou que
faz as vezes de placeholder, a deixa sem nada a que se referir.

## Atributos

Este elemento não tem atributos e não dispara eventos. O estilo tipográfico dele
é fixo por decisão de projeto, para que os rótulos de campo sejam uniformes em
todo o produto.

## Estilo

| Custom property | Padrão | Controla |
|---|---|---|
| `--label-color` | `var(--color-master-dark)` | Cor do texto. |
| `--label-font-family` | `var(--font-family-base)` | Família tipográfica. |
| `--label-font-size` | `var(--font-size-xxs)` (14px) | Tamanho da tipografia. |
| `--label-font-weight` | `var(--font-weight-medium)` | Peso da tipografia — o que separa um rótulo de uma linha de helper. |
| `--label-line-height` | `var(--line-height-default)` | Entrelinha. |

Elas existem para deslocamentos no nível da superfície — um painel invertido, um
formulário mais denso — e não para ajustes pontuais:

```html preview
<div style="--label-color: var(--color-primary); --label-font-size: 16px;">
  <kb-input name="highlighted">
    <kb-label>Um rótulo deslocado para uma superfície</kb-label>
  </kb-input>
</div>
```

## Estados e acessibilidade

- `kb-label` não tem atributo `hidden` nem custom states.
- **Ele não é um `<label>`.** Não há atributo `for` nem associação implícita,
  então clicar nele não foca o campo, e um leitor de tela não vai anunciá-lo
  como o nome do controle só pela proximidade. Dê ao controle o próprio nome
  acessível — `aria-label` no campo, ou um `id` aqui mais `aria-labelledby` no
  controle.
- Marcar um campo como obrigatório aqui é apenas visual; defina `required` no
  próprio campo para que o estado seja exposto e validado, e deixe o marcador
  ser o eco visível disso.
- Um rótulo escondido ou removido deixa o campo sem nome. Mantenha-o presente
  mesmo quando o design é compacto — um placeholder não é substituto.

## Certo e errado

| Faça | Não faça |
|---|---|
| Aninhar dentro do campo e deixar que ele se encaixe sozinho | Definir `slot="label"` à mão — o elemento já faz isso |
| Dar ao controle um nome acessível próprio | Contar com o `kb-label` para nomear o campo para a tecnologia assistiva |
| Manter numa frase nominal curta, com inicial maiúscula só na primeira palavra | Transformá-lo numa instrução — isso é o `<kb-helper>` |
| Manter o rótulo visível ao lado do campo | Substituí-lo por um placeholder que some no foco |
