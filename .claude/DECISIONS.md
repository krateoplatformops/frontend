# Architectural decision records

This file documents *why* key technical choices were made in this codebase.
It exists primarily for Claude Code: when Claude proposes adding a new library,
switching a pattern, or refactoring a system, it should check this file first
to understand whether that direction was already considered and rejected.

Each record has a status: **active** (the decision stands), **superseded** (replaced
by a later record), or **deprecated** (the pattern is being phased out).

---

## ADR-001 — Configuration-driven UI via Kubernetes CRDs

**Status:** active

**Decision:** The frontend renders no hardcoded pages or routes. All UI structure
is described as Kubernetes Custom Resources (CRs) fetched at runtime. The app
reads a bootstrap endpoint on startup, receives a tree of `resourceRefId`
references, and resolves each one by fetching the corresponding CR from the
Kubernetes API.

**Why:** Krateo is a platform engineering tool — its users are platform teams who
need to customise dashboards, forms, and navigation without touching frontend
code or triggering a frontend deploy. Encoding UI in CRDs gives them GitOps
workflows, RBAC, and versioning for free, using infrastructure they already manage.

**Consequences:**
- Adding a new page or widget requires YAML, not a PR.
- The frontend has no static route file. Routes come from `Route` CRs.
- Every component must accept its entire data contract as props — no component
  fetches its own data from a hardcoded URL.
- Claude must not add hardcoded routes, pages, or API URLs to the codebase.

---

## ADR-002 — Ant Design 5 as the component library

**Status:** active

**Decision:** Ant Design (`antd` v5) is the primary component library for all
UI primitives: buttons, forms, tables, modals, drawers, notifications, typography.

**Why:** Ant Design provides a complete, enterprise-grade component set that
covers every interaction pattern needed by a platform engineering dashboard
(complex forms, data tables, drawer panels, tree selects). The alternative
(building on a headless library like Radix or shadcn/ui) would have required
significant custom implementation for components like Table, Form, and DatePicker,
which are already fully featured in Ant Design. The design token system in v5
also enables the runtime `Theme` widget to switch colours, spacing, and dark/light
mode without a code change.

**Consequences:**
- Do not add MUI, Chakra, shadcn/ui, or any other component library.
- Do not import from `@ant-design/icons` — use `@fortawesome/react-fontawesome`.
  (FA was chosen because widget authors specify icon names as strings in YAML;
  FA's string-to-component mapping is more predictable than Ant Design's.)
- Form state is managed by `antd` Form — do not introduce React Hook Form or
  Formik.
- Ant Design's design tokens are the only allowed source of colour variables in
  CSS Modules; do not hardcode hex values.

---

## ADR-003 — TanStack Query v5 for all server state

**Status:** active

**Decision:** All data fetched from the Kubernetes API is managed by TanStack
Query (`@tanstack/react-query`). Components never fetch data with raw `useEffect`
+ `fetch` or `axios` calls directly.

**Why:** The widget system requires many concurrent, independent data fetches
(one per widget in the tree). TanStack Query handles deduplication, background
refetching, loading/error states, and cache invalidation without boilerplate.
The alternative — a Redux-based async flow with thunks or sagas — was considered
but rejected because it would require action/reducer/selector scaffolding for
every widget type. TanStack Query also makes optimistic updates straightforward,
which is important for action-capable widgets (Button, Form) that mutate
Kubernetes resources.

**Consequences:**
- All API hooks live in `src/hooks/`. Name them `use<Resource>Query` or
  `use<Resource>Mutation`.
- `useEffect` for fetching is a code smell in this repo — flag it in review.

---

## ADR-004 — CSS Modules (no utility-first CSS)

**Status:** active

**Decision:** Styles are written as CSS Modules co-located with their component
(`Component.module.css`). Tailwind CSS and other utility-first frameworks are not
used.

**Why:** The widget library is a shared component system, not an application UI.
CSS Modules enforce encapsulation by design — no class name collisions across
widgets, no global style leaks, no specificity battles. Tailwind was evaluated
but rejected because: (1) it requires a build-time purge step that conflicts with
the dynamic class generation used by some widgets; (2) utility classes in JSX make
the component harder to read when prop-to-class mapping is complex; (3) CSS
variables from Ant Design's token system are easier to consume in plain CSS than
in Tailwind's config.

**Consequences:**
- Every component has exactly one `.module.css` file.
- Class names are `camelCase` in the CSS file, accessed as `styles.myClassName`.
- No `style={{}}` inline props except for truly dynamic computed values
  (e.g. `style={{ width: computedPx }}`).
- No global CSS except for `index.css` (resets and Ant Design token overrides).
- Claude must not add Tailwind to any component or suggest converting to it.

---

## ADR-005 — React Router v7 with dynamic routes

**Status:** active

**Decision:** Client-side routing uses React Router v7. Routes are not statically
declared — they are registered at runtime from `Route` CRs fetched on startup
by the `RoutesLoader` widget.

**Why:** React Router v7 was the natural upgrade path from v6 and provides the
data router model that suits the lazy-loaded widget tree. Dynamic route
registration was chosen over static configuration because route names and paths
are defined by platform teams in YAML — they must be configurable at deploy time.

**Consequences:**
- There is no `src/routes.tsx` or equivalent static route list.
- Navigation in components uses `<Link>` or `useNavigate` — never
  `window.location.href` or `window.location.assign`.
- The `path` prop in `Route` CRs is the URL path. Changing it requires updating
  the CR in Kubernetes, not a frontend code change.

---

## ADR-006 — Vite as the build tool

**Status:** active

**Decision:** The project uses Vite v6 with `@vitejs/plugin-react` for
development and production builds.

