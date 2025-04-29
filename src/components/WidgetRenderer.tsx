import { useEffect, useState } from 'react'

import { useConfigContext } from '../context/ConfigContext'
import type { Widget } from '../types/Widget'
import Button from '../widgets/Button'

function parseData(widget: Widget) {
  switch (widget.kind) {
    case 'Button':
    case 'ButtonWithAction':
      return (
        <Button
          actions={widget.spec.actions}
          backendEndpoints={widget.spec.backendEndpoints}
          widgetData={widget.status.widgetData}
        />
      )
    default:
      throw new Error(`Unknown widget kind: ${widget.kind}`)
  }
}

export function WidgetRenderer({ widgetEndpoint }: { widgetEndpoint: string }) {
  const [widget, setWidget] = useState<Widget | null>(null)
  const { config } = useConfigContext()
  const widgetFullUrl = `${config!.api.BACKEND_API_BASE_URL}/${widgetEndpoint}`

  useEffect(() => {
    const getComponent = async () => {
      const res = await fetch(widgetFullUrl, {
        headers: {
          'X-Krateo-Groups': 'admins',
          'X-Krateo-User': 'admin',
        },
      })
      const widget = await res.json()
      setWidget(widget)
    }

    getComponent().catch((error) => {
      console.error('Error fetching component:', error)
    })
  }, [widgetEndpoint, widgetFullUrl])

  if (!widget) {
    return <div>...loading</div>
  }

  return parseData(widget)
}
