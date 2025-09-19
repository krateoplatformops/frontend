import { CopyOutlined, DownloadOutlined } from '@ant-design/icons'
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

  const handleDownload = () => {
    const blob = new Blob([markdown], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const file = document.createElement('a')
    file.href = url
    file.download = `file.${fileExtension}`
    file.click()
    URL.revokeObjectURL(url)
  }

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

        <div className={styles.button}>
          <Button icon={<DownloadOutlined />} onClick={handleDownload} size='large' />
        </div>
      </div>

      <ReactMarkdown key={uid}>{markdown}</ReactMarkdown>
    </div>
  )
}

export default Markdown
