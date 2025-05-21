import type { TableProps } from 'antd'
import { Table as AntdTable } from 'antd'

import type { WidgetProps } from '../../types/Widget'

import type { Table as WidgetType } from './Table.type'

type WidgetData = WidgetType['spec']['widgetData']

const Table = ({ widgetData }: WidgetProps<WidgetData>) => {
  const { columns, data, pageSize } = widgetData

  let dataSource: TableProps['dataSource'] = []
  try {
    if (data) {
      dataSource = JSON.parse(data) as TableProps['dataSource']
    }
  } catch (error) {
    console.error('Error while parsing Table data', error)
  }

  return (
    <AntdTable
      columns={columns?.map(({ title, valueKey }) => ({
        dataIndex: valueKey,
        title,
      }))}
      dataSource={dataSource}
      pagination={dataSource && pageSize && dataSource.length > pageSize ? { defaultPageSize: pageSize } : false}
      scroll={{ x: 'max-content' }}
    />
  )
}

export default Table
