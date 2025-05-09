
import { WidgetRenderer } from '../../components/WidgetRenderer'
import type { WidgetProps } from '../../types/Widget'
import { getEndpointUrl } from '../../utils/utils'

export function Route(
  props: WidgetProps<{ resourceRefId: string }>,
) {
  const { widgetData, resourcesRefs } = props
  return <WidgetRenderer widgetEndpoint={getEndpointUrl(widgetData.resourceRefId, resourcesRefs)} />
}
