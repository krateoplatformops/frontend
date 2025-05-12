import { WidgetRenderer } from '../../components/WidgetRenderer'
import type { WidgetProps } from '../../types/Widget'
import { getEndpointUrl } from '../../utils/utils'

import styles from './Row.module.css'

const Row = ({
  widgetData,
  resourcesRefs,
}: WidgetProps<{
  items: Array<{
    resourceRefId: string
  }>
}>) => {
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
