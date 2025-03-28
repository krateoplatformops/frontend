import { useEffect } from 'react'

import { useRoutesContext } from '../../context/RoutesContext'
import Page from '../Page'

const InitRoutes = () => {
  const { updateRoutes } = useRoutesContext()

  useEffect(() => {
    const newRoutes = [
      { element: <Page />, path: '/' },
      { element: <div>About Page</div>, path: '/about' },
    ]

    updateRoutes(newRoutes)
  }, [updateRoutes])

  return null
}

export default InitRoutes
