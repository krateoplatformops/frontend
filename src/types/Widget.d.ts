export interface Widget<WidgetDataType = unknown> {
  uid: string
  name: string
  namespace: string
  apiVersion: string
  kind: string
  code?: number
  message?: string
  reason?: string
  spec: {
    widgetData: WidgetDataType
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
    widgetData: WidgetDataType
    widgets: Widget[]
    actions: WidgetActions
    events: unknown /* EventsType */
    resourcesRefs: Array<{
      id: string
      path: string
      verb: 'GET' | 'POST' | 'DELETE'
      payload: object
    }>
  } | string
}

export type WidgetActions = {
  rest?: {
    type: 'rest'
    id: string
    name: string
    verb: 'GET' | 'POST' | 'DELETE'
    resourceRefId: string
    requireConfirmation?: boolean
    onSuccessNavigateTo?: string
    loading?: 'global' | 'inline' | 'none'
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

export type WidgetProps<T = unknown> = {
  widgetData: T
  actions: Widget['status']['actions']
  resourcesRefs: Widget['status']['resourcesRefs']
}

