export interface Table {
  version: string
  /**
   * Table displays structured data with customizable columns and pagination
   */
  kind: string
  spec: {
    widgetData: {
      /**
       * number of rows displayed per page
       */
      pageSize?: number
      /**
       * array of objects representing the table's row data
       */
      data: {
        [k: string]: unknown
      }[]
      /**
       * configuration of the table's columns
       */
      columns: {
        /**
         * key used to extract the value from row data
         */
        valueKey?: string
        /**
         * column header label
         */
        title?: string
      }[]
    }
    resourcesRefs?: {
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
