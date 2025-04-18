import Ajv from 'ajv'
import { Button as AntButton } from 'antd'
import { useEffect, useState } from 'react'

import useApiFetch from '../../hooks/useApiFetch'
import { useEvents } from '../../hooks/useEvents'
import buttonSchema from '../../schemas/Button.schema.json'
import type { ButtonSchema } from '../../types/Button.schema'
import Button from '../../widgets/Button'


const Page: React.FC = () => {
  const [schema, setSchema] = useState<ButtonSchema | null>(null)

  /* Events emit/listener sample */
  const [textPage, setTextPage] = useState<string>('')
  /* The component knows its events to type */
  type MyEvent = {
    textPage: string
  }
  const { on, off, emit } = useEvents<MyEvent>()
  /* The component knows its events to listen */
  useEffect(() => {
    const callback = (payload: string) => {
      setTextPage(payload)
    }

    on('textPage', callback)

    return () => {
      off('textPage', callback)
    }
  }, [on, off])

  /* End of events emit/listener sample */

  /* Fetching sample */
    type PutResponse = {
      name: string
      data: {
        'CPU model': string
        'Hard disk size': string
        color: string
        price: number
        year: number
      }
    };

    const { isLoading: isLoadingPut, isSuccess: isSuccessPut, isError: isErrorPut, error: errorPut, data: dataPut, execute: put } = useApiFetch<PutResponse>({
      autoFetch: false,
      endpoint: 'https://api.restful-api.dev/objects/7',
      method: 'PUT',
    })

    type PostResponse = {
      name: string
      data: {
        'CPU model': string
        'Hard disk size': string
        color: string
        price: number
        year: number
      }
    };

    const { isLoading: isLoadingPost, isSuccess: isSuccessPost, isError: isErrorPost, error: errorPost, data: dataPost, execute: post } = useApiFetch<PostResponse>({
      autoFetch: false,
      endpoint: 'https://api.restful-api.dev/objects',
      method: 'POST',
    })

    type DeleteResponse = {
      message: string
    };

    const { isLoading: isLoadingDelete, isSuccess: isSuccessDelete, isError: isErrorDelete, error: errorDelete, data: dataDelete, execute: del } = useApiFetch<DeleteResponse>({
      autoFetch: false,
      endpoint: 'https://api.restful-api.dev/objects/6',
      method: 'DELETE',
    })

    const { isLoading: isLoadingGet, isSuccess: isSuccessGet, isError: isErrorGet, error: errorGet, data: dataGet, execute: get } = useApiFetch<GetResponse>({
      autoFetch: false,
      endpoint: 'https://api.restful-api.dev/objects/7',
      method: 'GET',
    })

    type GetResponse = {
      name: string
      data: {
        'CPU model': string
        'Hard disk size': string
        color: string
        price: number
        year: number
      }
    };

    const { isLoading: isLoadingGetAll, isSuccess: isSuccessGetAll, isError: isErrorGetAll, error: errorGetAll, data: dataGetAll } = useApiFetch<GetResponse[]>({
      autoFetch: true,
      endpoint: 'https://api.restful-api.dev/objects',
      method: 'GET',
    })

    /* End of fetching sample */

    useEffect(() => {
      const getComponent = async () => {
        const schemaFile = await fetch('/mock/Button.mock.json')
        const mockData = (await schemaFile.json()) as ButtonSchema

        const ajv = new Ajv()
        const validate = ajv.compile(buttonSchema)
        const valid = validate(mockData)

        if (!valid) {
          console.error('Schema validation errors:', validate.errors)
          return
        }

        setSchema(mockData)
      }

      getComponent().catch((error) => {
        console.error('Error fetching component:', error)
      })
    }, [])

    return (
      <>
        <div>Welcome to the Page component!</div>
        {schema ? <Button {...schema?.spec} /> : <>ciao</>}
        <AntButton onClick={() => emit('textPage', 'Hello everyone!')}>Emit Event</AntButton>
        <div>{textPage ? textPage : 'Listening...'}</div>

        <AntButton loading={isLoadingPut} onClick={() => put({
          data: {
            'CPU model': 'Intel Core i9',
            'Hard disk size': '1 TB',
            color: 'silver',
            price: 2049.99,
            year: 2019,
          },
          name: 'Apple MacBook Pro 16',
        })}>Submit a PUT</AntButton>
        {isErrorPut && <div>Error: {errorPut}</div>}
        {isSuccessPut && <div>Success: {JSON.stringify(dataPut)}</div>}

        <AntButton loading={isLoadingPost} onClick={() => post({
          data: {
            'CPU model': 'Intel Core i9',
            'Hard disk size': '1 TB',
            color: 'silver',
            price: 2049.99,
            year: 2019,
          },
          name: 'Apple MacBook Pro 16',
        })}>Submit a POST</AntButton>
        {isErrorPost && <div>Error: {errorPost}</div>}
        {isSuccessPost && <div>Success: {JSON.stringify(dataPost)}</div>}


        <AntButton loading={isLoadingDelete} onClick={() => del()}>Submit a DELETE</AntButton>
        {isErrorDelete && <div>Error: {errorDelete}</div>}
        {isSuccessDelete && <div>Success: {JSON.stringify(dataDelete)}</div>}

        <AntButton loading={isLoadingGet} onClick={() => get()}>Submit a GET</AntButton>
        {isErrorGet && <div>Error: {errorGet}</div>}
        {isSuccessGet && <div>Success: {JSON.stringify(dataGet)}</div>}

        {isLoadingGetAll && <div>Loading all...</div>}
        {isErrorGetAll && <div>Error: {errorGetAll}</div>}
        {isSuccessGetAll && (
          <div>
            Success:
            <ul>
              {dataGetAll?.map((item) => (
                <li key={item.name}>
                  {item.name}: {JSON.stringify(item.data)}
                </li>
              ))}
            </ul>
          </div>
        )}
        <div>Page component</div>
      </>
    )
}

export default Page
