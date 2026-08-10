# SECURITY — Vulnerabilidade de Segurança

**Severidade:** 🔴 Crítica
**Bloqueia PR:** Sim (NUNCA fazer merge com SECURITY pendente)

## O Que É

Marca código com vulnerabilidade de segurança potencial ou confirmada. Esta é a codetag mais crítica — código marcado com SECURITY não deve ir para produção até ser resolvido.

## Quando Usar

- Injeção (SQL, Command, XSS) — entrada do usuário não sanitizada em query
- Exposição de dados sensíveis — logs com PII, secrets no código
- Falha de autenticação/autorização — bypass de permissão
- Configuração insegura — CORS *, debug em produção

## Quando NÃO Usar

- Bug sem implicação de segurança → usar BUG ou FIXME
- Código funciona mas é feio → usar REFACTOR
- Melhoria de performance → usar OPTIMIZE
- Código temporário sem risco → usar HACK

## Formato

```typescript
// SECURITY: tipo de vulnerabilidade - ação necessária
// SECURITY: [OWASP-XX] descrição do risco
// SECURITY: descrição - impacto: o que poderia acontecer
```

## Exemplo

```typescript
// SECURITY: SQL injection - usar prepared statement
function getUser(username: string) {
  return db.query(`SELECT * FROM users WHERE username = '${username}'`);
  // Atacante pode passar: ' OR '1'='1
}

// ✅ Corrigido
function getUser(username: string) {
  return db.query('SELECT * FROM users WHERE username = ?', [username]);
}

// SECURITY: XSS - não usar innerHTML com entrada do usuário
function renderComment(comment: Comment): void {
  element.innerHTML = comment.text; // ❌ Pode executar <script>
}

// ✅ Corrigido
function renderComment(comment: Comment): void {
  element.textContent = comment.text;
  // Ou se precisar de HTML: element.innerHTML = DOMPurify.sanitize(comment.text);
}

// SECURITY: chave de API exposta no código - mover para variáveis de ambiente
const stripe = new Stripe('sk_live_abc123xyz789'); // ❌

// ✅ Corrigido
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
```

## Resolução

- **Prazo:** Imediatamente — não fazer merge até resolver
- **Ação:** PARAR → Avaliar risco → Corrigir imediatamente → Revisar com especialista → Testar com casos de ataque → Documentar → Remover comentário
- **Convertido em:** N/A (removido após correção)

## Relacionado a

- Rules: [030](../../../.claude/rules/030_proibicao-funcoes-inseguras.md), [042](../../../.claude/rules/042_configuracoes-via-ambiente.md)
- Tags similares: SECURITY é crítico de segurança, FIXME é crítico funcional
