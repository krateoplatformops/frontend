import type { WidgetItems, WidgetProps } from '../../types/Widget'

/* TODO: generate from schema  */
type PieChartType = {
  title: string
  items: WidgetItems
}

const PieChart = ({ widgetData, backendEndpoints }: WidgetProps<PieChartType>) => {
  return (
    <div>
      <h1>PieChart</h1>
      <pre>{JSON.stringify(widgetData, null, 2)}</pre>
      <pre>{JSON.stringify(backendEndpoints, null, 2)}</pre>
    </div>
  )
}

export default PieChart
