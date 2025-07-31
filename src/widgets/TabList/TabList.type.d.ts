export interface TabList {
  /**
   * widget version
   */
  version: string
  /**
   * TabList display a set of tab items for navigation or content grouping
   */
  kind: string
  spec: {
    /**
     * the data that will be passed to the widget on the frontend
     */
    widgetData: {
      /**
       * the items of the tab list
       */
      items: {
        /**
         * text displayed on the tab
         */
        label?: string
        /**
         * the identifier of the k8s custom resource represented by the tab content
         */
        resourceRefId: string
      }[]
    }
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
