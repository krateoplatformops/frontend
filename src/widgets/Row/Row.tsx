import WidgetRenderer from '../../components/WidgetRenderer'
import { getEndpointUrl } from '../../utils/utils'

import type { WidgetProps } from '../../types/Widget'
import type { Row as WidgetType } from './Row.type'

import styles from './Row.module.css'

type WidgetData = WidgetType['spec']['widgetData']

const Row = ({ widgetData, resourcesRefs }: WidgetProps<WidgetData>) => {
  const { items } = widgetData

  return (
    <div className={styles.row}>
      {items.map(({ resourceRefId }) => (
        <div className={styles.item}>
          <WidgetRenderer widgetEndpoint={getEndpointUrl(resourceRefId, resourcesRefs)} />
        </div>
      ))}
    </div>
  )
}

export default Row
