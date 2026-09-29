---
title: "Middle Man"
category: "Code Smells"
type: reference
id: "STRUCTURAL-035"
severity: "🟡 Medium"
tags: [code-smells]
---

# Middle Man

## Explanation

### O que é

Middle Man ocorre quando uma classe delega a maioria de seus métodos para outra classe sem adicionar seu próprio valor. Se 50%+ dos métodos de uma classe apenas repassam chamadas (linha única `return this.obj.method(args)`), é um Middle Man inútil. É o inverso de Feature Envy: aqui, o middle man delega tudo; lá, o método faz o trabalho de outro objeto.

### Por que importa

- Complexidade desnecessária: mais arquivos, mais imports, mais nomes para aprender
- Manutenção duplicada: cada mudança na interface real requer mudança no Middle Man
- Debug mais lento: stack trace com camadas desnecessárias e confusão sobre onde está a lógica real
- Acoplamento indireto: se remover objeto real, middle man perde existência sem valor
- Indica over-engineering ou refatoração incompleta: classe foi útil uma vez mas perdeu propósito

## How-to

### Exemplo

```javascript
// ❌ Manager que apenas repassa tudo para Department
class Manager {
  constructor(department) { this.department = department; }
  getEmployees() { return this.department.getEmployees(); }
  addEmployee(e) { return this.department.addEmployee(e); }
  removeEmployee(e) { return this.department.removeEmployee(e); }
  getBudget() { return this.department.getBudget(); }
}
```

```javascript
// ✅ Usar Department diretamente — Manager não adiciona valor (Remove Middle Man)
const employees = department.getEmployees();

// Se Manager tiver lógica própria além de delegar, então faz sentido:
class Manager {
  approve(request) {
    // lógica real de aprovação — adiciona valor
    if (request.amount > this.approvalLimit) throw new Error('Acima do limite');
    return this.department.processRequest(request);
  }
}
```

```typescript
// FIXME: Middle Man — Manager apenas delega 5/6 métodos para Department
// TODO: Remove Middle Man — expor Department diretamente ou adicionar lógica real ao Manager
```

## Reference

### Critérios Objetivos

- [ ] 50%+ dos métodos da classe são delegates de uma linha sem adicionar valor
- [ ] Classe existe apenas para esconder outro objeto exposto diretamente inicialmente
- [ ] Sempre que adicionar método ao objeto real, adiciona mesma wrapper ao Middle Man
- [ ] Stack trace sempre mostra mesmos nomes de método em duas camadas consecutivas
- [ ] Middle Man não é usado/testado isoladamente — sempre precisa do objeto real funcionando

### Exceções Permitidas

- **[Facade](../skills/gof/references/facade.md)**: Quando a simplificação de uma interface complexa é o valor entregue.
- **[Proxy](../skills/gof/references/proxy.md) Transversal**: Preocupação transversal — log, cache, autenticação — aplicada na passagem.
- **[Adapter](../skills/gof/references/adapter.md)**: Conversão entre formatos de interface incompatíveis.
- **[DTOs](../skills/poeaa/references/data-transfer-object.md) e ViewModels**: Transformação de entidade para a camada de apresentação.

### Como Detectar

#### Manual

- Ler classe: identificar métodos que apenas fazem `return this.obj.method(args)` sem modificação
- Buscar classes onde adicionar método sempre requer adicionar mesmo delegate em outra classe
- Verificar testes: testes do middle man apenas testam que ele repassa corretamente, não lógica própria

#### Automático

- Sem regra nativa de Biome para detectar padrão de delegação pura — detecção via revisão de código

## Related to

- [Simplicity and Clarity (KISS)](../skills/clean-code/references/priorizacao-simplicidade-clareza.md): reinforces
- [029 — Feature Envy](029_feature-envy.md): complements
- [Getters/Setters](../skills/calisthenics/references/getters-setters.md): reinforces
- [Open/Closed Principle (OCP)](../skills/solid/SKILL.md): complements
- [015 — Poltergeists](015_poltergeists.md): complements
