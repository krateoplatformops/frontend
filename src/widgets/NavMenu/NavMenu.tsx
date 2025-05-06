import { WidgetRenderer } from '../../components/WidgetRenderer'
import type { WidgetProps } from '../../types/Widget'
import { getEndpointUrl } from '../../utils/utils'

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
        const widgetEndpoint = getEndpointUrl(item.backendEndpointId, props.backendEndpoints)
        return <WidgetRenderer widgetEndpoint={widgetEndpoint} />
      })}
    </div>
  )
}
