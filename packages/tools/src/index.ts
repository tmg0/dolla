import type { Tool as OTool } from 'ollama/browser'
import type { Tool } from './core'
import now from './now'

const _modules = [now]
export const tools: OTool[] = _modules.map(([schema]) => schema)

const _fns = (() => {
  const map: Record<string, Tool> = {}
  _modules.forEach(([schema, cb]) => {
    const key = schema.function.name
    map[key] = cb
  })
  return map
})()

export async function emit(key: string, params?: any) {
  if (_fns[key])
    return await _fns[key](params)
  return ''
}
