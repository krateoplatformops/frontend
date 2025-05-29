export interface Action {
  type: 'navigate' | 'rest' | 'openDrawer' | 'openModal'
  id: string
  name: string
  verb: 'GET' | 'POST' | 'DELETE'
  resourceRefId: string
  requireConfirmation?: boolean
  onSuccessNavigateTo?: string
  loading?: 'global' | 'inline' | 'none'
  payload?: object
}

export interface K8sEvent {
  metadata: {
    name: string
    namespace: string
    uid: string
    creationTimestamp: string
    [key: string]: unknown
  }
  involvedObject: {
    kind: string
    namespace: string
    name: string
    uid: string
    [key: string]: unknown
  }
  reason: string
  message: string
  type: 'Normal' | 'Warning'
  source: {
    component: string
    host?: string
  }
  firstTimestamp?: string
  lastTimestamp?: string
  eventTime?: string
  count?: number
  action?: string
  reportingComponent?: string
  reportingInstance?: string
  [key: string]: unknown
}

export interface SSEK8sEvent extends K8sEvent {
  description?: string
  icon?: string
  involvedObject: K8sEvent['involvedObject'] & {
    apiVersion?: string
  }
  title?: string
  url?: string
}
