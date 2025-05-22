/* eslint-disable no-console */
import { readFile } from 'fs/promises'

import type { AnySchema } from 'ajv'
import Ajv from 'ajv'
import addFormats from 'ajv-formats'
import { glob } from 'glob'

const ajv = new Ajv({ allErrors: true, strict: false })
addFormats(ajv)

const files = await glob('**/*.schema.json', {
  ignore: ['node_modules/**'],
})

let hasErrors = false

// Validate all schemas in parallel
await Promise.all(
  files.map(async (file) => {
    try {
      const schemaText = await readFile(file, 'utf-8')
      const schema = JSON.parse(schemaText) as AnySchema

      ajv.compile(schema)

      console.log(`✅ ${file} is a valid JSON Schema.`)
    } catch (err) {
      console.error(`❌ Error in ${file}:`)
      console.error(err instanceof Error ? err.message : err)
      hasErrors = true
    }
  })
)

if (hasErrors) {
  process.exit(1)
}
