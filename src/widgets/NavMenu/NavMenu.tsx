import type { IconProp } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Menu } from 'antd'
import type { MenuItemType } from 'antd/es/menu/interface'
import { useEffect, useMemo } from 'react'
import { useLocation, useNavigate } from 'react-router'

import type { AppRoute } from '../../context/RoutesContext'
import { useRoutesContext } from '../../context/RoutesContext'
import type { WidgetProps } from '../../types/Widget'

import styles from './NavMenu.module.css'
import type { NavMenu as WidgetType } from './NavMenu.type'

export type NavMenuWidgetData = WidgetType['spec']['widgetData']

export function NavMenu({ resourcesRefs, uid, widgetData }: WidgetProps<NavMenuWidgetData>) {
  const location = useLocation()
  const navigate = useNavigate()
  const { menuRoutes, updateMenuRoutes } = useRoutesContext()

  const { items } = widgetData

  const routes: AppRoute[] = useMemo(() => items.map(({ path, resourceRefId }) => ({
    path,
    resourceRef: resourcesRefs.find(({ id }) => id === resourceRefId),
    resourceRefId,
  })), [items, resourcesRefs])

  useEffect(() => {
    if (routes.length > 0) {
      localStorage.setItem('routes', JSON.stringify(routes))
      updateMenuRoutes(routes)
    }
  }, [resourcesRefs, routes, updateMenuRoutes])

  useEffect(() => {
    if (location.pathname === '/' && menuRoutes.length > 0) {
      void navigate(menuRoutes[0].path)
    }
  }, [location.pathname, menuRoutes, navigate])

  const menuItems: MenuItemType[] = useMemo(() => items.map(({ icon, label, path }) => ({
    icon: <FontAwesomeIcon icon={icon as IconProp} />,
    key: path,
    label,
  })), [items])

  const handleClick = (key: string) => {
    void navigate(key)
  }

  return (
    <Menu
      className={styles.menu}
      defaultSelectedKeys={[menuItems[0].key as string]}
      items={menuItems}
      key={uid}
      mode='inline'
      onClick={item => handleClick(item.key)}
      selectedKeys={[location.pathname]}
    />
  )
}
