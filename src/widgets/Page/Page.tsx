import WidgetRenderer from '../../components/WidgetRenderer'
import type { WidgetProps } from '../../types/Widget'
import { getEndpointUrl } from '../../utils/utils'

import styles from './Page.module.css'
import type { Page as WidgetType } from './Page.type'

export type PageWidgetData = WidgetType['spec']['widgetData']

export function Page({ resourcesRefs, uid, widgetData }: WidgetProps<PageWidgetData>) {
  const { items, title } = widgetData

  return (
    <>
      {/* https://react.dev/reference/react-dom/components/title */}
      {title && <title>{title}</title>}
      <div className={styles.page} key={uid}>
        {items.map(({ resourceRefId }, index) => (
          <WidgetRenderer key={`${uid}-${index}`} widgetEndpoint={getEndpointUrl(resourceRefId, resourcesRefs)} />
        ))}
      </div>
    </>
  )
}
