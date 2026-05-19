import { DeleteOutlined, PlusCircleOutlined } from '@ant-design/icons'
import { Button, Input, List, Space, Typography } from 'antd'
import { useState } from 'react'

type ListEditorType = {
  data?: string[]
  onChange: (data: string[]) => void
}

const ListEditor = ({ data = [], onChange }: ListEditorType) => {
  const [currentString, setCurrentString] = useState('')

  const onAdd = () => {
    const trimmed = currentString.trim()

    if (trimmed !== '') {
      onChange([...data, trimmed])
      setCurrentString('')
    }
  }

  const onRemove = (index: number) => {
    onChange(data.filter((_, i) => i !== index))
  }

  return (
    <Space direction='vertical' style={{ width: '100%' }}>
      <Space.Compact style={{ width: '100%' }}>
        <Input
          onChange={(value) => setCurrentString(value.target.value)}
          value={currentString}
        />
        <Button htmlType='button' onClick={onAdd} type='primary'>
          <PlusCircleOutlined />
        </Button>
      </Space.Compact>

      <List
        dataSource={data}
        renderItem={(item, index) => (
          <List.Item
            actions={[
              <Button
                icon={<DeleteOutlined />}
                onClick={() => onRemove(index)}
                shape='circle'
                type='text'
              />,
            ]}
          >
            <Typography.Text>{item}</Typography.Text>
          </List.Item>
        )}
      />
    </Space>
  )
}

export default ListEditor
