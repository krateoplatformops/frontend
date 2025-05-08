import { join } from 'node:path'
import { glob } from 'glob'
import { execSync } from 'node:child_process'

const WIDGETS_DIR = join(process.cwd(), 'src', 'widgets')

async function applyYamlFile(yamlPath: string) {
  try {
    console.log(`Applying ${yamlPath.split('/').pop()}...`)
    execSync(`kubectl apply -f ${yamlPath}`, { stdio: 'inherit' })
    console.log(`✅ Successfully applied ${yamlPath.split('/').pop()}`)
    return true
  } catch (error) {
    console.error(`❌ Failed to apply ${yamlPath.split('/').pop()}:`, error)
    return false
  }
}

async function main() {
  try {
    // Find all .yaml and .yml files in the widgets directory
    const yamlFiles = await glob('**/*.{yaml,yml}', {
      cwd: WIDGETS_DIR,
      absolute: true,
    })

    if (yamlFiles.length === 0) {
      console.error('❌ No YAML files found in:', WIDGETS_DIR)
      process.exit(1)
    }

    console.log(`Found ${yamlFiles.length} YAML files to process`)

    let successCount = 0
    let failureCount = 0

    // Process each YAML file
    for (const yamlFile of yamlFiles) {
      const success = await applyYamlFile(yamlFile)
      if (success) {
        successCount++
      } else {
        failureCount++
      }
    }

    console.log('\n📊 Processing Summary:')
    console.log(`Total YAML files: ${yamlFiles.length}`)
    console.log(`✅ Successful: ${successCount}`)
    console.log(`❌ Failed: ${failureCount}`)

    if (failureCount > 0) {
      process.exit(1)
    }

    console.log('\n🎉 All YAML files have been applied successfully!')
  } catch (error) {
    console.error('\n❌ Fatal Error:')
    console.error(error instanceof Error ? error.message : String(error))
    process.exit(1)
  }
}

main()
