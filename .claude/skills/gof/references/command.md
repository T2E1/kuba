# Command

**Categoria:** Comportamental
**Intenção:** Encapsular uma requisição como um objeto, permitindo parametrizar clientes com diferentes requisições, enfileirar, registrar e suportar operações reversíveis.

---

## Quando Usar

- Implementar undo/redo
- Enfileirar operações para execução diferida
- Registrar histórico de operações
- Implementar transações que podem ser revertidas

## Quando NÃO Usar

- Para operações simples sem necessidade de undo/enfileiramento (overengineering — rule 064)
- Quando a sobrecarga de criar objetos Command supera o benefício
- Quando a operação não precisa ser armazenada, desfeita ou repassada

## Estrutura Mínima (TypeScript)

```typescript
interface Command {
  execute(): void
  undo(): void
}

class TextEditor {
  private text = ''
  insertText(text: string): void { this.text += text }
  deleteText(length: number): void { this.text = this.text.slice(0, -length) }
  getText(): string { return this.text }
}

class InsertCommand implements Command {
  constructor(
    private readonly editor: TextEditor,
    private readonly text: string
  ) {}

  execute(): void { this.editor.insertText(this.text) }
  undo(): void { this.editor.deleteText(this.text.length) }
}

class CommandHistory {
  private readonly history: Command[] = []

  execute(command: Command): void {
    command.execute()
    this.history.push(command)
  }

  undo(): void {
    this.history.pop()?.undo()
  }
}
```

## Exemplo de Uso Real

```typescript
const history = new CommandHistory()
history.execute(new InsertCommand(editor, 'Hello'))
```

## Relacionado a

- [memento.md](memento.md): complementa — Command registra operações para undo; Memento salva estado para rollback
- [chain-of-responsibility.md](chain-of-responsibility.md): complementa — Chain define quem processa; Command encapsula o que é processado
- [rule 010 - Princípio da Responsabilidade Única](../../../rules/010_principio-responsabilidade-unica.md): reforça — cada Command encapsula uma única operação reversível
- [rule 036 - Restrição de Funções com Efeitos Colaterais](../../../rules/036_restricao-funcoes-efeitos-colaterais.md): reforça — execute() é Command explícito com efeito colateral intencional e documentado
- [rule 064 - Proibição de Overengineering](../../../rules/064_proibicao-overengineering.md): reforça — não use sem necessidade real de undo ou histórico

---

**Categoria GoF:** Comportamental
**Fonte:** Design Patterns — Gamma, Helm, Johnson, Vlissides (1994)
