# Association Table Mapping

**Camada:** Object-Relational Structural
**Complexidade:** Moderada
**Intenção:** Salva uma associação muitos-para-muitos como uma tabela própria, com uma chave estrangeira para cada lado da associação.

---

## Quando Usar

- Associação onde um objeto de cada lado pode se relacionar com vários do outro lado (ex: `Student` e `Course`)

## Quando NÃO Usar

- Associação um-para-muitos (ver Foreign Key Mapping)

## Estrutura Mínima (TypeScript)

```typescript
// Tabela: enrollments (student_id, course_id)
class EnrollmentMapper {
  async findCoursesFor(studentId: string): Promise<Course[]> {
    const rows = await this.db.query(
      'SELECT c.* FROM courses c JOIN enrollments e ON e.course_id = c.id WHERE e.student_id = $1',
      [studentId],
    )
    return rows.map(this.toCourse)
  }
}
```

## Relacionado com

- [foreign-key-mapping.md](foreign-key-mapping.md): complementa — mesma família, para cardinalidade diferente
- [data-mapper.md](data-mapper.md): depende de — a tabela de associação é resolvida pelo mapper, nunca exposta ao domínio
- [lazy-load.md](lazy-load.md): complementa — a coleção do outro lado normalmente é carregada tardiamente

---

**Camada PoEAA:** Object-Relational Structural
**Fonte:** Patterns of Enterprise Application Architecture — Martin Fowler (2002)
