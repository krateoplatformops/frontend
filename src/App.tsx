import { LoadingOutlined } from '@ant-design/icons'
import { library } from '@fortawesome/fontawesome-svg-core'
import { fab } from '@fortawesome/free-brands-svg-icons'
import { far } from '@fortawesome/free-regular-svg-icons'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { App as AntApp, Spin } from 'antd'
import { useEffect } from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router'

import '../index.css'
import '../variables.css'
import styles from './App.module.css'
import { ConfigProvider, useConfigContext } from './context/ConfigContext'
import { RoutesProvider, useRoutesContext } from './context/RoutesContext'

library.add(fab, fas, far)

const queryClient = new QueryClient()

const AppInitializer: React.FC = () => {
  const { routes, isLoading: isRoutesLoading } = useRoutesContext()
  const { config, isLoading: isConfigLoading } = useConfigContext()

  useEffect(() => {
    if (config) {
      console.log('Config:', config)
    }
  }, [config, isConfigLoading])

  if (isRoutesLoading || isConfigLoading) {
    return <Spin indicator={<LoadingOutlined />} />
  }

  const router = createBrowserRouter(routes)

  return <RouterProvider router={router} />
}

const App: React.FC = () => {
  return (
    <ConfigProvider>
      <QueryClientProvider client={queryClient}>
        <RoutesProvider>
          <AntApp className={styles.app}>
            <AppInitializer />
          </AntApp>
        </RoutesProvider>
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>i
    </ConfigProvider>
  )
}

export default App
