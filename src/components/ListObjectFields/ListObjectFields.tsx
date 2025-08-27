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

  const getValue = (item: unknown): React.ReactNode => {
    return displayField.split('.').reduce<unknown>((acc, key) => {
      if (acc && typeof acc === 'object' && key in acc) {
        return (acc as Record<string, unknown>)[key]
      }
      return undefined
    }, item) as React.ReactNode
  }

  const getPopoverContent = (obj: unknown, path: string = ''): React.ReactNode[] => {
    if (obj && typeof obj === 'object' && !Array.isArray(obj)) {
      return Object.entries(obj as Record<string, unknown>).flatMap(([key, value]) =>
        getPopoverContent(value, path ? `${path}.${key}` : key)
      )
    }
    return [<div><strong>{path}</strong>: { typeof obj === 'string' ? obj : String(obj) }</div>]
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
          <List.Item actions={[<Button icon={<DeleteOutlined />} onClick={() => onRemove(index)} shape='circle' type='text' />]} key={index}>
            {(typeof item === 'object' && item !== null)
              ? (
                <Popover content={
                  <div>
                    {getPopoverContent(item)}
                  </div>
                }>
                  <Tag>{ getValue(item) }</Tag>
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
