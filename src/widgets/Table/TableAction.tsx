import type { Table as WidgetType } from './Table.type'

export type TableWidgetData = WidgetType['spec']['widgetData']

type TableActionType = {
  row: TableWidgetData['data'][number]
  tableActions: TableWidgetData['tableActions']
}

const TableAction = ({ row, tableActions }: TableActionType) => {
  return (<></>)
}

export default TableAction
