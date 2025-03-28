import { noop } from 'lodash'
import React, { createContext, useCallback, useContext, useEffect, useState } from 'react'
import type { RouteObject } from 'react-router'

import Page404 from '../pages/Page404'

interface Config {
  api: {
    AUTHN_API_BASE_URL: string
    BACKEND_API_BASE_URL: string
    EVENTS_API_BASE_URL: string
    EVENTS_PUSH_API_BASE_URL: string
    INIT: string
    TERMINAL_SOCKET_URL: string
  }
  params: {
    FRONTEND_NAMESPACE: string
    DELAY_SAVE_NOTIFICATION: string
  }
}

interface RoutesContextType {
  config: Config | null
  routes: RouteObject[]
  isLoading: boolean
  updateRoutes: (newRoutes: RouteObject[]) => void
}

const RoutesContext = createContext<RoutesContextType | undefined>(undefined)

export const RoutesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [routes, setRoutes] = useState<RouteObject[]>([{ element: <Page404 />, path: '*' }])
  const [config, setConfig] = useState<Config | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const getConfig = async () => {
      const configFile = await fetch('/config/config.json')
      const configJson = (await configFile.json()) as Config
      setConfig(configJson)
    }

    getConfig().catch(noop)
  }, [])

  const updateRoutes = useCallback((newRoutes: RouteObject[]) => {
    setRoutes([...newRoutes, { element: <Page404 />, path: '*' }])
    setIsLoading(false)
  }, [])

  return <RoutesContext.Provider value={{ config, isLoading, routes, updateRoutes }}>{children}</RoutesContext.Provider>
}

export const useRoutesContext = () => {
  const context = useContext(RoutesContext)

  if (!context) {
    throw new Error('useRoutesContext must be used within RoutesProvider')
  }

  return context
}
