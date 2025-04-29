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
    actions: unknown /* ActionsType */
    events: unknown /* EventsType */
  }
}
