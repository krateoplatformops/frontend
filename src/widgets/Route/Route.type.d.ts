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
      _slice_?: {
        offset?: number
        page: number
        perPage: number
        continue?: boolean
        [k: string]: unknown
      }
      items: {
        id: string
        name?: string
        namespace?: string
        resource?: string
        apiVersion?: string
        verb?: 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'GET'
        payload?: {
          [k: string]: unknown
        }
        [k: string]: unknown
      }[]
      [k: string]: unknown
    }
  }
}
