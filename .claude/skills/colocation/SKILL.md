---
name: colocation
model: sonnet
description: Colocação de arquivos em `src/` e `packages/` — o que muda junto fica junto, um pacote por custom element com implementação, template, estilo, contratos, tipos e teste lado a lado, mais a convenção de segments no interior de um pacote de infraestrutura. Use ao criar um pacote novo, ao decidir onde um arquivo deve morar, ao adicionar teste a um componente, ou ao organizar o interior de um pacote que passou de sete arquivos. Não use para escolher o eixo de decomposição do sistema — é a skill package-by-feature; nem para decidir o que o pacote exporta — é a skill revelation.
---

# Colocation

## O que é

Organização por **razão-para-mudar**, não por tipo técnico. Tudo que muda junto quando um
componente muda vive na mesma pasta: implementação, template, estilo, contratos, tipos,
e teste.

É CCP (rule 016) levado à estrutura de diretórios. O oposto — `styles/`, `tests/`,
`types/` no topo — obriga cada mudança a percorrer o repositório inteiro.

## Quando usar

| Situação | Ação |
|---|---|
| Criando componente novo | Um pacote em `src/<categoria>/<nome>/` |
| Decidindo onde um arquivo mora | Junto do que muda com ele |
| Adicionando teste | Ao lado da implementação |
| Encontrando pasta por tipo técnico | Redistribuir por feature |
| Um pacote de `packages/` passou de sete arquivos soltos | Agrupar em segments |
| Uma unidade do pacote virou mais de um arquivo | Promover a pasta homônima |

Não use para decidir **o que sai** do pacote — isso é `revelation`. Colocação define
onde os arquivos ficam; revelation define quais são públicos.

Não use para escolher **o eixo** de decomposição — isso é `package-by-feature`, e vem antes:
ela decide se o primeiro nível corta por feature ou por camada. Esta skill assume o eixo
já resolvido e organiza o que fica dentro.

## Como aplicar

### Estrutura de um pacote de custom element

```
src/<categoria>/<nome>/
├── <nome>.ts           implementação (.ts só pela sintaxe de decorator)
├── component.js        função pura de template — só a função `component`, nada mais
├── style.js            função pura de estilo — só a função `style`, nada mais
├── <filtro>.js         um filtro de `attributeChanged` específico deste componente
├── constants.js        listas/valores que os filtros e o template consultam
├── interfaces.js       Symbols de contrato
├── index.js            superfície pública
├── types.d.ts          contrato tipado do consumidor
└── <nome>.test.js      teste
```

Componentes de formulário costumam ter `element.js` a mais, para o elemento interno
associado.

`component.js` e `style.js` contêm exatamente a função que o nome promete — nenhuma
segunda função, helper ou validação junto. Transformar ou validar um valor antes de ele
chegar ao template (escapar HTML, normalizar cor, cair num default) é responsabilidade de
um filtro de `attributeChanged`, não do template. Um `component.js` com uma função a mais
é sinal de que a validação foi escrita no lugar errado — foi exatamente o que aconteceu
com um `escapeAttribute` que chegou a viver dentro de `component.js` do `kb-button` antes
de virar filtro.

**Onde o filtro mora** depende de quantos componentes o usam, mesmo critério da rule 017
(CRP): um filtro que só este componente usa (`variant` do botão, vocabulário que nenhum
outro elemento compartilha) fica local, um arquivo por filtro — `<verbo-ndo>.js`, mesmo
padrão de `packages/directive/attributeChanged/resizing.js`. Um filtro que outros
componentes já usam ou usariam (validar `color`, contra o mesmo conjunto de tokens que
`kb-icon` e `kb-text` também resolvem) vai para `packages/directive/attributeChanged/`
— foi o que aconteceu com `coloring` e `escaping`, que nasceram dentro de `kb-button` e
subiram assim que ficou claro que o segundo consumidor já existia no repositório.

### Estrutura de um pacote de `packages/`

Um pacote de infraestrutura não tem template nem estilo, e cresce por outro eixo: pelo
número de unidades que exporta. A convenção é a mesma em todos:

