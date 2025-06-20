import { Result } from 'antd'
import ReactECharts from 'echarts-for-react'

import type { WidgetProps } from '../../types/Widget'
import { getColorCode } from '../../utils/palette'

import type { PieChart as WidgetType } from './PieChart.type'

export type PieChartWidgetData = WidgetType['spec']['widgetData']

const PieChart = ({ uid, widgetData }: WidgetProps<PieChartWidgetData>) => {
  const { description, series, title } = widgetData

  if (!series) {
    return <Result status='warning' subTitle='No chart data available' />
  }

  const { data, total } = series

  const filledValue = data.reduce((sum, item) => sum + (item.value || 0), 0)
  const emptyValue = Math.max(total - filledValue, 0)

  const chartData = [
    ...data.map((item) => ({
      itemStyle: { color: getColorCode(item.color || 'gray') },
      name: item.label ?? '',
      value: item.value ?? 0,
    })),
    {
      emphasis: { disabled: true },
      itemStyle: { color: '#E1E3E8' },
      label: { show: false },
      name: '',
      tooltip: { show: false },
      value: emptyValue,
    },
  ]

  const options = {
    series: [
      {
        avoidLabelOverlap: false,
        data: chartData,
        itemStyle: {
          borderColor: '#fff',
          borderRadius: 6,
          borderWidth: 2,
        },
        label: {
          show: false,
        },
        labelLine: {
          show: false,
        },
        radius: ['65%', '85%'],
        type: 'pie',
      },
    ],
    title: {
      left: '49.5%',
      subtext: description,
      subtextStyle: {
        fontSize: 18,
      },
      subtextVerticalAlign: 'auto',
      text: title,
      textAlign: 'center',
      textStyle: {
        fontSize: 44 - (2 * (data.length || 0)),
        fontWeight: 400,
      },
      textVerticalAlign: 'auto',
      top: '35%',
    },
    tooltip: {
      confine: 'true',
      trigger: 'item',
    },
  }

  return <ReactECharts key={uid} option={options} />
}

export default PieChart
