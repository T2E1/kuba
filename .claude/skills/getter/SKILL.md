---
name: getter
model: sonnet
description: Quando um getter se justifica apesar da rule 008 — valor padrão via `??=`, transformação ou formatação na leitura, inicialização preguiçosa de recurso caro, e leitura derivada de um único campo privado. Use ao criar getter que precisa tratar a leitura de um campo `#`, ao revisar getter que apenas devolve o campo sem lógica, ou ao decidir entre getter e método de intenção. Não use para expor estado interno sem tratamento — isso é o getter puro que a rule 008 proíbe.
---

# Getter

## O que é

A rule 008 proíbe getters puros — os que apenas devolvem o campo. Esta skill define a
fronteira: **um getter se justifica quando trata a leitura**. Sem tratamento, ele é um
campo público disfarçado, e o objeto vira estrutura de dados.

## Quando usar

| Situação | Veredito |
|---|---|
| Valor padrão quando o campo é nulo | ✅ Getter com `??=` |
| Formatação ou transformação na leitura | ✅ Getter |
| Recurso caro criado só no primeiro acesso | ✅ Getter preguiçoso |
| Valor derivado de um campo (`isValid`, `displayName`) | ✅ Getter |
| Apenas `return this.#campo` | ❌ Rule 008 — remover ou virar método de intenção |
| O cliente lê para decidir o que fazer | ❌ Rule 009 — o objeto deve decidir |

O teste: se remover o getter e expor o campo direto não mudaria nada para quem chama,
o getter não estava fazendo nada.

## Como aplicar

### Padrões que se justificam

| Padrão | Uso |
|---|---|
| Null coalescing | `??=` atribui o padrão na primeira leitura |
| Transformação | Formata ou normaliza antes de devolver |
| Inicialização preguiçosa | Cria a instância cara só quando acessada |
| Derivação | Calcula a partir de um campo, sem armazenar |

### Regras

1. **Um getter, um campo privado.** Getter que combina vários campos é lógica de negócio
   disfarçada — vira método (rule 010).
2. **O campo é só declarado.** `#nome` sem inicializador — o valor padrão mora no `??=`
   do getter, nunca em `#nome = valorPadrao`. Duas fontes para o mesmo default divergem
   cedo ou tarde.
3. **Default de um `attribute` validado por enum vem do próprio enum**, nunca da string
   solta — `this.#color ??= COLORS.PRIMARY`, não `this.#color ??= 'primary'`. Repetir o
   literal em dois lugares (o enum e o `??=`) é a mesma duplicação que a skill `enum`
   já proíbe, só que dentro da própria classe.
4. **Sem efeito colateral.** Getter que dispara evento ou muda outro estado viola CQS
   (rule 038). A exceção é a inicialização preguiçosa, que é cache, não regra de negócio.
5. **Sem operação cara.** Leitura tem de parecer leitura. Se custa, é método.
6. **Até 15 linhas** (rule 007). Acima disso, extrair.
7. **Nome corresponde ao campo**, exceto quando o valor é derivado — `displayName` para
   `#name` é legítimo, porque o nome anuncia a transformação.

## Exemplos

| Caso | Correto | Incorreto |
|---|---|---|
| Getter que trata a leitura vs. getter puro | [treatment.valid.js](examples/treatment.valid.js) | [treatment.invalid.js](examples/treatment.invalid.js) |

## Checklist

- [ ] Todo getter trata a leitura de alguma forma
- [ ] Nenhum getter lê mais de um campo privado
- [ ] Nenhum getter dispara evento ou muda estado alheio
- [ ] Nenhuma operação cara escondida atrás de leitura
- [ ] Getter abaixo de 15 linhas
- [ ] Nenhum getter existindo só para o cliente decidir por fora (rule 009)

## Troubleshooting

### Preciso do valor cru em outro lugar do código

**Causa:** o getter transforma, e algum ponto precisa do original.
**Solução:** se dois pontos precisam de representações diferentes, são dois conceitos.
Nomeie os dois (`rawValue` e `displayValue`) ou reveja se o objeto não deveria decidir
por si (rule 009).

### O getter preguiçoso é chamado antes da hora e cria o recurso cedo demais

**Causa:** algum ponto lê a propriedade só para checar existência.
**Solução:** expor um predicado (`hasController`) para a checagem, mantendo o getter para
o uso real.

### O linter reclama de getter puro que parece necessário

**Causa:** provavelmente é mesmo — o consumidor precisa do dado, mas não da decisão.
**Solução:** se é DTO ou Value Object, a rule 008 tem exceção explícita. Se é entidade
com comportamento, o cliente deveria estar dizendo, não perguntando.

## Rules relacionadas

- [008 — Proibição de Getters/Setters](../../rules/008_proibicao-getters-setters.md): a regra que esta skill delimita — getter com tratamento é a exceção legítima.
- [009 — Diga, Não Pergunte](../../rules/009_diga-nao-pergunte.md): getter que existe para o cliente decidir por fora é o sintoma que a regra combate.
- [038 — Separação Command-Query](../../rules/038_conformidade-principio-inversao-consulta.md): leitura não altera estado observável.
- [010 — Responsabilidade Única](../../rules/010_principio-responsabilidade-unica.md): um getter, um campo.
- [007 — Máximo de Linhas](../../rules/007_limite-maximo-linhas-classe.md): 15 linhas.

## Skills relacionadas

- [setter](../setter/SKILL.md): complements — o par de escrita, com as mesmas condições.
- [anatomy](../anatomy/SKILL.md): depends on — getters formam o grupo 2, com o setter adjacente.
- [calisthenics](../calisthenics/SKILL.md): reinforces — a regra 8 é a origem desta convenção.
- [method](../method/SKILL.md): complements — o que não cabe em getter vira método de intenção.
- [constructor](../constructor/SKILL.md): complements — `internals` por getter preguiçoso é o caso canônico aqui.
- [enum](../enum/SKILL.md): complements — o default de um `attribute` validado por enum vem do enum, não de string solta.

---

**Criado em**: 2026-04-01
**Atualizado em**: 2026-08-20
**Versão**: 2.2
