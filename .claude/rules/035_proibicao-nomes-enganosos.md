# Proibição de Nomes Enganosos (Desinformação e Encoding)

**ID**: STRUCTURAL-035
**Severity**: 🔴 Critical
**Category**: Structural

---

## What it is

Proíbe o uso de nomes que impliquem falsas pistas ou sugiram um comportamento que o código não possui (ex: chamar um `Set` de `accountList`) e proíbe a codificação de tipos nos nomes (ex: `strName` ou `fValue`).

## Why it matters

- Nomes enganosos são uma forma de desinformação que quebra a confiança no código
- O *encoding* de tipo (notação húngara) é redundante e polui o código
- Aumenta o risco de bugs em tempo de execução quando o tipo real é alterado mas o nome não
- Faz o leitor confiar em uma estrutura de dados diferente da que realmente existe

## Objective Criteria

- [ ] Variáveis que contêm coleções (`Array`, `Set`, `Map`) devem ser nomeadas conforme a estrutura de dados real.
- [ ] É proibido o uso de prefixos de tipo desnecessários em nomes (ex: `str`, `int`, `f`).
- [ ] Nomes de variáveis não devem contradizer o tipo de dado que armazenam.

## Allowed Exceptions

- **Interfaces Legadas**: Variáveis onde a notação húngara é exigida para interoperabilidade com código legado ou *frameworks* de baixo nível.

## How to Detect

### Manual

- Verificar se o nome de uma variável contradiz seu uso ou o tipo real de dado que contém

### Automatic

- Biome: `style/useNamingConvention` (aplica convenção de nomes; a contradição semântica nome/tipo continua sendo verificada em revisão de código)

## Related to

- [006 - Prohibition of Abbreviated Names](006_proibicao-nomes-abreviados.md): complements
- [003 - Primitive Domain Encapsulation](003_encapsulamento-primitivos.md): reinforces
- [034 - Consistent Class and Method Names](034_nomes-classes-metodos-consistentes.md): complements

---

**Created on**: 2025-10-08
**Updated on**: 2026-07-15
**Version**: 1.1
