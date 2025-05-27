export interface ResourceRef {
  id: string
  path: string
  verb: 'GET' | 'POST' | 'DELETE'
  payload: object
}

export type ResourcesRefs = ResourceRef[]

export interface Widget<WidgetDataType = unknown> {
  apiVersion: string
  kind: string
  code?: number
  message?: string
  reason?: string
  metadata: {
    annotations: object
    creationTimestamp: string
    generation: number
    name: string
    namespace: string
    resourceVersion: string
    uid: string
  }
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
    resourcesRefs: ResourcesRefs
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
    resourceRefId: string
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
  actions: WidgetActions
  resourcesRefs: ResourcesRefs
  uid: string
  widgetData: T
}
