async function run() {
  Bun.spawn(['gcc', '-o', './bin/libsqlite3.dylib', './bin/sqlite3.c', '-dynamiclib'], { stdout: 'inherit' })
  Bun.spawn(['bun', './src/index.ts'], { stdout: 'inherit' })
}

run()
