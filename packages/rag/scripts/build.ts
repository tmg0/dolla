async function run() {
  Bun.spawnSync(['mkdir', './dist/deps'], { stdout: 'inherit' })
  Bun.spawn(['gcc', '-o', './dist/deps/libsqlite3.dylib', './deps/sqlite3.c', '-dynamiclib'], { stdout: 'inherit' })
  Bun.spawn(['bun', 'build', './src/index.ts', '--compile', '--minify', '--outfile', './dist/rag'], { stdout: 'inherit' })
}

run()
