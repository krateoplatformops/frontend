export interface NavMenuItem {
  version: string
  kind: string
  spec: {
    widgetData: {
      label: string
      icon: string
      path: string
      resourceRefId: string
      /**
       * a weight to be used to sort the items in the menu
       */
      order?: number
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
