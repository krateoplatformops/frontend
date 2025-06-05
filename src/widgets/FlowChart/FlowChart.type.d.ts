export interface FlowChart {
  version: string
  kind: string
  spec: {
    widgetData: {
      data?: {
        createdAt: string
        health?: {
          message?: string
          reason?: string
          status?: string
          type?: string
          [k: string]: unknown
        }
        kind: string
        name: string
        namespace: string
        parentRefs?: {
          createdAt?: string
          health?: {
            message?: string
            reason?: string
            status?: string
            type?: string
            [k: string]: unknown
          }
          kind?: string
          name?: string
          namespace?: string
          parentRefs?: {
            [k: string]: unknown
          }[]
          resourceVersion?: string
          uid?: string
          version?: string
          [k: string]: unknown
        }[]
        resourceVersion: string
        uid: string
        version: string
        [k: string]: unknown
      }[]
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
