# Eixo por feature no primeiro nível

Correto: o primeiro nível nomeia o que o sistema **faz**. A camada aparece no segundo,
dentro da feature, onde ela é o recorte certo.

```
src/
├── comment-form/
│   ├── index.js            ← a fronteira: só o que atravessa
│   ├── ui/
│   │   ├── form.js
│   │   └── field.js
│   ├── api/
│   │   └── postComment.js
│   └── model/
│       ├── comment.js
│       └── validate.js
│
├── article-reader/
│   ├── index.js
│   ├── ui/
│   │   └── reader.js
│   └── api/
│       └── fetchArticle.js
│
└── http/                   ← compartilhado de verdade: módulo com assunto próprio,
    ├── index.js              não um depósito chamado utils/
    └── client.js
```

## Os três testes, aplicados

**Deleção simples.** `rm -r src/comment-form/` remove o recurso inteiro. Uma operação, e
nada fica para trás.

**Visibilidade restrita.** `validate.js` e `field.js` não são exportados pelo `index.js`.
São interior: podem ser renomeados, fundidos ou apagados sem alcançar nenhum consumidor.
Num recorte por camada, os dois teriam de ser públicos, porque todo consumidor estaria em
outra pasta.

**Navegação.** Tudo que a tarefa "mudar a validação do comentário" precisa está em
`comment-form/`. Nenhum sufixo, prefixo ou espelhamento de árvore foi necessário para
compensar distância — porque não há distância.

## O que sustenta o recorte

**Cada feature tem nome vindo do produto.** "Formulário de comentário" e "leitor de artigo"
são coisas que alguém pede pelo nome. Esse é o teste de que a feature existe.

**O compartilhado tem assunto.** `http/` não é `utils/`: tem um tema, e alguém sabe dizer
o que provavelmente há dentro. Um depósito genérico teria aceitado qualquer coisa, e é
assim que a distinção entre transversal e mal-recortado deixa de ser feita.

**A camada não sumiu — desceu de nível.** `ui/`, `api/` e `model/` continuam existindo, e
estão certos ali. O erro nunca foi usar camada; foi usá-la no primeiro nível.

## Como isto escala

Quando `comment-form/` ficar grande, ela se divide em duas features, e o critério vem do
produto — moderação virou coisa separada, por exemplo. O eixo continua disponível.

O número de pastas cresce com o produto, e cada uma continua do tamanho que se navega.
