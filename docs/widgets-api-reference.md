

## Widgets

List of implemented widgets:

### BarChart

BarChart express quantities through a bar's length, using a common baseline. Bar charts series should contain a `data` property containing an array of values

#### Props

| Property | Required | Description | Type |
|----------|----------|-------------|------|
| data | yes | Array of grouped data entries for the bar chart | array |
| data[].label | no | Label for the group/category | string |
| data[].bars | yes | Bars within the group, each representing a value | array |
| data[].bars[].value | yes | Label or identifier for the bar | string |
| data[].bars[].percentage | yes | Height of the bar as a percentage (0–100) | integer |
| data[].bars[].color | no | Color of the bar | `blue` \| `darkBlue` \| `orange` \| `gray` \| `red` \| `green` |

<details>
<summary>Example</summary>

```yaml
kind: BarChart
apiVersion: widgets.templates.krateo.io/v1beta1
metadata:
  name: my-bar-chart
  namespace: test-namespace
spec:
  widgetData:
    data:
      - label: CPU usage
        bars:
          - value: "1982"
            percentage: 75
            color: blue
          - value: "75"
            percentage: 12
            color: red
      - label: RAM usage
        bars:
          - value: "72"
            percentage: 12
            color: orange
      - label: Temperature
        bars:
          - value: "63"
            percentage: 85
            color: red
```
</details>

---

### Button

Button represents an interactive component which, when clicked, triggers a specific business logic defined by its `clickActionId`

#### Props

| Property | Required | Description | Type |
|----------|----------|-------------|------|
| actions | yes | the actions of the widget | object |
| actions.rest | no | rest api call actions triggered by the widget | array |
| actions.rest[].payloadKey | no | key used to nest the payload in the request body | string |
| actions.rest[].id | yes | unique identifier for the action | string |
| actions.rest[].resourceRefId | yes | the identifier of the k8s custom resource that should be represented | string |
| actions.rest[].requireConfirmation | no | whether user confirmation is required before triggering the action | boolean |
| actions.rest[].errorMessage | no | a message that will be displayed inside a toast in case of error | string |
| actions.rest[].successMessage | no | a message that will be displayed inside a toast in case of success | string |
| actions.rest[].onSuccessNavigateTo | no | url to navigate to after successful execution | string |
| actions.rest[].onEventNavigateTo | no | conditional navigation triggered by a specific event | object |
| actions.rest[].onEventNavigateTo.eventReason | yes | identifier of the awaited event reason | string |
| actions.rest[].onEventNavigateTo.url | yes | url to navigate to when the event is received | string |
| actions.rest[].onEventNavigateTo.timeout | no | the timeout in seconds to wait for the event | integer |
| actions.rest[].type | yes | type of action to execute | `rest` |
| actions.rest[].headers | no |  | array |
| actions.rest[].payload | no | static payload sent with the request | object |
| actions.rest[].payloadToOverride | no | list of payload fields to override dynamically | array |
| actions.rest[].payloadToOverride[].name | yes | name of the field to override | string |
| actions.rest[].payloadToOverride[].value | yes | value to use for overriding the field | string |
| actions.navigate | no | client-side navigation actions | array |
| actions.navigate[].id | yes | unique identifier for the action | string |
| actions.navigate[].type | yes | type of navigation action | `navigate` |
| actions.navigate[].resourceRefId | yes | the identifier of the k8s custom resource that should be represented | string |
| actions.navigate[].requireConfirmation | no | whether user confirmation is required before navigating | boolean |
| actions.openDrawer | no | actions to open side drawer components | array |
| actions.openDrawer[].id | yes | unique identifier for the drawer action | string |
| actions.openDrawer[].type | yes | type of drawer action | `openDrawer` |
| actions.openDrawer[].resourceRefId | yes | the identifier of the k8s custom resource that should be represented | string |
| actions.openDrawer[].requireConfirmation | no | whether user confirmation is required before opening | boolean |
| actions.openDrawer[].size | no | drawer size to be displayed | `default` \| `large` |
| actions.openDrawer[].title | no | title shown in the drawer header | string |
| actions.openModal | no | actions to open modal dialog components | array |
| actions.openModal[].id | yes | unique identifier for the modal action | string |
| actions.openModal[].type | yes | type of modal action | `openModal` |
| actions.openModal[].resourceRefId | yes | the identifier of the k8s custom resource that should be represented | string |
| actions.openModal[].requireConfirmation | no | whether user confirmation is required before opening | boolean |
| actions.openModal[].title | no | title shown in the modal header | string |
| color | no | the color of the button | `default` \| `primary` \| `danger` \| `blue` \| `purple` \| `cyan` \| `green` \| `magenta` \| `pink` \| `red` \| `orange` \| `yellow` \| `volcano` \| `geekblue` \| `lime` \| `gold` |
| label | no | the label of the button | string |
| icon | no | the icon of the button (font awesome icon name eg: `fa-inbox`) | string |
| shape | no | the shape of the button | `default` \| `circle` \| `round` |
| size | no | the size of the button | `small` \| `middle` \| `large` |
| type | no | the visual style of the button | `default` \| `text` \| `link` \| `primary` \| `dashed` |
| clickActionId | yes | the id of the action to be executed when the button is clicked | string |

