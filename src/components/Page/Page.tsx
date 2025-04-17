import Ajv from 'ajv'
import { useEffect, useState } from 'react'

import buttonSchema from '../../schemas/Button.schema.json'
import type { ButtonSchema } from '../../types/Button.schema'
import Button from '../../widgets/Button'

const Page: React.FC = () => {
  const [schema, setSchema] = useState<ButtonSchema | null>(null)

  useEffect(() => {
    const getComponent = async () => {
      const schemaFile = await fetch(
        'http://localhost:8080/call?resource=buttons&apiVersion=widgets.templates.krateo.io/v1beta1&name=my-button&namespace=krateo-system',
        {
          headers: {
            'X-krateo-groups': 'admins',
            'X-krateo-user': 'admin',
          },
        },
      )
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
    </>
  )
}

export default Page
