---
name: package-by-feature
model: opus
description: A escolha do eixo de decomposição de um sistema — por feature ou por camada técnica — com o argumento de escala de "Package by feature, not layer", o teste da deleção simples, o ganho de visibilidade restrita, e os casos em que decompor por camada ainda se justifica. Use antes de criar a primeira pasta de um módulo, ao julgar uma estrutura que agrupa por controllers, services, hooks, types ou utils, ao decidir se um diretório deve ser dividido, ou ao comparar duas propostas de organização. Não use para a estrutura interna de um pacote de componente — é a skill colocation; nem para medir coesão e acoplamento depois de decidido — é a skill package.
---

# Decomposição

## O que é

A decisão que antecede toda estrutura de pastas: **por qual eixo o sistema é cortado.**

Há dois, e são excludentes no primeiro nível:

- **Por feature** — o primeiro nível nomeia o que o sistema *faz*: `comment-form`,
  `article-reader`, `payment`.
- **Por camada** — o primeiro nível nomeia o que os arquivos *são*: `controllers`,
  `services`, `hooks`, `types`, `utils`.

A recomendação é conhecida e antiga. O que esta skill acrescenta é **por que**, com o
argumento de escala e os testes que decidem — e os casos em que o eixo de camada ainda
serve.

## Quando usar

| Situação | Ação |
|---|---|
| Criando a primeira pasta de um módulo | Decidir o eixo antes de criar qualquer arquivo |
| Vendo `controllers/`, `services/`, `hooks/`, `types/` no topo | Diagnóstico de eixo por camada |
| Uma pasta cresceu além do que se navega | Aplicar o argumento de escala, abaixo |
| Comparando duas propostas de organização | Teste da deleção simples |
| Um requisito pequeno toca oito arquivos | Sintoma clássico — eixo errado |
| Decidindo se um diretório deve ser dividido | Perguntar por qual eixo ele foi criado |

**Não use para:** a estrutura interna de um pacote de componente já recortado — é
`colocation`, que dá o layout concreto de `src/`. Nem para medir coesão e acoplamento
depois que o recorte existe — é `package`, que traz as métricas.

Esta skill decide **o eixo**; `colocation` executa dentro do pacote; `package` audita o
resultado.

## Como aplicar

### O argumento de escala — o que de fato decide

É o argumento central, e o que sobrevive a qualquer debate de gosto:

> No eixo por camada, **o número de pastas fica fixo e cada pasta cresce sem limite.**
> No eixo por feature, o número de pastas cresce com o produto e cada uma continua pequena.

Um sistema por camada com três anos de vida tem as mesmas cinco pastas do primeiro dia —
`controllers/`, `services/`, `models/`, `utils/`, `types/` — e 200 arquivos em cada uma,
sem nenhum critério disponível para dividi-las. A estrutura não tem para onde evoluir,
porque o eixo já foi gasto.

Por feature, a saída é natural: quando uma feature fica grande, ela se divide em duas
features, e o critério vem do produto.

### Os três testes

**1. Deleção simples.** É a medida prática de modularidade:

> Se apagar a feature X é **uma** operação, a implementação é provavelmente modular.

Por feature: `rm -r features/comment-form/`. Uma operação. Por camada: caçar arquivos em
cinco pastas, e o que passar despercebido vira código zumbi (rule 056).

**2. Visibilidade restrita.** Por feature, a maioria dos arquivos pode deixar de ser
pública — só o que o `index` exporta atravessa a fronteira. Por camada, quase tudo precisa
ser público, porque todo consumidor está em outra pasta. É encapsulamento ganho de graça
pelo recorte, e perdido de graça pelo recorte errado.

**3. Navegação.** Tudo que uma tarefa precisa está no mesmo diretório. O eixo por camada
gerou convenções de nome inteiras — sufixos, prefixos, espelhamento de árvores — para
compensar a distância que ele mesmo criou. Por feature a convenção fica desnecessária,
porque não há distância.

### O que o eixo por feature exige em troca

Não é gratuito, e omitir isto é vender a ideia por menos do que ela custa:

- **A feature precisa ter nome.** Se ninguém sabe chamar o recorte, o produto ainda não
  está entendido, e nenhuma pasta resolve isso.
- **O código genuinamente compartilhado precisa de casa.** Existe, e não pertence a
  nenhuma feature. Vira um módulo próprio — não um `utils/` que aceita tudo.
- **Fronteira exige disciplina.** Sem `index` e sem restrição de import, feature vira só
  outra palavra para pasta.

### Quando o eixo por camada ainda serve

Casos reais, e todos têm em comum o mesmo traço — o sistema **é** a camada:

| Caso | Por quê |
|---|---|
| O módulo tem uma feature só | Não há o que separar; `package/` com segments basta |
| A camada é imposta de fora | Framework que exige diretório fixo, ou plataforma serverless |
| O artefato é homogêneo por natureza | `pixel/tokens/`, `pixel/reset/` — o conteúdo é o tipo |
| Biblioteca de utilidade de propósito único | O pacote inteiro é a "camada" |

