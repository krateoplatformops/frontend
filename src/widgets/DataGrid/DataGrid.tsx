import { List } from 'antd'
import type { ListGridType } from 'antd/es/list'
import { useCallback, useEffect, useMemo, useState } from 'react'

import { useFilter } from '../../components/FiltesProvider/FiltersProvider'
import WidgetRenderer from '../../components/WidgetRenderer'
import type { WidgetProps } from '../../types/Widget'
import { getEndpointUrl } from '../../utils/utils'

import styles from './DataGrid.module.css'
import type { DataGrid as WidgetType } from './DataGrid.type'

export type DataGridWidgetData = WidgetType['spec']['widgetData']

const DataGrid = ({ resourcesRefs, widgetData }: WidgetProps<DataGridWidgetData>) => {
  const { asGrid, grid, items, prefix } = widgetData

  const [visibleMap, setVisibleMap] = useState<Record<string, boolean>>({})

  const { getFilters } = useFilter()
  const filters = useMemo(() => (prefix ? getFilters(prefix) : []), [getFilters, prefix])

  // Resets visible map when filters change
  useEffect(() => {
    setVisibleMap({})
  }, [filters])

  // Track each children widget's visibility based on global filters to control DataGrid rendering
  const handleVisibilityChange = useCallback((id: string, visible: boolean) => {
    setVisibleMap(prev => {
      if (prev[id] === visible) { return prev }
      return { ...prev, [id]: visible }
    })
  }, [])

  const datalist = useMemo(() => items
    .map(({ resourceRefId }) => {
      const endpoint = getEndpointUrl(resourceRefId, resourcesRefs)
      if (!endpoint) { return null }

      return (
        <WidgetRenderer
          key={resourceRefId}
          onVisibilityChange={(visible) =>
            handleVisibilityChange(resourceRefId, visible)
          }
          prefix={prefix}
          widgetEndpoint={endpoint}
          wrapper={{ component: List.Item }}
        />
      )
    })
    // Keep only widgets that are visible according to visibleMap; initially show all to avoid flicker
    .filter(item => {
      if (!item) {
        return false
      }

      const id = item.key as string

      if (!(id in visibleMap)) {
        return true
      }

      return visibleMap[id] === true
    }),
  [items, prefix, resourcesRefs, visibleMap, handleVisibilityChange])

  const renderedGrid: ListGridType = useMemo(() => {
    if (asGrid && items) {
      if (grid) {
        return grid
      }

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
      <List dataSource={datalist} grid={renderedGrid} renderItem={(item) => item} />
    </div>
  )
}

export default DataGrid
