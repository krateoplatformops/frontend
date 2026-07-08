# Actions

Actions define what happens when a user interacts with a widget — clicking a button, selecting a row, submitting a form, or clicking a panel. Every action is declared inside `spec.widgetData.actions` and referenced by ID from the widget's interaction trigger (e.g. `clickActionId`).

For a full list of properties per action type, see the [Widgets API Reference](./widgets-api-reference.md).

---

## Common properties

Two properties are available on every action type:

| Property | Type | Description |
|---|---|---|
| `requireConfirmation` | boolean | If `true`, shows a browser confirmation dialog before the action executes. The action is cancelled if the user dismisses it. |
| `loading.display` | boolean | If `true`, the triggering widget shows a loading indicator for the duration of the action. |

---

## `navigate`

Navigates to a different route within the portal.

There are two modes:

- **By path**: provide `path` to navigate to a fixed or dynamically resolved route.
- **By resource**: provide `resourceRefId` to navigate to the endpoint of a referenced widget. The resulting URL is `{currentPath}?widgetEndpoint={encodedEndpoint}`. Use `resourceURLPathExtension` to override the base path instead of inheriting the current route.

Both `path` and `resourceRefId` support JQ expressions using the `${ }` syntax, which allows values to be resolved from the triggering widget's payload (e.g. a table row).

