/* eslint-disable no-console */
import { promises as fs } from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

import glob from 'fast-glob'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const ROOT_DIR = path.join(__dirname, '../')
const WIDGETS_GLOB = 'src/widgets/**/**/*.schema.json'
const README_FILE = path.join(ROOT_DIR, 'README.md')
const WIDGETS_ANCHOR = '## Widgets'

interface JSONSchemaProperty {
  type?: string | string[]
  description?: string
  enum?: string[]
}

interface WidgetDataSchema {
  properties?: Record<string, JSONSchemaProperty>
  required?: string[]
}

interface JSONSchema {
  title?: string
  description?: string
  properties?: {
    spec?: {
      properties?: {
        widgetData?: WidgetDataSchema
      }
    }
    kind?: {
      default?: string
    }
  }
}

function toMarkdownTable(props: WidgetDataSchema): string {
  const lines = ['| Property | Required | Description | Type |', '|----------|----------|-------------|------|']

  if (!props.properties) { return '*No props available.*' }

  for (const [propName, propSchema] of Object.entries(props.properties)) {
    const isRequired = props.required?.includes(propName)
    const required = isRequired ? 'yes' : 'no'

    let type = 'unknown'
    if (propSchema.enum) {
      // Escape pipe in enum values for markdown table cell
      type = propSchema.enum.map(value => `\`${value}\``).join(' \\| ')
    } else if (Array.isArray(propSchema.type)) {
      type = propSchema.type.join(' | ')
    } else if (typeof propSchema.type === 'string') {
      type = propSchema.type
    }

    const desc = propSchema.description ?? ''

    lines.push(`| ${propName} | ${required} | ${desc} | ${type} |`)
  }

  return lines.join('\n')
}

function formatSchemaToMarkdown(schema: JSONSchema, filePath: string): string {
  const fileName = path.basename(filePath)
  const title
    = schema.title
    || schema.properties?.kind?.default
    || fileName.replace('.schema.json', '')
  const description = schema.description || ''
  const widgetData = schema.properties?.spec?.properties?.widgetData

  const table = toMarkdownTable(widgetData ?? {})

  return `### ${title}\n\n${description}\n\n#### Props\n\n${table}\n`
}

async function generateWidgetsSection(): Promise<string> {
  const schemaPaths = await glob(WIDGETS_GLOB, { absolute: true, cwd: ROOT_DIR })
  if (schemaPaths.length === 0) {
    return `${WIDGETS_ANCHOR}\n\n⚠️ No widget schemas found at \`${WIDGETS_GLOB}\`\n`
  }

  const docs = await Promise.all(
    schemaPaths.map(async file => {
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
    readmeContent = await fs.readFile(README_FILE, 'utf-8')
  } catch {
    console.error('❌ README.md not found')
    process.exit(1)
  }

  const widgetsSection = await generateWidgetsSection()

  if (readmeContent.includes(WIDGETS_ANCHOR)) {
    const [beforeWidgets] = readmeContent.split(WIDGETS_ANCHOR)
    const updated = `${beforeWidgets}${widgetsSection}`
    await fs.writeFile(README_FILE, updated)
    console.log('✅ Widgets section updated in README.md')
  } else {
    const updated = `${readmeContent.trim()}\n\n${widgetsSection}`
    await fs.writeFile(README_FILE, updated)
    console.log('✅ Widgets section added to the end of README.md')
  }
}

updateReadme().catch(err => {
  console.error('❌ Error updating README:', err)
})
