export interface NavMenu {
  version: string
  /**
   * NavMenu is a container for NavMenuItem widgets, which are used to setup navigation inside the application
   */
  kind: string
  spec: {
    widgetData: {
      /**
       * the list of resources that are allowed to be children of this widget
       */
      allowedResources: 'navmenuitems'[]
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
      _slice_?: {
        offset?: number
        page: number
        perPage: number
        continue?: boolean
        [k: string]: unknown
      }
      items: {
        allowed: boolean
        apiVersion?: string
        id: string
        name?: string
        namespace?: string
        payload?: {
          [k: string]: unknown
        }
        resource?: string
        verb?: 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'GET'
        [k: string]: unknown
      }[]
      [k: string]: unknown
    }
  }
}
