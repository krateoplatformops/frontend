import { Drawer } from 'antd'
import { useSearchParams } from 'react-router'

import Page404 from '../../pages/Page404'
import Header from '../Header'
import Sidebar from '../Sidebar'
import WidgetRenderer from '../WidgetRenderer'

import styles from './WidgetPage.module.css'

export const WidgetPage = () => {
  const [searchParams] = useSearchParams()
  const widgetEndpoint = searchParams.get('widgetEndpoint')

  return (
    <div className={styles.widgetPage}>
      <Sidebar />
      <div className={styles.container}>
        <Header breadcrumbVisible={widgetEndpoint !== null} />
        <div className={styles.content}>
          {widgetEndpoint
            ? <WidgetRenderer widgetEndpoint={widgetEndpoint} />
            : <Page404 />
          }
        </div>
      </div>
      <Drawer />
    </div>
  )
}

export default WidgetPage
