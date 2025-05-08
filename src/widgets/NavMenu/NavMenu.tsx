import { WidgetRenderer } from '../../components/WidgetRenderer'
import type { WidgetProps } from '../../types/Widget'
import { getResourceEndpoint } from '../../utils/utils'

export function NavMenu(
  props: WidgetProps<{
    items: Array<{
      resourceRefId: string
    }>
  }>,
) {
  const { items } = props.widgetData
  return (
    <div>
      {items.map((item) => {
        const widgetEndpoint = getEndpointUrl(item.resourceRefId, props.resourcesRefs)
        return <WidgetRenderer widgetEndpoint={widgetEndpoint} />
      })}
    </div>
  )
}
