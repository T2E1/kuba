# Cookbook

Complete, working recipes — full screens rather than single elements. Each one
starts from markup you can paste into a page with the two tags from
[Installation](/learn/installation), and builds up to the version you'd ship.

Recipes assume you've read [Events and Echo](/foundations/events-and-echo); most of
what makes them short is arc wiring.

## Recipes

- **[Search as you type](/build-ui/patterns/search-as-you-type)** — an input driving a
  request, results rendered from a template, with error and empty states. Three
  elements, no listeners.
- **[User CRUD](/build-ui/patterns/user-crud)** — add, list and delete records. Four
  arcs that close a cycle: form → dataset → list → dataset.
- **[Declarative navigation](/build-ui/patterns/declarative-navigation)** — a button
  that navigates without knowing its destination, and a single redirect serving
  a whole list.

## A note on names

Echo's bus is shared across the page, and an arc matches its source by `id`,
`name` or tag name. Two features that both name an element `users` will
cross-wire — the arc fires for either.

The recipes here prefix their names (`crud-users`, `crud-form`) because this
site renders several live examples per page. In an application, scope names to
the feature for the same reason.
