# Prefetch

## Problema

Atraso entre a ação do usuário e o carregamento do recurso que ela dispara, quando esse
recurso não está no bundle inicial.

## Como funciona

`<link rel="prefetch">` (ou o comentário mágico `webpackPrefetch: true` em import
dinâmico) pede ao navegador para baixar o recurso em segundo plano, em momento de
inatividade de rede, antes de o usuário solicitá-lo.

```javascript
const EmojiPicker = lazy(() =>
  import(/* webpackPrefetch: true */ "./emoji-picker.js")
);
```

## Quando não aplicar

- Se o usuário nunca solicitar o recurso, o download foi desperdiçado — banda e,
  potencialmente, dinheiro do usuário em conexão limitada. Aplicar só quando a
  probabilidade de uso é alta (próxima rota mais provável, por exemplo).

## Relação com as rules deste repositório

- Distinto de [preload.md](preload.md): prefetch é dica de baixa prioridade para o
  *próximo* recurso provável; preload é alta prioridade para o recurso *já necessário*.
