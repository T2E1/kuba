---
title: "Islands Architecture"
category: "Web Performance Patterns"
tags: [web-performance]
type: how-to
---

# Islands Architecture

## Explanation

### O que é

Arquitetura em que a página é composta majoritariamente de HTML estático renderizado no servidor, com "ilhas" isoladas de interatividade marcadas explicitamente para hidratação — cada ilha decide independentemente quando ganha JavaScript (ao carregar, quando visível, quando o navegador está ocioso), enquanto o restante da página permanece HTML puro, sem JavaScript algum.

### Por que importa

- Uma SPA tradicional envia JavaScript para a página inteira, mesmo para áreas puramente estáticas, inflando o custo de carregamento sem necessidade
- Concentra o custo de hidratação apenas onde há interatividade real
- Cada ilha pode adotar sua própria estratégia de hidratação, adequada à sua criticidade

## How-to

### Como aplicar

- Renderizar a página como HTML estático por padrão, no servidor
- Identificar as regiões genuinamente interativas e isolá-las como componentes hidratáveis independentes
- Escolher, para cada ilha, o gatilho de hidratação adequado (carregamento imediato, visibilidade, ociosidade do navegador)
- Definir um mecanismo de comunicação explícito para ilhas que precisam compartilhar estado, já que elas não se conhecem por padrão — ver Dataflow (Event Bus Declarativo)

## Reference

### Critérios Objetivos

- [ ] Regiões estáticas da página não carregam JavaScript de hidratação
- [ ] Cada ilha declara explicitamente seu gatilho de hidratação
- [ ] Comunicação entre ilhas passa por um mecanismo explícito (event bus, estado compartilhado), não por acoplamento direto

### Exceções Permitidas

- **Aplicações com estado global compartilhado entre muitas partes da tela**: a comunicação entre ilhas isoladas exige um padrão adicional de fluxo de dados, o que pode anular parte do ganho.
- **Superfícies altamente interativas de ponta a ponta**: o ganho de "zero JS" desaparece quando quase toda a página é ilha.

### Como Detectar

#### Manual

- Revisar se componentes puramente apresentacionais recebem hidratação desnecessária

#### Automático

- Bundle analyzer por rota/página sinaliza JavaScript de hidratação associado a regiões sem interatividade real

## Related to

- [Dynamic Import](dynamic-import.md): complements — mecanismo comum para carregar o código de uma ilha sob demanda
- [View Transitions](view-transitions.md): complements — ambos atuam no eixo de como o conteúdo chega e se atualiza na tela
- Constructor de Custom Element: complements — ilhas são frequentemente implementadas como custom elements com hidratação independente
- Dataflow (Event Bus Declarativo): reinforces — mecanismo explícito de comunicação entre ilhas que não se conhecem por padrão
