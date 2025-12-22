import { LoadingOutlined } from '@ant-design/icons'
import { useQuery } from '@tanstack/react-query'
import type { FormInstance } from 'antd'
import { AutoComplete as AntDAutoComplete, Spin } from 'antd'
import useApp from 'antd/es/app/useApp'
import type { DefaultOptionType } from 'antd/es/select'
import debounce from 'lodash/debounce'
import { useEffect, useMemo, useRef, useState } from 'react'

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

  const initialValueAppliedRef = useRef(false)

  const queryValue = useMemo(() => debouncedValue || initialValue?.value, [debouncedValue, initialValue])

  const debouncedUpdate = useMemo(() => debounce((val: string) => setDebouncedValue(val), 500), [])

  useEffect(() => {
    debouncedUpdate(searchValue)
    return () => debouncedUpdate.cancel()
  }, [searchValue, debouncedUpdate])

  const { data: queriedOptions = [], isLoading } = useQuery<DefaultOptionType[]>({
    enabled: !!(queryValue && resourceRefId && config),
    queryFn: () =>
      getOptionsFromResourceRefId(
        queryValue as string,
        resourceRefId,
        resourcesRefs,
        extra?.key,
        notification,
        config,
      ),
    queryKey: ['autocomplete-options', resourceRefId, queryValue, extra?.key, resourcesRefs, notification, config],
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000,
  })

  const finalOptions = useMemo(() => options ?? queriedOptions, [options, queriedOptions])

  /**
   * Apply initialValue ONCE
   * - only if present
   * - only if field not touched
   */
  useEffect(() => {
    if (!initialValue || initialValueAppliedRef.current) {
      return
    }

    if (form.isFieldTouched(name)) {
      initialValueAppliedRef.current = true
      return
    }

    form.setFieldsValue({ [name]: initialValue })
    const { label } = initialValue
    setInputValue(
      typeof label === 'string' || typeof label === 'number'
        ? String(label)
        : ''
    )

    initialValueAppliedRef.current = true
  }, [initialValue, form, name])

  /**
   * Validate current value against options
   * (runs also after async fetch)
   */
  useEffect(() => {
    if (!initialValueAppliedRef.current) {
      return
    }

    const currentValue = form.getFieldValue(name) as DefaultOptionType | undefined
    if (!currentValue || finalOptions.length === 0) {
      return
    }

    const optionExists = finalOptions.some(({ value }) => String(value) === String(currentValue.value))

    if (!optionExists) {
      console.warn(`Initial value does not exist in options for "${name}"`, currentValue)
      form.setFieldValue(name, undefined)
      setInputValue('')
    }
  }, [finalOptions, form, name])

  const handleSelect = (_: string, { label, value }: DefaultOptionType) => {
    form.setFieldsValue({ [name]: { label: label as string, value } })
    setInputValue(
      typeof label === 'string' || typeof label === 'number'
        ? String(label)
        : ''
    )
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
