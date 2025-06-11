import WidgetRenderer from '../../components/WidgetRenderer'
import type { WidgetProps } from '../../types/Widget'
import { getEndpointUrl } from '../../utils/utils'

import styles from './Route.module.css'
import type { Route as WidgetType } from './Route.type'

export type RouteWidgetData = WidgetType['spec']['widgetData']

export function Route({ resourcesRefs, uid, widgetData }: WidgetProps<RouteWidgetData>) {
  const { items } = widgetData

  return (
    <div className={styles.route} key={uid}>
      {items.map(({ resourceRefId }, index) => (
        <WidgetRenderer key={`${uid}-${index}`} widgetEndpoint={getEndpointUrl(resourceRefId, resourcesRefs)} />
      ))}
    </div>
  )
}
