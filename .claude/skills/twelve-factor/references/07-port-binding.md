# Fator 07 — Port Binding

**Regra deMGoncalves:** [046 - Port Binding](../../../rules/046_port-binding.md)
**Questão:** Aplicação autocontida com servidor HTTP embutido (não depende de servidor externo)?

## O que é

A aplicação deve ser **completamente autocontida** e expor seus serviços através de *port binding*. Ela não deve depender de um servidor web externo (Apache, Nginx) injetado em runtime para ser executável — o servidor HTTP deve ser embutido na aplicação.

**Port binding = aplicação portável + arquitetura de microserviços natural.**

## Critérios de Conformidade

- [ ] Aplicação inicia seu próprio servidor HTTP/HTTPS e faz bind na porta especificada por variável de ambiente
- [ ] Zero dependência de configuração de servidor web externo (VirtualHost, .htaccess) para funcionar
- [ ] Porta de execução configurável via `PORT` ou equivalente (não hardcoded)

## ❌ Violação

```typescript
// Porta hardcoded ❌
const app = express();
app.listen(3000);  // não configurável

// Dependência de servidor externo ❌
// Apache + mod_proxy configurado em /etc/apache2/sites-enabled/
# VirtualHost necessário para a app funcionar
<VirtualHost *:80>
  ProxyPass / http://localhost:3000/
</VirtualHost>
```

## ✅ Conforme

```typescript
// Porta configurável via variável de ambiente ✅
const app = express();
const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});

// Servidor HTTP embutido na aplicação
import { serve } from '@hono/node-server';
import { Hono } from 'hono';

const app = new Hono();
serve({ fetch: app.fetch, port: Number(process.env.PORT) });
```

## Codetag quando violado

```typescript
// FIXME: Porta hardcoded — usar process.env.PORT
const PORT = 8080;
```
