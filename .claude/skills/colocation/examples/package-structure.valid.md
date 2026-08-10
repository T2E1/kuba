# ✅ Colocação por razão-para-mudar

```
packages/
├── component/
│   ├── button/
│   │   ├── button.ts          implementação
│   │   ├── component.js       template (função pura)
│   │   ├── style.js           estilo (função pura, consome tokens)
│   │   ├── interfaces.js      Symbols de contrato
│   │   ├── index.js           superfície pública
│   │   ├── types.d.ts         contrato do consumidor
│   │   ├── button.stories.js  story
│   │   ├── button.test.js     teste
│   │   └── __screenshots__/
│   └── icon/
│       └── …
├── form/
│   └── textarea/
│       ├── textarea.ts
│       ├── element.js         elemento interno associado
│       └── …
├── mixin/                     composição reutilizável
├── echo/                      sistema de eventos
└── pixel/                     design tokens
```

## O que isso compra

| Ganho | Detalhe |
|---|---|
| Mudança local | Adicionar um atributo toca um diretório só |
| Diff legível | O PR mostra um pacote, e a intenção é evidente |
| Nada esquecido | Tipo, story e teste estão à vista de quem edita |
| Pacote extraível | O diretório é a unidade de release (rule 015) |
| Navegação barata | Abrir a pasta é entender o componente inteiro |

## A única exceção

Demo composta que atravessa mais de um pacote não pertence a nenhum deles:

```
stories/examples/button-with-redirect.stories.js
```

Vai para a raiz, porque colocá-la dentro de `button/` ou `router/` seria
arbitrário — ela é de ambos e de nenhum.

## O contrapeso

CCP puxa para juntar; CRP (rule 017) puxa para separar. Se o pacote crescer a
ponto de um consumidor precisar importá-lo inteiro para usar duas coisas, é
hora de dividir. O equilíbrio é o triângulo REP/CCP/CRP da skill `package`.
