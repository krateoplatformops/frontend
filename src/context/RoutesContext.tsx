import React, { createContext, useCallback, useContext, useState } from 'react'
import type { RouteObject } from 'react-router'

import WidgetPage from '../components/WidgetPage'
import Login from '../pages/Login'
import Page404 from '../pages/Page404'

interface RoutesContextType {
  routes: RouteObject[]
  isLoading: boolean
  updateRoutes: (newRoutes: RouteObject[]) => void
}

const RoutesContext = createContext<RoutesContextType | undefined>(undefined)

const defaultRoutes: RouteObject[] = [
  { element: <Login />, path: '/login' },
  { element: <WidgetPage />, path: '*' },
  { element: <Page404 />, path: '/404' },
]

export const RoutesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [routes, setRoutes] = useState<RouteObject[]>(defaultRoutes)
  const [isLoading, setIsLoading] = useState(false)

  const updateRoutes = useCallback((newRoutes: RouteObject[]) => {
    setIsLoading(true)
    setRoutes([...newRoutes, ...defaultRoutes])
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
