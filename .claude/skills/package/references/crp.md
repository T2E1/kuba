# CRP — Common Reuse Principle

**Grupo:** Coesão
**Rule deMGoncalves:** [017 - Princípio do Reuso Comum](../../../rules/017_principio-reuso-comum.md)
**Pergunta:** Classes em um pacote são reutilizadas em conjunto? Se você usa uma, usa todas?

## O Que É

**Classes em um pacote devem ser reutilizadas em conjunto. Se você usa uma, você deve usar todas.**

CRP ajuda a refinar a granularidade dos pacotes, garantindo que clientes não sejam forçados a depender de classes que não utilizam. Evita recompilações/redeploys desnecessários e reduz acoplamento indesejado.

## Quando está sendo violado

- Pacote tem classes não utilizadas por pelo menos 50% dos clientes que o importam
- Uma classe é utilizada isoladamente mas está em pacote com muitas outras classes não relacionadas
- Mais de 3 classes públicas no pacote não são referenciadas externamente

## ❌ Violação

```typescript
// @company/core-utils v2.0.0
export class Logger { /* ... */ }
export class Cache { /* ... */ }
export class Database { /* ... */ }
export class EmailSender { /* ... */ }
export class FileUploader { /* ... */ }
export class Analytics { /* ... */ }

// Cliente A
import { Logger, Cache } from '@company/core-utils';
// Usa 2 de 6 classes (33%) ❌

// Cliente B
import { Database } from '@company/core-utils';
// Usa 1 de 6 classes (16%) ❌

// Cliente C
import { EmailSender, FileUploader } from '@company/core-utils';
// Usa 2 de 6 classes (33%) ❌

// Problema: ninguém usa todas as classes juntas
// Pacote muito heterogêneo
```

## ✅ Correto

```typescript
// Pacotes coesos — reutilização em conjunto ✅

// @company/logging v1.0.0
export class Logger { /* ... */ }
export class LogFormatter { /* ... */ }
export class LogTransport { /* ... */ }
// Cliente usa Logger? Provavelmente usa LogFormatter também ✅

// @company/storage v2.0.0
export class Cache { /* ... */ }
export class Database { /* ... */ }
export class CacheStrategy { /* ... */ }
// Cliente usa Cache? Provavelmente usa CacheStrategy também ✅

// @company/notifications v1.5.0
export class EmailSender { /* ... */ }
export class EmailTemplate { /* ... */ }
export class EmailQueue { /* ... */ }
// Cliente usa EmailSender? Provavelmente usa EmailTemplate também ✅

// Cliente A
import { Logger, LogFormatter } from '@company/logging';
// Usa 2 de 3 classes (66%) ✅

// Cliente B
import { Database, Cache } from '@company/storage';
// Usa 2 de 3 classes (66%) ✅
```
