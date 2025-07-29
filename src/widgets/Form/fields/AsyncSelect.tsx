import { useQuery } from '@tanstack/react-query'
import { Form, type FormInstance, Select } from 'antd'
import useApp from 'antd/es/app/useApp'
import { useEffect } from 'react'

import type { FormWidgetData } from '../Form'

type AsyncSelectProps = {
  dependency: NonNullable<FormWidgetData['dependencies']>[number]
  form: FormInstance
  name: string
}

const AsyncSelect = ({ dependency, form, name }: AsyncSelectProps) => {
  const { dependsField: { field }, fetch: { queryParam = 'q', url, verb } } = dependency

  const { notification } = useApp()

  const dependField = Form.useWatch<string | undefined>(field, form)

  useEffect(() => {
    const currentValue = form.getFieldValue(name) as string
    if (currentValue !== undefined) {
      form.setFieldsValue({ [name]: undefined })
    }
  }, [dependField, form, name])

  const fetchDependField = async (): Promise<string[]> => {
    try {
      let response: Response

      if (verb === 'GET') {
        const searchParams = new URLSearchParams({ [queryParam]: dependField ?? '' })
        response = await fetch(`${url}?${searchParams.toString()}`)
      } else if (verb === 'POST') {
        response = await fetch(url, {
          body: JSON.stringify({ [queryParam]: dependField ?? '' }),
          headers: {
            'Content-Type': 'application/json',
          },
          method: 'POST',
        })
      } else {
        return []
      }

      const data = await response.json() as string[]
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

  const { data: options } = useQuery<string[]>({
    enabled: dependField !== undefined,
    queryFn: async (): Promise<string[]> => fetchDependField(),
    queryKey: ['dependField', dependField, name, url],
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
