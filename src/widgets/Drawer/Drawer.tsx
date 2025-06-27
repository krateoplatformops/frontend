import { Drawer as AntdDrawer } from 'antd'
import { useEffect, useState } from 'react'

import WidgetRenderer from '../../components/WidgetRenderer'

import styles from './Drawer.module.css'
import type { DrawerData } from './DrawerContext'
import { DrawerProvider } from './DrawerContext'

interface DrawerProps {
  widgetEndpoint: string
  size?: 'default' | 'large' | undefined
  title?: string | undefined
}

export const openDrawer = (properties: DrawerProps) => {
  window.dispatchEvent(new CustomEvent('openDrawer', { detail: properties }))
}

export const closeDrawer = () => {
  window.dispatchEvent(new CustomEvent('closeDrawer'))
}

const Drawer = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [properties, setProperties] = useState<DrawerProps | null>(null)
  const [drawerData, setDrawerData] = useState<DrawerData>({})

  useEffect(() => {
    const handleOpenDrawer = (event: CustomEvent<DrawerProps>) => {
      setProperties(event.detail)
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

  if (!properties) {
    return null
  }

  const { size, title, widgetEndpoint } = properties

  return (
    <AntdDrawer
      destroyOnHidden
      extra={drawerData.extra ? <fieldset disabled={drawerData.fieldSetDisabled}>{drawerData.extra}</fieldset> : undefined}
      key={
        /* This make sure that the content of the drawer is destroyed and recreated when
        the drawer is closed and reopened, to prevent the form from showing stale data
        */
        isOpen ? 'open' : 'closed'
      }
      onClose={() => {
        setIsOpen(false)
        setDrawerData({})
      }}
      open={isOpen}
      rootClassName={styles.drawer}
      size={size || 'default'}
      title={drawerData.title || title}
    >
      <DrawerProvider setDrawerData={setDrawerData}>
        <WidgetRenderer key={'drawer'} widgetEndpoint={widgetEndpoint} />
      </DrawerProvider>
    </AntdDrawer>
  )
}

export default Drawer
