import { useQuery } from '@tanstack/react-query'
import { Form, type FormInstance, Select } from 'antd'
import type { DefaultOptionType } from 'antd/es/select'
import { useEffect } from 'react'

import type { ResourcesRefs } from '../../../types/Widget'
import type { FormWidgetData } from '../Form'

import { getOptionsFromResourceRefId } from './utils'

type AsyncSelectProps = {
  data: NonNullable<FormWidgetData['dependencies']>[number]
  form: FormInstance
  resourcesRefs: ResourcesRefs
}

const AsyncSelect = ({ data, form, resourcesRefs }: AsyncSelectProps) => {
  const { dependsField: { field }, extra, name, resourceRefId } = data

  const dependField = Form.useWatch<string | undefined>(field, form)

  useEffect(() => {
    const currentValue = form.getFieldValue(name) as string
    if (currentValue !== undefined) {
      form.setFieldsValue({ [name]: undefined })
    }
  }, [dependField, form, name])

  const { data: options } = useQuery<DefaultOptionType[]>({
    enabled: dependField !== undefined,
    queryFn: async () => getOptionsFromResourceRefId(dependField, resourceRefId, resourcesRefs, extra.key),
    queryKey: ['dependField', dependField, name, resourceRefId, resourcesRefs, extra.key],
  })

  if (dependField === undefined) {
    return <Select disabled options={[]} />
  }

  return (
    <Select
      allowClear
      onChange={value => form.setFieldsValue({ [name]: value })}
      options={options}
      value={form.getFieldValue(name) as string | undefined}
    />
  )
}

export default AsyncSelect
