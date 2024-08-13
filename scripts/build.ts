async function run() {
  Bun.spawn(['bun', 'run', 'clean'], { stdout: 'inherit' })
  Bun.spawn(['bun', 'run', 'build'], { cwd: 'packages/tools', stdout: 'inherit' })
  Bun.spawn(['nuxt', 'generate'], { stdout: 'inherit' })
}

run()
