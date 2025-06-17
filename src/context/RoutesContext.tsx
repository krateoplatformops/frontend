import { useQuery } from '@tanstack/react-query'
import React, { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { useParams, useRevalidator, type RouteObject } from 'react-router'

import WidgetPage from '../components/WidgetPage'
import Auth from '../pages/Auth/Auth'
import Login from '../pages/Login'
import type { ResourceRef } from '../types/Widget'
import { getAccessToken } from '../utils/getAccessToken'
import { getResourceEndpoint } from '../utils/utils'

import { useConfigContext } from './ConfigContext'

export interface AppRoute {
  path: string
  resourceRefId: string
  resourceRef?: ResourceRef
}

interface RoutesContextType {
  menuRoutes: AppRoute[]
  routes: RouteObject[]
  isLoading: boolean
  updateMenuRoutes: (newRoutes: AppRoute[]) => void
  updateRoutes: (newRoutes: RouteObject[]) => void
}

const RoutesContext = createContext<RoutesContextType | undefined>(undefined)

const defaultRoutes: RouteObject[] = [
  { element: <Login />, path: '/login' },
  { element: <Auth />, path: '/auth' },
  { element: <WidgetPage />, path: '*' },
]

const normalizeRouteParameters = (route: string) => {
  /**
  To map widgetData path to react-router path

  input: /compositions/{namespace}/{name}
  output: /compositions/:namespace/:name
  */
  let normalizeRoute = route
  if (normalizeRoute.endsWith('/')) {
    normalizeRoute = normalizeRoute.slice(0, -1)
  }
  const pattern = /\{([^}]+)\}/g
  return normalizeRoute.replace(pattern, ':$1')
}

/**
 * Substitutes template parameters in an endpoint string with actual values
 *
 * Example:
 * routerParams: { name: "pino", namespace: "gino" }
 * endpoint: '/call?resource=collections&apiVersion=templates.krateo.io/v1alpha1&name={name}&namespace={namespace}'
 * returns: '/call?resource=collections&apiVersion=templates.krateo.io/v1alpha1&name=pino&namespace=gino'
 */
const substituteEndpointParams = (endpoint: string, routerParams: Record<string, string>): string => {
  return endpoint.replace(/\{([^}]+)\}/g, (match, paramName: string) => {
    const paramValue = routerParams[paramName]
    return paramValue !== undefined ? paramValue : match
  })
}

function createRoute({ endpoint, path }: { endpoint: string; path: string }) {
  const reactRouterPath = normalizeRouteParameters(path)

  return {
    Component: () => {
      const routerParams = useParams()
      const widgetEndpoint = substituteEndpointParams(endpoint, routerParams as Record<string, string>)
      return <WidgetPage defaultWidgetEndpoint={widgetEndpoint} />
    },
    path: reactRouterPath,
  }
}

function useResourcesRouter() {
  const { config } = useConfigContext()
  const resourceUrl = getResourceEndpoint({
    name: 'resources-router',
    namespace: 'krateo-system',
    resource: 'resourcesrouters',
    version: 'v1beta1',
  })

  return useQuery({
    enabled: Boolean(config),
    queryFn: async () => {
      const url = `${config!.api.SNOWPLOW_API_BASE_URL}${resourceUrl}`
      const router = await fetch(url, {
        headers: { Authorization: `Bearer ${getAccessToken()}` },
      })

      const data = await router.json()
      return data

      // return data.resourcesRefs.map((item) => {
      //   return {
      //     path: item.path,
      //   }
      // })
    },
    queryKey: ['resources-router', resourceUrl, config?.api.SNOWPLOW_API_BASE_URL],
  })
}

export const RoutesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [routes, setRoutes] = useState<RouteObject[]>(defaultRoutes)
  const [menuRoutes, setMenuRoutes] = useState<AppRoute[]>([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const storedRoutes = localStorage.getItem('routes')
    if (storedRoutes) {
      setMenuRoutes(JSON.parse(storedRoutes) as AppRoute[])
    }
  }, [])

  const updateMenuRoutes = useCallback((newRoutes: AppRoute[]) => {
    setIsLoading(true)
    setMenuRoutes(newRoutes)
    setIsLoading(false)
  }, [])

  const updateRoutes = useCallback((newRoutes: RouteObject[]) => {
    setIsLoading(true)
    setRoutes([...newRoutes, ...defaultRoutes])
    setIsLoading(false)
  }, [])

  const registerRoute = useCallback((route: RouteObject) => {
    setRoutes((routes) => [...routes, route])
  }, [])

  useEffect(() => {
    const timerId = setTimeout(() => {
      registerRoute(
        createRoute({
          endpoint: '/call?resource=collections&apiVersion=templates.krateo.io/v1alpha1&name={name}&namespace={namespace}',
          path: '/compositions/{namespace}/{name}',
        })
      )
      // revalidator.revalidate()
    }, 2000)

    return () => clearTimeout(timerId)
  }, [registerRoute])

  // const { data: resourcesRoutes } = useResourcesRouter()

  // useEffect(() => {
  //   if (resourcesRoutes) {
  //     const newRoutes = resourcesRoutes.map((route) => {
  //       return {
  //         path: route.path,
  //         resourceRefId: route.resourceRefId,
  //       }
  //     })
  //     updateRoutes(newRoutes)
  //   }
  // }, [resourcesRoutes])

  return (
    <RoutesContext.Provider value={{ isLoading, menuRoutes, routes, updateMenuRoutes, updateRoutes }}>{children}</RoutesContext.Provider>
  )
}

export const useRoutesContext = () => {
  const context = useContext(RoutesContext)

  if (!context) {
    throw new Error('useRoutesContext must be used within RoutesProvider')
  }

  return context
}
