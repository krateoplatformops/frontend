/* eslint-disable no-console */
import { readFileSync } from 'node:fs'
import { join } from 'node:path'

import { glob } from 'glob'

const WIDGETS_DIR = join(process.cwd(), 'src', 'widgets')
const SMITHERY_URL = 'http://127.0.0.1:8081/forge?apply=true'

async function sendSchemaToSmithery(schemaPath: string) {
  try {
    const schemaContent = readFileSync(schemaPath, 'utf-8')
    // Parse and validate JSON before sending
    const response = await fetch(SMITHERY_URL, {
      body: schemaContent,
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
    })

    if (!response.ok) {
      console.error(
        `❌ Failed to send schema to Smithery (${schemaPath})`,
        response.statusText,
      )
      console.error(await response.text())
      process.exit(1)
    }

    console.log(schemaPath.split('/').pop(), response.statusText)
  } catch (error) {
    console.error(`❌ Failed to send schema to Smithery (${schemaPath})`, error)
  }
}

async function main() {
  try {
    // Find all .schema.json files in the widgets directory
    const schemaFiles = await glob('**/*.schema.json', {
      absolute: true,
      cwd: WIDGETS_DIR,
    })

    if (schemaFiles.length === 0) {
      console.error('❌ No schema files found in:', WIDGETS_DIR)
      process.exit(1)
    }

    console.log(`Found ${schemaFiles.length} schema files to process`)

    let successCount = 0
    let failureCount = 0

    // Process each schema file
    for (const schemaFile of schemaFiles) {
      try {
        // eslint-disable-next-line no-await-in-loop
        await sendSchemaToSmithery(schemaFile)
        successCount += 1
      } catch {
        failureCount += 1
      }
    }

    console.log('\n📊 Processing Summary:')
    console.log(`Total schemas: ${schemaFiles.length}`)
    console.log(`✅ Successful: ${successCount}`)
    console.log(`❌ Failed: ${failureCount}`)

    if (failureCount > 0) {
      process.exit(1)
    }

    console.log('\n🎉 All schemas have been processed successfully!')
  } catch (error) {
    console.error('\n❌ Fatal Error:')
    console.error(error instanceof Error ? error.message : String(error))
    process.exit(1)
  }
}

void main()
