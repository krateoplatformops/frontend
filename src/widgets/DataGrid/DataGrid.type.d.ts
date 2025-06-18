export interface DataGrid {
  version: string
  kind: string
  spec: {
    widgetData: {
      /**
       * it's the filters prefix to get right values
       */
      prefix?: string
      /**
       * to show children as list or grid
       */
      asGrid?: boolean
      items: {
        resourceRefId: string
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
    resourcesRefs?: {
      id: string
      apiVersion: string
      name: string
      namespace: string
      resource: string
      verb: 'GET' | 'POST' | 'DELETE'
    }[]
  }
}
