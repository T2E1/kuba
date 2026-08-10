# Portability — Portabilidade

**Dimensão:** Transição
**Severidade Padrão:** 🟡 Sugestão
**Questão-Chave:** Pode rodar em outro ambiente?

## O que é

O esforço necessário para transferir o software de um ambiente de hardware/software para outro. Alta portabilidade significa que a aplicação pode rodar em diferentes sistemas operacionais, navegadores ou infraestruturas de nuvem com modificações mínimas ou nenhuma.

## Indicadores de Problema

| Situação | Severidade |
|----------|-----------|
| Caminho absoluto hardcoded | 🟠 Importante |
| Vendor lock-in em serviço crítico | 🟠 Importante |
| Comando de shell sem fallback | 🟡 Sugestão |
| Quebra de linha hardcoded | 🟡 Sugestão |

## Exemplo de Violação

```javascript
// ❌ Não portável - caminho específico do sistema
const configPath = '/home/user/app/config.json';
const tempDir = 'C:\\Users\\Admin\\Temp';

// ✅ Portável - caminhos relativos ou via variável de ambiente
const configPath = path.join(process.cwd(), 'config.json');
const tempDir = process.env.TEMP_DIR || os.tmpdir();
```

## Codetags Sugeridas

```javascript
// PORTABILITY(042): Caminho absoluto - usar variável de ambiente
// PORTABILITY: Comando específico do Linux - adicionar fallback
```

## Calibração de Severidade

| Situação | Severidade |
|----------|-----------|
| Caminho absoluto hardcoded | 🟠 Importante |
| Vendor lock-in em serviço crítico | 🟠 Importante |
| Comando de shell sem fallback | 🟡 Sugestão |
| Quebra de linha hardcoded | 🟡 Sugestão |

## Regras Relacionadas

- 042 - Configurações via Ambiente
- 041 - Declaração Explícita de Dependências
- 024 - Proibição de Constantes Mágicas
