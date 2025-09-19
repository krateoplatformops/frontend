import { CopyOutlined } from '@ant-design/icons'
import { Button } from 'antd'
import { useState } from 'react'
import { CopyToClipboard } from 'react-copy-to-clipboard-ts'
import { default as ReactMarkdown } from 'react-markdown'

import type { WidgetProps } from '../../types/Widget'

import styles from './Markdown.module.css'
import type { Markdown as WidgetType } from './Markdown.type'

export type MarkdownWidgetData = WidgetType['spec']['widgetData']

const Markdown = ({ uid, widgetData }: WidgetProps<MarkdownWidgetData>) => {
  const { markdown } = widgetData

  const [isCopied, setIsCopied] = useState(false)

  return (
    <div className={styles.markdown}>
      <div className={styles.buttons}>
        <div className={styles.button}>
          {isCopied && 'Copied to clipboard'}

          <CopyToClipboard
            onCopy={() => {
              setIsCopied(true)
              setTimeout(() => setIsCopied(false), 2500)
            }}
            text={markdown}
          >
            <Button icon={<CopyOutlined />} size='large' />
          </CopyToClipboard>
        </div>
      </div>

      <ReactMarkdown key={uid}>{markdown}</ReactMarkdown>
    </div>
  )
}

export default Markdown
