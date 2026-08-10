# Front Controller

**Camada:** Web Presentation
**Complexidade:** Moderada
**Intenção:** Um único handler trata todas as requisições de um site, direcionando-as a um objeto comum antes de despachar para handlers individuais.

---

## Quando Usar

- APIs REST com roteamento centralizado
- Quando lógica comum (autenticação, logging, CORS) deve ser aplicada a todas as requisições
- Frameworks web modernos (Express.js, Fastify) usam Front Controller nativamente
- Quando se quer controle centralizado sobre o fluxo de requisições

## Quando NÃO Usar

- Aplicações de página única com endpoint único (overhead desnecessário)
- Quando o framework já fornece Front Controller automaticamente (evitar duplicação — regra 021)

## Estrutura Mínima (TypeScript)

```typescript
// Front Controller: ponto de entrada único
class FrontController {
  private readonly routes = new Map<string, RequestHandler>()
  private readonly middlewares: Middleware[] = []

  use(middleware: Middleware): void {
    this.middlewares.push(middleware)
  }

  register(path: string, handler: RequestHandler): void {
    this.routes.set(path, handler)
  }

  async handle(request: Request, response: Response): Promise<void> {
    // Aplica todos os middlewares
    for (const middleware of this.middlewares) {
      await middleware.process(request, response)
    }

    // Despacha para o handler correto
    const handler = this.routes.get(request.path)
    if (!handler) { response.status(404).send('Not Found'); return }

    await handler.handle(request, response)
  }
}

// Uso
const controller = new FrontController()
controller.use(new AuthMiddleware())
controller.use(new LoggingMiddleware())
controller.register('/users/:id', new UserController())
```

## Relacionado com

- [mvc.md](mvc.md): complementa — Front Controller é o ponto de entrada que encaminha requisições aos Controllers do MVC
- [page-controller.md](page-controller.md): complementa — Page Controllers são os handlers registrados e despachados pelo Front Controller
- [application-controller.md](application-controller.md): complementa — Application Controller pode determinar qual handler o Front Controller deve usar
- [regra 021 - Proibição de Duplicação de Lógica](../../../rules/021_proibicao-duplicacao-logica.md): reforça — centraliza lógica comum (autenticação, logging) que seria duplicada em cada Page Controller

---

**Camada PoEAA:** Web Presentation
**Fonte:** Patterns of Enterprise Application Architecture — Martin Fowler (2002)
