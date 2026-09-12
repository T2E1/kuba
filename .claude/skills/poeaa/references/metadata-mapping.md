# Metadata Mapping

**Camada:** Object-Relational Metadata Mapping
**Complexidade:** Complexa
**Intenção:** Guarda os detalhes do mapeamento objeto-relacional em metadados (tabelas de configuração, decorators ou arquivos), gerando o comportamento de mapeamento a partir deles em vez de escrevê-lo à mão para cada classe.

---

## Quando Usar

- Muitas classes de domínio com mapeamento repetitivo, onde o Data Mapper manual duplicaria a mesma estrutura N vezes
- Quando um ORM (que implementa este padrão internamente) já resolve o problema

## Quando NÃO Usar

- Poucas classes de domínio — o custo de configurar e manter o metadado excede o de escrever o mapper à mão (regra 064)
- Quando o comportamento de mapeamento é altamente específico por classe e não se beneficia de generalização

## Estrutura Mínima (TypeScript, decorators)

```typescript
@Entity('users')
class User {
  @Column('id') id!: string
  @Column('email') email!: string
}
// Um framework de metadados lê os decorators e gera o mapper em tempo de execução
```

## Relacionado com

- [data-mapper.md](data-mapper.md): complementa — Metadata Mapping é uma forma de gerar Data Mappers a partir de configuração
- [regra 068 - Proibição de Martelo de Ouro](../../../rules/068_proibicao-martelo-de-ouro.md): reforça — não adotar um ORM completo só porque "sempre usamos"

---

**Camada PoEAA:** Object-Relational Metadata Mapping
**Fonte:** Patterns of Enterprise Application Architecture — Martin Fowler (2002)
