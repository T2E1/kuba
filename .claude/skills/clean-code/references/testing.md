# Testes (Regra 032)

## Regra

- **032**: Cobertura ≥85% para módulos de domínio/negócio (padrão AAA)

## Checklist

- [ ] Cobertura de linha ≥85% em domínio/negócio (Use Cases, Entidades)
- [ ] Sem lógica de controle (`if`, `for`, `while`) dentro dos testes
- [ ] Cada teste foca em 1-2 assertivas (máximo)
- [ ] Estrutura AAA (Arrange, Act, Assert)

## Exemplos

```typescript
// ❌ Violações
test('operações de usuário', () => {
  const user = createUser({ name: 'Alice' });

  // Lógica de controle no teste
  if (user.isAdmin) {
    expect(user.permissions).toContain('admin');
  } else {
    expect(user.permissions).toContain('user');
  }

  // Múltiplas assertivas não relacionadas
  expect(user.name).toBe('Alice');
  expect(user.email).toContain('@');
  expect(user.age).toBeGreaterThan(0);
});

// ✅ Conformidade
describe('User', () => {
  test('deve criar usuário com o nome fornecido', () => {
    // Arrange
    const input = { name: 'Alice', email: 'alice@example.com' };

    // Act
    const user = createUser(input);

    // Assert
    expect(user.name).toBe('Alice');
  });

  test('deve validar e-mail durante a criação', () => {
    // Arrange
    const input = { name: 'Bob', email: 'invalido' };

    // Act & Assert
    expect(() => createUser(input)).toThrow(EmailInvalidError);
  });

  test('admin deve ter permissão de administrador', () => {
    // Arrange
    const admin = createUser({ name: 'Admin', role: 'admin' });

    // Act
    const permissions = admin.getPermissions();

    // Assert
    expect(permissions).toContain('admin');
  });
});

// Estrutura AAA explícita
test('deve calcular desconto para usuário premium', () => {
  // Arrange
  const user = { premium: true, purchases: 15 };

  // Act
  const discount = calculateDiscount(user);

  // Assert
  expect(discount).toBe(0.2);
});
```

## Relação com ICP

- Testes sem lógica de controle são mais fáceis de entender
- AAA torna o propósito e a expectativa explícitos
- Alta cobertura garante que CC_base foi exercido
