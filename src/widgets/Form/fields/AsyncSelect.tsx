import { LoadingOutlined } from '@ant-design/icons'
import { useQuery } from '@tanstack/react-query'
import { Form, type FormInstance, Select, Spin } from 'antd'
import useApp from 'antd/es/app/useApp'
import type { DefaultOptionType } from 'antd/es/select'
import { useEffect, useState } from 'react'

import { useConfigContext } from '../../../context/ConfigContext'
import type { ResourcesRefs } from '../../../types/Widget'
import type { FormWidgetData } from '../Form'

import { getOptionsFromResourceRefId } from './utils'

type AsyncSelectProps = {
  data: NonNullable<FormWidgetData['dependencies']>[number]
  form: FormInstance
  resourcesRefs: ResourcesRefs
}

const AsyncSelect = ({ data, form, resourcesRefs }: AsyncSelectProps) => {
  const { notification } = useApp()
  const { config } = useConfigContext()

  const { dependsField: { field }, extra, name, resourceRefId } = data

  const [isLoading, setIsLoading] = useState<boolean>(false)

  const dependField = Form.useWatch<string | undefined>(field, form)

  useEffect(() => {
    const currentValue = form.getFieldValue(name) as string
    if (currentValue !== undefined) {
      form.setFieldsValue({ [name]: undefined })
    }
  }, [dependField, form, name])

  const { data: options } = useQuery<DefaultOptionType[]>({
    enabled: dependField !== undefined,
    queryFn: async () => {
      setIsLoading(true)
      const options = await getOptionsFromResourceRefId(dependField, resourceRefId, resourcesRefs, extra.key, notification, config)
      setIsLoading(false)

      return options
    },
    queryKey: ['dependField', dependField, name, resourceRefId, resourcesRefs, extra.key, notification, config],
  })

  if (dependField === undefined) {
    return <Select disabled options={[]} />
  }

  return (
    <Select
      allowClear
      onChange={value => form.setFieldsValue({ [name]: value })}
      options={options}
      suffixIcon={isLoading ? <Spin indicator={<LoadingOutlined />} size='small' /> : null}
      value={form.getFieldValue(name) as string | undefined}
    />
  )
}

export default AsyncSelect
