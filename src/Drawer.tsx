import { Drawer as AntdDrawer } from 'antd'
import { useEffect, useState } from 'react'

import { WidgetRenderer } from './components/WidgetRenderer'

export function openDrawer(widgetEndpoint: string) {
  window.dispatchEvent(new CustomEvent('openDrawer', { detail: widgetEndpoint }))
}

export function Drawer() {
  const [isOpen, setIsOpen] = useState(false)
  const [widgetEndpoint, setWidgetEndpoint] = useState<string | null>(null)

  useEffect(() => {
    window.addEventListener('openDrawer', (event) => {
      setWidgetEndpoint(event.detail)
      setIsOpen(true)
    })
  }, [])

  if (!widgetEndpoint) {
    return null
  }

  return (
    <AntdDrawer open={isOpen}>
      <WidgetRenderer widgetEndpoint={widgetEndpoint} />
    </AntdDrawer>
  )
}
