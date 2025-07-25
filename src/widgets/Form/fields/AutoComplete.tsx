import { LoadingOutlined } from '@ant-design/icons'
import { AutoComplete as AntDAutoComplete, Spin, type AutoCompleteProps as AntDAutoCompleteProps } from 'antd'
import useApp from 'antd/es/app/useApp'
import debounce from 'lodash/debounce'
import { useCallback, useEffect, useMemo, useState } from 'react'

import useCatchError from '../../../hooks/useCatchError'

interface AutoCompleteProps {
  fetchOptions: {
    url: string
    verb: string
  }
}

const AutoComplete = ({ fetchOptions }: AutoCompleteProps) => {
  const [options, setOptions] = useState<AntDAutoCompleteProps['options']>([])
  const { catchError } = useCatchError()
  const { notification } = useApp()
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const getOptions = useCallback(async (text: string) => {
    if (!fetchOptions) {
      return
    }

    const { url, verb } = fetchOptions

    try {
      let response: Response | undefined
      let data: unknown

      if (verb.toUpperCase() === 'GET') {
        response = await fetch(`${url}?q=${text}`)
        data = await response.json()
      }

      if (verb.toUpperCase() === 'POST') {
        response = await fetch(url, {
          body: text,
          headers: {
            'Content-Type': 'application/json',
          },
          method: 'POST',
        })
        data = await response.json()
      }

      if (Array.isArray(data)) {
        setOptions(data.map((item: string) => ({ value: item })))
      } else {
        notification.error({
          description: 'Invalid response format',
          message: 'Error while retrieving options',
          placement: 'bottomLeft',
        })
        console.error('Invalid response format:', data)
      }
    } catch {
      notification.error({
        description: 'There has been an unhandled error while retrieving field options',
        message: 'Error while retrieving options',
        placement: 'bottomLeft',
      })
      catchError({ message: 'Unable to retrieve field data' })
    } finally {
      setIsLoading(false)
    }
  }, [catchError, fetchOptions, notification])

  const debouncedGetOptions = useMemo(() => debounce((text: string) => getOptions(text), 1000), [getOptions])

  useEffect(() => {
    return () => { debouncedGetOptions.cancel() }
  }, [debouncedGetOptions])

  const handleSearch = (text: string) => {
    setIsLoading(true)
    void debouncedGetOptions(text)
  }

  return (
    <AntDAutoComplete
      filterOption={(inputValue, option) => {
        if (option && typeof option.value === 'string') {
          return option.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
        }
        return false
      }}
      onSearch={(text) => handleSearch(text)}
      options={options}
      suffixIcon={isLoading ? <Spin indicator={<LoadingOutlined />} size='small' /> : null}
    />
  )
}

export default AutoComplete
