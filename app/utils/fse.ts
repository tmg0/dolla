import { BaseDirectory, create, exists, mkdir } from '@tauri-apps/plugin-fs'
import { dirname } from 'pathe'

interface Options {
  baseDir: BaseDirectory
}

export async function ensureDir(dir: string, options: Options = { baseDir: BaseDirectory.AppData }) {
  const e = await exists(dir, options)
  if (!e)
    mkdir(dir, options)
}

export async function ensureFile(file: string, options: Options = { baseDir: BaseDirectory.AppData }) {
  if (file.includes('/'))
    await ensureDir(dirname(file), options)
  const e = await exists(file, options)
  if (!e)
    create(file, options)
}
