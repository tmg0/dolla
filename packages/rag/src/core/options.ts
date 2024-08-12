import process from 'node:process'
import mri from 'mri'
import { setupSqlite } from './sqlite'

export type Options = ReturnType<typeof resolveOptions>

export function resolveOptions() {
  const args = mri(process.argv.slice(2))

  return {
    articles: args._ ?? [],
    q: args.q,
    db: setupSqlite(args.db),
    ollama: {
      host: args['ollama.host'] ?? 'http://localhost:11434',
      model: args['ollama.model'] ?? 'bge-m3',
    },
  }
}
