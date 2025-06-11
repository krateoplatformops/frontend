# Frontend

## How to Run Locally

To get started running the frontend locally, follow the steps below.

---

### Step 1: Create a cluster (kind) with an instance of Krateo installed

```bash
curl -L https://github.com/krateoplatformops/krateo-v2-docs/releases/latest/download/kind.sh | sh
kubectl wait krateoplatformops krateo --for condition=Ready=True --namespace krateo-system --timeout=300s
```

Add JWT secret to the cluster:

```bash
kubectl create secret generic jwt-sign-key --from-literal=JWT_SIGN_KEY=AbbraCadabbra -n krateo-system
```


### Step 2: start the application and authenticate

Execute the following command to start the app locally:

```bash
npm run dev
```

Start the application on http://localhost:4000/login and login with the user `admin` and the password retrieved by executing the following command:

```bash
kubectl get secret admin-password  -n krateo-system -o jsonpath="{.data.password}" | base64 -d
```

### Step 3: open a terminal and install / update the latest version of Snowplow

```bash
helm upgrade snowplow krateo/snowplow -n krateo-system --set image.tag=0.11.2
```

After executing the command follow the instructions to set a local port for Snowplow.

### Step 4: open a terminal and install / update the latest version of Smithery


```bash
helm upgrade smithery krateo/smithery -n krateo-system --install --set livenessProbe=null --set readinessProbe=null --set image.tag=0.6.0
```


After executing the command follow the instructions to set a local port for Smithery.

### Step 5: open a terminal and install / update the latest version of Authn

```
helm upgrade authn krateo/authn -n krateo-system --install --set livenessProbe=null --set readinessProbe=null --set image.tag=0.20.1
```

### Step 6: send JSON schemas to Smithery to create CRDs

Run the following command to execute a script that sends all files with `.schema.json` extension on the repository to Smithery, validates them and creates the related CRDs.

```bash
npm run send-schemas
```

### Step 7: apply custom resources

Run the following command to execute a script that creates all the custom resources defined by all files with `.yaml` extension on the repository.

```bash
npm run apply-all
```

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

---

### Button

Button represents an interactive component which, when clicked, triggers a specific business logic defined by its `clickActionId`

#### Props

| Property | Required | Description | Type |
|----------|----------|-------------|------|
| color | no | the color of the button | `default` \| `primary` \| `danger` \| `blue` \| `purple` \| `cyan` \| `green` \| `magenta` \| `pink` \| `red` \| `orange` \| `yellow` \| `volcano` \| `geekblue` \| `lime` \| `gold` |
| label | no | the label of the button | string |
| icon | no | the icon of the button (font awesome icon name eg: `fa-inbox`) | string |
| shape | no | the shape of the button | `default` \| `circle` \| `round` |
| size | no | the size of the button | `small` \| `middle` \| `large` |
| type | no | the visual style of the button | `default` \| `text` \| `link` \| `primary` \| `dashed` |
| clickActionId | yes | the id of the action to be executed when the button is clicked | string |

---

### Column

Column is a layout component that arranges its children in a vertical stack, aligning them one above the other with spacing between them

#### Props

| Property | Required | Description | Type |
|----------|----------|-------------|------|
| items | yes | the items of the column | array |
| items[].resourceRefId | yes | the identifier of the k8s Custom Resource that should be represented, usually a widget | string |
| size | no | the number of cells that the column will occupy, from 0 (not displayed) to 24 (occupies all space) | integer |

---

### CompositionCard

CompositionCard represents a container to display information about a Composition

#### Props

| Property | Required | Description | Type |
|----------|----------|-------------|------|
| date | no | date associated with the composition, typically its creation time | string |
| description | no | short text describing the composition's purpose or status | string |
| icon | no | icon displayed on the card | object |
| icon.name | yes | icon name to display (font awesome icon name eg: `fa-inbox`) | string |
| icon.color | no | color of the icon | string |
| status | no | current status of the composition (e.g., running, failed, pending) | string |
| tags | no | list of tags for categorizing or filtering the composition | array |
| title | no | main title of the card, usually the name of the composition | string |
| tooltip | no | optional tooltip text shown on the top right side of the card to provide additional context | string |
| deleteCompositionActionId | no | id of the action triggered when the delete button is clicked | string |
| navigateToDetailActionId | no | id of the action triggered when the card is clicked | string |

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

---

### FormTest

