export interface CompositionCard {
  version: string
  /**
   * CompositionCard represents a container to display information about a Composition
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
          payloadKey: string
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
          type?: 'rest'
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
           * name of the navigation action
           */
          name: string
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
          /**
           * reference to the widget shown inside the drawer
           */
          contentWidgetRef: string
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
           * name of the modal action
           */
          name: string
          /**
           * reference to the widget shown inside the modal
           */
          contentWidgetRef: string
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
