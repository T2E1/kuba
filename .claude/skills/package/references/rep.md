# REP — Release Reuse Equivalency Principle

**Grupo:** Coesão
**Rule deMGoncalves:** [015 - Princípio de Equivalência de Lançamento e Reuso](../../../rules/015_principio-equivalencia-lancamento-reuso.md)
**Pergunta:** A granularidade de reuso é a mesma da granularidade de release?

## O Que É

O módulo/pacote destinado à reutilização deve ter o mesmo escopo de release que seu consumidor. **A granularidade de reutilização é a granularidade de release.**

Classes que são reutilizadas juntas devem ser lançadas juntas. Se uma classe dentro de um pacote é modificada, todas as classes do pacote devem ter nova versão (não sub-versioning).

## Quando está sendo violado

- Pacote contém classes que não são utilizadas em conjunto pelos clientes
- Clientes são forçados a aceitar módulos/classes que não utilizam em um release
- Classes dentro do mesmo pacote têm ciclos de release diferentes
- Atualização de biblioteca exige aceitar N classes não usadas

## ❌ Violação

```typescript
// @company/utils v1.2.0
export class DateUtils { /* ... */ }
export class StringUtils { /* ... */ }
export class EmailValidator { /* ... */ }
export class ImageProcessor { /* ... */ }  // ❌ uso isolado
export class PDFGenerator { /* ... */ }    // ❌ uso isolado

// Cliente A usa apenas DateUtils + StringUtils
// Cliente B usa apenas EmailValidator
// Cliente C usa apenas ImageProcessor

// Problema: atualizar DateUtils força todos os clientes
// a atualizar o pacote inteiro e aceitar classes não usadas
```

## ✅ Correto

```typescript
// Pacotes com granularidade de reuso = granularidade de release

// @company/date-utils v1.2.0
export class DateUtils { /* ... */ }
export class DateFormatter { /* ... */ }
// Usados juntos, lançados juntos ✅

// @company/string-utils v2.1.0
export class StringUtils { /* ... */ }
export class StringValidator { /* ... */ }
// Usados juntos, lançados juntos ✅

// @company/validators v1.0.3
export class EmailValidator { /* ... */ }
export class UrlValidator { /* ... */ }
export class PhoneValidator { /* ... */ }
// Usados juntos (validação), lançados juntos ✅

// Cliente instala apenas o que usa
{
  "dependencies": {
    "@company/date-utils": "^1.2.0",
    "@company/validators": "^1.0.3"
  }
}
```
