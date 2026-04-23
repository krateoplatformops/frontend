import { Empty } from 'antd'
import ReactECharts from 'echarts-for-react'

import { getCssVar } from '../../hooks/useAppTheme'
import { getColorCode } from '../../theme/palette'
import type { WidgetProps } from '../../types/Widget'

import styles from './LineChart.module.css'
import type { LineChart as WidgetType } from './LineChart.type'

export type LineChartWidgetData = WidgetType['spec']['widgetData']

const LineChart = ({ uid, widgetData }: WidgetProps<LineChartWidgetData>) => {
  const { lines, xAxisName, yAxisName } = widgetData

  if (!lines.length) {
    return <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
  }

  const dataChart = [...lines]

  const xValues = dataChart[0]?.coords?.map(({ xAxis }) => xAxis) || []

  const textColor = getCssVar('--text-color')

  const optionLine = {
    grid: {
      bottom: 130,
      left: '15%',
    },
    legend: {
      bottom: 0,
      data: lines.map(({ name }) => name),
      padding: [10, 0, 0, 0],
      textStyle: {
        color: textColor,
      },
      type: 'scroll',
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
        color: textColor,
        rotate: 45,
      },
      data: xValues,
      name: xAxisName,
      nameTextStyle: {
        color: textColor,
      },
    },
    yAxis: {
      axisLabel: {
        color: textColor,
      },
      name: yAxisName,
      nameTextStyle: {
        color: textColor,
      },
    },
  }

  return (
    <div className={styles.lineChart}>
      <ReactECharts key={uid} option={optionLine} />
    </div>
  )
}

export default LineChart
