import { Table as AntdTable, Typography } from 'antd'

import type { WidgetProps } from '../../types/Widget'

import styles from './Table.module.css'
import type { Table as WidgetType } from './Table.type'

export type TableWidgetData = WidgetType['spec']['widgetData']

const Table = ({ uid, widgetData }: WidgetProps<TableWidgetData>) => {
  const { columns, data, pageSize } = widgetData

  return (
    <AntdTable
      columns={columns?.map(({ title, valueKey }) => ({
        dataIndex: valueKey,
        title: (
          <div className={styles.headerEllipsis}>
            <Typography.Text ellipsis={{ tooltip: true }}>
              {title}
            </Typography.Text>
          </div>
        ),
      }))}
      dataSource={data}
      key={uid}
      pagination={data && pageSize && data.length > pageSize ? { defaultPageSize: pageSize } : false}
      scroll={{ x: 'max-content' }}
    />
  )
}

export default Table
