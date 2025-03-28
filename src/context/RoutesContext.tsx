import React, { createContext, useCallback, useContext, useState } from 'react'
import type { RouteObject } from 'react-router'

import Page404 from '../pages/Page404'

interface RoutesContextType {
  routes: RouteObject[]
  isLoading: boolean
  updateRoutes: (newRoutes: RouteObject[]) => void
}

const RoutesContext = createContext<RoutesContextType | undefined>(undefined)

export const RoutesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [routes, setRoutes] = useState<RouteObject[]>([{ element: <Page404 />, path: '*' }])
  const [isLoading, setIsLoading] = useState(true)

  const updateRoutes = useCallback((newRoutes: RouteObject[]) => {
    setRoutes([...newRoutes, { element: <Page404 />, path: '*' }])
    setIsLoading(false)
  }, [])

  return <RoutesContext.Provider value={{ isLoading, routes, updateRoutes }}>{children}</RoutesContext.Provider>
}

export const useRoutesContext = () => {
  const context = useContext(RoutesContext)

  if (!context) {
    throw new Error('useRoutesContext must be used within RoutesProvider')
  }

  return context
}
