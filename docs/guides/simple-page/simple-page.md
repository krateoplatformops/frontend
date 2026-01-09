# Simple Page Guide

This guide walks you through the creation of a very simple page in the Krateo Composable Portal. By the end of the guide, you will have:

- a `Button` widget
- a `Page` widget that acts as a container for the `Button` widget
- a navigation entry in the sidebar that links to the `Page` widget

> [!NOTE]
> To follow this guide, you need to run the Krateo frontend locally. This requires:
> - a running Kubernetes cluster (for example, a local `kind` cluster),
> - the Krateo frontend codebase,
> - the ability to create and edit Kubernetes resources as YAML files.
>
> Refer to the [installation guide](../../../README.md#running-locally) in the repository README for setup instructions.

## Creating a `Button` Widget

To create a `Button` widget, you need to define it as a Kubernetes resource using a YAML file that follows the widget schema described in the [Widgets API Reference](../../widgets-api-reference.md). Applying the resource will both create the widget and validate its configuration.

As a starting point, create a pre-defined `Button` widget by running:

```sh
kubectl apply -f docs/guides/simple-page/guide-simple-button.yaml
```

To verify that the widget has been created successfully, run:

```sh
kubectl get button -n simple-guide
```

## Showing the `Button` Inside a `Page` Widget

At this point, the `Button` widget exists in the cluster, but it is not yet visible in the UI. Widgets become visible only when they are rendered by another visible widget.

To display the button, we will create a `Page` widget and reference the `Button` widget from it:

```sh
kubectl apply -f docs/guides/simple-page/guide-simple-page.yaml
```

By inspecting the [`Page` widget definition](./guide-simple-page.yaml), you can see that the `Button` widget is referenced by name inside `spec.resourcesRefs` and assigned an identifier (`simple-button-id`).

Declaring resources in `spec.resourcesRefs` is how Krateo knows which widgets to load. References can be defined statically, as in this example, or generated dynamically using `resourcesRefsTemplate` (see the related section in the [documentation](../../docs.md) for more details).

This referencing mechanism applies to all widgets and is the foundation of widget composition in Krateo.


## Making the Page Reachable

Even though the `Page` widget has been created, it is not yet accessible from the UI. Pages must be linked from the navigation menu to be reachable.

### Creating a Sidebar Link

To expose the page, create a `NavMenuItem` widget:

```sh
kubectl apply -f docs/guides/simple-page/guide-simple-navmenuitem.yaml
```

The frontend logic will automatically create a sidebar entry to the newly created `Page` widget, which will be visible after refreshing the UI.

![Sidebar item](./images/sidebar-item.png)


### Visiting the Page

Clicking the new sidebar item navigates to the path defined in the `NavMenuItem` widget, which in turn references the `Page` widget. You should now see the `Button` rendered on the page. For mocking purposes, clicking on the `Button` widget should redirect you to the current page.

![Simple guide page](./images/simple-guide-page.png)


## Recap

In this guide, we declaratively created the following widget hierarchy:

```
NavMenuItem → Page → Button
```

Widgets reference other widgets using `spec.resourcesRefs` and render them by referring to the corresponding IDs inside `spec.widgetData`.

This composition model allows complex UIs to be built from small, reusable building blocks.


## Testing the Declarative Nature of Widgets

To see the declarative model in action, try editing the `spec.widgetData.label` field in either `guide-simple-button.yaml` or `guide-simple-navmenuitem.yaml`, then re-apply the resources:

```sh
kubectl apply -f docs/guides/simple-page/guide-simple-navmenuitem.yaml
kubectl apply -f docs/guides/simple-page/guide-simple-button.yaml
```

After refreshing the UI, the changes will be immediately reflected.

![Updated simple guide page](./images/simple-guide-page-updated.png)


## Next Steps

A `Button` widget that does nothing is not very useful. In the next guide, you will learn how to configure a `Button` widget to trigger an action when clicked.

**Next:** [Action Button](../action-button/action-button.md)