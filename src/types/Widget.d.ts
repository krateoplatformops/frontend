export interface Widget<WidetDataType = unknown> {
  uid: string
  name: string
  namespace: string
  apiVersion: string
  kind: string
  spec: {
    widgetData: WidetDataType
    widgetRefs?: {
      [key: string]: {
        id: string
        apiVersion: string
        resource: string
        name: string
        namespace: string
      }
    }
  }
  status: {
    widgetData: WidetDataType
    widgets: Widget[]
    actions: WidgetActions
    events: unknown /* EventsType */
    backendEndpoints: Array<{
      id: string
      path: string
      verb: 'GET' | 'POST' | 'DELETE'
      payload: object
    }>
  }
}

export type WidgetActions = {
  rest?: {
    type: 'rest'
    id: string
    name: string
    verb: 'GET' | 'POST' | 'DELETE'
    backendEndpointId: string
    requireConfirmation?: boolean
    onSuccessNavigateTo?: string
    loading?: 'global' | 'inline' | 'none'
  }[]
  navigate?: {
    id: string
    type: 'navigate'
    name: string
    backendEndpointId: string
    requireConfirmation?: boolean
    loading?: 'global' | 'inline' | 'none'
  }[]
  openDrawer?: {
    id: string
    type: 'openDrawer'
    name: string
    contentWidgetRef: string
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

export type WidgetProps<T> = {
  widgetData: T
  actions: Widget['status']['actions']
  backendEndpoints: Widget['status']['backendEndpoints']
}
