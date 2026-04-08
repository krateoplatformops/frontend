import { useIsFetching } from '@tanstack/react-query'
import { Navigate, useLocation, useSearchParams } from 'react-router'

import { useAuth } from '../../context/AuthContext'
import { useRoutesContext } from '../../context/RoutesContext'
import Page404 from '../../pages/Page404'
import Drawer from '../../widgets/Drawer'
import Modal from '../../widgets/Modal'
import Header from '../Header'
import Sidebar from '../Sidebar'
import WidgetRenderer from '../WidgetRenderer'

import styles from './WidgetPage.module.css'

export const WidgetPage = ({ defaultWidgetEndpoint }: { defaultWidgetEndpoint?: string }) => {
  const { user } = useAuth()
  const location = useLocation()
  const { menuRoutes } = useRoutesContext()
  const [searchParams] = useSearchParams()
  const queryParamWidgetEndpoint = searchParams.get('widgetEndpoint')
  const currentRoute = menuRoutes.find(({ path }) => path === location.pathname)
  const widgetEndpoint = queryParamWidgetEndpoint || currentRoute?.resourceRef?.path || defaultWidgetEndpoint || ''

  const isFetchingRoutes = useIsFetching({
    predicate: (query) => {
      return (
        (query.queryKey[1] as string).includes('resource=routes')
        || (query.queryKey[1] as string).includes('resource=routesloaders')
        || (query.queryKey[1] as string).includes('resource=navmenus')
      )
    },
  })

  if (!user) {
    return <Navigate replace to='/login' />
  }

  return (
    <div className={styles.widgetPage}>
      <Sidebar />
      <div className={styles.container}>
        <Header breadcrumbVisible={widgetEndpoint !== null} />
        <div className={styles.content}>
          {widgetEndpoint || isFetchingRoutes ? <WidgetRenderer key={'content'} widgetEndpoint={widgetEndpoint} /> : <Page404 />}
        </div>
      </div>
      <Drawer />
      <Modal />
    </div>
  )
}

export default WidgetPage
