import type { IconProp } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Table as AntdTable, Typography } from 'antd'

import { useFilter } from '../../components/FiltesProvider/FiltersProvider'
import type { WidgetProps } from '../../types/Widget'

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

const Table = ({ uid, widgetData }: WidgetProps<TableWidgetData>) => {
  const { columns, data, pageSize, prefix } = widgetData
  const { getFilteredData } = useFilter()

  let dataTable: { [k: string]: unknown }[] = data
  if (prefix && data?.length > 0) {
    dataTable = getFilteredData(data, prefix) as { [k: string]: unknown }[]
  }

  return (
    <AntdTable
      columns={columns?.map(({ color, kind, title, valueKey }, index) => ({
        dataIndex: parseValueKey(valueKey),
        key: `${uid}-col-${index}`,
        render: (value?: unknown) => {
          if (kind === 'icon' && typeof value === 'string') {
            return <FontAwesomeIcon color={color} icon={value as IconProp} />
          }

          if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
            return <span style={{ color }}>{String(value)}</span>
          }

          if (value === null || value === undefined) {
            return <span>-</span>
          }

          return <span style={{ color }}>{JSON.stringify(value)}</span>
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
