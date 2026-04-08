import type { MenuProps } from 'antd'
import { Avatar, Menu, Popover, Typography } from 'antd'
import { Link } from 'react-router'

import { useAuth } from '../../context/AuthContext'

import styles from './UserMenu.module.css'

const UserMenu = () => {
  const { logout, user } = useAuth()

  const avatarURL = user?.avatarURL || ''
  const displayName = user?.displayName || ''
  const username = user?.username || ''

  const fullName = displayName || username
  const initials = fullName
    .trim()
    .split(' ')
    .map(word => word[0]?.toUpperCase())
    .slice(0, 2)
    .join('')

  // TODO: get role from user role
  const role = 'administrator'

  const items: MenuProps['items'] = [
    {
      key: '1',
      label: <Link to='/profile'>Profile</Link>,
    },
    {
      key: '2',
      label: 'Logout',
      onClick: () => { void logout() },
    },
  ]

  return (
    <Popover
      arrow={false}
      className={styles.popover}
      content={
        <section className={styles.panel}>
          <div className={styles.userData}>
            <Avatar gap={2} size={80} src={avatarURL}>
              <Typography.Text className={styles.initials}>{initials}</Typography.Text>
            </Avatar>

            <div className={styles.details}>
              <Typography.Text className={styles.fullname}>{fullName}</Typography.Text>
              <Typography.Text className={styles.role}>{role}</Typography.Text>
            </div>
          </div>

          <Menu
            className={styles.menu}
            items={items}
            mode='vertical'
            selectable={false}
          />
        </section>
      }
      placement='topLeft'
      trigger='click'
    >
      <Avatar gap={2} size='default' src={avatarURL}>
        <Typography.Text>{initials}</Typography.Text>
      </Avatar>
    </Popover>
  )
}

export default UserMenu
