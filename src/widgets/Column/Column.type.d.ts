export interface Column {
  /**
   * widget version
   */
  version: string
  /**
   * Column is a layout component that arranges its children in a vertical stack, aligning them one above the other with spacing between them
   */
  kind: string
  spec: {
    widgetData: {
      /**
       * the items of the column
       */
      items: {
        /**
         * the identifier of the k8s Custom Resource that should be represented, usually a widget
         */
        resourceRefId: string
      }[]
      /**
       * the number of cells that the column will occupy, from 0 (not displayed) to 24 (occupies all space)
       */
      size?: number
    }
    resourcesRefs: {
      items: {
        id: string
        apiVersion: string
        name: string
        namespace: string
        resource: string
        verb: 'DELETE' | 'GET' | 'PATCH' | 'POST' | 'PUT'
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
  }
}