<details>
<summary>Example</summary>

```yaml
kind: Button
apiVersion: widgets.templates.krateo.io/v1beta1
metadata:
  name: button-delete-test-app
  namespace: test-namespace
spec:
  widgetData:
    icon: fa-trash
    type: default
    shape: circle
    clickActionId: delete
    actions:
      rest:
        - id: delete
          resourceRefId: delete
          type: rest
          requireConfirmation: true
  resourcesRefs:
    - id: delete
      apiVersion: composition.krateo.io/v1-1-15
      resource: testapps
      name: hello-test-2
      namespace: test-namespace
      verb: DELETE
```
</details>

---

### Column

Column is a layout component that arranges its children in a vertical stack, aligning them one above the other with spacing between them

#### Props

| Property | Required | Description | Type |
|----------|----------|-------------|------|
| items | yes | the items of the column | array |
| items[].resourceRefId | yes | the identifier of the k8s Custom Resource that should be represented, usually a widget | string |
| size | no | the number of cells that the column will occupy, from 0 (not displayed) to 24 (occupies all space) | integer |

<details>
<summary>Example</summary>

```yaml
kind: Column
apiVersion: widgets.templates.krateo.io/v1beta1
metadata:
  name: test-column
  namespace: test-namespace
spec:
  widgetData:
    items:
      - resourceRefId: table-of-pods
      - resourceRefId: pie-chart-inside-column
  resourcesRefs:
    - id: table-of-pods
      apiVersion: widgets.templates.krateo.io/v1beta1
      name: table-of-pods
      namespace: test-namespace
      resource: tables
      verb: GET
    - id: pie-chart-inside-column
      apiVersion: widgets.templates.krateo.io/v1beta1
      name: pie-chart-inside-column
      namespace: test-namespace
      resource: piecharts
      verb: GET
```
</details>

---

### DataGrid



#### Props

| Property | Required | Description | Type |
|----------|----------|-------------|------|
| prefix | no | it's the filters prefix to get right values | string |
| asGrid | no | to show children as list or grid | boolean |
| grid | no | The grid type of list. You can set grid to something like {gutter: 16, column: 4} or specify the integer for columns based on their size, e.g. sm, md, etc. to make it responsive. | object |
| grid.gutter | no | The spacing between grid | integer |
| grid.column | no | The column of grid | integer |
| grid.xs | no | <576px column of grid | integer |
| grid.sm | no | ≥576px column of grid | integer |
| grid.md | no | ≥768px column of grid | integer |
| grid.lg | no | ≥992px column of grid | integer |
| grid.xl | no | ≥1200px column of grid | integer |
| grid.xxl | no | ≥1600px column of grid | integer |
| items | yes |  | array |
| items[].resourceRefId | yes |  | string |

---

### EventList

EventList renders data coming from a Kubernetes cluster or Server Sent Events associated to a specific endpoint and topic

#### Props

| Property | Required | Description | Type |
|----------|----------|-------------|------|
| events | yes | list of events received from a k8s cluster or server sent event | array |
| events[].icon | no | name of the icon associated with the event (font awesome icon name eg: `fa-inbox`) | string |
| events[].reason | yes | reason or cause of the event | string |
| events[].message | yes | descriptive message of the event | string |
| events[].type | yes | type of the event, e.g., normal or warning | `Normal` \| `Warning` |
| events[].count | no | number of times the event has occurred | integer |
| events[].action | no | action associated with the event, if any | string |
| events[].reportingComponent | no | component that reported the event | string |
| events[].reportingInstance | no | instance of the component that reported the event | string |
| events[].firstTimestamp | no | timestamp of the first occurrence of the event | string |
| events[].lastTimestamp | no | timestamp of the last occurrence of the event | string |
| events[].eventTime | no | specific timestamp of the event | string |
| events[].metadata | yes | metadata of the event such as name, namespace, and uid | object |
| events[].metadata.name | yes | unique name of the event | string |
| events[].metadata.namespace | yes | namespace the event belongs to | string |
| events[].metadata.uid | yes | unique identifier of the event | string |
| events[].metadata.creationTimestamp | yes | creation date and time of the event | string |
| events[].involvedObject | yes | object involved in the event with key details | object |
| events[].involvedObject.apiVersion | no | api version of the involved object | string |
| events[].involvedObject.kind | yes | resource type involved | string |
| events[].involvedObject.name | yes | name of the involved object | string |
| events[].involvedObject.namespace | yes | namespace of the involved object | string |
| events[].involvedObject.uid | yes | unique identifier of the involved object | string |
| events[].source | yes | information about the source generating the event | object |
| events[].source.component | no | component source of the event | string |
| events[].source.host | no | host where the event originated | string |
| sseEndpoint | no | endpoint url for server sent events connection | string |
| sseTopic | no | subscription topic for server sent events | string |

