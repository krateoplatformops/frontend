export interface FlowChart {
  version: string
  /**
   * FlowChart represents a Kubernetes composition as a directed graph. Each node represents a resource, and edges indicate parent-child relationships
   */
  kind: string
  spec: {
    widgetData: {
      /**
       * list of kubernetes resources and their relationships to render as nodes in the flow chart
       */
      data?: {
        /**
         * timestamp indicating when the resource was created
         */
        createdAt: string
        /**
         * health status of the resource
         */
        health?: {
          /**
           * optional description of the health state
           */
          message?: string
          /**
           * reason explaining the current health status
           */
          reason?: string
          /**
           * short status keyword (e.g. healthy, degraded)
           */
          status?: string
          /**
           * type or category of health check
           */
          type?: string
          [k: string]: unknown
        }
        /**
         * kubernetes resource type (e.g. Deployment, Service)
         */
        kind: string
        /**
         * name of the resource
         */
        name: string
        /**
         * namespace in which the resource is defined
         */
        namespace: string
        /**
         * list of parent resources used to define graph relationships
         */
        parentRefs?: {
          /**
           * timestamp indicating when the parent resource was created
           */
          createdAt?: string
          /**
           * health status of the parent resource
           */
          health?: {
            /**
             * optional description of the health state
             */
            message?: string
            /**
             * reason explaining the current health status
             */
            reason?: string
            /**
             * short status keyword
             */
            status?: string
            /**
             * type or category of health check
             */
            type?: string
            [k: string]: unknown
          }
          /**
           * resource type of the parent
           */
          kind?: string
          /**
           * name of the parent resource
           */
          name?: string
          /**
           * namespace of the parent resource
           */
          namespace?: string
          /**
           * nested parent references for recursive relationships
           */
          parentRefs?: {
            [k: string]: unknown
          }[]
          /**
           * internal version string of the parent resource
           */
          resourceVersion?: string
          /**
           * unique identifier of the parent resource
           */
          uid?: string
          /**
           * api version of the parent resource
           */
          version?: string
          [k: string]: unknown
        }[]
        /**
         * internal version string of the resource
         */
        resourceVersion: string
        /**
         * unique identifier of the resource
         */
        uid: string
        /**
         * api version of the resource
         */
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
