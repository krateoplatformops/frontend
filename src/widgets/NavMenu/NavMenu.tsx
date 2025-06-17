import type { IconProp } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useQueries } from '@tanstack/react-query'
import { Menu } from 'antd'
import type { MenuItemType } from 'antd/es/menu/interface'
import { useEffect, useMemo } from 'react'
import { useLocation, useNavigate } from 'react-router'

import WidgetRenderer from '../../components/WidgetRenderer'
import { useConfigContext } from '../../context/ConfigContext'
import { useRoutesContext } from '../../context/RoutesContext'
import type { WidgetProps } from '../../types/Widget'
import { getAccessToken } from '../../utils/getAccessToken'
import { getResourceEndpoint } from '../../utils/utils'
import type { NavMenuItem } from '../NavMenuItem/NavMenuItem.type'

import styles from './NavMenu.module.css'
import type { NavMenu as WidgetType } from './NavMenu.type'

export type NavMenuWidgetData = WidgetType['spec']['widgetData']

export function NavMenu({ resourcesRefs, uid, widgetData }: WidgetProps<NavMenuWidgetData>) {
  const location = useLocation()
  const navigate = useNavigate()
  const { menuRoutes, updateMenuRoutes } = useRoutesContext()
  const { config } = useConfigContext()

  /* HACK: waiting for the widgetData to return items from the backend via a restaction that sets items from resourcesRefsTemplate */
  // const { items } = widgetData
  const items = resourcesRefs

  const { loadedAllMenuItems, navMenuItems } = useQueries({
    combine: (results) => {
      return {
        isError: results.some((result) => result.isError),
        isLoading: results.some((result) => result.isLoading),
        loadedAllMenuItems: results.every((result) => result.status === 'success'),
        navMenuItems: results.map((result) => result.data),
      }
    },
    queries: items.map((resourcesRef) => {
      const widgetFullUrl = `${config!.api.SNOWPLOW_API_BASE_URL}${resourcesRef.path}`
      return {
        queryFn: async () => {
          const res = await fetch(widgetFullUrl, {
            headers: {
              Authorization: `Bearer ${getAccessToken()}`,
            },
          })
          const widget = await res.json()
          return widget
        },
        queryKey: ['navmenuitems', resourcesRef.id, widgetFullUrl],
      }
    }),
  })

  // const routes: AppRoute[] = useMemo(() => {
  //   if (!loadedAllRoutes) {
  //     return []
  //   }
  //   return allRoutes.map(({ path, resourceRefId }) => ({
  //     path,
  //     resourceRef: resourcesRefs.find(({ id }) => id === resourceRefId),
  //     resourceRefId,
  //   }))
  // }, [items, resourcesRefs, allRoutes, loadedAllRoutes])

  useEffect(() => {
    if (loadedAllMenuItems && navMenuItems.length > 0) {
      const routesToSave = navMenuItems.map((menuItem) => {
        const { resourceRefId } = menuItem.status.widgetData as unknown as NavMenuItem['spec']['widgetData']
        const routeResourceRef = menuItem.status.resourcesRefs.find(({ id }) => id === resourceRefId)!
        return {
          path: menuItem.status.widgetData.path,
          resourceRef: routeResourceRef,
          resourceRefId,
        }
      })

      localStorage.setItem('routes', JSON.stringify(routesToSave))
      updateMenuRoutes(routesToSave)
    }
  }, [loadedAllMenuItems, navMenuItems])

  useEffect(() => {
    if (location.pathname === '/' && menuRoutes.length > 0) {
      void navigate(menuRoutes[0].path)
    }
  }, [location.pathname, menuRoutes, navigate])

  const menuItems: MenuItemType[] = useMemo(() => {
    if (!loadedAllMenuItems) {
      return []
    }
    return navMenuItems.map((item) => {
      const { icon, label, path } = item.status.widgetData as unknown as NavMenuItem['spec']['widgetData']
      return {
        icon: <FontAwesomeIcon icon={icon as IconProp} />,
        key: path,
        label,
      }
    })
  }, [items, navMenuItems, loadedAllMenuItems])

  const handleClick = (key: string) => {
    void navigate(key)
  }

  return (
    <>
      <Menu
        className={styles.menu}
        defaultSelectedKeys={loadedAllMenuItems ? [menuItems[0].key as string] : []}
        items={menuItems}
        key={uid}
        mode='inline'
        onClick={(item) => handleClick(item.key)}
        selectedKeys={[location.pathname]}
      />

      <WidgetRenderer
        invisible={true}
        widgetEndpoint={getResourceEndpoint({
          apiVersion: 'widgets.templates.krateo.io/v1beta1',
          name: 'resources-router',
          namespace: 'krateo-v2-system',
          resource: 'resourcesrouters',
        })}
      />
    </>
  )
}
