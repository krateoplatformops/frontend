import { Col as AntdColumn, Row as AntdRow } from 'antd'

import WidgetRenderer from '../../components/WidgetRenderer'
import type { WidgetProps } from '../../types/Widget'
import { getEndpointUrl } from '../../utils/utils'

import styles from './Row.module.css'
import type { Row as WidgetType } from './Row.type'

export type RowWidgetData = WidgetType['spec']['widgetData']

const Row = ({ resourcesRefs, uid, widgetData }: WidgetProps<RowWidgetData>) => {
  const { items } = widgetData

  const defaultSize = Math.floor(24 / items.length) || 24

  return (
    <AntdRow align={'middle'} gutter={{ lg: 32, md: 24, sm: 16, xs: 8 }} justify={'center'} key={uid} wrap>
      {items.map(({ resourceRefId, size }, index) => (
        <AntdColumn className={styles.column} key={`${uid}-col-${index}`} span={size ?? defaultSize}>
          <WidgetRenderer key={`${uid}-${index}`} widgetEndpoint={getEndpointUrl(resourceRefId, resourcesRefs)} />
        </AntdColumn>
      ))}
    </AntdRow>
  )
}

export default Row
