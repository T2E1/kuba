# Helper

A pequena linha secundária abaixo de um campo de formulário: uma dica, uma
exigência de formato, uma observação. Ela carrega um único estilo tipográfico
fixo e, ao conectar, atribui a si mesma `slot="helper"` — então aninhá-la dentro
de um campo é toda a ligação necessária.

```html preview
<kb-input name="password" type="password" minlength="8">
  <kb-label>Senha</kb-label>
  <kb-helper>Precisa ter pelo menos 8 caracteres.</kb-helper>
</kb-input>
```

## Uso

```html
<kb-input name="password">
  <kb-helper>Precisa ter pelo menos 8 caracteres.</kb-helper>
</kb-input>
```

## Quando usar

- **Declarando uma restrição antes de a pessoa esbarrar nela** — "Precisa ter
  pelo menos 8 caracteres", "Formato: DD/MM/AAAA" — abaixo do campo que ela
  descreve.
- **Mostrando uma observação sobre o campo** escrita por você, e não derivada do
  `ValidityState` do navegador.
- **Adicionando contexto que um rótulo não deveria carregar** — um rótulo nomeia
  o campo e continua curto; o raciocínio vem para cá.

## Quando não usar

- **Uma mensagem atrelada a uma chave de `ValidityState`** — use
  `<kb-validity state="…">`, que escuta o campo pai e só se mostra para aquela
  falha. Este elemento está sempre visível; ele não reage à validade.
- **Nomear o campo** — isso é o `<kb-label>`, que se encaixa sozinho no slot
  `label` e carrega o estilo maior, de peso médio.
- **Texto corrido** — o `<kb-text>` é o elemento de texto geral, com o conjunto
  completo de atributos de tamanho, cor e peso. Este deliberadamente não tem
  nenhum.

## Composição

- **Pode conter**: texto e markup inline — o shadow root é um único `<slot>` sem
  nome. Um link dentro da dica está ok; conteúdo de nível de bloco não, já que o
  host é `inline-flex`.
- **Pode ser filho de**: qualquer componente que exponha um slot `helper` —
  `<kb-input>`, `<kb-textarea>`, `<kb-fileupload>`. Colocado em qualquer outro
  lugar ele ainda renderiza, mas o `slot="helper"` que define em si mesmo não
  casa com nada.

!> **No `<kb-input>` e no `<kb-textarea>`, o helper fica escondido enquanto o
campo está inválido** — a mensagem do `<kb-validity>` toma o lugar dele, em vez
de empilhar embaixo. Se a dica carrega uma exigência que a pessoa ainda precisa
enquanto corrige o erro, repita-a na mensagem de validade. O `<kb-fileupload>`
não faz isso; o helper dele continua visível.

```html preview
<kb-input name="username" required minlength="3">
  <kb-label>Nome de usuário</kb-label>
  <kb-helper>Apenas letras e números, mínimo de 3 caracteres.</kb-helper>
  <kb-validity state="valueMissing">Escolha um nome de usuário — letras e números, mínimo 3.</kb-validity>
</kb-input>
```

## Conteúdo

Mantenha em uma linha. A tipografia é o menor degrau da escala (12px) na
entrelinha mais folgada, o que lê bem para uma linha e mal para um parágrafo.

Escreva a exigência, não a falha: "Precisa ter pelo menos 8 caracteres" diz o
que fazer antes *e* depois do erro, enquanto "Senha inválida" só diz que algo
deu errado. Reserve o texto de erro para o `<kb-validity>`.

## Atributos

Este elemento não tem atributos e não dispara eventos. O estilo tipográfico dele
é fixo por decisão de projeto, para que as dicas fiquem iguais em todo lugar.

## Estilo

| Custom property | Padrão | Controla |
|---|---|---|
| `--helper-color` | `var(--color-master-dark)` | Cor do texto. |
| `--helper-font-family` | `var(--font-family-base)` | Família tipográfica. |
| `--helper-font-size` | `var(--font-size-xxxs)` (12px) | Tamanho da tipografia. |
| `--helper-font-weight` | `var(--font-weight-regular)` | Peso da tipografia. |
| `--helper-line-height` | `var(--line-height-lg)` | Entrelinha. |

A cor é a que mais vale usar — prefira um token semântico para que o significado
viaje junto, em vez de escolher um tom:

```html preview
<div style="--helper-color: var(--color-info);">
  <kb-input name="invite">
    <kb-label>Código de convite</kb-label>
    <kb-helper>Opcional — deixe em branco para entrar no workspace público.</kb-helper>
  </kb-input>
</div>
```

## Estados e acessibilidade

- `kb-helper` não tem atributo `hidden` nem custom states — remova o elemento
  quando a dica não se aplicar mais.
- **O elemento não carrega relação ARIA nenhuma com o campo.** Um leitor de tela
  só o lê se ele cair ao lado do input na ordem de leitura. Para garantir, dê um
  `id` ao helper e defina `aria-describedby` no controle.
- O `--color-master-dark` numa superfície branca tem contraste intencionalmente
  menor que o texto corrido. Mantenha acima de 4.5:1 contra a superfície; se uma
  dica precisa ser notada, promova para `<kb-validity>` ou um `<kb-text>`
  colorido em vez de apagá-la ainda mais.
- Não dependa só de cor para uma dica de alerta — a redação precisa dizer.

## Certo e errado

| Faça | Não faça |
|---|---|
| Aninhar dentro do campo e deixar que ela se encaixe sozinha | Definir `slot="helper"` à mão — o elemento já faz isso |
| Manter em uma única linha curta | Escrever um parágrafo em 12px |
| Usar `<kb-validity>` para mensagens atreladas a um estado de validade | Alternar um `kb-helper` via script para simular validação |
| Ligá-la com `aria-describedby` a partir do controle | Supor que só a proximidade a associa para leitores de tela |
