import { Avatar, Card, Col, Descriptions, Row, Space, Typography } from 'antd'
import { Navigate } from 'react-router'

import Header from '../../components/Header'
import Sidebar from '../../components/Sidebar'
import { useAuth } from '../../context/AuthContext'

import styles from './Profile.module.css'

const Profile = () => {
  const { groups, user } = useAuth()

  if (!user) { return <Navigate replace to='/login' /> }

  return (
    <div className={styles.profile}>
      <Sidebar />
      <div className={styles.container}>
        <Header breadcrumbVisible={true} />
        <div className={styles.content}>
          <Card>
            <Row>
              <Col className={styles.avatar} sm={24}>
                <Avatar size={200} src={user?.avatarURL} />
              </Col>
              <Col md={12} sm={24}>
                <Space direction='vertical' size='large'>
                  <div>
                    <Typography.Text className={styles.fullname}>{user?.displayName}</Typography.Text>
                  </div>

                  <Descriptions column={1}>
                    <Descriptions.Item label='Username'>
                      {user?.username || '-'}
                    </Descriptions.Item>
                    <Descriptions.Item label='Groups'>
                      {groups?.join(', ') || '-'}
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
