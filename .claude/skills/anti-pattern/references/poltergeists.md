# Poltergeists

**Severidade:** 🟡 Média
**Regra Associada:** Regra 065

## O Que É

Classes com papel efêmero e transitório: existem apenas para passar dados entre outras classes ou inicializar algo, sem estado real ou comportamento significativo. Desaparecem logo após cumprir seu papel mínimo, como um poltergeist. Middle Men de vida curta.

## Sintomas

- Classes/serviços criados apenas para adaptar parâmetros ou formatar chamadas e descartados
- Classes com um único método público, geralmente chamado `execute()`, `run()` ou `process()`
- Classes sem atributos (stateless) que apenas chamam métodos de outras classes
- Controllers que apenas delegam para um service que apenas delega para um repository
- "Orquestradores" que não orquestram nada — apenas repassam chamadas
- Objetos construídos nunca armazenados, nunca testados, nunca referenciados além da chamada imediata

## ❌ Exemplo (violação)

```javascript
// ❌ Classe que existe apenas para chamar outra
class UserInitializer {
  constructor(userService) {
    this.userService = userService;
  }
  initialize(data) {
    return this.userService.create(data); // apenas isso
  }
}

// O chamador precisa instanciar UserInitializer apenas para chegar ao UserService
const initializer = new UserInitializer(userService);
initializer.initialize(data);
```

## ✅ Refatoração

```javascript
// ✅ Chamar UserService diretamente (Inline Class)
userService.create(data);

// Se a classe adicionar transformação ou validação real, então faz sentido existir
```

## Codetag Sugerido

```typescript
// FIXME: Poltergeist — UserInitializer apenas delega para userService.create()
// TODO: Inline Class — chamar userService.create() diretamente
```
