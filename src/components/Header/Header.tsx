import { Header as AntdHeader } from 'antd/es/layout/layout'

import { useConfigContext } from '../../context/ConfigContext'
import Breadcrumb from '../Breadcrumb'
import UserMenu from '../UserMenu'
import WidgetRenderer from '../WidgetRenderer'

import styles from './Header.module.css'

type HeaderProps = {
  breadcrumbVisible: boolean
}

const Header = ({ breadcrumbVisible = true }: HeaderProps) => {
  const { config } = useConfigContext()

  return (
    <AntdHeader className={styles.header}>
      <div className={styles.content}>
        <div className={styles.left}>
          {breadcrumbVisible && <Breadcrumb />}
        </div>
        <div className={styles.right}>
          <WidgetRenderer widgetEndpoint={config!.api.NOTIFICATIONS_WIDGET} />
          <UserMenu />
        </div>
      </div>
    </AntdHeader>
  )
}

export default Header
