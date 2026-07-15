# Proibição de Mutação Acidental

**ID**: AP-07-052
**Severity**: 🟠 High
**Category**: Behavioral

---

## What it is

Mutação acidental ocorre quando objetos ou estruturas de dados são modificados inadvertidamente, geralmente através de passagem por referência ou efeitos colaterais não documentados. O estado original é alterado sem intenção explícita do desenvolvedor, causando bugs difíceis de rastrear.

## Why it matters

- Bugs imprevisíveis: estado mutado silenciosamente falha testes e produz comportamento incorreto
- Rastreamento difícil: o local onde a mutação ocorre pode estar distante de onde o erro é detectado
- Comportamento não-idempotente: mesmo código pode ter resultados diferentes dependendo do estado anterior
- Baixa confiança no código: desenvolvedores hesitam em reutilizar funções devido a efeitos colaterais ocultos

## Objective Criteria

- [ ] Funções modificam parâmetros recebidos sem documentação explícita
- [ ] Objetos são retornados de funções após modificação de propriedades
- [ ] Arrays são modificados via `push()`, `splice()`, `pop()` sem criar cópia
- [ ] Estruturas de dados compartilhadas são mutadas de múltiplos locais
- [ ] Variáveis locais têm seu valor reatribuído sem razão clara
- [ ] Mudanças em objetos se propagam para outros componentes não relacionados

## Allowed Exceptions

- Métodos explicitamente identificados como mutadores (ex.: `save()`, `update()`)
- Objetos temporários construídos e usados exclusivamente dentro do mesmo escopo
- Implementações de mutadores obrigatórias em interfaces/frameworks que não suportam imutabilidade
- Código legado com mutação documentada e testes que garantem o comportamento esperado

## How to Detect

### Manual

- Procurar por `push()`, `pop()`, `splice()`, `unshift()` em arrays transitórios
- Identificar funções que retornam o mesmo objeto recebido como parâmetro
- Buscar reatribuições de parâmetros
- Verificar objetos compartilhados entre múltiplos módulos

### Automatic

- Biome: `style/noParameterAssign`, `correctness/noConstAssign`
- Rigor de tipos: usar `Readonly<T>`, `as const`, `readonly`
- Bibliotecas: Immer, Immutable.js para detectar mutações
- Testes de snapshot: capturar estado antes/depois para detectar mudanças inesperadas

## Related to

- [029 - Object Immutability (freeze)](029_imutabilidade-objetos-freeze.md): reinforces
- [036 - Side-Effect Function Restrictions](036_restricao-funcoes-efeitos-colaterais.md): reinforces
- [009 - Tell, Don't Ask](009_diga-nao-pergunte.md): complements
- [039 - Boy Scout Rule (Continuous Refactoring)](039_regra-escoteiro-refatoracao-continua.md): reinforces
- [070 - Prohibition of Shared Mutable State](070_proibicao-estado-mutavel-compartilhado.md): complements

---

**Created on**: 2026-03-28
**Updated on**: 2026-07-15
**Version**: 1.1
