export interface Row {
  /**
   * widget version
   */
  version: string
  /**
   * name of the k8s Custom Resource
   */
  kind: string
  spec: {
    /**
     * the data that will be passed to the widget on the frontend
     */
    widgetData: {
      /**
       * the items of the row
       */
      items: {
        resourceRefId: string
        /**
         * the number of cells that the item will occupy, from 0 (not displayed) to 24 (occupies all space)
         */
        size?: number
      }[]
    }
    resourcesRefs: {
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
