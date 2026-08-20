---
name: bracket
model: sonnet
description: Uso de Symbol para métodos privados e contratos de interface entre mixins e componentes — toda chave de método bracket exportada por `interfaces.js`, mesmo com um único consumidor no próprio módulo, e `Symbol.for()` reservado só para contrato que atravessa pacotes. Use ao definir método privado que um decorator precisa alcançar, ao criar contrato entre mixin e componente, ou ao substituir privacidade por convenção de underscore. Não use para estado privado simples — campo `#` resolve e é mais direto.
---

# Bracket

## O que é

`Symbol` cria chaves únicas que não colidem e não aparecem em enumeração comum. Neste
repositório servem a dois propósitos: método privado que precisa ser alcançável por um
decorator ou mixin, e contrato de interface entre módulos.

A diferença para o campo `#`: privacidade por `#` é absoluta — nem o mixin da cadeia
alcança. Symbol é privacidade por obscuridade controlada: quem tem a referência, acessa.
É exatamente isso que torna o contrato entre mixin e componente possível.

## Quando usar

| Situação | Ferramenta |
|---|---|
| Estado interno que ninguém de fora acessa | Campo `#` — não use Symbol |
| Método por bracket notation acionado por `before`/`around`/`after` | `Symbol()` exportado por `interfaces.js` — mesmo com um único consumidor no próprio módulo |
| Contrato entre mixin e componente | `Symbol()` exportado por `interfaces.js` |
| Contrato que atravessa pacotes | `Symbol.for()` — e só nesse caso |
| Privacidade por `_underscore` | Substituir por `#` ou Symbol |

## Como aplicar

### Escolha do tipo

| Tipo | Sintaxe | Escopo |
|---|---|---|
| Local | `Symbol('render')` | Privado ao módulo; duas chamadas produzem símbolos diferentes |
| Global | `Symbol.for('render')` | Registro global; a mesma string devolve o mesmo símbolo |

Prefira sempre o local. `Symbol.for()` é global de verdade — qualquer código no processo
alcança pela string, o que anula o encapsulamento. Só se justifica quando o contrato
precisa ser compartilhado entre pacotes que não se importam.

### Regras

1. **O módulo dono do conceito define o Symbol.** Se o contrato é do mixin, o Symbol
   nasce no mixin.
2. **Todo Symbol que é chave de método (bracket notation) vai para `interfaces.js`** —
   mesmo quando só o próprio arquivo o consome. O consumidor único não é motivo de
   exceção: é o padrão observado em `mixin/hidden/interfaces.js` (`cleanup`, `hideable`,
   ambos usados só dentro de `hidden.ts`) e `form/input/interfaces.js` (`dispatch`, entre
   outros). Reserva-se a declaração local, fora de `interfaces.js`, para o caso raro de um
   Symbol que nunca é chave de método — uma chave de cache interna, por exemplo.
3. **Sempre com descrição.** `Symbol()` sem string vira `Symbol()` no stack trace, e
   depurar fica cego.
4. **Nome revela intenção** (rule 006).

### Nomenclatura

| Tipo | Convenção | Exemplo |
|---|---|---|
| Callback de ciclo de vida | `verbCallback` | `didPaintCallback` |
| Ação | `verbNoun` | `connectArc` |
| Capacidade | `adjetivo` | `hideable` |
| Recurso | `substantivo` | `controller` |

## Exemplos

| Caso | Correto | Incorreto |
|---|---|---|
| Privacidade real vs. convenção de underscore | [private-method.valid.js](examples/private-method.valid.js) | [private-method.invalid.js](examples/private-method.invalid.js) |
| Contrato entre mixin e componente via Symbol exportado | [contract.valid.js](examples/contract.valid.js) | [contract.invalid.js](examples/contract.invalid.js) |

## Checklist

- [ ] Nenhum membro privado por `_underscore`
- [ ] Todo Symbol tem descrição
- [ ] `Symbol.for()` usado apenas onde há necessidade real cross-pacote
- [ ] Todo Symbol usado como chave de método bracket exportado por `interfaces.js`, mesmo com um único consumidor
- [ ] Campo `#` usado onde Symbol não era necessário

## Troubleshooting

### O mixin não alcança o método do componente

**Causa:** o método é campo `#`, privacidade absoluta que nem a cadeia de mixins
atravessa.
**Solução:** é o caso de Symbol — o mixin importa o contrato de `interfaces.js` e acessa
por ele.

### Dois módulos criaram o mesmo Symbol e não se reconhecem

**Causa:** `Symbol('x')` chamado duas vezes produz dois símbolos distintos. Igualdade de
Symbol é por identidade, não por descrição.
**Solução:** um módulo define e exporta; o outro importa. `Symbol.for()` só se importar
for genuinamente impossível.

### O stack trace mostra `Symbol()` sem indicação

**Causa:** Symbol criado sem descrição.
**Solução:** `Symbol('render')`. A descrição existe para o momento de depurar.

## Rules relacionadas

- [008 — Proibição de Getters/Setters](../../rules/008_proibicao-getters-setters.md): Symbol dá encapsulamento real em vez de expor o interno por acessor.
- [013 — Segregação de Interfaces](../../rules/013_principio-segregacao-interfaces.md): cada Symbol é um contrato granular, exportado só quando público.
- [010 — Responsabilidade Única](../../rules/010_principio-responsabilidade-unica.md): um Symbol representa um contrato, não vários.
- [006 — Proibição de Nomes Abreviados](../../rules/006_proibicao-nomes-abreviados.md): a descrição do Symbol é o que aparece ao depurar.
- [035 — Proibição de Nomes Enganosos](../../rules/035_proibicao-nomes-enganosos.md): `_método` promete privacidade que não existe.

## Skills relacionadas

- [anatomy](../anatomy/SKILL.md): depends on — onde o método por Symbol fica na classe.
- [mixin](../mixin/SKILL.md): depends on — o contrato entre mixin e componente é a razão principal do Symbol aqui.
- [revelation](../revelation/SKILL.md): complements — decide o que `interfaces.js` exporta.
- [method](../method/SKILL.md): complements — a forma do método, independente da chave.

---

**Criado em**: 2026-04-01
**Atualizado em**: 2026-08-10
**Versão**: 2.0
