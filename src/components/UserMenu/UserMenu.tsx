import type { MenuProps } from 'antd'
import { Avatar, Flex, Menu, Popover, Typography } from 'antd'
import { noop } from 'lodash'
import { Link } from 'react-router'

import type { AuthResponseType } from '../../pages/Login/Login.types'

import styles from './UserMenu.module.css'

// TODO: add style

const UserMenu = () => {
  const userData = JSON.parse(localStorage.getItem('K_user') || '{}') as AuthResponseType
  const { avatarURL, displayName, username } = userData.user || {}

  const fullName = (displayName !== '' ? displayName : username) || ''
  const initials = fullName
    .trim()
    .split(' ')
    .map(word => word[0]?.toUpperCase())
    .slice(0, 2)
    .join('')

  // TODO: get role from user role
  const role = 'administrator'

  // TODO: get groups from user data
  const groups = ['devOps', 'managers']

  // TODO: handle logout
  const onLogout = () => noop

  const items: MenuProps['items'] = [
    {
      key: '1',
      label: <Link to=''>Logout</Link>,
      onClick: onLogout,
    },
  ]

  return (
    <Popover
      arrow={false}
      className={styles.userLogged}
      content={
        <section className={styles.panel}>
          <Flex align='center' className={styles.userData} gap={20} vertical>
            <Avatar
              gap={2}
              size={80}
              src={avatarURL}
            >
              <Typography.Text className={styles.sign}>{initials}</Typography.Text>
            </Avatar>

            <Flex align='center' className={styles.details} gap={3} vertical>
              <Typography.Text className={styles.fullname}>{fullName}</Typography.Text>
              <Typography.Text className={styles.role}>{role}</Typography.Text>
              <Typography.Text className={styles.groups}>{groups.join(', ')}</Typography.Text>
            </Flex>
          </Flex>

          <Menu items={items}
            mode='vertical'
            selectable={false}
            style={{ border: 'none' }}
          />
        </section>
      }
      placement='topLeft'
      trigger='click'
    >
      <Avatar
        gap={2}
        size='default'
        src={avatarURL}
      >
        <Typography.Text>{initials}</Typography.Text>
      </Avatar>
    </Popover>
  )
}

export default UserMenu
