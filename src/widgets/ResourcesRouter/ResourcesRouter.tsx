import WidgetRenderer from '../../components/WidgetRenderer'
import type { WidgetProps } from '../../types/Widget'

import type { ResourcesRouter as WidgetType } from './ResourcesRouter.type'

export type ResourcesRouterWidgetData = WidgetType['spec']['widgetData']

export function ResourcesRouter({ resourcesRefs }: WidgetProps<ResourcesRouterWidgetData>) {
  return (
    <>
      {resourcesRefs.map(({ id, path }, index) => (
        <WidgetRenderer invisible={true} key={`${id}-${index}`} widgetEndpoint={path} />
      ))}
    </>
  )
}
