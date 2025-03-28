import Ajv from 'ajv'
import { useEffect, useState } from 'react'

import paragraphSchema from '../../schemas/Paragraph.schema.json'
import type { ParagraphSchema } from '../../types/Paragraph.schema'
import Paragraph from '../../widgets/Paragraph'

const Page: React.FC = () => {
  const [props, setProps] = useState<ParagraphSchema | null>(null)

  useEffect(() => {
    const getComponent = async () => {
      const schemaFile = await fetch('/config/Paragraph.json')
      const mockData = (await schemaFile.json()) as ParagraphSchema

      const ajv = new Ajv()
      const validate = ajv.compile(paragraphSchema)
      const valid = validate(mockData)

      if (!valid) {
        console.error('Schema validation errors:', validate.errors)
        return
      }

      setProps(mockData)
    }

    getComponent().catch((error) => {
      console.error('Error fetching component:', error)
    })
  }, [])

  return (
    <>
      <div>Welcome to the Page component!</div>
      {props ? <Paragraph {...props?.widgetData} /> : <>ciao</>}
    </>
  )
}

export default Page
