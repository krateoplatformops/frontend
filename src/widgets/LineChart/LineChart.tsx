import { Empty } from 'antd'
import ReactECharts from 'echarts-for-react'

import type { WidgetProps } from '../../types/Widget'
import { getColorCode } from '../../utils/palette'

import type { LineChart as WidgetType } from './LineChart.type'

export type LineChartWidgetData = WidgetType['spec']['widgetData']

const LineChart = ({ widgetData }: WidgetProps<LineChartWidgetData>) => {
  const { lines, xAxisName, yAxisName } = widgetData

  if (!lines) {
    return <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
  }

  const xValues = lines[0]?.coords?.map(({ xAxis }) => xAxis) || []

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

  return <ReactECharts option={optionLine} style={{ height: '400px' }} />
}

export default LineChart
