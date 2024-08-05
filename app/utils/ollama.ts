import { Command } from '@tauri-apps/plugin-shell'

export const ollama = { isReady: false, port: '11434' }

function sleep(ms = 500) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

export async function runOllamaServe() {
  if (ollama.isReady)
    return

  Command.sidecar('binaries/ollama', [
    'serve',
  ]).execute()

  await sleep(500)
  ollama.isReady = true
}
