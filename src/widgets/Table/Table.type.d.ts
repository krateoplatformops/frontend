export interface Table {
  version: string
  /**
   * Table displays structured data with customizable columns and pagination
   */
  kind: string
  spec: {
    widgetData: {
      /**
       * it's the filters prefix to get right values
       */
      prefix?: string
      /**
       * number of rows displayed per page
       */
      pageSize?: number
      /**
       * Array of table rows
       */
      data: {
        /**
         * the key of the column this cell belongs to
         */
        valueKey: string
        /**
         * type of cell value
         */
        kind: 'jsonSchemaType' | 'icon' | 'widget'
        /**
         * used if kind = widget
         */
        resourceRefId?: string
        /**
         * used if kind = jsonSchemaType
         */
        type?: 'string' | 'number' | 'integer' | 'decimal' | 'boolean' | 'array' | 'null'
        /**
         * value if type = string
         */
        stringValue?: string
        /**
         * value if type = number or integer
         */
        numberValue?: number
        /**
         * value if type = number or decimal
         */
        decimalValue?: string
        /**
         * value if type = boolean
         */
        booleanValue?: boolean
        /**
         * value if type = array
         */
        arrayValue?: string[]
      }[][]
      /**
       * configuration of the table's columns
       */
      columns: {
        /**
         * the color of the value (or the icon) to be represented
         */
        color?: 'blue' | 'darkBlue' | 'orange' | 'gray' | 'red' | 'green'
        /**
         * column header label
         */
        title: string
        /**
         * key used to extract the value from row data
         */
        valueKey: string
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
