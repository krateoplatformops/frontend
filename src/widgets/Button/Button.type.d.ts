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
       * the actions of the widget
       */
      actions: {
        /**
         * rest api call actions triggered by the widget
         */
        rest?: {
          /**
           * key used to nest the payload in the request body
           */
          payloadKey?: string
          /**
           * unique identifier for the action
           */
          id: string
          /**
           * the identifier of the k8s custom resource that should be represented
           */
          resourceRefId: string
          /**
           * whether user confirmation is required before triggering the action
           */
          requireConfirmation?: boolean
          /**
           * a message that will be displayed inside a toast in case of error
           */
          errorMessage?: string
          /**
           * a message that will be displayed inside a toast in case of success
           */
          successMessage?: string
          /**
           * url to navigate to after successful execution
           */
          onSuccessNavigateTo?: string
          /**
           * conditional navigation triggered by a specific event
           */
          onEventNavigateTo?: {
            /**
             * identifier of the awaited event reason
             */
            eventReason: string
            /**
             * url to navigate to when the event is received
             */
            url: string
            /**
             * the timeout in seconds to wait for the event
             */
            timeout?: number
          }
          /**
           * defines the loading indicator behavior for the action
           */
          loading?: 'global' | 'inline' | 'none'
          /**
           * type of action to execute
           */
          type: 'rest'
          headers?: string[]
          /**
           * static payload sent with the request
           */
          payload?: {
            [k: string]: unknown
          }
          /**
           * list of payload fields to override dynamically
           */
          payloadToOverride?: {
            /**
             * name of the field to override
             */
            name: string
            /**
             * value to use for overriding the field
             */
            value: string
          }[]
        }[]
        /**
         * client-side navigation actions
         */
        navigate?: {
          /**
           * unique identifier for the action
           */
          id: string
          /**
           * type of navigation action
           */
          type: 'navigate'
          /**
           * the identifier of the k8s custom resource that should be represented
           */
          resourceRefId: string
          /**
           * whether user confirmation is required before navigating
           */
          requireConfirmation?: boolean
          /**
           * defines the loading indicator behavior during navigation
           */
          loading?: 'global' | 'inline' | 'none'
        }[]
        /**
         * actions to open side drawer components
         */
        openDrawer?: {
          /**
           * unique identifier for the drawer action
           */
          id: string
          /**
           * type of drawer action
           */
          type: 'openDrawer'
          /**
           * the identifier of the k8s custom resource that should be represented
           */
          resourceRefId: string
          /**
           * whether user confirmation is required before opening
           */
          requireConfirmation?: boolean
          /**
           * defines the loading indicator behavior for the drawer
           */
          loading?: 'global' | 'inline' | 'none'
          /**
           * drawer size to be displayed
           */
          size?: 'default' | 'large'
          /**
           * title shown in the drawer header
           */
          title?: string
        }[]
        /**
         * actions to open modal dialog components
         */
        openModal?: {
          /**
           * unique identifier for the modal action
           */
          id: string
          /**
           * type of modal action
           */
          type: 'openModal'
          /**
           * the identifier of the k8s custom resource that should be represented
           */
          resourceRefId: string
          /**
           * whether user confirmation is required before opening
           */
          requireConfirmation?: boolean
          /**
           * defines the loading indicator behavior for the modal
           */
          loading?: 'global' | 'inline' | 'none'
          /**
           * title shown in the modal header
           */
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
