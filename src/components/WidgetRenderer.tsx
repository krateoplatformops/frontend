import { useQuery } from '@tanstack/react-query'
import { useEffect, useState } from 'react'

import { useConfigContext } from '../context/ConfigContext'
import type { ButtonSchema } from '../types/Button.schema'
import type { Widget } from '../types/Widget'
import Button from '../widgets/Button'

import { Column } from './Column'

function parseData(widget: Widget) {
  switch (widget.kind) {
    case 'Button':
    case 'ButtonWithAction':
      return (
        <Button
          actions={widget.spec.actions}
          backendEndpoints={widget.status.backendEndpoints}
          widgetData={widget.status.widgetData as ButtonSchema['status']['widgetData']}
        />
      )
    case 'Column':
      return <Column backendEndpoints={widget.status.backendEndpoints} widgetData={widget.status.widgetData} />
    default:
      throw new Error(`Unknown widget kind: ${widget.kind}`)
  }
}

export function WidgetRenderer({ widgetEndpoint }: { widgetEndpoint: string }) {
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

  return parseData(widget)
}
