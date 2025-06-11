export interface Panel {
  version: string
  kind: string
  spec: {
    widgetData: {
      /**
       * the id of the action to be executed when the panel is clicked
       */
      clickActionId?: string
      footer?: {
        items: {
          resourceRefId: string
        }[]
        tags?: string[]
      }
      icon?: {
        name: string
        color?: string
      }
      items: {
        resourceRefId: string
      }[]
      title?: string
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