<details>
<summary>Example</summary>

```yaml
kind: EventList
apiVersion: widgets.templates.krateo.io/v1beta1
metadata:
  name: my-event-list
  namespace: test-namespace
spec:
  widgetData:
    events:
      - icon: "fa-exclamation-circle"
        reason: "FailedScheduling"
        message: "0/1 nodes are available: 1 Insufficient memory."
        type: "Warning"
        count: 3
        firstTimestamp: "2024-04-20T12:34:56Z"
        lastTimestamp: "2024-04-20T12:45:00Z"
        metadata:
          name: "my-pod.17d90d9c8ab2b1e1"
          namespace: "default"
          uid: "d1234567-89ab-4def-8123-abcdef012345"
          creationTimestamp: "2024-04-20T12:34:56Z"
        involvedObject:
          apiVersion: "v1"
          kind: "Pod"
          name: "my-pod"
          namespace: "default"
          uid: "abcd-1234"
        source:
          component: "scheduler"
      - icon: "fa-rocket"
        reason: "Started"
        message: "Started container nginx"
        type: "Normal"
        metadata:
          name: "nginx-pod.17d90d9c8ab2b1e2"
          namespace: "default"
          uid: "f1234567-89ab-4def-8123-abcdef012346"
          creationTimestamp: "2024-04-21T08:20:00Z"
        involvedObject:
          apiVersion: "v1"
          kind: "Pod"
          name: "nginx-pod"
          namespace: "default"
          uid: "defg-5678"
        source:
          component: "kubelet"
          host: "worker-node-1"
    sseEndpoint: "/events/stream"
    sseTopic: "k8s-event"
```
</details>

---

### Filters



#### Props

| Property | Required | Description | Type |
|----------|----------|-------------|------|
| prefix | yes | the prefix to share filters values to other widgets | string |
| fields | yes | it defines the filters as fields of a Form | array |
| fields[].label | yes | the label of the field | string |
| fields[].name | yes | the name of the filter field, it must to be identical to the widget prop name to filter or data in dataset | array |
| fields[].description | no | text to show as tooltip | string |
| fields[].type | yes | it's the filter field type, to render input, select, radio buttons, date picker or daterange picker | `string` \| `boolean` \| `number` \| `date` \| `daterange` |
| fields[].options | no | they're the options for select or radio, the type must be 'string' | array |

---

### FlowChart

FlowChart represents a Kubernetes composition as a directed graph. Each node represents a resource, and edges indicate parent-child relationships

#### Props

| Property | Required | Description | Type |
|----------|----------|-------------|------|
| data | no | list of kubernetes resources and their relationships to render as nodes in the flow chart | array |
| data[].createdAt | yes | timestamp indicating when the resource was created | string |
| data[].health | no | health status of the resource | object |
| data[].health.message | no | optional description of the health state | string |
| data[].health.reason | no | reason explaining the current health status | string |
| data[].health.status | no | short status keyword (e.g. healthy, degraded) | string |
| data[].health.type | no | type or category of health check | string |
| data[].kind | yes | kubernetes resource type (e.g. Deployment, Service) | string |
| data[].name | yes | name of the resource | string |
| data[].namespace | yes | namespace in which the resource is defined | string |
| data[].parentRefs | no | list of parent resources used to define graph relationships | array |
| data[].parentRefs[].createdAt | no | timestamp indicating when the parent resource was created | string |
| data[].parentRefs[].health | no | health status of the parent resource | object |
| data[].parentRefs[].health.message | no | optional description of the health state | string |
| data[].parentRefs[].health.reason | no | reason explaining the current health status | string |
| data[].parentRefs[].health.status | no | short status keyword | string |
| data[].parentRefs[].health.type | no | type or category of health check | string |
| data[].parentRefs[].kind | no | resource type of the parent | string |
| data[].parentRefs[].name | no | name of the parent resource | string |
| data[].parentRefs[].namespace | no | namespace of the parent resource | string |
| data[].parentRefs[].parentRefs | no | nested parent references for recursive relationships | array |
| data[].parentRefs[].resourceVersion | no | internal version string of the parent resource | string |
| data[].parentRefs[].uid | no | unique identifier of the parent resource | string |
| data[].parentRefs[].version | no | api version of the parent resource | string |
| data[].resourceVersion | yes | internal version string of the resource | string |
| data[].uid | yes | unique identifier of the resource | string |
| data[].version | yes | api version of the resource | string |

