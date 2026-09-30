# Clients & Accounts Table — Storybook deliverable

Real React + TypeScript + Storybook source for the Clients & Accounts Table
(Option B), built to map 1:1 onto the Figma component set from the R11971
design-skills exercise.

## Links

- Figma: https://www.figma.com/design/SWKjhkZnR6DDFKUdtTOHWf
- React demo (live): https://thedselliott.github.io/clients-accounts-table-react-demo/
- React demo repo: https://github.com/thedselliott/clients-accounts-table-react-demo
- This Storybook (live): https://thedselliott.github.io/clients-accounts-table-storybook/

## Setup

```bash
npm install
npm run storybook
```

This opens Storybook at `http://localhost:6006` with stories under the
`DataGrid/*` group: `Row`, `Cell`, `HeaderCell`, `Toolbar`, and the composed
`DataGrid` itself. Each story's Controls panel exposes the same properties as
the matching Figma component (see the doc comment at the top of each
`*.stories.tsx` file for the exact mapping, and the design doc's Step 3
section for the full write-up).

## What to look at

- `src/components/*.tsx` — the components themselves.
- `src/components/*.stories.tsx` — Storybook stories, one per component, each
  with an `argTypes` mapping comment tying Storybook Controls back to the
  Figma component's own properties.
- `src/components/DataGrid.tsx` — the composed, interactive grid: search
  filtering, sort toggling, column visibility, row selection (mouse +
  keyboard), and the loading/empty/error states.
- `src/types.ts` — shared types, including an explicit code comment on the
  deliberate departure from the exercise's suggested flat Row booleans (see
  the design doc for the full rationale).
- `ACCESSIBILITY.md` — the accessibility checklist from the Step 3 brief,
  walked through against what's actually implemented (not aspirational).

## A note on how this was verified

This project was built in a sandboxed environment whose network egress
policy blocks the npm registry (`registry.npmjs.org`) and all common CDN
mirrors, so `npm install` — and therefore Storybook itself — could not be run
or screenshotted from inside that sandbox. That's a hard, admin-controlled
org policy, not a workaround-able proxy issue.

Rather than ship untested code, the actual component logic (search
filtering, sort cycling, column-visibility toggling, mouse + keyboard row
selection, the live-region result count, and the loading/error/empty states)
was verified end-to-end using pre-installed global tooling already present in
that sandbox — React, TypeScript, Playwright, and a vendored `esbuild` found
inside another package's own dependency tree — to bundle the real component
source (not a rewritten copy) and drive it with a real headless browser. That
verification is not part of this deliverable (see `build-dev.cjs`,
`verify.cjs`, `dev-preview.html`, and `src/devPreview.tsx`, all clearly
marked dev-only) — it exists purely as evidence that the shipped code
actually works before handing it off. Once installed with normal npm access,
this project's real Storybook will run those same components through its own
Vite-based dev server.

**On first `npm install` in a normal environment**, the dev-only verification
files can be deleted — they're included here only so the verification method
is inspectable, not because they're needed to run Storybook:
`build-dev.cjs`, `verify.cjs`, `dev-preview.html`, `src/devPreview.tsx`,
`devPreview.bundle.js`.
