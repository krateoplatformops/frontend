export interface Panel {
  version: string
  kind: string
  spec: {
    widgetData: {
      footer?: {
        resourceRefId?: string
      }[]
      items: {
        resourceRefId?: string
      }[]
      title: string
      tooltip?: string
    }
    resourcesRefs: {
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
