import { setupSqlite } from './sqlite'

interface Args {
  'ollama.host'?: string
  'ollama.model'?: string
  'db': string
}

export interface Options {
  db: string
  ollama: {
    host: string
    model: string
  }
}

function resolveOptions(args: Args): Options {
  return {
    db: args.db,
    ollama: {
      host: args['ollama.host'] ?? 'http://localhost:11434',
      model: args['ollama.model'] ?? 'bge-m3',
    },
  }
}

export function setup(args: Args) {
  const options = resolveOptions(args)
  if (!options.db)
    return
  setupSqlite(options.db)
}
