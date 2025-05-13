import { useId } from 'react'

import { WidgetRenderer } from '../../components/WidgetRenderer'
import type { WidgetProps } from '../../types/Widget'
import { getEndpointUrl } from '../../utils/utils'

import styles from './Route.module.css'

export function Route(
  props: WidgetProps<{ items: { resourceRefId: string }[] }>,
) {
  const { widgetData, resourcesRefs } = props

  console.log('items', widgetData.items)
  return (
    <div className={styles.route}>
      <div>items: {widgetData.items.length}</div>
      {widgetData.items.map((item) => {
        const widgetEndpoint = getEndpointUrl(item.resourceRefId, resourcesRefs)
        return (
          <WidgetRenderer
            extra={Date.now() + Math.random()}
            key={widgetEndpoint}
            widgetEndpoint={widgetEndpoint}
          />
        )
      })}
    </div>
  )
}
