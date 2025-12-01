# Frontend

## Running Locally

Follow the steps below to run the frontend locally.

---

### **Step 1: Create a Kind Cluster with Krateo and Snowplow**

Follow [this guide](https://docs.krateo.io/how-to-guides/install-krateo/installing-krateo-kind) to create a Kind cluster with the latest version of Krateo installed.

You’ll also need the latest version of [Snowplow](https://github.com/krateoplatformops/snowplow/).  
To include it during installation, add this flag to the `helm upgrade` command shown in the Krateo guide:

```bash
  --set krateoplatformops.snowplow.chart.version={{LATEST_SNOWPLOW_VERSION}} \
```

The final command should look like this:
```bash
helm upgrade installer-crd installer-crd \
  --repo https://charts.krateo.io \
  --namespace krateo-system \
  --create-namespace \
  --install \
  --version 2.6.0 \
  --set krateoplatformops.snowplow.chart.version=0.14.1 \
  --wait 
```

### **Step 2: Generate CRDs from JSON Schemas**

Install [`krateoctl`](https://github.com/krateoplatformops/krateoctl) if you haven’t already.

Then run the script that uses `krateoctl` to generate CRDs for all `.schema.json` files in the repository:

```bash
npm run gen-crds
```

All generated `.crd.yaml` files will be saved in `scripts/krateoctl-output/`.

---

### **Step 3: Apply Custom Resources**

Apply all the `.yaml` custom resources defined in the repository with:

```bash
npm run apply-all
```

### **Step 4: Configure `config.json`**

Ensure your project includes the configuration file:

```
./public/config/config.json
```

The file should have this content:

```json
{
  "api": {
    "AUTHN_API_BASE_URL": "http://localhost:30082",
    "SNOWPLOW_API_BASE_URL": "http://localhost:30081",
    "EVENTS_API_BASE_URL": "http://localhost:30083",
    "ROUTES_LOADER": "/call?resource=routesloaders&apiVersion=widgets.templates.krateo.io/v1beta1&name=routes-loader&namespace=krateo-system",
    "EVENTS_PUSH_API_BASE_URL": "http://localhost:30083",
    "INIT": "/call?resource=navmenus&apiVersion=widgets.templates.krateo.io/v1beta1&name=sidebar-nav-menu&namespace=krateo-system"
  },
  "params": {
    "FRONTEND_NAMESPACE": "krateo-system",
    "DELAY_SAVE_NOTIFICATION": "10000"
  }
}
```

### **Step 5: Start the Application**

Run the following command to start the app locally:

```bash
npm run dev
```

The frontend will be available at [http://localhost:4000/login](http://localhost:4000/login).

Login with:

- **Username:** `admin`  
- **Password:** retrieve it with:
  ```bash
  kubectl get secret admin-password -n krateo-system -o jsonpath="{.data.password}" | base64 -d
  ```

---

## Running on an Existing Cluster

You can also run the frontend locally while connected to an existing cluster.

You’ll need:

- a **username**
- a **password**
- the cluster’s `config.json` file

Copy the cluster’s config into:

```
./public/config/config.remote.json
```

Then run:

```bash
VITE_CONFIG_NAME=remote npm run dev
```

Finally, authenticate using the provided username and password.

---

## Widgets

Api reference for widgets is found at [docs/widgets-api-reference.md](docs/widgets-api-reference.md)

## Documentation and guides

Documentation and guides can be found in [docs/](docs/)
