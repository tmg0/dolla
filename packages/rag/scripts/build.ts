async function run() {
  Bun.spawn(['gcc', '-o', './bin/libsqlite3.dylib', './bin/sqlite3.c', '-dynamiclib'], { stdout: 'inherit' })
  Bun.spawn(['bun', 'build', './src/index.ts', '--compile', '--outfile', './dist/rag'], { stdout: 'inherit' })
}

run()
