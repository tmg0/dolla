import { resolveOptions } from './options'

export interface Args {
  '_': string[]
  'ollama.host'?: string
  'ollama.model'?: string
  'db': string
}

export function setup(args: Args) {
  const options = resolveOptions(args)
  if (!options.db)
    return {}
  return { options }
}
