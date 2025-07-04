export interface EventList {
  /**
   * widget version
   */
  version: string
  /**
   * EventList renders data coming from a Kubernetes cluster or Server Sent Events associated to a specific endpoint and topic
   */
  kind: string
  spec: {
    widgetData: {
      /**
       * list of events received from a k8s cluster or server sent event
       */
      events: SSEK8sEvent[]
      /**
       * endpoint url for server sent events connection
       */
      sseEndpoint?: string
      /**
       * subscription topic for server sent events
       */
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
