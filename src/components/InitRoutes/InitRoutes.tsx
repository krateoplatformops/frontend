import { useEffect, useMemo } from 'react'
import type { RouteObject } from 'react-router-dom'

const InitRoutes = ({ updateRoutes }: { updateRoutes: (routes: RouteObject[]) => void }) => {
  const mockedRoute: RouteObject[] = useMemo(
    () => [
      {
        element: <>ciao</>,
        index: true,
        path: '/',
      },
    ],
    []
  )

  useEffect(() => updateRoutes(mockedRoute), [mockedRoute, updateRoutes])

  return <></>
}

export default InitRoutes
