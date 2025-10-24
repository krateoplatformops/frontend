import { Empty } from 'antd'
import ReactECharts from 'echarts-for-react'
import { useEffect, useRef, useState } from 'react'

import { getColorCode } from '../../theme/palette'
import type { WidgetProps } from '../../types/Widget'

import type { PieChart as WidgetType } from './PieChart.type'

export type PieChartWidgetData = WidgetType['spec']['widgetData']

const PieChart = ({ uid, widgetData }: WidgetProps<PieChartWidgetData>) => {
  const { description, series, title } = widgetData
  const chartRef = useRef<HTMLDivElement>(null)
  const [fontSizes, setFontSizes] = useState({ sub: 16, title: 24 })
  const [titleOffsetTop, setTitleOffsetTop] = useState('50%')

  useEffect(() => {
    const updateFontSizes = () => {
      if (!chartRef.current || !series) { return }
      const { clientHeight: height, clientWidth: width } = chartRef.current

      // Calcolo del raggio interno della torta
      const radius = Math.min(width, height) / 2
      const innerRadiusPx = (65 / 100) * radius
      const padding = 0.8

      // Spazio disponibile per blocco titolo+sottotitolo
      const availableHeight = innerRadiusPx * 2 * padding
      const availableWidth = innerRadiusPx * 2 * 0.9

      // Font stimati proporzionali all’altezza
      let titleFont = availableHeight * 0.6
      let subFont = availableHeight * 0.35

      // Limit font massimo in base alla larghezza
      titleFont = Math.min(titleFont, availableWidth / (title.length * 0.6))
      if (description) {
        subFont = Math.min(subFont, availableWidth / (description.length * 0.6))
      }

      // Calcolo offset verticale per centrare il blocco (title + gap + subtitle)
      const gap = subFont * 0.5
      const blockHeight = titleFont + (description ? gap + subFont : 0)
      const offset = 50 - (blockHeight / 2 / height) * 100
      setTitleOffsetTop(`${offset}%`)

      setFontSizes({ sub: subFont, title: titleFont })
    }

    updateFontSizes()
    window.addEventListener('resize', updateFontSizes)
    return () => window.removeEventListener('resize', updateFontSizes)
  }, [series, title, description])

  if (!series) {
    return <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
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
        label: { show: false },
        labelLine: { show: false },
        radius: ['65%', '85%'],
        type: 'pie',
      },
    ],
    title: {
      left: '50%',
      subtext: description,
      subtextStyle: {
        color: '#666',
        fontSize: fontSizes.sub,
      },
      text: title,
      textAlign: 'center',
      textStyle: {
        fontSize: fontSizes.title,
        fontWeight: 500,
        lineHeight: 1.2,
      },
      textVerticalAlign: 'middle',
      top: titleOffsetTop,
    },
    tooltip: {
      confine: true,
      trigger: 'item',
    },
  }

  return (
    <div ref={chartRef} style={{ height: '400px', width: '100%' }}>
      <ReactECharts key={uid} option={options} style={{ height: '100%' }} />
    </div>
  )
}

export default PieChart
