import logo from '../../assets/images/logo_big.svg'
import { getResourceEndpoint } from '../../utils/utils'
import { WidgetRenderer } from '../WidgetRenderer'

import styles from './Sidebar.module.css'

const Sidebar = () => {
  return (
    <div className={styles.sidebar}>
      <div className={styles.logo}>
        <img
          alt='Krateo DevOpsApp'
          className={styles.image}
          height={48}
          src={logo}
        />
      </div>

      <WidgetRenderer
        widgetEndpoint={getResourceEndpoint({
          name: 'sidebar-nav-menu',
          namespace: 'krateo-system',
          resource: 'navmenus',
          version: 'v1beta1',
        })}
      />
    </div>
  )
}

export default Sidebar
