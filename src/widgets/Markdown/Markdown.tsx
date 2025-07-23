import { default as ReactMarkdown } from 'react-markdown'

import type { WidgetProps } from '../../types/Widget'

import type { Markdown as WidgetType } from './Markdown.type'

export type MarkdownWidgetData = WidgetType['spec']['widgetData']

const Markdown = ({ uid, widgetData }: WidgetProps<MarkdownWidgetData>) => {
  const { markdown } = widgetData

  return <ReactMarkdown key={uid}>{markdown}</ReactMarkdown>
}

export default Markdown
