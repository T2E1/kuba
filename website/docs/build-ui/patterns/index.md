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
- **[Address by CEP](/build-ui/patterns/address-by-cep)** — a Brazilian
  address form filled from the postal code by ViaCEP. One request spread across
  six fields, each arc picking the key it needs.

## A note on names

Echo's bus is shared across the page, and an arc matches its source by `id`,
`name` or tag name. Two features that both name an element `users` will
cross-wire — the arc fires for either.

Each recipe here runs a single live example, so its names stay short (`breed`,
`cep`). In an application, where several features share one page, scope names
to the feature (`checkout-cep`) so they can't cross-wire.
