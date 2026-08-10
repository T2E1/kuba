---
name: setter
model: sonnet
description: Quando um setter se justifica apesar da rule 008 — validação da entrada, normalização antes de atribuir, sincronização com atributo HTML via `attributeChanged`, e disparo de re-renderização via `repaint` ou `retouch`. Use ao criar setter de um campo `#` em custom element, ao revisar setter que é mera atribuição, ou ao decidir entre setter e método de intenção. Não use para atribuir sem tratamento — isso é o setter puro que a rule 008 proíbe.
---

# Setter

## O que é

O espelho da skill `getter`: a rule 008 proíbe setters puros, e esta skill define quando
um se justifica. **Um setter se justifica quando trata a escrita** — valida, normaliza,
sincroniza com o DOM ou dispara re-render.

Sem tratamento, é campo público disfarçado, e o objeto perde a capacidade de proteger o
próprio estado.

## Quando usar

| Situação | Veredito |
|---|---|
| Validação da entrada antes de atribuir | ✅ Setter |
| Normalização (trim, lowercase, coerção) | ✅ Setter |
| Sincronizar com atributo HTML | ✅ Setter com `attributeChanged` |
| Disparar re-render após mudar | ✅ Setter com `repaint` ou `retouch` |
| Apenas `this.#campo = value` | ❌ Rule 008 |
| Mudança que representa intenção de negócio | ❌ Método (`activate()`, não `setStatus()`) |

O teste da intenção: `pedido.setStatus('cancelado')` descreve mecânica;
`pedido.cancelar(motivo)` descreve negócio. Quando existe intenção, ela ganha do setter.

## Como aplicar

### Decorators

| Decorator | Efeito |
|---|---|
| `attributeChanged` | Sincroniza o setter com a mudança do atributo HTML |
| `retouch` | Re-renderização parcial após a escrita |
| `repaint` | Re-renderização completa após a escrita |

### Regras

1. **Um setter, um campo privado** (rule 010).
2. **Getter correspondente obrigatório**, declarado antes dele (skill `anatomy`).
3. **Síncrono sempre.** Nenhuma Promise nasce num setter: não há onde tratá-la
   (rule 028), e o objeto fica num estado indefinido enquanto resolve.
4. **Validação simples.** Regra de negócio complexa é método, não setter.
5. **Sem efeito colateral alheio** — mexer em outro campo ou disparar ação não
   relacionada quebra a previsibilidade (rule 036).
6. **Até 15 linhas** (rule 007).

## Exemplos

| Caso | Correto | Incorreto |
|---|---|---|
| Setter que valida, normaliza e sincroniza vs. atribuição pura | [treatment.valid.js](examples/treatment.valid.js) | [treatment.invalid.js](examples/treatment.invalid.js) |

## Checklist

- [ ] Todo setter trata a escrita de alguma forma
- [ ] Todo setter tem getter correspondente, declarado antes
- [ ] Nenhum setter assíncrono
- [ ] Nenhum setter mexendo em campo que não é o seu
- [ ] Mudanças com intenção de negócio expostas como método, não setter
- [ ] Setter abaixo de 15 linhas

## Troubleshooting

### O setter precisa validar contra outro campo do objeto

**Causa:** a validação é uma regra entre campos, não sobre um valor.
**Solução:** é método de negócio. O setter valida a forma do valor; a coerência entre
campos é responsabilidade de uma operação nomeada.

### A validação lança e quebra o parsing do atributo

**Causa:** `attributeChangedCallback` recebe qualquer string do HTML, inclusive inválida.
**Solução:** decidir a política e documentá-la: ignorar valor inválido e manter o
anterior, ou refletir um estado de erro via Element Internals. Lançar durante o parsing
derruba a renderização da página inteira.

### O `repaint` no setter causou re-render em cascata

**Causa:** vários setters disparando render em sequência na mesma inicialização.
**Solução:** `retouch` para mudança parcial, e agrupar as atribuições. Ver a skill
`render`.

## Rules relacionadas

- [008 — Proibição de Getters/Setters](../../rules/008_proibicao-getters-setters.md): a regra que esta skill delimita.
- [009 — Diga, Não Pergunte](../../rules/009_diga-nao-pergunte.md): `agendar()` em vez de `setStatus('agendado')`.
- [036 — Restrição de Efeitos Colaterais](../../rules/036_restricao-funcoes-efeitos-colaterais.md): o setter afeta o próprio campo e o render, nada além.
- [028 — Exceção Assíncrona](../../rules/028_tratamento-excecao-assincrona.md): por que setter é sempre síncrono.
- [027 — Erros de Domínio](../../rules/027_qualidade-tratamento-erros-dominio.md): validação que falha lança erro nomeado, não devolve `null`.
- [007 — Máximo de Linhas](../../rules/007_limite-maximo-linhas-classe.md): 15 linhas.

## Skills relacionadas

- [getter](../getter/SKILL.md): complements — o par de leitura, obrigatório.
- [anatomy](../anatomy/SKILL.md): depends on — getter antes do setter, no grupo 2.
- [render](../render/SKILL.md): depends on — `repaint` e `retouch` vêm de lá.
- [state](../state/SKILL.md): complements — quando a escrita deve virar estado em Element Internals.
- [method](../method/SKILL.md): complements — a mudança com intenção de negócio vira método.
- [event](../event/SKILL.md): complements — quando a escrita deve notificar o mundo externo.

---

**Criado em**: 2026-04-01
**Atualizado em**: 2026-08-10
**Versão**: 2.0
