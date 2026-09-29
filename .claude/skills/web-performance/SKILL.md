---
name: web-performance
model: opus
effort: high
description: Os 16 padrões de entrega e carregamento de patterns.dev — divisão de bundle, import dinâmico, import por visibilidade e por interação, tree shaking, preload, prefetch, PRPL, virtualização de lista, terceiros, compressão, sequência de carregamento, view transitions e islands. Cada um com quando aplicar, quando não aplicar e o custo que cobra. Use ao dividir o bundle, adiar o carregamento de um módulo, decidir o que entra na primeira tela, ou investigar lentidão já medida. Não use para composição de custom element nem para onde o HTML nasce — use a skill render; não use para padrões de objeto — use a skill gof.
---

# Web Performance Patterns

## O que é

O catálogo de patterns.dev restrito a uma pergunta: **quando o código chega ao usuário, e
a que custo**. Sedecide o que entra na primeira resposta, o que espera, e o que nunca é
baixado por quem não precisa.

Não trata de como o componente se compõe nem de onde o HTML nasce — isso é a skill
[react](../react/SKILL.md) —, nem da forma de uma abstração dentro do módulo, que é
[gof](../gof/SKILL.md).

## Quando usar

| Problema | Pattern |
|---|---|
| A primeira tela demora e o bundle é grande | Bundle Splitting, Route Based Splitting |
| Um trecho da tela só é usado por parte dos usuários | Dynamic Import, Import On Interaction |
| Um componente pesado está abaixo da dobra | Import On Visibility |
| Uma lista longa trava a rolagem | List Virtualization |
| O recurso crítico é descoberto tarde demais | Preload |
| A próxima navegação é previsível | Prefetch |
| Script de terceiro atrasa a interação | Optimize Third-Parties |
| O bundle carrega código que ninguém importa | Tree Shaking |
| A página é quase toda estática, com ilhas interativas | Islands Architecture |
| A transição entre rotas pisca | View Transitions |

**Nunca escolha o pattern antes do problema.** Dividir o bundle sem ter medido o que pesa
é overengineering (rule 013) e otimização prematura (rule 012) ao mesmo tempo: cobra
complexidade permanente por um ganho que ninguém mediu.

## Como aplicar

1. **Nomear o problema concreto e medido.** Não "quero performance", mas "a primeira
   interação leva 4s e o bundle inicial tem 800KB". Aqui a medição é pré-requisito, não
   etapa opcional.
2. **Localizar o pattern na tabela acima.**
3. **Abrir a referência e ler a seção "Quando NÃO Usar" antes da de estrutura.** É onde
   se decide se o pattern serve, e é a que se pula.
4. **Conferir o custo.** Todo pattern deste catálogo cobra alguma coisa — um estado de
   carregamento a tratar, uma ida à rede a mais, uma fronteira a manter.
5. **Implementar a forma mínima.**
6. **Medir de novo.** Otimização sem medida posterior não é otimização, é suposição.

### O catálogo

| Pattern | Referência |
|---|---|
| Static Import | [static-import.md](references/static-import.md) |
| Dynamic Import | [dynamic-import.md](references/dynamic-import.md) |
| Import On Visibility | [import-on-visibility.md](references/import-on-visibility.md) |
| Import On Interaction | [import-on-interaction.md](references/import-on-interaction.md) |
| Bundle Splitting | [bundle-splitting.md](references/bundle-splitting.md) |
| Route Based Splitting | [route-based-splitting.md](references/route-based-splitting.md) |
| Tree Shaking | [tree-shaking.md](references/tree-shaking.md) |
| Preload | [preload.md](references/preload.md) |
| Prefetch | [prefetch.md](references/prefetch.md) |
| PRPL | [prpl.md](references/prpl.md) |
| List Virtualization | [list-virtualization.md](references/list-virtualization.md) |
| Optimize Third-Parties | [third-parties.md](references/third-parties.md) |
| Compression | [compression.md](references/compression.md) |
| Loading Sequence | [loading-sequence.md](references/loading-sequence.md) |
| View Transitions | [view-transitions.md](references/view-transitions.md) |
| Islands Architecture | [islands-architecture.md](references/islands-architecture.md) |

## Exemplos

| Caso | Correto | Incorreto |
|---|---|---|
| Escolher o pattern a partir do problema medido | [pattern-choice.valid.md](examples/pattern-choice.valid.md) | [pattern-choice.invalid.md](examples/pattern-choice.invalid.md) |
| Dividir o código na fronteira certa | [code-splitting.valid.js](examples/code-splitting.valid.js) | [code-splitting.invalid.js](examples/code-splitting.invalid.js) |

## Checklist

- [ ] O problema foi nomeado e medido **antes** do pattern ser escolhido
- [ ] A seção "Quando NÃO Usar" da referência foi lida
- [ ] O custo declarado na referência foi aceito explicitamente
- [ ] A implementação é a forma mínima, não a canônica completa
- [ ] Todo carregamento adiado tem estado de espera e de erro tratados
- [ ] O estado de espera ocupa as mesmas dimensões do conteúdo final
- [ ] Existe medição **depois** que confirma o ganho

## Troubleshooting

### Dividi o bundle e a aplicação ficou mais lenta

**Causa:** a divisão criou uma cascata — o pedaço adiado é pedido só depois que o
principal executa, somando duas idas à rede em série onde havia uma.
**Solução:** dividir na fronteira de navegação (Route Based Splitting), não em qualquer
componente. O que é preciso na primeira tela entra no bundle inicial e se declara com
Preload.

### Adiei o carregamento e a tela pisca

**Causa:** o estado de espera não foi tratado, ou reserva espaço diferente do conteúdo
final.
**Solução:** todo carregamento adiado tem estado de espera que ocupa as mesmas dimensões
do conteúdo. Sem isso, o ganho de bytes vira perda de estabilidade visual.

### Apliquei um pattern e não sei dizer se melhorou

**Causa:** não houve medição antes.
**Solução:** reverter, medir, reaplicar. Sem a medição anterior não há como afirmar ganho,
e o custo do pattern fica pago sem contrapartida conhecida.

## Referências

- `references/*.md` — um arquivo por pattern, com intenção, quando aplicar, quando **não**
  aplicar, estrutura mínima e o custo que cobra.

Fonte: [patterns.dev](https://www.patterns.dev), seção de Performance.

## Rules relacionadas

- [012 — Otimização Prematura (Premature Optimization)](../../rules/012_otimizacao-prematura.md): os dezesseis padrões exigem medição antes, sem exceção.
- [013 — Overengineering](../../rules/013_overengineering.md): limita quando o pattern se justifica.

## Skills relacionadas

- [react](../react/SKILL.md): complements — onde o HTML nasce e como o componente se compõe; a hidratação é o outro lado do custo de entrega.
- [big-o](../big-o/SKILL.md): complements — List Virtualization e Tree Shaking atacam custo que ela sabe medir.
- [package-by-feature](../package-by-feature/SKILL.md): depends on — Route Based Splitting só funciona quando o recorte de pastas acompanha o recorte de navegação.
- [complexity](../complexity/SKILL.md): reinforces — cada nível de indireção que um pattern acrescenta é complexidade a justificar.
- [gof](../gof/SKILL.md): complements — a forma de uma abstração dentro do módulo, um nível abaixo deste catálogo.

---

**Criado em**: 2026-04-01
**Atualizado em**: 2026-09-15
**Versão**: 3.0
