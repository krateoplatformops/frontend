import { AutoComplete as AntAutoComplete, type AutoCompleteProps } from 'antd'
import debounce from 'lodash/debounce'
import { useState } from 'react'

import useCatchError from '../../../hooks/useCatchError'

const AutoComplete = ({ fetchOptions }: { fetchOptions: {
    url: string
    verb: string
  }}) => {
  const [options, setOptions] = useState<AutoCompleteProps['options']>([])
  const { catchError } = useCatchError()

  const getOptions = async (text: string) => {
    if (!fetchOptions) {
      return
    }
    try {
      let response: Response | undefined
      let data: unknown
      if (fetchOptions.verb.toUpperCase() === 'GET') {
        response = await fetch(`${fetchOptions.url}?q=${text}`)
        data = await response.json()
      }
      if (fetchOptions.verb.toUpperCase() === 'POST') {
        response = await fetch(fetchOptions.url, {
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
        console.error('Invalid response format:', data)
      }
    } catch {
      catchError({ message: 'Unable to retrieve field data' })
    }
  }

  const handleSearch = debounce((text: string) => {
    void getOptions(text)
  }, 1000)

  return (
    <AntAutoComplete
      filterOption={(inputValue, option) => {
        if (option && typeof option.value === 'string') {
          return option.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
        }
        return false
      }}
      onSearch={(text) => handleSearch(text)}
      options={options}
    />
  )
}

export default AutoComplete
