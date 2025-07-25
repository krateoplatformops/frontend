import { useQuery } from '@tanstack/react-query'
import { Form, type FormInstance, Select } from 'antd'

import type { FormWidgetData } from '../Form'

type AsyncSelectProps = {
  dependency: NonNullable<FormWidgetData['dependencies']>[number]
  form: FormInstance
  name: string
}

const AsyncSelect = ({ dependency, form, name }: AsyncSelectProps) => {
  const { dependsField: { field }, fetch: { url } } = dependency

  const dependField = Form.useWatch<string | undefined>(field, form)

  const { data: options } = useQuery<string[]>({
    enabled: dependField !== undefined,
    queryFn: () => fetch(url).then(res => res.json()),
    queryKey: ['dependField', dependField, name, url],
  })

  return (
    <Select options={options?.map(item => ({ label: item, value: item }))} />
  )
}

export default AsyncSelect