<details>
<summary>Example</summary>

```yaml
kind: FlowChart
apiVersion: widgets.templates.krateo.io/v1beta1
metadata:
  name: my-flow-chart
  namespace: test-namespace
spec:
  widgetData:
    data: [
    {
        "createdAt": "2025-05-29T14:35:56Z",
        "health": {
            "message": "Kind: Application - Name: hello-test-2 - Namespace: test-namespace - Message: Failed to load target state: failed to generate manifest for source 1 of 1: rpc error: code = Unknown desc = failed to list refs: authentication required: Repository not found.",
            "reason": "False",
            "status": "Degraded",
            "type": "CompositionStatus"
        },
        "kind": "CompositionReference",
        "name": "hello-test-2",
        "namespace": "fireworksapp-system",
        "parentRefs": [
            {}
        ],
        "resourceVersion": "39743",
        "uid": "a691a7b2-3170-4929-b3cf-a38b10e2d0a2",
        "version": "resourcetrees.krateo.io/v1"
    },
    {
        "createdAt": "2025-05-29T14:35:56Z",
        "health": {},
        "kind": "ConfigMap",
        "name": "hello-test-2-fireworks-app-replace-values",
        "namespace": "fireworksapp-system",
        "parentRefs": [
            {
                "createdAt": "2025-05-29T14:35:56Z",
                "health": {
                    "message": "Kind: Application - Name: hello-test-2 - Namespace: test-namespace - Message: Failed to load target state: failed to generate manifest for source 1 of 1: rpc error: code = Unknown desc = failed to list refs: authentication required: Repository not found.",
                    "reason": "False",
                    "status": "Degraded",
                    "type": "CompositionStatus"
                },
                "kind": "CompositionReference",
                "name": "hello-test-2",
                "namespace": "fireworksapp-system",
                "parentRefs": [
                    {}
                ],
                "resourceVersion": "39743",
                "uid": "a691a7b2-3170-4929-b3cf-a38b10e2d0a2",
                "version": "resourcetrees.krateo.io/v1"
            }
        ],
        "resourceVersion": "27039",
        "uid": "4ac6e09f-3ccf-4d65-ad3a-d4c1e1438bbf",
        "version": "v1"
    }
]
```
</details>

---

### Form

name of the k8s Custom Resource

#### Props

| Property | Required | Description | Type |
|----------|----------|-------------|------|
| actions | yes | the actions of the widget | object |
| actions.rest | no | rest api call actions triggered by the widget | array |
| actions.rest[].payloadKey | no | key used to nest the payload in the request body | string |
| actions.rest[].headers | no |  | array |
| actions.rest[].id | yes | unique identifier for the action | string |
| actions.rest[].resourceRefId | yes | the identifier of the k8s custom resource that should be represented | string |
| actions.rest[].requireConfirmation | no | whether user confirmation is required before triggering the action | boolean |
| actions.rest[].onSuccessNavigateTo | no | url to navigate to after successful execution | string |
| actions.rest[].errorMessage | no | a message that will be displayed inside a toast in case of error | string |
| actions.rest[].successMessage | no | a message that will be displayed inside a toast in case of success | string |
| actions.rest[].onEventNavigateTo | no | conditional navigation triggered by a specific event | object |
| actions.rest[].onEventNavigateTo.eventReason | yes | identifier of the awaited event reason | string |
| actions.rest[].onEventNavigateTo.url | yes | url to navigate to when the event is received | string |
| actions.rest[].onEventNavigateTo.timeout | no | the timeout in seconds to wait for the event | integer |
| actions.rest[].type | yes | type of action to execute | `rest` |
| actions.rest[].payload | no | static payload sent with the request | object |
| actions.rest[].payloadToOverride | no | list of payload fields to override dynamically | array |
| actions.rest[].payloadToOverride[].name | yes | name of the field to override | string |
| actions.rest[].payloadToOverride[].value | yes | value to use for overriding the field | string |
| actions.navigate | no | client-side navigation actions | array |
| actions.navigate[].id | yes | unique identifier for the action | string |
| actions.navigate[].type | yes | type of navigation action | `navigate` |
| actions.navigate[].resourceRefId | yes | the identifier of the k8s custom resource that should be represented | string |
| actions.navigate[].requireConfirmation | no | whether user confirmation is required before navigating | boolean |
| actions.openDrawer | no | actions to open side drawer components | array |
| actions.openDrawer[].id | yes | unique identifier for the drawer action | string |
| actions.openDrawer[].type | yes | type of drawer action | `openDrawer` |
| actions.openDrawer[].resourceRefId | yes | the identifier of the k8s custom resource that should be represented | string |
| actions.openDrawer[].requireConfirmation | no | whether user confirmation is required before opening | boolean |
| actions.openDrawer[].size | no | drawer size to be displayed | `default` \| `large` |
| actions.openDrawer[].title | no | title shown in the drawer header | string |
| actions.openModal | no | actions to open modal dialog components | array |
| actions.openModal[].id | yes | unique identifier for the modal action | string |
| actions.openModal[].type | yes | type of modal action | `openModal` |
| actions.openModal[].resourceRefId | yes | the identifier of the k8s custom resource that should be represented | string |
| actions.openModal[].requireConfirmation | no | whether user confirmation is required before opening | boolean |
| actions.openModal[].title | no | title shown in the modal header | string |
| buttonConfig | no | custom labels and icons for form buttons | object |
| buttonConfig.primary | no | primary button configuration | object |
| buttonConfig.primary.label | no | text label for primary button | string |
| buttonConfig.primary.icon | no | icon name for primary button | string |
| buttonConfig.secondary | no | secondary button configuration | object |
| buttonConfig.secondary.label | no | text label for secondary button | string |
| buttonConfig.secondary.icon | no | icon name for secondary button | string |
| schema | no | the schema of the form as an object | object |
| stringSchema | no | the schema of the form as a string | string |
| submitActionId | yes | the id of the action to be called when the form is submitted | string |
| fieldDescription | no |  | `tooltip` \| `inline` |
| autocomplete | no | autocomplete configuration for the form fields | array |
| autocomplete[].path | yes | the path of the field to apply autocomplete | string |
| autocomplete[].fetch | yes | remote data source configuration for autocomplete | object |
| autocomplete[].fetch.url | yes | the URL to fetch autocomplete options from | string |
| autocomplete[].fetch.verb | yes | HTTP method to use for fetching options | `GET` \| `POST` |

