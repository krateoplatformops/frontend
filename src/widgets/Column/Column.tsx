import WidgetRenderer from '../../components/WidgetRenderer'
import type { WidgetProps } from '../../types/Widget'
import { getEndpointUrl } from '../../utils/utils'

import styles from './Column.module.css'
import type { Column as WidgetType } from './Column.type'

type WidgetData = WidgetType['spec']['widgetData']

const Column = ({ resourcesRefs, widgetData }: WidgetProps<WidgetData>) => {
  const { items } = widgetData

  return (
    <div className={styles.column}>
      {items.map(({ resourceRefId }) => <WidgetRenderer widgetEndpoint={getEndpointUrl(resourceRefId, resourcesRefs)} />)}
    </div>
  )
}

export default Column
