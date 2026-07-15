# Changelog

All notable changes to this project will be documented in this file.

The format follows [Keep a Changelog](https://keepachangelog.com/en/1.0.0/) and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [0.1.0-alpha.2] — 2026-07-15

### Changed

- Drop CJS output, ESM only
- Remove IIFE output
- Simplify subpath exports in package.json

## [0.1.0-alpha.1] — 2026-07-15

### Added

- Initial release of `@t2e1/kuba`
- Custom element groups: `behavior`, `component`, `data`, `form`, `layout`
- Utility packages: `cookie`, `directive`, `dom`, `echo`, `event`, `middleware`, `mixin`, `pixel`, `polyfill`, `renderer`, `result`, `router`, `spark`, `storage`
- Subpath exports for all packages (`@t2e1/kuba/dom`, `@t2e1/kuba/router`, etc.)
- GitHub Actions workflow for automated npm publishing
- Biome, commitlint, husky, and lint-staged for code quality
