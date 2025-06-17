import { Table as AntdTable, Typography } from 'antd'

import { useFilter } from '../../components/FiltesProvider/FiltersProvider'
import type { WidgetProps } from '../../types/Widget'

import styles from './Table.module.css'
import type { Table as WidgetType } from './Table.type'

export type TableWidgetData = WidgetType['spec']['widgetData']

const Table = ({ uid, widgetData }: WidgetProps<TableWidgetData>) => {
  const { columns, data, pageSize, prefix } = widgetData
  const { getFilteredData } = useFilter()

  let dataTable: { [k: string]: unknown }[] = data
  if (prefix && uid && data?.length > 0) {
    // setData(prefix, uid, data || [])
    dataTable = getFilteredData(data, prefix) as { [k: string]: unknown }[]
  }

  return (
    <AntdTable
      columns={columns?.map(({ title, valueKey }, index) => ({
        dataIndex: valueKey,
        key: `${uid}-col-${index}`,
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
