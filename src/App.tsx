import { LoadingOutlined } from '@ant-design/icons'
import { library } from '@fortawesome/fontawesome-svg-core'
import { fab } from '@fortawesome/free-brands-svg-icons'
import { far } from '@fortawesome/free-regular-svg-icons'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { App as AntApp, Spin } from 'antd'
import { useEffect } from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router'

import InitRoutes from './components/InitRoutes/InitRoutes'
import { ConfigProvider, useConfigContext } from './context/ConfigContext'
import { RoutesProvider, useRoutesContext } from './context/RoutesContext'

library.add(fab, fas, far)

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
      <RoutesProvider>
        <AntApp>
          <InitRoutes />
          <AppInitializer />
        </AntApp>
      </RoutesProvider>
    </ConfigProvider>
  )
}

export default App
