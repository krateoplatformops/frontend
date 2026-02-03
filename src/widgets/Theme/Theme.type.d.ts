export interface Theme {
  /**
   * widget version
   */
  version: string
  /**
   * Theme is a widget that allows to define an UI theme for the entire application.
   */
  kind: string
  spec: {
    /**
     * the data that will be passed to the widget on the frontend
     */
    widgetData: {
      /**
       * The mode on which the theme is based (dark or light)
       */
      mode: 'dark' | 'light'
      /**
       * Defines customization for specific components / widgets
       */
      custom?: {
        [k: string]: unknown
      }
      /**
       * Defines customization for specific style tokens
       */
      token?: {
        [k: string]: unknown
      }
    }
    resourcesRefs: {
      items: {
        allowed: boolean
        apiVersion?: string
        id: string
        name?: string
        namespace?: string
        payload?: {
          [k: string]: unknown
        }
        resource?: string
        verb?: 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'GET'
        slice?: {
          offset?: number
          page: number
          perPage: number
          continue?: boolean
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
