export interface Panel {
  version: string
  /**
   * Panel is a container to display information
   */
  kind: string
  spec: {
    widgetData: {
      /**
       * the id of the action to be executed when the panel is clicked
       */
      clickActionId?: string
      /**
       * footer section of the panel containing additional items and tags
       */
      footer?: {
        /**
         * list of resource references to render in the footer
         */
        items?: {
          /**
           * the identifier of the k8s custom resource that should be represented, usually a widget
           */
          resourceRefId: string
        }[]
        /**
         * list of string tags to be displayed in the footer
         */
        tags?: string[]
      }
      /**
       * optional text to be displayed under the title, on the left side of the Panel
       */
      headerLeft?: string
      /**
       * optional text to be displayed under the title, on the right side of the Panel
       */
      headerRight?: string
      /**
       * icon displayed in the panel header
       */
      icon?: {
        /**
         * name of the icon to display (font awesome icon name eg: `fa-inbox`)
         */
        name: string
        /**
         * color of the icon
         */
        color?: string
      }
      /**
       * list of resource references to display as main content in the panel
       */
      items: {
        /**
         * the identifier of the k8s custom resource that should be represented, usually a widget
         */
        resourceRefId: string
      }[]
      /**
       * text to be displayed as the panel title
       */
      title?: string
      /**
       * optional tooltip text shown on the top right side of the card to provide additional context
       */
      tooltip?: string
    }
    resourcesRefs: {
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
    /**
     * the actions of the panel
     */
    actions?: {
      rest?: {
        id: string
        resourceRefId: string
        requireConfirmation?: boolean
        onSuccessNavigateTo?: string
        loading?: 'global' | 'inline' | 'none'
        type?: 'rest'
        payload?: {
          [k: string]: unknown
        }
      }[]
      navigate?: {
        id: string
        type: 'navigate'
        name: string
        resourceRefId: string
        requireConfirmation?: boolean
        loading?: 'global' | 'inline' | 'none'
      }[]
      openDrawer?: {
        id: string
        type: 'openDrawer'
        resourceRefId: string
        requireConfirmation?: boolean
        loading?: 'global' | 'inline' | 'none'
        size?: 'default' | 'large'
        title?: string
      }[]
      openModal?: {
        id: string
        type: 'openModal'
        name: string
        resourceRefId: string
        requireConfirmation?: boolean
        loading?: 'global' | 'inline' | 'none'
        title?: string
      }[]
    }
    widgetDataTemplate?: {
      forPath?: string
      expression?: string
    }[]
  }
}
