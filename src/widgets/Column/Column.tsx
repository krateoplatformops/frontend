import { Col as AntdColumn } from 'antd'

import WidgetRenderer from '../../components/WidgetRenderer'
import type { WidgetProps } from '../../types/Widget'
import { getEndpointUrl } from '../../utils/utils'

import type { Column as WidgetType } from './Column.type'

export type ColumnWidgetData = WidgetType['spec']['widgetData']

const Column = ({ resourcesRefs, uid, widgetData }: WidgetProps<ColumnWidgetData>) => {
  const { items, size } = widgetData

  return (
    <AntdColumn key={uid} span={size}>
      {items.map(({ resourceRefId }, index) => (
        <WidgetRenderer key={`${uid}-${index}`} widgetEndpoint={getEndpointUrl(resourceRefId, resourcesRefs)} />
      ))}
    </AntdColumn>
  )
}

export default Column
