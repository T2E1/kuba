# Boat Anchor

**Severidade:** 🟡 Média
**Regra Associada:** Regra 067

## O Que É

Componente de software (biblioteca, módulo, classe, sistema inteiro) ou dependência mantido na base de código porque "pode ser útil no futuro", mas que atualmente não tem nenhum propósito ativo. Como uma âncora num barco: peso sem utilidade.

## Sintomas

- Dependência listada em `package.json`, `requirements.txt` mas nunca importada
- Biblioteca importada mas nunca chamada (`import X` sem uso de `X.method()`)
- Módulos importados mas nunca utilizados
- Dependências em `package.json` sem nenhuma referência no código
- Infraestrutura provisionada que ninguém usa (filas, bancos de dados, serviços)
- Código de "integração futura" escrito antes de a integração existir
- Comentários como `// será usado quando implementarmos X`

## ❌ Exemplo (violação)

```javascript
// ❌ Dependência instalada "para quando precisarmos"
// package.json tem: "pdfkit", "sharp", "node-cron"
// Nenhuma delas tem uma única linha de uso no código

// ❌ Módulo criado "para o próximo sprint"
export class ReportExporter {
  exportToExcel() { /* TODO: implementar */ }
  exportToPowerPoint() { /* TODO: implementar */ }
}
```

## ✅ Refatoração

```javascript
// ✅ Só existe o que é usado (YAGNI)
// package.json: apenas dependências com referências reais no código
// Módulo criado quando a feature for necessária, com testes desde o início

// Usar: npm-check, depcheck, pipreqs, go mod tidy para detectar
```

## Codetag Sugerido

```typescript
// FIXME: Boat Anchor — pdfkit/sharp/node-cron instalados mas nunca referenciados
// TODO: npm uninstall; criar módulo quando a necessidade for real
```
