---
name: anatomy
model: haiku
description: Ordem de declaração dos membros dentro de uma classe — campos privados, getters/setters, getters/setters estáticos, constructor, métodos, métodos estáticos e bloco static, nessa sequência, com ordenação alfabética dentro de cada grupo. Use ao criar ou refatorar uma classe, Web Component ou módulo com vários membros, ou ao revisar código onde a ordem dos membros parece arbitrária. Não use para ordenar propriedades de objeto literal ou imports — use a skill alphabetical.
---

# Anatomy

## O que é

A ordem fixa em que os membros de uma classe são declarados. Não é estética: é o que
permite abrir qualquer classe do repositório e saber onde procurar sem ler o arquivo
inteiro.

A ordem é fixa e não se reordena por preferência. Consistência vale mais que a opinião
de cada arquivo.

## Quando usar

| Situação | Ação |
|---|---|
| Criando classe ou Web Component | Aplicar a ordem desde o início |
| Adicionando membro a classe existente | Inserir na posição alfabética do grupo |
| Revisando classe com ordem arbitrária | Reordenar (rule 039) |

Não se aplica a objetos literais e funções puras — para esses, a skill `alphabetical`.

## Como aplicar

| Ordem | Grupo | Ordenação interna |
|---|---|---|
| 1 | Campos privados (`#name`) | Alfabética |
| 2 | Getters e setters | Alfabética |
| 3 | Getters e setters estáticos | Alfabética |
| 4 | `constructor` | — |
| 5 | Métodos | Alfabética |
| 6 | Métodos estáticos | Alfabética |
| 7 | Bloco `static {}` | — |

Regras adicionais:

- Getter e setter de mesmo nome ficam juntos, getter primeiro.
- Campos privados sempre com prefixo `#` — nunca `_name`.
- Dentro do grupo, alfabética sempre, nunca por frequência de uso ou ordem de chamada.

O motivo de a alfabética ganhar de "ordem lógica": ordem lógica é subjetiva e diverge
entre arquivos e pessoas. Alfabética é verificável e não admite discussão.

## Exemplos

| Caso | Correto | Incorreto |
|---|---|---|
| Ordem dos sete grupos numa classe | [member-order.valid.js](examples/member-order.valid.js) | [member-order.invalid.js](examples/member-order.invalid.js) |

## Checklist

- [ ] Os sete grupos aparecem na ordem definida
- [ ] Dentro de cada grupo, ordenação alfabética
- [ ] Getter e setter do mesmo nome adjacentes, getter primeiro
- [ ] Nenhum membro privado por convenção de underscore
- [ ] Classe abaixo de 50 linhas (rule 007)
- [ ] Nenhuma ordem justificada por "faz mais sentido assim"

## Troubleshooting

### A ordem alfabética separou membros relacionados

**Causa:** é esperado — a alfabética não agrupa por tema.
**Solução:** se dois membros precisam ser lidos juntos para fazer sentido, provavelmente
formam uma responsabilidade que merece classe própria (rule 010). O incômodo é sintoma,
não problema de ordenação.

### A classe passou de 50 linhas depois de reordenar

**Causa:** reordenar tornou visível o que estava disperso.
**Solução:** a violação já existia. Extrair responsabilidade ou mixin (rules 007 e 010).

## Rules relacionadas

- [022 — Simplicidade e Clareza](../../rules/022_priorizacao-simplicidade-clareza.md): estrutura previsível reduz o custo de leitura.
- [010 — Responsabilidade Única](../../rules/010_principio-responsabilidade-unica.md): a organização torna visível quantas responsabilidades a classe acumula.
- [007 — Máximo de Linhas por Classe](../../rules/007_limite-maximo-linhas-classe.md): 50 linhas por classe, 15 por método.
- [008 — Proibição de Getters/Setters](../../rules/008_proibicao-getters-setters.md): o grupo 2 existe para os que se justificam, não para expor estado.
- [039 — Regra do Escoteiro](../../rules/039_regra-escoteiro-refatoracao-continua.md): reordenar o arquivo tocado é melhoria de escopo aceitável.

## Skills relacionadas

- [alphabetical](../alphabetical/SKILL.md): reinforces — a mesma disciplina aplicada a objetos, imports e exports.
- [constructor](../constructor/SKILL.md): depends on — define o conteúdo do grupo 4.
- [getter](../getter/SKILL.md): complements — quando o grupo 2 se justifica.
- [setter](../setter/SKILL.md): complements — o mesmo, do lado da escrita.
- [method](../method/SKILL.md): complements — o que entra no grupo 5.
- [bracket](../bracket/SKILL.md): complements — métodos privados por Symbol e onde declará-los.
- [mixin](../mixin/SKILL.md): complements — mixins seguem a mesma anatomia internamente.

---

**Criado em**: 2026-04-01
**Atualizado em**: 2026-08-10
**Versão**: 2.0
