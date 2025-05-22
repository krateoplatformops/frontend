export interface Column {
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
       * the items of the column
       */
      items: {
        resourceRefId: string
      }[]
      /**
       * the number of cells that the column will occupy, from 0 (not displayed) to 24 (occupies all space)
       */
      size?: number
    }
    resourcesRefs: {
      id: string
      apiVersion: string
      name: string
      namespace: string
      resource: string
      verb: 'GET' | 'POST' | 'DELETE'
    }[]
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
