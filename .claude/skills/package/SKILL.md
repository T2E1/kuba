---
name: package
model: opus
description: Os 6 princípios de design de pacotes de Robert C. Martin — coesão (REP, CCP, CRP) e acoplamento (ADP, SDP, SAP) — com as métricas de Instabilidade, Abstração e Distância da Main Sequence. Use ao criar um módulo ou pacote novo, ao decidir onde um arquivo deve morar, ao organizar a estrutura de pastas, ao detectar import circular, ao avaliar se um módulo é estável o bastante para ser dependido, ou ao definir a interface pública de um módulo. Não use para design interno de classes — use as skills solid e calisthenics.
---

# Package Principles

## O que é

Seis princípios que respondem duas perguntas: **o que colocar dentro de um pacote**
(coesão) e **como organizar as dependências entre pacotes** (acoplamento). São a base
das rules 015 a 020.

**Coesão** — REP (granularidade de reuso = granularidade de release), CCP (o que muda
junto fica junto), CRP (o que é usado junto fica junto).

**Acoplamento** — ADP (o grafo é acíclico), SDP (depender na direção da estabilidade),
SAP (o que é estável deve ser abstrato).

## Quando usar

| Situação | Princípio |
|---|---|
| Criar módulo ou pacote novo | REP, CCP, CRP |
| Decidir onde colocar um arquivo | CCP — muda junto com o quê? |
| Organizar estrutura de pastas | CCP, CRP |
| Versionar biblioteca compartilhada | REP |
| Import circular quebrando o build | ADP |
| Avaliar estabilidade de um módulo | SDP, SAP |
| Definir a interface pública de um módulo | SAP, CRP |

Não use para design interno de classes — isso é `solid` e `calisthenics`. Não calcule
métricas de abstração em pacotes de dados puros (DTOs, Value Objects): A e I baixos ali
são esperados.

## Como aplicar

| Princípio | Grupo | Rule | Pergunta-chave | Detalhe |
|---|---|---|---|---|
| **REP** Release Reuse Equivalency | Coesão | [015](../../rules/015_principio-equivalencia-lancamento-reuso.md) | Reuso e release têm a mesma granularidade? | [rep.md](references/rep.md) |
| **CCP** Common Closure | Coesão | [016](../../rules/016_principio-fechamento-comum.md) | Classes que mudam juntas estão juntas? | [ccp.md](references/ccp.md) |
| **CRP** Common Reuse | Coesão | [017](../../rules/017_principio-reuso-comum.md) | Quem usa uma classe usa todas as do pacote? | [crp.md](references/crp.md) |
| **ADP** Acyclic Dependencies | Acoplamento | [018](../../rules/018_principio-dependencias-aciclicas.md) | O grafo é um DAG? | [adp.md](references/adp.md) |
| **SDP** Stable Dependencies | Acoplamento | [019](../../rules/019_principio-dependencias-estaveis.md) | Instabilidade I < 0.5 nos módulos críticos? | [sdp.md](references/sdp.md) |
| **SAP** Stable Abstractions | Acoplamento | [020](../../rules/020_principio-abstracoes-estaveis.md) | Abstração alta onde a instabilidade é baixa? | [sap.md](references/sap.md) |

### Diagnóstico por sintoma

| Sintoma | Violação | Correção |
|---|---|---|
| Commit pequeno toca 10+ arquivos em pacotes diferentes | CCP | Reagrupar pelo que muda junto |
| Atualizar a lib obriga a aceitar 50 classes não usadas | CRP | Quebrar o pacote |
| Import circular quebra o build | ADP | Extrair interface comum (DIP) |
| Módulo de domínio depende de módulo de infra volátil | SDP | Inverter a dependência |
| Módulo muito dependido, 100% concreto | SAP | Introduzir abstrações |
| Não sei onde colocar a classe nova | CCP | Onde estão as que mudarão pela mesma razão |

### O triângulo de tensão

```
          REP
         /   \
        /     \
       /       \
      CCP ----- CRP
```

Os três princípios de coesão se puxam: CCP quer tudo que muda junto no mesmo lugar
(pacotes maiores); CRP quer separar o que não é reutilizado junto (pacotes menores);
REP quer releases coesas. Não há solução ótima — há equilíbrio por fase. Projeto novo
pende para CCP; projeto maduro e consumido por terceiros pende para REP e CRP.

### Métricas

