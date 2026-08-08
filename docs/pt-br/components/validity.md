# Validity

Uma mensagem de erro ligada a uma falha. Ela observa uma única chave de
`ValidityState` no campo pai — `valueMissing`, `typeMismatch`, `tooShort` — e só
se mostra enquanto aquela bandeira específica está verdadeira, para que a pessoa
leia o motivo em vez de "inválido".

```html preview
<kb-input name="email" type="email" required minlength="6">
  <kb-label>Email</kb-label>
  <kb-validity state="valueMissing">Este campo é obrigatório.</kb-validity>
  <kb-validity state="typeMismatch">Digite um endereço de email válido.</kb-validity>
  <kb-validity state="tooShort">Pelo menos 6 caracteres.</kb-validity>
</kb-input>
```

Digite uma única letra, depois limpe o campo, para ver as três mensagens
trocarem.

## Uso

```html
<kb-input name="email" type="email" required>
  <kb-validity state="typeMismatch">Digite um endereço de email válido.</kb-validity>
</kb-input>
```

## Quando usar

- **Explicando a falha de uma restrição específica** — um elemento por regra que
  o campo pode quebrar, cada um com sua própria redação.
- **Substituindo o balão nativo do navegador** por uma mensagem que vive no
  layout, combina com o design, e continua visível enquanto a pessoa corrige o
  campo.

## Quando não usar

- **Uma dica que é sempre relevante** — isso é o `<kb-helper>`, visível desde o
  começo. Este elemento é invisível até a regra dele falhar.
- **Um erro de nível de formulário** ("Não foi possível salvar, tente
  novamente") — isso não é um `ValidityState` de um campo. Renderize perto da
  ação de submissão.
- **Fora de um elemento associado a formulário.** O elemento lê
  `parentElement.validity` diretamente; sem esse pai ele nunca fica visível e
  silenciosamente não faz nada.

## Composição

- **Pode conter**: o texto da mensagem e markup inline. O host é `inline` quando
  exibido, então mantenha numa frase.
- **Pode ser filho de**: `<kb-input>`, `<kb-textarea>` ou `<kb-fileupload>` — e
  apenas como filho **direto**, já que é do pai que a `validity` é lida. Ele
  atribui a si mesmo `slot="validity"` ao conectar, então aninhar é toda a
  configuração.

Use quantos o campo tiver modos de falha; eles são mutuamente exclusivos por
construção, já que o navegador reporta uma falha por vez.

## Qual estado

`state` nomeia uma propriedade do
[`ValidityState`](https://developer.mozilla.org/docs/Web/API/ValidityState)
nativo do pai. Ele é usado como busca por chave, então precisa casar exatamente
com a propriedade do DOM — camelCase, não o nome do atributo que a causa.

| `state` | Dispara quando | Causado por |
|---|---|---|
| `valueMissing` | o campo está vazio | `required` |
| `typeMismatch` | o valor não é do tipo certo | `type="email"`, `type="url"` |
| `patternMismatch` | o valor não casa com o regex | `pattern` |
| `tooShort` / `tooLong` | o comprimento está fora da faixa | `minlength` / `maxlength` |
| `rangeUnderflow` / `rangeOverflow` | um número ou data está fora da faixa | `min` / `max` |
| `stepMismatch` | o valor não está na grade do passo | `step` |
| `badInput` | o navegador não consegue interpretar o que foi digitado | letras num `type="number"` |

!> Uma chave escrita errado — `valuemissing`, ou o nome do atributo `required` —
lê como `undefined` e a mensagem simplesmente nunca aparece. Não há aviso.
Confira a grafia primeiro quando uma mensagem não aparecer.

O elemento reavalia em `changed`, `invalid` e `reset` vindos do pai, então ele se
atualiza conforme a pessoa digita e limpa quando o campo é resetado.

## Conteúdo

Diga o que fazer, não que algo está errado: "Digite um endereço de email válido"
vale mais que "Email inválido". Mantenha cada mensagem em uma linha — o elemento
usa o menor degrau da escala tipográfica.

## Atributos

| Atributo | Tipo | Padrão | Descrição |
|---|---|---|---|
| `state` | chave de `ValidityState` | — | Qual bandeira de validade observar no pai. |
| `on` | string de arco | — | Ligação do Echo, `origem/evento:tipo/destino`. |

Este elemento não dispara eventos. Ele não tem atributo `hidden` — a
visibilidade é guiada inteiramente pelo custom state `invalid` que ele define em
si mesmo.

## Estilo

| Custom property | Padrão | Controla |
|---|---|---|
| `--validity-color` | `var(--color-danger)` | Cor da mensagem. |
| `--validity-font-family` | `var(--font-family-base)` | Família tipográfica. |
| `--validity-font-size` | `var(--font-size-xxxs)` | Tamanho da tipografia. |
| `--validity-font-weight` | `var(--font-weight-regular)` | Peso da tipografia. |
| `--validity-line-height` | `var(--line-height-lg)` | Entrelinha. |

Os padrões combinam com o `<kb-helper>`, exceto pela cor — o que é deliberado, já
que o erro toma o lugar do helper no `<kb-input>` e no `<kb-textarea>` enquanto o
campo está inválido.

```html preview
<div style="--validity-color: var(--color-warning);">
  <kb-input name="nickname" minlength="3">
    <kb-label>Apelido</kb-label>
    <kb-validity state="tooShort">Nomes curtos são difíceis de encontrar.</kb-validity>
  </kb-input>
</div>
```

## Estados e acessibilidade

- A visibilidade é guiada pelo custom state `invalid` **deste** elemento, que
  espelha a única chave de `ValidityState` que ele observa — e não a validade
  geral do pai. Estilize com `:state(invalid)`; não o defina você.
- `display: none` até a regra falhar significa que a tecnologia assistiva não vê
  nada no início, e a mensagem aparece no meio da interação sem ser anunciada.
  Adicione `aria-live="polite"` no elemento quando o erro precisar ser ouvido no
  momento em que aparece.
- A mensagem não é ligada ao campo por `aria-describedby` — a associação é
  estrutural, não programática. Adicione o atributo no controle quando um leitor
  de tela precisar amarrar os dois.
- A cor sozinha não carrega o erro; a redação carrega. É por isso que cada
  mensagem declara a própria regra.

## Certo e errado

| Faça | Não faça |
|---|---|
| Aninhar um elemento por modo de falha | Escrever uma mensagem genérica para todas as regras |
| Casar o `state` com a chave de `ValidityState`, em camelCase | Usar o nome do atributo (`required`) como estado |
| Mantê-lo como filho direto do campo | Envolvê-lo num `<div>` — é do pai que a validade é lida |
| Dizer à pessoa como corrigir | Declarar apenas que o valor é inválido |
