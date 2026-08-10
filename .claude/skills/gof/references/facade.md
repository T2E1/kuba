# Facade

**Categoria:** Estrutural
**Intenção:** Fornecer uma interface simplificada para um conjunto de interfaces de um subsistema, definindo uma interface de alto nível que torna o subsistema mais fácil de usar.

---

## Quando Usar

- Simplificar interface complexa para os clientes mais comuns
- Quando o subsistema tem muitas dependências entre classes
- Para desacoplar clientes das implementações internas do subsistema
- Como ponto de entrada único para módulos com muitas partes

## Quando NÃO Usar

- Quando a Facade acumula lógica de negócio — torna-se God Object (rule 025 — The Blob)
- Quando se torna Middle Man sem valor agregado, apenas delegando (rule 061)
- Para ocultar complexidade que deveria ser resolvida com refatoração

## Estrutura Mínima (TypeScript)

```typescript
// Subsistema complexo com múltiplas classes
class AudioDecoder { decode(file: string): Buffer { return Buffer.alloc(0) } }
class VideoDecoder { decode(file: string): Buffer { return Buffer.alloc(0) } }
class AudioMixer { mix(audio: Buffer, volume: number): Buffer { return audio } }

// Facade: interface simples para subsistema complexo
class VideoPlayerFacade {
  private readonly audioDecoder = new AudioDecoder()
  private readonly videoDecoder = new VideoDecoder()
  private readonly audioMixer = new AudioMixer()

  play(videoFile: string): void {
    const audio = this.audioDecoder.decode(videoFile)
    const video = this.videoDecoder.decode(videoFile)
    const mixed = this.audioMixer.mix(audio, 1.0)
    // renderiza vídeo com áudio mixado
  }
}
```

## Exemplo de Uso Real

```typescript
new VideoPlayerFacade().play('video.mp4')
```

## Relacionado a

- [adapter.md](adapter.md): complementa — Adapter converte interface incompatível; Facade simplifica interface existente
- [mediator.md](mediator.md): complementa — ambos simplificam dependências; Mediator coordena objetos que se conhecem mutuamente; Facade define interface simples para subsistema
- [rule 025 - Proibição do Anti-Pattern The Blob](../../../rules/025_proibicao-anti-pattern-the-blob.md): reforça — Facade não deve conter lógica de negócio, apenas delegar
- [rule 061 - Proibição de Middle Man](../../../rules/061_proibicao-middle-man.md): reforça — Facade deve simplificar, não ser wrapper vazio
- [rule 014 - Princípio da Inversão de Dependência](../../../rules/014_principio-inversao-dependencia.md): complementa — clientes dependem da Facade, isolados das classes concretas do subsistema

---

**Categoria GoF:** Estrutural
**Fonte:** Design Patterns — Gamma, Helm, Johnson, Vlissides (1994)
