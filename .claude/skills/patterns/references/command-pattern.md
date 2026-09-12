# Command Pattern

## Problema

Transformar uma requisição em um objeto de primeira classe, para que ela possa ser
armazenada, enfileirada, logada, enviada pela rede, reproduzida ou desfeita.

## Como funciona

Cada comando implementa `execute()` e `undo()`. Um invoker mantém pilhas de comandos
executados e pendentes.

```javascript
class InsertText {
  constructor(position, payload) {
    this.position = position;
    this.payload = payload;
  }
  execute(doc) {
    doc.text = doc.text.slice(0, this.position) + this.payload + doc.text.slice(this.position);
  }
  undo(doc) {
    doc.text = doc.text.slice(0, this.position) + doc.text.slice(this.position + this.payload.length);
  }
}
```

## Quando não aplicar

- Se não há necessidade real de histórico, fila ou replay — a complexidade de manter
  `execute`/`undo` simétricos não se paga (rule 064).
- Comandos acumulados indefinidamente em memória sem limite de histórico são uma forma
  de vazamento equivalente à do Observer sem unsubscribe.

## Relação com as rules deste repositório

- **038 (CQS)**: `execute` é Comando puro (muda estado, não retorna dado de consulta);
  misturar leitura relevante no retorno de `execute` viola a separação.
- **009 (Tell, Don't Ask)**: o invoker diz ao comando "execute-se" sem perguntar por
  detalhes internos — é a forma mais direta deste princípio.
