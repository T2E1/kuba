# View Transitions

## Problema

Criar transição visual suave entre dois estados do DOM, sem a falta de feedback comum em
mudanças abruptas de conteúdo.

## Como funciona

`document.startViewTransition(callback)` captura o estado atual do DOM, executa o
callback que atualiza o DOM, e anima entre o "antes" e o "depois" via pseudo-elementos
CSS (`::view-transition-old()`, `::view-transition-new()`).

```javascript
if (document.startViewTransition) {
  document.startViewTransition(() => {
    details.toggleAttribute("open");
  });
}
```

## Quando não aplicar

- O DOM fica não interativo durante a transição — evitar em fluxo onde o usuário precisa
  interagir imediatamente após o clique.
- Suporte de navegador ainda concentrado em Chromium; exige *feature detection* antes de
  usar, como no exemplo acima.

## Relação com as rules deste repositório

- **render** (skill): decide qual decorator (`paint`, `repaint`, `retouch`) processa a
  mudança visual — View Transitions é ortogonal a essa decisão, atua na transição entre
  dois estados já decorados.
