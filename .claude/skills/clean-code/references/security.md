# Segurança (Regras 030, 031, 042)

## Regras

- **030**: Proibição de `eval()`, `new Function()` e secrets hardcoded
- **031**: Proibição de imports relativos (exigir path aliases)
- **042**: Secrets via variáveis de ambiente

## Checklist

- [ ] Sem `eval()` ou `new Function()` (exceto build tooling isolado)
- [ ] Sem concatenação de entrada do usuário em queries/comandos shell
- [ ] Sem imports com `../` (usar path aliases como `@utils/`)
- [ ] Chaves de API via `process.env` ou gerenciador de secrets
- [ ] Sem secrets no código ou versionados

## Exemplos

```typescript
// ❌ Violações
// eval (030)
function calculate(expression) {
  return eval(expression); // RCE se expression vier do usuário
}

// Secret hardcoded (030, 042)
const client = new ApiClient({ apiKey: 'sk-prod-abc123xyz' });

// Import relativo (031)
import { helper } from '../../../utils/helper'; // quebrável

// ✅ Conformidade
// Sem eval
function calculate(a: number, operator: string, b: number) {
  const ops = {
    '+': (x, y) => x + y,
    '-': (x, y) => x - y,
    '*': (x, y) => x * y,
    '/': (x, y) => x / y
  };
  return ops[operator]?.(a, b) ?? null;
}

// Secrets via variável de ambiente
const client = new ApiClient({
  apiKey: process.env.API_KEY // injetado via .env
});

// Path alias
import { helper } from '@utils/helper';

// tsconfig.json ou vite.config.js
{
  "compilerOptions": {
    "paths": {
      "@utils/*": ["./src/utils/*"]
    }
  }
}
```

## Relação com ICP

- `eval` cria acoplamento dinâmico impossível de analisar estaticamente
- Path aliases facilitam refatorações (imports não quebram ao mover arquivos)
