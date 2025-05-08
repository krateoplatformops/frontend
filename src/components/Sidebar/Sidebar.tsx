import { Menu } from 'antd'

import logo from '../../assets/images/logo.png'
import { getResourceEndpoint } from '../../utils/utils'
import { WidgetRenderer } from '../WidgetRenderer'

import styles from './Sidebar.module.css'

const Sidebar = () => {
  return (
    <div className={styles.sidebar}>
      <img alt='Krateo DevOpsApp' className={styles.logo} src={logo} />

      <Menu>
        <WidgetRenderer
          widgetEndpoint={getResourceEndpoint({
            name: 'sidebar-nav-menu',
            namespace: 'krateo-system',
            resource: 'navmenus',
            version: 'v1beta1',
          })}
        />
      </Menu>
    </div>
  )
}

export default Sidebar
