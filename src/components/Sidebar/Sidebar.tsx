import { useConfigContext } from '../../context/ConfigContext'
import { useAppBranding } from '../../hooks/useAppTheme'
import WidgetRenderer from '../WidgetRenderer'

import styles from './Sidebar.module.css'

const Sidebar = () => {
  const { config } = useConfigContext()
  const { logoSvg, logoUrl } = useAppBranding()

  return (
    <div className={styles.sidebar}>
      <div className={styles.logo}>
        <div className={styles.logoInner}>
          {logoSvg ?
            <span className={styles.logoSvg} dangerouslySetInnerHTML={{ __html: logoSvg }}/>
            :
            <img alt='Logo' className={styles.logoImg} src={logoUrl} />
          }
        </div>
      </div>

      <div className={styles.content}>
        <WidgetRenderer key={'sidebar'} widgetEndpoint={config!.api.INIT} />
      </div>
    </div>
  )
}

export default Sidebar
