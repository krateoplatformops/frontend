export interface NavMenu {
  version: string
  /**
   * NavMenu is a container for NavMenuItem widgets, which are used to setup navigation inside the application
   */
  kind: string
  spec: {
    widgetData: {
      /**
       * list of navigation entries each pointing to a k8s custom resource
       */
      items: {
        /**
         * the identifier of the k8s custom resource that should be represented, usually a NavMenuItem
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
