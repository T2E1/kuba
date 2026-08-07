# Introdução

Web Components, o próprio navegador como camada de fluxo de dados, e nenhuma
promessa de reinventar o que a plataforma já resolve.

Ninguém precisa de muitas ferramentas para construir uma interface que
*funciona*. Construir uma que continue funcionando daqui a dois anos, com outra
pessoa mantendo o código, é o desafio real — e isso vem de convenções
explícitas, não de talento individual.

Quando o domínio está claro — quais elementos existem, como conversam entre si,
onde o estado vive — o número de decisões que cada pessoa toma sozinha cai
drasticamente. As mudanças ficam cirúrgicas: você sabe qual arquivo tocar e o
que esperar da edição.

> kuba não abstrai o DOM — ele confia nele.

## Por que existe

**Propósito.** Encurtar a distância entre "o servidor entrega HTML" e "a
interface reage como se houvesse um framework por trás" — sem obrigar quem
constrói o produto a aprender um runtime de estado, uma etapa de build ou uma
nova linguagem de template.

**Missão.** Oferecer um conjunto pequeno e coeso de primitivos — custom elements
e utilitários — que qualquer time possa adotar progressivamente: um único
`<kb-button>` numa página existente, ou uma tela inteira orquestrada pelo
barramento do Echo.

**Visão.** Que times de produto tratem o DOM como uma camada legítima de fluxo
de dados, não como detalhe de implementação a ser escondido atrás de um Virtual
DOM — e que o HTML enviado pelo servidor continue sendo, de fato, a aplicação.

## A lacuna que ocupa

Frameworks de componentes — React, Vue, Angular — resolvem fluxo de dados no
cliente ao custo de um runtime inteiro. O htmx resolve simplicidade devolvendo o
HTML ao servidor, mas não tem fluxo de dados local.

kuba existe para ocupar exatamente esse meio: reatividade imediata entre
elementos, sem abrir mão do HTML como fonte da aplicação.

```html
<kb-input name="query"></kb-input>

<kb-fetch name="api" url="/search?q={}">
  <kb-on value="query/changed:method/get"></kb-on>
</kb-fetch>
```

Dois elementos reagem um ao outro, e nenhum importa o outro. Esse é o modelo
inteiro — veja [Eventos e Echo](/pt-br/learn/events-and-echo).

## Quatro coisas em que acreditamos

### Confie na plataforma antes de reinventá-la

Todo elemento novo começa com a mesma pergunta: *o navegador já resolve isso?*
`<kb-input>` delega validação à Constraint Validation API. `<kb-redirect>` usa a
History API. O Echo se apoia no `dispatchEvent` nativo. Só escrevemos código
quando a plataforma genuinamente não oferece o comportamento — nunca por
preferência estilística.

### Seja criativo, mas responsável

O comportamento é documentado antes de ser considerado pronto. Um `types.d.ts`
sem implementação não é contrato, e uma implementação sem `types.d.ts` não é
componente público. Essa fronteira é o que impede que experimentar dentro de um
pacote vire instabilidade para quem consome.

### Toda interação importa

Isso vale em todas as camadas: como um evento é nomeado, a redação de uma
mensagem de validação, o atributo `aria-*` que falta num elemento. Decisões
pequenas, mantidas consistentes no pacote inteiro, somam uma experiência coerente
— para quem usa a interface e para quem lê o código.

### Não trate uma restrição como desculpa

Um requisito duro não é motivo para abrir exceção na arquitetura. Quando um
cenário não cabe no modelo atual — publicador/assinante sobre o Echo, HTML como
fonte da verdade — o caminho é entender *por que* o modelo resiste, não
contorná-lo. É isso que mantém os [princípios](/pt-br/foundations/principles)
confiáveis ao longo do tempo.

## O que buscamos

**Reduzir o custo da mudança.** Ao se apoiar em APIs nativas — eventos,
`CustomEvent`, `ElementInternals`, a Constraint Validation API — cada elemento
evolui isolado, sem cascata de edições por outras camadas.

**Economizar tempo.** Componentes pequenos, cada um com uma responsabilidade,
significam menos débito técnico acumulado e atualizações mais rápidas de aplicar.

**Construir uma cultura de documentação viva.** Todo pacote público carrega um
`types.d.ts` como contrato, e este site roda contra o pacote publicado a partir
de um CDN — então um release quebrado quebra a documentação, de forma visível,
em vez de passar despercebido.

**Deixar o raciocínio visível.** Todo pacote em `packages/` documenta uma
decisão: por que o Echo sobrescreve `dispatchEvent`, por que `<kb-input>` delega
à Constraint Validation API em vez de reimplementá-la, por que não existe store
central. Tornar esse raciocínio explícito importa tanto quanto o código — é o
que permite estender a biblioteca, não apenas consumi-la.

## Para onde ir agora

- **[Princípios](/pt-br/foundations/principles)** — os três que guiam cada
  decisão.
- **[Tecnologia](/pt-br/foundations/technology)** — zero dependências de
  runtime, e quais APIs nativas as substituem.
- **[Início rápido](/pt-br/learn/quick-start)** — um formulário funcionando em
  dez minutos.
