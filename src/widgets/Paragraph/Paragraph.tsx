import { Typography } from 'antd'

import type { WidgetProps } from '../../types/Widget'

import styles from './Paragraph.module.css'
import type { Paragraph as WidgetType } from './Paragraph.type'


type WidgetData = WidgetType['spec']['widgetData']

const Paragraph = ({ widgetData }: WidgetProps<WidgetData>) => {
  const { text } = widgetData

  return (
    <Typography.Paragraph className={styles.paragraph}>
      {text}
    </Typography.Paragraph>
  )
}

export default Paragraph
