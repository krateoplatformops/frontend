import { WidgetRenderer } from '../../components/WidgetRenderer'
import type { WidgetProps } from '../../types/Widget'
import { getEndpointUrl } from '../../utils/utils'

export function Column({
  widgetData,
  resourcesRefs,
}: WidgetProps<{
  items: Array<{
    resourceRefId: string
  }>
}>) {
  const { items } = widgetData

  return (
    <div>
      <h1>Column</h1>
      <div>
        {items.map((item) => {
          return (
            <div key={item.resourceRefId} style={{ border: '1px solid red' }}>
              <WidgetRenderer widgetEndpoint={getEndpointUrl(item.resourceRefId, resourcesRefs)} />
            </div>
          )
        })}
      </div>
    </div>
  )
}
