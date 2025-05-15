import { Typography } from 'antd'

import type { WidgetProps } from '../../types/Widget'

import styles from './Paragraph.module.css'

const Paragraph = ({ widgetData }: WidgetProps<{ text: string }>) => {
  const { text } = widgetData

  return (
    <Typography.Paragraph className={styles.paragraph}>
      {text}
    </Typography.Paragraph>
  )
}

export default Paragraph