<details>
<summary>Example</summary>

```yaml
kind: Form
apiVersion: widgets.templates.krateo.io/v1beta1
metadata:
  name: form-example
  namespace: test-namespace
spec:
  widgetData:
    submitActionId: firework-submit-action
    stringSchema: |
      {
        "type": "object",
        "properties": {
          "name": {
            "type": "string",
            "title": "Application Name",
            "description": "The name of your fireworks app"
          },
          "image": {
            "type": "string",
            "title": "Container Image",
            "description": "Full image path (e.g., ghcr.io/org/image:tag)"
          },
          "replicas": {
            "type": "integer",
            "title": "Number of Replicas",
            "default": 1
          },
          "enableMetrics": {
            "type": "boolean",
            "title": "Enable Metrics",
            "default": false
          }
        },
        "required": ["name", "image"]
      }
    autocomplete:
      - path: name
        fetch:
          url: https://loremipsum.io/api/1
          method: GET
    actions:
      rest:
        - id: firework-submit-action
          resourceRefId: resource-ref-1
          type: rest
          payloadKey: spec
          onSuccessNavigateTo: /compositions/${metadata.namespace}/${metadata.name}
          payloadToOverride:
            - name: metadata.name
              value: ${ git.toRepo.name }
  resourcesRefs:
    - id: resource-ref-1
      apiVersion: composition.krateo.io/v2-0-0
      name: new-app
      namespace: test-namespace
      resource: fireworksapps
      verb: POST
```
</details>

---

### LineChart

LineChart displays a customizable line chart based on time series or numerical data. It supports multiple lines with colored coordinates and axis labels, typically used to visualize metrics from Kubernetes resources

#### Props

| Property | Required | Description | Type |
|----------|----------|-------------|------|
| prefix | no | it's the filters prefix to get right values | string |
| lines | yes | list of data series to be rendered as individual lines | array |
| lines[].name | no | label of the line displayed in the legend | string |
| lines[].color | no | color used to render the line | `blue` \| `darkBlue` \| `orange` \| `gray` \| `red` \| `green` |
| lines[].coords | no | data points that define the line | array |
| lines[].coords[].xAxis | yes | value on the x axis | string |
| lines[].coords[].yAxis | yes | value on the y axis | string |
| xAxisName | no | label for the x axis | string |
| yAxisName | no | label for the y axis | string |

<details>
<summary>Example</summary>

```yaml
kind: LineChart
apiVersion: widgets.templates.krateo.io/v1beta1
metadata:
  name: my-line-chart
  namespace: test-namespace
spec:
  widgetData:
    lines:
      - name: blue line
        color: blue
        coords:
          - xAxis: 0
            yAxis: 15
          - xAxis: 1
            yAxis: 52
          - xAxis: 2
            yAxis: 15
          - xAxis: 3
            yAxis: 52
      - name: red line
        color: red
        coords:
          - xAxis: 0
            yAxis: 4
          - xAxis: 1
            yAxis: 8
          - xAxis: 2
            yAxis: 12
          - xAxis: 3
            yAxis: 2
    xAxisName: time
    yAxisName: cost
```
</details>

