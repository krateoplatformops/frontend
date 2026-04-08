import { Avatar, Card, Col, Descriptions, Row, Space, Typography } from 'antd'
import { useEffect, useState } from 'react'

import Header from '../../components/Header'
import Sidebar from '../../components/Sidebar'
import type { AuthResponseType } from '../Login/Login.types'

import styles from './Profile.module.css'

const Profile = () => {
  const lsUserData = localStorage.getItem('K_user')
  const [userData, setUserData] = useState<AuthResponseType['user']>(null)

  const lsGroupsData = localStorage.getItem('K_groups')
  const [groupsData, setGroupsData] = useState<AuthResponseType['groups']>([])

  useEffect(() => {
    if (!lsUserData) {
      window.location.replace('/login')
    } else {
      setUserData(JSON.parse(lsUserData) as AuthResponseType['user'])
    }
  }, [lsUserData])

  useEffect(() => {
    if (lsGroupsData) {
      setGroupsData(JSON.parse(lsGroupsData) as AuthResponseType['groups'])
    }
  }, [lsGroupsData])

  return (
    <div className={styles.profile}>
      <Sidebar />
      <div className={styles.container}>
        <Header breadcrumbVisible={true} />
        <div className={styles.content}>
          <Card>
            <Row>
              <Col className={styles.avatar} sm={24}>
                <Avatar size={200} src={userData?.avatarURL} />
              </Col>
              <Col md={12} sm={24}>
                <Space direction='vertical' size='large'>
                  <div>
                    <Typography.Text className={styles.fullname}>{userData?.displayName}</Typography.Text>
                  </div>

                  <Descriptions column={1}>
                    <Descriptions.Item label='Username'>
                      {userData?.username || '-'}
                    </Descriptions.Item>
                    <Descriptions.Item label='Groups'>
                      {groupsData.join(', ') || '-'}
                    </Descriptions.Item>
                  </Descriptions>
                </Space>
              </Col>
            </Row>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default Profile
