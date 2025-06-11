export interface Table {
  version: string
  kind: string
  spec: {
    widgetData: {
      prefix: string
      componentId: string
      pageSize?: number
      data: {
        [k: string]: unknown
      }[]
      columns: {
        valueKey?: string
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
