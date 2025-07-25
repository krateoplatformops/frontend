import { useQuery } from '@tanstack/react-query'
import { Form, type FormInstance, Select } from 'antd'
import { useEffect } from 'react'

type AsyncSelectProps = {
  fetchOptions: {
    url: string
    verb: string
  }
  name: string[]
  dependsField: {
    field: string
    when: 'non-empty' | 'changed' | 'matchRegex'
  }
  form: FormInstance
}

const AsyncSelect = ({ dependsField, fetchOptions, form, name }: AsyncSelectProps) => {
  const dependField = Form.useWatch<string | undefined>(dependsField.field, form)

  useEffect(() => {
    // if the dependent field change his value, reset the form field
    if (form.getFieldValue(name[0]) !== undefined) {
      form.setFieldValue(name[0], undefined)
      form.resetFields(name)
    }
  }, [dependField, form, name])

  const fetchDependField = () => {
    if (fetchOptions.verb.toUpperCase() === 'GET') {
      return fetch(`${fetchOptions.url}?q=${dependField}`)
        .then(res => res.json())
    }
    if (fetchOptions.verb.toUpperCase() === 'POST') {
      return fetch(fetchOptions.url, {
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
    queryFn: () => fetchDependField(),
    queryKey: ['dependField', dependField, name, fetchOptions.url],
  })

  return (
    dependField === undefined ? (
      <Select disabled options={[]} />
    ) : (
      <Select allowClear onChange={(val) => form.setFieldValue(name[0], val)} options={options?.map(item => ({ label: item, value: item }))} />
    )
  )
}

export default AsyncSelect
