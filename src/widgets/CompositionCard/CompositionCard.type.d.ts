export interface CompositionCard {
  version: string
  /**
   * CompositionCard represents a container to display information about a Composition
   */
  kind: string
  spec: {
    widgetData: {
      /**
       * date associated with the composition, typically its creation time
       */
      date?: string
      /**
       * short text describing the composition's purpose or status
       */
      description?: string
      /**
       * icon displayed on the card
       */
      icon?: {
        /**
         * icon name to display (font awesome icon name eg: `fa-inbox`)
         */
        name: string
        /**
         * color of the icon
         */
        color?: string
      }
      /**
       * current status of the composition (e.g., running, failed, pending)
       */
      status?: string
      /**
       * list of tags for categorizing or filtering the composition
       */
      tags?: string[]
      /**
       * main title of the card, usually the name of the composition
       */
      title?: string
      /**
       * optional tooltip text shown on the top right side of the card to provide additional context
       */
      tooltip?: string
      /**
       * id of the action triggered when the delete button is clicked
       */
      deleteCompositionActionId?: string
      /**
       * id of the action triggered when the card is clicked
       */
      navigateToDetailActionId?: string
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
    actions: {
      navigate?: {
        id: string
        type: 'navigate'
        name: string
        resourceRefId: string
        requireConfirmation?: boolean
        loading?: 'global' | 'inline' | 'none'
      }[]
      rest?: {
        id: string
        resourceRefId: string
        requireConfirmation?: boolean
        onSuccessNavigateTo?: string
        loading?: 'global' | 'inline' | 'none'
        type?: 'rest'
      }[]
      openDrawer?: {
        id: string
        type: 'openDrawer'
        resourceRefId: string
        requireConfirmation?: boolean
        loading?: 'global' | 'inline' | 'none'
      }[]
      openModal?: {
        id: string
        type: 'openModal'
        name: string
        resourceRefId: string
        requireConfirmation?: boolean
        loading?: 'global' | 'inline' | 'none'
      }[]
    }
    widgetDataTemplate?: {
      forPath?: string
      expression?: string
    }[]
  }
}
