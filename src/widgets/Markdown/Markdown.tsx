import { default as ReactMarkdown } from 'react-markdown'

import type { WidgetProps } from '../../types/Widget'

import styles from './Markdown.module.css'
import type { Markdown as WidgetType } from './Markdown.type'

export type MarkdownWidgetData = WidgetType['spec']['widgetData']

const Markdown = ({ uid, widgetData }: WidgetProps<MarkdownWidgetData>) => {
  const { markdown } = widgetData

  return (
    <div className={styles.markdown}>
      <ReactMarkdown key={uid}>{markdown}</ReactMarkdown>
    </div>
  )
}

export default Markdown
