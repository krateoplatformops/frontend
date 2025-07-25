import { useQuery } from '@tanstack/react-query'
import { Form, type FormInstance, Select } from 'antd'
import { useEffect } from 'react'

import type { FormWidgetData } from '../Form'

type AsyncSelectProps = {
  dependency: NonNullable<FormWidgetData['dependencies']>[number]
  form: FormInstance
  name: string
}

const AsyncSelect = ({ dependency, form, name }: AsyncSelectProps) => {
  const { dependsField: { field }, fetch: { url, verb } } = dependency

  const dependField = Form.useWatch<string | undefined>(field, form)

  useEffect(() => {
    const currentValue = form.getFieldValue(name) as string
    if (currentValue !== undefined) {
      form.setFieldsValue({ [name]: undefined })
    }
  }, [dependField, form, name])

  const fetchDependField = (): Promise<string[]> => {
    if (verb.toUpperCase() === 'GET') {
      return fetch(`${url}?q=${dependField}`)
        .then(res => res.json())
    }
    if (verb.toUpperCase() === 'POST') {
      return fetch(url, {
        body: dependField,
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'POST',
      }).then(res => res.json())
    }
    return Promise.resolve([])
  }

  const { data: options } = useQuery<string[]>({
    enabled: dependField !== undefined,
    queryFn: async (): Promise<string[]> => fetchDependField(),
    queryKey: ['dependField', dependField, name, url],
  })

  return (
    dependField === undefined ? (
      <Select disabled options={[]} />
    ) : (
      <Select
        allowClear
        onChange={value => form.setFieldsValue({ [name]: value })}
        options={options?.map(item => ({ label: item, value: item }))}
        value={form.getFieldValue(name) as string | undefined}
      />
    )
  )
}

export default AsyncSelect
