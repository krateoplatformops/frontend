import { readFile } from 'fs/promises';
import { glob } from 'glob';
import Ajv from 'ajv';
import addFormats from 'ajv-formats';

const ajv = new Ajv({ allErrors: true, strict: false })
addFormats(ajv)

const files = await glob('**/*.schema.json', {
  ignore: ['node_modules/**']
})

let hasErrors = false

for (const file of files) {
  try {
    const schemaText = await readFile(file, 'utf-8')
    const schema = JSON.parse(schemaText)

    // Compiling the schema will throw if invalid
    ajv.compile(schema)

    console.log(`✅ ${file} is a valid JSON Schema.`)
  } catch (err) {
    console.error(`❌ Error in ${file}:`)
    console.error(err instanceof Error ? err.message : err)
    hasErrors = true
  }
}

if (hasErrors) {
  process.exit(1)
}
