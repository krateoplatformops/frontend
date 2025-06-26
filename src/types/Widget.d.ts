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
        actions: WidgetActions
        widgetData: WidgetDataType
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
    successMessage?: string
    errorMessage?: string
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

export type WidgetProps<T = unknown> = {
  resourcesRefs: ResourcesRefs
  uid: string
  widgetData: T
}
