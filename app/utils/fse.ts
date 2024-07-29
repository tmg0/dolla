import { exists, mkdir, create, BaseDirectory } from '@tauri-apps/plugin-fs'
import { dirname } from 'pathe'

export async function ensureDir(dir: string) {
  const e = await exists(dir, { baseDir: BaseDirectory.Resource })
  if (!e)
    mkdir(dir, { baseDir: BaseDirectory.Resource, recursive: true })
}

export async function ensureFile(file: string) {
  await ensureDir(dirname(file))
  const e = await exists(file, { baseDir: BaseDirectory.Resource })
  if (!e)
    create(file, { baseDir: BaseDirectory.Resource })
}
