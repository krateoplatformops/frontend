import WidgetRenderer from '../../components/WidgetRenderer'
import type { WidgetProps } from '../../types/Widget'
import { getEndpointUrl } from '../../utils/utils'

import styles from './Column.module.css'

const Column = ({
  widgetData,
  resourcesRefs,
}: WidgetProps<{
  items: Array<{
    resourceRefId: string
  }>
}>) => {
  const { items } = widgetData

  return (
    <div className={styles.column}>
      {items.map(({ resourceRefId }) => <WidgetRenderer widgetEndpoint={getEndpointUrl(resourceRefId, resourcesRefs)} />)}
    </div>
  )
}

export default Column
