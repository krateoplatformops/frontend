import { Card as AntdCard } from 'antd'

import { WidgetRenderer } from '../../components/WidgetRenderer'
import type { WidgetItems, WidgetProps } from '../../types/Widget'
import { getResourceEndpoint } from '../../utils/utils'

/* TODO: generate from schema  */
type PanelType = {
  title: string
  items: WidgetItems
}

const Panel = ({ widgetData, backendEndpoints }: WidgetProps<PanelType>) => {
  console.log(widgetData.items, backendEndpoints)
  return (
    <AntdCard title={widgetData.title}>
      <WidgetRenderer widgetEndpoint={getResourceEndpoint({
        name: widgetData.items[0].backendEndpointId,
        namespace: 'krateo-system',
        version: 'v1beta1',
        resource: 'piecharts'
      })} />
      <WidgetRenderer widgetEndpoint={getResourceEndpoint({
        name: widgetData.items[1].backendEndpointId,
         namespace: 'krateo-system',
         version: 'v1beta1',
         resource: 'tables'
      })} />
    </AntdCard>
  )
}

export default Panel
