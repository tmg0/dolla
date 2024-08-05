import type { Tool } from 'ollama/browser'

export const tools: Tool[]
export const emit: (key: string, params?: any) => Promise<string>
