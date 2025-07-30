export interface RoutesLoader {
  version: string
  /**
   * RoutesLoader loads the Route widgets it doesn't render anything by itself
   */
  kind: string
  spec: {
    widgetData: object
    apiRef?: {
      name: string
      namespace: string
    }
    widgetDataTemplate?: {
      forPath?: string
      expression?: string
    }[]
    resourcesRefs?: {
      items?: {
        id: string
        apiVersion: string
        name: string
        namespace: string
        resource: string
        verb: 'DELETE' | 'GET' | 'PATCH' | 'POST' | 'PUT'
      }[]
    }
  }
}
