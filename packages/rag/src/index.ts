import process from 'node:process'
import mri from 'mri'
import { setup } from './core/setup'
import { createContext } from './core/context'

async function main() {
  const argv = process.argv.slice(2)
  const { options } = setup(mri(argv))
  if (!options)
    return
  const ctx = createContext(options)
  const chunks = await ctx.semanticSearch()
  const contents = chunks.map(({ content }) => content)
  const output = JSON.stringify(contents)
  process.stdout.write(output)
}

main()
