---
name: c4-model
model: opus
description: Diagramas de arquitetura no C4 Model — quatro níveis de abstração progressiva (System Context, Container, Component, Code) em docs/c4/, cada um com público e pergunta-chave próprios. Use ao comunicar a arquitetura para públicos diferentes, ao criar ou atualizar diagramas de contexto, container ou componente, ou quando um diagrama existente mistura níveis e ninguém entende. Não use para registrar por que a arquitetura é assim — use a skill adr.
---

# C4 Model

## O que é

Quatro níveis de zoom sobre a mesma arquitetura, criados por Simon Brown. Cada nível tem
um público e responde a uma pergunta; misturar níveis num diagrama é o erro que torna
diagramas de arquitetura ilegíveis.

| Nível | Arquivo | Público | Pergunta |
|---|---|---|---|
| 1 — System Context | `01_system_context.md` | Todos | O que o sistema faz e com quem se conecta? |
| 2 — Container | `02_container.md` | Técnico | De que partes executáveis ele é feito? |
| 3 — Component | `03_component.md` | Dev | Como cada parte se organiza por dentro? |
| 4 — Code | `04_code.md` | Dev | Como este componente está implementado? |

## Quando usar

| Situação | Nível |
|---|---|
| Apresentar o sistema para negócio ou gestão | 1, no máximo 2 |
| Onboarding técnico | 1 → 2 → 3, nessa ordem |
| Discussão de implementação entre devs | 3 |
| Estrutura interna especialmente difícil | 4, e só então |

O nível 4 raramente se justifica: o código é a melhor documentação de si mesmo, e um
diagrama de classes desatualiza no primeiro refactor. Desenhe só quando a estrutura for
não óbvia o bastante para compensar a manutenção.

Não use para registrar *por que* a arquitetura é assim — isso é `adr`. O C4 mostra o
que existe; o ADR explica a escolha.

Idioma obrigatório: português brasileiro.

## Como aplicar

1. Escolher o nível pelo público, não pelo que se quer mostrar.
2. Abrir o template correspondente e preencher.
3. Manter a nomenclatura **idêntica entre níveis**: o container `pixel` do nível 2 é o
   mesmo `pixel` que aparece no nível 3. Nome divergente entre níveis é o segundo erro
   mais comum depois de misturar níveis.
4. Nível 1 e 2 em linguagem sem jargão; nível 3 e 4 com tipos, interfaces e patterns.

| Nível | Template |
|---|---|
| 1 | [01_system-context.md](references/01_system-context.md) |
| 2 | [02_container.md](references/02_container.md) |
| 3 | [03_component.md](references/03_component.md) |
| 4 | [04_code.md](references/04_code.md) |

Os diagramas são escritos em Mermaid, versionados junto com o código.

## Exemplos

| Caso | Correto | Incorreto |
|---|---|---|
| Um nível por diagrama vs. níveis misturados | [level-separation.valid.md](examples/level-separation.valid.md) | [level-separation.invalid.md](examples/level-separation.invalid.md) |

## Checklist

- [ ] Cada diagrama contém elementos de um único nível
- [ ] O mesmo elemento tem o mesmo nome em todos os níveis onde aparece
- [ ] Níveis 1 e 2 legíveis por quem não é do time
- [ ] Toda seta tem rótulo dizendo o que trafega e por qual protocolo
- [ ] Nível 4 existe apenas onde há complexidade que o justifique
- [ ] A §5 do arc42 referencia estes diagramas em vez de redesenhá-los
- [ ] Tudo em pt-BR

## Troubleshooting

### O diagrama ficou ilegível

**Causa:** níveis misturados — um banco de dados (nível 2) ao lado de uma classe
(nível 4) no mesmo desenho.
**Solução:** separar. Se um elemento não responde à pergunta daquele nível, ele pertence
a outro diagrama.

### O diagrama desatualizou

**Causa:** nível 3 ou 4 detalhado demais, acompanhando cada refactor.
**Solução:** níveis 1 e 2 mudam pouco e valem a manutenção. Nível 4 desatualiza sempre —
por isso só se desenha quando é indispensável.

### Dois diagramas chamam a mesma coisa por nomes diferentes

**Causa:** ausência de vocabulário comum.
**Solução:** a §12 do arc42 (glossário) é a fonte dos nomes. O C4 usa exatamente os
termos de lá.

## Referências

- `references/01_system-context.md` … `references/04_code.md` — template de cada nível,
  com escopo, público e o que não incluir.

Fonte: Simon Brown, https://c4model.com

## Rules relacionadas

- [021 — Proibição de Duplicação](../../rules/021_proibicao-duplicacao-logica.md): cada informação num nível só; a §5 do arc42 referencia, não copia.
- [026 — Qualidade de Comentários: o Porquê](../../rules/026_qualidade-comentarios-porque.md): o diagrama mostra o quê; o porquê fica no ADR.
- [006 — Proibição de Nomes Abreviados](../../rules/006_proibicao-nomes-abreviados.md): a consistência de nomes entre níveis vale a mesma disciplina do código.
- [018 — Dependências Acíclicas](../../rules/018_principio-dependencias-aciclicas.md): o nível 3 é onde um ciclo entre componentes fica visível.

## Skills relacionadas

- [arc42](../arc42/SKILL.md): complements — a §5 usa estes diagramas como visão de blocos.
- [adr](../adr/SKILL.md): complements — o diagrama mostra a estrutura; o ADR explica a escolha.
- [package](../package/SKILL.md): reinforces — o nível 3 torna visível o grafo que os princípios de pacote governam.
- [colocation](../colocation/SKILL.md): reinforces — os três níveis da Vertical Slice espelham Container → Component.

---

**Criado em**: 2026-04-01
**Atualizado em**: 2026-08-09
**Versão**: 2.0
