# Frontend

## How to Run Locally

To get started running the frontend locally, follow the steps below.

---

### Step 1: Run the following commands

```bash
curl -L https://github.com/krateoplatformops/krateo-v2-docs/releases/latest/download/kind.sh | sh
kubectl wait krateoplatformops krateo --for condition=Ready=True --namespace krateo-system --timeout=300s
```

### Step 2: Create a .yml file containing the following data

```
---
apiVersion: apiextensions.k8s.io/v1
kind: CustomResourceDefinition
metadata:
  annotations:
    controller-gen.kubebuilder.io/version: v0.16.1
  name: buttons.widgets.templates.krateo.io
spec:
  group: widgets.templates.krateo.io
  names:
    kind: Button
    listKind: ButtonList
    plural: buttons
    singular: button
  scope: Namespaced
  versions:
    - name: v1beta1
      served: true
      storage: true
      subresources:
        status: {}
      schema:
        openAPIV3Schema:
          type: object
          properties:
            apiVersion:
              type: string
              description: >
                APIVersion defines the versioned schema of this representation of an object.
                Servers should convert recognized schemas to the latest internal value,
                and may reject unrecognized values.
            kind:
              type: string
              description: >
                Kind is a string value representing the REST resource this object represents.
                Servers may infer this from the endpoint the client submits requests to.
            spec:
              type: object
              required:
                - widgetData
              properties:
                widgetData:
                  type: object
                  description: The data that will be passed to the widget on the frontend
                  properties:
                    icon:
                      type: string
                      description: >
                        The icon of the button (font awesome icon name, e.g., 'fa-inbox')
                    label:
                      type: string
                      description: The label of the button
                    type:
                      type: string
                      description: The visual style of the button
                      enum:
                        - default
                        - text
                        - link
                        - primary
                        - dashed
            status:
              type: object
              x-kubernetes-preserve-unknown-fields: true
      additionalPrinterColumns:
        - name: AGE
          type: date
          jsonPath: .metadata.creationTimestamp
        - name: READY
          type: string
          jsonPath: .status.conditions[?(@.type=='Ready')].status
---
apiVersion: widgets.templates.krateo.io/v1beta1
kind: Button
metadata:
  name: my-button
  namespace: krateo-system
spec:
  widgetData:
    label: Button
    icon: fa-sun
    type: primary
```

### Step 3: Apply the .yml file running the following command

```bash
kubectl apply -f yourpath/yourfile.yml
```

### Step 4: Fetch the resource inside your application using the following URL

```
http://localhost:30080/call?resource=buttons&apiVersion=widgets.templates.krateo.io/v1beta1&name
```


## Upadate snowplow version

`helm upgrade snowplow krateo/snowplow -n krateo-system --set image.tag=x.x.x`

## Upadate smithery version

`helm upgrade smithery krateo/smithery -n krateo-system --set image.tag=x.x.x`
