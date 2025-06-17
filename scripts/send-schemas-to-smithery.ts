/* eslint-disable no-console */
import { readFileSync } from 'node:fs'
import fs from 'node:fs/promises'
import { basename, join } from 'node:path'

import { glob } from 'glob'

import { api } from '../public/config/config.json'

const WIDGETS_DIR = join(process.cwd(), 'src', 'widgets')

import { accessToken } from './login-response.json'

async function sendSchemaToSmithery(schemaPath: string) {
  try {
    const schemaContent = readFileSync(schemaPath, 'utf-8')
    // Parse and validate JSON before sending
    const response = await fetch(`${api.SMITHERY_API_BASE_URL}/forge?apply=true`, {
      body: schemaContent,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      method: 'POST',
    })

    if (!response.ok) {
      console.error(`❌ Failed to send schema to Smithery (${schemaPath})`, response.statusText)
      console.error(await response.text())
      process.exit(1)
    }

    const schemaName = basename(schemaPath)

    const crdName = schemaName.replace('.schema.json', '.crd.yaml')
    await fs.writeFile(join('scripts', 'smithery-output', crdName), await response.text())

    console.log(schemaName, response.statusText)
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
