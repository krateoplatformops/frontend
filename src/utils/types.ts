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

export interface EventsApiResource {
  global_uid: string
  cluster_name: string
  namespace: string
  resource_kind: string
  resource_name: string
  event_type: string
  reason: string
  message: string
  created_at: string
  raw: string
}

export interface EventsApiResponse {
  cursor: string
  resources: EventsApiResource[]
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

export interface Payload {
  metadata?: {
    name?: string
    namespace?: string
    [key: string]: unknown
  }
  [key: string]: unknown
}
