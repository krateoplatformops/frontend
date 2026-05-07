export interface Notifications {
  /**
   * widget version
   */
  version: string
  /**
   * Notifications renders messages coming from a Kubernetes cluster
   */
  kind: string
  spec: {
    widgetData: {
      /**
       * list of query parameters to add to the notifications call
       */
      queryParams?: {
        /**
         * the name of the query parameter
         */
        name: string
        /**
         * the value of the query parameter
         */
        value: string
      }[]
    }
    resourcesRefs?: {
      items?: {
        allowed?: boolean
        apiVersion?: string
        id: string
        name?: string
        namespace?: string
        payload?: {
          [k: string]: unknown
        }
        resource?: string
        verb?: 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'GET'
        slice?: {
          offset?: number
          page?: number
          perPage: number
          continue?: boolean
          [k: string]: unknown
        }
        [k: string]: unknown
      }[]
      [k: string]: unknown
    }
    apiRef?: {
      name: string
      namespace: string
    }
    widgetDataTemplate?: {
      forPath?: string
      expression?: string
    }[]
  }
}
