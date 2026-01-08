# Action Button Guide

Before starting this guide, make sure you have completed the [Simple Page Guide](../simple-page/simple-page.md).

In the previous guide, you created:

- a `Button` widget
- a `Page` widget acting as a container for the `Button` widget
- a `NavMenuItem` widget to navigate to the `Page` widget

In this guide, you will extend that setup by adding **actions** to the `Button` widget, enabling user interactions.

---

## Adding an `openDrawer` Action to the `Button`

We will update the existing `Button` widget so that it triggers an action when clicked. A `Button` widget can trigger different types of actions. For a complete overview of available actions, refer to the [Actions documentation](../../docs.md).

In this guide, we will use the `openDrawer` action, which opens a side panel (drawer) and renders another widget inside it. 

To apply the updated `Button` widget definition (this will override the previously created resource), run:

```sh
kubectl apply -f docs/guides/action-button/guide-action-button.yaml
```

After refreshing the UI, click the button. You should see a drawer opening and displaying the content of a `Paragraph` widget, which is referenced in the `resourcesRefs` section of the `Button` widget.

![Drawer with paragraph](./images/drawer-paragraph.gif)

---

## Adding a `Form` Widget to the Drawer

Next, we will introduce a new widget: the `Form` widget. A `Form` widget can be used to collect user input and trigger actions such as creating new resources in the cluster.

Apply the following widget definition:

```sh
kubectl apply -f docs/guides/action-button/guide-action-button-form.yaml
```

Now, clicking the `Button` widget will open a drawer containing the `Form` widget. Fill in the form fields and click **Submit**. As a result, a new Pod should be created in the Kubernetes cluster.

![Drawer with form](./images/drawer-form.gif)

---

## How It Works

The `Form` widget defines its fields using a static JSON schema and is associated with a `rest` action. This action sends an HTTP request to the Kubernetes API to create a new Pod.

The `payloadToOverride` property is used to merge the values submitted through the form into the payload of the `rest` action, allowing user input to dynamically influence the request sent to the API.

This pattern demonstrates how widgets, actions, and APIs can be combined to build interactive and data-driven user experiences in the Krateo Composable Portal.