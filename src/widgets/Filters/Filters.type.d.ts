export interface Filters {
  version: string
  kind: string
  spec: {
    widgetData: {
      prefix: string
      fields: {
        label: string
        name: string
        description?: string
        type: 'string' | 'boolean' | 'number'
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