```
packages/<nome>/
├── index.js            superfície pública — só re-exports
├── types.d.ts          contrato tipado — obrigatório, sem exceção
├── interfaces.js       Symbols de contrato, quando houver
├── <nome>.js           a unidade central, homônima do pacote
├── <unidade>.js        uma unidade exportada que cabe num arquivo
└── <unidade>/          uma unidade que virou mais de um arquivo
    ├── index.js
    ├── <unidade>.js
    ├── interfaces.js
    └── <auxiliar>.js
```

**A regra que decide se algo vira pasta**, e é a única:

> Uma pasta existe quando a unidade tem mais de um arquivo. Nunca antes.

`packages/directive/attributeChanged/` é pasta porque tem sete filtros além do próprio
`attributeChanged.js`. `packages/dom/repaint.js` é arquivo solto porque é um arquivo só.
Promover `repaint` a pasta com um `index.js` dentro seria cerimônia (rule 064).

**Quando o pacote passa de sete unidades soltas**, o nível seguinte é agrupar por papel
técnico — e aqui o eixo de camada é o certo, porque o recorte por assunto já aconteceu no
nível do pacote. O nome do segment descreve o papel, nunca o tipo de arquivo:

| Segment bom | Segment ruim | Por quê |
|---|---|---|
| `lifecycle/`, `form/` | `callbacks/` | O papel, não a forma técnica |
| `payload/`, `control/` | `helpers/` | `helpers` aceita qualquer coisa |
| `matching/`, `history/` | `utils/`, `misc/` | O depósito nunca se esvazia |
| `math/`, `compare/` | `functions/` | Todos são funções; não restringe |

`packages/pixel/` já é o modelo: `index.css` mais os segments `reset/` e `tokens/`.

**`types.d.ts` é obrigatório em todo pacote de `packages/`.** Hoje `packages/interpolate/`
tem só `index.js` e `interpolate.js` — é a única lacuna de contrato do diretório, e o
pacote seria o primeiro a quebrar um consumidor sem que o tipo avisasse.

### Categorias

`src/` e `packages/` agrupam por categoria de responsabilidade, não por camada técnica:
`src/` reúne os seis tipos de custom element que o consumidor final importa; `packages/`
reúne a infraestrutura que os sustenta.

| Categoria | Papel | Raiz |
|---|---|---|
| `component`, `form`, `layout`, `typography` | Custom elements visíveis, por família | `src/` |
| `behavior`, `data` | Custom elements headless | `src/` |
| `mixin`, `echo`, `directive`, `middleware` | Composição e infraestrutura de componente | `packages/` |
| `dom`, `event`, `http`, `router` | Capacidades transversais | `packages/` |
| `pixel` | Design tokens | `packages/` |

### As duas regras que decidem tudo

1. **Muda junto, fica junto.** Se alterar o componente obriga a alterar o arquivo,
   ele é do pacote.
2. **Nunca centralize por tipo.** Não existe `styles/`, `tests/` ou `types/` no topo.
   A única exceção é a demo composta que atravessa pacotes, que vai para
   `website/docs/build-ui/` — ela não pertence a nenhum componente.

## Exemplos

| Caso | Correto | Incorreto |
|---|---|---|
| Pacote colocado vs. organização por tipo técnico | [package-structure.valid.md](examples/package-structure.valid.md) | [package-structure.invalid.md](examples/package-structure.invalid.md) |
| Segments no interior de um pacote de `packages/` | [segment-structure.valid.md](examples/segment-structure.valid.md) | [segment-structure.invalid.md](examples/segment-structure.invalid.md) |

## Checklist

- [ ] Um pacote por custom element
- [ ] `types.d.ts` e teste ao lado da implementação
- [ ] Nenhuma pasta agrupando por tipo técnico
- [ ] `component.js` e `style.js` com uma única função exportada — validação e escaping vão para um filtro de `attributeChanged`
- [ ] Filtro usado por mais de um componente vive em `packages/directive/attributeChanged/`, não duplicado em cada pacote
- [ ] `index.js` presente em todo pacote
- [ ] `types.d.ts` presente em todo pacote de `packages/`, sem exceção
- [ ] Nenhuma pasta criada para uma unidade de um arquivo só (rule 064)
- [ ] Nenhum segment chamado `utils`, `helpers`, `misc`, `functions` ou `callbacks`
- [ ] Segments só onde o pacote passou de sete unidades soltas
- [ ] Nenhum import alcançando arquivo interno de outro pacote
- [ ] Nenhum `../` em import — só path alias (rule 031)

