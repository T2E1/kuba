# MVC (Model-View-Controller)

**Camada:** Web Presentation
**Complexidade:** Moderada
**Intenção:** Separar a aplicação em três componentes: Model (dados e lógica de negócio), View (apresentação) e Controller (coordenação entre Model e View).

---

## Quando Usar

- Qualquer aplicação com interface de usuário
- Quando a lógica de apresentação deve ser separada da lógica de negócio
- Para permitir que diferentes Views exibam os mesmos dados (ex: HTML e JSON)
- Padrão fundamental em frameworks web (Express, Fastify, NestJS)

## Quando NÃO Usar

- Nunca — MVC é adequado para aplicações web de qualquer tamanho
- Em aplicações muito simples pode ser simplificado, mas a separação sempre compensa

## Estrutura Mínima (TypeScript)

```typescript
// Model: dados e regras de negócio
class UserModel {
  async findById(id: string): Promise<User | null> {
    return userRepository.findById(id)
  }

  async create(data: CreateUserDTO): Promise<User> {
    const user = User.create(data.name, data.email)
    await userRepository.save(user)
    return user
  }
}

// View: renderização (pode ser JSON para APIs)
class UserView {
  renderJSON(user: User): object {
    return { id: user.id, name: user.name, email: user.email }
  }

  renderHTML(user: User): string {
    return `<div class="user"><h1>${user.name}</h1><p>${user.email}</p></div>`
  }
}

// Controller: coordena Model e View
class UserController {
  constructor(
    private readonly model: UserModel,
    private readonly view: UserView
  ) {}

  async show(request: Request, response: Response): Promise<void> {
    const user = await this.model.findById(request.params.id)
    if (!user) { response.status(404).json({ error: 'User not found' }); return }
    response.json(this.view.renderJSON(user))
  }
}
```

## Relacionado com

- [front-controller.md](front-controller.md): complementa — Front Controller é o ponto de entrada que despacha para os Controllers do MVC
- [page-controller.md](page-controller.md): complementa — Page Controller é uma implementação simplificada do papel de Controller no MVC
- [regra 010 - Princípio da Responsabilidade Única](../../../rules/010_principio-responsabilidade-unica.md): reforça — separa claramente as responsabilidades de dados, apresentação e coordenação

---

**Camada PoEAA:** Web Presentation
**Fonte:** Patterns of Enterprise Application Architecture — Martin Fowler (2002)
