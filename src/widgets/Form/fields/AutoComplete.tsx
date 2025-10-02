import { LoadingOutlined } from '@ant-design/icons'
import type { AutoCompleteProps as AntDAutoCompleteProps } from 'antd'
import { AutoComplete as AntDAutoComplete, Spin } from 'antd'
import useApp from 'antd/es/app/useApp'
import type { DefaultOptionType } from 'antd/es/select'
import debounce from 'lodash/debounce'
import { useCallback, useEffect, useMemo, useState } from 'react'

import type { ResourcesRefs } from '../../../types/Widget'
import { getResourceRef } from '../../../utils/utils'
import type { FormWidgetData } from '../Form'

interface AutoCompleteProps {
  data: NonNullable<FormWidgetData['autocomplete']>[number]
  resourcesRefs: ResourcesRefs
}

const AutoComplete = ({ data, resourcesRefs }: AutoCompleteProps) => {
  const { extra, resourceRefId } = data

  const [options, setOptions] = useState<AntDAutoCompleteProps['options']>([])
  const { notification } = useApp()
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const getOptions = useCallback(async (value: string) => {
    const resourceRef = getResourceRef(resourceRefId, resourcesRefs)

    if (!resourceRef) {
      notification.error({
        description: `Cannot find resources refs for resource ref with ID ${resourceRefId}`,
        message: 'Error while retrieving options',
        placement: 'bottomLeft',
      })

      setIsLoading(false)
      return []
    }

    try {
      const { path, verb } = resourceRef

      const url = new URL(path)
      url.searchParams.set('extras', JSON.stringify({ [extra.key]: value }))

      const response = await fetch(url.toString(), {
        ...(verb === 'POST' && { headers: { 'Content-Type': 'application/json' } }),
        method: verb,
      })

      if (!response.ok) {
        notification.error({
          description: 'No response received',
          message: 'Error while retrieving options',
          placement: 'bottomLeft',
        })

        setIsLoading(false)
        return []
      }

      const data = await response.json() as DefaultOptionType[]
      return data
    } catch {
      notification.error({
        description: 'There has been an unhandled error while retrieving field options',
        message: 'Error while retrieving options',
        placement: 'bottomLeft',
      })
    } finally {
      setIsLoading(false)
    }
  }, [extra, notification, resourceRefId, resourcesRefs])

  const debouncedGetOptions = useMemo(() =>
    debounce(async (searchValue: string) => {
      const options = await getOptions(searchValue)
      setOptions(options)
    }, 1000),
  [getOptions])

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