## Troubleshooting

### Um valor precisa ser validado ou escapado antes de entrar no template

**Causa:** a tentação é resolver ali mesmo, com uma segunda função em `component.js` —
foi o que produziu um `escapeAttribute` dentro do `component.js` de `kb-button`.
**Solução:** o tratamento é um filtro de `attributeChanged` (`filters.js`), aplicado no
setter da property. Quando o template lê o valor, ele já chega pronto — `component.js`
volta a ser só a função `component`.

### Dois componentes precisam do mesmo helper

**Causa:** comportamento compartilhado morando dentro de um dos pacotes.
**Solução:** com dois consumidores, ele sobe para um pacote próprio — provavelmente um
mixin. Antes de dois, duplicar é mais barato que abstrair cedo (rule 023).

### O pacote cresceu e tem quinze arquivos

**Causa:** o componente acumulou responsabilidades.
**Solução:** o tamanho do pacote é sintoma, não causa. Dividir o componente (rules 007 e
010) reorganiza a pasta como consequência.

### Um consumidor importa `@component/button/style.js`

**Causa:** o arquivo interno ficou alcançável.
**Solução:** o alias aponta para a raiz do pacote, e o que é público sai pelo `index.js`
(skill `revelation`). Importar interno é depender de detalhe de implementação.

### O pacote virou uma pasta por arquivo

**Causa:** a regra "pasta quando tem mais de um arquivo" foi lida ao contrário, e cada
unidade ganhou pasta com `index.js` dentro.
**Solução:** desfazer. Arquivo solto é o padrão; pasta é a exceção que a segunda peça
justifica. `packages/spark/` tem dezesseis funções em dezesseis arquivos soltos, e está
certo — nenhuma delas tem uma segunda peça.

## Referências

- `references/vertical-slice.md` — o princípio geral de fatia vertical, com o guia de
  decisão de onde posicionar código novo.

## Rules relacionadas

- [016 — Princípio do Fechamento Comum](../../rules/016_principio-fechamento-comum.md): a regra que esta skill materializa em diretórios.
- [017 — Princípio do Reuso Comum](../../rules/017_principio-reuso-comum.md): o contrapeso — o pacote não deve carregar o que o consumidor não usa.
- [058 — Proibição de Shotgun Surgery](../../rules/058_proibicao-shotgun-surgery.md): a organização por tipo técnico é o que a produz.
- [031 — Proibição de Imports Relativos](../../rules/031_restricao-imports-relativos.md): entre pacotes, sempre path alias.
- [015 — Equivalência de Lançamento e Reuso](../../rules/015_principio-equivalencia-lancamento-reuso.md): o pacote é a unidade de release.
- [010 — Responsabilidade Única](../../rules/010_principio-responsabilidade-unica.md): um pacote, um componente.

## Skills relacionadas

- [package](../package/SKILL.md): depends on — os princípios que esta estrutura aplica.
- [package-by-feature](../package-by-feature/SKILL.md): depends on — ela escolhe o eixo; esta organiza o que fica dentro do recorte já feito.
- [revelation](../revelation/SKILL.md): complements — define o que sai pelo `index.js`.
- [framework-design-guidelines](../framework-design-guidelines/SKILL.md): complements — esta decide onde a pasta fica; `framework-design-guidelines` decide como ela se chama.
- [preview](../preview/SKILL.md): reinforces — a story fica colocada, nunca centralizada.
- [types](../types/SKILL.md): reinforces — um `types.d.ts` por pacote.
- [c4-model](../c4-model/SKILL.md): complements — os níveis Container e Component espelham categoria e pacote.

---

**Criado em**: 2026-04-01
**Atualizado em**: 2026-08-25
**Versão**: 2.4
