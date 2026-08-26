# Eixo por camada no primeiro nível

Viola o eixo de decomposição: o primeiro nível nomeia o que os arquivos **são**, não o que
o sistema faz. Correto em `axis-choice.valid.md`.

```
src/
├── components/             ← ERRO: tipo de arquivo, não recurso
│   ├── CommentForm.js
│   ├── CommentField.js
│   ├── ArticleReader.js
│   └── ArticleCard.js
├── services/               ← ERRO: idem
│   ├── commentApi.js
│   └── articleApi.js
├── models/                 ← ERRO: idem
│   ├── comment.js
│   └── article.js
├── validators/             ← ERRO: idem
│   ├── validateComment.js
│   └── validateArticle.js
└── utils/                  ← ERRO agravado: o depósito que aceita tudo
    ├── http.js
    ├── formatDate.js
    └── misc.js
```

## Os três testes, todos falhando

**Deleção simples falha.** Remover o recurso de comentário exige caçar arquivo em quatro
pastas. Esquecer um deixa código zumbi (rule 056), e nada avisa que ficou para trás.

**Visibilidade restrita é impossível.** `validateComment.js` precisa ser público, porque
seu único consumidor está em `components/`. Todo arquivo é público por construção — o
recorte torna o encapsulamento inalcançável.

**Navegação exige convenção.** Para achar o que pertence ao comentário, a única pista é o
prefixo `comment` repetido em quatro pastas. Foi o eixo que criou a distância, e o prefixo
existe para compensá-la.

## O sintoma que aparece primeiro

Mudar a validação do comentário toca `validators/`, `models/` e `components/`. É Shotgun
Surgery (rule 058), e a causa não é descuido de quem escreveu: é o eixo.

## O sintoma que aparece em três anos

A estrutura tem as **mesmas cinco pastas** do primeiro dia, com 200 arquivos em cada uma —
e nenhum critério disponível para dividi-las. O eixo já foi gasto no primeiro nível, e não
sobrou nada por onde a estrutura evoluir.

`utils/` é o caso extremo: aceita tudo, então nunca se decide se um arquivo é transversal
de verdade ou apenas ainda não foi recortado. `misc.js` é o fim dessa linha.

## A correção

```
src/
├── comment-form/           ← o recurso volta ao primeiro nível
│   ├── index.js              e a camada desce para dentro dele
│   ├── ui/
│   ├── api/
│   └── model/
├── article-reader/
│   ├── index.js
│   ├── ui/
│   └── api/
└── http/                   ← o transversal de verdade ganha assunto e nome
    └── index.js
```
