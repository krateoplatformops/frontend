import { Button, Form, Input, Radio, Select, Space } from 'antd'

import { useFilter } from '../../components/FiltesProvider/FiltersProvider'
import type { WidgetProps } from '../../types/Widget'

import type { Filters as WidgetType } from './Filters.type'

export type FiltersWidgetData = WidgetType['spec']['widgetData']

const Filters = ({ widgetData }: WidgetProps<FiltersWidgetData>) => {
  const { fields, prefix } = widgetData
  const { clearFilters, setFilters } = useFilter()

  const [filterForm] = Form.useForm()

  const renderField = (item: { label: string; name: string; description?: string; type: 'string' | 'boolean' | 'number'; options?: string[] }) => {
    return (
      <Form.Item
        key={item.name}
        label={item.label}
        name={item.name}
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
  }

  const onSubmit = (values: Record<string, unknown>) => {
    // apply filters
    setFilters(
      prefix,
      Object.keys(values).map(fieldName => {
        const field = fields.find(el => el.name === fieldName)
        return {
          fieldName,
          fieldType: field?.type ?? 'string',
          fieldValue: values[fieldName],
        }
      })
    )
  }

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
        <Button onClick={() => filterForm.submit()}>Apply</Button>
      </Space>
    </>
  )
}

export default Filters
