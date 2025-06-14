import type { IconProp } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Table as AntdTable, Typography } from 'antd'

import type { WidgetProps } from '../../types/Widget'

import styles from './Table.module.css'
import type { Table as WidgetType } from './Table.type'

export type TableWidgetData = WidgetType['spec']['widgetData']

const Table = ({ uid, widgetData }: WidgetProps<TableWidgetData>) => {
  const { columns, data, pageSize } = widgetData

  return (
    <AntdTable
      columns={columns?.map(({ color, kind, title, valueKey }, index) => ({
        dataIndex: valueKey,
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
      dataSource={data}
      key={uid}
      pagination={data && pageSize && data.length > pageSize ? { defaultPageSize: pageSize } : false}
      scroll={{ x: 'max-content' }}
    />
  )
}

export default Table
