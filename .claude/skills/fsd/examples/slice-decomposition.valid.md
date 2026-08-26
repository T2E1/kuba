# Slice recortada por negócio

Correto: dentro de cada layer, o primeiro nível é **domínio de negócio**. O nome vem do
produto — alguém que não programa reconhece as pastas.

```
src/
├── app/                        layer e slice ao mesmo tempo: só segments
│   ├── routes/
│   ├── providers/
│   └── styles/
│
├── pages/
│   ├── article-reader/         ← slice: uma tela do produto
│   │   ├── ui/
│   │   ├── api/
│   │   └── index.js
│   └── profile/
│       ├── ui/
│       └── index.js
│
├── features/
│   ├── comment-form/           ← slice: uma interação que entrega valor
│   │   ├── ui/
│   │   ├── model/
│   │   ├── api/
│   │   └── index.js
│   └── article-share/
│       ├── ui/
│       └── index.js
│
├── entities/
│   ├── article/                ← slice: um conceito do mundo real
│   │   ├── ui/
│   │   ├── model/
│   │   ├── @x/                 public API dedicado a cross-import
│   │   │   └── comment.js
│   │   └── index.js
│   └── comment/
│       ├── model/
│       └── index.js
│
└── shared/                     layer e slice: só segments, sem domínio
    ├── ui/
    ├── api/
    ├── lib/
    └── config/
```

## Por que funciona

**Apagar uma feature é uma operação só.** Remover `features/comment-form/` remove o
recurso inteiro — é o teste da deleção simples, e é a medida prática de modularidade.

**O segment só aparece quando a complexidade pede.** `pages/profile/` tem só `ui/` porque
não precisa de mais. Criar `api/`, `model/`, `lib/` e `config/` vazios em toda slice é a
forma mais comum de errar com FSD (rule 064).

**O número de slices cresce com o produto, e cada uma continua pequena.** É o oposto do
recorte por tipo técnico, onde o número de pastas fica fixo e cada uma incha sem limite.
