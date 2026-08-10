# Responsabilidades — Violações de SRP

## Definição

Responsabilidades mede quantas **responsabilidades distintas** um método executa simultaneamente — operacionalização do SRP (Single Responsibility Principle) para ICP.

## Tabela de Pontuação

| Responsabilidades distintas | Pontos ICP |
|-----------------------------|------------|
| 1 | 0 |
| 2–3 | 1 |
| 4–5 | 2 |
| 6+ | 3 |

## As 8 Dimensões de Responsabilidade

| # | Dimensão | Exemplos |
|---|---|---|
| 1 | **Validação de dados** | Verificar campos obrigatórios, formatos, regras de negócio |
| 2 | **Transformação de dados** | Mapear, filtrar, converter formatos, calcular |
| 3 | **Persistência** | INSERT, UPDATE, DELETE em banco ou arquivo |
| 4 | **Consulta** | SELECT, GET, buscar dados de repositório ou API |
| 5 | **Lógica de negócio** | Aplicar regras de domínio, calcular preços, avaliar elegibilidade |
| 6 | **Formatação / Apresentação** | Serializar para JSON, formatar datas, montar HTML |
| 7 | **Logging / Auditoria** | Registrar eventos, enviar métricas, auditoria |
| 8 | **Tratamento de erros** | Capturar exceções, mapear para erros de domínio |

## Exemplos

```javascript
// 1 responsabilidade → +0 ICP
function formatCurrency(amount, currency = 'BRL') {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency,
  }).format(amount);
}

// 2–3 responsabilidades → +1 ICP
// Validação + Lógica de negócio
function calculateDiscount(user, order) {
  if (!user.isPremium) return 0;          // validação
  if (order.total < 100) return 0;        // regra de negócio
  return user.vip ? order.total * 0.3    // lógica de negócio
                  : order.total * 0.1;
}

// 4–5 responsabilidades → +2 ICP
// Validação + Consulta + Transformação + Persistência + Logging
function createProduct(data) {
  if (!data.name || !data.price) throw new ValidationError(); // validação
  const existing = db.products.findByName(data.name);        // consulta
  if (existing) throw new DuplicateError();

  const product = { ...data, createdAt: new Date() };        // transformação
  const saved = db.products.insert(product);                  // persistência
  logger.info('product_created', { id: saved.id });           // logging

  return saved;
}

// 5 responsabilidades → +2 ICP
function registerUser(data) {
  // 1. Validação
  if (!data.email || !data.email.includes('@')) {
    throw new InvalidEmailError(data.email);
  }
  // 2. Transformação
  const hashedPassword = bcrypt.hash(data.password, 10);
  const user = { email: data.email.toLowerCase(), password: hashedPassword };
  // 3. Persistência
  const saved = database.users.insert(user);
  // 4. Logging
  logger.info('user_registered', { userId: saved.id, email: saved.email });
  // 5. Consulta (para verificar unicidade)
  const exists = database.users.findByEmail(data.email);
  if (exists) throw new DuplicateEmailError(data.email);

  return saved;
}
```

## Estratégias de Redução

### Separar por Camada

```javascript
// Antes: 5 responsabilidades
function createOrder(data) {
  validateOrderData(data);  // validação
  const user = db.users.findById(data.userId); // consulta
  const order = buildOrder(data, user); // transformação
  db.orders.insert(order); // persistência
  emailService.sendConfirmation(order); // efeito colateral
  logger.info('order_created', order); // logging
}

// Depois: cada função com 1 responsabilidade
function validateOrderData(data) { /* apenas validação */ }
function buildOrder(data, user) { /* apenas transformação */ }

// O orquestrador tem 1 responsabilidade: coordenar
async function createOrder(data) {
  const validated = validateOrderData(data);
  const user = await userRepository.findById(validated.userId);
  const order = buildOrder(validated, user);
  return orderRepository.save(order); // persistência + side effects no repositório
}
```
