import { useEffect, useMemo } from 'react'

import WidgetRenderer from '../../components/WidgetRenderer'
import { createRoute, useRoutesContext } from '../../context/RoutesContext'
import type { WidgetProps } from '../../types/Widget'

import type { RoutesLoader as WidgetType } from './RoutesLoader.type'

export type RoutesLoaderWidgetData = WidgetType['spec']['widgetData']

export function RoutesLoader({ resourcesRefs, widgetData }: WidgetProps<RoutesLoaderWidgetData>) {
  const { registerRoutes } = useRoutesContext()
  const inlineRoutes = useMemo(() => widgetData?.routes ?? [], [widgetData])
  const inlineIds = useMemo(() => new Set(inlineRoutes.map(({ id }) => id)), [inlineRoutes])

  // register all inline routes in one call, so the router is rebuilt once
  useEffect(() => {
    const routes = inlineRoutes.flatMap(({ id, path }) => {
      const endpoint = resourcesRefs.items.find((item) => item.id === id)?.path
      return endpoint ? [createRoute({ endpoint, path })] : []
    })

    if (routes.length > 0) {
      registerRoutes(routes)
    }
  }, [registerRoutes, resourcesRefs, inlineRoutes])

  return (
    <>
      {resourcesRefs.items
        .filter(({ id }) => !inlineIds.has(id))
        .map(({ id, path }, index) => (
          <WidgetRenderer invisible={true} key={`${id}-${index}`} widgetEndpoint={path} />
        ))}
    </>
  )
}
