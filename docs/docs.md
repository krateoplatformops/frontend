# Widgets

In the Krateo Composable Portal, everything is built around the concept of **widgets** and their composition. A widget is a Kubernetes **Custom Resource Definition (CRD)** that is mapped either to a UI element rendered in the frontend (for example, a `Button`) or to a configuration object used by other widgets (for example, a `Route`).

A complete list of available widgets and their properties is available in the [Widgets API Reference](./widgets-api-reference.md).

---

## Anatomy of a Widget

Each widget is defined by a **JSON Schema**, which acts as its single source of truth. This schema is used to generate the corresponding CRD and enables schema validation at apply time.

As a result, every widget has its own `kind` and a well-defined structure.

You can find an example of a widget schema in the [Button widget JSON schema](/src/widgets/Button/Button.schema.json).

---

## `widgetData`

Every widget defines a `spec.widgetData` field, which contains the data that controls how the widget looks and behaves in the Composable Portal.

For example, in a `Button` widget, properties such as `label`, `icon` (using the [Font Awesome](https://fontawesome.com/search?ip=classic&s=solid&o=r) naming convention), and `type` determine the visual appearance of the button. All supported configuration options for each widget are documented in the [Widgets API Reference](./widgets-api-reference.md).

Below is a minimal example of a `Button` widget:

```yaml
kind: Button
apiVersion: widgets.templates.krateo.io/v1beta1
metadata:
  name: button-1
  namespace: krateo-system
spec:
  widgetData:
    label: This is a button
    icon: fa-sun
    type: primary
    clickActionId: navigate-example-button-page
    actions:
      navigate:
        - id: navigate-example-button-page
          path: /button
          type: navigate
  resourcesRefs:
    items:
      - id: navigate-example-button-page
        apiVersion: widgets.templates.krateo.io/v1beta1
        name: example-button-page
        namespace: krateo-system
        resource: pages
        verb: GET
```

---

## `widgetDataTemplate`

Every widget also supports the optional `spec.widgetDataTemplate` field. This field allows you to **override or populate specific values** defined in `spec.widgetData` with dynamic data at runtime.

This mechanism is particularly useful for injecting data coming from APIs into widgets.

A `widgetDataTemplate` is an array of objects with the following keys:

- **`forPath`**: the path of the field in `widgetData` to override, using dot notation (for example, `parentProperty.childProperty`).
- **`expression`**: a [jq](https://jqlang.org/) expression whose result will be injected into the specified path.

Example structure:

```yaml
widgetDataTemplate:
  - forPath: data
    expression: ${ .namespaces }
```

---

### Simple Example

In the following example, the label of the button is dynamically set to the current date when the widget is loaded:

```yaml
kind: Button
apiVersion: widgets.templates.krateo.io/v1beta1
metadata:
  name: button-1
  namespace: krateo-system
spec:
  widgetData:
    label: This is a button
    icon: fa-sun
    type: primary
    clickActionId: navigate-example-button-page
    actions:
      navigate:
        - id: navigate-example-button-page
          path: /button
          type: navigate
  widgetDataTemplate:
    - forPath: label
      expression: ${ now | strftime("%Y-%m-%d") }
  resourcesRefs:
    items:
      - id: navigate-example-button-page
        apiVersion: widgets.templates.krateo.io/v1beta1
        name: example-button-page
        namespace: krateo-system
        resource: pages
        verb: GET
```

---

### Complete Example

The following example shows a `Table` widget whose data is dynamically populated from the Kubernetes API:

```yaml
kind: Table
apiVersion: widgets.templates.krateo.io/v1beta1
metadata:
  name: table-of-namespaces
  namespace: krateo-system
spec:
  widgetData:
    allowedResources: []
    pageSize: 10
    data: []
    columns:
      - valueKey: name
        title: Cluster Namespaces

  widgetDataTemplate:
    - forPath: data
      expression: ${ .namespaces }
  apiRef:
    name: cluster-namespaces
    namespace: krateo-system

---
apiVersion: templates.krateo.io/v1
kind: RESTAction
metadata:
  name: cluster-namespaces
  namespace: krateo-system
spec:
  api:
    - name: namespaces
      path: "/api/v1/namespaces"
      filter: "[.items[] | {name: .metadata.name}]"
```

In this example, the table defines a single column (`name`) and displays all namespaces in the cluster. The data is retrieved directly from the Kubernetes API server.

---

### How It Works

```yaml
widgetDataTemplate:
  - forPath: data
    expression: ${ .namespaces }
```

The `.namespaces` reference corresponds to the output of an API named `namespaces`.

The `Table` widget defines a `spec.apiRef` field that references a `RESTAction` resource by name (`cluster-namespaces`). That `RESTAction` declares an API named `namespaces` inside its `spec.api` list.

Through this chain of references:

```
Widget → apiRef → RESTAction → api
```

`widgetDataTemplate` can access the API result by name and inject it into `widgetData`.

The REST endpoint `/api/v1/namespaces` is served by the Kubernetes API server. If an absolute URL were used instead, the same mechanism could be applied to external APIs. For more details, see the [RESTActions documentation](./restactions.md).

---

## `actions`

Actions define widget behavior and user interactions.

The currently supported actions are:

- **`rest`**: triggers an HTTP request to a referenced resource
- **`navigate`**: navigates to a different route or referenced resource
- **`openDrawer`**: displays another widget inside a drawer (side panel)
- **`openModal`**: displays another widget inside a modal

Actions are defined inside `widgetData`. A complete list of widgets supporting actions and their available properties can be found in the [Widgets API Reference](./widgets-api-reference.md).

---

## Composing Widgets

To build complex and powerful UIs, widgets must be able to reference other widgets and `RESTAction`s. This is achieved through the `spec.resourcesRefs` field.

### `resourcesRefs`

```yaml
kind: Row
apiVersion: widgets.templates.krateo.io/v1beta1
metadata:
  name: my-row
  namespace: krateo-system
spec:
  widgetData:
    allowedResources: [tables, piecharts]
    items:
      - resourceRefId: pie-chart-inside-column
        size: 6
      - resourceRefId: table-of-pods
        size: 18
  resourcesRefs:
    items:
      - id: table-of-pods
        apiVersion: widgets.templates.krateo.io/v1beta1
        name: table-of-pods
        namespace: krateo-system
        resource: tables
        verb: GET
      - id: pie-chart-inside-column
        apiVersion: widgets.templates.krateo.io/v1beta1
        name: pie-chart-inside-column
        namespace: krateo-system
        resource: piecharts
        verb: GET
```

In this example, `resourcesRefs` declares a list of referenced resources, each associated with a user-defined `id`. The `Row` widget uses these IDs to resolve and render its children.

The rendering order is determined by the order of the `items` list in `widgetData`, not by the order of `resourcesRefs`.

Some widgets can be used to build complex layouts. To learn more, please check [this guide](./guides/layout/layout.md).

---

### `resourcesRefsTemplate`

Similar to `widgetDataTemplate`, `resourcesRefsTemplate` allows `resourcesRefs` to be populated dynamically using data returned by an API.

```yaml
kind: Row
apiVersion: widgets.templates.krateo.io/v1beta1
metadata:
  name: templates-row
  namespace: my-namespace
spec:
  apiRef:
    name: templates-panels
    namespace: my-namespace
  widgetData:
    allowedResources: []
    items: []
  widgetDataTemplate:
    - forPath: items
      expression: >
        ${ [ .templatespanels[] | { resourceRefId: .metadata.name, size: 12 } ] }
  resourcesRefs:
    items: []
  resourcesRefsTemplate:
    - iterator: ${ .templatespanels }
      template:
        id: ${ .metadata.name }
        apiVersion: ${ .apiVersion }
        resource: panels
        namespace: ${ .metadata.namespace }
        name: ${ .metadata.name }
        verb: GET
```

In this example:

- the widget references a `RESTAction` named `templates-panels` via `apiRef`
- the `RESTAction` exposes an API named `templatespanels`
- `resourcesRefsTemplate` iterates over the API result and dynamically generates `resourcesRefs`

If `resourcesRefs` also contains statically defined entries, they are merged with the dynamically generated ones.