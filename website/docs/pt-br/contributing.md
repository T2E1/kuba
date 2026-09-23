# Contribuir

kuba está em `0.1.0-alpha` e em desenvolvimento ativo. Use, dê retorno, e
contribua com essa evolução.

É distribuído sob a licença **MIT** — use para qualquer finalidade, comercial
inclusive; apenas mantenha os créditos em
[`LICENSE`](https://github.com/T2E1/kuba/blob/main/LICENSE).

## Rodando localmente

```sh
git clone https://github.com/T2E1/kuba.git
cd kuba
bun install
```

O repositório não tem dependências de runtime, então o `bun install` só baixa as
ferramentas. Os scripts — rodar a documentação, a suíte de testes, o linter, o
build — estão listados no
[`CONTRIBUTING.md`](https://github.com/T2E1/kuba/blob/main/CONTRIBUTING.md), que
é onde o setup de desenvolvimento é mantido atualizado.

## O formato de uma mudança

Dois portões rodam antes de um commit entrar, ambos via husky: o
**`lint-staged`** roda `biome check --write` nos arquivos em stage — formatação
não é assunto de revisão, quem decide é a ferramenta — e o **`commitlint`**
rejeita qualquer mensagem que não seja um
[Conventional Commit](https://www.conventionalcommits.org/) antes que ela chegue
ao histórico.

```
feat(input): add a pattern attribute
fix(echo): tear down the arc on disconnect
docs(card): document the outlined variant
```

O prefixo não é decoração: é ele que determina o incremento de versão.

O [`CONTRIBUTING.md`](https://github.com/T2E1/kuba/blob/main/CONTRIBUTING.md) no
repositório carrega o resto — a estrutura do projeto, o que um elemento novo
entrega, e o que se espera de um pull request.

Antes de escrever qualquer coisa, confira [Nomenclatura](/foundations/naming) —
a mudança pode ser um Bloco (uma composição de Elementos existentes) em vez de
um Elemento novo, e nesse caso ela precisa de markup, não de um pacote.

## A documentação faz parte da mudança

Este site é markdown renderizado pelo docsify no navegador, e ele carrega o kuba
**do CDN numa versão fixada**, declarada no `docs/index.html` — as mesmas duas
tags que qualquer consumidor escreveria. Todo exemplo ao vivo aqui roda contra o
pacote publicado, então uma regressão aparece como exemplo morto, em vez de
passar no verde contra um código-fonte que só existe na máquina de quem
desenvolve.

Duas consequências para quem contribui:

- **Um release atualiza a versão fixada.** Publicar uma versão sem atualizar o
  `docs/index.html` deixa a documentação descrevendo comportamento que o pacote
  publicado não tem. O workflow do Pages falha o build quando a versão fixada
  aponta para algo não publicado, mas não consegue pegar uma que esteja apenas
  desatualizada.
- **A página faz parte do elemento.** Um elemento novo ou alterado chega com sua
  página em `docs/components/` no mesmo pull request.

## Reportando algo

Abra uma [issue](https://github.com/T2E1/kuba/issues). Retorno positivo também é
bem-vindo — saber o que funciona ajuda tanto quanto saber o que não funciona.

Para um bug, o formato útil é: o markup, o que você esperava, o que aconteceu, e
qual versão. Uma reprodução ao vivo vale mais que uma descrição, e como o kuba
não precisa de etapa de build, um único arquivo HTML com as duas tags do CDN
costuma bastar.

Uma questão de segurança vai para o
[`SECURITY.md`](https://github.com/T2E1/kuba/blob/main/SECURITY.md) — de forma
privada, não por uma issue pública.

## Construindo seu produto sobre ele

Começando seu próprio produto e quer o kuba como fundação? Instale, ou clone o
repositório e use a estrutura de pacotes como ponto de partida. Adapte os design
tokens à sua marca — veja [Temas](/build-ui/theming) — e ajuste os
componentes conforme precisar.

kuba não é um framework que dita uma única forma de trabalhar. É uma referência
para ser estudada, entendida e adaptada à realidade de cada produto; as
garantias vêm dos [princípios](/foundations/principles), não de uma API
que precise ser obedecida à risca.

Só lembre de manter os créditos da licença, como a licença MIT exige.
