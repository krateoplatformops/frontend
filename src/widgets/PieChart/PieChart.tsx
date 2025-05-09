import type { WidgetItems, WidgetProps } from '../../types/Widget';

const PieChart = ({ widgetData, resourcesRefs }: WidgetProps<{title: string; items: WidgetItems}>) => {
  return (
    <div>
      <h1>PieChart</h1>
      <pre>{JSON.stringify(widgetData, null, 2)}</pre>
      <pre>{JSON.stringify(resourcesRefs, null, 2)}</pre>
    </div>
  )
}

export default PieChart
