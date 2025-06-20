import { List } from 'antd'
import type { ListGridType } from 'antd/es/list'
import type { ReactElement } from 'react'
import { useMemo } from 'react'

import WidgetRenderer from '../../components/WidgetRenderer'
import type { WidgetProps } from '../../types/Widget'
import { getEndpointUrl } from '../../utils/utils'

import styles from './DataGrid.module.css'
import type { DataGrid as WidgetType } from './DataGrid.type'

export type DataGridWidgetData = WidgetType['spec']['widgetData']

const DataGrid = ({ resourcesRefs, widgetData }: WidgetProps<DataGridWidgetData>) => {
  const { asGrid, grid, items, prefix } = widgetData

  const getDatalist = () => {
    if (prefix) {
      const datalist: ReactElement[] = []

      items.forEach(({ resourceRefId }) => {
        const elem = WidgetRenderer({ prefix, widgetEndpoint: getEndpointUrl(resourceRefId, resourcesRefs) })
        if (elem) { datalist.push(elem) }
      })

      return datalist
    }

    return items.map(({ resourceRefId }) => (
      <WidgetRenderer key={resourceRefId} widgetEndpoint={getEndpointUrl(resourceRefId, resourcesRefs)} />
    ))
  }

  const renderedGrid: ListGridType = useMemo(() => {
    if (asGrid && items && items.length > 1) {
      if (grid) { return grid }

      return {
        gutter: 16,
        lg: 3,
        md: 2,
        sm: 1,
        xl: 3,
        xs: 1,
        xxl: 4,
      }
    }

    return { column: 1, gutter: 16 }
  }, [asGrid, grid, items])

  return (
    <div className={styles.list}>
      <List
        dataSource={getDatalist()}
        grid={renderedGrid}
        renderItem={(item, index) => (
          <List.Item key={`datagrid-item-${item.key || index}`}>
            {item}
          </List.Item>
        )}
      />
    </div>
  )
}

export default DataGrid
