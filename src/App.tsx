import { LoadingOutlined } from '@ant-design/icons'
import { library } from '@fortawesome/fontawesome-svg-core'
import { fab } from '@fortawesome/free-brands-svg-icons'
import { far } from '@fortawesome/free-regular-svg-icons'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { App as AntdApp, ConfigProvider as AntdConfigProvider, Spin, theme } from 'antd'
import { useEffect, useMemo } from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router'

import '../index.css'
import './theme/variables.css'
import 'reactflow/dist/style.css'

import styles from './App.module.css'
import FiltersProvider from './components/FiltesProvider/FiltersProvider'
import { ConfigProvider, useConfigContext } from './context/ConfigContext'
import { RoutesProvider, useRoutesContext } from './context/RoutesContext'
import { antdToCssVariables } from './theme/bridge'
import { defaultTheme } from './theme/defaultTheme'

library.add(fab, fas, far)

const queryClient = new QueryClient()

const AppInitializer: React.FC = () => {
  const { isLoading: isRoutesLoading, routerVersion, routes } = useRoutesContext()
  const { isLoading: isConfigLoading } = useConfigContext()

  // Use useMemo to recreate router only when routes or routeVersion changes
  const router = useMemo(() => {
    return createBrowserRouter(routes)
  }, [routes])

  if (isRoutesLoading || isConfigLoading) {
    return (
      <div className={styles.loading}>
        <Spin indicator={<LoadingOutlined />} size='large' />
      </div>
    )
  }

  return <RouterProvider key={routerVersion} router={router} />
}

const AntdThemeBridge = () => {
  const { token } = theme.useToken()

  useEffect(() => {
    antdToCssVariables(token)
  }, [token])

  return null
}

const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <ConfigProvider>
        <RoutesProvider>
          <AntdConfigProvider theme={defaultTheme}>
            <AntdApp className={styles.app}>
              <AntdThemeBridge />
              <FiltersProvider>
                <AppInitializer />
              </FiltersProvider>
            </AntdApp>
          </AntdConfigProvider>
        </RoutesProvider>
        <ReactQueryDevtools initialIsOpen={false} />
      </ConfigProvider>
    </QueryClientProvider>
  )
}

export default App
