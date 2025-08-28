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
       * filter prefix used to filter data
       */
      prefix?: string
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
      _slice_?: {
        offset?: number
        page: number
        perPage: number
        continue?: boolean
        [k: string]: unknown
      }
      items: {
        id: string
        name?: string
        namespace?: string
        resource?: string
        apiVersion?: string
        verb?: 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'GET'
        payload?: {
          [k: string]: unknown
        }
        [k: string]: unknown
      }[]
      [k: string]: unknown
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
