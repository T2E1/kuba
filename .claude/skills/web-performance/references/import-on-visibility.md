# Import On Visibility

**Categoria:** Carregamento
**Intenção:** Carregar o código de um componente quando ele entra na área visível.

---

## Quando Usar

- Componente pesado abaixo da dobra: gráfico, mapa, player, comentários.
- Conteúdo que boa parte dos usuários nunca alcança porque não rola até lá.

## Quando NÃO Usar

- Acima da dobra. O componente já está visível no carregamento, então o gatilho dispara
  imediatamente e o único efeito é a ida à rede a mais.
- Quando o componente é leve — o custo do observador e da requisição supera o ganho.
- Sem reserva de espaço. O conteúdo que aparece depois empurra o que está abaixo, e a
  estabilidade visual piora exatamente enquanto o usuário lê.

## Estrutura Mínima

Um observador de interseção dispara o carregamento quando o marcador se aproxima da área
visível. O marcador ocupa, desde o início, as dimensões do conteúdo final.

Carregar com uma margem de antecedência — antes de o elemento entrar de fato — esconde a
espera na maioria dos casos.

## O que custa

- Um observador por ponto de adiamento, e a disciplina de desconectá-lo.
- Espaço reservado precisa acompanhar mudanças de layout do conteúdo real, ou a reserva
  vira a causa do salto que deveria evitar.

## Relacionado a

- [dynamic-import.md](dynamic-import.md): depende — é a base deste pattern
- [import-on-interaction.md](import-on-interaction.md): complementa — o outro gatilho
- [list-virtualization.md](list-virtualization.md): complementa — a mesma ideia aplicada a itens, não a código
- [progressive-hydration.md](../../react/references/progressive-hydration.md): reforça — o mesmo gatilho, aplicado ao comportamento
- [observer.md](../../gof/references/observer.md): depende — o mecanismo de observação é o pattern Observer da plataforma

---

**Fonte:** patterns.dev — /vanilla/import-on-visibility
