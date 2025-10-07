import { LoadingOutlined } from '@ant-design/icons'
import { useQuery } from '@tanstack/react-query'
import { Form, type FormInstance, Select, Spin } from 'antd'
import useApp from 'antd/es/app/useApp'
import type { DefaultOptionType } from 'antd/es/select'
import { useEffect } from 'react'

import { useConfigContext } from '../../../context/ConfigContext'
import type { ResourcesRefs } from '../../../types/Widget'
import type { FormWidgetData } from '../Form'

import { getOptionsFromResourceRefId } from './utils'

type AsyncSelectProps = {
  data: NonNullable<FormWidgetData['dependencies']>[number]
  form: FormInstance
  resourcesRefs: ResourcesRefs
  options?: DefaultOptionType[] | undefined
}

const AsyncSelect = ({ data, form, options, resourcesRefs }: AsyncSelectProps) => {
  const { notification } = useApp()
  const { config } = useConfigContext()

  const { dependsField: { field }, extra: { key }, name, resourceRefId } = data

  const dependField = Form.useWatch<string | undefined>(field, form)

  useEffect(() => {
    const currentValue = form.getFieldValue(name) as string
    if (currentValue !== undefined) {
      form.setFieldsValue({ [name]: undefined })
    }
  }, [dependField, form, name])

  const { data: queriedOptions = [], isLoading } = useQuery<DefaultOptionType[]>({
    enabled: !!(dependField && config),
    queryFn: () => getOptionsFromResourceRefId(dependField, resourceRefId, resourcesRefs, key, notification, config),
    // eslint-disable-next-line @tanstack/query/exhaustive-deps
    queryKey: ['async-select-options', resourceRefId, dependField, key],
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000,
  })

  if (!dependField) {
    return <Select disabled options={[]} />
  }

  return (
    <Select
      allowClear
      onChange={value => form.setFieldsValue({ [name]: value })}
      options={options ?? queriedOptions}
      suffixIcon={isLoading ? <Spin indicator={<LoadingOutlined />} size='small' /> : null}
      value={form.getFieldValue(name) as string | undefined}
    />
  )
}

export default AsyncSelect
