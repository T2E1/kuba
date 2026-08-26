# Segments errados no interior de um pacote

Correto em `segment-structure.valid.md`. Aqui estão os três modos de errar, e são
independentes: um pacote pode cometer os três ao mesmo tempo.

## Erro 1 — pasta para unidade de um arquivo só

```
packages/dom/
├── index.js
├── repaint/              ← ERRO: um arquivo dentro, mais um index de uma linha
│   ├── index.js
│   └── repaint.js
├── retouch/              ← ERRO: idem
│   ├── index.js
│   └── retouch.js
└── html/                 ← ERRO: idem
    ├── index.js
    └── html.js
```

Dobrou o número de arquivos e não acrescentou informação nenhuma. É cerimônia (rule 064).
A regra é "pasta quando a unidade tem mais de um arquivo" — não "pasta sempre".

**Correção:** `repaint.js`, `retouch.js` e `html.js` soltos na raiz do pacote.

## Erro 2 — segment nomeado pela forma técnica

```
packages/directive/
├── index.js
├── callbacks/            ← ERRO: descreve a forma, não o papel
│   ├── adopted.js
│   ├── connected.js
│   ├── disconnected.js
│   ├── formAssociated.js
│   └── formReset.js
├── helpers/              ← ERRO: aceita qualquer coisa
│   ├── execute.js
│   └── define.js
└── utils/                ← ERRO: o depósito que nunca se esvazia
    └── misc.js
```

`callbacks/` junta ciclo de vida com formulário — dois papéis diferentes — porque o único
critério aplicado foi "são todos callbacks". Não restringe nada, então não organiza nada.

`helpers/` e `utils/` são piores: não há critério nenhum para decidir se um arquivo novo
entra ali ou não, e por isso todo arquivo indeciso acaba entrando. `misc.js` é o fim
previsível dessa linha.

**Correção:** `lifecycle/` e `form/`, que nomeiam o papel; `execute.js` e `define.js`
soltos na raiz.

## Erro 3 — segments antes de haver o que segmentar

```
packages/interpolate/
├── index.js
├── core/                 ← ERRO: três pastas para duas funções
│   └── interpolate.js
├── helpers/
│   └── resolve.js
└── types/                ← ERRO duplo: agrupa por "ser um tipo"
    └── types.d.ts
```

O pacote tem duas funções. Segmentar aqui é estrutura sem conteúdo — e `types/` comete o
erro adicional de agrupar arquivos pela única propriedade de serem tipos.

**Correção, e ela também fecha uma lacuna real:**

```
packages/interpolate/
├── index.js
├── types.d.ts            ← hoje AUSENTE no repositório: é a única lacuna
└── interpolate.js          de contrato em packages/
```

## O teste que separa os três

> O segment resolve um problema que alguém tem hoje, ou antecipa um que talvez apareça?

Segment que ninguém pediu é overengineering (rule 064). Segment ausente num pacote de
doze unidades é o oposto, e cobra o preço na hora de encontrar as coisas. O gatilho
prático é sete unidades soltas.
