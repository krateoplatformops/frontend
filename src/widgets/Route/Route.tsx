
import { WidgetRenderer } from '../../components/WidgetRenderer'
import type { WidgetProps } from '../../types/Widget'
import { getEndpointUrl } from '../../utils/utils'

import styles from './Route.module.css'

export function Route(props: WidgetProps<{ items: { resourceRefId: string }[] }>) {
  const { widgetData, resourcesRefs } = props

  return (
    <div className={styles.route}>
      {widgetData.items.map((item) => {
        return <WidgetRenderer widgetEndpoint={getEndpointUrl(item.resourceRefId, resourcesRefs)} />
      })}
    </div>
  )
}
