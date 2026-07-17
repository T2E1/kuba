import { attributeChanged } from '@directive'

/**
 * Adds a `template` property backed by the `template` attribute (an id
 * reference to a `<template>` element elsewhere in the document). Reading it
 * lazily resolves and caches the host's own `<template>` child, returning its
 * `innerHTML` if present or the concatenated `outerHTML` of its children
 * otherwise.
 */
const Template = (Super) => {
  class C extends Super {
    #template

    get template() {
      const { innerHTML, children } = (this.#template ??=
        this.querySelector('template'))
      return (
        innerHTML ||
        Array.from(children)
          .map((child) => child.outerHTML)
          .join('')
      )
    }

    @attributeChanged('template')
    set template(value) {
      this.#template = document.querySelector(`#${value}`)
    }
  }

  return C
}

export default Template
