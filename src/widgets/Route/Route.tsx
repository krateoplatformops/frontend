
import WidgetRenderer from '../../components/WidgetRenderer'
import type { WidgetProps } from '../../types/Widget'
import { getEndpointUrl } from '../../utils/utils'

import styles from './Route.module.css'

export function Route({ widgetData, resourcesRefs }: WidgetProps<{ items: { resourceRefId: string }[] }>) {
  const { items } = widgetData

  return (
    <div className={styles.route}>
      {items.map(({ resourceRefId }) => {
        return <WidgetRenderer widgetEndpoint={getEndpointUrl(resourceRefId, resourcesRefs)} />
      })}
    </div>
  )
}
