---
name: twelve-factor
model: opus
description: Os 12 fatores da metodologia Twelve-Factor App (Heroku) aplicados às rules 040–051 — codebase única, dependências explícitas, config no ambiente, backing services anexáveis, build/release/run separados, processos stateless, port binding, concorrência, descartabilidade, paridade dev/prod, logs como fluxo de eventos e processos administrativos. Use ao configurar um projeto novo, preparar deploy, escalar horizontalmente, investigar "funciona na minha máquina", decidir onde a configuração deve morar, ou tratar logs e migrations. Não use para design de código — use as skills solid, clean-code e calisthenics.
---

# Twelve-Factor App

## O que é

Metodologia para construir aplicações que são portáveis entre ambientes, escaláveis
horizontalmente e implantáveis continuamente. As rules 040 a 051 são exatamente esses
12 fatores, com critérios objetivos.

O princípio unificador: **tudo que varia entre ambientes vive fora do código**, e o
processo em execução não guarda nada que não possa perder.

## Quando usar

| Situação | Fatores |
|---|---|
| Configurar projeto novo | 01 Codebase, 02 Dependencies, 03 Config |
| Preparar deploy | 04 Backing Services, 05 Build/Release/Run |
| Escalar horizontalmente | 06 Processes, 08 Concurrency |
| Garantir recuperação rápida | 09 Disposability |
| "Funciona na minha máquina" | 03 Config, 04 Backing Services, 10 Dev/Prod Parity |
| Logs somem quando o container reinicia | 11 Logs |
| Migration quebrou em produção | 12 Admin Processes, 10 Dev/Prod Parity |
| Expor um serviço | 07 Port Binding |

Não aplique o fator 06 (stateless) ao desenvolvimento local, onde combinar build e run
é aceitável. Não confunda configuração de *build* (`tsconfig.json`, `biome.json`) com
configuração de *ambiente* (`process.env`) — só a segunda é o fator 03.

## Como aplicar

| # | Fator | Rule | Pergunta-chave | Detalhe |
|---|---|---|---|---|
| 01 | Codebase | [040](../../rules/040_base-codigo-unica.md) | Uma app = um repositório? | [01-codebase.md](references/01-codebase.md) |
| 02 | Dependencies | [041](../../rules/041_declaracao-explicita-dependencias.md) | Toda dependência declarada no manifesto? | [02-dependencies.md](references/02-dependencies.md) |
| 03 | Config | [042](../../rules/042_configuracoes-via-ambiente.md) | Config no ambiente, não no código? | [03-config.md](references/03-config.md) |
| 04 | Backing Services | [043](../../rules/043_servicos-apoio-recursos.md) | Serviço anexável por URL de config? | [04-backing-services.md](references/04-backing-services.md) |
| 05 | Build, Release, Run | [044](../../rules/044_separacao-build-release-run.md) | Três estágios separados e imutáveis? | [05-build-release-run.md](references/05-build-release-run.md) |
| 06 | Processes | [045](../../rules/045_processos-stateless.md) | Stateless e share-nothing? | [06-processes.md](references/06-processes.md) |
| 07 | Port Binding | [046](../../rules/046_port-binding.md) | Autocontido, sem servidor externo obrigatório? | [07-port-binding.md](references/07-port-binding.md) |
| 08 | Concurrency | [047](../../rules/047_concorrencia-via-processos.md) | Escala por múltiplos processos? | [08-concurrency.md](references/08-concurrency.md) |
| 09 | Disposability | [048](../../rules/048_descartabilidade-processos.md) | Sobe rápido, desliga com graça? | [09-disposability.md](references/09-disposability.md) |
| 10 | Dev/Prod Parity | [049](../../rules/049_paridade-dev-prod.md) | Dev ≈ staging ≈ prod? | [10-dev-prod-parity.md](references/10-dev-prod-parity.md) |
| 11 | Logs | [050](../../rules/050_logs-fluxo-eventos.md) | Logs para stdout, não arquivo? | [11-logs.md](references/11-logs.md) |
| 12 | Admin Processes | [051](../../rules/051_processos-administrativos.md) | Tarefa admin é processo one-off versionado? | [12-admin-processes.md](references/12-admin-processes.md) |

### Diagnóstico por sintoma

