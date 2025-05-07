import { useQuery } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'

import { useConfigContext } from '../context/ConfigContext'
import type { ButtonSchema } from '../types/Button.schema'
import type { Widget } from '../types/Widget'
import Button from '../widgets/Button'
import { Column } from '../widgets/Column'
import { NavMenu } from '../widgets/NavMenu/NavMenu'
import Panel from '../widgets/Panel/Panel'
import PieChart from '../widgets/PieChart/PieChart'
import { Route } from '../widgets/Route/Route'
import Table from '../widgets/Table/Table'

// TODO: BACKENDENDPOINTS AND WIDGETDATA SHOULD COME FROM STATUS NOT FROM SPEC!!!
function parseData(widget: Widget, widgetEndpoint: string) {
  switch (widget.kind) {
    case 'Status':
      return (
        <div>
          ERROR
          <pre style={{ whiteSpace: 'wrap' }}>{JSON.stringify(widget, null, 2)}</pre>
          <pre style={{ whiteSpace: 'wrap' }}>{widgetEndpoint}</pre>
        </div>
      )
    case 'Button':
    case 'ButtonWithAction':
      return (
        <Button
          actions={widget.spec.actions}
          backendEndpoints={widget.status.backendEndpoints}
          widgetData={widget.status.widgetData as ButtonSchema['status']['widgetData']}
        />
      )
    case 'Panel':
      return <Panel backendEndpoints={widget.spec.backendEndpoints} widgetData={widget.spec.widgetData} />
    case 'Column':
      return <Column backendEndpoints={widget.status.backendEndpoints} widgetData={widget.status.widgetData} />
    case 'PieChart':
      return <PieChart backendEndpoints={widget.spec.backendEndpoints} widgetData={widget.spec.widgetData} />
    case 'Table':
      return <Table backendEndpoints={widget.spec.backendEndpoints} widgetData={widget.spec.widgetData} />
    case 'NavMenu':
      return <NavMenu backendEndpoints={widget.spec.backendEndpoints} widgetData={widget.spec.widgetData} />
    case 'Route':
      return <Route backendEndpoints={widget.spec.backendEndpoints} widgetData={widget.spec.widgetData} />
    default:
      throw new Error(`Unknown widget kind: ${widget.kind}`)
  }
}

export function WidgetRenderer({ widgetEndpoint }: { widgetEndpoint: string }) {
  if (!widgetEndpoint?.includes('widgets.templates.krateo.io')) {
    console.warn(
      `WidgetRenderer received widgetEndpoint=${widgetEndpoint}, which is probably invalid an url is expected`,
    )
  }

  const { config } = useConfigContext()
  const widgetFullUrl = `${config!.api.BACKEND_API_BASE_URL}${widgetEndpoint}`

  const {
    data: widget,
    isLoading,
    error,
  } = useQuery({
    queryFn: async () => {
      const res = await fetch(widgetFullUrl, {
        headers: {
          'X-Krateo-Groups': 'admins',
          'X-Krateo-User': 'admin',
        },
      })

      const widget = (await res.json()) as Widget
      return widget
    },
    queryKey: ['widgets', widgetFullUrl],
  })

  if (isLoading) {
    return <div>...loading</div>
  }

  if (!widget) {
    /* no data */
    return null
  }
  if (error) {
    console.error(error)
    return <div>...error</div>
  }

  return parseData(widget, widgetEndpoint)
}
