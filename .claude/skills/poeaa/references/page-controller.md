# Page Controller

**Camada:** Web Presentation
**Complexidade:** Simples
**Intenção:** Um objeto que trata uma requisição para uma página ou ação específica em um site.

---

## Quando Usar

- Aplicações simples com poucos endpoints bem definidos
- Quando cada página/endpoint tem lógica suficientemente distinta
- Protótipos e MVPs onde a velocidade importa mais que a arquitetura
- Complemento ao Front Controller para handlers de páginas específicas

## Quando NÃO Usar

- Quando lógica transversal (autenticação, logging) precisa ser centralizada (use Front Controller)
- Quando endpoints têm muita lógica comum que causaria duplicação (regra 021)

## Estrutura Mínima (TypeScript)

```typescript
// Page Controller: trata uma única página ou recurso
class UserListPageController {
  constructor(private readonly userRepository: UserRepository) {}

  // Cada método corresponde a um verbo HTTP para este recurso
  async handleGet(request: Request, response: Response): Promise<void> {
    const users = await this.userRepository.findAll()
    response.json(users.map(u => ({ id: u.id, name: u.name })))
  }

  async handlePost(request: Request, response: Response): Promise<void> {
    const user = User.create(request.body.name, request.body.email)
    await this.userRepository.save(user)
    response.status(201).json({ id: user.id })
  }
}

class UserDetailPageController {
  constructor(private readonly userRepository: UserRepository) {}

  async handleGet(request: Request, response: Response): Promise<void> {
    const user = await this.userRepository.findById(request.params.id)
    if (!user) { response.status(404).json({ error: 'Not found' }); return }
    response.json({ id: user.id, name: user.name, email: user.email })
  }
}
```

## Relacionado com

- [front-controller.md](front-controller.md): complementa — Front Controller despacha para Page Controllers específicos
- [mvc.md](mvc.md): depende — Page Controller implementa o papel de Controller dentro da arquitetura MVC

---

**Camada PoEAA:** Web Presentation
**Fonte:** Patterns of Enterprise Application Architecture — Martin Fowler (2002)
