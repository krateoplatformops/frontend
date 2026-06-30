# Widget creation guide

This guide is written for Claude Code. Follow every step in order.
Skipping a step — especially step 1 — breaks the other steps.

---

## The checklist (complete every item, in this sequence)

```
[ ] 1. Write the JSON Schema
[ ] 2. Run generate-types  →  TypeScript type auto-generated
[ ] 3. Run generate-crds   →  CRD YAML auto-generated
[ ] 4. Write the YAML example file
[ ] 5. Write the React component + CSS Module
[ ] 6. Run update-readme-widgets  → Add a row to docs/widgets-api-reference.md
[ ] 7. Run lint 
```

---

## Naming rules

| Thing | Convention | Example |
|---|---|---|
| Widget name | `PascalCase` | `StatusBadge` |
| Folder names | `PascalCase` matching widget name | `src/widgets/StatusBadge/` |
| File names | `PascalCase.ts` | `StatusBadge.tsx`, `StatusBadge.module.css` |
| YAML `kind` | Same as widget name | `kind: StatusBadge` |
| YAML `metadata.name` | `kebab-case`, prefixed `example-` | `example-status-badge-basic` |
| k8s resource (plural) | `kebab-case` plural lowercase | `statusbadges` |
| `apiVersion` | always `widgets.templates.krateo.io/v1beta1` | — |

---

## Step 1 — JSON Schema

**Location:** `src/widgets/<WidgetName>/<WidgetName>.schema.json`

This is the single source of truth for the widget's contract.
TypeScript types and CRDs are generated from it — never the other way around.

### Minimal skeleton

```json
{
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "version": {
      "description": "widget version",
      "type": "string",
      "default": "v1beta1"
    },
    "kind": {
      "default": "Notifications",
      "description": "Notifications renders messages coming from a Kubernetes cluster",
      "type": "string"
    },
    "spec": {
      "type": "object",
      "properties": {
        "widgetData": {
          "type": "object",
          "properties": {
            "queryParams": {
              "description": "list of query parameters to add to the notifications call",
              "type": "array",
              "items": {
                "description": "key-value definition of a specific query parameter",
                "type": "object",
                "properties": {
                  "name": {
                    "description": "the name of the query parameter",
                    "type": "string"
                  },
                  "value": {
                    "description": "the value of the query parameter",
                    "type": "string"
                  }
                },
                "required": ["name", "value"],
                "additionalProperties": false
              }
            }
          },
          "additionalProperties": false
        },
        "resourcesRefs": {
          "type": "object",
          "properties": {
            "items": {
              "type": "array",
              "items": {
                "type": "object",
                "properties": {
                  "allowed": {
                    "type": "boolean"
                  },
                  "apiVersion": {
                    "type": "string"
                  },
                  "id": {
                    "type": "string"
                  },
                  "name": {
                    "type": "string"
                  },
                  "namespace": {
                    "type": "string"
                  },
                  "payload": {
                    "type": "object"
                  },
                  "resource": {
                    "type": "string"
                  },
                  "verb": {
                    "type": "string",
                    "enum": ["POST", "PUT", "PATCH", "DELETE", "GET"]
                  },
                  "slice": {
                    "type": "object",
                    "properties": {
                      "offset": {
                        "type": "integer"
                      },
                      "page": {
                        "type": "integer"
                      },
                      "perPage": {
                        "type": "integer"
                      },
                      "continue": {
                        "type": "boolean"
                      }
                    },
                    "required": ["perPage"]
                  }
                },
                "required": ["id"]
              }
            }
          },
          "required": ["allowed", "id"]
        },
        "apiRef": {
          "type": "object",
          "properties": {
            "name": {
              "type": "string"
            },
            "namespace": {
              "type": "string"
            }
          },
          "required": ["name", "namespace"],
          "additionalProperties": false
        },
        "widgetDataTemplate": {
          "type": "array",
          "items": {
            "type": "object",
            "properties": {
              "forPath": {
                "type": "string"
              },
              "expression": {
                "type": "string"
              }
            },
            "additionalProperties": false
          }
        }
      },
      "required": ["widgetData"],
      "additionalProperties": false
    }
  },
  "required": ["kind", "spec", "version"]
}
```

