# Introduction

Web Components, the browser itself as the dataflow layer, and no promise to
reinvent what the platform already solves.

Nobody needs many tools to build an interface that *works*. Building one that
still works two years from now, with someone else maintaining it, is the real
challenge — and that comes from explicit conventions, not individual talent.

When the domain is clear — which elements exist, how they talk to each other,
where state lives — the number of decisions each developer makes alone drops
sharply. Changes become surgical: you know which file to touch, and what to
expect from the edit.

> kuba doesn't abstract the DOM away — it trusts it.

## Why it exists

**Purpose.** Shrink the distance between "the server delivers HTML" and "the
interface reacts as if a framework were behind it" — without forcing whoever
builds the product to learn a state runtime, a build step, or a new templating
language.

**Mission.** Offer a small, cohesive set of primitives — custom elements and
utilities — that any team can adopt progressively: a single `<kb-button>` on an
existing page, or an entire screen orchestrated through the Echo bus.

**Vision.** That product teams treat the DOM as a legitimate dataflow layer, not
an implementation detail to be hidden behind a Virtual DOM — and that the HTML
the server sends remains, in fact, the application.

## Two schools of thought, and the gap between them

Modern frontend development has converged on two competing philosophies, and
each one solves only half of the problem.

**React, Vue, and Angular** treat the DOM as an implementation detail to be
abstracted away. State lives in JavaScript. The UI is a pure function of that
state, re-rendered through a virtual DOM and reconciled back into real elements.
This gives teams a genuinely powerful dataflow model — components can react to
each other, compose, and update predictably. But the cost is a parallel
universe: a runtime that must be shipped to the browser, a build step that must
compile JSX or templates into JavaScript, and a state model that has nothing to
do with the DOM it eventually produces. The HTML the browser receives is no
longer the application; it is a rendering target.

**htmx** goes the opposite direction. It restores HTML as the application: the
server renders markup, the client swaps fragments of it in place, and no
client-side state model is needed at all. This is a return to the web's original
request/response model, and a legitimate rejection of frontend complexity. But
it comes with a real limitation: htmx has no dataflow *inside the client*. Two
elements on the same page cannot react to one another without a trip back to the
server for a new fragment. Interactivity that should be instantaneous and local
— a filter reacting to an input, a counter reacting to a toggle — is modeled as
a network request, because there is no other channel available.

The gap between these two schools is exactly the gap kuba closes: **client-side
dataflow without leaving HTML, and without a JavaScript state runtime to
maintain it.**

### How kuba resolves it

The browser has had a dataflow mechanism since 1995: the DOM event system. Every
element can dispatch an event; every element can listen for one. Frameworks
reinvented this capability in userland — props, stores, observables — because
raw DOM events, on their own, are too unstructured to compose an application
from. There is no shared vocabulary for *which* element should react to *which*
event, or *how*.

kuba's answer is to standardize that vocabulary, not to replace the mechanism.
Every kuba custom element understands a declarative wiring attribute (`on`) that
describes, in plain markup, which source element's event should drive which
sink property, method, or attribute on itself. The browser's native
`CustomEvent` system does the actual delivery; kuba only supplies the grammar
for expressing intent.

```html
<kb-input name="query"></kb-input>

<kb-fetch name="api" url="/search?q={}">
  <kb-on value="query/changed:method/get"></kb-on>
</kb-fetch>
```

Two elements react to each other, and neither imports the other. The consequence
is a dataflow model that is:

- **Client-side**, like React/Vue/Angular — elements react to each other
  instantly, with no server round-trip for local interactivity.
- **HTML-first**, like htmx — the wiring lives in markup, not in a JavaScript
  state tree; there is nothing to compile, hydrate, or reconcile.
- **Native**, unlike either — there is no framework-specific event bus
  underneath; it is the DOM's own event system, exposed rather than hidden.

This is why kuba is best understood as an evolution rather than a third
alternative sitting beside the other two: it takes the dataflow ambition of the
component frameworks and the platform fidelity of htmx, and satisfies both with
the one mechanism the browser already shipped for exactly this purpose. The full
grammar is in [Events and Echo](/foundations/events-and-echo).

