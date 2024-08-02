import { type Event, type UnlistenFn, listen } from '@tauri-apps/api/event'
import { readFile } from '@tauri-apps/plugin-fs'
import { extname } from 'pathe'

type TauriDragDropEvent = Event<{
  paths: string[]
}>

interface Options {
  onDrop?: (event: TauriDragDropEvent) => void
  onLeave?: () => void
  resolveId?: (id: string) => boolean
  accept?: string
}

export function useFileDrop(options: Options = {}) {
  const isDragOver = ref(false)
  const unlistens: Promise<UnlistenFn>[] = []
  const files = ref<Uint8Array[] | string[]>([])

  unlistens[0] = listen('tauri://drag-drop', async (e: TauriDragDropEvent) => {
    if (options.accept && !options.resolveId)
      options.resolveId = resolveAccept(options.accept)
    if (options.resolveId)
      e.payload.paths = e.payload.paths.filter(options.resolveId)

    e.payload.paths = [...new Set([...e.payload.paths])]

    Promise.all(e.payload.paths.map(path => read(path))).then((f) => {
      files.value = f
    })

    options.onDrop?.(e)
    isDragOver.value = false
  })

  unlistens[1] = listen('tauri://drag-over', () => {
    isDragOver.value = true
  })

  unlistens[2] = listen('tauri://drag-leave', () => {
    isDragOver.value = false
    options.onLeave?.()
  })

  tryOnUnmounted(() => {
    Promise.all(unlistens)
  })

  function resolveAccept(accept: string) {
    return function (id: string) {
      let exts: string[] = []
      if (accept === 'image/*')
        exts = ['.png', '.jpeg', '.jpg']
      return exts.includes(extname(id))
    }
  }

  async function read(path: string) {
    const bytes = await readFile(path)
    return bytesToBase64(bytes)
  }

  function bytesToBase64(bytes: Uint8Array) {
    const binString = Array.from(bytes, byte => String.fromCodePoint(byte)).join('')
    return btoa(binString)
  }

  return {
    files,
    isDragOver,
    bytesToBase64,
  }
}
