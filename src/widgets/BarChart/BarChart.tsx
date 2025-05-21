import { Empty, Progress, Space } from 'antd'

import type { WidgetProps } from '../../types/Widget'
import { getColorCode } from '../../utils/palette'

import styles from './BarChart.module.css'

type ChartMultipleBarsDataType = {
  label: string
  bars: {
    value: string
    percentage: number
    color: 'success' | 'normal' | 'exception' | 'active'
  }[]
}

type ChartMultipleBarsType = {
  data: ChartMultipleBarsDataType[]
}

const BarChart = ({ widgetData }: WidgetProps<ChartMultipleBarsType>) => {
  const { data } = widgetData

  if (!data) {
    return <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
  }

  return (
    <div className={styles.chart}>
      {
        data.map((el, index) => (
          <div className={styles.chartBarsRow} key={`multiplebar_${index}`}>
            <div className={styles.chartBarsData}>
              <div className={styles.chartBarsLabel}>{el.label}</div>
              <Space size='large' >
                {
                  el.bars.map((bar) => <span className={styles.chartBarsValue} style={{ color: getColorCode(bar.color) }}>{bar.value}</span>)
                }
              </Space>
            </div>
            <div className={styles.chartBarsList}>
              {
                el.bars.map((bar, i) => (
                  <Progress
                    className={styles.chartBarsProgress}
                    key={`progess_${i}`}
                    percent={bar.percentage}
                    showInfo={false}
                    size='small'
                    strokeColor={getColorCode(bar.color)}
                  />
                ))
              }
            </div>
          </div>
        ))
      }
    </div>
  )
}

export default BarChart
