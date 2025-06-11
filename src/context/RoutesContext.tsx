import React, { createContext, useCallback, useContext, useEffect, useState } from 'react'
import type { RouteObject } from 'react-router'

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
  updateRoutes: (newRoutes: RouteObject[]) => void
}

const RoutesContext = createContext<RoutesContextType | undefined>(undefined)

const defaultRoutes: RouteObject[] = [
  { element: <Login />, path: '/login' },
  { element: <Auth />, path: '/auth' },
  { element: <WidgetPage />, path: '*' },
]

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

  return (
    <RoutesContext.Provider value={{ isLoading, menuRoutes, routes, updateMenuRoutes, updateRoutes }}>
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
