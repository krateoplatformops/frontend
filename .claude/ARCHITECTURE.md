# Architecture overview

This document is written for Claude Code. It explains the mental model needed to
work in this repository without asking questions about "where does X live" or
"what drives Y".

---

## The core idea in one paragraph

Krateo frontend is a **configuration-driven shell**. There is almost no hardcoded
UI. Instead, the backend serves Kubernetes Custom Resources (CRs) that describe
*what widgets to render, with what data, and with what actions*. The frontend
fetches those resolved CRs at runtime (it fetches them from the backend who resolves the `resourceRefId` references), and
renders the matching React components. Adding a new page means creating YAML in
Kubernetes — no frontend deploy needed.

---

## Startup sequence

```
Browser loads index.html
  └─ React app boots, reads public/config/config.json
       └─ Fetches INIT endpoint (NavMenu CR from k8s)
            └─ Resolves sidebar items → NavMenuItem[] → Route[]
                 └─ Each Route points to a Page CR
                      └─ Page CR contains items[] → widget CRs
                           └─ Each widget CR is rendered by its matching React component
```

`public/config/config.json` is **injected at deploy time** and never committed.
Its keys (`AUTHN_API_BASE_URL`, `SNOWPLOW_API_BASE_URL`, `EVENTS_API_BASE_URL`, …)
are the only place API hostnames appear. Never hardcode URLs.

---

## Source tree

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

---

## The widget system

### Every widget has four artifacts

| Artifact | Location | Purpose |
|---|---|---|
| JSON Schema | `src/widgets/<Name>/<Name>.schema.json` | Single source of truth for the widget's props |
| TypeScript type | `src/widgets/<Name>/<Name>.d.ts` | Auto-generated — never edit |
| YAML example | `src/examples/widgets/<Name>/<Name>.example.yaml` | Applied to k8s for local dev |
| React component | `src/widgets/<Name>/<Name>.tsx` | The renderer |

The schema is the canonical contract. The TypeScript type is derived from it via
`npm run generate-types`. If you change a prop, change the schema first, then
regenerate.

### How a widget CR is resolved at runtime

1. The parent CR contains `items[].resourceRefId: "my-button"`.
2. The frontend calls `GET /call?resource=buttons&name=my-button&namespace=krateo-system`.
3. The response is the Button CR's `.status` object.
4. The Button React component receives that status as props and renders.

`resourceRefId` is always a Kubernetes resource name. The widget kind determines the API resource path
(e.g. `buttons`, `forms`, `tables`).

### Widget categories

**Leaf widgets** (render data, no children):
`BarChart`, `Button`, `EventList`, `LineChart`, `Markdown`, `Paragraph`,
`PieChart`, `YamlViewer`

**Container widgets** (have `items[]` or `allowedResources`, render children):
`ButtonGroup`, `Column`, `DataGrid`, `FlowChart`, `NavMenu`, `Page`,
`Panel`, `Row`, `TabList`

**Action-capable widgets** (have an `actions` object with `rest`/`navigate`/`openDrawer`/`openModal`):
`Button`, `Form`, `Panel`, `Table`

**Infrastructure widgets** (configure the app, not visible to end users):
`NavMenu`, `NavMenuItem`, `Notifications`, `Route`, `RoutesLoader`, `Theme`

### The actions system

Widgets that can trigger side effects declare an `actions` object with four
possible action types:

- `rest` — HTTP call to a Kubernetes endpoint. Supports `requireConfirmation`,
  `successMessage`, `errorMessage`, `onSuccessNavigateTo`, `onEventNavigateTo`.
- `navigate` — client-side React Router navigation to a `path` or `resourceRefId`.
- `openDrawer` — opens a side drawer rendering a referenced CR.
- `openModal` — opens a modal dialog rendering a referenced CR.

`clickActionId` on a Button/Panel refers to the `id` of one of these
actions by name. This is the indirection that lets YAML authors wire up
interactions without touching frontend code.

### Server-Sent Events

`EventList` and `Notifications` consume SSE streams. The connection is managed
with `event-source-polyfill`. Topics are passed as widget props (`sseEndpoint`,
`sseTopic`). Never open raw `EventSource` connections outside these two
components.

---

## State management

| Layer | Tool | What lives here |
|---|---|---|
| Server state | TanStack Query v5 | All CRs fetched from k8s, cached, invalidated |
| Local UI state | `useState` | Form field values, modal open, hover |

There is no global store for server data. If you find yourself putting API
responses into Redux, that is wrong — use TanStack Query.

---

## Routing

React Router v7. Routes are **dynamic** — they come from `Route` CRs fetched at
startup, not from a static route config file. The `RoutesLoader` widget is
responsible for fetching and registering them.

For navigation between pages: use React Router's `<Link>` or `useNavigate`.
Never manipulate `window.location` directly.

---

## Styling

CSS Modules only. Every component has a co-located `ComponentName.module.css`.
Class names are `camelCase` in the CSS file and accessed as
`styles.myClassName` in TSX.

No Tailwind. No styled-components. No inline `style={{}}` props unless a value
is truly dynamic (e.g. computed pixel width).

Theming is done via the `Theme` widget, which injects Ant Design design tokens
at runtime. The `mode` field on the Theme CR switches between light and dark.

---

## Charts and graphs

- Time-series / categorical charts → `echarts-for-react` (BarChart, LineChart, PieChart)
- Kubernetes composition graphs → `reactflow` + `@dagrejs/dagre` for layout (FlowChart)

Do not introduce other charting libraries.

---

## Icons

Font Awesome via `@fortawesome/react-fontawesome`. Widget YAML specifies icon
names as strings like `"fa-inbox"` (Font Awesome class name format). The React
components convert this to the correct FA library import. Ant Design
icons are used for some instances (e.g. loading spinner).

---

## Build and tooling

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

---

## What Claude should NOT do in this repo

- **Do not hardcode API base URLs.** Always read from `public/config/config.json`
  via the existing config hook.
- **Do not add new charting libraries.** Use echarts-for-react or reactflow.
- **Do not write global CSS.** Co-locate CSS Modules with the component.
- **Do not run `npm run apply-all` or `npm run generate-crds` without asking.**
  These commands write to a live Kubernetes cluster.