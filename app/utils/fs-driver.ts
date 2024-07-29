import { defineDriver } from "unstorage"
import { join } from 'pathe'
import { destr } from 'destr'
import { exists, readTextFile, writeTextFile, remove, readDir, BaseDirectory } from '@tauri-apps/plugin-fs'

const PATH_TRAVERSE_RE = /\.\.:|\.\.$/;

const DRIVER_NAME = 'tauri-fs-driver'

interface TauriFSStorageOptions  {
  base: string
}

function createError(
  driver: string,
  message: string,
  opts?: ErrorOptions
) {
  const err = new Error(`[unstorage] [${driver}] ${message}`, opts);
  return err;
}

export const tauriFsDriver = defineDriver((rawOptions: Partial<TauriFSStorageOptions>) => {
  const options = { base: '.', ...rawOptions }

  function r(key: string) {
    if (PATH_TRAVERSE_RE.test(key))
      throw createError(DRIVER_NAME, `Invalid key: ${JSON.stringify(key)}. It should not contain .. segments`)
    const _k = key.replace(/:/g, "/")
    return join(options.base, _k)
  }

  return {
    name: DRIVER_NAME,
    options,

    hasItem(key: string) {
      return exists(r(key), { baseDir: BaseDirectory.AppData })
    },

    async getItem<T>(key: string) {
      const content = await readTextFile(r(key), { baseDir: BaseDirectory.AppData })
      return destr<T>(content)
    },

    setItem(key: string, value: any) {
      writeTextFile(r(key), JSON.stringify(value), { baseDir: BaseDirectory.AppData })
    },

    removeItem(key: string) {
      remove(r(key), { baseDir: BaseDirectory.AppData })
    },

    async getKeys() {
      const entries = await readDir(options.base, { baseDir: BaseDirectory.AppData })
      return entries.map(({ name }) => name)
    },

    clear() {
      remove(options.base, { baseDir: BaseDirectory.AppData })
    }
  }
})
