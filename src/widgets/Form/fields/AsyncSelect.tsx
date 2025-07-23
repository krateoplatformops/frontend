import { useQuery } from '@tanstack/react-query'
import { Form, type FormInstance, Select } from 'antd'

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

  const { data: options } = useQuery<string[]>({
    enabled: dependField !== undefined,
    queryFn: () => fetch(fetchOptions.url).then(res => res.json()),
    queryKey: ['dependField', dependField, name, fetchOptions.url],
  })

  return (
    <Select options={options?.map(item => ({ label: item, value: item }))} />
  )
}

export default AsyncSelect