---

### NavMenu

NavMenu is a container for NavMenuItem widgets, which are used to setup navigation inside the application

#### Props

| Property | Required | Description | Type |
|----------|----------|-------------|------|
| items | yes | list of navigation entries each pointing to a k8s custom resource | array |
| items[].resourceRefId | yes | the identifier of the k8s custom resource that should be represented, usually a NavMenuItem | string |

<details>
<summary>Example</summary>

```yaml
kind: NavMenu
apiVersion: widgets.templates.krateo.io/v1beta1
metadata:
  name: sidebar-nav-menu
  namespace: test-namespace
spec:
  widgetData:
    items:
      - resourceRefId: nav-menu-item-templates
  resourcesRefs:
    - id: nav-menu-item-templates
      apiVersion: widgets.templates.krateo.io/v1beta1
      name: nav-menu-item-templates
      namespace: test-namespace
      resource: navemenuitems
      verb: GET
```
</details>

---

### NavMenuItem

NavMenuItem represents a single item in the navigation menu and links to a specific resource and route in the application

#### Props

| Property | Required | Description | Type |
|----------|----------|-------------|------|
| label | yes | text displayed as the menu item's label | string |
| icon | yes | name of the icon to display alongside the label (font awesome icon name eg: `fa-inbox`) | string |
| path | yes | route path to navigate to when the menu item is clicked | string |
| resourceRefId | yes | the identifier of the k8s custom resource that should be represented, usually a widget | string |
| order | no | a weight to be used to sort the items in the menu | integer |

<details>
<summary>Example</summary>

```yaml
kind: NavMenuItem
apiVersion: widgets.templates.krateo.io/v1beta1
metadata:
  name: nav-menu-item-templates
  namespace: test-namespace
spec:
  widgetData:
    resourceRefId: templates-page
    label: Templates
    icon: fa-rectangle-list
    path: /templates
    order: 20

  resourcesRefs:
    - id: templates-page
      apiVersion: widgets.templates.krateo.io/v1beta1
      name: templates-page
      namespace: test-namespace
      resource: pages
      verb: GET
```
</details>

---

### Page

Page is a wrapper component, placed at the top of the component tree, that wraps and renders all nested components.

#### Props

| Property | Required | Description | Type |
|----------|----------|-------------|------|
| title | no | title of the page shown in the browser tab | string |
| items | yes | list of resources to be rendered within the route | array |
| items[].resourceRefId | yes | the identifier of the k8s custom resource that should be rendered, usually a widget | string |

<details>
<summary>Example</summary>

```yaml
kind: Page
apiVersion: widgets.templates.krateo.io/v1beta1
metadata:
  name: compositions-route
  namespace: test-namespace
spec:
  widgetData:
    items:
      - resourceRefId: composition-test-row
  resourcesRefs:
    - id: composition-test-row
      apiVersion: widgets.templates.krateo.io/v1beta1
      name: composition-test-row
      namespace: test-namespace
      resource: rows
      verb: GET
```
</details>

---

### Panel

Panel is a container to display information

#### Props

