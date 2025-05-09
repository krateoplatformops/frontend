import { Result } from 'antd'
import ReactECharts from 'echarts-for-react'

import type { WidgetProps } from '../../types/Widget'
import { getColorCode } from '../../utils/palette'

type DataItem = {
  value: number
  label: string
  color: string
}

type Serie = {
  data: DataItem[]
  total: number
}

const PieChart = ({
  widgetData,
}: WidgetProps<{
  description: string
  series: Serie[] | string
  title: string
}>) => {
  const { description, series, title } = widgetData
  let parsedSeries: Serie[] = []

  if (!series) {
    return <Result status='warning' subTitle='No chart data provided' />
  }

  try {
    parsedSeries = typeof series === 'string' ? (JSON.parse(series) as Serie[]) : series

    if (!Array.isArray(parsedSeries)) {
      parsedSeries = [parsedSeries]
    }
  } catch (error: unknown) {
    return <Result status='warning' subTitle={`Unable to parse chart data: ${error as string}`} />
  }

  const ringWidth = 15 - 2 * (parsedSeries.length - 1)

  const optionPie = {
    series: parsedSeries.map((serie, index) => {
      const filledSum = serie.data.reduce((sum, data) => sum + data.value, 0)
      const remaining = serie.total - filledSum

      return {
        avoidLabelOverlap: false,
        data: [
          ...serie.data.map(el => ({
            itemStyle: { color: getColorCode(el.color) },
            name: el.label,
            value: el.value,
          })),
          {
            emphasis: { disabled: true },
            itemStyle: {
              color: '#E1E3E8',
            },
            name: '',
            tooltip: { show: false },
            value: remaining,
          },
        ],
        itemStyle: {
          borderColor: '#fff',
          borderRadius: 5,
          borderWidth: 2,
        },
        label: {
          formatter: `{b|${title}}\n{c|${description}}`,
          position: 'center',
          rich: {
            b: {
              align: 'center',
              fontSize: 20,
              fontWeight: 'bold',
              lineHeight: 30,
            },
            c: {
              align: 'center',
              color: '#999',
              fontSize: 16,
            },
          },
          show: index === 0,
        },
        labelLine: { show: false },
        radius: [`${100 - ringWidth * (index + 1)}%`, `${100 - ringWidth * index}%`],
        type: 'pie',
      }
    }),
    title: {
      left: 'center',
      subtext: description,
      subtextStyle: {
        align: 'center',
        fontSize: 18,
      },
      text: title,
      textStyle: {
        align: 'center',
        fontSize: 44 - 2 * parsedSeries.length,
        fontWeight: 400,
      },
      top: 'center',
    },
    tooltip: {},
  }

  return <ReactECharts option={optionPie} />
}

export default PieChart
