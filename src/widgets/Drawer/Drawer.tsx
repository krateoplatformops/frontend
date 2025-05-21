import { Drawer as AntdDrawer } from 'antd'
import { useEffect, useState } from 'react'

import WidgetRenderer from '../../components/WidgetRenderer'

export const openDrawer = (widgetEndpoint: string) => {
  window.dispatchEvent(
    new CustomEvent('openDrawer', { detail: widgetEndpoint }),
  )
}

export const closeDrawer = () => {
  window.dispatchEvent(new CustomEvent('closeDrawer'))
}

const Drawer = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [widgetEndpoint, setWidgetEndpoint] = useState<string | null>(null)

  useEffect(() => {
    const handleOpenDrawer = (event: CustomEvent<string>) => {
      setWidgetEndpoint(event.detail)
      setIsOpen(true)
    }
    const handleCloseDrawer = () => {
      setIsOpen(false)
    }

    window.addEventListener('openDrawer', handleOpenDrawer as EventListener)
    window.addEventListener('closeDrawer', handleCloseDrawer)

    return () => {
      window.removeEventListener('openDrawer', handleOpenDrawer as EventListener)
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

export default Drawer
