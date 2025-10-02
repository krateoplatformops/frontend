import { LoadingOutlined } from '@ant-design/icons'
import type { AutoCompleteProps as AntDAutoCompleteProps } from 'antd'
import { AutoComplete as AntDAutoComplete, Spin } from 'antd'
import debounce from 'lodash/debounce'
import { useEffect, useMemo, useState } from 'react'

import type { ResourcesRefs } from '../../../types/Widget'
import type { FormWidgetData } from '../Form'

import { getOptionsFromResourceRefId } from './utils'

interface AutoCompleteProps {
  data: NonNullable<FormWidgetData['autocomplete']>[number]
  resourcesRefs: ResourcesRefs
}

const AutoComplete = ({ data, resourcesRefs }: AutoCompleteProps) => {
  const { extra, resourceRefId } = data

  const [options, setOptions] = useState<AntDAutoCompleteProps['options']>([])
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const debouncedGetOptions = useMemo(() =>
    debounce(async (searchValue: string) => {
      setIsLoading(true)
      const options = await getOptionsFromResourceRefId(searchValue, resourceRefId, resourcesRefs, extra.key)
      setIsLoading(false)
      setOptions(options)
    }, 1000),
  [extra.key, resourceRefId, resourcesRefs])

  useEffect(() => {
    return () => { debouncedGetOptions.cancel() }
  }, [debouncedGetOptions])

  const handleSearch = (searchValue: string) => {
    setIsLoading(true)
    void debouncedGetOptions(searchValue)
  }

  return (
    <AntDAutoComplete
      filterOption={(inputValue, option) => {
        if (option && typeof option.value === 'string') {
          return option.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
        }
        return false
      }}
      onSearch={(searchValue) => handleSearch(searchValue)}
      options={options}
      suffixIcon={isLoading ? <Spin indicator={<LoadingOutlined />} size='small' /> : null}
    />
  )
}

export default AutoComplete
