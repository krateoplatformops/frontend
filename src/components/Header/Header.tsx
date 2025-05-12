import { Header as AntHeader } from 'antd/es/layout/layout'

import Breadcrumb from '../Breadcrumb'

import styles from './Header.module.css'

const Header = () => {
  return (
    <AntHeader className={styles.header}>
      <div className={styles.content}>
        <Breadcrumb />
      </div>
    </AntHeader>
  )
}

export default Header
