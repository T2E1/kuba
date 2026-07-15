# Proibição da Duplicação de Lógica (Princípio DRY)

**ID**: STRUCTURAL-021
**Severity**: 🔴 Critical
**Category**: Structural

---

## What it is

Exige que cada peça de conhecimento tenha uma representação única, não ambígua e autoritativa dentro do sistema. Proíbe a duplicação de lógica ou código funcionalmente idêntico.

*(Previne o anti-pattern Cut-and-Paste Programming: reuso de código por cópia em vez de abstração, criando N fontes de verdade que divergem com o tempo.)*

## Why it matters

- Cria um débito técnico severo: uma alteração exige modificar N trechos duplicados
- Aumenta o risco de bugs de regressão quando uma cópia é atualizada e outra é esquecida
- Eleva o custo de manutenção de forma exponencial conforme o código cresce
- Torna revisões de código mais lentas, pois a mesma lógica precisa ser reavaliada em múltiplos lugares

## Objective Criteria

- [ ] É proibida a cópia direta de blocos de código com mais de **5** linhas entre classes ou métodos.
- [ ] Lógica complexa usada em mais de **2** locais deve ser extraída para uma função ou classe reutilizável.
- [ ] O reuso deve ser feito via abstração (função, classe, interface) e não via *copy-paste*.

## Allowed Exceptions

- **Configurações de Baixo Nível**: Pequenas repetições em arquivos de configuração ou DTOs puramente estruturais.
- **Testes Unitários**: Configuração de *fixtures* ou *setups* para cenários de teste específicos.

## How to Detect

### Manual

- Buscar trechos de código que parecem idênticos, mas têm pequenas variações (duplicação sutil)

### Automatic

- Sem regra nativa de Biome para detecção semântica de duplicação — usar ferramenta dedicada de análise de similaridade de código

## Related to

- [010 - Single Responsibility Principle (SRP)](010_principio-responsabilidade-unica.md): reinforces
- [007 - Maximum Lines per Class File](007_limite-maximo-linhas-classe.md): reinforces
- [022 - Simplicity and Clarity (KISS)](022_priorizacao-simplicidade-clareza.md): complements
- [040 - Single Codebase](040_base-codigo-unica.md): complements
- [058 - Prohibition of Shotgun Surgery](058_proibicao-shotgun-surgery.md): reinforces

---

**Created on**: 2025-10-08
**Updated on**: 2026-07-15
**Version**: 1.1