| Property | Required | Description | Type |
|----------|----------|-------------|------|
| actions | yes | the actions of the widget | object |
| actions.rest | no | rest api call actions triggered by the widget | array |
| actions.rest[].payloadKey | no | key used to nest the payload in the request body | string |
| actions.rest[].headers | no |  | array |
| actions.rest[].id | yes | unique identifier for the action | string |
| actions.rest[].resourceRefId | yes | the identifier of the k8s custom resource that should be represented | string |
| actions.rest[].requireConfirmation | no | whether user confirmation is required before triggering the action | boolean |
| actions.rest[].onSuccessNavigateTo | no | url to navigate to after successful execution | string |
| actions.rest[].errorMessage | no | a message that will be displayed inside a toast in case of error | string |
| actions.rest[].successMessage | no | a message that will be displayed inside a toast in case of success | string |
| actions.rest[].onEventNavigateTo | no | conditional navigation triggered by a specific event | object |
| actions.rest[].onEventNavigateTo.eventReason | yes | identifier of the awaited event reason | string |
| actions.rest[].onEventNavigateTo.url | yes | url to navigate to when the event is received | string |
| actions.rest[].onEventNavigateTo.timeout | no | the timeout in seconds to wait for the event | integer |
| actions.rest[].type | yes | type of action to execute | `rest` |
| actions.rest[].payload | no | static payload sent with the request | object |
| actions.rest[].payloadToOverride | no | list of payload fields to override dynamically | array |
| actions.rest[].payloadToOverride[].name | yes | name of the field to override | string |
| actions.rest[].payloadToOverride[].value | yes | value to use for overriding the field | string |
| actions.navigate | no | client-side navigation actions | array |
| actions.navigate[].id | yes | unique identifier for the action | string |
| actions.navigate[].type | yes | type of navigation action | `navigate` |
| actions.navigate[].resourceRefId | yes | the identifier of the k8s custom resource that should be represented | string |
| actions.navigate[].requireConfirmation | no | whether user confirmation is required before navigating | boolean |
| actions.openDrawer | no | actions to open side drawer components | array |
| actions.openDrawer[].id | yes | unique identifier for the drawer action | string |
| actions.openDrawer[].type | yes | type of drawer action | `openDrawer` |
| actions.openDrawer[].resourceRefId | yes | the identifier of the k8s custom resource that should be represented | string |
| actions.openDrawer[].requireConfirmation | no | whether user confirmation is required before opening | boolean |
| actions.openDrawer[].size | no | drawer size to be displayed | `default` \| `large` |
| actions.openDrawer[].title | no | title shown in the drawer header | string |
| actions.openModal | no | actions to open modal dialog components | array |
| actions.openModal[].id | yes | unique identifier for the modal action | string |
| actions.openModal[].type | yes | type of modal action | `openModal` |
| actions.openModal[].resourceRefId | yes | the identifier of the k8s custom resource that should be represented | string |
| actions.openModal[].requireConfirmation | no | whether user confirmation is required before opening | boolean |
| actions.openModal[].title | no | title shown in the modal header | string |
| clickActionId | no | the id of the action to be executed when the panel is clicked | string |
| footer | no | footer section of the panel containing additional items | array |
| footer[].resourceRefId | yes | the identifier of the k8s custom resource that should be represented, usually a widget | string |
| tags | no | list of string tags to be displayed in the footer | array |
| headerLeft | no | optional text to be displayed under the title, on the left side of the Panel | string |
| headerRight | no | optional text to be displayed under the title, on the right side of the Panel | string |
| icon | no | icon displayed in the panel header | object |
| icon.name | yes | name of the icon to display (font awesome icon name eg: `fa-inbox`) | string |
| icon.color | no | color of the icon | string |
| items | yes | list of resource references to display as main content in the panel | array |
| items[].resourceRefId | yes | the identifier of the k8s custom resource that should be represented, usually a widget | string |
| title | no | text to be displayed as the panel title | string |
| tooltip | no | optional tooltip text shown on the top right side of the card to provide additional context | string |

<details>
<summary>Example</summary>

```yaml
apiVersion: widgets.templates.krateo.io/v1beta1
metadata:
  name: my-panel
  namespace: test-namespace
spec:
  widgetData:
    actions: {}
    title: My Panel
    items:
      - resourceRefId: my-pie-chart
      - resourceRefId: my-table
    tooltip: this is a tooltip!
    footer:
      items:
        - resourceRefId: button-1
        - resourceRefId: button-2
  resourcesRefs:
    - id: my-table
      apiVersion: widgets.templates.krateo.io/v1beta1
      name: my-table
      namespace: test-namespace
      resource: tables
      verb: GET
    - id: my-pie-chart
      apiVersion: widgets.templates.krateo.io/v1beta1
      name: my-pie-chart
      namespace: test-namespace
      resource: piecharts
      verb: GET
    - id: button-1
      apiVersion: widgets.templates.krateo.io/v1beta1
      name: button-1
      namespace: test-namespace
      resource: buttons
      verb: GET
    - id: button-2
      apiVersion: widgets.templates.krateo.io/v1beta1
      name: button-2
      namespace: test-namespace
      resource: buttons
      verb: GET
```
</details>

---

### Paragraph

Paragraph is a simple component used to display a block of text

#### Props

| Property | Required | Description | Type |
|----------|----------|-------------|------|
| text | yes | the content of the paragraph to be displayed | string |

<details>
<summary>Example</summary>

```yaml
kind: Paragraph
apiVersion: widgets.templates.krateo.io/v1beta1
metadata:
  name: my-paragraph
  namespace: test-namespace
spec:
  widgetData:
    text: "This is a paragraph"
```
</details>

---

### PieChart

PieChart is a visual component used to display categorical data as segments of a pie chart

#### Props

| Property | Required | Description | Type |
|----------|----------|-------------|------|
| title | yes | title displayed above the chart | string |
| description | no | supplementary text displayed below or near the title | string |
| series | no | data to be visualized in the pie chart | object |
| series.total | yes | sum of all data values, used to calculate segment sizes | integer |
| series.data | yes | individual segments of the pie chart | array |
| series.data[].color | yes | color used to represent the segment | `blue` \| `darkBlue` \| `orange` \| `gray` \| `red` \| `green` |
| series.data[].value | yes | numeric value for the segment | integer |
| series.data[].label | yes | label for the segment | string |

