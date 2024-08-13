import type { Body } from '..'
import { setupSqlite } from './sqlite'

export type Options = ReturnType<typeof resolveOptions>

export function resolveOptions(body: Body) {
  return {
    src: body.src ?? [],
    q: body.q,
    db: setupSqlite(body.db),
    ollama: {
      host: 'http://localhost:11434',
      model: 'llama3.1',
    },
  }
}