**Dentro de uma feature, o eixo de camada volta a ser certo.** É a chave que resolve a
falsa oposição: `comment-form/ui/`, `comment-form/api/`, `comment-form/model/` são camadas —
e estão certas ali, porque o primeiro nível já cortou por feature. O erro nunca foi usar
camada; foi usá-la no **primeiro** nível.

### A ordem dos níveis

```
feature primeiro, camada depois          camada primeiro: o erro
──────────────────────────────           ──────────────────────────
comment-form/                            ui/
├── ui/                                  ├── CommentForm
├── api/                                 └── ArticleCard
└── model/                               api/
article-reader/                          ├── commentApi
├── ui/                                  └── articleApi
└── api/                                 model/
                                         ├── comment
                                         └── article
```

À esquerda, apagar `comment-form/` remove o recurso. À direita, remove metade de dois.

## Exemplos

| Caso | Correto | Incorreto |
|---|---|---|
| Eixo por feature versus por camada no primeiro nível | [axis-choice.valid.md](examples/axis-choice.valid.md) | [axis-choice.invalid.md](examples/axis-choice.invalid.md) |
| Fronteira que restringe visibilidade versus tudo público | [visibility.valid.js](examples/visibility.valid.js) | [visibility.invalid.js](examples/visibility.invalid.js) |

## Checklist

- [ ] O primeiro nível nomeia o que o sistema faz, não o que os arquivos são
- [ ] Nenhuma pasta de topo chamada `controllers`, `services`, `hooks`, `types` ou `utils`
- [ ] Apagar uma feature é uma operação só
- [ ] Cada feature expõe um `index`; o resto é interior
- [ ] O código compartilhado tem módulo próprio, não um depósito genérico
- [ ] O eixo de camada aparece só **dentro** da feature
- [ ] Nenhuma feature criada sem nome que venha do produto
- [ ] Nenhuma pasta cresce sem que exista critério para dividi-la

## Troubleshooting

### Metade do código não pertence a feature nenhuma

**Causa:** ou o recorte de features está errado, ou o código é genuinamente transversal.
**Solução:** separar os dois. O transversal de verdade — formatação, cliente HTTP, tipos
comuns — vira módulo com nome próprio e assunto próprio. O que sobra sem nome é sinal de
que a feature que o abriga ainda não foi identificada. `utils/` como destino padrão é a
forma de nunca fazer essa distinção.

### Duas features precisam do mesmo código

**Causa:** normal, e não é motivo para voltar ao eixo de camada.
**Solução:** o compartilhado desce um nível — vira módulo base do qual as duas dependem.
A direção continua única, e o grafo continua acíclico (rule 018). O que **não** se faz é
uma feature importar da outra.

### A estrutura por feature ficou com pastas de um arquivo só

**Causa:** feature foi confundida com arquivo. O recorte foi fino demais.
**Solução:** feature é unidade de produto, não unidade de código. Se ninguém pediria "o
recurso X" pelo nome, X não é feature — é um arquivo dentro de outra. Pasta de um membro
só é cerimônia (rule 064).

## Rules relacionadas

- [016 — Princípio do Fechamento Comum](../../rules/016_principio-fechamento-comum.md): o eixo por feature é CCP no primeiro nível — o que muda pela mesma razão fica junto.
- [058 — Proibição de Shotgun Surgery](../../rules/058_proibicao-shotgun-surgery.md): o requisito pequeno que toca oito arquivos é o sintoma direto do eixo por camada.
- [017 — Princípio do Reuso Comum](../../rules/017_principio-reuso-comum.md): o que é usado junto fica junto, e é o que impede a feature de virar depósito.
- [056 — Proibição de Código Zombie](../../rules/056_proibicao-codigo-zombie-lava-flow.md): o teste da deleção simples existe porque a remoção incompleta é a origem mais comum de código morto.
- [064 — Proibição de Overengineering](../../rules/064_proibicao-overengineering.md): recortar feature fina demais produz pastas de um arquivo, que é o erro oposto e igualmente caro.
- [010 — Princípio da Responsabilidade Única](../../rules/010_principio-responsabilidade-unica.md): a feature tem uma razão para mudar, e é o que dá nome a ela.

## Skills relacionadas

- [colocation](../colocation/SKILL.md): depends on — esta decide o eixo; `colocation` executa o layout dentro do pacote já recortado.
- [package](../package/SKILL.md): complements — esta escolhe o eixo antes; `package` audita coesão e acoplamento depois.
- [fsd](../fsd/SKILL.md): reinforces — FSD é este mesmo eixo levado a três níveis, com as layers padronizadas.
- [revelation](../revelation/SKILL.md): reinforces — a visibilidade restrita que o eixo por feature possibilita só se realiza no index.
- [anti-pattern](../anti-pattern/SKILL.md): complements — Shotgun Surgery e Divergent Change são os dois modos de o eixo estar errado.

---

**Criado em**: 2026-08-25
**Atualizado em**: 2026-08-25
**Versão**: 1.0
