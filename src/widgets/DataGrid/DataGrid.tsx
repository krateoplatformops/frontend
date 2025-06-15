import { List } from 'antd'
import type { ReactElement } from 'react'

import WidgetRenderer from '../../components/WidgetRenderer'
import type { WidgetProps } from '../../types/Widget'
import { getEndpointUrl } from '../../utils/utils'

import type { DataGrid as WidgetType } from './DataGrid.type'

export type DataGridWidgetData = WidgetType['spec']['widgetData']

const DataGrid = ({ resourcesRefs, widgetData }: WidgetProps<DataGridWidgetData>) => {
  const { asGrid, items, prefix } = widgetData

  const getDatalist = () => {
    let datalist: ReactElement[] = []
    if (prefix) {
      items.forEach(item => {
        const elem = WidgetRenderer({ prefix, widgetEndpoint: getEndpointUrl(item.resourceRefId, resourcesRefs) })
        if (elem) { datalist.push(elem) }
      })
    } else {
      // unfiltrable list
      datalist = items.map(item => <WidgetRenderer widgetEndpoint={getEndpointUrl(item.resourceRefId, resourcesRefs)} />)
    }
    return datalist
  }

  return (
    <List
      dataSource={getDatalist()}
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
            {item}
          </List.Item>
        )
      }}
    />
  )
}

export default DataGrid