| Property | Required | Description |
|---|---|---|
| `id` | yes | unique identifier for the action |
| `type` | yes | must be `navigate` |
| `path` | no | route to navigate to; supports JQ expressions |
| `resourceRefId` | no | ID of an entry in `resourcesRefs` to navigate to; supports JQ expressions |
| `resourceURLPathExtension` | no | overrides the base path used when navigating via `resourceRefId` |
| `requireConfirmation` | no | see [Common properties](#common-properties) |
| `loading.display` | no | see [Common properties](#common-properties) |

**Example — navigate to a fixed path:**

```yaml
actions:
  navigate:
    - id: go-to-deployments
      type: navigate
      path: /deployments
```

**Example — navigate to a path built from a table row:**

```yaml
actions:
  navigate:
    - id: go-to-pod
      type: navigate
      path: ${ "/pods/" + .json.name }
```

---

## `openDrawer`

Opens a widget inside a side drawer panel. The widget to display is identified by a `resourceRefId` that must match an entry in the widget's `resourcesRefs`.

Both `resourceRefId` and `title` support JQ expressions, which means the drawer can show different widgets or titles depending on which row or element triggered the action.

| Property | Required | Description |
|---|---|---|
| `id` | yes | unique identifier for the action |
| `type` | yes | must be `openDrawer` |
| `resourceRefId` | yes | ID of the widget to display inside the drawer; supports JQ expressions |
| `title` | no | text shown in the drawer header; supports JQ expressions |
| `size` | no | `default` or `large` |
| `requireConfirmation` | no | see [Common properties](#common-properties) |
| `loading.display` | no | see [Common properties](#common-properties) |

**Example:**

```yaml
actions:
  openDrawer:
    - id: open-pod-detail
      type: openDrawer
      resourceRefId: ${ "pod-detail-" + .json.name }
      title: ${ "Details for " + .json.name }
      size: large
```

---

## `openModal`

Opens a widget inside a modal dialog. Works the same way as `openDrawer` but renders in a centered overlay. The modal offers more size options, including a fully custom width.

Both `resourceRefId` and `title` support JQ expressions.

| Property | Required | Description |
|---|---|---|
| `id` | yes | unique identifier for the action |
| `type` | yes | must be `openModal` |
| `resourceRefId` | yes | ID of the widget to display inside the modal; supports JQ expressions |
| `title` | no | text shown in the modal header; supports JQ expressions |
| `size` | no | `default` (520 px), `large` (80% viewport width), `fullscreen` (100%), or `custom` |
| `customWidth` | no | custom width value (e.g. `800px`); only used when `size` is `custom` |
| `requireConfirmation` | no | see [Common properties](#common-properties) |
| `loading.display` | no | see [Common properties](#common-properties) |

**Example:**

```yaml
actions:
  openModal:
    - id: open-namespace-modal
      type: openModal
      resourceRefId: ${ "namespace-detail-" + .json.name }
      title: Namespace details
      size: large
```

---

## `rest`

Triggers an HTTP request against a Kubernetes resource via the Snowplow API. The HTTP verb (GET, POST, PUT, PATCH, DELETE) is determined by the matching entry in `resourcesRefs`.

The `rest` action is the primary way to mutate server state from the portal. On a successful response, it shows a success notification, closes any open drawer, and invalidates all cached widget queries so the page reflects the updated state.

### Payload

The request body is built by merging:
1. The static `payload` defined on the action.
2. The payload carried by the matching resource ref.
3. Any fields listed in `payloadToOverride`, which are resolved at the time the action fires.

`payloadToOverride` entries support JQ expressions against the triggering widget's payload (e.g. a table row), making it possible to inject row values into a request body.

### Post-request navigation

Two mutually exclusive post-request navigation options are available:

- **`onSuccessNavigateTo`**: a URL to navigate to immediately after a successful response. Supports JQ expressions evaluated against the request payload and the API response.
- **`onEventNavigateTo`**: waits for a Kubernetes event matching `eventReason` and the UID of the created/updated resource, then navigates. Useful when the action triggers an asynchronous reconciliation loop. Supports two `mode` values:
  - `navigate` (default): shows a loading message inline and redirects when the event arrives.
  - `notification`: closes the drawer immediately and shows a persistent notification that updates when the event arrives.

| Property | Required | Description |
|---|---|---|
| `id` | yes | unique identifier for the action |
| `type` | yes | must be `rest` |
| `resourceRefId` | yes | ID of the resource in `resourcesRefs` to call; supports JQ expressions |
| `payload` | no | static payload merged into the request body |
| `payloadToOverride` | no | list of `{name, value}` pairs to override in the payload; `value` supports JQ |
| `headers` | no | additional request headers, each as a `"Key: Value"` string |
| `successMessage` | no | custom success notification message; supports JQ |
| `errorMessage` | no | custom error notification message; supports JQ |
| `onSuccessNavigateTo` | no | URL to navigate to after success; supports JQ; mutually exclusive with `onEventNavigateTo` |
| `onEventNavigateTo` | no | event-driven navigation config; mutually exclusive with `onSuccessNavigateTo` |
| `onEventNavigateTo.eventReason` | yes | the Kubernetes event reason to wait for |
| `onEventNavigateTo.url` | yes | URL to navigate to when the event arrives; supports JQ |
| `onEventNavigateTo.timeout` | no | seconds to wait before treating the action as failed |
| `onEventNavigateTo.mode` | no | `navigate` (default) or `notification` |
| `onEventNavigateTo.loadingMessage` | no | message shown while waiting for the event; supports JQ |
| `onEventNavigateTo.reloadRoutes` | no | if `true`, reloads the portal route tree when the event arrives |
| `requireConfirmation` | no | see [Common properties](#common-properties) |
| `loading.display` | no | see [Common properties](#common-properties) |

**Example — delete a resource with confirmation:**

```yaml
actions:
  rest:
    - id: delete-pod
      type: rest
      resourceRefId: ${ "pod-" + .json.name }
      requireConfirmation: true
      successMessage: Pod deleted successfully
      errorMessage: ${ "Failed to delete pod: " + .response.message }
      loading:
        display: true
```

**Example — create a resource and wait for an event before navigating:**

```yaml
actions:
  rest:
    - id: create-composition
      type: rest
      resourceRefId: new-composition
      onEventNavigateTo:
        eventReason: CompositionReady
        url: ${ "/compositions/" + .json.metadata.name }
        timeout: 120
        mode: notification
        loadingMessage: Waiting for composition to be ready...
```

For details on how `resourcesRefs` and the Snowplow API work, see [RESTActions](./restactions.md).

---

## `externalNavigate`

Opens a URL outside the portal in the browser. By default the URL opens in a new tab, but this can be changed with the `target` property.

The `url` property supports JQ expressions, which allows the URL to be built dynamically from the triggering widget's payload — for example, constructing a link from a table row value.

| Property | Required | Description |
|---|---|---|
| `id` | yes | unique identifier for the action |
| `type` | yes | must be `externalNavigate` |
| `url` | yes | the URL to open; supports JQ expressions |
| `target` | no | where to open the URL — `_blank` (default), `_self`, `_parent`, `_top` |
| `requireConfirmation` | no | see [Common properties](#common-properties) |
| `loading.display` | no | see [Common properties](#common-properties) |

**Example — static URL:**

```yaml
actions:
  externalNavigate:
    - id: open-docs
      type: externalNavigate
      url: https://docs.krateo.io
```

**Example — URL built from a table row:**

```yaml
actions:
  externalNavigate:
    - id: open-repo
      type: externalNavigate
      url: ${ "https://github.com/" + .json.repo }
      target: _blank
```

---

## `refresh`

Invalidates TanStack Query cache entries for widget data, causing the affected widgets to re-fetch from the server. Use this after a `rest` action that changes state on a widget not automatically refreshed, or any time you need to force a data reload without a full page refresh.

There are three modes:

1. **Scoped by resource ID** (`resourcesRefsIds`): invalidates only the queries for the listed resource ref IDs. Each ID must match an entry in the widget's `resourcesRefs`. Use this for surgical refreshes that target specific widgets.
2. **Scoped by widget kind** (`widgetKinds`): invalidates all cached widgets of the given kind(s) currently loaded on the page, regardless of which widget triggered the action. Use this to refresh all tables or all panels at once.
3. **Global** (no scope): if neither `resourcesRefsIds` nor `widgetKinds` is specified, all cached queries are invalidated — equivalent to a full data reload of the current page.

When both `resourcesRefsIds` and `widgetKinds` are specified, both scopes are applied simultaneously.

| Property | Required | Description |
|---|---|---|
| `id` | yes | unique identifier for the action |
| `type` | yes | must be `refresh` |
| `resourcesRefsIds` | no | list of resource ref IDs to selectively invalidate |
| `widgetKinds` | no | list of widget kind names (e.g. `Table`, `Panel`) to invalidate page-wide |
| `requireConfirmation` | no | see [Common properties](#common-properties) |
| `loading.display` | no | see [Common properties](#common-properties) |

**Example — refresh specific widgets by resource ID:**

```yaml
actions:
  refresh:
    - id: refresh-pods-table
      type: refresh
      resourcesRefsIds:
        - pods-table
        - pods-count-panel
```

**Example — refresh all widgets of a given kind on the page:**

```yaml
actions:
  refresh:
    - id: refresh-all-tables
      type: refresh
      widgetKinds:
        - Table
```

**Example — global refresh with confirmation:**

```yaml
actions:
  refresh:
    - id: refresh-all
      type: refresh
      requireConfirmation: true
      loading:
        display: true
```
