# Import On Visibility

## Problema

Componentes fora da viewport inicial não deveriam custar bundle inicial — o pattern adia
o import até o componente entrar em vista.

## Como funciona

`IntersectionObserver` detecta quando o elemento-alvo entra na viewport e só então
dispara `import()` dinâmico ([dynamic-import.md](dynamic-import.md)), exibindo um estado
de carregamento até o módulo resolver.

```javascript
const observer = new IntersectionObserver(async ([entry], obs) => {
  if (!entry.isIntersecting) return;
  obs.disconnect();
  const { CommentSection } = await import("./comment-section.js");
  entry.target.replaceWith(new CommentSection());
});
observer.observe(placeholder);
```

## Quando não aplicar

- Conteúdo que precisa estar pronto no primeiro paint — a latência do import só aparece
  quando o usuário rola até o elemento, mas ela existe.

## Relação com as rules deste repositório

- Combina com [dynamic-import.md](dynamic-import.md); a diferença é só o gatilho —
  visibilidade em vez de interação direta ([import-on-interaction.md](import-on-interaction.md)).
