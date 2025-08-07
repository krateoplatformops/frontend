import { DeleteOutlined, PlusCircleOutlined } from '@ant-design/icons'
import { Button, Drawer, Form, List, Popover, Tag } from 'antd'
import React, { useState } from 'react'

type ListObjectFieldsType = {
  container: HTMLElement
  data?: unknown[]
  fields: React.ReactNode[]
  displayField: string
  onSubmit: (data: unknown[]) => void
}

const ListObjectFields = ({ container, data = [], displayField, fields, onSubmit }: ListObjectFieldsType) => {
  const [open, setOpen] = useState<boolean>(false)
  const [list, setList] = useState<unknown[]>(data)
  const [form] = Form.useForm()

  const onRemove = (index: number) => {
    const newList = list.filter((_, i) => i !== index)
    onSubmit(newList)
    setList(newList)
  }

  return (
    <div>
      <List
        dataSource={list}
        footer={
          <Button onClick={() => setOpen(true)} type='primary'>
            <PlusCircleOutlined /> add element
          </Button>
        }
        renderItem={(item, index) => (
          <List.Item actions={[<Button icon={<DeleteOutlined />} onClick={() => onRemove(index)} shape='circle' type='text' />]}>
            {(typeof item === 'object' && item !== null && displayField in item)
              ? (
                <Popover content={
                  <div>
                    { Object.entries(item).map(([key, value]) => (
                      <div key={key}>
                        <strong>{key}:</strong> {value as React.ReactNode}
                      </div>
                    )) }
                  </div>
                }>
                  <Tag>{ (item as Record<string, unknown>)[displayField] as React.ReactNode }</Tag>
                </Popover>
              )
              : null}
          </List.Item>
        )}
      />

      <Drawer
        closable={false}
        destroyOnHidden
        extra={
          <Button onClick={() => form.submit()} type='primary'>
            Submit
          </Button>
        }
        getContainer={() => container}
        onClose={() => setOpen(false)}
        open={open}
        style={{ position: 'absolute' }}
        title='Add element'
      >
        <Form
          autoComplete='off'
          form={form}
          layout='vertical'
          name='formObjects'
          onFinish={(values) => {
            const newList = [...list, values]
            onSubmit(newList)
            setList(newList)
            setOpen(false)
            form.resetFields()
          }}
        >
          {fields}
        </Form>
      </Drawer>
    </div>
  )
}

export default ListObjectFields
