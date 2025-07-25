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
  const { dependsField: { field }, fetch: { url } } = dependency

  const dependField = Form.useWatch<string | undefined>(field, form)

  useEffect(() => {
    const currentValue = form.getFieldValue(name) as string
    if (currentValue !== undefined) {
      form.setFieldsValue({ [name]: undefined })
    }
  }, [dependField, form, name])

  const { data: options } = useQuery<string[]>({
    enabled: dependField !== undefined,
    queryFn: async (): Promise<string[]> => {
      const res = await fetch(url)
      return await res.json() as string[]
    },
    queryKey: ['dependField', dependField, name, url],
  })

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
