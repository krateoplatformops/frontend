import { useQuery } from '@tanstack/react-query'
import { Form, type FormInstance, Select } from 'antd'
import useApp from 'antd/es/app/useApp'
import type { DefaultOptionType } from 'antd/es/select'
import { useEffect } from 'react'

import type { ResourcesRefs } from '../../../types/Widget'
import { getResourceRef } from '../../../utils/utils'
import type { FormWidgetData } from '../Form'

type AsyncSelectProps = {
  data: NonNullable<FormWidgetData['dependencies']>[number]
  form: FormInstance
  resourcesRefs: ResourcesRefs
}

const AsyncSelect = ({ data, form, resourcesRefs }: AsyncSelectProps) => {
  const { dependsField: { field }, extra, name, resourceRefId } = data

  const { notification } = useApp()

  const dependField = Form.useWatch<string | undefined>(field, form)

  useEffect(() => {
    const currentValue = form.getFieldValue(name) as string
    if (currentValue !== undefined) {
      form.setFieldsValue({ [name]: undefined })
    }
  }, [dependField, form, name])

  const fetchDependField = async (value: string | undefined): Promise<DefaultOptionType[]> => {
    const resourceRef = getResourceRef(resourceRefId, resourcesRefs)

    if (!resourceRef) {
      notification.error({
        description: `Cannot find resources refs for resource ref with ID ${resourceRefId}`,
        message: 'Error while retrieving options',
        placement: 'bottomLeft',
      })

      return []
    }

    try {
      const { path, verb } = resourceRef

      const url = new URL(path)
      url.searchParams.set('extras', JSON.stringify({ [extra.key]: value }))

      const response = await fetch(url.toString(), {
        ...(verb === 'POST' && { headers: { 'Content-Type': 'application/json' } }),
        method: verb,
      })

      if (!response.ok) {
        notification.error({
          description: 'No response received',
          message: 'Error while retrieving options',
          placement: 'bottomLeft',
        })

        return []
      }

      const data = await response.json() as DefaultOptionType[]
      return data
    } catch (error) {
      notification.error({
        description: 'There has been an unhandled error while retrieving field options',
        message: 'Error while retrieving options',
        placement: 'bottomLeft',
      })
      console.error('fetchDependField error:', error)
      return []
    }
  }

  const { data: options } = useQuery<DefaultOptionType[]>({
    enabled: dependField !== undefined,
    queryFn: async (): Promise<DefaultOptionType[]> => fetchDependField(dependField),
    queryKey: ['dependField', dependField, name, resourceRefId],
  })

  if (dependField === undefined) {
    return <Select disabled options={[]} />
  }

  return (
    <Select
      allowClear
      onChange={value => form.setFieldsValue({ [name]: value })}
      options={options?.map(item => ({ label: item, value: item }))}
      value={form.getFieldValue(name) as string | undefined}
    />
  )
}

export default AsyncSelect
