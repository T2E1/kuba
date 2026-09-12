# Registry

**Camada:** Base Patterns
**Complexidade:** Simples
**Intenção:** Provê um ponto de acesso global e conhecido para localizar objetos ou serviços, sem que cada consumidor precise recebê-los por parâmetro em toda a cadeia de chamadas.

---

## Quando Usar

- Objetos verdadeiramente globais à aplicação (ex: configuração, logger) onde passar por injeção em toda a cadeia seria ruído
- Em conjunto com injeção de dependência, para casos de borda que a injeção não cobre bem

## Quando NÃO Usar

- Como substituto geral de injeção de dependência — vira estado global mutável e acoplamento oculto (regra 070)
- Para objetos de domínio, que devem chegar por parâmetro ou construtor (regra 014)

## Estrutura Mínima (TypeScript)

```typescript
class ServiceRegistry {
  private static readonly services = new Map<string, unknown>()

  static register<T>(key: string, service: T): void {
    ServiceRegistry.services.set(key, service)
  }

  static resolve<T>(key: string): T {
    const service = ServiceRegistry.services.get(key)
    if (!service) throw new ServiceNotRegisteredError(key)
    return service as T
  }
}
```

## Relacionado com

- [regra 070 - Proibição de Estado Mutável Compartilhado](../../../rules/070_proibicao-estado-mutavel-compartilhado.md): reforça — o risco central do Registry mal usado
- [regra 014 - Inversão de Dependência](../../../rules/014_principio-inversao-dependencia.md): complementa — injeção de dependência é preferível na maioria dos casos

---

**Camada PoEAA:** Base Patterns
**Fonte:** Patterns of Enterprise Application Architecture — Martin Fowler (2002)
