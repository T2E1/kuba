# Segments no interior de um pacote de `packages/`

Correto: o pacote agrupa por **papel técnico** quando passa de sete unidades soltas — e
aqui o eixo de camada é o certo, porque o recorte por assunto já aconteceu um nível acima.

```
packages/directive/
├── index.js              superfície pública — só re-exports
├── types.d.ts            obrigatório
├── define.js             unidade de um arquivo: fica solta
├── execute.js            idem — motor compartilhado dos callbacks
├── lifecycle/            segment: papel técnico
│   ├── index.js
│   ├── adopted.js
│   ├── connected.js
│   └── disconnected.js
├── form/
│   ├── index.js
│   ├── formAssociated.js
│   ├── formDisabled.js
│   ├── formReset.js
│   └── formStateRestore.js
└── attributeChanged/     unidade que virou muitos arquivos: virou pasta
    ├── index.js
    ├── attributeChanged.js
    ├── execute.js
    └── cast/
        ├── index.js
        ├── booleanAttribute.js
        ├── enumerated.js
        ├── escaping.js
        └── numeric.js
```

## As decisões, uma a uma

**`define.js` e `execute.js` continuam soltos.** Cada um é um arquivo só. Promovê-los a
pasta com `index.js` dentro seria cerimônia (rule 064).

**`lifecycle/` e `form/` existem porque o pacote passou de sete unidades.** Sem eles,
`directive/` teria doze arquivos no mesmo nível e nenhuma pista de qual pertence a quê.

**`attributeChanged/` virou pasta pela outra razão:** a unidade tem mais de um arquivo. Não
foi agrupamento, foi crescimento da própria unidade — e por isso ela tem `index.js`
próprio, enquanto os segments também têm o deles.

**`cast/` é o terceiro nível, e se justifica pelo mesmo teste:** sete filtros de conversão
que compartilham papel. O nome descreve o que fazem, não o que são.

## Por que os nomes passam

| Nome | Por quê |
|---|---|
| `lifecycle` | O papel: quando o elemento entra e sai do documento |
| `form` | O papel: participação em formulário |
| `cast` | O papel: converter o valor do atributo |

Nenhum deles é `callbacks`, `helpers` ou `utils` — que descreveriam a forma técnica, não o
papel, e aceitariam qualquer coisa depois.

## O caso em que segment nenhum se justifica

```
packages/spark/
├── index.js
├── types.d.ts
├── spark.js
├── registry.js
├── add.js
├── gt.js
├── not.js
└── prop.js               … e mais doze, todas soltas
```

Dezesseis funções puras, um arquivo cada, nenhuma com segunda peça. Está certo do jeito
que está: agrupar em `math/`, `compare/` e `logic/` só se paga quando alguém não consegue
mais encontrar o que procura.
