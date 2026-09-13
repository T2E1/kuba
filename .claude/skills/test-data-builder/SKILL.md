---
name: test-data-builder
model: sonnet
effort: medium
description: Constrói markup ou dados de teste de forma fluente e customizável passo a passo, para o cenário específico de um teste — distinto do Object Mother, que devolve instâncias fixas e nomeadas. Use quando cada teste precisa de uma combinação diferente de atributos do mesmo componente, ao substituir uma função com muitos parâmetros booleanos por uma cadeia fluente, ou ao decidir entre instância fixa e construção customizável. Não use quando o mesmo cenário se repete idêntico em vários testes — aí a instância fixa do Object Mother é mais direta.
---

# Test Data Builder

## O que é

Uma classe ou função fluente que monta um cenário de teste passo a passo, com um método
por atributo (`.comValor('ada')`, `.obrigatorio()`, `.desabilitado()`), terminando num
`.montar()` que devolve o markup ou objeto pronto para o Act. Ao contrário do Object
Mother — que devolve sempre a mesma instância fixa e nomeada —, o builder existe
justamente para variar: cada teste pede uma combinação diferente sem inventar uma função
nova por combinação.

## Quando usar

| Situação | Ação |
|---|---|
| Cada teste precisa de uma combinação diferente de atributos | Builder fluente, um método por atributo |
| Função de fixture ganhando parâmetros booleanos (`required`, `disabled`, `value`) | Substituir por builder — a fonte do flag argument (rule 037) |
| O mesmo cenário, sem variação, em vários testes | ❌ Não é aqui — Object Mother é mais direto |
| Builder genérico de qualquer classe do domínio, fora de teste | ❌ Não é aqui — Builder Pattern (GoF), coberto pela skill gof |
| Builder com 10+ métodos e a maioria nunca usada nos testes | Sinal de over-engineering — reduzir aos atributos que os testes realmente variam |

## Como aplicar

1. **Um método por atributo variável**, retornando `this` para permitir encadeamento —
   `.comNome('who')`, `.obrigatorio()`, `.desabilitado()`.
2. **Valor padrão sensato em cada campo**, para que quem só precisa customizar um
   atributo não precise declarar os outros.
3. **Terminar em `.montar()`**, que devolve o markup ou objeto pronto, sem side effect
   antes disso — nada é montado no DOM até o `.montar()` ser chamado.
4. **Nomear os métodos como o atributo real do componente** (`types.d.ts`), não como
   uma abstração paralela — `.obrigatorio()` mapeia para o atributo `required`.
5. **Não adicionar método para atributo que nenhum teste varia.** Um builder com 10
   métodos e 2 usados é especulação (rule 023) — adicionar sob demanda, quando o
   primeiro teste precisar.
6. **Preferir Object Mother quando a variação nunca acontece de fato** — o builder existe
   para o custo da variação, não para parecer sofisticado.

## Exemplos

| Caso | Correto | Incorreto |
|---|---|---|
| Builder fluente vs. função com flags booleanas | [input-builder.valid.js](examples/input-builder.valid.js) | [input-builder.invalid.js](examples/input-builder.invalid.js) |

## Checklist

- [ ] Cada método muda um atributo só, e devolve `this`
- [ ] `.montar()` é o único ponto que produz o resultado final
- [ ] Nenhum parâmetro booleano solto — variação é sempre um método nomeado
- [ ] Todo método existe porque algum teste real o usa
- [ ] O nome do método espelha o atributo real do `types.d.ts`

## Troubleshooting

### O builder tem métodos que nenhum teste chama

**Causa:** métodos adicionados por antecipação, não por necessidade observada (rule 023).
**Solução:** remover; adicionar de volta quando um teste concreto precisar.

### Dois testes fixos usam sempre a mesma combinação idêntica do builder

**Causa:** o cenário parou de variar — virou, na prática, um Object Mother escrito como
builder.
**Solução:** extrair uma função Object Mother para esse caso específico; o builder segue
existindo para o que realmente varia.

## Rules relacionadas

- [037 — Proibição de Argumentos Sinalizadores](../../rules/037_proibicao-argumentos-sinalizadores.md): o builder substitui a função com múltiplos parâmetros booleanos.
- [023 — Proibição de Funcionalidade Especulativa](../../rules/023_proibicao-funcionalidade-especulativa.md): método do builder sem teste que o use é código especulativo.
- [005 — Restrição de Encadeamento](../../rules/005_maximo-uma-chamada-por-linha.md): a fluent interface do builder é a exceção explícita desta rule.
- [033 — Limite de Parâmetros por Função](../../rules/033_limite-parametros-funcao.md): o builder é a alternativa para quando o cenário exigiria mais de 3 parâmetros.

## Skills relacionadas

- [object-mother](../object-mother/SKILL.md): complements — cobre o cenário fixo; este cobre o cenário que varia.
- [aaa](../aaa/SKILL.md): reinforces — o builder encolhe o Arrange a uma cadeia legível.
- [gof](../gof/SKILL.md): complements — o Builder Pattern genérico do GoF é a base; este é a variante específica para dados de teste.
- [enum](../enum/SKILL.md): complements — valores fixos que o builder aceita (estados, tipos) vêm do mesmo enum que o código de produção usa.

---

**Criado em**: 2026-09-13
**Atualizado em**: 2026-09-13
**Versão**: 1.0
