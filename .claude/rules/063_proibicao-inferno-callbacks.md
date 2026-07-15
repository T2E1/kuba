# Proibição do Inferno de Callbacks

**ID**: AP-05-063
**Severity**: 🟠 High
**Category**: Behavioral

---

## What it is

Callback Hell ocorre quando código assíncrono é escrito usando aninhamento profundo de callbacks, criando fluxo de controle difícil de seguir. Múltiplos callbacks aninhados criam código em forma de seta com indentação progredindo para a direita, tornando o código quase impossível de ler e manter.

## Why it matters

- Dificuldade de leitura: desenvolvedores perdem o rastro dos níveis; não sabem em qual callback estão
- Difícil debugar erros: tratamento de erros espalhado por múltiplos níveis
- Dificuldade de teste: testar cada callback isoladamente é impossível
- Erros comuns: esquecer de chamar próximo callback, tratamento de erro adequado ou retorno antecipado
- Problema específico de linguagens/paradigmas sem async/await ou promises

## Objective Criteria

- [ ] Mais de 3 níveis de aninhamento de callbacks
- [ ] Funções de callback definidas inline em vez de funções nomeadas
- [ ] Tratamento de erro repetido em cada nível de callback (try/catch dentro de cada callback)
- [ ] Padrão de `}) })` no final do arquivo — marcadores de callback hell
- [ ] Variáveis capturadas em closures de múltiplos níveis, criando estado difícil de raciocinar

## Allowed Exceptions

- Código legado onde linguagem/runtimes não suportam promises ou async/await
- APIs externas que exigem estritamente padrão de callback sem alternativa
- Aninhamento de callback de nível único com lógica simples (apenas uma operação assíncrona)

## How to Detect

### Manual

- Varredura visual: procurar código com indentação derivando para direita em callbacks multi-nível
- Identificar funções passando callbacks que por sua vez passam callbacks
- Verificar stack traces ao debugar: stack frames profundamente aninhados com funções de callback

### Automatic

- Biome: `complexity/noExcessiveCognitiveComplexity` (aninhamento profundo eleva a complexidade cognitiva)

## Related to

- [001 - Single-Level Indentation Rule](001_nivel-unico-indentacao.md): reinforces
- [028 - Async Exception Handling](028_tratamento-excecao-assincrona.md): reinforces
- [060 - Prohibition of Spaghetti Code](060_proibicao-codigo-spaghetti.md): reinforces
- [027 - Domain Error Handling Quality](027_qualidade-tratamento-erros-dominio.md): reinforces
- [022 - Simplicity and Clarity (KISS)](022_priorizacao-simplicidade-clareza.md): reinforces

---

**Created on**: 2026-03-28
**Updated on**: 2026-07-15
**Version**: 1.1
