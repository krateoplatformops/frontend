import type { IconProp } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Table as AntdTable, Typography } from 'antd'

import { useFilter } from '../../components/FiltesProvider/FiltersProvider'
import WidgetRenderer from '../../components/WidgetRenderer'
import type { WidgetProps } from '../../types/Widget'
import { getEndpointUrl } from '../../utils/utils'

import styles from './Table.module.css'
import type { Table as WidgetType } from './Table.type'

export type TableWidgetData = WidgetType['spec']['widgetData']

/**
 * Parses a dot-notation string (e.g., "user.name.first") into an array of strings
 * for use as a nested path in Ant Design's `dataIndex`.
 *
 * If the input contains dot notation, it is split by "." and returned as an array.
 * Otherwise, the original string is returned.
 *
 * @param {string} input - The valueKey string to parse.
 * @returns {string | string[]} - An array of keys if dot notation is detected, otherwise the original string.
 */
const parseValueKey = (input: string): string | string[] => {
  return input.includes('.') ? input.split('.') : input
}

const Table = ({ resourcesRefs, uid, widgetData }: WidgetProps<TableWidgetData>) => {
  const { columns, data, pageSize, prefix } = widgetData
  const { getFilteredData } = useFilter()

  let dataTable: { [k: string]: unknown }[] = data
  if (prefix && data?.length > 0) {
    dataTable = getFilteredData(data, prefix) as { [k: string]: unknown }[]
  }

  return (
    <AntdTable
      columns={columns?.map(({ color, title, valueKey }, index) => ({
        dataIndex: parseValueKey(valueKey),
        key: `${uid}-col-${index}`,
        render: (cell: TableWidgetData['data'][number][string]) => {
          if (!cell) {
            console.error('Table rendering error: cell is undefined')
            return <span>-</span>
          }

          const { kind, resourceRefId, type, value } = cell

           if (kind === 'icon') {
            if (typeof value === 'string') {
              return <FontAwesomeIcon color={color} icon={value as IconProp} />
            }

            console.error('Table rendering error: icon value has incorrect format')
          }

          if (kind === 'widget' && resourceRefId) {
            if (resourceRefId) {
              const endpoint = getEndpointUrl(resourceRefId, resourcesRefs)
              if (!endpoint) {
                return <span>-</span>
              }

              return <WidgetRenderer widgetEndpoint={endpoint} />
            }

            console.error('Table rendering error: widget resourceRefId not found')
            return <span>-</span>
          }

          if (kind === 'jsonSchemaType') {
            if (value === undefined || value === null || type === 'null' || type === undefined) {
              console.error('Table rendering error: cell with jsonSchemaType kind has undefined or null value or type')
              return <span>-</span>
            }

            switch (type) {
              case 'number':
              case 'integer': {
                const num = Number(value)
                return <span style={{ color }}>{isNaN(num) ? value : num}</span>
              }
              case 'boolean': {
                const boolVal = value.toLowerCase() === 'true'
                return <span style={{ color }}>{String(boolVal)}</span>
              }
              case 'array': {
                try {
                  const arr = JSON.parse(value) as unknown[]
                  if (Array.isArray(arr)) {
                    return <span style={{ color }}>{JSON.stringify(arr)}</span>
                  }
                } catch (error) {
                  console.error(`Table rendering error: error in parsing cell with array type value ${JSON.stringify(error)}`)
                  return <span>-</span>
                }
                return <span>-</span>
              }
              default:
                return <span style={{ color }}>{value}</span>
            }
          }

          console.error('Table rendering error: generic error while rendering cell')
          return <span>-</span>
        },
        title: (
          <div className={styles.headerEllipsis}>
            <Typography.Text ellipsis={{ tooltip: true }}>
              {title}
            </Typography.Text>
          </div>
        ),
      }))}
      dataSource={dataTable}
      key={uid}
      pagination={dataTable && pageSize && dataTable.length > pageSize ? { defaultPageSize: pageSize } : false}
      scroll={{ x: 'max-content' }}
    />
  )
}

export default Table
