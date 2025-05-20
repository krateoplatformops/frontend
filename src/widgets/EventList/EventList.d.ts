export interface EventList {
  /**
   * widget version
   */
  version: string
  /**
   * name of the k8s Custom Resource
   */
  kind: string
  spec: {
    /**
     * the data that will be passed to the widget on the frontend
     */
    widgetData: {
      events: {
        icon?: string
        reason: string
        message: string
        type: 'Normal' | 'Warning'
        count?: number
        action?: string
        reportingComponent?: string
        reportingInstance?: string
        firstTimestamp?: string
        lastTimestamp?: string
        eventTime?: string
        metadata: {
          name: string
          namespace: string
          uid: string
          creationTimestamp: string
        }
        involvedObject: {
          apiVersion?: string
          kind: string
          name: string
          namespace: string
          uid: string
        }
        source: {
          component?: string
          host?: string
        }
      }[]
      sseEndpoint?: string
      sseTopic?: string
    }
    resourcesRefs?: {
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
