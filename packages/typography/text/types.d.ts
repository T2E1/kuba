export default class KbText extends HTMLElement {
  align: 'left' | 'center' | 'right' | 'justify'
  color: string
  family: string
  lineHeight: string
  size: string
  weight: string
}

declare global {
  interface HTMLElementTagNameMap {
    'kb-text': KbText
  }
}
