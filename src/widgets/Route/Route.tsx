import { useEffect } from 'react'

import { createRoute, useRoutesContext } from '../../context/RoutesContext'
import type { WidgetProps } from '../../types/Widget'
import { getEndpointUrl } from '../../utils/utils'

import type { Route as WidgetType } from './Route.type'

export type RouteWidgetData = WidgetType['spec']['widgetData']

export function Route({ resourcesRefs, widgetData }: WidgetProps<RouteWidgetData>) {
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
