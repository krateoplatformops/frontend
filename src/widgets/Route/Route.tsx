
import WidgetRenderer from '../../components/WidgetRenderer'
import { getEndpointUrl } from '../../utils/utils'

import type { WidgetProps } from '../../types/Widget'
import type { Route as WidgetType } from './Route.type'

import styles from './Route.module.css'

type WidgetData = WidgetType['spec']['widgetData']

export function Route({ widgetData, resourcesRefs }: WidgetProps<WidgetData>) {
  const { items } = widgetData

  return (
    <div className={styles.route}>
      {items.map(({ resourceRefId }) => {
        return <WidgetRenderer widgetEndpoint={getEndpointUrl(resourceRefId, resourcesRefs)} />
      })}
    </div>
  )
}
