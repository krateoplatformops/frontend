export interface YamlViewer {
  version: string
  kind: string
  spec: {
    widgetData: {
      json: string
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
