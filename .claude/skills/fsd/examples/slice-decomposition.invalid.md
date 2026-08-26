# Slice recortada por tipo técnico

Viola a definição de slice: o recorte deve ser por **significado de negócio**, não por
"que tipo de arquivo é este". Correto em `slice-decomposition.valid.md`.

```
src/
├── features/
│   ├── components/             ← ERRO: não é domínio, é tipo de arquivo
│   │   ├── CommentForm.js
│   │   ├── ShareButton.js
│   │   └── ArticleCard.js
│   ├── hooks/                  ← ERRO: idem
│   │   ├── useComment.js
│   │   └── useShare.js
│   ├── services/               ← ERRO: idem
│   │   ├── commentApi.js
│   │   └── shareApi.js
│   └── types/                  ← ERRO duplo: agrupa por "ser um tipo"
│       ├── comment.d.ts
│       └── share.d.ts
```

## O que quebra

**O teste da deleção simples falha.** Remover o recurso de comentário exige caçar arquivo
em quatro pastas, e esquecer um deixa código zumbi (rule 056).

**A regra de import fica invisível.** Não há como saber se `components/CommentForm.js`
pode importar `services/shareApi.js` — o recorte não carrega direção nenhuma.

**O número de pastas fica fixo e cada uma cresce sem limite.** É o sintoma central do
recorte por camada: `components/` com 200 arquivos, e nenhum critério para dividi-la.

**`types/` é o erro que a própria doc do FSD nomeia:** agrupar coisas pela única propriedade
de "serem um tipo" junta o que não tem relação. O tipo mora junto do que o consome — tipo
utilitário em `shared/lib`, tipo de entidade no `model` da slice, DTO junto da requisição.

```
features/
├── comment-form/       ← a correção: o domínio volta a ser o primeiro nível,
│   ├── ui/               e ui/model/api viram segments DENTRO dele
│   ├── model/
│   ├── api/
│   └── index.js
└── article-share/
    ├── ui/
    └── index.js
```
