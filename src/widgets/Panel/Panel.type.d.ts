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
        tag?: string
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
      navigate?: {
        id: string
        type: 'navigate'
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
