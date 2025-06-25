import { Empty } from 'antd'
import ReactECharts from 'echarts-for-react'

import { useFilter } from '../../components/FiltesProvider/FiltersProvider'
import type { WidgetProps } from '../../types/Widget'
import { getColorCode } from '../../utils/palette'

import type { LineChart as WidgetType } from './LineChart.type'

export type LineChartWidgetData = WidgetType['spec']['widgetData']

const LineChart = ({ uid, widgetData }: WidgetProps<LineChartWidgetData>) => {
  const { lines, prefix, xAxisName, yAxisName } = widgetData
  const { getFilteredData } = useFilter()

  if (!lines) {
    return <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
  }

  const dataChart = [...lines]

  dataChart.forEach((line) => {
    if (prefix && line?.coords && line.coords.length > 0) {
      line.coords = getFilteredData(line.coords, prefix) as { xAxis: string; yAxis: string }[]
    }
  })

  const xValues = dataChart[0]?.coords?.map(({ xAxis }) => xAxis) || []

  const optionLine = {
    grid: {
      bottom: '30%',
      left: '15%',
    },
    legend: {
      bottom: 0,
      data: lines.map(({ name }) => name),
    },
    series: lines.map(({ color, coords, name }) => ({
      color: getColorCode(color),
      data: coords?.map(({ yAxis }) => yAxis) || [],
      name,
      smooth: true,
      type: 'line',
    })),
    xAxis: {
      axisLabel: {
        rotate: 45,
      },
      data: xValues,
      name: xAxisName,
    },
    yAxis: {
      name: yAxisName,
    },
  }

  return <ReactECharts key={uid} option={optionLine} style={{ height: '400px' }} />
}

export default LineChart
