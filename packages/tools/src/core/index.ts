import type { Tool as OTool } from 'ollama/browser'

export type Tool = (...args: any[]) => string | Promise<string>

export const defineTool = (schema: OTool, callback: Tool): [OTool, Tool] => [schema, callback]
