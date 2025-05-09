import { useSearchParams } from 'react-router'

import Sidebar from '../Sidebar'
import { WidgetRenderer } from '../WidgetRenderer'

import styles from './WidgetPage.module.css'

export const WidgetPage = () => {
  const [searchParams] = useSearchParams()
  const widgetEndpoint = searchParams.get('widgetEndpoint')

  return (
    <div className={styles.widgetPage}>
      <Sidebar />
      <div className={styles.content}>
        {widgetEndpoint ? (
          <WidgetRenderer widgetEndpoint={widgetEndpoint} />
        ) : (
          <div>No widget endpoint provided in query param widgetEndpoint</div>
        )}
      </div>
    </div>
  )
}

export default WidgetPage