## Four things we believe

### Trust the platform before reinventing it

Every new element starts with the same question: *does the browser already solve
this?* `<kb-input>` delegates validation to the Constraint Validation API.
`<kb-redirect>` uses the History API. Echo builds on native `dispatchEvent`. We
write code only when the platform genuinely doesn't offer the behavior — never
out of stylistic preference.

### Be creative, but stay accountable

Behavior is documented before it's considered done. A `types.d.ts` with no
implementation isn't a contract, and an implementation with no `types.d.ts`
isn't a public component. That boundary is what keeps experimenting inside a
package from turning into instability for whoever consumes it.

### Every interaction matters

This holds across every layer: how an event is named, the wording of a
validation message, the `aria-*` attribute missing from an element. Small
decisions, kept consistent across the whole package, add up to a coherent
experience — for the person using the interface and for the person reading the
code.

### Don't treat a constraint as an excuse

A hard requirement is no reason to carve out an exception in the architecture.
When a scenario doesn't fit the current model — publisher/subscriber over Echo,
HTML as the source of truth — the way forward is to understand *why* the model
resists, not to route around it. That's what keeps the
[principles](/foundations/principles) trustworthy over time.

## What we're aiming for

**Lower the cost of change.** By leaning on native browser APIs — events,
`CustomEvent`, `ElementInternals`, the Constraint Validation API — each element
evolves in isolation, with no cascade of edits across other layers.

**Save time.** Small components, each with a single responsibility, mean less
accumulated technical debt and faster updates to apply.

**Build a culture of living documentation.** Every public package carries a
`types.d.ts` as its contract, and this site runs against the published package
from a CDN — so a broken release breaks the documentation, visibly, instead of
passing unnoticed.

**Make the reasoning visible.** Every package under `packages/` documents a
decision: why Echo overrides `dispatchEvent`, why `<kb-input>` delegates to the
Constraint Validation API instead of reimplementing it, why there is no central
store. Making that reasoning explicit matters as much as the code — it's what
lets someone extend the library instead of only consuming it.

## The platform it stands on

kuba is written in plain JavaScript with **zero runtime dependencies**. Check
`package.json`: the `dependencies` section is empty.

That wasn't for lack of options. It follows from the
[principles](/foundations/principles):

1. **Web Components are native.** They need no framework to exist or to register
   themselves.
2. **One fewer dependency is one fewer supply chain** to audit, update, and have
   break in production.
3. **A gentler learning curve.** Anyone who knows the DOM and `CustomEvent` can
   already read kuba's source.
4. **Every front-end developer knows JavaScript**, whichever framework they
   reach for day to day.

### The native APIs it stands on

None of these is an installable dependency. They're capabilities the browser
already ships, which kuba exposes through a declarative API instead of hiding
behind an abstraction of its own.

| API | Used for |
|---|---|
| **Custom Elements** | Every `<kb-*>` tag, registered through the `define` decorator. |
| **Shadow DOM** | Each element's markup and styles, isolated from the page. |
| **Constraint Validation API** | Native form validation in `<kb-input>`, `<kb-textarea>`, `<kb-fileupload>`. |
| **`ElementInternals`** | Form association and custom states (`:state(invalid)`, `:state(hidden)`) without reimplementing `<form>` semantics. |
| **`CustomEvent`** | The whole Echo bus. Elements communicate the way the DOM already does. |
| **Constructable stylesheets** | `adoptedStyleSheets`, so a stylesheet is parsed once and shared across instances. |
| **History API** | Client-side navigation in `router` and `<kb-redirect>`. |
| **CSS `light-dark()`** | Light and dark values in a single color token, resolved by the page's `color-scheme`. |
| **CSS custom properties** | The whole theming surface, inheriting through the shadow boundary. |

The one shim in the codebase is `setImmediate`, used to batch repaints — a few
lines, not a library.

## Where to go next

- **[Principles](/foundations/principles)** — the three that guide every
  decision.
- **[Installation](/learn/installation)** — a script tag, or a package
  install.
- **[Quick start](/learn/quick-start)** — a working form in ten minutes.
