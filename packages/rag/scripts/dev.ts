async function run() {
  Bun.spawn(['gcc', '-o', './deps/libsqlite3.dylib', './deps/sqlite3.c', '-dynamiclib'], { stdout: 'inherit' })
  Bun.spawn(['bun', './src/index.ts'], { stdout: 'inherit' })
}

run()
