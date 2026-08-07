# Principles

Principles exist to take the subjectivity out of decisions. Each one fits in a
word, and each carries the reason it exists — without that, it's a slogan.

Three are enough for kuba today. Split them into sub-groups if your product
needs to; just keep them clear and tangible enough to settle an argument.

## Simple

We aim to be simple in how each component is built, in the rules we write, and
in how kuba is applied to build a product.

**An element that needs extensive documentation to be understood is probably
doing too much.** That's the test, and it cuts both ways: when a component page
here grows long because the element has too many rules, the element is what
should change.

*Keywords: easy, direct, clear, focused.*

## Accessible

We design for everyone, which is why accessibility criteria are never skipped —
in a design decision or a code one.

In practice this means the platform does the heavy lifting: a real `<input>`
inside `<kb-input>`, a real `<form>` inside `<kb-form>`, native landmarks in
`<kb-header>` and `<kb-footer>`. Those bring keyboard behavior, focus order and
screen reader semantics that a `<div>` never would.

It also means being honest about where an element stops. `<kb-card>`'s clicked
behavior is mouse-only; `<kb-icon>` has no accessible name; `<kb-validity>`
isn't announced when it appears. Each component page says so in its own
accessibility section, because a gap you know about is a gap you can close.

*Keywords: inclusive, considerate, universal.*

## Flexible

Components must adapt to multiple brands and different scenarios — without
forking the component for each variation.

That's what design tokens and custom properties make possible: the same
`<kb-button>`, with a different look, by swapping which tokens are active. Every
visual decision in every element is exposed as a `--{component}-*` property
defaulting to a token, so re-skinning never means reaching into a shadow root —
see [Styling](/learn/styling).

*Keywords: adaptable, versatile, dynamic.*

## Design principles

It comes down to visual simplicity. **Every design token exists to remove an
arbitrary decision — not to multiply options.** The spacing scale, the color
palette, the shadow levels: each is small enough to memorize, and constrained
enough that two screens of the same product never look like they were made by
different people.

This shows up in how components compose. A `<kb-card>` doesn't define its own
inner spacing — it uses the spacing scale. A `<kb-button>` doesn't invent its own
palette — it resolves `--color-{value}` against the active tokens. The look
changes when the token changes, never because someone decided that on one
particular screen it looks better different.

The corollary is worth stating: **a value that isn't a token is a bug in the
design system, not a shortcut.** When you need a size the scale doesn't have,
the question is whether the scale is wrong — not whether this one screen can be
an exception.
