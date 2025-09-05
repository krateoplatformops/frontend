export interface Panel {
  version: string
  /**
   * Panel is a container to display information
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
          headers?: string[]
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
           * url to navigate to after successful execution
           */
          onSuccessNavigateTo?: string
          /**
           * a message that will be displayed inside a toast in case of error
           */
          errorMessage?: string
          /**
           * a message that will be displayed inside a toast in case of success
           */
          successMessage?: string
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
            reloadRoutes?: boolean
          }
          /**
           * type of action to execute
           */
          type: 'rest'
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
          loading?: {
            display: boolean
          }
        }[]
        /**
         * client-side navigation actions
         */
        navigate?: {
          /**
           * unique identifier for the action
           */
          id: string
          loading?: {
            display: boolean
          }
          /**
           * the identifier of the route to navigate to
           */
          path?: string
          /**
           * the identifier of the k8s custom resource that should be represented
           */
          resourceRefId?: string
          /**
           * whether user confirmation is required before navigating
           */
          requireConfirmation?: boolean
          /**
           * type of navigation action
           */
          type: 'navigate'
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
           * drawer size to be displayed
           */
          size?: 'default' | 'large'
          /**
           * title shown in the drawer header
           */
          title?: string
          loading?: {
            display: boolean
          }
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
           * title shown in the modal header
           */
          title?: string
          loading?: {
            display: boolean
          }
        }[]
      }
      /**
       * the id of the action to be executed when the panel is clicked
       */
      clickActionId?: string
      /**
       * footer section of the panel containing additional items
       */
      footer?: {
        /**
         * the identifier of the k8s custom resource that should be represented, usually a widget
         */
        resourceRefId: string
      }[]
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
       * list of string tags to be displayed in the footer
       */
      tags?: string[]
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
      _slice_?: {
        offset?: number
        page: number
        perPage: number
        continue?: boolean
        [k: string]: unknown
      }
      items: {
        allowed: boolean
        apiVersion?: string
        id: string
        name?: string
        namespace?: string
        payload?: {
          [k: string]: unknown
        }
        resource?: string
        verb?: 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'GET'
        [k: string]: unknown
      }[]
      [k: string]: unknown
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
