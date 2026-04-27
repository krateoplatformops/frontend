export interface Table {
  version: string
  /**
   * Table displays structured data with customizable columns and pagination
   */
  kind: string
  spec: {
    widgetData: {
      /**
       * the actions of the widget
       */
      actions?: {
        /**
         * rest api call actions triggered by the widget
         */
        rest?: {
          /**
           * ***DEPRECATED*** key used to nest the payload in the request body
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
            reloadRoutes?: boolean
            /**
             * message to display while waiting for the event
             */
            loadingMessage?: string
          }
          /**
           * type of action to execute
           */
          type: 'rest'
          /**
           * array of headers as strings, format 'key: value'
           */
          headers: string[]
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
           * optional additional string URL path appended to the current URL when navigating to a resource via resourceRefId
           */
          resourceURLPathExtension?: string
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
          /**
           * the custom width of the value, which should be used by setting the 'custom' value inside the 'size' property
           */
          customWidth?: string
          /**
           * sets the Modal size, 'default' is 520px, 'large' is 80% of the screen width, 'fullscreen' is 100% of the screen width, 'custom' should be used with the 'customWidth' property
           */
          size?: 'default' | 'large' | 'fullscreen' | 'custom'
        }[]
      }
      /**
       * the list of resources that are allowed to be children of this widget or referenced by it
       */
      allowedResources: (
        | 'barcharts'
        | 'buttons'
        | 'buttongroups'
        | 'filters'
        | 'flowcharts'
        | 'linecharts'
        | 'markdowns'
        | 'paragraphs'
        | 'piecharts'
        | 'yamlviewers'
      )[]
      /**
       * configuration of the table's columns
       */
      columns: {
        /**
         * the color of the value (or the icon) to be represented
         */
        color?: 'blue' | 'darkBlue' | 'orange' | 'gray' | 'red' | 'green' | 'violet'
        /**
         * option that disallows columns displaying, useful to insert data to be used in table actions logic, e.g. a row id. default is `false`
         */
        hidden?: boolean
        /**
         * column header label
         */
        title: string
        /**
         * key used to extract the value from row data
         */
        valueKey: string
      }[]
      /**
       * Array of table rows
       */
      data: {
        /**
         * the key of the column this cell belongs to
         */
        valueKey: string
        /**
         * type of cell value
         */
        kind: 'jsonSchemaType' | 'icon' | 'widget'
        /**
         * used if kind = widget
         */
        resourceRefId?: string
        /**
         * used if kind = jsonSchemaType
         */
        type?: 'string' | 'number' | 'integer' | 'decimal' | 'boolean' | 'array' | 'null'
        /**
         * value if type = string
         */
        stringValue?: string
        /**
         * value if type = number or integer
         */
        numberValue?: number
        /**
         * value if type = number or decimal
         */
        decimalValue?: string
        /**
         * value if type = boolean
         */
        booleanValue?: boolean
        /**
         * value if type = array
         */
        arrayValue?: string[]
      }[][]
      /**
       * number of rows displayed per page
       */
      pageSize?: number
      /**
       * it's the filters prefix to get right values
       */
      prefix?: string
      /**
       * action ids that will be used for each row and displayed as buttons in a specific additional column
       */
      tableActions?: {
        /**
         * UI displaying customization for action button
         */
        button?: {
          /**
           * the background color of the button
           */
          backgroundColor?: 'blue' | 'darkBlue' | 'orange' | 'gray' | 'red' | 'green' | 'violet'
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
        }
        /**
         * the id of the action to be executed when the button is clicked
         */
        clickActionId?: string
      }[]
      /**
       * customization for the table actions column
       */
      tableActionsColumn?: {
        /**
         * table actions column customized label, default is empty string
         */
        label?: string
      }
    }
    resourcesRefs?: {
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
        slice?: {
          offset?: number
          page?: number
          perPage: number
          continue?: boolean
          [k: string]: unknown
        }
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
