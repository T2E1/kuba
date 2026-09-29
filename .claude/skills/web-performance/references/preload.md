# Preload

**Categoria:** Carregamento
**Intenção:** Declarar ao navegador que um recurso será necessário **nesta navegação**,
para que ele o descubra e busque cedo, em prioridade alta.

---

## Quando Usar

- Recurso crítico que o navegador só descobre tarde: fonte referenciada de dentro de uma
  folha de estilo, imagem principal definida por estilo, pedaço de código exigido pela
  primeira tela.
- Para desfazer a cascata que [bundle-splitting.md](bundle-splitting.md) cria: o pedaço
  separado é declarado no documento e baixa em paralelo, não em série.

## Quando NÃO Usar

- Em recurso que o navegador já descobre cedo no documento. Não acelera nada e compete
  por banda com o que importa.
- Em recurso que talvez seja usado. Isso é [prefetch.md](prefetch.md); usar preload
  desperdiça banda em prioridade alta.
- Em muitos recursos ao mesmo tempo. Declarar tudo como prioritário equivale a declarar
  nada — a fila volta a ser a ordem de descoberta.

## Estrutura Mínima

Uma declaração no documento, com o tipo do recurso, antes do ponto em que ele seria
descoberto naturalmente. O tipo é obrigatório: sem ele o navegador não sabe a prioridade
nem o contexto, e pode acabar buscando duas vezes.

## O que custa

- Banda em prioridade alta, tomada de outro recurso.
- Recurso declarado e não usado é desperdício puro, e o navegador avisa no console — um
  sinal que costuma passar despercebido.
- A declaração precisa acompanhar o nome do arquivo gerado pelo build; desatualizada, ela
  busca algo que não existe.

## Relacionado a

- [prefetch.md](prefetch.md): complementa — este é para esta navegação; aquele, para a próxima
- [bundle-splitting.md](bundle-splitting.md): complementa — desfaz a cascata que a divisão cria
- [loading-sequence.md](loading-sequence.md): depende — só faz sentido dentro de uma ordem decidida
- [rule 012 — Proibição de Otimização Prematura](../../../rules/012_otimizacao-prematura.md): reforça

---

**Fonte:** patterns.dev — /vanilla/preload
