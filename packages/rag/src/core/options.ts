import type { Args } from './setup'
import { setupSqlite } from './sqlite'

export type Options = ReturnType<typeof resolveOptions>

export function resolveOptions(args: Args) {
  return {
    input: args._[0] ?? '',
    db: setupSqlite(args.db),
    ollama: {
      host: args['ollama.host'] ?? 'http://localhost:11434',
      model: args['ollama.model'] ?? 'bge-m3',
    },
  }
}
