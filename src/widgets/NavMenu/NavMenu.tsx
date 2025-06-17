import type { IconProp } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useQueries } from '@tanstack/react-query'
import { Menu } from 'antd'
import type { MenuItemType } from 'antd/es/menu/interface'
import { useEffect, useMemo } from 'react'
import { useLocation, useNavigate } from 'react-router'

import WidgetRenderer from '../../components/WidgetRenderer'
import { useConfigContext } from '../../context/ConfigContext'
import type { AppRoute } from '../../context/RoutesContext'
import { useRoutesContext } from '../../context/RoutesContext'
import type { WidgetProps } from '../../types/Widget'
import { getAccessToken } from '../../utils/getAccessToken'
import { getResourceEndpoint } from '../../utils/utils'
import type { NavMenuItem } from '../NavMenuItem/NavMenuItem.type'

import styles from './NavMenu.module.css'
import type { NavMenu as WidgetType } from './NavMenu.type'

export type NavMenuWidgetData = WidgetType['spec']['widgetData']

// TODO: check correct typing
interface ResolvedResourceRef {
  id: string
  path: string
  verb: 'GET' | 'POST' | 'DELETE'
}

type NavMenuItemResponse = Omit<NavMenuItem, 'status'> & {
  status: {
    widgetData: NavMenuItem['spec']['widgetData']
    resourcesRefs?: ResolvedResourceRef[]
  }
}
export function NavMenu({ resourcesRefs, uid }: WidgetProps<NavMenuWidgetData>) {
  const location = useLocation()
  const navigate = useNavigate()
  const { menuRoutes, updateMenuRoutes } = useRoutesContext()
  const { config } = useConfigContext()

  /* HACK: waiting for the widgetData to return items from the backend via a restaction that sets items from resourcesRefsTemplate */
  const items = resourcesRefs

  const { loadedAllMenuItems, navMenuItems } = useQueries({
    combine: (results) => {
      return {
        isError: results.some(({ isError }) => isError),
        isLoading: results.some(({ isLoading }) => isLoading),
        loadedAllMenuItems: results.every(({ status }) => status === 'success'),
        navMenuItems: results.map(({ data }) => data),
      }
    },
    queries: items.map((resourcesRef) => {
      const widgetFullUrl = `${config!.api.SNOWPLOW_API_BASE_URL}${resourcesRef.path}`
      return {
        queryFn: async (): Promise<NavMenuItemResponse> => {
          const res = await fetch(widgetFullUrl, {
            headers: {
              Authorization: `Bearer ${getAccessToken()}`,
            },
          })
          const widget = await res.json() as NavMenuItemResponse
          return widget
        },
        queryKey: ['navmenuitems', resourcesRef.id, widgetFullUrl],
      }
    }),
  })

  useEffect(() => {
    if (loadedAllMenuItems && navMenuItems.length > 0) {
      const validMenuItems = navMenuItems.filter((item): item is NavMenuItemResponse => !!item)

      const routesToSave = validMenuItems
        .map(({ status: { resourcesRefs, widgetData: { path, resourceRefId } } }) => {
          const routeResourceRef = resourcesRefs?.find(({ id }) => id === resourceRefId)
          if (!routeResourceRef) { return null }

          return {
            path,
            resourceRef: { ...routeResourceRef, payload: {} },
            resourceRefId,
          }
        })
        .filter(Boolean) as AppRoute[]

      localStorage.setItem('routes', JSON.stringify(routesToSave))
      updateMenuRoutes(routesToSave)
    }
  }, [loadedAllMenuItems, navMenuItems, updateMenuRoutes])

  useEffect(() => {
    if (location.pathname === '/' && menuRoutes.length > 0) {
      void navigate(menuRoutes[0].path)
    }
  }, [location.pathname, menuRoutes, navigate])

  const menuItems: MenuItemType[] = useMemo(() => {
    if (!loadedAllMenuItems) {
      return []
    }

    const validMenuItems = navMenuItems.filter((item): item is NavMenuItemResponse => !!item)

    return validMenuItems.map(({ status: { widgetData: { icon, label, path } } }) => {
      return {
        icon: <FontAwesomeIcon icon={icon as IconProp} />,
        key: path,
        label,
      }
    })
  }, [navMenuItems, loadedAllMenuItems])

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
