export interface Page {
  version: string
  /**
   * Page is a wrapper component, placed at the top of the component tree, that wraps and renders all nested components.
   */
  kind: string
  spec: {
    widgetData: {
      /**
       * title of the page shown in the browser tab
       */
      title?: string
      /**
       * list of resources to be rendered within the route
       */
      items: {
        /**
         * the identifier of the k8s custom resource that should be rendered, usually a widget
         */
        resourceRefId: string
      }[]
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
      apiVersion: string
      name: string
      namespace: string
      resource: string
      verb: 'GET' | 'POST' | 'DELETE'
    }[]
  }
}
