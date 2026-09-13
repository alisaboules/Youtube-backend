import 'dotenv/config'
import { createClient } from '@supabase/supabase-js'
import * as fs from 'fs/promises'
import * as path from 'path'
import { lookup } from 'mime-types'

const SUPABASE_URL = process.env.SUPABASE_URL
const SUPABASE_SERVICE_ROLE_KEY =
  process.env.SUPABASE_SERVICE_ROLE_KEY

const BUCKET_NAME = 'Youtube'

if (!SUPABASE_URL) {
  throw new Error('SUPABASE_URL не найден в .env')
}

if (!SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error(
    'SUPABASE_SERVICE_ROLE_KEY не найден в .env'
  )
}

const supabase = createClient(
  SUPABASE_URL,
  SUPABASE_SERVICE_ROLE_KEY
)

const uploadsPath = path.join(
  process.cwd(),
  'uploads'
)

async function getFiles(directory: string): Promise<string[]> {
  const entries = await fs.readdir(directory, {
    withFileTypes: true
  })

  const files: string[] = []

  for (const entry of entries) {
    const fullPath = path.join(directory, entry.name)

    if (entry.isDirectory()) {
      const nestedFiles = await getFiles(fullPath)

      files.push(...nestedFiles)
    } else {
      // Пропускаем .DS_Store
      if (entry.name === '.DS_Store') {
        continue
      }

      files.push(fullPath)
    }
  }

  return files
}

async function main() {
  console.log('🚀 Начинаем загрузку файлов в Supabase...\n')

  const files = await getFiles(uploadsPath)

  console.log(`📁 Найдено файлов: ${files.length}\n`)

  for (const filePath of files) {
    const relativePath = path.relative(
      uploadsPath,
      filePath
    )

    // Windows использует "\", Supabase должен получить "/"
    const storagePath = relativePath.replace(/\\/g, '/')

    console.log(`⬆️ Загружаем: ${storagePath}`)

    const fileBuffer = await fs.readFile(filePath)

    const contentType =
      lookup(filePath) || 'application/octet-stream'

    const { error } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(storagePath, fileBuffer, {
        contentType,
        upsert: true
      })

    if (error) {
      console.error(
        `❌ Ошибка при загрузке ${storagePath}:`,
        error.message
      )

      continue
    }

    console.log(`✅ Загружено: ${storagePath}`)
  }

  console.log('\n🎉 Все файлы загружены!')
}

main().catch(error => {
  console.error('❌ Общая ошибка:', error)
  process.exit(1)
})