// ❌ Contrato entre mixin e componente feito por string.
// Correto em: contract.valid.js

// ─── mixin/hideable.js ────────────────────────────────────────────────────
export const Hideable = (Super) =>
  class extends Super {
    hide() {
      // O mixin chama um método pelo nome, torcendo para que exista.
      // Se o componente não implementar, quebra em runtime, sem aviso.
      this.onHide?.()
    }
  }

// ─── component/dialog.js ──────────────────────────────────────────────────
class Dialog extends Hideable(HTMLElement) {
  // O nome `onHide` é um acordo informal. Nada o documenta, nada o verifica.
  onHide() {
    this.removeAttribute('open')
  }
}

// Problemas:
//
// - `onHide` fica no namespace público do elemento. Um consumidor pode
//   sobrescrever por acidente e quebrar o mixin.
// - Colisão silenciosa: dois mixins que usem `onHide` disputam o mesmo nome
//   e o último da cadeia vence, sem erro.
// - O `?.()` esconde a falha: se o componente não implementar, nada
//   acontece e ninguém descobre até alguém notar visualmente — o mesmo
//   modo de falha do bug do Hidden com <kb-button>.
// - Não há onde documentar o contrato: ele existe só na cabeça de quem
//   escreveu os dois arquivos.
