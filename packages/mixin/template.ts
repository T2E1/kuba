import { attributeChanged } from '@directive'

/**
 * React appends template children to the element's own child list instead of
 * into `content`, which leaves `innerHTML` empty. Cloning the real child list
 * into a throwaway template serializes both cases — text nodes included —
 * without mutating the DOM React owns.
 */
const serializeTemplate = (template) => {
  const source = template.content.hasChildNodes() ? template.content : template
  const shell = document.createElement('template')
  shell.content.append(...source.cloneNode(true).childNodes)
  return shell.innerHTML
}

/**
 * Adds a `template` property backed by the `template` attribute (an id
 * reference to a `<template>` element elsewhere in the document). Reading it
 * lazily resolves and caches the host's own `<template>` child, returning the
 * serialized markup of its content, or an empty string when no template is
 * found.
 */
const Template = (Super) => {
  class C extends Super {
    #template

    get template() {
      this.#template ??= this.querySelector('template')
      if (!this.#template) return ''
      return serializeTemplate(this.#template)
    }

    @attributeChanged('template')
    set template(value) {
      this.#template = document.querySelector(`#${value}`)
    }
  }

  return C
}

export default Template