| Sintoma | Fatores a verificar |
|---|---|
| App não escala horizontalmente | 06, 08, 09 |
| Deploy manual e arriscado | 05, 10 |
| Bug só aparece em produção | 03, 04, 10 |
| Log perdido no restart | 11 |
| Script de manutenção divergiu do código | 12, 10 |

## Exemplos

| Caso | Correto | Incorreto |
|---|---|---|
| Fator 03 — configuração no ambiente vs. no código | [config.valid.js](examples/config.valid.js) | [config.invalid.js](examples/config.invalid.js) |
| Fatores 06 e 11 — estado em backing service e log em stdout | [stateless-and-logs.valid.js](examples/stateless-and-logs.valid.js) | [stateless-and-logs.invalid.js](examples/stateless-and-logs.invalid.js) |

## Checklist

- [ ] Um repositório por aplicação, muitos deploys (040)
- [ ] Nenhuma dependência implícita do sistema operacional (041)
- [ ] Nenhum segredo ou URL de ambiente no código-fonte (042)
- [ ] Todo backing service alcançado por URL de configuração (043)
- [ ] Build, release e run separados; release imutável (044)
- [ ] Nenhum estado de sessão em memória ou disco local (045)
- [ ] Servidor embutido, sem dependência de servidor externo (046)
- [ ] Escala por processo, não por thread dentro de um processo (047)
- [ ] Shutdown tratando `SIGTERM` (048)
- [ ] Mesmos backing services em dev e prod (049)
- [ ] Logs em `stdout`, sem rotação própria (050)
- [ ] Migrations versionadas junto com o código, executadas como one-off (051)

## Troubleshooting

### Movi tudo para `process.env` e o app quebra sem mensagem clara

**Causa:** variável ausente lida como `undefined` e propagada silenciosamente.
**Solução:** validar a presença das variáveis obrigatórias na inicialização e falhar
com erro nomeado — é o que a rule 027 pede.

### Os logs em stdout viraram ruído impossível de consultar

**Causa:** log em texto livre em vez de evento estruturado.
**Solução:** uma linha JSON por evento, com nível e contexto. A agregação é
responsabilidade do ambiente de execução, não da aplicação (rule 050).

### Paridade dev/prod exige subir infra pesada localmente

**Causa:** interpretação de paridade como "ambiente idêntico".
**Solução:** paridade é sobre o *tipo* de backing service, não sobre escala. Mesmo
banco, mesma versão — tamanho pode diferir.

## Referências

- `references/01-codebase.md` … `references/12-admin-processes.md` — um arquivo por
  fator, com critério, violações típicas e correção.

Fonte: https://12factor.net

## Rules relacionadas

- [040 — Base de Código Única](../../rules/040_base-codigo-unica.md)
- [041 — Declaração Explícita de Dependências](../../rules/041_declaracao-explicita-dependencias.md)
- [042 — Configurações via Ambiente](../../rules/042_configuracoes-via-ambiente.md)
- [043 — Serviços de Apoio como Recursos](../../rules/043_servicos-apoio-recursos.md)
- [044 — Separação Build, Release, Run](../../rules/044_separacao-build-release-run.md)
- [045 — Processos Stateless](../../rules/045_processos-stateless.md)
- [046 — Port Binding](../../rules/046_port-binding.md)
- [047 — Concorrência via Processos](../../rules/047_concorrencia-via-processos.md)
- [048 — Descartabilidade de Processos](../../rules/048_descartabilidade-processos.md)
- [049 — Paridade Dev/Prod](../../rules/049_paridade-dev-prod.md)
- [050 — Logs como Fluxo de Eventos](../../rules/050_logs-fluxo-eventos.md)
- [051 — Processos Administrativos](../../rules/051_processos-administrativos.md)
- [030 — Proibição de Funções Inseguras](../../rules/030_proibicao-funcoes-inseguras.md): reforça o fator 03 no ponto dos segredos.

## Skills relacionadas

- [quality](../quality/SKILL.md): complements — Portability, Adaptability e Interoperability são medidas desses fatores.
- [package](../package/SKILL.md): complements — o fator 01 e o REP tratam da mesma granularidade, em escalas diferentes.
- [clean-code](../clean-code/SKILL.md): reinforces — segredo no ambiente e ausência de constante mágica são a mesma disciplina.
- [codetags](../codetags/SKILL.md): complements — registra a violação de fator que não será corrigida agora.

---

**Criado em**: 2026-04-01
**Atualizado em**: 2026-08-09
**Versão**: 2.0
