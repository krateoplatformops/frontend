import type { IconProp } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Table as AntdTable, Typography } from 'antd'

import { useFilter } from '../../components/FiltesProvider/FiltersProvider'
import type { WidgetProps } from '../../types/Widget'

import styles from './Table.module.css'
import type { Table as WidgetType } from './Table.type'

export type TableWidgetData = WidgetType['spec']['widgetData']

/**
 * Parses a string that may represent a nested path for Ant Design's `dataIndex`.
 *
 * If the input string matches the format of a stringified array of strings
 * (e.g., "['user', 'name', 'first']"), it extracts the individual keys and returns them
 * as an array of strings (e.g., ['user', 'name', 'first']).
 *
 * Otherwise, it returns the original string as-is, assuming it represents a flat key.
 *
 * This is useful when `dataIndex` is dynamically provided as a string,
 * but may refer to a nested field in the data record.
 *
 * @param {string} input - The valueKey string to parse.
 * @returns {string | string[]} - Parsed array of strings if input is an array-like string; otherwise, the original string.
 */
const parseValueKey = (input: string): string | string[] => {
  const arrayFormatRegex = /^\s*\[\s*'([^']+)'\s*(,\s*'([^']+)'\s*)*\]\s*$/

  if (arrayFormatRegex.test(input)) {
    return [...input.matchAll(/'([^']+)'/g)].map(match => match[1])
  }

  return input
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
