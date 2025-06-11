export interface Button {
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
       * the color of the button
       */
      color?:
        | 'default'
        | 'primary'
        | 'danger'
        | 'blue'
        | 'purple'
        | 'cyan'
        | 'green'
        | 'magenta'
        | 'pink'
        | 'red'
        | 'orange'
        | 'yellow'
        | 'volcano'
        | 'geekblue'
        | 'lime'
        | 'gold'
      /**
       * the label of the button
       */
      label?: string
      /**
       * the icon of the button (font awesome icon name eg: 'fa-inbox')
       */
      icon?: string
      /**
       * the shape of the button
       */
      shape?: 'default' | 'circle' | 'round'
      /**
       * the size of the button
       */
      size?: 'small' | 'middle' | 'large'
      /**
       * the visual style of the button
       */
      type?: 'default' | 'text' | 'link' | 'primary' | 'dashed'
      /**
       * the id of the action to be executed when the button is clicked
       */
      clickActionId: string
    }
    resourcesRefs?: {
      id: string
      apiVersion: string
      name: string
      namespace: string
      resource: string
      verb: 'GET' | 'POST' | 'DELETE'
    }[]
    /**
     * the actions of the button
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
