// ✅ Cada pacote define o próprio vocabulário — Regra 1.

// src/behavior/redirect/types.d.ts
//
// Nenhum import. O redirect nomeia o próprio atributo `on`, mesmo que a
// forma coincida exatamente com o atributo `value` de <kb-on>.

type KUBARedirectOnAttributeSink = 'method' | 'attribute' | 'setter'

type KUBARedirectOnAttribute =
  `${string}/${string}:${KUBARedirectOnAttributeSink}/${string}${'' | `|${string}`}`

export default class KUBARedirectElement extends HTMLElement {
  on: KUBARedirectOnAttribute | (string & {})
}

declare global {
  interface HTMLElementTagNameMap {
    'kb-redirect': KUBARedirectElement
  }
}

// A duplicação de duas linhas entre pacotes é deliberada, e é mais barata
// que o acoplamento que o compartilhamento criaria. A própria rule 021
// excepciona "pequenas repetições em definições estruturais de baixo nível".
//
// Verificação: `grep -n "^import" types.d.ts` não deve retornar nada.
// Todos os types.d.ts deste repositório estão livres de imports hoje.
