# Início rápido

Você vai construir um formulário de cadastro funcionando — campos rotulados,
validação nativa, mensagens de erro por regra e um handler de submit que recebe
os dados já parseados — e depois conectar um segundo elemento a ele sem escrever
um listener.

Tudo aqui roda num arquivo HTML puro com as duas tags da
**[Instalação](/pt-br/learn/installation)**. Sem build, sem bundler, sem
framework.

## 1. Um campo

Comece com um input. `name` é como o valor será enviado; `type` e `required` são
repassados a um `<input>` real dentro do shadow root, então o navegador valida
por você.

```html preview
<kb-input name="email" type="email" required>
  <kb-label>E-mail</kb-label>
  <kb-helper>Nunca vamos compartilhar.</kb-helper>
</kb-input>
```

Duas coisas aconteceram sem configuração. `<kb-label>` e `<kb-helper>` se
atribuíram aos slots `label` e `helper` ao conectar — você aninha, não conecta. E
o campo é associado a formulário, então será enviado como um controle nativo.

## 2. Mensagens de erro por regra

Uma única mensagem "inválido" obriga a pessoa a adivinhar qual regra quebrou.
Adicione um `<kb-validity>` por modo de falha; cada um observa uma chave do
`ValidityState` nativo e aparece só para aquela falha.

```html preview
<kb-input name="password" type="password" required minlength="8">
  <kb-label>Senha</kb-label>
  <kb-helper>Ao menos 8 caracteres.</kb-helper>
  <kb-validity state="valueMissing">Escolha uma senha.</kb-validity>
  <kb-validity state="tooShort">Ao menos 8 caracteres.</kb-validity>
</kb-input>
```

Digite um caractere e apague para ver as duas mensagens se alternarem. Repare
que o texto de apoio desaparece enquanto o campo está inválido — o erro toma o
lugar dele em vez de se empilhar abaixo.

## 3. O formulário

`<kb-form>` renderiza seus campos a partir de um `<template>` filho e transforma
o submit em um evento com os dados já parseados. `autorender` diz para renderizar
ao conectar, já que ainda não há dados para interpolar.

```html preview
<kb-form autorender id="signup">
  <template>
    <kb-input name="email" type="email" required>
      <kb-label>E-mail</kb-label>
      <kb-validity state="valueMissing">E-mail é obrigatório.</kb-validity>
      <kb-validity state="typeMismatch">Isso não é um e-mail.</kb-validity>
    </kb-input>
    <kb-input name="password" type="password" required minlength="8">
      <kb-label>Senha</kb-label>
      <kb-validity state="tooShort">Ao menos 8 caracteres.</kb-validity>
    </kb-input>
    <kb-button type="submit">Criar conta</kb-button>
  </template>
</kb-form>

<kb-text id="signup-output" size="xxs" color="master">nada enviado ainda</kb-text>

<script type="module">
  document.querySelector('#signup').addEventListener('submitted', (event) => {
    document.querySelector('#signup-output').textContent = JSON.stringify(
      event.detail,
    )
  })
</script>
```

Envie com um campo vazio: nada dispara, porque a validação nativa roda primeiro e
bloqueia. Preencha os dois corretamente e `submitted` chega com
`{ email: …, password: … }` — indexado pelo `name` de cada campo, já parseado.
Você nunca toca em `FormData`.

?> Os campos vivem dentro de um `<template>`, não como filhos comuns.
`<kb-form>` renderiza esse template no seu shadow root; filhos fora dele não são
projetados. Veja **[Componentes › Form](/pt-br/components/)** para o porquê.

## 4. Conectando sem listeners

Até aqui você escreveu um `addEventListener`. Agora conecte dois elementos sem
script nenhum. Todo elemento do kuba é um host Echo: seu atributo `on` — ou um
filho `<kb-on>` — declara um **arco**, `origem/evento:tipo/destino`.

```html preview
<kb-input name="greeting" placeholder="Digite seu nome">
  <kb-label>Nome</kb-label>
</kb-input>

<kb-render>
  <kb-on value="greeting/changed:method/render"></kb-on>
  <template>Olá, {}!</template>
</kb-render>
```

Leia o arco como uma frase: *quando o elemento chamado `greeting` disparar
`changed`, chame o método `render` em mim, com o payload*. `<kb-render>`
interpola o payload no seu `<template>` — `{}` é o valor inteiro.

Nenhum dos dois referencia o outro em código. O input não sabe que existe um
renderizador; o renderizador não importa o input. Eles concordam com um nome de
evento. Esse é todo o modelo de acoplamento, e é por isso que o kuba não tem
árvore de componentes.

## O que ler depois

- **[Ciclo de vida](/pt-br/learn/lifecycle)** — o que `@define`, `@paint` e
  `@repaint` fazem entre "elemento no HTML" e "pixels na tela".
- **[Eventos e Echo](/pt-br/learn/events-and-echo)** — a gramática completa do
  arco, incluindo filtros, e quando preferir um listener.
- **[Componentes](/pt-br/components/)** — cada elemento com seus atributos,
  estados e ganchos de estilo.
- **[Receitas](/pt-br/cookbook/)** — telas completas: busca enquanto digita,
  CRUD, navegação declarativa.
