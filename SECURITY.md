# Security Policy

## Supported versions

kuba is pre-1.0. Only the latest published version of `@t2e1/kuba` receives
security fixes — there are no maintenance branches for earlier alphas.

| Version | Supported |
|---------|-----------|
| latest `0.1.0-alpha.*` | ✅ |
| anything older | ❌ |

## Reporting a vulnerability

**Do not open a public issue.**

Report privately through
[GitHub Security Advisories](https://github.com/T2E1/kuba/security/advisories/new),
or by email to <cleber.demgoncalves@gmail.com> if you cannot use GitHub.

A useful report includes the affected version, the markup or code that triggers
the problem, what an attacker gains, and — since kuba needs no build step — a
single HTML file that reproduces it.

Expect an acknowledgement within 7 days. If the report is confirmed, the fix
ships in the next release and the advisory is published crediting you, unless
you prefer otherwise.

## Scope

kuba is a client-side library with zero runtime dependencies. The issues that
are in scope are the ones it can actually cause in a consumer's page:

- Markup injection through element attributes, `<template>` interpolation, or
  the `{path.to.value}` placeholders resolved by `<kb-render>`, `<kb-form>` and
  `<kb-redirect>`.
- Event wiring (`on="source/event:type/sink"`) reaching a method or property it
  should not be able to reach.
- Cookie, HTTP or router utilities leaking data across origins.

Out of scope: vulnerabilities in the applications built with kuba, in the
documentation site's third-party CDN assets, or in development-only tooling.
