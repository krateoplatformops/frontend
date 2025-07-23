export interface Markdown {
  version: string
  /**
   * Markdown receives markdown in string format and renders it gracefully
   */
  kind: string
  spec: {
    widgetData: {
      /**
       * markdown string to be displayed
       */
      markdown: string
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
