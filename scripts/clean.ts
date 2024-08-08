import { execa } from 'execa'

async function run() {
  await execa('rimraf', ['src-tauri/target'], { stdio: 'inherit' })
}

run()
