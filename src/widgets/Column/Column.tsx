import { Col as AntdColumn } from 'antd'

import WidgetRenderer from '../../components/WidgetRenderer'
import type { WidgetProps } from '../../types/Widget'
import { getEndpointUrl } from '../../utils/utils'

import type { Column as WidgetType } from './Column.type'

export type ColumnWidgetData = WidgetType['spec']['widgetData']

const Column = ({ resourcesRefs, widgetData }: WidgetProps<ColumnWidgetData>) => {
  const { items, size } = widgetData

  return (
    <AntdColumn span={size}>
      {items.map(({ resourceRefId }) => <WidgetRenderer widgetEndpoint={getEndpointUrl(resourceRefId, resourcesRefs)} />)}
    </AntdColumn>
  )
}

export default Column
