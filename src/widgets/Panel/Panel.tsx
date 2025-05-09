import { Card as AntdCard } from 'antd'

import { WidgetRenderer } from '../../components/WidgetRenderer'
import type { WidgetItems, WidgetProps } from '../../types/Widget'
import { getEndpointUrl } from '../../utils/utils'

import styles from './Panel.module.css'

const Panel = ({ widgetData, resourcesRefs }: WidgetProps<{title: string; items: WidgetItems}>) => {
  return (
    <AntdCard
      className={styles.panel}
      classNames={{ header: styles.header, title: styles.title }}
      title={widgetData.title}
      variant={'borderless'}
    >
      {widgetData.items.map((item) => (
        <WidgetRenderer widgetEndpoint={getEndpointUrl(item.resourceRefId, resourcesRefs)} />
      ))}
    </AntdCard>
  )
}

export default Panel
