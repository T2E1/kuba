---
name: fsd
model: opus
description: Feature-Sliced Design — a arquitetura de frontend em três níveis (layer, slice, segment), com as 7 layers padronizadas, a regra de import estritamente descendente, o public API por index e a notação @x para cross-import entre entities. Use ao estruturar uma aplicação frontend, ao decidir em que layer um módulo mora, ao diagnosticar import que sobe de camada, ou ao avaliar se uma metodologia de decomposição serve ao projeto. Não use para organizar os pacotes de uma biblioteca — FSD é explicitamente para aplicações, e em biblioteca ele colapsa tudo em shared; use as skills package e colocation.
---

# Feature-Sliced Design

## O que é

Metodologia de arquitetura para **aplicações** frontend que organiza o código em três
níveis encaixados: **layer** (responsabilidade), **slice** (domínio de negócio) e
**segment** (propósito técnico).

O que a torna diferente de "pastas por camada" é uma regra só, e ela é direcional: *um
módulo só pode importar de layers estritamente abaixo da sua.* O grafo vira um DAG por
construção, não por disciplina.

**Ela não serve a este repositório como estrutura.** Serve como fonte de três ideias — os
três níveis, a direção do import e o public API por index — e é isso que esta skill
destila. Ler `## Quando usar` antes de aplicar.

## Quando usar

| Situação | Ação |
|---|---|
| Estruturando uma aplicação frontend do zero | Adotar as 7 layers como estão |
| Um import sobe de layer e ninguém sabe por quê | Aplicar a regra descendente |
| Decidir se algo é feature ou entity | Árvore de decomposição em `## Como aplicar` |
| Duas entities precisam se referenciar | Notação `@x`, e só na layer entities |
| Um módulo expõe o próprio interior | Public API por index |
| Avaliando qualquer metodologia de decomposição | Os três níveis como grade de leitura |

**Não use quando:**

- **O projeto é biblioteca, não aplicação.** É o caso do `kuba`. FSD recorta por
  significado de negócio, e uma biblioteca de componentes não tem negócio para recortar —
  traduzida ao pé da letra, ela colapsa `packages/` inteiro em `shared`, que por definição
  não tem slices. Use `package` e `colocation`.
- **Você quer inventar uma layer nova.** A doc é explícita: a semântica das 7 é
  padronizada, e precisar de uma oitava quase sempre significa decomposição malfeita.
- **O projeto é pequeno.** Segmentar por segmentar é overengineering (rule 064). Comece
  com o mínimo e acrescente segment quando a complexidade pedir.

## Como aplicar

### Os três níveis

```
layer/          responsabilidade — conjunto fixo de 7, padronizado
└── slice/      domínio de negócio — nome livre, vem do produto
    └── segment/   propósito técnico — ui, api, model, lib, config
```

`app` e `shared` são exceção: são layer **e** slice ao mesmo tempo, então contêm segments
diretamente e seus arquivos se importam livremente.

### As 7 layers, de cima para baixo

| Layer | O que é | Exemplo |
|---|---|---|
| `app` | O que faz a aplicação rodar — router, providers, estilo global, entrypoint | Definição de rotas, analytics |
| `processes` | **Depreciado.** Conteúdo migra para features ou app | — |
| `pages` | Telas inteiras, correspondendo a rotas | Página de login, de cadastro |
| `widgets` | Blocos de UI grandes e autossuficientes, reusados entre páginas | Layout, bloco de router aninhado |
| `features` | Interações que entregam valor ao usuário, quando reusadas | Sistema de comentário, pagamento |
| `entities` | Conceitos de negócio do mundo real | User, Post, Group |
| `shared` | Base sem vínculo com o negócio — UI kit, cliente de API, libs internas | Manipulação de data, logo |

Regra de ouro contra o inchaço: **bloco de UI usado em um lugar só pertence a `pages`, não
a `widgets`.** E nem toda interação precisa virar `feature` — o critério é reuso e
descoberta, não cerimônia.

### A regra de import

> Um módulo em uma slice só pode importar de slices situadas em layers **estritamente
> abaixo** da sua.

Duas consequências que as pessoas erram:

1. **Slices da mesma layer não se importam.** `features/aaa` não enxerga `features/bbb`.
2. **A exceção é `app` e `shared`**, que não têm slices — seus segments se importam à
   vontade.

### Public API por index

Cada slice expõe um `index` que re-exporta só o que é contrato. Três propriedades que um
bom public API entrega: proteção contra refatoração, consistência de comportamento e
exposição mínima.

O anti-padrão nomeado pela própria doc é o re-export com curinga — ele destrói a
descoberta e vaza interior por acidente. É a mesma proibição da skill `revelation`.

### A notação `@x` para cross-import

Quando duas entities precisam legitimamente se referenciar, `entities/a/@x/b` cria um
public API dedicado àquela relação — lido como "A cruzado com B". Restrições: **só na layer
entities**, e mantido no mínimo. É válvula de escape, não recurso de uso corrente.

