import { Table as AntdTable } from 'antd'

import type { WidgetProps } from '../../types/Widget'

/* TODO: generate from schema  */
type TableType = {
  title: string
  pageSize: number
  columns: Array<{
    valueKey: string
    title: string
  }>
  data: unknown[]
}

const Table = ({ widgetData }: WidgetProps<TableType>) => {
  const data = widgetData.data || []

  return (
    <AntdTable
      columns={widgetData.columns.map((column) => ({
        dataIndex: column.valueKey,
        title: column.title,
      }))}
      dataSource={data}
      pagination={data.length > widgetData.pageSize ? { defaultPageSize: widgetData.pageSize } : false}
      scroll={{ x: 'max-content' }}
    />
  )
}

export default Table
