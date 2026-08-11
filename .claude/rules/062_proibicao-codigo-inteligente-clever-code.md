# Proibição de Código Inteligente (Clever Code)

**ID**: AP-04-062
**Severity**: 🟡 Medium
**Category**: Behavioral

---

## What it is

Clever Code ocorre quando um desenvolvedor escreve código excessivamente conciso, usando truques não-óbvios, operadores complexos ou padrões de código não convencionais para mostrar "habilidade" em vez de priorizar clareza. Código que faz o desenvolvedor se sentir inteligente ao escrever (e outros se sentirem confusos ao ler).

## Why it matters

- Dificuldade de manutenção: outros desenvolvedores não entendem o código sem gastar muito tempo
- Esconde bugs: código complexo tem mais casos extremos e é mais difícil raciocinar sobre
- Frustra time: cria cultura de "esperteza de código" sobre clareza de código
- Dificuldade de onboarding: novos desenvolvedores levam muito mais tempo para serem produtivos
- Comum em code reviews: "isso funciona mas não consigo entender"

## Objective Criteria

- [ ] Comentários de code review perguntando "o que isso faz?" ou "pode ser mais claro?"
- [ ] Uso de one-liners complexos: encadeamento de ternários, arrow functions com múltiplas operações
- [ ] Operadores de bit-shifting, manipulações bitwise ou outros recursos avançados da linguagem sem comentários explicativos
- [ ] Regex complexo ou parsing de string embutido no código principal
- [ ] Funções com nomes curtos não-explicativos (`fn()`, `go()`, `proc()`) fazendo lógica complexa

## Allowed Exceptions

- **Algoritmos Canônicos**: Implementação conhecida — CRC32, MD5 — cujo propósito o nome da função entrega.
- **Funções Minúsculas**: Função intencionalmente minúscula onde o contexto torna o significado óbvio.
- **Hotspots Perfilados**: Caminho identificado por profiling, com comentário justificando a otimização.
- **Domínio Especializado**: Cripto, gráficos ou programação de sistemas, onde a operação é padrão da área.

## How to Detect

### Manual

- Code review: regras explícitas para rejeitar código "esperto" sobre código "claro"
- Buscar one-liners com > 3 operações nas mesmas linhas
- Identificar código que desenvolvedor gasta 5 minutos lendo sem ser o autor

### Automatic

- Biome: `complexity/noExcessiveCognitiveComplexity` (nested ternaries/arrow functions complexas elevam a complexidade)
- Biome (formatter): aplica estilo consistente, reduzindo variações "espertas" de formatação

## Related to

- [022 - Simplicity and Clarity (KISS)](022_priorizacao-simplicidade-clareza.md): reinforces
- [034 - Consistent Class and Method Names](034_nomes-classes-metodos-consistentes.md): reinforces
- [001 - Single-Level Indentation Rule](001_nivel-unico-indentacao.md): reinforces
- [069 - Prohibition of Premature Optimization](069_proibicao-otimizacao-prematura.md): reinforces

---

**Created on**: 2026-03-28
**Updated on**: 2026-08-10
**Version**: 1.2
