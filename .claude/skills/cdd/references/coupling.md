# Acoplamento — Dependências Externas

## Definição

Acoplamento mede o número de **dependências externas diretas** — classes, módulos, serviços que a função utiliza.

## Tabela de Pontuação

| Dependências externas | Pontos ICP |
|-----------------------|------------|
| 0–2 | 0 |
| 3–5 | 1 |
| 6+ | 2 |

## O Que Conta Como Dependência

**Contam:**
- Instâncias de classes externas (userRepository, emailService)
- Módulos importados utilizados (bcrypt, logger, dayjs)
- Variáveis globais ou de escopo externo acessadas
- Funções externas chamadas diretamente

**Não contam:**
- Parâmetros recebidos (já são dependências explícitas no contrato)
- Literais e constantes locais
- Funções do próprio módulo/classe
- Dependências injetadas via `this.*` (já estão no construtor)

## Por Que Importa

Cada dependência externa é um **contrato adicional** que o desenvolvedor precisa conhecer para:
1. Entender o que a função faz
2. Testar a função em isolamento (precisa mockar cada dependência)
3. Debugar falhas (precisa rastrear qual dependência causou problema)
4. Modificar a função (verificar impacto em cada dependência)

Com 7 dependências, um bug pode ter 7 fontes diferentes — o desenvolvedor precisa investigar todas.

## Exemplos

```javascript
// 0–2 dependências → +0 ICP
function calculateTotal(items) {
  return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

function formatDate(date) {
  return dayjs(date).format('DD/MM/YYYY'); // dayjs: +1
}

// 3–5 dependências → +1 ICP
async function deactivateUser(userId) {
  const user = await database.users.findById(userId);   // database: +1
  user.active = false;
  await database.users.update(user);
  await emailService.sendDeactivation(user.email);      // emailService: +1
  logger.info('user_deactivated', { userId });           // logger: +1
}
// Acoplamento = 3 → +1 ICP

// 6+ dependências → +2 ICP
async function processCheckout(cartId) {
  const cart = await cartRepository.findById(cartId);      // +1
  const user = await userRepository.findById(cart.userId); // +1
  const prices = await priceService.calculate(cart);       // +1
  const payment = await paymentGateway.charge(user, prices.total); // +1
  const order = await orderRepository.create(cart, payment); // +1
  await inventoryService.reserve(cart.items);              // +1
  await emailService.sendConfirmation(user, order);        // +1
}
// Acoplamento = 7 → +2 ICP
```

## Estratégias de Redução

### Dependency Injection (DIP)

```javascript
// Antes: método com 4 dependências diretas
class OrderService {
  async create(data) {
    const user = await userRepository.findById(data.userId);    // +1
    const order = buildOrder(data, user);
    await orderRepository.save(order);                          // +1
    await paymentGateway.charge(user, order.total);             // +1
    await emailService.sendConfirmation(user, order);           // +1
  }
}
// Acoplamento do método = 4 → +1 ICP

// Depois: dependências injetadas, método com 0 dependências diretas
class OrderService {
  constructor(
    private userRepo,
    private orderRepo,
    private payment,
    private email,
  ) {}

  async create(data) {
    const user = await this.userRepo.findById(data.userId);
    const order = buildOrder(data, user);
    await this.orderRepo.save(order);
    await this.payment.charge(user, order.total);
    await this.email.sendConfirmation(user, order);
  }
}
// Acoplamento do método = 0 (usa this.*, não referências globais) → +0 ICP
```

**Nota:** Dependências injetadas via `this.*` não contam como acoplamento do método — o acoplamento foi deslocado para o construtor (que é o lugar correto).

### Facade Pattern

```javascript
// Antes: 5 dependências no método
async function notifyOrderCompletion(order, user) {
  await emailService.send(user.email, 'order_complete', order);  // +1
  await smsService.send(user.phone, 'Pedido enviado!');           // +1
  await pushService.notify(user.deviceToken, order);              // +1
  await analyticsService.track('order_shipped', order);           // +1
  await slackBot.post('#orders', `Pedido ${order.id} enviado`);  // +1
}

// Depois: 1 dependência (fachada)
async function notifyOrderCompletion(order, user) {
  await notificationFacade.orderShipped(order, user); // +1
}
// Detalhe de COMO notificar fica encapsulado na fachada
```
