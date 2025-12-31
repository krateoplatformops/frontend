# How to Configure a layout

The main pillar of the Krateo frontend is **composability** (this is why it is called *Krateo Composable Portal*). The goal is to allow platform engineers to combine different Kubernetes resources, called **widgets**, and render them as UI elements, each with its own behavior and configuration.

Widgets can be grouped into three macro categories:
- **Functional widgets**: widgets that provide user-facing functionality or interaction and represent a meaningful UI feature, such as `Button`, `FlowChart`, `Table`, etc.
- **Layout widgets**: widgets that arrange, structure, or position other widgets, such as `Column`, `Row`, `DataGrid`, or `Page`.
- **Utility widgets**: widgets that enable application-level or cross-cutting features, such as `NavMenuItem`, `Filters`, or `RoutesLoader`.

This guide focuses on **layout widgets**, explaining how to use and combine them to build a page that contains and organizes other widgets.

---

## Layout Widgets

A non-exhaustive list of available layout widgets includes:

- **`Column`**: arranges its children in a vertical stack, aligning them one above the other with configurable spacing.
- **`Row`**: arranges its children horizontally with spacing between them.
- **`DataGrid`**: renders its children as a responsive list or grid, adapting to screen size and configuration.
- **`Page`**: a top-level wrapper component that defines a page and renders all nested widgets.
- **`TabList`**: displays a set of tabs used for navigation or content grouping.

> **Note**
> Layout widgets are not strictly required to display functional widgets. Functional widgets can be added directly as children of a `Page` widget and will be rendered vertically with default spacing. Layout widgets become essential when building more complex or responsive layouts.

---

## Basic Steps

To configure a layout, follow these steps:
1. Create a **`Page`** widget that will act as the container for all other widgets.
2. Create a **`NavMenuItem`** widget, which represents an entry in the navigation menu and links to a specific route and `Page`.
3. Create one or more **layout widgets** (`Column`, `Row`, `DataGrid`, etc.) and link them as children of the `Page` widget.
4. Create **functional widgets** and assign them as children of the chosen layout widgets.

---

## Example

> **Note**
> To follow this guide, you need to run the Krateo frontend locally. This requires:
> - a running Kubernetes cluster (for example, a local `kind` cluster),
> - the Krateo frontend codebase,
> - the ability to create and edit Kubernetes resources as YAML files.
>
> Refer to the [installation guide](../../../README.md#running-locally) in the repository README for setup instructions.

### Creating a Page

The first step is to create a `Page` widget. This widget acts as the root container for all layout and functional widgets belonging to a specific page.

At this stage, the `Page` widget does not need to define any children. Layout and functional widgets will be added and linked to it in the following steps.