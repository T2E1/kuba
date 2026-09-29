---
title: "The Blob (God Object)"
category: "Anti-Patterns"
type: reference
id: "STRUCTURAL-001"
severity: "🔴 Critical"
tags: [anti-patterns]
---

# The Blob (God Object)

## Explanation

### O que é

Proíbe a criação de classes que concentram a maior parte da lógica e dados do sistema, resultando em um **Objeto Deus** (The Blob) que outras classes pequenas apenas orbitam e acessam.

*(O anti-pattern [022 — Large Class](022_classe-grande.md) é o estágio inicial de um Blob: Large Class viola [SRP](../skills/solid/SKILL.md) por ter responsabilidades demais; The Blob adiciona o domínio de dados centralizados que outras classes apenas orbitam.)*

### Por que importa

- Viola o SRP de forma severa, concentrando lógica e dados em um único lugar
- Resulta na pior forma de acoplamento e baixa coesão do sistema
- Torna a classe praticamente impossível de testar isoladamente
- Deixa o sistema extremamente frágil a qualquer mudança na classe

## How-to

### Como aplicar

- Identificar classes que estão em constante modificação por vários *feature requests* diferentes
- Extrair responsabilidades por razão-para-mudar (não por contagem de linhas): dividir por tamanho tende a produzir [035 — Middle Man](035_middle-man.md) ou [015 — Poltergeists](015_poltergeists.md) no lugar do Blob

### Exemplo

```javascript
// ❌ Uma classe gerenciando usuário, autenticação, email e relatório
class App {
  createUser(data) { ... }
  login(email, password) { ... }
  sendWelcomeEmail(user) { ... }
  generateReport(filters) { ... }
  exportToPDF(report) { ... }
  validateCreditCard(card) { ... }
}
```

```javascript
// ✅ Cada classe com uma única responsabilidade
class UserRepository { createUser(data) { ... } }
class AuthService { login(email, password) { ... } }
class EmailService { sendWelcomeEmail(user) { ... } }
class ReportService { generateReport(filters) { ... } }
```

Codetag sugerido para dívida não resolvida agora:

```typescript
// FIXME: The Blob — classe App tem 8+ responsabilidades distintas
// TODO: Extrair UserRepository, AuthService, EmailService, ReportService
```

## Reference

### Critérios Objetivos

- [ ] Uma classe não deve conter mais de **10** métodos públicos (excluindo *getters* e *setters* permitidos).
- [ ] O número de dependências (imports) de classes concretas em uma única classe não deve exceder **5**.
- [ ] Se a classe violar os limites de `STRUCTURAL-007` (50 linhas) e `BEHAVIORAL-010` (7 métodos) deve ser classificada como um *Blob* e refatorada.

### Exceções Permitidas

- **Encapsulamento de Legado**: Grandes classes podem ser aceitas ao encapsular um sistema legado não-OO para acessá-lo a partir do sistema OO.

### Como Detectar

#### Manual

- Identificar classes que estão em constante modificação por vários *feature requests* diferentes

#### Automático

- Sem regra nativa de Biome para LCOM/WMC — avaliar via revisão de arquitetura (número de métodos públicos e dependências concretas)

## Related to

- [Single Responsibility Principle (SRP)](../skills/solid/SKILL.md): supersedes
- [Maximum Lines per Class File](../skills/calisthenics/references/limite-maximo-linhas-classe.md): reinforces
- [Boy Scout Rule (Continuous Refactoring)](../skills/clean-code/references/regra-escoteiro-refatoracao-continua.md): complements
- [004 — Zombie Code (Lava Flow)](004_codigo-zombie-lava-flow.md): reinforces
- [036 — Divergent Change](036_mudanca-divergente.md): reinforces
- [022 — Large Class](022_classe-grande.md): reinforces — estágio anterior, ainda sem domínio de dados centralizados
- [035 — Middle Man](035_middle-man.md): contrasts — decomposição malfeita do Blob produz este smell no lugar da responsabilidade correta
- [Maintainability — Manutenibilidade](../skills/quality/references/maintainability.md): reinforces — o atributo de qualidade McCall mais degradado por um Blob

## Fonte

*AntiPatterns: Refactoring Software, Architectures, and Projects in Crisis* (Brown, Malveau, McCormick, Mowbray, 1998).
