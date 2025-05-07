import { WidgetRenderer } from '../../components/WidgetRenderer'
import type { WidgetProps } from '../../types/Widget'
import { getResourceEndpoint } from '../../utils/utils'

export function NavMenu(
  props: WidgetProps<{
    items: Array<{
      backendEndpointId: string
    }>
  }>,
) {
  const { items } = props.widgetData
  return (
    <div>
      {items.map((item) => {
        return <WidgetRenderer widgetEndpoint={getResourceEndpoint({
          name: item.backendEndpointId,
          namespace: 'krateo-system',
          resource: 'routes',
          version: 'v1beta1',
        })} />
      })}
    </div>
  )
}
