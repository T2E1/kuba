// Import dinâmico disparado só na interação que realmente precisa do componente
class ChatInput {
  connectedCallback() {
    this.querySelector("button.emoji").addEventListener("click", async () => {
      const { EmojiPicker } = await import("@ui/emoji-picker");
      this.picker = new EmojiPicker();
    });
  }
}