### Onde os tipos moram

Não crie uma pasta genérica de tipos: agrupar coisas pela propriedade de "serem um tipo" é
o oposto de coesão. Tipo utilitário vai em `shared/lib`; tipo de entidade vai no segment
`model` da slice; DTO fica junto da função que faz a requisição; enum fica o mais perto
possível de onde é usado.

### Lendo uma proposta de estrutura com esta grade

O valor da skill fora de uma aplicação FSD é servir de grade de diagnóstico. Três perguntas
que ela faz melhor que qualquer outra fonte:

1. Existem três níveis, ou só dois — e o do meio é o que está faltando?
2. As dependências correm todas na mesma direção?
3. O que é público está declarado, ou é o que sobrou de acessível?

## Exemplos

| Caso | Correto | Incorreto |
|---|---|---|
| Import descendente entre layers, e o que viola a regra | [layer-import.valid.js](examples/layer-import.valid.js) | [layer-import.invalid.js](examples/layer-import.invalid.js) |
| Slice recortada por negócio versus por tipo técnico | [slice-decomposition.valid.md](examples/slice-decomposition.valid.md) | [slice-decomposition.invalid.md](examples/slice-decomposition.invalid.md) |
| Public API por index versus curinga e import profundo | [public-api.valid.js](examples/public-api.valid.js) | [public-api.invalid.js](examples/public-api.invalid.js) |

## Checklist

- [ ] O projeto é aplicação, não biblioteca — caso contrário, `package` e `colocation`
- [ ] Nenhuma layer fora das 7 padronizadas
- [ ] Nenhum import de layer igual ou superior
- [ ] Nenhuma slice importando outra slice da mesma layer sem `@x`
- [ ] `@x` aparece só na layer entities, e em poucos lugares
- [ ] Todo slice tem index, e nenhum re-export com curinga
- [ ] Nenhuma pasta que agrupa arquivos só por eles serem tipos
- [ ] Nenhum segment criado sem complexidade que o justifique (rule 064)

## Troubleshooting

### Preciso de uma layer que não existe nas 7

**Causa:** quase sempre a decomposição está errada um nível abaixo — o que parece layer
nova é slice mal recortada, ou segment que virou pasta grande demais.
**Solução:** reler a árvore de layers antes de inventar. A doc desaconselha explicitamente
layer nova, porque a semântica padronizada é o que dá a uniformidade que justifica FSD.

### Duas features precisam uma da outra

**Causa:** a regra descendente proíbe, e com razão: são duas slices na mesma layer.
**Solução:** o que as duas compartilham desce — vira entity ou vai para `shared`. `@x` não
resolve aqui, porque vale só entre entities.

### Apliquei FSD numa biblioteca e tudo virou `shared`

**Causa:** não é erro de aplicação, é o resultado correto. `shared` é a layer sem
significado de produto, e biblioteca não tem produto para recortar.
**Solução:** a metodologia não responde essa pergunta. Recortar por grafo de dependência e
por razão-para-mudar — `package` e `colocation`.

## Referências

- `references/layers.md` — as 7 layers em detalhe, com o que cabe e o que não cabe em cada
  uma, e o caso de `app` e `shared` serem layer e slice ao mesmo tempo.

## Rules relacionadas

- [018 — Princípio de Dependências Acíclicas](../../rules/018_principio-dependencias-aciclicas.md): a regra de import descendente produz o DAG por construção, em vez de por disciplina.
- [019 — Princípio de Dependências Estáveis](../../rules/019_principio-dependencias-estaveis.md): as layers de baixo são as estáveis, e a direção do import é a da estabilidade.
- [016 — Princípio do Fechamento Comum](../../rules/016_principio-fechamento-comum.md): a slice é CCP aplicado ao domínio — o que muda pela mesma razão de negócio fica junto.
- [064 — Proibição de Overengineering](../../rules/064_proibicao-overengineering.md): segment criado sem complexidade que o peça é o modo mais comum de errar com FSD.
- [031 — Proibição de Imports Relativos](../../rules/031_restricao-imports-relativos.md): o import entre slices é por alias, e o relativo fica restrito ao interior da slice.

## Skills relacionadas

- [package](../package/SKILL.md): complements — FSD recorta por negócio; `package` recorta por coesão e acoplamento, e é o que serve a biblioteca.
- [colocation](../colocation/SKILL.md): reinforces — a slice é a mesma ideia de vertical slice que `colocation` aplica a `src/`.
- [revelation](../revelation/SKILL.md): reinforces — o public API por index e a proibição do curinga são a mesma regra, dita duas vezes.
- [framework-design-guidelines](../framework-design-guidelines/SKILL.md): complements — FSD dá a forma dos níveis; `framework-design-guidelines` dá o critério de nome de cada um.
- [solid](../solid/SKILL.md): depends on — a decomposição em slices pressupõe SRP resolvido dentro de cada módulo.

---

**Criado em**: 2026-08-25
**Atualizado em**: 2026-08-25
**Versão**: 1.0
