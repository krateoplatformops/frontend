import { DeleteOutlined, EditOutlined, PlusCircleOutlined } from '@ant-design/icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Button, Drawer, Flex, Form, List, Popover, Tag, Typography } from 'antd'
import type { JSONSchema4 } from 'json-schema'
import React, { useEffect, useState } from 'react'

import { getDefaultsFromSchema } from '../../widgets/Form/utils'

import styles from './ListObjectFields.module.css'

type ListObjectFieldsType = {
  container: HTMLElement
  data?: unknown[]
  fields: React.ReactNode[]
  displayField: string
  onSubmit: (data: unknown[]) => void
  schema: JSONSchema4
}

const ListObjectFields = ({ container, data = [], displayField, fields, onSubmit, schema }: ListObjectFieldsType) => {
  const [open, setOpen] = useState<boolean>(false)
  const [list, setList] = useState<unknown[]>(data)
  const [editIndex, setEditIndex] = useState<number | null>(null)
  const [form] = Form.useForm()

  useEffect(() => {
    setList(data)
  }, [data])

  const onAdd = () => {
    setEditIndex(null)
    form.resetFields()

    const defaultValues = getDefaultsFromSchema(schema)
    form.setFieldsValue(defaultValues)

    setOpen(true)
  }

  const onEdit = (index: number) => {
    const item = list[index]
    if (item && typeof item === 'object') {
      form.setFieldsValue(item)
      setEditIndex(index)
      setOpen(true)
    }
  }

  const onRemove = (index: number) => {
    const newList = list.filter((_, i) => i !== index)
    onSubmit(newList)
    setList(newList)
  }

  const getValue = (item: unknown, index: number): React.ReactNode => {
    if (!displayField || displayField === '') {
      return `object item #${index + 1}`
    }

    return displayField.split('.').reduce<unknown>((acc, key) => {
      if (acc && typeof acc === 'object' && key in acc) {
        const label = (acc as Record<string, unknown>)[key]
        if (label !== undefined && label !== null) { return label }

        return (
          <Flex align='center' gap={5}>
            <FontAwesomeIcon color='orange' icon='triangle-exclamation' />
            <Typography.Text>object item #{index + 1}</Typography.Text>
          </Flex>
        )
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
    return [<div key={path}><strong>{path}</strong>: { typeof obj === 'string' ? obj : String(obj) }</div>]
  }

  return (
    <div className={styles.listObjectFields}>
      <List
        dataSource={list}
        footer={
          <Button onClick={onAdd} type='primary'>
            <PlusCircleOutlined /> Add element
          </Button>
        }
        locale={{ emptyText: <></> }}
        renderItem={(item, index) => (
          <List.Item
            actions={[
              <Button icon={<EditOutlined />} key='edit' onClick={() => onEdit(index)} shape='circle' type='text' />,
              <Button icon={<DeleteOutlined />} key='delete' onClick={() => onRemove(index)} shape='circle' type='text' />,
            ]}
            key={index}
          >
            {(typeof item === 'object' && item !== null)
              ? (
                <Popover content={<div>{getPopoverContent(item)}</div>}>
                  <Tag>{getValue(item, index)}</Tag>
                </Popover>
              )
              : null
            }
          </List.Item>
        )}
      />

      <Drawer
        closable={false}
        extra={
          <Button onClick={() => form.submit()} type='primary'>
            Submit
          </Button>
        }
        getContainer={() => container}
        onClose={() => setOpen(false)}
        open={open}
        style={{ position: 'absolute' }}
        title={editIndex !== null ? 'Edit element' : 'Add element'}
      >
        <Form
          autoComplete='off'
          form={form}
          layout='vertical'
          name='formObjects'
          onFinish={(values) => {
            const newList: unknown[] = editIndex !== null
              ? list.map((item, index) => (index === editIndex ? values as unknown[] : item))
              : [...list, values]

            onSubmit(newList)
            setList(newList)
            setOpen(false)
            setEditIndex(null)
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
