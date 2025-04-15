import Ajv from 'ajv'
import { Button as AntButton } from 'antd'
import { useEffect, useState } from 'react'

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
    </>
  )
}

export default Page
