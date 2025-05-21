import WidgetRenderer from '../../components/WidgetRenderer'
import type { WidgetProps } from '../../types/Widget'
import { getEndpointUrl } from '../../utils/utils'

import styles from './Route.module.css'
import type { Route as WidgetType } from './Route.type'

export type RouteWidgetData = WidgetType['spec']['widgetData']

export function Route({ resourcesRefs, widgetData }: WidgetProps<RouteWidgetData>) {
  const { items } = widgetData

  return (
    <div className={styles.route}>
      {items.map(({ resourceRefId }) => {
        return <WidgetRenderer widgetEndpoint={getEndpointUrl(resourceRefId, resourcesRefs)} />
      })}
    </div>
  )
}
