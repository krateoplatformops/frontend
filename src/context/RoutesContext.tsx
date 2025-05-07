import React, { createContext, useCallback, useContext, useMemo, useState } from 'react'
import type { RouteObject } from 'react-router'

import Page from '../components/Page'
import WidgetPage from '../components/WidgetPage'
import Page404 from '../pages/Page404'

interface RoutesContextType {
  routes: RouteObject[]
  isLoading: boolean
  updateRoutes: (newRoutes: RouteObject[]) => void
}

const RoutesContext = createContext<RoutesContextType | undefined>(undefined)

export const RoutesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const defaultRoutes: RouteObject[] = useMemo(
    () => [
      { element: <Page />, path: '/' },
      { element: <WidgetPage />, path: '*' },
      { element: <Page404 />, path: '/404' },
    ],
    [],
  )

  const [routes, setRoutes] = useState<RouteObject[]>(defaultRoutes)
  const [isLoading, setIsLoading] = useState(true)

  const updateRoutes = useCallback(
    (newRoutes: RouteObject[]) => {
      setRoutes([...newRoutes, ...defaultRoutes])
      setIsLoading(false)
    },
    [defaultRoutes],
  )

  return <RoutesContext.Provider value={{ isLoading, routes, updateRoutes }}>{children}</RoutesContext.Provider>
}

export const useRoutesContext = () => {
  const context = useContext(RoutesContext)

  if (!context) {
    throw new Error('useRoutesContext must be used within RoutesProvider')
  }

  return context
}