### Rules
- `"x-krateo-widget": true` must be present at the top level — the CRD generator uses it.
- Use `"description"` on every property — it becomes the API reference column.
- For colour tokens use: `"enum": ["blue", "darkBlue", "orange", "gray", "red", "green", "violet"]`
- For icon names use: `"type": "string", "description": "Font Awesome icon name, e.g. fa-check"`
- Required fields must be in `"required"` — do not rely on `"default"` alone.
- Nested objects need their own `"type": "object"` with `"properties"`.
- Do not use `oneOf` or `anyOf`
- Copy and paste without editing the `resourcesRefs`, `apiRef` content

---

## Step 2 — Generate the TypeScript type

```bash
npm run generate-types
```

This writes `src/widgets/<name>/<name>.ts`. **Never edit that file manually.**
Re-run this command after every schema change.

---

## Step 3 — Generate the CRD

```bash
npm run generate-crds
```

Output goes to `scripts/krateoctl-output/<name>.crd.yaml`.
Do not apply it to the cluster yet — wait until step 4 is done.

---

## Step 4 — YAML example file

**Location:** `src/examples/widgets/<WidgetName>/<WidgetName>.example.yaml`

The YAML example is **applied to the local k8s cluster** during development.
It also doubles as the reference test fixture for human reviewers.

### Structure of every CR in the file

```yaml
# <Short description of what this example tests>
# Target: <what behaviour it exercises>
# Expected behavior: <what should happen>
kind: StatusBadge
apiVersion: widgets.templates.krateo.io/v1beta1
metadata:
  name: example-status-badge-basic   # kebab-case, unique within the file
  namespace: krateo-system
spec:
  widgetData:
    status: healthy
    label: "API Gateway"
    showIcon: true
  resourcesRefs:
    items: []    # empty for leaf widgets with no child refs
```

### Required conventions

`spec` always has exactly two keys:
- `widgetData` — the widget's own props (maps 1-to-1 to the schema)
- `resourcesRefs` — child/referenced resources; `items: []` if none

`resourcesRefs.items[]` shape when you do have references:
```yaml
resourcesRefs:
  items:
    - id: my-action-ref                          # matches resourceRefId used in widgetData
      apiVersion: widgets.templates.krateo.io/v1beta1
      name: the-target-resource-name             # k8s resource name
      namespace: krateo-system
      resource: pages                            # k8s resource type (plural lowercase)
      verb: GET
```

### Examples menu

**Location:** `src/examples/widgets/<WidgetName>/<WidgetName>.menu.yaml`

Each example CR should be available to be displayed inside a `Page` widget.

To do that, for each widget a `.menu.yaml` file is created composed of these elements:
- a `NavMenuItem` widget which references a `Page` widget: the goal is displaying an item in the sidebar for each widget with its own name and icon
- a `Page` widget which references as its `items` children one `Panel` widget for each example CR: the goal is displaying all generated examples with a title. If the widget has the `actions` prop, the `Page` contains a `TabList` widget with two tabs: one contains the examples who do not test actions, the other contains the examples that test the actions.
- a `Panel` widget for each example CR contained in the `.example.yaml` file

Example:

```yaml
kind: NavMenuItem
apiVersion: widgets.templates.krateo.io/v1beta1
metadata:
  name: example-barchart-navmenuitem
  namespace: krateo-system
spec:
  widgetData:
    allowedResources:
      - pages
    resourceRefId: example-barchart-page
    label: BarChart
    icon: fa-chart-bar
    path: /barchart
  resourcesRefs:
    items:
      - id: example-barchart-page
        apiVersion: widgets.templates.krateo.io/v1beta1
        name: example-barchart-page
        namespace: krateo-system
        resource: pages
        verb: GET
---
kind: Page
apiVersion: widgets.templates.krateo.io/v1beta1
metadata:
  name: example-barchart-page
  namespace: krateo-system
spec:
  widgetData:
    allowedResources:
      - panels
    items:
      - resourceRefId: example-barchart-empty-array-panel
  resourcesRefs:
    items:
      - id: example-barchart-empty-array-panel
        apiVersion: widgets.templates.krateo.io/v1beta1
        name: example-barchart-empty-array-panel
        namespace: krateo-system
        resource: panels
        verb: GET 
---
kind: Panel
apiVersion: widgets.templates.krateo.io/v1beta1
metadata:
  name: example-barchart-empty-array-panel
  namespace: krateo-system
spec:
  widgetData:
    actions: {}
    title: 'Empty dataset'
    items:
      - resourceRefId: example-barchart-empty-array
  resourcesRefs:
    items:
      - id: example-barchart-empty-array
        apiVersion: widgets.templates.krateo.io/v1beta1
        name: example-barchart-empty-array
        namespace: krateo-system
        resource: barcharts
        verb: GET  
```

### How many examples to write

