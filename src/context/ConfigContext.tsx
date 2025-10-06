import { noop } from 'lodash'
import React, { createContext, useContext, useEffect, useState } from 'react'

export interface Config {
  api: {
    AUTHN_API_BASE_URL: string
    SNOWPLOW_API_BASE_URL: string
    EVENTS_API_BASE_URL: string
    EVENTS_PUSH_API_BASE_URL: string
    ROUTES_LOADER: string
    INIT: string
    TERMINAL_SOCKET_URL: string
  }
  params: {
    FRONTEND_NAMESPACE: string
    DELAY_SAVE_NOTIFICATION: string
  }
}

interface ConfigContextType {
  config: Config | null
  isLoading: boolean
}

const ConfigContext = createContext<ConfigContextType>({
  config: null,
  isLoading: true,
})

export const ConfigProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [config, setConfig] = useState<Config | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const getConfig = async () => {
      try {
        // In development, use VITE_CONFIG_NAME if set, otherwise fallback to config.json
        // e.g., VITE_CONFIG_NAME=local will load config.local.json
        let configPath = '/config/config.json'

        const configName = import.meta.env.VITE_CONFIG_NAME
        if (import.meta.env.DEV && configName) {
          configPath = `/config/config.${configName}.json`
        }

        const configFile = await fetch(configPath)

        if (!configFile.ok) {
          throw new Error(`Failed to fetch config: ${configFile.statusText}`)
        }

        const configJson = (await configFile.json()) as Config
        setConfig(configJson)
      } catch (error) {
        console.error('Error fetching config:', error)
      } finally {
        setIsLoading(false)
      }
    }

    getConfig().catch(noop)
  }, [])

  return <ConfigContext.Provider value={{ config, isLoading }}>{children}</ConfigContext.Provider>
}

export const useConfigContext = () => {
  const context = useContext(ConfigContext)

  if (!context) {
    throw new Error('useConfigContext must be used within ConfigProvider')
  }

  return context
}
