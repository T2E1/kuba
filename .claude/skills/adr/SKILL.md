---
name: adr
model: opus
description: Escreve Architecture Decision Records em docs/adr/ — decisão arquitetural registrada com contexto, alternativas consideradas, consequências positivas e negativas, e ciclo de vida por status (Proposed, Accepted, Deprecated, Superseded). Use ao escolher entre tecnologias, patterns ou abordagens com impacto de longo prazo, ao revisar ou substituir uma decisão anterior, ou quando alguém perguntar "por que fizemos assim?" e a resposta não estiver escrita em lugar nenhum. Não use para decisões reversíveis de baixo impacto.
---

# ADR (Architecture Decision Records)

## O que é

Registro rastreável de uma decisão arquitetural: o contexto que a forçou, as alternativas
avaliadas, o que foi escolhido e o que isso custa. Formato proposto por Michael Nygard em
*Documenting Architecture Decisions* (2011).

O que um ADR compra: o debate acontece uma vez. Sem ele, a mesma discussão volta a cada
seis meses porque ninguém lembra por que a opção óbvia foi descartada.

## Quando usar

| Situação | Ação |
|---|---|
| Escolha de tecnologia, runtime ou biblioteca estruturante | Escrever ADR |
| Adoção de pattern arquitetural | Escrever ADR |
| Decisão anterior sendo revista | Novo ADR com status `Supersedes` |
| "Por que fizemos assim?" sem resposta escrita | ADR retroativo |
| Decisão reversível de baixo impacto | Não escrever — é ruído |

O teste: se reverter a decisão daqui a um ano exigiria trabalho significativo, ela merece
ADR. Se basta trocar uma linha, não merece.

## Como aplicar

### Estrutura obrigatória

Template completo em [adr-template.md](references/adr-template.md). As seções sem as quais
o ADR não cumpre a função:

1. **Contexto** — o problema e as restrições reais, com números quando existirem. Sem
   isso, quem lê daqui a um ano não consegue julgar se a decisão ainda vale.
2. **Decisão** — o que foi escolhido, em voz ativa.
3. **Alternativas consideradas** — tabela com prós e contras de cada uma. Um ADR sem
   alternativas não documenta decisão nenhuma; documenta preferência.
4. **Consequências** — positivas **e** negativas. A ausência das negativas é o defeito
   mais comum: toda decisão arquitetural custa alguma coisa, e o custo é justamente o que
   a versão futura precisa saber.
5. **Relacionado a** — outros ADRs e a seção arc42 correspondente.

### Numeração e ciclo de vida

- Sequencial: `ADR-001`, `ADR-002`…
- Arquivo: `docs/adr/NNN_titulo-kebab-case.md`
- Índice mantido em `docs/adr/README.md`
- **Nunca deletar.** Uma decisão revista vira `Deprecated` ou `Superseded`, e o ADR novo
  aponta para o antigo. O histórico é o valor.

### Categorias

| Categoria | Exemplos |
|---|---|
| Tecnologia | Runtime, framework, biblioteca, banco |
| Pattern arquitetural | Event Sourcing, CQRS, Vertical Slice |
| Design de código | Value Objects, Repository, DIP |
| Infraestrutura | Deploy, CI/CD, monitoramento |
| Integração | API externa, protocolo, autenticação |

## Exemplos

| Caso | Correto | Incorreto |
|---|---|---|
| Decisão com contexto, alternativas e trade-offs | [decision-record.valid.md](examples/decision-record.valid.md) | [decision-record.invalid.md](examples/decision-record.invalid.md) |

## Checklist

- [ ] Contexto descreve o problema real, não a solução
- [ ] Ao menos duas alternativas com prós e contras
- [ ] Consequências negativas listadas explicitamente
- [ ] Status e data preenchidos
- [ ] Numeração sequencial sem lacuna, índice atualizado
- [ ] Nenhum ADR anterior deletado — apenas marcado
- [ ] A decisão é irreversível o bastante para merecer o registro

## Troubleshooting

### O ADR virou documentação de implementação

**Causa:** descreve *como* foi construído em vez de *por que* foi decidido.
**Solução:** o como pertence ao arc42 e ao C4. O ADR guarda a escolha e o que foi
descartado.

### Ninguém lê os ADRs

**Causa:** ADRs escritos para decisões triviais afogaram os que importam.
**Solução:** aplicar o teste da reversibilidade. Poucos ADRs bons valem mais que muitos.

### A decisão mudou e o ADR ficou mentindo

**Causa:** ADR editado no lugar de substituído.
**Solução:** ADR é imutável depois de aceito. A mudança é um ADR novo com `Supersedes:
ADR-NNN`, e o antigo recebe `Superseded by: ADR-MMM`.

## Referências

- `references/adr-template.md` — template completo, pronto para copiar.

Fonte: Michael Nygard, *Documenting Architecture Decisions* (2011).

## Rules relacionadas

- [026 — Qualidade de Comentários: o Porquê](../../rules/026_qualidade-comentarios-porque.md): o ADR é onde o porquê arquitetural mora, fora do código.
- [064 — Proibição de Overengineering](../../rules/064_proibicao-overengineering.md): admite complexidade quando há decisão arquitetural documentada — este é o documento.
- [023 — Funcionalidade Especulativa](../../rules/023_proibicao-funcionalidade-especulativa.md): exigir alternativas e consequências expõe decisões tomadas por especulação.
- [068 — Proibição do Martelo de Ouro](../../rules/068_proibicao-martelo-de-ouro.md): a tabela de alternativas é o antídoto para "sempre usamos X".

## Skills relacionadas

- [arc42](../arc42/SKILL.md): complements — a seção 9 do arc42 é o índice das decisões registradas aqui.
- [c4-model](../c4-model/SKILL.md): complements — o C4 mostra a estrutura resultante da decisão.
- [poeaa](../poeaa/SKILL.md): complements — escolhas de camada e persistência são candidatas típicas a ADR.
- [gof](../gof/SKILL.md): complements — a adoção de um pattern estruturante merece registro.

---

**Criado em**: 2026-04-01
**Atualizado em**: 2026-08-09
**Versão**: 2.0
