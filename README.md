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



#### Props

| Property | Required | Description | Type |
|----------|----------|-------------|------|
| data | yes |  | array |

---

### Column



#### Props

| Property | Required | Description | Type |
|----------|----------|-------------|------|
| items | yes | the items of the column | array |
| size | no | the number of cells that the column will occupy, from 0 (not displayed) to 24 (occupies all space) | integer |

---

### Button



#### Props

| Property | Required | Description | Type |
|----------|----------|-------------|------|
| color | no | the color of the button | `default` \| `primary` \| `danger` \| `blue` \| `purple` \| `cyan` \| `green` \| `magenta` \| `pink` \| `red` \| `orange` \| `yellow` \| `volcano` \| `geekblue` \| `lime` \| `gold` |
| label | no | the label of the button | string |
| icon | no | the icon of the button (font awesome icon name eg: 'fa-inbox') | string |
| shape | no | the shape of the button | `default` \| `circle` \| `round` |
| size | no | the size of the button | `small` \| `middle` \| `large` |
| type | no | the visual style of the button | `default` \| `text` \| `link` \| `primary` \| `dashed` |
| clickActionId | yes | the id of the action to be executed when the button is clicked | string |

---

### CompositionCard



#### Props

| Property | Required | Description | Type |
|----------|----------|-------------|------|
| date | no |  | string |
| description | no |  | string |
| icon | no |  | object |
| status | no |  | string |
| tags | no |  | array |
| title | no |  | string |
| tooltip | no |  | string |
| deleteCompositionActionId | no | the id of the action to be executed when the delete button is clicked | string |
| navigateToDetailActionId | no | the id of the action to be executed when the panel is clicked | string |

---

### EventList



#### Props

| Property | Required | Description | Type |
|----------|----------|-------------|------|
| events | yes |  | array |
| sseEndpoint | no |  | string |
| sseTopic | no |  | string |

---

### FlowChart



#### Props

| Property | Required | Description | Type |
|----------|----------|-------------|------|
| data | no |  | array |

---

### FormTest



#### Props

| Property | Required | Description | Type |
|----------|----------|-------------|------|
| schema | no | the schema of the form as an object | object |
| stringSchema | no | the schema of the form as a string | string |
| submitActionId | yes | the id of the action to be called when the form is submitted | string |

---

### LineChart



#### Props

| Property | Required | Description | Type |
|----------|----------|-------------|------|
| lines | yes |  | array |
| xAxisName | no |  | string |
| yAxisName | no |  | string |

---

### NavMenu



#### Props

| Property | Required | Description | Type |
|----------|----------|-------------|------|
| items | yes |  | array |

---

### NavMenuItem



#### Props

| Property | Required | Description | Type |
|----------|----------|-------------|------|
| label | yes |  | string |
| icon | yes |  | string |
| path | yes |  | string |
| resourceRefId | yes |  | string |
| order | no | a weight to be used to sort the items in the menu | integer |

---

### Panel



#### Props

| Property | Required | Description | Type |
|----------|----------|-------------|------|
| clickActionId | no | the id of the action to be executed when the panel is clicked | string |
| footer | no |  | object |
| icon | no |  | object |
| items | yes |  | array |
| title | no |  | string |
| tooltip | no |  | string |

---

### Paragraph



#### Props

| Property | Required | Description | Type |
|----------|----------|-------------|------|
| text | yes |  | string |

---

### PieChart



#### Props

| Property | Required | Description | Type |
|----------|----------|-------------|------|
| title | yes |  | string |
| description | no |  | string |
| series | no |  | object |

---

### Route



#### Props

| Property | Required | Description | Type |
|----------|----------|-------------|------|
| items | yes |  | array |

---

### Row



#### Props

| Property | Required | Description | Type |
|----------|----------|-------------|------|
| items | yes | the items of the row | array |

---

### TabList



#### Props

| Property | Required | Description | Type |
|----------|----------|-------------|------|
| items | yes | the items of the tab list | array |

---

### Table



#### Props

| Property | Required | Description | Type |
|----------|----------|-------------|------|
| pageSize | no |  | integer |
| data | yes |  | array |
| columns | yes |  | array |

---

### YamlViewer



#### Props

| Property | Required | Description | Type |
|----------|----------|-------------|------|
| json | yes |  | string |
