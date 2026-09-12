// Import estático de um componente raramente usado infla o bundle inicial para todos
import { EmojiPicker } from "@ui/emoji-picker";

class ChatInput {
  connectedCallback() {
    this.picker = new EmojiPicker();
  }
}
