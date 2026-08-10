# ICP Formula + Components Table

## Fórmula

```
ICP = CC_base + Aninhamento + Responsabilidades + Acoplamento
```

## Tabelas de Pontuação Rápida

### CC_base (Complexidade Ciclomática)

| CC | ICP CC_base | Categoria |
|----|-------------|-----------|
| ≤ 5 | 1 | Simples |
| 6–10 | 2 | Moderado |
| 11–15 | 3 | Complexo |
| 16–20 | 4 | Muito Complexo |
| > 20 | 5 | Crítico |

**Pontos de decisão:** `if`, `else if`, `for`, `while`, `do-while`, `case`, `&&`, `||`, `catch`, `?` (ternário)

**Cálculo:** CC = (número de pontos de decisão) + 1

---

### Aninhamento

| Profundidade máxima | Pontos |
|---------------------|--------|
| 1 nível | 0 |
| 2 níveis | 1 |
| 3 níveis | 2 |
| 4+ níveis | 3 |

**Cálculo:** Contar a profundidade máxima de blocos aninhados (if, for, while, try).

---

### Responsabilidades

| Responsabilidades distintas | Pontos |
|-----------------------------|--------|
| 1 | 0 |
| 2–3 | 1 |
| 4–5 | 2 |
| 6+ | 3 |

**8 Dimensões de Responsabilidade:**
1. Validação de dados
2. Transformação de dados
3. Persistência (INSERT, UPDATE, DELETE)
4. Consulta (SELECT, GET)
5. Lógica de negócio
6. Formatação / Apresentação
7. Logging / Auditoria
8. Tratamento de erros

**Cálculo:** Contar quantas dimensões aparecem no método.

---

### Acoplamento

| Dependências externas | Pontos |
|-----------------------|--------|
| 0–2 | 0 |
| 3–5 | 1 |
| 6+ | 2 |

**Contam como dependências:**
- Instâncias de classes externas (userRepository, emailService)
- Módulos importados utilizados (bcrypt, logger, dayjs)
- Variáveis globais ou de escopo externo acessadas
- Funções externas chamadas diretamente

**Não contam:**
- Parâmetros recebidos (já são dependências explícitas)
- Literais e constantes locais
- Funções do próprio módulo/classe
- Dependências injetadas via `this.*` (já estão no construtor)

**Cálculo:** Contar colaboradores externos distintos referenciados no corpo da função.

---

## Limites de ICP

| ICP | Status | Ação |
|-----|--------|------|
| ≤ 3 | 🟢 Excelente | Manter |
| 4–6 | 🟡 Aceitável | Considerar refatoração |
| 7–10 | 🟠 Preocupante | Refatorar antes de nova feature |
| > 10 | 🔴 Crítico | Refatoração obrigatória |