```
Instabilidade    I = saídas / (entradas + saídas)      I ∈ [0,1]
Abstração        A = abstrações / total de classes      A ∈ [0,1]
Distância        D = |A + I − 1|                        D ∈ [0,1]
```

- **I = 0** — ninguém depende para fora, muitos dependem dele: máxima estabilidade.
- **I = 1** — depende de todo mundo, ninguém depende dele: máxima instabilidade.
- **D ≈ 0** — na Main Sequence, o alvo.
- **A=0, I=0** — Zona da Dor: concreto e muito dependido, quase impossível mudar.
- **A=1, I=1** — Zona da Inutilidade: abstrato e sem consumidores.

## Exemplos

| Caso | Correto | Incorreto |
|---|---|---|
| Agrupamento por razão-para-mudar vs. por tipo técnico (CCP) | [package-layout.valid.md](examples/package-layout.valid.md) | [package-layout.invalid.md](examples/package-layout.invalid.md) |
| Ciclo entre pacotes e sua quebra por inversão (ADP) | [dependency-cycle.valid.js](examples/dependency-cycle.valid.js) | [dependency-cycle.invalid.js](examples/dependency-cycle.invalid.js) |

## Checklist

- [ ] Nenhum ciclo no grafo de dependências (ADP, rule 018)
- [ ] Nenhuma classe isolada num pacote coeso que ninguém mais usa (CRP, rule 017)
- [ ] Nenhum módulo de política dependendo de módulo volátil (SDP, rule 019)
- [ ] Nenhum módulo muito dependido e 100% concreto (SAP, rule 020)
- [ ] D ≤ 0.1 nos pacotes principais
- [ ] Um requisito não obriga a mexer em mais de 3 pacotes não relacionados (CCP, rule 016)
- [ ] Nenhum import relativo com `../` — só path alias (rule 031)

## Troubleshooting

### Quebrei o pacote por CRP e agora um requisito toca cinco pacotes

**Causa:** CRP foi aplicado sem contrapeso de CCP.
**Solução:** o triângulo é uma escolha, não um teorema. Se a mudança é frequente e o
reuso é hipotético, CCP ganha — reagrupe.

### O import circular sumiu mas a interface ficou num pacote que ninguém entende

**Causa:** a abstração foi extraída para um pacote "shared" genérico.
**Solução:** a interface pertence ao pacote do **consumidor** de alto nível, não a um
depósito comum. É o que a rule 014 chama de inverter a dependência.

### I está baixo mas o módulo muda toda semana

**Causa:** I mede dependências, não volatilidade real. Um módulo estável por métrica
pode ser instável por requisito.
**Solução:** se muda toda semana e todos dependem dele, é Zona da Dor — aumente A
introduzindo abstrações na fronteira.

## Referências

- `references/metrics.md` — cálculo de I, A e D com leitura do resultado (SDP, SAP).

- `references/rep.md`, `ccp.md`, `crp.md`, `adp.md`, `sdp.md`, `sap.md` — cada princípio
  com critério, detecção e refatoração.

## Rules relacionadas

- [015 — Equivalência de Lançamento e Reuso](../../rules/015_principio-equivalencia-lancamento-reuso.md)
- [016 — Princípio do Fechamento Comum](../../rules/016_principio-fechamento-comum.md)
- [017 — Princípio do Reuso Comum](../../rules/017_principio-reuso-comum.md)
- [018 — Princípio de Dependências Acíclicas](../../rules/018_principio-dependencias-aciclicas.md)
- [019 — Princípio de Dependências Estáveis](../../rules/019_principio-dependencias-estaveis.md)
- [020 — Princípio de Abstrações Estáveis](../../rules/020_principio-abstracoes-estaveis.md)
- [031 — Proibição de Imports Relativos](../../rules/031_restricao-imports-relativos.md): path aliases tornam o grafo legível.

## Skills relacionadas

- [solid](../solid/SKILL.md): depends on — REP, CCP e CRP pressupõem SRP e OCP aplicados nas classes.
- [colocation](../colocation/SKILL.md): reinforces — a Vertical Slice é CCP levado à estrutura de pastas.
- [revelation](../revelation/SKILL.md): complements — o index do módulo é onde CRP e SAP se materializam.
- [anti-pattern](../anti-pattern/SKILL.md): complements — Shotgun Surgery e Divergent Change são CCP e SRP violados.

---

**Criado em**: 2026-04-01
**Atualizado em**: 2026-08-09
**Versão**: 2.0
