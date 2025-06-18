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
      apiVersion: 'widgets.templates.krateo.io/v1beta1'
      name: string
      namespace: string
      resource: 'routes'
      verb: 'GET'
    }[]
  }
}
