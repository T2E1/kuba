# §8 — Crosscutting Concepts

**Section:** 8 de 12
**Audience:** Técnico (dev, arquiteto)
**When to update:** Ao adotar novo padrão transversal, ao mudar estratégia de logging, segurança ou tratamento de erros.

---

## Purpose

Esta seção documenta os conceitos e padrões que se aplicam transversalmente a todo o sistema — não pertencem a um único componente, mas afetam todos. Exemplos: logging, segurança, tratamento de erros, autenticação, internacionalização, auditoria. Estes são os "eixos horizontais" que cortam todos os "eixos verticais" (features).

## Template

```markdown
# §8 — Crosscutting Concepts

## Logging e Observabilidade

**Estratégia:** [Descrever a abordagem: structured logging, centralized, distributed tracing]

| Aspecto | Decisão | Exemplo |
|---------|---------|---------|
| Formato | [ex: JSON estruturado] | `{"level":"info","msg":"...","ts":"...","traceId":"..."}` |
| Destino | [ex: stdout → plataforma coleta] | Cloudflare Logpush |
| Níveis | [ex: error, warn, info, debug] | `LOG_LEVEL=info` em produção |
| Campos obrigatórios | [ex: traceId, userId, duration] | Todos os logs de request |
| Campos proibidos | [ex: passwords, tokens, PII] | Nunca logar dados sensíveis |

```typescript
// Padrão de log obrigatório
logger.info({
  msg: "[descrição da ação]",
  traceId: context.traceId,
  userId: context.userId,
  duration: performance.now() - startTime,
});
```

## Tratamento de Erros

**Estratégia:** [Descrever a hierarquia de erros e o fluxo de propagação]

```typescript
// Hierarquia de erros do domínio
class BaseDomainError extends Error {
  constructor(
    readonly code: string,
    message: string,
  ) {
    super(message);
    this.name = this.constructor.name;
  }
}

class ValidationError extends BaseDomainError {}
class NotFoundError extends BaseDomainError {}
class ConflictError extends BaseDomainError {}
```

| Tipo de Erro | Classe | Status HTTP | Quando Usar |
|-------------|--------|-------------|-------------|
| Validação de entrada | `ValidationError` | 400 | Schema inválido, campo obrigatório ausente |
| Recurso não encontrado | `NotFoundError` | 404 | Entidade não existe no banco |
| Regra de negócio violada | `DomainError` | 422 | Pré-condição de negócio não atendida |
| Conflito de estado | `ConflictError` | 409 | Duplicidade, corrida de dados |
| Erro inesperado | `Error` base | 500 | Nunca deve chegar ao usuário com detalhe |

## Segurança

| Aspecto | Mecanismo | Implementação |
|---------|-----------|---------------|
| Autenticação | [ex: JWT Bearer token] | [ex: Verificação no middleware de controller] |
| Autorização | [ex: Role-based] | [ex: Guard clause no início de cada handler] |
| Secrets | Variáveis de ambiente | Nunca hardcoded — regra 030 |
| Inputs | Validação de schema | [ex: Zod, no primeiro ponto de entrada] |
| Headers | [ex: CORS, CSP, HSTS] | [ex: Configurados no middleware global] |

## Validação de Dados

**Estratégia:** [Descrever onde e como os dados são validados]

```typescript
// Validação sempre na fronteira de entrada (controller)
const schema = z.object({
  field: z.string().min(1).max(255),
});

const result = schema.safeParse(input);
if (!result.success) {
  throw new ValidationError("INVALID_INPUT", result.error.message);
}
```

## Internacionalização

| Aspecto | Decisão |
|---------|---------|
| Idioma padrão | [ex: pt-BR] |
| Formato de data | [ex: ISO 8601 — YYYY-MM-DD] |
| Formato de moeda | [ex: BRL, centavos como integer] |
| Timezone | [ex: UTC no banco; conversão no frontend] |

## Auditoria

| Evento | O Que Registrar | Onde Armazenar |
|--------|----------------|----------------|
| [ex: Criação de entidade] | userId, timestamp, payload | [ex: Tabela de audit_log] |
| [ex: Atualização crítica] | userId, before, after, reason | [ex: Tabela de audit_log] |
| [ex: Deleção] | userId, timestamp, entityId | [ex: Tabela de audit_log] |
```

## Conventions

- Logging deve seguir regra 050 (logs como fluxo de eventos — stdout apenas)
- Erros de domínio são obrigatórios — proibido retornar null ou código de erro genérico
- Validação sempre na fronteira — nunca no meio do service ou repository
- Crosscutting concepts devem ter exemplos de código concretos, não apenas descrição

## Related to

- [rule 027 Erros de Domínio](../../../rules/027_qualidade-tratamento-erros-dominio.md): complementa — hierarquia de erros aqui documentada
- [rule 050 Logs como Eventos](../../../rules/050_logs-fluxo-eventos.md): complementa — estratégia de logging baseada nesta regra
- [rule 030 Funções Inseguras](../../../rules/030_proibicao-funcoes-inseguras.md): complementa — secrets via env, validação de inputs
- [rule 028 Exceção Assíncrona](../../../rules/028_tratamento-excecao-assincrona.md): complementa — tratamento de promises

---

**Arc42 Section:** §8
**Source:** arc42.org — arc42 Template, adaptado para pt-BR
