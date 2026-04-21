export interface Markdown {
  version: string
  /**
   * Markdown receives markdown in string format and renders it gracefully
   */
  kind: string
  spec: {
    widgetData: {
      /**
       * displays a copy button on top of the widget to allow copy to clipboard
       */
      allowCopy?: boolean
      /**
       * displays a download button on top of the widget to allow download of the text
       */
      allowDownload?: boolean
      /**
       * if set, defines a max height for the markdown content. when content overflows its container becomes scrollable
       */
      contentMaxHeight?: number
      /**
       * if 'allowDownload' is set, this property allows to set an extension for the downloaded file. Default is .txt
       */
      downloadFileExtension?: string
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
