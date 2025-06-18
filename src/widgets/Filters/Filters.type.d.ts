export interface Filters {
  version: string
  kind: string
  spec: {
    widgetData: {
      /**
       * the prefix to share filters values to other widgets
       */
      prefix: string
      fields: {
        /**
         * the label of the field
         */
        label: string
        /**
         * the name of the field, it must to be identical to widget prop name to filter
         */
        name: string
        /**
         * text to show as tooltip
         */
        description?: string
        /**
         * it's the filter type, to render input, select, radio buttons, date picker or daterange picker
         */
        type: 'string' | 'boolean' | 'number' | 'date' | 'daterange'
        /**
         * they're the options for select or radio, the type must be 'string'
         */
        options?: string[]
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