Write at least:
- One **minimal** example (only required props)
- One **full** example (all optional props set)
- One **edge-case** example per non-trivial behaviour (e.g. empty state, error state)

### JQ expressions in YAML

Widget fields support JQ expressions for dynamic values, wrapped in `${ }`:

```yaml
widgetData:
  label: '${ .widget.status.widgetData.name + " — " + .widget.status.widgetData.status }'
```

The expression receives the full CR `.status` as context. Only use this in YAML examples
that specifically test dynamic binding — keep the majority of examples with static values.

### Applying the examples locally

```bash
npm run apply-examples   # applies only the examples, not all CRDs
# or
npm run apply-all        # applies everything (CRDs + examples)
```

**Ask the user before running these commands** — they write to a live cluster.

---

## Step 5 — React component

**Locations:**
- `src/widgets/<WidgetName>/<WidgetName>.tsx`
- `src/widgets/<WidgetName>/<WidgetName>.module.css`

### Component example

```tsx
import type { IconProp } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Button as AntdButton } from 'antd'
import useApp from 'antd/es/app/useApp'

import { useHandleAction } from '../../hooks/useHandleActions'
import type { WidgetProps } from '../../types/Widget'

import type { Button as WidgetType } from './Button.type'

export type ButtonWidgetData = WidgetType['spec']['widgetData']

const Button = ({ resourcesRefs, uid, widget, widgetData }: WidgetProps<ButtonWidgetData>) => {
  const { actions, backgroundColor, clickActionId, icon, label, shape, size, type } = widgetData

  const { notification } = useApp()
  const { handleAction, isActionLoading } = useHandleAction()

  const action = Object.values(actions)
    .flat()
    .find(({ id }) => id === clickActionId)

  const onClick = async () => {
    if (!action) {
      notification.error({
        description: `The widget definition does not include an action (ID: ${clickActionId})`,
        message: 'Error while executing the action',
        placement: 'bottomLeft',
      })

      return
    }

    await handleAction(action, resourcesRefs, undefined, widget)
  }

  const handleClick = (event: React.MouseEvent<HTMLElement, MouseEvent>) => {
    event.stopPropagation()

    onClick().catch((error) => {
      console.error('Error in button click handler:', error)
    })
  }

  return (
    <div>
      <AntdButton
        icon={icon ? <FontAwesomeIcon icon={icon as IconProp} /> : undefined}
        key={uid}
        loading={isActionLoading}
        onClick={(event) => handleClick(event)}
        shape={shape || 'default'}
        size={size || 'middle'}
        style={{ backgroundColor: backgroundColor || undefined }}
        type={type || 'primary'}
      >
        {label}
      </AntdButton>
    </div>
  )
}

export default Button
```

### Component rules

- Props type comes **directly** from the generated type — no manual prop interfaces.
- Props come from the `widgetData` section of the type (generated from the JSON schema)
- Ant Design is used as basis for the design system: most widgets are Ant Design components wrappers
- CSS lives in the `.module.css` file — no `style={{}}` inline props.
- Icons: FontAwesomeIcon — if possible not Ant Design icons.
- Data fetching: if the component needs server data beyond its own props, use a
  TanStack Query hook from `src/hooks/` — never raw `useEffect + fetch`.
- No hardcoded API URLs — read from the config hook if needed.

### CSS Module skeleton

```css
.badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 13px;
}

.healthy  { background-color: var(--color-success-bg); color: var(--color-success); }
.degraded { background-color: var(--color-warning-bg); color: var(--color-warning); }
.unknown  { background-color: var(--color-default-bg); color: var(--color-default); }
```

## Step 8 — API reference entry

Use the `update-readme-widgets` command to update the `docs/widgets-api-reference.md` 

---

## Step 9 — Verify

```bash
npm run lint      # must pass with no errors
```

Fix any lint errors before opening a PR. Do not suppress ESLint rules unless
there is a documented reason in the same commit.

---

## Checklist for action-capable widgets

If your new widget has an `actions` object (like Button, Form, Panel, Table),
it must support all four action types: `rest`, `navigate`, `openDrawer`, `openModal`.

Copy the action definitions from an existing widget schema like
`src/widgets/Button/Button.schema.json` rather than writing them from scratch.

---

## Checklist for container widgets

If your new widget renders children via `items[].resourceRefId`, it must include
`allowedResources` in the schema (see `Row.schema.json` for the pattern).
The component receives resolved child widget components, not raw YAML.
Check how `Panel` or `Row` map `items` to rendered children.