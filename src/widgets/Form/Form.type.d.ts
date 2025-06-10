export interface Form {
  /**
   * widget version
   */
  version: string
  /**
   * name of the k8s Custom Resource
   */
  kind: string
  spec: {
    /**
     * the data that will be passed to the widget on the frontend
     */
    widgetData: {
      /**
       * the schema of the form as an object
       */
      schema?: {}
      /**
       * the schema of the form as a string
       */
      stringSchema?: string
      /**
       * the id of the action to be called when the form is submitted
       */
      submitActionId: string
    }
    apiRef?: {
      name: string
      namespace: string
    }
    widgetDataTemplate?: {
      forPath?: string
      expression?: string
    }[]
    /**
     * the actions of the form
     */
    actions: {
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
        payloadToOverride?: {
          name: string
          value: string
        }[]
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
        resourceRefId?: string
        requireConfirmation?: boolean
        loading?: 'global' | 'inline' | 'none'
      }[]
      openModal?: {
        id: string
        type: 'openModal'
        name: string
        contentWidgetRef: string
        requireConfirmation?: boolean
        loading?: 'global' | 'inline' | 'none'
      }[]
    }
  }
}
