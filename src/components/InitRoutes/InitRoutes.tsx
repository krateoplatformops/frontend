import { useEffect } from 'react'

import { useRoutesContext } from '../../context/RoutesContext'

const InitRoutes = () => {
  const { updateRoutes } = useRoutesContext()

  useEffect(() => {
    const newRoutes = [
      { element: <div>Home Page</div>, path: '/' },
      { element: <div>About Page</div>, path: '/about' },
    ]

    updateRoutes(newRoutes)
  }, [updateRoutes])

  return null
}

export default InitRoutes
