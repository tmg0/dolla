import type { Tool as OTool } from 'ollama/browser'
import { hash } from 'ohash'

export type Tool = (...args: any[]) => string | Promise<string>

interface Schema {
  type: string
  function: {
    name?: string
    description: string
    parameters: {
      type: string
      required: string[]
      properties: {
        [key: string]: {
          type: string
          description: string
          enum?: string[]
        }
      }
    }
  }
}

export function defineTool<T extends Schema>(schema: T, callback: Tool): [OTool, Tool] {
  if (!schema.function.name)
    schema.function.name = hash(schema.function.description)
  return [schema as OTool, callback]
}
