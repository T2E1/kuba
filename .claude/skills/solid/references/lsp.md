# L — Liskov Substitution Principle (LSP)

**Rule deMGoncalves:** COMPORTAMENTAL-012
**Pergunta:** Posso substituir a classe base pela derivada sem quebrar o comportamento?

## O que é

Exige que classes derivadas (subclasses) sejam substituíveis por suas classes base (superclasses) sem alterar o comportamento esperado do programa. Se S é subtipo de T, então objetos do tipo T podem ser substituídos por objetos do tipo S.

## Quando Violar Indica Problema

- Subclasse lança exceções que a superclasse não lança
- Subclasse fortalece pré-condições (exige mais) ou enfraquece pós-condições (garante menos)
- Cliente precisa verificar tipo (`instanceof`) para decidir comportamento
- Método da subclasse lança `UnsupportedOperationException`
- Subclasse sobrescreve método mas não mantém o contrato da superclasse

## ❌ Violação

```typescript
class Bird {
  fly(): void {
    console.log('Flying...');
  }
}

// VIOLA LSP: Pinguim não pode voar, mas herda de Bird
class Penguin extends Bird {
  fly(): void {
    throw new Error('Penguins cannot fly!');  // Quebra contrato
  }
}

// Cliente espera que Bird sempre voe
function makeBirdFly(bird: Bird): void {
  bird.fly();  // Funciona para Bird, mas quebra para Penguin
}

const bird = new Bird();
makeBirdFly(bird);  // OK

const penguin = new Penguin();
makeBirdFly(penguin);  // ERRO: Penguins cannot fly!
```

## ✅ Correto (Segregar Interfaces)

```typescript
// Interface base: comportamento comum a todos os pássaros
interface Bird {
  eat(): void;
  sleep(): void;
}

// Interface específica: apenas aves que voam
interface FlyingBird extends Bird {
  fly(): void;
}

class Sparrow implements FlyingBird {
  eat(): void { console.log('Eating seeds...'); }
  sleep(): void { console.log('Sleeping...'); }
  fly(): void { console.log('Flying...'); }
}

class Penguin implements Bird {
  eat(): void { console.log('Eating fish...'); }
  sleep(): void { console.log('Sleeping...'); }
  // Não implementa fly() - não promete o que não pode cumprir
}

// Cliente aceita apenas aves que voam
function makeBirdFly(bird: FlyingBird): void {
  bird.fly();  // Garantido que pode voar
}

const sparrow = new Sparrow();
makeBirdFly(sparrow);  // OK

// const penguin = new Penguin();
// makeBirdFly(penguin);  // ERRO DE COMPILAÇÃO: Penguin não é FlyingBird
```

## ✅ Correto (Composição)

```typescript
class Bird {
  constructor(
    private readonly flightBehavior: FlightBehavior
  ) {}

  performFly(): void {
    this.flightBehavior.fly();
  }
}

interface FlightBehavior {
  fly(): void;
}

class CanFly implements FlightBehavior {
  fly(): void {
    console.log('Flying...');
  }
}

class CannotFly implements FlightBehavior {
  fly(): void {
    console.log('Cannot fly');
  }
}

const sparrow = new Bird(new CanFly());
sparrow.performFly();  // Flying...

const penguin = new Bird(new CannotFly());
penguin.performFly();  // Cannot fly
```

## Exceções

- **Frameworks de Teste**: Uso de mocks e spies em testes unitários para simular comportamentos de substituição de forma controlada

## Rules Relacionadas

- [011 - Princípio Aberto/Fechado](ocp.md): reforça
- [009 - Tell, Don't Ask](../../rules/009_diga-nao-pergunte.md): reforça
- [003 - Encapsulamento de Primitivos](../../rules/003_encapsulamento-primitivos.md): complementa
- [013 - Princípio de Segregação de Interface](isp.md): reforça
- [036 - Restrição de Funções com Efeitos Colaterais](../../rules/036_restricao-funcoes-efeitos-colaterais.md): reforça
