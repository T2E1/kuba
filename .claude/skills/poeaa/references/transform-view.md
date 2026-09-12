# Transform View

**Camada:** Web Presentation
**Complexidade:** Moderada
**Intenção:** Processa dado por dado, transformando o modelo de domínio diretamente em HTML (ou outro formato de saída), em vez de preencher marcadores em um template estático.

---

## Quando Usar

- Quando a mesma fonte de dados precisa gerar vários formatos de saída (HTML, PDF, CSV) por transformações diferentes
- Pipelines de transformação onde cada etapa produz uma representação mais próxima do formato final

## Quando NÃO Usar

- Páginas simples onde Template View é mais direto de ler e manter

## Estrutura Mínima (TypeScript)

```typescript
function userToHtml(user: User): string {
  return `<h1>${user.name}</h1><p>${user.email}</p>`
}

function usersToCsv(users: User[]): string {
  return users.map(u => `${u.name},${u.email}`).join('\n')
}
```

## Relacionado com

- [template-view.md](template-view.md): complementa — trade-off oposto (marcação como base em vez de dado como base)
- [regra 021 - Proibição de Duplicação de Lógica](../../../rules/021_proibicao-duplicacao-logica.md): reforça — cada transformação deve viver em uma única função reutilizável

---

**Camada PoEAA:** Web Presentation
**Fonte:** Patterns of Enterprise Application Architecture — Martin Fowler (2002)
