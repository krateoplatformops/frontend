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
