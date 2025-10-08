/* eslint-disable no-console */
import { promises as fs } from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

import glob from 'fast-glob'

import type { JSONSchema, WidgetDataSchema } from '../src/utils/types'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const ROOT_DIR = path.join(__dirname, '../')
const WIDGETS_GLOB = 'src/widgets/**/**/*.schema.json'
const OUTPUT_FILE = path.join(ROOT_DIR, 'docs/widgets-api-reference.md')
const WIDGETS_ANCHOR = '## Widgets'

function toMarkdownTable(widgetData: WidgetDataSchema): string {
  const lines = ['| Property | Required | Description | Type |', '|----------|----------|-------------|------|']

  if (!widgetData.properties) {
    return '*No props available.*'
  }

  function walk(schema: WidgetDataSchema, path: string = '') {
    const { properties = {}, required = [] } = schema

    for (const [key, prop] of Object.entries(properties)) {
      const fullPath = path ? `${path}.${key}` : key
      const isRequired = required.includes(key)
      const requiredText = isRequired ? 'yes' : 'no'

      let type = 'unknown'

      if (prop.enum) {
        type = prop.enum.map((value) => `\`${value}\``).join(' \\| ')
      } else if (Array.isArray(prop.type)) {
        type = prop.type.join(' | ')
      } else if (prop.type === 'array') {
        type = 'array'
      } else if (prop.type === 'object') {
        type = 'object'
      } else if (typeof prop.type === 'string') {
        type = prop.type
      }

      const description = prop.description ?? ''
      lines.push(`| ${fullPath} | ${requiredText} | ${description} | ${type} |`)

      if (prop.type === 'object') {
        const nested = prop as WidgetDataSchema
        walk(nested, fullPath)
      }

      if (prop.type === 'array' && prop.items?.type === 'object' && 'properties' in prop.items) {
        const arrayItem = prop.items as WidgetDataSchema
        walk(arrayItem, `${fullPath}[]`)
      }
    }
  }

  walk(widgetData)
  return lines.join('\n')
}

async function formatSchemaToMarkdown(schema: JSONSchema, filePath: string): Promise<string> {
  const fileName = path.basename(filePath)
  const title = schema.title || schema.properties?.kind?.default || fileName.replace('.schema.json', '')
  const description = schema.description || schema.properties?.kind?.description || ''
  const widgetData = schema.properties?.spec?.properties?.widgetData

  const table = toMarkdownTable(widgetData ?? {})

  // 🔍 Cerca file .example.yaml nella stessa cartella del file .schema.json
  const schemaDir = path.dirname(filePath)
  const exampleFiles = await glob('*.example.yaml', { absolute: true, cwd: schemaDir })
  let exampleSection = ''

  if (exampleFiles.length > 0) {
    const exampleFile = exampleFiles.at(0)
    const exampleContent = exampleFile && (await fs.readFile(exampleFile, 'utf-8'))

    if (exampleContent) {
      exampleSection = `\n<details>\n<summary>Example</summary>\n\n\`\`\`yaml\n${exampleContent.trim()}\n\`\`\`\n</details>\n`
    }
  }

  // 🧩 Aggiunge il link alla doc di autocomplete/dependencies se il widget è Form
  const extraInfo = title.toLowerCase() === 'form'
    ? `\n\n> For additional information about the \`autocomplete\` and \`dependencies\` properties configuration, please visit [this page](./autocomplete-and-dependencies.md).\n`
    : ''

  return `### ${title}\n\n${description}\n\n#### Props\n\n${table}\n${exampleSection}${extraInfo}`
}

async function generateWidgetsSection(): Promise<string> {
  const schemaPaths = await glob(WIDGETS_GLOB, { absolute: true, cwd: ROOT_DIR })
  if (schemaPaths.length === 0) {
    return `${WIDGETS_ANCHOR}\n\n⚠️ No widget schemas found at \`${WIDGETS_GLOB}\`\n`
  }

  const sortedSchemaPaths = schemaPaths.sort((schemaA, schemaB) => path.basename(schemaA).localeCompare(path.basename(schemaB)))

  const docs = await Promise.all(
    sortedSchemaPaths.map(async (file) => {
      const content = await fs.readFile(file, 'utf-8')
      const schema: JSONSchema = JSON.parse(content) as JSONSchema
      return formatSchemaToMarkdown(schema, file)
    })
  )

  return `${WIDGETS_ANCHOR}\n\nList of implemented widgets:\n\n${docs.join('\n---\n\n')}`
}

async function updateReadme() {
  let readmeContent = ''
  try {
    readmeContent = await fs.readFile(OUTPUT_FILE, 'utf-8')
  } catch {
    console.error(`❌ ${OUTPUT_FILE} not found`)
    process.exit(1)
  }

  const widgetsSection = await generateWidgetsSection()

  if (readmeContent.includes(WIDGETS_ANCHOR)) {
    const [beforeWidgets] = readmeContent.split(WIDGETS_ANCHOR)
    const updated = `${beforeWidgets}${widgetsSection}`
    await fs.writeFile(OUTPUT_FILE, updated)
    console.log(`✅ Widgets updated in ${OUTPUT_FILE}`)
  } else {
    const updated = `${readmeContent.trim()}\n\n${widgetsSection}`
    await fs.writeFile(OUTPUT_FILE, updated)
    console.log(`✅ Widgets updated in ${OUTPUT_FILE}`)
  }
}

updateReadme().catch((err) => {
  console.error(`❌ Error updating ${OUTPUT_FILE}:`, err)
})
