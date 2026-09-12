# Preload

## Problema

Um recurso crítico descoberto tarde pelo navegador (porque está atrás de outro
download, ou referenciado só via CSS/JS) chega depois do que deveria.

## Como funciona

`<link rel="preload">` diz ao navegador para buscar o recurso com prioridade alta, em
paralelo, **sempre honrando a requisição** — diferente de `prefetch`
([prefetch.md](prefetch.md)), que é uma dica de baixa prioridade.

```html
<link rel="preload" href="emoji-picker.js" as="script" />
<script src="emoji-picker.js" defer></script>
```

## Quando não aplicar

- Usado em excesso, atrasa First Contentful Paint ao competir por banda com o que é
  realmente crítico para o primeiro paint (CSS crítico, fonte, imagem hero).

## Relação com as rules deste repositório

- Ver [loading-sequence.md](loading-sequence.md) para a ordem de prioridade em que este
  pattern se encaixa entre os demais recursos da página.
