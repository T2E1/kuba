---
title: "Hierarquias de Herança Paralelas (Parallel Inheritance Hierarchies)"
category: "Code Smells"
type: reference
id: "STRUCTURAL-031"
severity: "🟡 Medium"
tags: [code-smells]
---

# Hierarquias de Herança Paralelas (Parallel Inheritance Hierarchies)

## Explanation

### O que é

Toda vez que uma subclasse é criada em uma hierarquia, uma subclasse correspondente precisa ser criada em outra hierarquia para que o sistema continue funcionando. As duas hierarquias crescem em espelho, sempre em sincronia forçada.

### Por que importa

- É um caso especial de Shotgun Surgery: uma única mudança conceitual exige tocar duas hierarquias de classes
- Aumenta o custo de adicionar um novo tipo, já que exige criar e conectar duas classes em vez de uma
- É fácil esquecer de criar a classe espelhada, gerando comportamento incompleto ou inconsistente
- Sinaliza que as duas hierarquias deveriam ser uma só, ou que uma delas deveria ser eliminada via composição

## Reference

### Critérios Objetivos

- [ ] Adicionar um novo tipo de negócio não deve exigir criar mais de uma classe nova.
- [ ] Se duas hierarquias de classes sempre crescem juntas com nomes espelhados (ex: `PedidoValidator` para cada `Pedido*`), elas devem ser fundidas ou uma delas substituída por composição/injeção.
- [ ] Referências cruzadas fixas entre instâncias correspondentes de duas hierarquias (`this.par = new OutraClasseX()`) devem ser eliminadas via *Factory* central.

### Exceções Permitidas

- **Padrões DTO/Entity espelhados**: pares como Entidade de domínio e seu [DTO](../skills/poeaa/references/data-transfer-object.md) de transporte, quando a duplicação estrutural é intencional para desacoplar camadas.

### Como Detectar

#### Manual

- Verificar se, ao adicionar uma nova subclasse em uma hierarquia, foi necessário criar uma subclasse correspondente em outra hierarquia

#### Automático

- Sem regra nativa de Biome para esta análise estrutural — detecção via revisão de arquitetura

## Related to

- [038 — Shotgun Surgery](038_shotgun-surgery.md): reinforces — mesma causa raiz, uma mudança tocando múltiplos lugares
- [036 — Divergent Change](036_mudanca-divergente.md): complements
- [OCP - Open/Closed Principle](../skills/solid/SKILL.md): reinforces
- [Factory Method](../skills/gof/references/factory-method.md): complements — uma Factory central é a forma recomendada de conectar instâncias correspondentes das duas hierarquias.
- [030 — Herança Recusada (Refused Bequest)](030_heranca-refusao.md): complements — ambos são sintomas de hierarquias de herança mal modeladas.
- [Visitor](../skills/gof/references/visitor.md): complements — Visitor é uma alternativa clássica para evitar duplicar hierarquias de classes por operação.
