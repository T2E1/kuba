# Proibição de Código Spaghetti

**ID**: AP-03-060
**Severity**: 🔴 Critical
**Category**: Structural

---

## What it is

Spaghetti Code ocorre quando o fluxo de controle do código é complexo e entrelaçado como um prato de espaguete. Múltiplos branches, loops profundamente aninhados, `goto`s (ou equivalentes) e lógica de controle entrelaçada. É difícil seguir o fluxo de execução do início ao fim.

## Why it matters

- Impossível entender: desenvolvedores não conseguem rastrear o fluxo lógico
- Bugs ocultos: fluxo de controle complexo esconde casos extremos e condições não testadas
- Difícil testar: cobertura de branches se torna pesadelo; existem centenas de caminhos
- Difícil manter: mudanças quebram caminhos não-óbvios; efeitos colaterais desconhecidos
- Difícil refatorar: qualquer mudança pode quebrar fluxo entrelaçado
- Custo de onboarding muito alto: novos desenvolvedores levam meses para entender efetivamente o código

## Objective Criteria

- [ ] Mais de 3 níveis de indentação aninhada (if dentro de if dentro de if)
- [ ] Branches que saltam arbitrariamente para partes diferentes do código (equivalentes a goto)
- [ ] Funções com mutação inesperada de estado externo (variáveis globais, estado mutável compartilhado)
- [ ] Fluxo de controle que depende de variáveis mutadas em múltiplos locais distantes
- [ ] Múltiplos pontos de entrada/saída na mesma função (returns antecipados em todo lugar, loops com break/continue misturados)
- [ ] Complexidade ciclomática > 15 na mesma função

## Allowed Exceptions

- Máquinas de estado implementadas com switch/case bem documentado
- Código orientado a eventos com dispatcher único e múltiplos handlers (padrão mais limpo que goto)
- Parsers de protocolo ou código de rede necessariamente complexo por especificação externa
- Código legado onde refatoração imediata traria risco inaceitável

## How to Detect

### Manual

- Ler código: se você visualiza fluxo como grafo com arestas cruzando por todo lado, é spaghetti
- Buscar variáveis mutadas em múltiplos locais sem localidade clara
- Identificar funções onde há múltiplos `if/else` encadeados com branches aninhados

### Automatic

- Biome: `complexity/noExcessiveCognitiveComplexity` (sinaliza complexidade > limite configurado)
- Sem regra nativa de Biome para uso de variável global/mutabilidade compartilhada — detecção via revisão de código

## Related to

- [001 - Single-Level Indentation Rule](001_nivel-unico-indentacao.md): reinforces
- [055 - Maximum Lines per Method](055_limite-maximo-linhas-metodo.md): reinforces
- [036 - Side-Effect Function Restrictions](036_restricao-funcoes-efeitos-colaterais.md): reinforces
- [066 - Prohibition of Pyramid of Doom](066_proibicao-piramide-do-destino.md): complements
- [037 - Prohibition of Flag Arguments](037_proibicao-argumentos-sinalizadores.md): reinforces

---

**Created on**: 2026-03-28
**Updated on**: 2026-07-15
**Version**: 1.1
