import { Ollama } from 'ollama/browser'
import type { Options } from '.'

export async function embed(input: string, options: Partial<Options> = {}) {
  const ollama = new Ollama({ host: 'http://localhost:11434', ...options.ollama })
  const response = await ollama.embed({ model: options.ollama?.model ?? 'bge-m3', input })
  return response.embeddings[0]
}
