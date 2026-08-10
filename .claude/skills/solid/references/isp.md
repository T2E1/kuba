# I — Interface Segregation Principle (ISP)

**Rule deMGoncalves:** ESTRUTURAL-013
**Pergunta:** Clientes dependem apenas das interfaces que realmente usam?

## O que é

Exige que clientes não sejam forçados a depender de interfaces que não utilizam. Múltiplas interfaces específicas para clientes são preferíveis a uma única interface geral. Nenhuma classe deve ser forçada a implementar métodos que não usa.

## Quando Violar Indica Problema

- Interface com mais de 5 métodos públicos
- Classe implementa interface deixando métodos vazios
- Classe lança exceção em método de interface (ex: `UnsupportedOperationException`)
- Interface é usada por mais de 3 clientes diferentes com necessidades distintas
- Implementadores precisam de apenas 20-30% dos métodos da interface

## ❌ Violação

```typescript
// Interface "gorda" - força implementadores a ter métodos que não usam
interface Worker {
  work(): void;
  eat(): void;
  sleep(): void;
  getPaid(): void;
  takeVacation(): void;
}

// Robot não come, não dorme, não tira férias - VIOLA ISP
class Robot implements Worker {
  work(): void {
    console.log('Working...');
  }

  eat(): void {
    throw new Error('Robots do not eat');  // Método forçado
  }

  sleep(): void {
    throw new Error('Robots do not sleep');  // Método forçado
  }

  getPaid(): void {
    throw new Error('Robots do not get paid');  // Método forçado
  }

  takeVacation(): void {
    throw new Error('Robots do not take vacations');  // Método forçado
  }
}

// Human implementa tudo, mas está acoplado a interface inchada
class Human implements Worker {
  work(): void { console.log('Working...'); }
  eat(): void { console.log('Eating...'); }
  sleep(): void { console.log('Sleeping...'); }
  getPaid(): void { console.log('Getting paid...'); }
  takeVacation(): void { console.log('On vacation...'); }
}
```

## ✅ Correto (Segregar Interfaces)

```typescript
// Interfaces específicas: clientes dependem apenas do que usam
interface Workable {
  work(): void;
}

interface Feedable {
  eat(): void;
}

interface Sleepable {
  sleep(): void;
}

interface Payable {
  getPaid(): void;
}

interface Vacationable {
  takeVacation(): void;
}

// Robot implementa apenas o que faz sentido
class Robot implements Workable {
  work(): void {
    console.log('Working...');
  }
}

// Human implementa múltiplas interfaces específicas
class Human implements Workable, Feedable, Sleepable, Payable, Vacationable {
  work(): void { console.log('Working...'); }
  eat(): void { console.log('Eating...'); }
  sleep(): void { console.log('Sleeping...'); }
  getPaid(): void { console.log('Getting paid...'); }
  takeVacation(): void { console.log('On vacation...'); }
}

// Clientes dependem apenas da interface que precisam
function makeWork(worker: Workable): void {
  worker.work();  // Aceita Robot e Human
}

function feedWorker(worker: Feedable): void {
  worker.eat();  // Aceita apenas Human
}
```

## ✅ Correto (Composição de Interfaces)

```typescript
// Interfaces específicas pequenas
interface Workable {
  work(): void;
}

interface LivingBeing {
  eat(): void;
  sleep(): void;
}

interface Employee extends Workable {
  getPaid(): void;
  takeVacation(): void;
}

// Robot implementa apenas Workable
class Robot implements Workable {
  work(): void {
    console.log('Working...');
  }
}

// Human implementa Employee (que já inclui Workable) + LivingBeing
class Human implements Employee, LivingBeing {
  work(): void { console.log('Working...'); }
  eat(): void { console.log('Eating...'); }
  sleep(): void { console.log('Sleeping...'); }
  getPaid(): void { console.log('Getting paid...'); }
  takeVacation(): void { console.log('On vacation...'); }
}
```

## Exceções

- **Interfaces de Baixo Nível**: Interfaces de frameworks de terceiros que exigem um alto número de métodos (ex: `HttpRequestHandler`)

## Rules Relacionadas

- [010 - Princípio da Responsabilidade Única](srp.md): reforça
- [011 - Princípio Aberto/Fechado](ocp.md): complementa
- [012 - Princípio de Substituição de Liskov](lsp.md): reforça
- [017 - Princípio do Reuso Comum](../../rules/017_principio-reuso-comum.md): complementa
- [037 - Proibição de Argumentos Sinalizadores](../../rules/037_proibicao-argumentos-sinalizadores.md): reforça
