export interface NavMenuItem {
  version: string
  /**
   * NavMenuItem represents a single item in the navigation menu and links to a specific resource and route in the application
   */
  kind: string
  spec: {
    widgetData: {
      /**
       * text displayed as the menu item's label
       */
      label: string
      /**
       * name of the icon to display alongside the label (font awesome icon name eg: `fa-inbox`)
       */
      icon: string
      /**
       * route path to navigate to when the menu item is clicked
       */
      path: string
      /**
       * the identifier of the k8s custom resource that should be represented, usually a widget
       */
      resourceRefId: string
      /**
       * a weight to be used to sort the items in the menu
       */
      order?: number
    }
    apiRef?: {
      name: string
      namespace: string
    }
    widgetDataTemplate?: {
      forPath?: string
      expression?: string
    }[]
    resourcesRefs?: {
      id: string
      apiVersion: 'widgets.templates.krateo.io/v1beta1'
      name: string
      namespace: string
      resource: 'pages'
      verb: 'GET'
    }[]
  }
}
