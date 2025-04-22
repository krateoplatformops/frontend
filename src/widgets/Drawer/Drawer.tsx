import { Drawer as AntDrawer } from 'antd'
import React, { useState } from 'react'

import type { DrawerSchema } from '../../types/Drawer.schema'

interface Props {
  widgetData: DrawerSchema['spec']['widgetData']
}

const Drawer: React.FC<Props> = ({ widgetData: data }) => {
  const { content, extra, footer, size, title, width } = data

  const [isOpen, setIsOpen] = useState(false)

  return (
    <AntDrawer
      destroyOnClose={true}
      maskClosable={false}
      open={isOpen}
      placement='right'
      size={size || 'default'}
      title={title}
      width={width || 378}
    />
  )
}

export default Drawer
