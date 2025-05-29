export interface CompositionCard {
  version: string
  kind: string
  spec: {
    widgetData: {
      date?: string
      description?: string
      icon?: {
        name: string
        color?: string
      }
      status?: string
      tags?: string[]
      title?: string
      tooltip?: string
      /**
       * the id of the action to be executed when the delete button is clicked
       */
      deleteCompositionActionId?: string
      /**
       * the id of the action to be executed when the panel is clicked
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
    }
    widgetDataTemplate?: {
      forPath?: string
      expression?: string
    }[]
  }
}
