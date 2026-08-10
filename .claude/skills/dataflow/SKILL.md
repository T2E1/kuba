---
name: dataflow
model: sonnet
description: Comunicação reativa entre componentes por event bus declarativo — binding `source/event:type/sink|filtros` no template, componente `morph-on` como receptor, e filtros puros compondo a transformação do payload. Use ao conectar componentes que não se conhecem, ao criar fluxo reativo entre partes distantes da página, ou ao substituir referência direta entre componentes por binding declarativo. Não use quando um componente já tem referência legítima ao outro — chamar o método direto é mais simples.
---

# Dataflow

## O que é

Uma camada acima da skill `event`: em vez de cada componente registrar listeners no
JavaScript, a conexão entre emissor e receptor é declarada no template. Nenhum dos dois
conhece o outro — o bus faz a ponte.

```
source/event:type/sink|filtro=valor
```

## Quando usar

| Situação | Ação |
|---|---|
| Componentes distantes precisam se comunicar | Binding declarativo |
| A conexão muda conforme a página | Declarar no template, não no código |
| O payload precisa de transformação | Pipeline de filtros |
| Um componente já tem referência ao outro | Chamar o método direto — mais simples |

O critério: se a conexão é estrutural e local (pai e filho), método direto ganha. Se é
entre partes distantes ou variável por página, o bus ganha.

## Como aplicar

### Anatomia do binding

| Parte | Obrigatória | O que é |
|---|---|---|
| `source` | Sim | Quem emite |
| `event` | Sim | Nome do `CustomEvent` |
| `type` | Sim | Como o receptor recebe |
| `sink` | Sim | Método, atributo ou propriedade alvo |
| `filtros` | Não | Transformações do payload |

### Source

| Forma | Alcance |
|---|---|
| `*` | Qualquer emissor daquele evento |
| `#id` | Um elemento por id |
| `nome` | Um elemento pelo atributo `name` |
| `element-tag` | Todos os elementos daquele custom element |

### Type

| Type | Efeito no receptor |
|---|---|
| `method` | `this[sink](payload)` |
| `attribute` | `this.setAttribute(sink, payload)` |
| `setter` | `this[sink] = payload` |

### Filtros

Compostos em pipeline, aplicados na ordem. São **funções puras** (rule 036): recebem o
payload e devolvem outro, sem efeito colateral. Um filtro que dispara evento ou toca o
DOM quebra a previsibilidade de todo o fluxo.

### Ciclo de vida

Os listeners são conectados quando o receptor entra no documento e removidos quando sai.
Nada a gerenciar manualmente — e nada vaza.

## Exemplos

| Caso | Correto | Incorreto |
|---|---|---|
| Binding declarativo vs. referência direta entre componentes | [binding.valid.html](examples/binding.valid.html) | [binding.invalid.html](examples/binding.invalid.html) |

## Checklist

- [ ] Nenhum componente guardando referência direta a outro distante
- [ ] Nenhum fluxo circular — A alimenta B que alimenta A
- [ ] Filtros puros, sem efeito colateral
- [ ] Nome do evento vindo de constante (skill `enum`)
- [ ] O `sink` existe de fato no receptor
- [ ] Método direto usado onde a relação é estrutural

## Troubleshooting

### O fluxo entrou em loop infinito

**Causa:** dataflow circular — o receptor emite um evento que realimenta o emissor.
**Solução:** o grafo de fluxo tem de ser acíclico, pelo mesmo motivo do grafo de módulos
(rule 018). Quebrar o ciclo introduzindo um estado intermediário ou invertendo a direção.

### O binding não dispara

**Causa:** o evento não chega ao bus — quase sempre `composed: false` prendendo o evento
dentro do Shadow DOM.
**Solução:** `bubbles: true` e `composed: true` (skill `event`).

### O `sink` não existe no receptor e falha silenciosamente

**Causa:** nome digitado à mão no template, sem verificação.
**Solução:** o `sink` faz parte do contrato público do receptor — precisa estar no
`types.d.ts` (skill `types`). Divergência entre binding e contrato é o defeito mais comum
aqui.

### O fluxo ficou impossível de seguir

**Causa:** bindings demais, ou uso do bus onde havia relação direta.
**Solução:** desacoplamento tem custo de rastreabilidade. Onde pai e filho se conhecem,
chamar o método é mais legível (rule 022).

## Rules relacionadas

- [018 — Dependências Acíclicas](../../rules/018_principio-dependencias-aciclicas.md): o grafo de fluxo também precisa ser acíclico.
- [009 — Diga, Não Pergunte](../../rules/009_diga-nao-pergunte.md): o emissor anuncia o fato; quem escuta decide.
- [036 — Efeitos Colaterais](../../rules/036_restricao-funcoes-efeitos-colaterais.md): filtros são puros.
- [014 — Inversão de Dependência](../../rules/014_principio-inversao-dependencia.md): nenhum dos dois depende do concreto do outro.
- [022 — Simplicidade e Clareza](../../rules/022_priorizacao-simplicidade-clareza.md): o desacoplamento custa rastreabilidade — só onde compensa.
- [070 — Estado Mutável Compartilhado](../../rules/070_proibicao-estado-mutavel-compartilhado.md): o payload trafega, não é buffer compartilhado.

## Skills relacionadas

- [event](../event/SKILL.md): depends on — o bus transporta os `CustomEvent` definidos lá.
- [enum](../enum/SKILL.md): reinforces — nomes de evento como constantes.
- [types](../types/SKILL.md): depends on — o `sink` precisa estar no contrato público do receptor.
- [state](../state/SKILL.md): complements — o que chega pelo fluxo costuma virar estado.
- [anti-pattern](../anti-pattern/SKILL.md): complements — bus usado onde havia relação direta é overengineering.

---

**Criado em**: 2026-04-01
**Atualizado em**: 2026-08-10
**Versão**: 2.0
