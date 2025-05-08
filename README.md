# Frontend

## How to Run Locally

To get started running the frontend locally, follow the steps below.

---

### Step 1: Run the following commands

```bash
curl -L https://github.com/krateoplatformops/krateo-v2-docs/releases/latest/download/kind.sh | sh
kubectl wait krateoplatformops krateo --for condition=Ready=True --namespace krateo-system --timeout=300s
```

## Update snowplow version

`helm upgrade snowplow krateo/snowplow -n krateo-system --set image.tag=x.x.x`

## Update smithery version

`helm upgrade smithery krateo/smithery -n krateo-system --set image.tag=x.x.x`

## Create a CRD inside smithery with a command similar to this one

```
curl -v --request POST \
  -H 'Content-Type: application/json' \
  -d @src/widgets/NavMenu/NavMenu.schema.json \
  "http://52.158.28.123:8088/forge?apply=true"
```

## Create a custom resource wherever you want then execute the following command to apply it

```bash
kubectl apply -f yourpath/yourfile.yml
```

## Step 4: Fetch the resource inside your application using the following URL

```
http://localhost:30080/call?resource=buttons&apiVersion=widgets.templates.krateo.io/v1beta1&name
```