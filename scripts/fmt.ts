async function run() {
  Bun.spawn(['eslint', '.', '--fix', '--ignore-pattern', 'src-tauri/'], { stdout: 'inherit' })
  Bun.spawn(['cargo', 'fmt'], { stdout: 'inherit' })
}

run()
