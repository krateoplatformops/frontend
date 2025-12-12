import { LoadingOutlined } from '@ant-design/icons'
import { useQuery } from '@tanstack/react-query'
import type { FormInstance } from 'antd'
import { AutoComplete as AntDAutoComplete, Spin } from 'antd'
import useApp from 'antd/es/app/useApp'
import type { DefaultOptionType } from 'antd/es/select'
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
  initialValue?: DefaultOptionType | undefined
  options?: DefaultOptionType[] | undefined
}

const AutoComplete = ({ data, form, initialValue, options, resourcesRefs }: AutoCompleteProps) => {
  const { notification } = useApp()
  const { config } = useConfigContext()
  const { extra, name, resourceRefId } = data

  const [searchValue, setSearchValue] = useState<string>('')
  const [debouncedValue, setDebouncedValue] = useState<string>('')
  const [inputValue, setInputValue] = useState<string>('')

  const debouncedUpdate = useMemo(() => debounce((val: string) => setDebouncedValue(val), 500), [])

  useEffect(() => {
    debouncedUpdate(searchValue)
    return () => debouncedUpdate.cancel()
  }, [searchValue, debouncedUpdate])

  const { data: queriedOptions = [], isLoading } = useQuery<DefaultOptionType[]>({
    enabled: !!(debouncedValue && resourceRefId && config),
    queryFn: () =>
      getOptionsFromResourceRefId(debouncedValue, resourceRefId, resourcesRefs, extra?.key, notification, config),
    // eslint-disable-next-line @tanstack/query/exhaustive-deps
    queryKey: ['autocomplete-options', resourceRefId, debouncedValue, extra?.key],
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000,
  })

  const finalOptions = options ?? queriedOptions

  useEffect(() => {
    if (initialValue) {
      form.setFieldsValue({ [name]: initialValue })
      setInputValue(initialValue.label as string)
    }
  }, [form, initialValue, name])

  const handleSelect = (_: string, { label, value }: DefaultOptionType) => {
    form.setFieldsValue({ [name]: { label: label as string, value } })
    setInputValue(label as string)
  }

  const handleChange = (val: string) => {
    setInputValue(val)
    setSearchValue(val)
  }

  return (
    <AntDAutoComplete
      filterOption={(inputValue, option) => {
        if (!option || typeof option.label !== 'string') { return false }
        return option.label.toUpperCase().includes(inputValue.toUpperCase())
      }}
      onChange={handleChange}
      onSelect={handleSelect}
      options={finalOptions}
      placeholder='Start typing...'
      suffixIcon={isLoading ? <Spin indicator={<LoadingOutlined />} size='small' /> : null}
      value={inputValue}
    />
  )
}

export default AutoComplete
