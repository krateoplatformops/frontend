import { useEffect, useState } from 'react'
import { useLocation, useNavigate, useSearchParams } from 'react-router'

import { useRoutesContext } from '../../context/RoutesContext'
import Page404 from '../../pages/Page404'
import Header from '../Header'
import Sidebar from '../Sidebar'
import WidgetRenderer from '../WidgetRenderer'

import styles from './WidgetPage.module.css'
import Drawer from '../../widgets/Drawer'

export const WidgetPage = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { menuRoutes } = useRoutesContext()
  const [searchParams] = useSearchParams()
  const [widgetEndpoint, setWidgetEndpoint] = useState<string>('')

  useEffect(() => {
    if (menuRoutes.length === 0) {
      return
    }

    const currentRoute = menuRoutes.find(({ path }) => path === location.pathname)

    setWidgetEndpoint(() => {
      if (currentRoute && currentRoute.resourceRef) {
        return currentRoute.resourceRef.path
      }

      return searchParams.get('widgetEndpoint') || ''
    })
  }, [location.pathname, menuRoutes, searchParams, setWidgetEndpoint])

  useEffect(() => {
    const userData = localStorage.getItem('K_user')

    if (!userData) {
      void navigate('/login')
    }
  }, [navigate])

  return (
    <div className={styles.widgetPage}>
      <Sidebar />
      <div className={styles.container}>
        <Header breadcrumbVisible={widgetEndpoint !== null} />
        <div className={styles.content}>
          {widgetEndpoint ? <WidgetRenderer key={'content'} widgetEndpoint={widgetEndpoint} /> : <Page404 />}
        </div>
      </div>
      <Drawer />
    </div>
  )
}

export default WidgetPage
