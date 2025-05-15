import type { IconProp } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Avatar, Flex, Space, Typography } from 'antd'

import { getColorCode } from '../../utils/palette'

import styles from './RichRow.module.css'

interface RichRowProps {
  color: string
  icon: string
  primaryText: string
  secondaryText: string
  subPrimaryText: string
  subSecondaryText: string
}

const RichRow = ({
  color,
  icon,
  primaryText,
  secondaryText,
  subPrimaryText,
  subSecondaryText,
}: RichRowProps) => {
  return (
    <Flex className={styles.richRow} gap={10} justify='space-between'>
      <Space align='start' className={styles.primary} size='large'>
        <Avatar
          icon={<FontAwesomeIcon icon={icon as IconProp} />}
          size={icon ? 24 : 18}
          style={{ backgroundColor: getColorCode(color) }} />
        <div>
          <Typography.Text className={styles.subtext}>{subPrimaryText}</Typography.Text>
          <Typography.Paragraph>{primaryText}</Typography.Paragraph>
        </div>
      </Space>
      <div className={styles.secondary}>
        <Typography.Text className={styles.subtext}>{subSecondaryText}</Typography.Text>
        <Typography.Paragraph>{secondaryText}</Typography.Paragraph>
      </div>
    </Flex>
  )
}

export default RichRow
