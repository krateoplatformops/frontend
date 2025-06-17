import { useEffect } from 'react'

import { createRoute, useRoutesContext } from '../../context/RoutesContext'
import type { WidgetProps } from '../../types/Widget'
import { getEndpointUrl } from '../../utils/utils'

import type { ResourceRoute as WidgetType } from './ResourceRoute.type'

export type ResourceRouteWidgetData = WidgetType['spec']['widgetData']

export function ResourceRoute({ resourcesRefs, widgetData }: WidgetProps<ResourceRouteWidgetData>) {
  const { registerRoutes } = useRoutesContext()

  useEffect(() => {
    registerRoutes([
      createRoute({
        endpoint: getEndpointUrl(widgetData.resourceRefId, resourcesRefs),
        path: widgetData.path,
      }),
    ])
  }, [registerRoutes, resourcesRefs, widgetData.path, widgetData.resourceRefId])
  return null
}
