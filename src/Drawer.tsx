import { Drawer as AntdDrawer } from 'antd'
import { useEffect, useState } from 'react'

import WidgetRenderer from './components/WidgetRenderer'

// TODO: add style
// TODO: create type for Event

export function openDrawer(widgetEndpoint: string) {
  window.dispatchEvent(
    new CustomEvent('openDrawer', { detail: widgetEndpoint }),
  )
}

export function closeDrawer() {
  window.dispatchEvent(new CustomEvent('closeDrawer'))
}

export function Drawer() {
  const [isOpen, setIsOpen] = useState(false)
  const [widgetEndpoint, setWidgetEndpoint] = useState<string | null>(null)

  useEffect(() => {
    const handleOpenDrawer = (event) => {
      setWidgetEndpoint(event.detail)
      setIsOpen(true)
    }
    const handleCloseDrawer = () => {
      setIsOpen(false)
    }

    window.addEventListener('openDrawer', handleOpenDrawer)
    window.addEventListener('closeDrawer', handleCloseDrawer)

    return () => {
      window.removeEventListener('openDrawer', handleOpenDrawer)
      window.removeEventListener('closeDrawer', handleCloseDrawer)
    }
  }, [])

  if (!widgetEndpoint) {
    return null
  }

  return (
    <AntdDrawer onClose={() => setIsOpen(false)} open={isOpen}>
      <WidgetRenderer widgetEndpoint={widgetEndpoint} />
    </AntdDrawer>
  )
}
