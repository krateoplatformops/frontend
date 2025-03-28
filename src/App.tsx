import { LoadingOutlined } from '@ant-design/icons'
import { App as AntApp, Spin } from 'antd'
import { createBrowserRouter, RouterProvider } from 'react-router'

import InitRoutes from './components/InitRoutes/InitRoutes'
import { RoutesProvider, useRoutesContext } from './context/RoutesContext'

const AppRouter: React.FC = () => {
  const { routes, isLoading } = useRoutesContext()

  if (isLoading) {
    return <Spin indicator={<LoadingOutlined />} />
  }

  const router = createBrowserRouter(routes)

  return <RouterProvider router={router} />
}

const App: React.FC = () => {
  return (
    <RoutesProvider>
      <AntApp>
        <InitRoutes />
        <AppRouter />
      </AntApp>
    </RoutesProvider>
  )
}

export default App
