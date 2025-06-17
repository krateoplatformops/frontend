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
    actions: WidgetActions
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
  status:
    | {
        widgetData: WidgetDataType
        widgets: Widget[]
        events: unknown /* EventsType */
        resourcesRefs: ResourcesRefs
      }
    | string
}

export type WidgetActions = {
  rest?: {
    type: 'rest'
    id: string
    name: string
    payload: object
    verb: 'GET' | 'POST' | 'DELETE'
    resourceRefId: string
    requireConfirmation?: boolean
    onSuccessNavigateTo?: string
    onEventNavigateTo?: {
      url: string
      eventReason: string
    }
    loading?: 'global' | 'inline' | 'none'
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
    resourceRefId: string
    requireConfirmation?: boolean
    loading?: 'global' | 'inline' | 'none'
  }[]
}

export type WidgetProps<T = unknown, A = WidgetActions> = {
  actions: A
  resourcesRefs: ResourcesRefs
  uid: string
  widgetData: T
}
