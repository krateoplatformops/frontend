import { List } from 'antd'

import WidgetRenderer from '../../components/WidgetRenderer'
import type { WidgetProps } from '../../types/Widget'
import { getEndpointUrl } from '../../utils/utils'

import type { DataGrid as WidgetType } from './DataGrid.type'

export type DataGridWidgetData = WidgetType['spec']['widgetData']

const DataGrid = ({ resourcesRefs, widgetData }: WidgetProps<DataGridWidgetData>) => {
  const { asGrid, items, prefix } = widgetData

  return (
    <List
      dataSource={items}
      grid={asGrid && (items && items?.length > 1) ? {
        gutter: 16,
        lg: 3,
        md: 2,
        sm: 1,
        xl: 3,
        xs: 1,
        xxl: 4,
      } : { column: 1, gutter: 16 }}
      renderItem={(item) => {
        return (
          <List.Item>
            <WidgetRenderer prefix={prefix} widgetEndpoint={getEndpointUrl(item.resourceRefId, resourcesRefs)} />
          </List.Item>
        )
      }}
    />
  )
}

export default DataGrid
