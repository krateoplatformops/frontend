import { Table as AntdTable } from 'antd'

import type { WidgetProps } from '../../types/Widget'

import type { Table as WidgetType } from './Table.type'

export type TableWidgetData = WidgetType['spec']['widgetData']

const Table = ({ widgetData }: WidgetProps<TableWidgetData>) => {
  const { columns, data, pageSize } = widgetData

  return (
    <AntdTable
      columns={columns?.map(({ title, valueKey }) => ({
        dataIndex: valueKey,
        title,
      }))}
      dataSource={data}
      pagination={data && pageSize && data.length > pageSize ? { defaultPageSize: pageSize } : false}
      scroll={{ x: 'max-content' }}
    />
  )
}

export default Table
