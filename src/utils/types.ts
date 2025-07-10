import type { WidgetActions } from '../types/Widget'

interface JSONSchemaProperty {
  type?: string | string[]
  description?: string
  enum?: string[]
  items?: JSONSchemaPropertyOrContainer
}

type JSONSchemaPropertyOrContainer = JSONSchemaProperty & Partial<WidgetDataSchema>

export interface WidgetDataSchema {
  properties?: Record<string, JSONSchemaProperty>
  required?: string[]
}

interface WidgetActionsSchema {
  properties?: Record<string, WidgetActions>
  required?: string[]
}

export interface JSONSchema {
  title?: string
  description?: string
  properties?: {
    spec?: {
      properties?: {
        actions?: WidgetActionsSchema
        widgetData?: WidgetDataSchema
      }
    }
    kind?: {
      default?: string
      description?: string
    }
  }
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

export type RestApiResponse = {
  status?: string | number
  reason?: string
  message?: string
  metadata?: {
    name?: string
    namespace?: string
    uid?: string
    [key: string]: unknown
  }
  [key: string]: unknown
}
