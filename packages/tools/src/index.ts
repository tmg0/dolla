import type { Tool as OTool } from 'ollama/browser'
import now, { schema } from './now'

type Tool = (...args: any[]) => string | Promise<string>

export const defineTool = (options: OTool) => options

export const tools = [defineTool(schema)]

export async function emit(key: string, params?: any) {
  const core: Record<string, Tool> = { now }
  const [scope, e] = key.split(':')
  if (scope === 'core' && e && core[e])
    return await core[e](params)
  return ''
}
