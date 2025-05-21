import WidgetRenderer from '../../components/WidgetRenderer'
import type { WidgetProps } from '../../types/Widget'
import { getEndpointUrl } from '../../utils/utils'

import styles from './Row.module.css'
import type { Row as WidgetType } from './Row.type'

export type RowWidgetData = WidgetType['spec']['widgetData']

const Row = ({ resourcesRefs, widgetData }: WidgetProps<RowWidgetData>) => {
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
