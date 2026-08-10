# Middle Man

**Severidade:** 🟡 Média
**Regra Associada:** Regra 061

## O Que É

Classe que delega a maioria dos seus métodos para outra classe sem adicionar valor próprio. Se 50%+ dos métodos de uma classe apenas repassam chamadas (`return this.obj.method(args)`) para outro objeto, é um Middle Man inútil. Inverso do Feature Envy.

## Sintomas

- 50%+ dos métodos da classe são delegates de uma linha sem adicionar valor
- Classe existe apenas para esconder outro objeto inicialmente exposto diretamente
- Sempre que um método é adicionado ao objeto real, o mesmo wrapper é adicionado ao Middle Man
- Stack trace sempre mostra os mesmos nomes de método em duas camadas consecutivas
- Middle Man não é usado/testado isoladamente — sempre precisa do objeto real funcionando

## ❌ Exemplo (violação)

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

## ✅ Refatoração

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

## Codetag Sugerido

```typescript
// FIXME: Middle Man — Manager apenas delega 5/6 métodos para Department
// TODO: Remove Middle Man — expor Department diretamente ou adicionar lógica real ao Manager
```
