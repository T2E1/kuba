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

## Duas escolas de pensamento, e a lacuna entre elas

O desenvolvimento frontend moderno convergiu para duas filosofias concorrentes,
e cada uma resolve apenas metade do problema.

**React, Vue e Angular** tratam o DOM como um detalhe de implementação a ser
abstraído. O estado vive no JavaScript. A interface é uma função pura desse
estado, rerrenderizada por um virtual DOM e reconciliada de volta em elementos
reais. Isso entrega aos times um modelo de fluxo de dados genuinamente poderoso
— componentes conseguem reagir uns aos outros, compor e atualizar de forma
previsível. Mas o custo é um universo paralelo: um runtime que precisa ser
enviado ao navegador, uma etapa de build que precisa compilar JSX ou templates
em JavaScript, e um modelo de estado que não tem relação nenhuma com o DOM que
ele acaba produzindo. O HTML que o navegador recebe deixa de ser a aplicação;
ele vira um alvo de renderização.

**O htmx** vai na direção oposta. Ele restaura o HTML como a aplicação: o
servidor renderiza markup, o cliente troca fragmentos dele no lugar, e nenhum
modelo de estado no cliente é necessário. É um retorno ao modelo original de
requisição/resposta da web, e uma rejeição legítima da complexidade do frontend.
Mas vem com uma limitação real: o htmx não tem fluxo de dados *dentro do
cliente*. Dois elementos na mesma página não conseguem reagir um ao outro sem
uma ida ao servidor buscar um fragmento novo. Interatividade que deveria ser
instantânea e local — um filtro reagindo a um input, um contador reagindo a um
toggle — é modelada como requisição de rede, porque não há outro canal
disponível.

A lacuna entre essas duas escolas é exatamente a lacuna que o kuba fecha:
**fluxo de dados no cliente sem sair do HTML, e sem um runtime de estado em
JavaScript para manter.**

### Como o kuba resolve

O navegador tem um mecanismo de fluxo de dados desde 1995: o sistema de eventos
do DOM. Todo elemento consegue disparar um evento; todo elemento consegue
escutar um. Os frameworks reinventaram essa capacidade em userland — props,
stores, observables — porque eventos crus do DOM, sozinhos, são desestruturados
demais para compor uma aplicação. Não existe um vocabulário compartilhado sobre
*qual* elemento deve reagir a *qual* evento, nem *como*.

A resposta do kuba é padronizar esse vocabulário, não substituir o mecanismo.
Todo custom element do kuba entende um atributo declarativo de ligação (`on`)
que descreve, em markup puro, qual evento de qual elemento de origem deve guiar
qual propriedade, método ou atributo de destino nele mesmo. O sistema nativo de
`CustomEvent` do navegador faz a entrega de verdade; o kuba só fornece a
gramática para expressar a intenção.

```html
<kb-input name="query"></kb-input>

<kb-fetch name="api" url="/search?q={}">
  <kb-on value="query/changed:method/get"></kb-on>
</kb-fetch>
```

Dois elementos reagem um ao outro, e nenhum importa o outro. A consequência é um
modelo de fluxo de dados que é:

- **No cliente**, como React/Vue/Angular — elementos reagem uns aos outros
  instantaneamente, sem ida e volta ao servidor para interatividade local.
- **HTML primeiro**, como o htmx — a ligação vive no markup, não numa árvore de
  estado em JavaScript; não há nada para compilar, hidratar ou reconciliar.
- **Nativo**, diferente dos dois — não existe um barramento de eventos
  específico de framework por baixo; é o próprio sistema de eventos do DOM,
  exposto em vez de escondido.

É por isso que o kuba se entende melhor como uma evolução do que como uma
terceira alternativa ao lado das outras duas: ele pega a ambição de fluxo de
dados dos frameworks de componentes e a fidelidade à plataforma do htmx, e
satisfaz as duas com o único mecanismo que o navegador já entregou exatamente
para isso. A gramática completa está em
[Eventos e Echo](/pt-br/foundations/events-and-echo).

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

## A plataforma sobre a qual se apoia

kuba é escrito em JavaScript puro, com **zero dependências de runtime**. Confira
o `package.json`: a seção `dependencies` está vazia.

Não foi por falta de opções. Decorre dos
[princípios](/pt-br/foundations/principles):

1. **Web Components são nativos.** Não precisam de framework para existir nem
   para se registrar.
2. **Uma dependência a menos é uma cadeia de suprimentos a menos** para auditar,
   atualizar e ver quebrar em produção.
3. **Curva de aprendizado mais suave.** Quem conhece DOM e `CustomEvent` já
   consegue ler o código-fonte do kuba.
4. **Todo desenvolvedor front-end sabe JavaScript**, seja qual for o framework
   do dia a dia.

### As APIs nativas em que se apoia

Nenhuma delas é dependência instalável. São capacidades que o navegador já traz,
e que o kuba expõe por uma API declarativa em vez de esconder atrás de uma
abstração própria.

| API | Usada para |
|---|---|
| **Custom Elements** | Toda tag `<kb-*>`, registrada pelo decorator `define`. |
| **Shadow DOM** | Markup e estilos de cada elemento, isolados da página. |
| **Constraint Validation API** | Validação nativa em `<kb-input>`, `<kb-textarea>`, `<kb-fileupload>`. |
| **`ElementInternals`** | Associação a formulário e estados customizados (`:state(invalid)`, `:state(hidden)`) sem reimplementar a semântica de `<form>`. |
| **`CustomEvent`** | Todo o barramento do Echo. Elementos se comunicam do jeito que o DOM já faz. |
| **Constructable stylesheets** | `adoptedStyleSheets`, para uma folha ser parseada uma vez e compartilhada entre instâncias. |
| **History API** | Navegação no cliente em `router` e `<kb-redirect>`. |
| **CSS `light-dark()`** | Valores claro e escuro num único token de cor, resolvidos pelo `color-scheme` da página. |
| **CSS custom properties** | Toda a superfície de temas, herdando através do shadow boundary. |

O único shim do código é o `setImmediate`, usado para agrupar repaints — poucas
linhas, não uma biblioteca.

## Para onde ir agora

- **[Princípios](/pt-br/foundations/principles)** — os três que guiam cada
  decisão.
- **[Instalação](/pt-br/learn/installation)** — uma tag de script, ou uma
  instalação de pacote.
- **[Início rápido](/pt-br/learn/quick-start)** — um formulário funcionando em
  dez minutos.
