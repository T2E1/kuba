---
title: "Componente sem Teste de Comportamento (Lack of Tests)"
category: "Component Anti-Patterns"
type: reference
id: "BEHAVIORAL-040"
severity: "🔴 Critical"
tags: [component-anti-patterns]
---

# Componente sem Teste de Comportamento (Lack of Tests)

## Explanation

### O que é

Proíbe que um componente alcançável pelo consumidor entre na branch principal sem ao
menos um teste que exercite o seu comportamento **pela interface que o usuário usa** —
não pela estrutura interna. A skill `clean-code` fixa a cobertura mínima; esta fixa o que o teste
precisa provar.

*(Previne o anti-pattern Lack of Tests: a suíte verde que não impede nenhuma regressão
observável.)*

### Por que importa

- Componente sem teste de comportamento só é verificado por alguém abrindo a tela, e isso
  não acontece em toda alteração — a regressão chega ao usuário
- Teste que assere estrutura interna quebra em refatoração que não muda nada para quem
  usa, e passa em mudança que quebra tudo: custo sem proteção
- Sem prova do comportamento, a documentação do componente descreve intenção, não fato
- A ausência é invisível: nada falha, o número de cobertura pode até subir por linhas
  executadas incidentalmente
- Refatorar sem rede transforma qualquer melhoria em risco, e o código congela

## How-to

### Exemplo

```tsx
// ❌ testa estrutura, e emite a saída em vez de provocá-la
test('renders', () => {
  const { container } = render(<Rating value={3} onChange={onChange} />)
  expect(container.querySelector('.star--active')).toBeTruthy()
  onChange(4)
  expect(onChange).toHaveBeenCalledWith(4)
})
```

```tsx
// ✅ interage como o usuário e prova a saída pela interação
test('emits the selected value when a star is chosen', async () => {
  const onChange = vi.fn()
  render(<Rating value={3} onChange={onChange} />)
  await userEvent.click(screen.getByRole('radio', { name: '4 de 5' }))
  expect(onChange).toHaveBeenCalledWith(4)
})
```

Codetag sugerido para dívida não resolvida agora:

```typescript
// TODO(075): Rating sem teste de comportamento — cobrir seleção, teclado e estado desabilitado
```

## Reference

### Critérios Objetivos

- [ ] Todo componente exportado pela superfície pública do pacote tem ao menos **1**
  teste que o renderiza e interage por papel acessível, texto ou rótulo — nunca por
  estrutura interna, nome de classe ou índice de filho.
- [ ] Toda saída documentada do componente — callback, evento, mudança de estado
  observável — tem um teste que a provoca por interação e verifica a carga.
- [ ] Nenhum teste emite a saída manualmente para depois verificar que ela foi emitida.
- [ ] Todo estado de exceção declarado no contrato — vazio, erro, carregando, desabilitado
  — tem teste próprio.
- [ ] `pnpm coverage:diff` passa no limite do gate de cobertura de diff.

### Exceções Permitidas

- **Componente puramente estrutural**: aquele sem entrada, sem saída e sem estado, cujo
  retorno é constante — coberto pelo teste de quem o compõe.
- **Reexportação**: arquivo que só reexporta não é componente e não exige teste próprio.
- **Protótipo com prazo**: exploração marcada com codetag `TODO` e data, fora do caminho
  de produção.
- **Componente em depreciação**: marcado com codetag `DEPRECATED` e com a substituição
  nomeada, desde que não receba funcionalidade nova.

### Como Detectar

#### Manual

- Listar os componentes exportados e cruzar com os arquivos de teste existentes
- Ler os testes e classificar cada asserção: comportamento observável ou estrutura interna
- Procurar testes que constroem a saída em vez de provocá-la
- Conferir se cada estado descrito na documentação aparece num caso de teste

#### Automático

- `pnpm test:coverage` — relatório de cobertura da suíte
- `pnpm coverage:diff` — gate de cobertura sobre o diff
- Sem regra nativa de Biome que distinga teste de comportamento de teste de estrutura —
  detecção via revisão de código

## Related to

- [Minimum Test Coverage Quality](../skills/clean-code/SKILL.md): depends on
- [Interface Segregation Principle (ISP)](../skills/solid/SKILL.md): reinforces
- [Boy Scout Rule (Continuous Refactoring)](../skills/clean-code/SKILL.md): complements
- [042 — God Component](042_god-component.md): complements
