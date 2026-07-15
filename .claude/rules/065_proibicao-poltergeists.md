# Proibição de Poltergeists

**ID**: AP-12-065
**Severity**: 🟡 Medium
**Category**: Structural

---

## What it is

Poltergeists (ou Entidades de Vida Curta) ocorrem quando classes ou objetos são criados apenas para chamar outro método ou objeto e então são imediatamente descartados. Como poltergeists (espíritos transitórios) que aparecem brevemente e desaparecem, estes objetos não adicionam valor, apenas adicionam complexidade transitória. Middle men de vida curta.

## Why it matters

- Complexidade desnecessária: cada poltergeist adiciona +1 nome de classe/set para aprender e manter
- Confusão de leitura: desenvolvedores se perguntam "por que isso existe?" apenas para descobrir que não há razão
- Dificuldade de debugging: criação/descarte de objetos adicionam ruído ao stack trace e análise
- Indica refatoração incompleta ou aplicação mecânica de padrão sem pensar
- Espalha código boilerplate: quando poltergeists são comuns, muitos arquivos existem sem propósito

## Objective Criteria

- [ ] Classes/services criados apenas para adaptar parâmetros ou formatar chamadas e descartados
- [ ] Objetos criados e descartados dentro do mesmo escopo (linha única ou poucas linhas)
- [ ] Classes que existem apenas para passar dados entre camadas sem validação, transformação ou comportamento
- [ ] Padrão frequente de `new SomeAdapter(object).execute()` em vez de usar objeto diretamente
- [ ] Objetos construídos nunca armazenados, nunca testados, nunca referenciados além da chamada imediata

## Allowed Exceptions

- Padrões de Builder onde builder adiciona legibilidade via API fluente mesmo se descartado
- Adapters/wrappers que transformam formatos entre fronteiras (API → domínio interno)
- Commands/Queries encapsulados em padrões CQRS que existem por design
- DTOs que são criados, populados, passados para fronteira e então descartados (padrão padrão em camadas de fronteira)

## How to Detect

### Manual

- Procurar instanciações onde objeto é criado, usado, descartado imediatamente (tudo no mesmo escopo)
- Identificar classes nunca usadas como campos, nunca referenciadas em testes, nunca parte de exports de módulo
- Code review: questionar "que valor esse objeto adiciona?" para cada classe transitória

### Automatic

- Biome: `correctness/noUnusedVariables` (sinaliza referências descartadas sem uso); análise de cobertura de uso continua manual

## Related to

- [061 - Prohibition of Middle Man](061_proibicao-middle-man.md): complements
- [022 - Simplicity and Clarity (KISS)](022_priorizacao-simplicidade-clareza.md): reinforces
- [057 - Prohibition of Feature Envy](057_proibicao-feature-envy.md): complements
- [009 - Tell, Don't Ask](009_diga-nao-pergunte.md): reinforces

---

**Created on**: 2026-03-28
**Updated on**: 2026-07-15
**Version**: 1.1
