import { Button, DatePicker, Form, Input, Radio, Select, Space } from 'antd'
import { useEffect } from 'react'

import { useFilter } from '../../components/FiltesProvider/FiltersProvider'
import type { WidgetProps } from '../../types/Widget'
import { closeDrawer } from '../Drawer/Drawer'

import type { Filters as WidgetType } from './Filters.type'

export type FiltersWidgetData = WidgetType['spec']['widgetData']

const Filters = ({ widgetData }: WidgetProps<FiltersWidgetData>) => {
  const { fields, prefix } = widgetData
  const { clearFilters, getFilters, setFilters } = useFilter()

  const [filterForm] = Form.useForm()

  const renderField = (item: { label: string; name: string[]; description?: string; type: 'string' | 'boolean' | 'number' | 'date' | 'daterange'; options?: string[] }) => {
    return (
      <Form.Item
        key={item.name.join('.')}
        label={item.label}
        name={item.name.join('.')}
        tooltip={item.description}
      >
        {(() => {
          switch (item.type) {
            case 'string':
              if (item.options) {
                if (item.options.length > 4) {
                  return (
                    <Select
                      allowClear
                      options={item.options.map(opt => ({ label: opt, value: opt }))}
                    />
                  )
                }
                return (
                  <Radio.Group>
                    {item.options.map((el) => (
                      <Radio key={`radio_${el}`} value={el}>
                        {el}
                      </Radio>
                    ))}
                  </Radio.Group>
                )
              }
              return <Input />

            case 'number':
              return <Input type='number' />

            case 'boolean':
              return (
                <Select>
                  <Select.Option value=''> </Select.Option>
                  <Select.Option value='true'>True</Select.Option>
                  <Select.Option value='false'>False</Select.Option>
                </Select>
              )

            case 'date':
              return <DatePicker allowClear />
            case 'daterange':
              return <DatePicker.RangePicker allowClear />
            default:
              return null
          }
        })()}
      </Form.Item>
    )
  }

  const onReset = () => {
    filterForm.resetFields()
    clearFilters(prefix)
    closeDrawer()
  }

  const onSubmit = (values: Record<string, unknown>) => {
    // apply filters
    setFilters(
      prefix,
      Object.keys(values).map(fieldName => {
        const field = fields.find(el => el.name.join('.') === fieldName)
        return {
          fieldName: Array.isArray(fieldName) ? fieldName : [fieldName],
          fieldType: field?.type ?? 'string',
          fieldValue: values[fieldName],
        }
      })
    )
    closeDrawer()
  }

  useEffect(() => {
    const filters = getFilters(prefix)
    if (filters) {
      filters.forEach(({ fieldName, fieldValue }) =>
        filterForm.setFieldValue(fieldName, fieldValue)
      )
    }
  }, [filterForm, getFilters, prefix])

  return (
    <>
      <Form
        autoComplete='off'
        form={filterForm}
        layout='vertical'
        name='filterForm'
        onFinish={onSubmit}
      >
        { fields.map(item => renderField(item)) }
      </Form>
      <Space>
        <Button onClick={onReset} type='text'>Reset</Button>
        <Button onClick={() => filterForm.submit()} type='primary'>Apply</Button>
      </Space>
    </>
  )
}

export default Filters
