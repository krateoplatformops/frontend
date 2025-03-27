import { useEffect } from 'react'
import { RouteObject } from 'react-router-dom'

const InitRoutes = ({
  updateRoutes,
}: {
  updateRoutes: (routes: RouteObject[]) => void
}) => {
  const mockedRoute: RouteObject[] = [
    {
      path: '/',
      index: true,
      element: <>ciao</>,
    },
  ]

  useEffect(() => updateRoutes(mockedRoute), [updateRoutes])

  return <></>
}

export default InitRoutes
