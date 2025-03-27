import { App as AntApp } from 'antd'
import React, { useEffect, useMemo, useState } from 'react'
import type { RouteObject } from 'react-router-dom'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'

import InitRoutes from './components/InitRoutes/InitRoutes'
import Page404 from './pages/Page404'

const App: React.FC = () => {
  const [router, setRouter] = useState<RouteObject[]>([])

  // TODO: create Login and Error components
  const basicRoutes = useMemo(
    () => [
      // {
      //   path: '/login',
      //   element: <LayoutLogin />,
      //   children: [
      //     {
      //       index: true,
      //       element: <Login />,
      //     },
      //   ],
      // },
      // {
      //   path: '/auth',
      //   element: <Auth />,
      // },
      {
        element: <InitRoutes updateRoutes={updateRoutes} />,
        path: '*',
        // errorElement: <ErrorPage />,
      },
    ],
    []
  )

  const updateRoutes = (newRoutes) => {
    const mergedRoutes = [
      ...newRoutes,
      ...basicRoutes.filter((el) => el.path !== '*'),
      {
        element: <Page404 />,
        path: '*',
      },
    ]

    console.log(mergedRoutes)

    setRouter(mergedRoutes)
  }

  useEffect(() => {
    const getConfig = async () => {
      const configFile = await fetch('/config/config.json')
      const configJson = await configFile.json()

      // TODO: understand if another solution is needed
      localStorage.setItem('K_config', JSON.stringify(configJson))

      if (router?.length === 0) {
        setRouter(basicRoutes)
      }
    }

    getConfig()
  }, [basicRoutes, router?.length])

  return (
    router.length > 0 && (
      <AntApp>
        <RouterProvider router={createBrowserRouter(router)} />
      </AntApp>
    )
  )
}

export default App
