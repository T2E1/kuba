# Mapper

**Camada:** Base Patterns
**Complexidade:** Moderada
**Intenção:** Organiza a comunicação entre dois subsistemas independentes (ex: domínio e persistência) mantendo-os desacoplados um do outro.

---

## Quando Usar

- Sempre que dois modelos que não deveriam se conhecer (domínio e schema de banco, domínio e formato de API externa) precisam trocar dado
- Como conceito-base que Data Mapper e Inheritance Mappers especializam

## Quando NÃO Usar

- Quando os dois lados já são o mesmo modelo — mapear seria trabalho supérfluo (regra 064)

## Estrutura Mínima (TypeScript)

```typescript
interface Mapper<Domain, External> {
  toDomain(external: External): Domain
  toExternal(domain: Domain): External
}
```

## Relacionado com

- [data-mapper.md](data-mapper.md): depende de — Data Mapper é a especialização deste padrão para persistência relacional
- [data-transfer-object.md](data-transfer-object.md): complementa — o Mapper frequentemente produz e consome DTOs
- [regra 014 - Inversão de Dependência](../../../rules/014_principio-inversao-dependencia.md): reforça — o mapper é o ponto único de acoplamento entre os dois modelos

---

**Camada PoEAA:** Base Patterns
**Fonte:** Patterns of Enterprise Application Architecture — Martin Fowler (2002)
