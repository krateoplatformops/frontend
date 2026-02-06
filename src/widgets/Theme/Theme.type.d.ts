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
       * Defines customization for specific components / widgets
       */
      custom?: {
        [k: string]: unknown
      }
      /**
       * The mode on which the theme is based (dark or light)
       */
      mode: 'dark' | 'light'
      /**
       * Defines the application logo as SVG string or URL
       */
      logo?: {
        /**
         * The logo as SVG
         */
        svg?: string
        /**
         * The logo resource URL
         */
        url?: string
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
