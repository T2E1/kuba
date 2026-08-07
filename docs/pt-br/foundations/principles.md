# Princípios

Princípios existem para tirar a subjetividade das decisões. Cada um cabe em uma
palavra, e cada um carrega o motivo de existir — sem isso, é slogan.

Três bastam para o kuba hoje. Divida em subgrupos se o seu produto precisar; só
mantenha-os claros e tangíveis o bastante para encerrar uma discussão.

## Simples

Buscamos simplicidade em como cada componente é construído, nas regras que
escrevemos e em como o kuba é aplicado para construir um produto.

**Um elemento que precisa de documentação extensa para ser entendido
provavelmente faz demais.** Esse é o teste, e ele corta para os dois lados:
quando a página de um componente cresce aqui porque o elemento tem regras
demais, é o elemento que deve mudar.

*Palavras-chave: fácil, direto, claro, focado.*

## Acessível

Projetamos para todos, e por isso critérios de acessibilidade nunca são pulados
— nem numa decisão de design, nem numa de código.

Na prática, isso significa que a plataforma faz o trabalho pesado: um `<input>`
real dentro do `<kb-input>`, um `<form>` real dentro do `<kb-form>`, landmarks
nativos em `<kb-header>` e `<kb-footer>`. Eles trazem comportamento de teclado,
ordem de foco e semântica de leitor de tela que uma `<div>` nunca teria.

Significa também ser honesto sobre onde um elemento para. O clique do
`<kb-card>` é só de mouse; `<kb-icon>` não tem nome acessível; `<kb-validity>`
não é anunciado quando aparece. Cada página de componente diz isso na sua seção
de acessibilidade, porque uma lacuna que você conhece é uma lacuna que você pode
fechar.

*Palavras-chave: inclusivo, cuidadoso, universal.*

## Flexível

Componentes devem se adaptar a múltiplas marcas e cenários diferentes — sem
bifurcar o componente para cada variação.

É isso que design tokens e custom properties tornam possível: o mesmo
`<kb-button>`, com aparência diferente, trocando quais tokens estão ativos. Toda
decisão visual de todo elemento é exposta como uma propriedade `--{componente}-*`
com padrão vindo de um token, então re-estilizar nunca significa alcançar um
shadow root — veja [Estilização](/pt-br/learn/styling).

*Palavras-chave: adaptável, versátil, dinâmico.*

## Princípios de design

Tudo se resume a simplicidade visual. **Todo design token existe para remover
uma decisão arbitrária — não para multiplicar opções.** A escala de espaçamento,
a paleta de cores, os níveis de sombra: cada uma é pequena o bastante para
memorizar, e restrita o bastante para que duas telas do mesmo produto nunca
pareçam feitas por pessoas diferentes.

Isso aparece em como os componentes se compõem. Um `<kb-card>` não define seu
espaçamento interno — usa a escala de espaçamento. Um `<kb-button>` não inventa
sua paleta — resolve `--color-{valor}` contra os tokens ativos. A aparência muda
quando o token muda, nunca porque alguém decidiu que naquela tela específica
fica melhor diferente.

O corolário merece ser dito: **um valor que não é token é um bug no design
system, não um atalho.** Quando você precisa de um tamanho que a escala não tem,
a pergunta é se a escala está errada — não se aquela tela pode ser exceção.
