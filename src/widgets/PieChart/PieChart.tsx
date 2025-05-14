
import { Result } from 'antd'
import ReactECharts from 'echarts-for-react'

import { getColorCode } from '../../utils/palette'

type DataPoint = {
  color?: 'blue' | 'darkBlue' | 'orange' | 'gray' | 'red' | 'green'
  value?: number
  label?: string
}

type Series = {
  total?: number
  data?: DataPoint[]
}

type PieChartProps = {
  widgetData: {
    title: string
    description: string
    series: Series
  }
}

const PieChart = ({ widgetData }: PieChartProps) => {
  const { title, description, series } = widgetData

  if (!series?.data || !Array.isArray(series.data)) {
    return <Result status='warning' subTitle='No chart data available' />
  }

  const total = series.total ?? series.data.reduce((sum, item) => sum + (item.value || 0), 0)
  const filledValue = series.data.reduce((sum, item) => sum + (item.value || 0), 0)
  const emptyValue = Math.max(total - filledValue, 0)

  const chartData = [
    ...series.data.map((item) => ({
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
        fontSize: 44 - (2 * (series.data.length || 0)),
        fontWeight: 400,
      },
      textVerticalAlign: 'auto',
      top: '35%',
    },
    tooltip: {
      trigger: 'item',
    },
  }

  return <ReactECharts option={options} />
}

export default PieChart
