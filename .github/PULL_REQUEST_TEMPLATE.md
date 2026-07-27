## What

<!-- One or two sentences: what does this PR change? -->

## Why

<!-- The motivation — a bug, a missing capability, a design gap. Link an issue if one exists. -->

Closes #

## How

<!-- Brief notes on the approach, only if it's not obvious from the diff. -->

## Checklist

- [ ] One concern per PR (unrelated changes are in a separate PR)
- [ ] `bun run check` passes locally (Biome — the pre-commit hook already enforces this)
- [ ] No new runtime dependency added, or its necessity is explained above
- [ ] No subpath export or public API changed without prior discussion (issue/discussion linked above)
- [ ] Custom-element changes update the matching `types.d.ts` and story
- [ ] Commit messages follow [Conventional Commits](https://www.conventionalcommits.org/)
