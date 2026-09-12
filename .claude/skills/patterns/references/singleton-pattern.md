# Singleton Pattern

## Problema

Garantir que uma classe tenha exatamente uma instância durante toda a vida da aplicação,
quando um recurso deve ser genuinamente compartilhado — pool de conexão, cliente de
analytics, cliente de WebSocket, serviço de feature flags.

## Como funciona

Um campo estático privado guarda a única instância. O constructor verifica se ela já
existe e a devolve em vez de criar outra; um método estático de acesso garante a
inicialização preguiçosa.

```javascript
class FeatureFlags {
  static #instance = null;
  #flags = new Map();

  constructor() {
    if (FeatureFlags.#instance) return FeatureFlags.#instance;
    FeatureFlags.#instance = this;
  }

  static getInstance() {
    return (FeatureFlags.#instance ??= new FeatureFlags());
  }
}
```

## Quando não aplicar

- Quando o "acesso global" é a motivação real, não a unicidade — isso é estado mutável
  compartilhado disfarçado (rule 070), e o Singleton só esconde o `import` que o carrega.
- Em SSR ou serverless, onde a instância pode vazar estado entre requisições distintas.
- Quando um módulo ES já resolve o caso: o escopo de módulo é singleton por natureza
  (rule 019/031), sem a cerimônia de classe.

## Relação com as rules deste repositório

- **014 (DIP)**: Singleton acoplado por `import` direto é o antipadrão mais comum contra
  inversão de dependência — a alternativa é injetar a instância única no Root Composer.
- **070 (Estado Mutável Compartilhado)**: toda instância única mutável é candidata a essa
  rule; o Singleton só é seguro quando o estado interno é imutável ou controlado.
- **008 (Getters/Setters)**: `getInstance()` não é um getter trivial — ele contém lógica
  de criação, então a exceção da rule se aplica.
