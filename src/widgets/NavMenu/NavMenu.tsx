
import type { IconProp } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Menu } from 'antd'
import type { MenuItemType } from 'antd/es/menu/interface'
import { useCallback, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router'

import type { WidgetProps } from '../../types/Widget'
import { getEndpointUrl } from '../../utils/utils'


import styles from './NavMenu.module.css'
import type { NavMenu as WidgetType } from './NavMenu.type'


type WidgetData = WidgetType['spec']['widgetData']

export function NavMenu({ resourcesRefs, widgetData }: WidgetProps<WidgetData>) {
  const navigate = useNavigate()

  const { items } = widgetData

  const menuItems: MenuItemType[] = useMemo(() => items.map(({ icon, label, path }) => ({
    icon: <FontAwesomeIcon icon={icon as IconProp} />,
    key: path,
    label,
  })), [items])

  const getWidgetEndpointPath = useCallback((path: string) => {
    const item = items.find((item) => item.path === path)

    if (item) {
      const backendEndpoint = getEndpointUrl(item.resourceRefId, resourcesRefs)
      return `${path}?widgetEndpoint=${encodeURIComponent(backendEndpoint)}`
    }

    return path
  }, [items, resourcesRefs])

  useEffect(() => {
    if (window.location.pathname === '/' && menuItems.length > 0) {
      const defaultPath = getWidgetEndpointPath(menuItems[0].key as string)
      void navigate(defaultPath)
    }
  }, [getWidgetEndpointPath, menuItems, navigate])


  const handleClick = (key: string) => {
    const path = getWidgetEndpointPath(key)
    if (path) {
      void navigate(path)
    }
  }

  return (
    <Menu
      className={styles.menu}
      defaultSelectedKeys={[menuItems[0].key as string]}
      items={menuItems}
      mode='inline'
      onClick={item => handleClick(item.key)}
      selectedKeys={[window.location.pathname]}
    />
  )
}
