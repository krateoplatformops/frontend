import { useConfigContext } from '../../context/ConfigContext'
import { useAppBranding } from '../../hooks/useAppTheme'
import WidgetRenderer from '../WidgetRenderer'

import styles from './Sidebar.module.css'

const Sidebar = () => {
  const { config } = useConfigContext()
  const { logoUrl } = useAppBranding()

  return (
    <div className={styles.sidebar}>
      <div className={styles.logo}>
        <img
          alt='Krateo DevOpsApp'
          className={styles.image}
          height={48}
          src={logoUrl}
        />
      </div>

      <div className={styles.content}>
        <WidgetRenderer key={'sidebar'} widgetEndpoint={config!.api.INIT} />
      </div>
    </div>
  )
}

export default Sidebar
