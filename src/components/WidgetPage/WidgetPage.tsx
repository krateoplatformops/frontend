import { useSearchParams } from 'react-router'

import { Drawer } from '../../Drawer'
import Header from '../Header'
import Sidebar from '../Sidebar'
import { WidgetRenderer } from '../WidgetRenderer'

import styles from './WidgetPage.module.css'

export const WidgetPage = () => {
  const [searchParams] = useSearchParams()
  const widgetEndpoint = searchParams.get('widgetEndpoint')

  return (
    <div className={styles.widgetPage}>
      <Sidebar />
      <div className={styles.container}>
        <Header />
        <div className={styles.content}>
          {widgetEndpoint ? (
            <WidgetRenderer widgetEndpoint={widgetEndpoint} />
          ) : (
            <div>No widget endpoint provided in query param widgetEndpoint</div>
          )}
        </div>
      </div>
      <Drawer />
    </div>
  )
}

export default WidgetPage
