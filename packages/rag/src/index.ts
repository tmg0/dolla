import process from 'node:process'
import mri from 'mri'
import { setup } from './core'

async function main() {
  const argv = process.argv.slice(2)
  setup(mri(argv))
}

main()
