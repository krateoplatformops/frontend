import Ajv from 'ajv'
import { useEffect, useState } from 'react'

import { useConfigContext } from '../../context/ConfigContext'
import buttonSchema from '../../schemas/Button.schema.json'
import type { ButtonSchema } from '../../types/Button.schema'
import Button from '../../widgets/Button'

const Page: React.FC = () => {
  const [schema, setSchema] = useState<ButtonSchema | null>(null)

  const { config } = useConfigContext()

  useEffect(() => {
    const getComponent = async () => {
      const schemaFile = await fetch(
        // `${config!.api.BACKEND_API_BASE_URL}/call?resource=buttons&apiVersion=widgets.templates.krateo.io/v1beta1&name=my-button&namespace=krateo-system`,
        `${config!.api.BACKEND_API_BASE_URL}/call?resource=buttonwithactions&apiVersion=widgets.templates.krateo.io/v1beta1&name=button-with-action&namespace=krateo-system`,
        {
          headers: {
            'X-Krateo-Groups': 'admins',
            'X-Krateo-User': 'admin',
          },
        },
      )
      const mockData = (await schemaFile.json()) as ButtonSchema

      // const ajv = new Ajv()
      // const validate = ajv.compile(buttonSchema)
      // const valid = validate(mockData)

      // if (!valid) {
      //   console.error('Schema validation errors:', validate.errors)
      //   return
      // }

      setSchema(mockData)
    }

    getComponent().catch((error) => {
      console.error('Error fetching component:', error)
    })
  }, [config])

  return (
    <>
      <h1>Button PoC</h1>
      {schema ? (
        <Button
          actions={schema.spec.actions}
          backendEndpoints={schema.spec.backendEndpoints}
          widgetData={schema.status.widgetData}
        />
      ) : (
        '...loading button'
      )}
    </>
  )
}

export default Page
