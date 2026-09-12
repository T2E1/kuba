# Prototype Pattern

## Problema

Compartilhar comportamento entre objetos similares sem duplicar código, e criar variantes
de um objeto mantendo um template como referência.

## Como funciona

Todo objeto JavaScript tem um slot interno `[[Prototype]]`. A leitura de uma propriedade
sobe a cadeia de protótipos até encontrá-la. Classes são açúcar sintático sobre essa
mesma mecânica de delegação.

```javascript
const widget = {
  render() {
    return `<div class="${this.theme}">${this.label}</div>`;
  },
};

const button = Object.create(widget);
button.label = "Save";
button.theme = "primary";
```

## Quando não aplicar

- Para dicionários com chaves vindas de entrada não confiável — a cadeia de protótipos
  abre risco de *prototype pollution*; use `Object.create(null)`.
- Quando o spread (`{...obj}`) é raso e o objeto tem estado aninhado: a cópia superficial
  compartilha referência interna, violando a imutabilidade esperada (rule 029).

## Relação com as rules deste repositório

- **029 (Imutabilidade)**: métodos compartilhados via protótipo são seguros porque são
  funções; dados mutáveis no protótipo são estado compartilhado (rule 070) por natureza.
- **012 (LSP)**: a cadeia de delegação só é segura quando o objeto derivado não precisa
  de `instanceof` para decidir comportamento — senão o contrato do protótipo foi violado.
