import { RobotOutlined } from '@ant-design/icons'
import { CopilotChat } from '@copilotkit/react-core/v2'
import { Button, Drawer } from 'antd'
import { Header as AntdHeader } from 'antd/es/layout/layout'
import { useState } from 'react'

import { useConfigContext } from '../../context/ConfigContext'
import Breadcrumb from '../Breadcrumb'
import UserMenu from '../UserMenu'
import WidgetRenderer from '../WidgetRenderer'

import styles from './Header.module.css'

type HeaderProps = {
  breadcrumbVisible: boolean
}

const Header = ({ breadcrumbVisible = true }: HeaderProps) => {
  const [copilotOpen, setCopilotOpen] = useState(false)

  const { config } = useConfigContext()

  return (
    <AntdHeader className={styles.header}>
      <Drawer
        onClose={() => setCopilotOpen(false)}
        open={copilotOpen}
        placement='right'
        size='large'
        title='Autopilot'
      >
        <CopilotChat />
      </Drawer>

      <div className={styles.content}>
        <div className={styles.left}>
          {breadcrumbVisible && <Breadcrumb />}
        </div>
        <div className={styles.right}>
          <Button
            className={styles.icon}
            icon={<RobotOutlined />}
            onClick={() => setCopilotOpen(true)}
            shape='circle'
            type='link'
          />
          <WidgetRenderer widgetEndpoint={config!.api.NOTIFICATIONS_WIDGET} />
          <UserMenu />
        </div>
      </div>
    </AntdHeader>

  )
}

export default Header
