export interface FlowChart {
  version: string
  kind: string
  spec: {
    widgetData: {
      data?: string
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
