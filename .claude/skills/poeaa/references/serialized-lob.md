# Serialized LOB

**Camada:** Object-Relational Structural
**Complexidade:** Simples
**Intenção:** Salva um grafo de objetos serializando-o em um único campo Large Object (LOB), em vez de mapear cada objeto para linhas relacionais.

---

## Quando Usar

- Grafo de objetos profundo e coeso que é sempre lido e escrito por inteiro (ex: árvore de configuração)
- Quando o grafo nunca precisa ser consultado por SQL nos seus nós internos

## Quando NÃO Usar

- Quando qualquer parte do grafo precisa ser consultada, filtrada ou indexada isoladamente
- Como atalho para evitar modelar o mapeamento relacional de um domínio que na verdade precisa dele

## Estrutura Mínima (TypeScript)

```typescript
class PreferencesMapper {
  toRow(preferences: UserPreferences): { user_id: string; data: string } {
    return { user_id: preferences.userId, data: JSON.stringify(preferences.toPlainObject()) }
  }

  toDomain(row: { user_id: string; data: string }): UserPreferences {
    return UserPreferences.fromPlainObject(row.user_id, JSON.parse(row.data))
  }
}
```

## Relacionado com

- [embedded-value.md](embedded-value.md): complementa — Embedded Value para valores simples, Serialized LOB para grafos profundos
- [regra 064 - Proibição de Overengineering](../../../rules/064_proibicao-overengineering.md): reforça — evita modelar relacionalmente o que nunca é consultado em partes

---

**Camada PoEAA:** Object-Relational Structural
**Fonte:** Patterns of Enterprise Application Architecture — Martin Fowler (2002)
