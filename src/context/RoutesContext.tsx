import React, { createContext, useCallback, useContext, useState } from 'react'
import { useParams, type RouteObject } from 'react-router'

import WidgetPage from '../components/WidgetPage'
import Auth from '../pages/Auth/Auth'
import Login from '../pages/Login'
import type { ResourceRef } from '../types/Widget'

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
  registerRoutes: (routes: RouteObject[]) => void
  routerVersion: number
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

export function createRoute({ endpoint, path }: { endpoint: string; path: string }) {
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

export const RoutesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // use to force re-render the router when a new route is added
  const [routerVersion, setRouterVersion] = useState(0)
  const [routes, setRoutes] = useState<RouteObject[]>(defaultRoutes)
  const [menuRoutes, setMenuRoutes] = useState<AppRoute[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const updateMenuRoutes = useCallback((newRoutes: AppRoute[]) => {
    setIsLoading(true)
    setMenuRoutes(newRoutes)
    setIsLoading(false)
  }, [])

  const registerRoutes = useCallback((newRoutes: RouteObject[]) => {
    setRoutes((prevRoutes) => {
      const filteredNewRoutes = newRoutes.filter((newRoute) => !prevRoutes.find((existingRoute) => existingRoute.path === newRoute.path))

      if (filteredNewRoutes.length === 0) {
        return prevRoutes
      }

      const updatedRoutes = [...prevRoutes, ...filteredNewRoutes]
      setRouterVersion((prev) => prev + 1)
      return updatedRoutes
    })
  }, [])

  return (
    <RoutesContext.Provider
      value={{
        isLoading,
        menuRoutes,
        registerRoutes,
        routerVersion,
        routes,
        updateMenuRoutes,
      }}
    >
      {children}
    </RoutesContext.Provider>
  )
}

export const useRoutesContext = () => {
  const context = useContext(RoutesContext)

  if (!context) {
    throw new Error('useRoutesContext must be used within RoutesProvider')
  }

  return context
}
