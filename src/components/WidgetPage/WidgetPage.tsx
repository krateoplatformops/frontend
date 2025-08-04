import { useEffect } from 'react'
import { useLocation, useSearchParams } from 'react-router'

import { useRoutesContext } from '../../context/RoutesContext'
import Page404 from '../../pages/Page404'
import Drawer from '../../widgets/Drawer'
import Modal from '../../widgets/Modal'
import Header from '../Header'
import Sidebar from '../Sidebar'
import WidgetRenderer from '../WidgetRenderer'

import styles from './WidgetPage.module.css'

export const WidgetPage = ({ defaultWidgetEndpoint }: { defaultWidgetEndpoint?: string }) => {
  const location = useLocation()
  const { isFetchingRoutes, menuRoutes, reloadRoutes } = useRoutesContext()
  const [searchParams] = useSearchParams()
  const queryParamWidgetEndpoint = searchParams.get('widgetEndpoint')
  const currentRoute = menuRoutes.find(({ path }) => path === location.pathname)
  const widgetEndpoint = queryParamWidgetEndpoint || currentRoute?.resourceRef?.path || defaultWidgetEndpoint || null

  useEffect(() => {
    const userData = localStorage.getItem('K_user')

    if (!userData) {
      window.location.replace('/login')
    }
  }, [])

  useEffect(() => {
    if (isFetchingRoutes) {
      return
    }

    // Triggers routes reloading if no registered route is matching the current route
    // This might happen during the creation of a new kind: Route (e.g. after composition creation)
    if (!widgetEndpoint) {
      void reloadRoutes()
    }
  }, [isFetchingRoutes, reloadRoutes, widgetEndpoint])

  if (!widgetEndpoint && isFetchingRoutes) {
    return null
  }

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
      <Modal />
    </div>
  )
}

export default WidgetPage
