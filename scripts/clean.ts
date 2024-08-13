async function run() {
  Bun.spawn(['rimraf', 'src-tauri/target'], { stdout: 'inherit' })
}

run()
