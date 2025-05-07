import logo from '../../assets/images/logo.png'
import { getResourceEndpoint } from '../../utils/utils'
import { WidgetRenderer } from '../WidgetRenderer'

import styles from './Sidebar.module.css'

const Sidebar = () => {
  return (
    <div className={styles.sidebar}>
      <img alt='Krateo DevOpsApp' className={styles.logo} src={logo} />

      {/* TODO: widgetEndpoint should be retrieved dinamically */}
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
