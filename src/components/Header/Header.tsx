import { Header as AntHeader } from 'antd/es/layout/layout'

import styles from './Header.module.css'

const Header = () => {
  return (
    <AntHeader className={styles.header}>
      <div className={styles.content}>
      </div>
    </AntHeader>
  )
}

export default Header
