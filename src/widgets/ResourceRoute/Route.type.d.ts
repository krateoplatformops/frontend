export interface Route {
  version: string
  /**
   * ResourceRoute use to map a path to show in the frontend URL to a resource
   */
  kind: string
  spec: {
    widgetData: {
      /**
       * the url path to that loads the resource
       */
      path: string
      /**
       * the identifier of the k8s custom resource that should be rendered, usually a widget
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
      apiVersion: string
      name: string
      namespace: string
      resource: string
      verb: 'GET' | 'POST' | 'DELETE'
    }[]
  }
}
