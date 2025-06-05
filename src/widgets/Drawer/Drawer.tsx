import { Drawer as AntdDrawer } from 'antd'
import { useEffect, useState } from 'react'

import WidgetRenderer from '../../components/WidgetRenderer'
import styles from './Drawer.module.css'
import { DrawerProvider } from './DrawerContext'

export const openDrawer = (widgetEndpoint: string) => {
  window.dispatchEvent(new CustomEvent('openDrawer', { detail: widgetEndpoint }))
}

export const closeDrawer = () => {
  window.dispatchEvent(new CustomEvent('closeDrawer'))
}

const Drawer = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [widgetEndpoint, setWidgetEndpoint] = useState<string | null>(null)
  const [drawerData, setDrawerData] = useState<{ title?: string; extra?: React.ReactNode }>({})

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
    <AntdDrawer
      extra={drawerData.extra}
      title={drawerData.title}
      rootClassName={styles.drawer}
      size='large'
      onClose={() => setIsOpen(false)}
      open={isOpen}
      key={
        /* This make sure that the content of the drawer is destroyed and recreated when 
        the drawer is closed and reopened, to prevent the form from showing stale data
        */
        isOpen ? 'open' : 'closed'
      }
    >
      <DrawerProvider setDrawerData={setDrawerData}>
        <WidgetRenderer key={'drawer'} widgetEndpoint={widgetEndpoint} />
      </DrawerProvider>
    </AntdDrawer>
  )
}

export default Drawer
