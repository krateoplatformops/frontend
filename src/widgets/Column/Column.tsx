import WidgetRenderer from '../../components/WidgetRenderer'
import { getEndpointUrl } from '../../utils/utils'

import type { WidgetProps } from '../../types/Widget'
import type { Column as WidgetType } from './Column.type'

import styles from './Column.module.css'

type WidgetData = WidgetType['spec']['widgetData']

const Column = ({ widgetData, resourcesRefs }: WidgetProps<WidgetData>) => {
  const { items } = widgetData

  return (
    <div className={styles.column}>
      {items.map(({ resourceRefId }) => <WidgetRenderer widgetEndpoint={getEndpointUrl(resourceRefId, resourcesRefs)} />)}
    </div>
  )
}

export default Column
