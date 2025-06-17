import { useEffect, useState } from 'react'
import { useLocation, useNavigate, useSearchParams } from 'react-router'

import { useRoutesContext } from '../../context/RoutesContext'
import Page404 from '../../pages/Page404'
import { getResourceEndpoint } from '../../utils/utils'
import Drawer from '../../widgets/Drawer'
import Header from '../Header'
import Sidebar from '../Sidebar'
import WidgetRenderer from '../WidgetRenderer'

import styles from './WidgetPage.module.css'

export const WidgetPage = ({ defaultWidgetEndpoint }: { defaultWidgetEndpoint?: string }) => {
  const location = useLocation()
  const navigate = useNavigate()
  const { menuRoutes } = useRoutesContext()
  const [searchParams] = useSearchParams()
  const [widgetEndpoint, setWidgetEndpoint] = useState<string>(defaultWidgetEndpoint || '')

  useEffect(() => {
    if (defaultWidgetEndpoint) {
      return
    }

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
  }, [location.pathname, menuRoutes, searchParams, setWidgetEndpoint, defaultWidgetEndpoint])

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
      <WidgetRenderer
        invisible={true}
        widgetEndpoint={getResourceEndpoint({
          apiVersion: 'widgets.templates.krateo.io/v1beta1',
          name: 'resources-router',
          namespace: 'krateo-system',
          resource: 'resourcesrouters',
        })}
      />
    </div>
  )
}

export default WidgetPage
