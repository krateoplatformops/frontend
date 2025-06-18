export interface RoutesLoader {
  version: string
  /**
   * RoutesLoader loads the Route widgets it doesn't render anything by itself
   */
  kind: string
  spec: {
    widgetData: {}
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
