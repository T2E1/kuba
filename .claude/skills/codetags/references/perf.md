# PERF — Gargalo de Performance

**Severidade:** 🟡 Média | Resolver na sprint atual se afetando usuários
**Bloqueia PR:** Não (mas deve ser priorizado)

## O Que É

Marca gargalo de performance identificado que está causando ou pode causar problemas reais. Mais urgente que OPTIMIZE — indica problema já medido ou observado em produção.

## Quando Usar

- Gargalo medido com métricas (query levando > 1s)
- Problema observado por usuários (UI congelando)
- Limite de recurso atingido (vazamento de memória identificado)
- Timeout frequente (API expirando em > 10% das requisições)

## Quando NÃO Usar

- Otimização teórica sem medição → usar **OPTIMIZE**
- Código incorreto → usar **FIXME**
- Melhoria de estrutura → usar **REFACTOR**
- Suspeita sem medição → medir primeiro

## Formato

```typescript
// PERF: descrição do gargalo - métrica medida
// PERF: [p95: 2.5s] descrição - alvo: 500ms
// PERF: descrição - impacto: X usuários afetados
```

## Exemplo

```typescript
// PERF: [p95: 3.2s] query sem índice - adicionar índice em user_id
// Alvo: < 100ms | Afeta: página de pedidos
async function getOrderHistory(userId: string) {
  return db.query(`
    SELECT * FROM orders
    WHERE user_id = ?
    ORDER BY created_at DESC
  `, [userId]);
}

// PERF: vazamento de memória - event listeners não removidos
// Memória cresce 50MB/hora em uso contínuo
function setupListeners(element: HTMLElement) {
  window.addEventListener('resize', handleResize);
  window.addEventListener('scroll', handleScroll);
  // Faltando: função de cleanup para remover listeners
}

// PERF: [+250KB] import completo do lodash
// Impacto: +1.5s no LCP mobile
import _ from 'lodash';
const result = _.pick(data, ['id', 'name']);

// PERF: re-render a cada tecla pressionada - necessita debounce
// CPU: 100% durante digitação rápida
function SearchComponent() {
  const [query, setQuery] = useState('');
  useEffect(() => {
    fetchResults(query); // Chamado a cada caractere
  }, [query]);
  return <input onChange={e => setQuery(e.target.value)} />;
}
```

## Resolução

- **Prazo:** Imediatamente (usuários reclamando) ou sprint atual (degradação mensurável)
- **Ação:** Medir métrica atual, definir alvo, identificar causa raiz, implementar correção, medir novamente, monitorar
- **Convertido em:** Removido após correção confirmada por métricas

## Relacionado a

- Rules: [022 - KISS](../../../.claude/rules/022_priorizacao-simplicidade-clareza.md) (código simples é mais performático)
- Tags similares: PERF (problema real) vs OPTIMIZE (oportunidade teórica)
