# Aplicação do CDD em Code Review

## O Processo de 3 Passos

### Passo 1 — Varredura Rápida (2–5 minutos)

**Objetivo:** Identificar problemas óbvios sem análise profunda.

**Checklist:**
- [ ] Arquivos ou funções com > 20–30 linhas
- [ ] Estruturas com 3+ níveis de aninhamento visíveis
- [ ] Anti-patterns conhecidos: The Blob, Pyramid of Doom, Callback Hell
- [ ] Violações óbvias de rules críticas: nomes enganosos, `eval`, imports relativos `../`

**Output:** Lista de arquivos e funções que precisam de análise profunda.

---

### Passo 2 — Análise Profunda (10–20 minutos)

**Objetivo:** Calcular ICP dos métodos candidatos e verificar conformidade com rules.

#### Calcular ICP

Para cada método identificado na varredura:

1. Contar pontos de decisão (`if`, `for`, `&&`, `catch`, `?`) → CC → CC_base
2. Identificar profundidade máxima de aninhamento → Pontos de Aninhamento
3. Identificar as 8 dimensões de responsabilidade presentes → Pontos de Responsabilidades
4. Contar dependências externas distintas → Pontos de Acoplamento
5. Somar: `ICP = CC_base + Aninhamento + Responsabilidades + Acoplamento`

#### Verificar Rules

**Estruturais (sempre verificar):**
- Nomes revelam intenção?
- Ausência de constantes mágicas?
- Imports usando path aliases?

**Comportamentais (verificar em código de domínio):**
- Funções são puras ou claramente Commands?
- Queries não alteram estado?
- Promises todas tratadas?

**Críticas (bloqueadoras):**
- Ausência de `eval`?
- Exceções de domínio em vez de `return null`?
- Cobertura de testes ≥ 85% no domínio?

**Output:** Comentários objetivos no PR com ICP calculado e rule violada.

---

### Passo 3 — Calibração Contextual (5 minutos)

**Objetivo:** Decidir a ação com base no contexto real — não apenas nas métricas.

#### Fatores de Calibração

| Fator | ICP Alto Pode Ser Aceito Se... |
|---|---|
| **Tipo de PR** | Hotfix crítico em produção instável |
| **Frequência de mudança** | Código raramente modificado (ex.: parsers legados) |
| **Complexidade inerente** | Domínio de negócio genuinamente complexo |
| **Dívida registrada** | Equipe já sabe e tem refatoração agendada |
| **Cobertura de testes** | ICP = 7 mas cobertura = 95% — risco mitigado |

#### Escala de Ação

| ICP | Contexto | Ação |
|-----|----------|------|
| ≤ 5 | Qualquer | ✅ Aprovar |
| 6–7 | Feature normal | 🔄 Pedir refatoração antes do merge |
| 6–7 | Hotfix crítico | ✅ Aprovar + registrar dívida técnica |
| 8–10 | Qualquer | 🔄 Pedir refatoração — ICP preocupante |
| > 10 | Qualquer | 🚫 Bloquear — refatoração obrigatória |

---

## Exemplos de Comentários CDD em PRs

### Comentário Objetivo (❌ → ✅)

```markdown
❌ "Esse código está muito complexo e difícil de entender."

✅ "Este método tem ICP = 8 (CC=3, Aninhamento=3, Responsabilidades=1, Acoplamento=1).
   O aninhamento de 4 níveis (if > if > for > if) excede o limite de 3.
   Sugestão: aplicar Guard Clauses para linearizar o fluxo."
```

### Comentário de Aprovação com Ressalva

```markdown
"ICP = 6 — acima do ideal (5), mas aceitável dado o contexto de hotfix.
 Por favor, crie uma issue para refatorar `processPayment()` na próxima sprint."
```

### Comentário de Rule Violation

```markdown
"Violação de Rule 027 (Qualidade do Tratamento de Erros):
 A linha 42 retorna `null` em vez de lançar `OrderNotFoundError`.
 Clientes precisarão verificar null em todos os pontos de uso — spread de complexidade."
```

---

## Anti-Padrões de Code Review

### Bloquear Sem Alternativa

❌ "Refatore isso." (sem sugestão de como)
✅ "ICP = 9. Extraia `validateCheckoutData()` e `buildOrderFromCart()` para reduzir para ICP ≤ 5."

### Focar em Estilo, Ignorar Substância

❌ Comentar apenas sobre formatação e nomes sem calcular ICP em código complexo
✅ Calcular ICP em qualquer método com > 10 linhas ou aninhamento visível

### Calibração Inflexível

❌ Reprovar todo PR com ICP > 5, independente do contexto
✅ Aplicar o Passo 3 (calibração) antes de bloquear