name of the k8s Custom Resource

#### Props

| Property | Required | Description | Type |
|----------|----------|-------------|------|
| schema | no | the schema of the form as an object | object |
| stringSchema | no | the schema of the form as a string | string |
| submitActionId | yes | the id of the action to be called when the form is submitted | string |

---

### LineChart

LineChart displays a customizable line chart based on time series or numerical data. It supports multiple lines with colored coordinates and axis labels, typically used to visualize metrics from Kubernetes resources

#### Props

| Property | Required | Description | Type |
|----------|----------|-------------|------|
| lines | yes | list of data series to be rendered as individual lines | array |
| lines[].name | no | label of the line displayed in the legend | string |
| lines[].color | no | color used to render the line | `blue` \| `darkBlue` \| `orange` \| `gray` \| `red` \| `green` |
| lines[].coords | no | data points that define the line | array |
| lines[].coords[].xAxis | yes | value on the x axis | integer |
| lines[].coords[].yAxis | yes | value on the y axis | integer |
| xAxisName | no | label for the x axis | string |
| yAxisName | no | label for the y axis | string |

---

### NavMenu

NavMenu is a container for NavMenuItem widgets, which are used to setup navigation inside the application

#### Props

| Property | Required | Description | Type |
|----------|----------|-------------|------|
| items | yes | list of navigation entries each pointing to a k8s custom resource | array |
| items[].resourceRefId | yes | the identifier of the k8s custom resource that should be represented, usually a NavMenuItem | string |

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

---

### Panel

Panel is a container to display information

#### Props

| Property | Required | Description | Type |
|----------|----------|-------------|------|
| clickActionId | no | the id of the action to be executed when the panel is clicked | string |
| footer | no | footer section of the panel containing additional items and tags | object |
| footer.items | yes | list of resource references to render in the footer | array |
| footer.items[].resourceRefId | yes | the identifier of the k8s custom resource that should be represented, usually a widget | string |
| footer.tags | no | list of string tags to be displayed in the footer | array |
| icon | no | icon displayed in the panel header | object |
| icon.name | yes | name of the icon to display (font awesome icon name eg: `fa-inbox`) | string |
| icon.color | no | color of the icon | string |
| items | yes | list of resource references to display as main content in the panel | array |
| items[].resourceRefId | yes | the identifier of the k8s custom resource that should be represented, usually a widget | string |
| title | no | text to be displayed as the panel title | string |
| tooltip | no | optional tooltip text shown on the top right side of the card to provide additional context | string |

---

### Paragraph

Paragraph is a simple component used to display a block of text

#### Props

| Property | Required | Description | Type |
|----------|----------|-------------|------|
| text | yes | the content of the paragraph to be displayed | string |

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

---

### Route

Route is a wrapper component, typically placed at the top of the component tree, that wraps and renders all nested components.

#### Props

| Property | Required | Description | Type |
|----------|----------|-------------|------|
| items | yes | list of resources to be rendered within the route | array |
| items[].resourceRefId | yes | the identifier of the k8s custom resource that should be rendered, usually a widget | string |

---

### Row

name of the k8s Custom Resource

#### Props

| Property | Required | Description | Type |
|----------|----------|-------------|------|
| items | yes | the items of the row | array |
| items[].resourceRefId | yes |  | string |
| items[].size | no | the number of cells that the item will occupy, from 0 (not displayed) to 24 (occupies all space) | integer |

---

### Table

Table displays structured data with customizable columns and pagination

#### Props

| Property | Required | Description | Type |
|----------|----------|-------------|------|
| pageSize | no | number of rows displayed per page | integer |
| data | yes | array of objects representing the table's row data | array |
| columns | yes | configuration of the table's columns | array |
| columns[].valueKey | no | key used to extract the value from row data | string |
| columns[].title | no | column header label | string |

---

### TabList

TabList display a set of tab items for navigation or content grouping

#### Props

| Property | Required | Description | Type |
|----------|----------|-------------|------|
| items | yes | the items of the tab list | array |
| items[].label | no | text displayed on the tab | string |
| items[].resourceRefId | yes | the identifier of the k8s custom resource represented by the tab content | string |

---

### YamlViewer

YamlViewer receives a JSON string as input and renders its equivalent YAML representation for display.

#### Props

| Property | Required | Description | Type |
|----------|----------|-------------|------|
| json | yes | json string to be converted and displayed as yaml | string |
