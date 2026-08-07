# Naming

We don't use Atomic Design. We tried it early on, but spending energy sorting
what was an "atom", a "molecule" or an "organism" didn't fit what kuba actually
is: native custom elements, not a composition tree. We kept the mindset and
simplified, landing on three layers.

## Tag prefix

| Prefix | Meaning | Examples |
|---|---|---|
| `kb-` | Every kuba custom element, visual or headless. | `<kb-button>`, `<kb-input>`, `<kb-dataset>`, `<kb-fetch>` |

A single prefix keeps the namespace predictable and makes any kuba element
recognizable at a glance in someone else's markup. Whether an element renders
anything is told by its `types.d.ts` and by whether it has a page under
[Components](/components/) — not by the tag.

Headless elements — `<kb-dataset>`, `<kb-filter>`, `<kb-find>`, `<kb-fetch>`,
`<kb-headers>`, `<kb-on>`, `<kb-redirect>` — hold or fetch data and publish
events on Echo, but render nothing themselves.

## Design tokens

The semantic style variables, mirrored between design and code. Every token
follows `--{group}-{scale}`: `--spacing-md`, `--color-primary-dark`.

**The name never describes *where* a token is used, only *what* it
represents.** That's what lets you reuse it in any component without the name
ever becoming misleading — `--color-danger` stays correct whether it colors a
button, a border, or a validation message.

## Elements

The indivisible components — the smallest parts of an interface: a button, an
input, a label. Each maps to a single directory under `packages/`, with a
`types.d.ts` and a `style.js`, and is built purely from combinations of design
tokens. No loose values.

## Blocks

The more complex components, assembled by composing several Elements. A
`<kb-card>` grouping `<kb-text>`, `<kb-label>` and `<kb-button>` is a Block.

Spacing tokens govern these compositions, so the rhythm between Elements inside
a Block is predictable across the product.

## What + semantics + variant

The practice for naming both design tokens and the attributes in a
`types.d.ts`: start with the **what** (the concept), follow with the
**semantics** (the variation), and add a **variant** of intensity when needed.

| | what | semantics | variant |
|---|---|---|---|
| Token | `color` | `primary` | `dark` |
| Token | `spacing_inset` | `md` | — |
| Property | `--button-color` | `accent` | — |
| Attribute | `variant` | `outlined` | — |

It isn't mandatory — it kicks in when there's a real need to differentiate.

## Before creating a new element

You might have one `<kb-card>` and eventually need a "card with image". Check
first whether that isn't simply a different composition of the same
`<kb-card>` — a Block, not a new Element.

The question to ask, in order:

1. **Is it a composition of existing Elements?** Then it's a Block. Write the
   markup, not a new package.
2. **Is it the same Element with a different look?** Then it's a token override
   or a `variant` attribute — see [Styling](/learn/styling).
3. **Is it genuinely a new indivisible part?** Only then does it earn a package,
   a `types.d.ts` and a page here.

## Events

Events are named in the **past tense** — they report a fact, they don't request
an action: `clicked`, `changed`, `submitted`, `filtered`, `found`, `succeeded`,
`failed`.

The rule matters more than it looks. An element that publishes `save` is telling
someone what to do, which means it knows who's listening. An element that
publishes `submitted` is stating what happened, and doesn't care who reacts —
which is the whole reason kuba elements never import each other.
