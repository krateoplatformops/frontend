export interface DataGrid {
  version: string
  kind: string
  spec: {
    widgetData: {
      prefix?: string
      componentId?: string
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
  }
}
