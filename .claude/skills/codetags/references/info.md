# INFO — Informação Técnica Adicional

**Severidade:** 🟢 Baixa | Informativa
**Bloqueia PR:** Não

## O Que É

Marca informação técnica adicional ou explicação que ajuda a entender o código. Menos crítico que NOTE — é contexto útil mas não essencial para modificar o código.

## Quando Usar

- Referência a documentação externa (link para spec ou RFC)
- Explicação de algoritmo (como funciona internamente)
- Contexto técnico (limitação de biblioteca)
- Exemplo de uso (como a função é chamada)

## Quando NÃO Usar

- Decisão importante → usar **NOTE**
- Tarefa pendente → usar **TODO**
- Código perigoso → usar **XXX**
- Documentação de API → usar JSDoc/TSDoc

## Formato

```typescript
// INFO: detalhe técnico adicional
// INFO: referência à documentação
// INFO: explicação de algoritmo ou padrão
```

## Exemplo

```typescript
// INFO: implementação baseada na Web Crypto API
// Spec: https://www.w3.org/TR/WebCryptoAPI/
async function generateKey() {
  return crypto.subtle.generateKey(
    { name: 'AES-GCM', length: 256 },
    true,
    ['encrypt', 'decrypt']
  );
}

// INFO: embaralhamento Fisher-Yates - O(n) com distribuição uniforme
// Cada elemento tem probabilidade igual de estar em qualquer posição
function shuffle<T>(array: T[]): T[] {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

// INFO: date-fns não suporta timezone nativo
// Para operações com timezone, usar date-fns-tz
import { format } from 'date-fns';

// INFO: uso típico:
// const result = pipe(double, addOne, square)(5); // ((5 * 2) + 1)² = 121
function pipe<T>(...fns: Array<(arg: T) => T>) {
  return (value: T) => fns.reduce((acc, fn) => fn(acc), value);
}

// INFO: formato de resposta esperado:
// { "data": { "user": { "id": "123", "name": "João" } } }
async function fetchUser(id: string) {
  const response = await api.get(`/users/${id}`);
  return response.data.user;
}

// INFO: useEffect com array vazio executa apenas na montagem
// Equivalente a componentDidMount em componentes de classe
useEffect(() => {
  initializeAnalytics();
}, []);

// INFO: 86400000 = 24h * 60min * 60s * 1000ms
// Representa um dia completo em milissegundos
const ONE_DAY_MS = 86400000;
```

## Resolução

- **Prazo:** N/A (informativo, leitura opcional)
- **Ação:** Ler se precisar entender detalhes, ignorar se já souber, atualizar se links quebrarem, remover se for trivial
- **Convertido em:** Removido se informação for comum ou atualizado se link quebrar

## Relacionado a

- Rules: [026 - Qualidade de Comentários](../../../.claude/rules/026_qualidade-comentarios-porque.md) (INFO complementa, não substitui código bom)
- Tags similares: INFO (contexto extra) vs NOTE (decisão crítica)
