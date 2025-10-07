import { LoadingOutlined } from '@ant-design/icons'
import { useQuery } from '@tanstack/react-query'
import type { AutoCompleteProps as AntDAutoCompleteProps, FormInstance } from 'antd'
import { AutoComplete as AntDAutoComplete, Spin } from 'antd'
import useApp from 'antd/es/app/useApp'
import debounce from 'lodash/debounce'
import { useEffect, useMemo, useState } from 'react'

import { useConfigContext } from '../../../context/ConfigContext'
import type { ResourcesRefs } from '../../../types/Widget'
import type { FormWidgetData } from '../Form'

import { getOptionsFromResourceRefId } from './utils'

interface AutoCompleteProps {
  data: NonNullable<FormWidgetData['autocomplete']>[number]
  form: FormInstance
  resourcesRefs: ResourcesRefs
}

const AutoComplete = ({ data, form, resourcesRefs }: AutoCompleteProps) => {
  const { notification } = useApp()
  const { config } = useConfigContext()
  const { extra: { key }, name, resourceRefId } = data

  const [searchValue, setSearchValue] = useState<string>('')
  const [debouncedValue, setDebouncedValue] = useState<string>('')

  const debouncedUpdate = useMemo(() => debounce((val: string) => setDebouncedValue(val), 500), [])

  useEffect(() => {
    debouncedUpdate(searchValue)
    return () => debouncedUpdate.cancel()
  }, [searchValue, debouncedUpdate])

  const { data: options = [], isLoading } = useQuery<AntDAutoCompleteProps['options']>({
    enabled: !!(debouncedValue && resourceRefId && config),
    queryFn: () =>
      getOptionsFromResourceRefId(debouncedValue, resourceRefId, resourcesRefs, key, notification, config),
    // eslint-disable-next-line @tanstack/query/exhaustive-deps
    queryKey: ['autocomplete-options', resourceRefId, debouncedValue, key],
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000,
  })

  return (
    <AntDAutoComplete
      filterOption={(inputValue, option) => {
        if (option && typeof option.value === 'string') {
          return option.value.toUpperCase().includes(inputValue.toUpperCase())
        }
        return false
      }}
      onChange={(value) => form.setFieldsValue({ [name]: value })}
      onSearch={setSearchValue}
      options={options}
      placeholder='Start typing...'
      suffixIcon={isLoading ? <Spin indicator={<LoadingOutlined />} size='small' /> : null}
      value={form.getFieldValue(name) as string | undefined}
    />
  )
}

export default AutoComplete
