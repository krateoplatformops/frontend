import { LoadingOutlined } from '@ant-design/icons'
import { useQuery } from '@tanstack/react-query'
import type { FormInstance } from 'antd'
import { AutoComplete as AntDAutoComplete, Spin } from 'antd'
import useApp from 'antd/es/app/useApp'
import type { DefaultOptionType } from 'antd/es/select'
import type { JSONSchema4Type } from 'json-schema'
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
  optionsEnum?: JSONSchema4Type[] | undefined
}

const AutoComplete = ({ data, form, optionsEnum, resourcesRefs }: AutoCompleteProps) => {
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

  const options: DefaultOptionType[] = useMemo(() => {
    if (optionsEnum?.length) {
      return optionsEnum
        .filter((optionValue): optionValue is string | number => typeof optionValue === 'string' || typeof optionValue === 'number')
        .map((optionValue) => ({ label: String(optionValue), value: optionValue }))
    }

    return []
  }, [optionsEnum])

  const { data: queriedOptions = [], isLoading } = useQuery<DefaultOptionType[]>({
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
      options={optionsEnum ? options : queriedOptions}
      placeholder='Start typing...'
      suffixIcon={isLoading ? <Spin indicator={<LoadingOutlined />} size='small' /> : null}
      value={form.getFieldValue(name) as string | undefined}
    />
  )
}

export default AutoComplete
