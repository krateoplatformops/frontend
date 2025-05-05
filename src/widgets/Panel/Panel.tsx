import { Card as AntdCard } from 'antd'

import { WidgetRenderer } from '../../components/WidgetRenderer'
import type { WidgetItems, WidgetProps } from '../../types/Widget'
import { getEndpointUrl } from '../../utils/utils'

/* TODO: generate from schema  */
type PanelType = {
  title: string
  items: WidgetItems
}

const Panel = ({ widgetData, backendEndpoints }: WidgetProps<PanelType>) => {
  return (
    <AntdCard title={widgetData.title}>
      {widgetData.items.map((item) => {
        return <WidgetRenderer widgetEndpoint={getEndpointUrl(item.backendEndpointId, backendEndpoints)} />
      })}
    </AntdCard>
  )
}

export default Panel