**Why:** Vite's ES module dev server eliminates the full-bundle rebuild on file
save, which matters at this codebase's size. Webpack was the alternative but its
configuration overhead and slower HMR were not justified. Create React App was
never considered — it has been unmaintained since 2023.

**Consequences:**
- Do not introduce webpack, Parcel, or Rollup configuration.
- Environment variables must be prefixed `VITE_` to be exposed to the client.
- The `public/config/config.json` runtime config pattern exists precisely to
  avoid baking environment-specific URLs into the Vite build (which would require
  a separate build per environment). Do not replace it with `VITE_` env vars for
  API base URLs.

---

## ADR-007 — Font Awesome for icons (not Ant Design icons)

**Status:** active

**Decision:** Icons are rendered via `@fortawesome/react-fontawesome` using the
free solid, regular, and brand icon packs. Ant Design's built-in icon library
(`@ant-design/icons`) is not used.

**Why:** Widget authors specify icons as plain strings in YAML
(e.g. `icon: fa-inbox`). Font Awesome's naming convention maps directly to these
strings, making the YAML authoring experience predictable. Ant Design icons use
PascalCase component imports (`<InboxOutlined />`) which cannot be driven by a
runtime string without a custom registry. FA's string-based lookup scales to the
full 2000+ icon set without code changes.

**Consequences:**
- Icon prop in YAML is always a Font Awesome class name string: `"fa-check"`,
  `"fa-rocket"`, etc.
- Components convert the string to the FA icon using the library lookup — see
  existing widget components for the pattern.
- Do not add `@ant-design/icons` to any component.
- Do not use emoji as icons.

---

## ADR-008 — echarts-for-react for charts, reactflow for graphs

**Status:** active

**Decision:** Data visualisation charts (bar, line, pie) use `echarts-for-react`.
Directed graphs (Kubernetes composition topology) use `reactflow` with
`@dagrejs/dagre` for automatic layout.

**Why:** ECharts was chosen over Chart.js and Recharts because of its first-class
support for large dataset rendering, animation, and the specific chart types
required (stacked bars, line series with time axes). Recharts was evaluated but
its SVG-based rendering has performance issues at scale. ReactFlow was chosen for
the `FlowChart` widget because it handles node dragging, zoom, custom node
renderers, and minimap out of the box — building the same in plain SVG or D3
would be a significant maintenance burden.

**Consequences:**
- Do not introduce Chart.js, Recharts, D3, or Nivo for new chart widgets.
- Do not introduce Cytoscape or vis.js for new graph widgets.
- If a new chart type is not available in ECharts, check the ECharts docs before
  proposing a new library.

---

## ADR-009 — Client-side filtering via the `prefix` system

**Status:** active

**Decision:** The `Filters` widget communicates with target widgets (Table,
DataGrid) through a shared string identifier called `prefix`. Filters are
evaluated client-side. There is no server-side filtering API.

**Why:** Krateo's backend serves static CR snapshots — it has no query language
for filtering widget data server-side. Client-side filtering with a shared prefix
key gives YAML authors a declarative way to wire a Filters widget to any number
of target widgets without backend changes. The prefix is intentionally opaque:
it is just a string that must match exactly between the Filters widget and its
targets.

**Consequences:**
- Filters reset on page reload — this is by design, not a bug.
- Multiple widgets can share the same prefix and will all respond to the same
  filter state.
- Server-side pagination is not currently supported by the filter system. Do not
  attempt to add server-side filtering hooks to existing widgets without a
  dedicated ADR.
- See `docs/filters.md` for the full usage guide.

---

## ADR-010 — Server-Sent Events via `event-source-polyfill`

**Status:** active

**Decision:** Real-time event streams from Kubernetes use the SSE protocol,
consumed via `event-source-polyfill`. Only the `EventList` and `Notifications`
widgets open SSE connections.

**Why:** The Krateo backend pushes Kubernetes events over SSE rather than
WebSockets because SSE is simpler to proxy through nginx (no protocol upgrade),
works over HTTP/1.1, and is sufficient for one-directional event streams.
`event-source-polyfill` is used instead of the native `EventSource` because it
supports custom headers (needed for auth tokens), which the native API does not.

**Consequences:**
- Do not open raw `EventSource` or WebSocket connections outside `EventList`
  and `Notifications`.
- SSE endpoint and topic are passed as widget props (`sseEndpoint`, `sseTopic`),
  not hardcoded.
- Do not introduce socket.io or similar WebSocket libraries.

---

## ADR-011 — TypeScript strict mode, no `any`

**Status:** active

**Decision:** TypeScript is configured with `strict: true`. The use of `any` is
prohibited without an inline comment explaining why it cannot be avoided.
`unknown` is preferred for external/API data that must be type-narrowed before use.

**Why:** The widget system relies on generated types that flow from JSON Schema
through to React component props. Any hole in the type chain (caused by `any`)
breaks the guarantee that a component only receives data that matches its schema.
This is especially important because widget props come from Kubernetes API
responses at runtime — type errors that slip through become silent rendering
bugs.

**Consequences:**
- Props interfaces for components come from generated types in `src/types/generated/`.
  Never write a manual interface that duplicates a generated type.
- External API responses should be typed as `unknown` and narrowed with a
  validator or type guard before use.
- `@ts-ignore` and `@ts-expect-error` require a comment and a ticket reference.

---

## How to add a new ADR

When making a significant architectural decision — adding a new library,
changing a core pattern, retiring a system — add a new record to this file.

Use this template:

```markdown
## ADR-NNN — Short title

**Status:** active

**Decision:** One sentence.

**Why:** The reasoning. What alternatives were considered and rejected, and why.

**Consequences:** What this means for day-to-day development. What Claude (and
human developers) must not do as a result.
```

Increment NNN from the last record. Do not renumber existing records.