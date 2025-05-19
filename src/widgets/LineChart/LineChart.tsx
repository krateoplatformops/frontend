import { Empty } from 'antd'
import ReactECharts from 'echarts-for-react'

import type { WidgetProps } from '../../types/Widget'
import { getColorCode } from '../../utils/palette'

import styles from './LineChart.module.css'


type ChartLineDataPoint = {
  xAxis: string | number
  yAxis: string | number
}

type ChartLineInput = {
  name: string
  color: 'blue' | 'darkBlue' | 'orange' | 'gray' | 'red' | 'green'
  coords: ChartLineDataPoint[]
}

const LineChart = ({ widgetData }: WidgetProps<{
  lines: ChartLineInput[]
  xAxisName?: string
  yAxisName?: string
}>) => {
  const { lines, xAxisName, yAxisName } = widgetData

  if (!lines) {
    return <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
  }

  const xValues = lines && lines[0] ? lines[0].coords.map((el) => el.xAxis) : []

  const optionLine = {
    grid: {
      bottom: '30%',
      left: '15%',
    },
    legend: {
      bottom: 0,
      data: lines.map((line) => line.name),
    },
    series: lines.map((line) => ({
      color: getColorCode(line.color),
      data: line.coords.map((el) => el.yAxis),
      name: line.name,
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

  return (
    <div className={styles.chart}>
      <ReactECharts option={optionLine} style={{ height: '400px' }} />
    </div>
  )
}

export default LineChart
