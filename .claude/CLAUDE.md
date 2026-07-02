# Krateo Frontend — Claude Code instructions

## Project overview

This is the **Krateo Platform frontend** — a React 19 + TypeScript SPA that renders
a dynamic UI by fetching widget definitions from Kubernetes CRDs at runtime.
Widgets are defined as JSON Schema files, each in its own folder (which follows the path
`src/widgets/<name>/` and contains the JSON schema, the `.tsx` implementation and the `.ts` type) and consumed
via a Kubernetes-backed API (snowplow, authn, events services).

The JSON schema is used as basis for creating a Kubernetes CRD using `krateoctl`.

Stack: **React 19 · TypeScript 5 · Vite 6 · Ant Design 5 · TanStack Query v5 ·
React Router v7 · Vitest · ESLint 9 (flat config) · Stylelint · Docker / nginx**

## Repository layout

```
src/
  components/    shared, reusable UI components
  examples/
    widgets/     YAML example files — one per widget type
  pages/         route-level components
  hooks/         custom React hooks
  utils/         pure helpers
scripts/         Node/tsx tooling (generate-crds, apply-k8s-yamls…)
docs/            architecture docs, widget guide, ADRs
public/config/   runtime config.json (API base URLs, injected at deploy)
```

## Build and test commands

```bash
npm run dev          # start dev server on :4000
npm run lint         # ESLint (flat config)
npm run lint:css     # Stylelint on CSS modules
npm run generate-types  # generates a TypeScript type from a JSON schema file (requires json-schema-to-typescript) 
npm run generate-crds  # regenerate CRDs from JSON schemas (requires krateoctl)
npm run apply-all      # apply all k8s YAMLs to current cluster context
npm run validate-schemas # validates JSON schemas
npm run update-readme-widgets # updates the docs/widget-api-reference.md page with specs for each widget
npm run apply-examples # apply all k8s YAMLs from the src/examples folder in the current cluster
npm run apply-crds # apply all k8s YAMLs of generated CRDs from the krateoctl output folder in the current cluster
npm run examples # start dev server and applies k8s YAMLs from the src/examples folder
```

**Always run `npm run lint` before proposing a PR.**
Never start the dev server unless explicitly asked.

## Code conventions

- All components are **functional** with hooks — no class components.
- CSS is **CSS Modules** (`Component.module.css`) — no inline styles, no Tailwind.
- Imports are sorted: external → internal → relative (enforced by ESLint `import-x`).
- Destructure keys are sorted (enforced by `sort-destructure-keys`).
- Use **TanStack Query** for all server state; never raw `useEffect` + `fetch`.
- Forms use **Ant Design Form** (`antd`) — not React Hook Form.
- Routing is React Router v7 — use `<Link>`, `useNavigate`, `useParams`.
- Charts are rendered with **echarts-for-react**.
- Flow diagrams use **reactflow**.
- Icons come from **@fortawesome/react-fontawesome** — do not import from antd icons.

## Widget system

Widgets are the core abstraction. Each widget:
1. Has a JSON schema in `src/widgets/<name>.schema.json`.
2. Has a YAML example in `src/examples/widgets/<name>.example.yaml` with an example page in `src/examples/widgets/<name>.menu.yaml`.
3. Gets a generated TypeScript type via `npm run generate-types`.
4. Gets a generated CRD via `npm run generate-crds`.
5. Has a React component definition in `src/widgets/<name>.tsx`
6. Has a Typescript file exporting the component in `src/widgets/<name>.ts`
7. If needed, has a custom CSS module in `src/widgets/<name>.module.css`

When creating a new widget, always create all artifacts together.
See `docs/WIDGET-GUIDE.md` for the full step-by-step guide.

## Runtime configuration

The app reads `public/config/config.json` at startup — never hardcode API URLs.
For local dev, copy `public/config/config.example.json` → `public/config/config.json`
and set the correct `AUTHN_API_BASE_URL`, `SNOWPLOW_API_BASE_URL`, `EVENTS_API_BASE_URL`.

## Security boundaries

- **Never edit** `.github/workflows/` without explicit user approval.
- Treat `.env*` files as read-only — never write secrets.
- The `scripts/` directory runs against a live cluster — always confirm before running.
- Do not commit `public/config/config.json` (it is gitignored).

## TypeScript rules

- `strict: true` is enforced — no `any` without a comment justifying it.
- Prefer `unknown` over `any` for external data.
- Keep types co-located with the component unless shared across 3+ files, then move to `src/types/`.

## GitHub integration

When working on issues or PRs, prefer using the `gh-issue-handler` subagent.
Use conventional commit messages: `feat:`, `fix:`, `docs:`, `chore:`, `refactor:`.

## Useful references

- Widget API reference: `docs/widgets-api-reference.md`
- Architecture overview: `docs/ARCHITECTURE.md`
- Widget creation guide: `docs/WIDGET-GUIDE.md`
- Architectural decisions: `docs/DECISIONS.md`
- Krateo docs: https://docs.krateo.io