import { execa } from 'execa'

async function run() {
  await execa('eslint', ['.', '--fix', '--ignore-pattern', 'src-tauri/'], { stdio: 'inherit' })
  await execa('cargo', ['fmt'], { cwd: 'src-tauri', stdio: 'inherit' })
}

run()
