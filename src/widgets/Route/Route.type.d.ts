export interface Route {
  version: string
  /**
   * Route is a configuration to map a path to show in the frontend URL to a resource, it doesn't render anything by itself
   */
  kind: string
  spec: {
    widgetData: {
      /**
       * the url path to that loads the resource
       */
      path: string
      /**
       * the id matching the resource in the resourcesRefs array, must of kind page
       */
      resourceRefId: string
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
