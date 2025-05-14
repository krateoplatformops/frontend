import { Header as AntHeader } from 'antd/es/layout/layout'

import Breadcrumb from '../Breadcrumb'
import Notifications from '../Notifications'
import UserMenu from '../UserMenu'

import styles from './Header.module.css'

const Header = () => {
  return (
    <AntHeader className={styles.header}>
      <div className={styles.content}>
        <Breadcrumb />
        <div className={styles.right}>
          <Notifications />
          <UserMenu />
        </div>
      </div>
    </AntHeader>
  )
}

export default Header
