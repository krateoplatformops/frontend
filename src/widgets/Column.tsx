import type { WidgetProps } from '../types/Widget'
import { getEndpointUrl } from '../utils/utils'

import { WidgetRenderer } from '../components/WidgetRenderer'

export function Column({
  widgetData,
  backendEndpoints,
}: WidgetProps<{
  items: Array<{
    backendEndpointId: string
  }>
}>) {
  const { items } = widgetData

  return (
    <div>
      <h1>Column</h1>
      <div>
        {items.map((item) => {
          return (
            <div key={item.backendEndpointId} style={{ border: '1px solid red' }}>
              <WidgetRenderer widgetEndpoint={getEndpointUrl(item.backendEndpointId, backendEndpoints)} />
            </div>
          )
        })}
      </div>
    </div>
  )
}
