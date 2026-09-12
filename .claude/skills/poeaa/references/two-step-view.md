# Two Step View

**Camada:** Web Presentation
**Complexidade:** Moderada
**Intenção:** Transforma o modelo de domínio em uma representação lógica da página (independente de formato) em um primeiro estágio, e converte essa representação em marcação específica em um segundo estágio.

---

## Quando Usar

- Sites com muitas páginas que precisam manter aparência consistente e trocar de layout globalmente
- Quando a mesma estrutura lógica de página precisa render em formatos diferentes (HTML, mobile, e-mail)

## Quando NÃO Usar

- Poucas páginas ou aparência que nunca muda em conjunto — a indireção de dois estágios não se paga (regra 064)

## Estrutura Mínima (conceitual)

```
Domínio → [Estágio 1: modelo lógico de página, ex: XML intermediário]
        → [Estágio 2: renderer converte o modelo lógico em HTML/PDF/e-mail]
```

## Relacionado com

- [template-view.md](template-view.md): complementa — Two Step View pode usar Template View no segundo estágio
- [regra 064 - Proibição de Overengineering](../../../rules/064_proibicao-overengineering.md): reforça — dois estágios só se justificam com mudança de aparência global frequente

---

**Camada PoEAA:** Web Presentation
**Fonte:** Patterns of Enterprise Application Architecture — Martin Fowler (2002)
