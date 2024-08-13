import { execa } from 'execa'

async function run() {
  await execa('rimraf', ['packages/rag/node_modules'], { stdio: 'inherit' })
  await execa('rimraf', ['packages/tools/node_modules'], { stdio: 'inherit' })
  await execa('rimraf', ['src-tauri/target'], { stdio: 'inherit' })
}

run()
