# Proibição de Agrupamentos de Dados Repetidos (Data Clumps)

**ID**: AP-20-053
**Severity**: 🟡 Medium
**Category**: Structural

---

## What it is

Data Clumps ocorrem quando grupos de dados sempre aparecem juntos como parâmetros de função, atributos de classe ou variáveis locais, mas não possuem seu próprio objeto ou estrutura representando aquele conceito coeso. São primitivos que sempre viajam juntos mas nunca se casaram.

## Why it matters

- Inflação de parâmetros: funções recebem muitos valores individuais em vez de um objeto
- Validação duplicada: mesma lógica de validação repetida em múltiplos locais
- Mudança custosa: alterar o conceito requer modificar N assinaturas de função
- Baixa coesão conceitual: o domínio é modelado como primitivos espalhados
- Dificuldade de extensão: adicionar novo campo requer alterar todas as funções que usam o grupo

## Objective Criteria

- [ ] 3 ou mais parâmetros aparecendo juntos em mais de 2 funções diferentes
- [ ] Grupo de atributos que são sempre lidos/escritos juntos em uma classe
- [ ] Remover um elemento de dados do grupo torna os outros sem significado ou incompletos
- [ ] Mesmo conjunto de tipos/formato aparece repetidamente em assinaturas de métodos
- [ ] Validação de campos é idêntica em diferentes locais do código

## Allowed Exceptions

- Grupos temporários em eventos únicos ou scripts de migração
- Integrações com APIs externas que não permitem objetos customizados
- Código legado onde refatoração traria alto risco sem ganho claro

## How to Detect

### Manual

- Procurar assinaturas de função com parâmetros repetidos com exatamente o mesmo nome/tipo
- Identificar funções que sempre recebem `(rua, cidade, cep, pais)`, `(startX, startY, endX, endY)`, `(dia, mes, ano)`
- Buscar padrões de coerência: se um campo muda, os outros sempre mudam juntos

### Automatic

- Sem regra nativa de Biome para detectar grupos de parâmetros repetidos — detecção via revisão de código ("Introduce Parameter Object")

## Related to

- [003 - Primitive Domain Encapsulation](003_encapsulamento-primitivos.md): reinforces
- [033 - Maximum Function Parameters](033_limite-parametros-funcao.md): complements
- [034 - Consistent Class and Method Names](034_nomes-classes-metodos-consistentes.md): complements
- [037 - Prohibition of Flag Arguments](037_proibicao-argumentos-sinalizadores.md): reinforces

---

**Created on**: 2026-03-28
**Updated on**: 2026-07-15
**Version**: 1.1
