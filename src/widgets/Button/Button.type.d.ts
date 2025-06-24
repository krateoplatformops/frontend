export interface Button {
  /**
   * widget version
   */
  version: string
  /**
   * Button represents an interactive component which, when clicked, triggers a specific business logic defined by its `clickActionId`
   */
  kind: string
  spec: {
    widgetData: {
      /**
       * the actions of the form
       */
      actions: {
        rest?: {
          /**
           * the key to nest the payload to
           */
          payloadKey: string
          id: string
          resourceRefId: string
          requireConfirmation?: boolean
          onSuccessNavigateTo?: string
          onEventNavigateTo?: {
            eventReason: string
            url: string
            /**
             * the timeout in seconds to wait for the event
             */
            timeout?: number
          }
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
          contentWidgetRef: string
          resourceRefId: string
          requireConfirmation?: boolean
          loading?: 'global' | 'inline' | 'none'
          title?: string
        }[]
      }
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
       * the icon of the button (font awesome icon name eg: `fa-inbox`)
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
