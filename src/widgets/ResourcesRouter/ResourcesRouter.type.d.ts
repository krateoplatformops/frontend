export interface ResourcesRouter {
  version: string
  /**
   * ResourcesRouter is a wrapper component used to load all the ResourceRoute widgets
   */
  kind: string
  spec: {
    widgetData: {
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
