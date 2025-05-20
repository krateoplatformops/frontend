import { Typography } from 'antd'

import type { WidgetProps } from '../../types/Widget'
import type { Paragraph as WidgetType } from './Paragraph.type'

import styles from './Paragraph.module.css'

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
