import { CopyOutlined } from '@ant-design/icons'
import { Button, Result } from 'antd'
import { dump } from 'js-yaml'
import { useMemo, useState } from 'react'
import { CopyToClipboard } from 'react-copy-to-clipboard-ts'
import SyntaxHighlighter from 'react-syntax-highlighter'
import lightfair from 'react-syntax-highlighter/dist/esm/styles/hljs/lightfair.js'

import type { WidgetProps } from '../../types/Widget'

import styles from './YamlViewer.module.css'
import type { YamlViewer as WidgetType } from './YamlViewer.type'

export type YamlViewerWidgetData = WidgetType['spec']['widgetData']

const YamlViewer = ({ uid, widgetData }: WidgetProps<YamlViewerWidgetData>) => {
  const { json } = widgetData

  const [isCopied, setIsCopied] = useState(false)

  const { error, yamlString } = useMemo(() => {
    try {
      const parsedJson = JSON.parse(json) as unknown
      return { error: null, yamlString: dump(parsedJson) }
    } catch (error) {
      return {
        error: `Error while parsing JSON data: ${error as string}`,
        yamlString: '',
      }
    }
  }, [json])

  if (error) {
    return (
      <div className={styles.container}>
        <Result status='error' subTitle={error} title={'Error'} />
      </div>
    )
  }

  return (
    <div className={styles.container} key={uid}>
      <div className={styles.button}>
        {isCopied && 'Copied to clipboard'}

        <CopyToClipboard
          onCopy={() => {
            setIsCopied(true)
            setTimeout(() => setIsCopied(false), 2500)
          }}
          text={yamlString}
        >
          <Button icon={<CopyOutlined />} size='large' />
        </CopyToClipboard>
      </div>

      <div className={styles.codeViewer}>
        <SyntaxHighlighter
          language='yaml'
          showLineNumbers
          style={lightfair as { [key: string]: React.CSSProperties }}
          wrapLines
          wrapLongLines
        >
          {yamlString}
        </SyntaxHighlighter>
      </div>
    </div>
  )
}

export default YamlViewer