<details>
<summary>Example</summary>

```yaml
kind: PieChart
apiVersion: widgets.templates.krateo.io/v1beta1
metadata:
  name: my-pie-chart
  namespace: test-namespace
spec:
  widgetData:
    title: Pie chart
    description: This is a description
    series:
      total: 100
      data:
        - color: blue
          value: 10
          label: Blue
        - color: darkBlue
          value: 20
          label: Dark Blue
        - color: orange
          value: 30
          label: Orange
```
</details>

---

### Route

Route is a configuration to map a path to show in the frontend URL to a resource, it doesn't render anything by itself

#### Props

| Property | Required | Description | Type |
|----------|----------|-------------|------|
| path | yes | the url path to that loads the resource | string |
| resourceRefId | yes | the id matching the resource in the resourcesRefs array, must of kind page | string |

---

### RoutesLoader

RoutesLoader loads the Route widgets it doesn't render anything by itself

#### Props

*No props available.*

---

### Row

name of the k8s Custom Resource

#### Props

| Property | Required | Description | Type |
|----------|----------|-------------|------|
| items | yes | the items of the row | array |
| items[].resourceRefId | yes |  | string |
| items[].size | no | the number of cells that the item will occupy, from 0 (not displayed) to 24 (occupies all space) | integer |

<details>
<summary>Example</summary>

```yaml
kind: Row
apiVersion: widgets.templates.krateo.io/v1beta1
metadata:
  name: composition-test-row
  namespace: test-namespace
spec:
  widgetData:
    items:
      - resourceRefId: composition-test-panel
  resourcesRefs:
    - id: composition-test-panel
      apiVersion: widgets.templates.krateo.io/v1beta1
      name: composition-test-panel
      namespace: test-namespace
      resource: panels
      verb: GET
```
</details>

---

### Table

Table displays structured data with customizable columns and pagination

#### Props

| Property | Required | Description | Type |
|----------|----------|-------------|------|
| prefix | no | it's the filters prefix to get right values | string |
| pageSize | no | number of rows displayed per page | integer |
| data | yes | array of objects representing the table's row data | array |
| columns | yes | configuration of the table's columns | array |
| columns[].color | no | the color of the value (or the icon) to be represented | `blue` \| `darkBlue` \| `orange` \| `gray` \| `red` \| `green` |
| columns[].kind | no | type of data to be represented | `value` \| `icon` |
| columns[].title | yes | column header label | string |
| columns[].valueKey | yes | key used to extract the value from row data | string |

<details>
<summary>Example</summary>

```yaml
kind: Table
apiVersion: widgets.templates.krateo.io/v1beta1
metadata:
  name: my-table
  namespace: test-namespace
spec:
  widgetData:
    pageSize: 10
    data: 
      - name: Alice
        age: 30
        icon: fa-rocket
      - name: Bob
        age: 45
        icon: fa-exclamation-circle
    columns:
      - valueKey: name
        title: Name
      - valueKey: age
        title: Age
      - valueKey: icon
        title: Icon
        kind: icon
        color: red
```
</details>

---

### TabList

TabList display a set of tab items for navigation or content grouping

#### Props

| Property | Required | Description | Type |
|----------|----------|-------------|------|
| items | yes | the items of the tab list | array |
| items[].label | no | text displayed on the tab | string |
| items[].resourceRefId | yes | the identifier of the k8s custom resource represented by the tab content | string |

<details>
<summary>Example</summary>

```yaml
kind: TabList
apiVersion: widgets.templates.krateo.io/v1beta1
metadata:
  name: my-tab-list
  namespace: test-namespace
spec:
  widgetData:
    items:
      - label: first tab
        resourceRefId: first-column
      - label: second tab
        resourceRefId: second-column
  resourcesRefs:
    - id: first-column
      apiVersion: widgets.templates.krateo.io/v1beta1
      name: first-column
      namespace: test-namespace
      resource: columns
      verb: GET
    - id: second-column
      apiVersion: widgets.templates.krateo.io/v1beta1
      name: second-column
      namespace: test-namespace
      resource: columns
      verb: GET
```
</details>

---

### YamlViewer

YamlViewer receives a JSON string as input and renders its equivalent YAML representation for display.

#### Props

| Property | Required | Description | Type |
|----------|----------|-------------|------|
| json | yes | json string to be converted and displayed as yaml | string |

<details>
<summary>Example</summary>

```yaml
kind: YamlViewer
apiVersion: widgets.templates.krateo.io/v1beta1
metadata:
  name: my-yaml-viewer
  namespace: test-namespace
spec:
  widgetData:
    json: '{"type":"object","additionalProperties":false,"properties":{"kind":{"type":"string","default":"YamlViewer"}}}'
```
</details>
