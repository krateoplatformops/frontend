export interface Paragraph {
  version: string
  kind: string
  spec: {
    widgetData: {
      text: string
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
