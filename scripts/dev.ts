async function run() {
  Bun.spawn(['bun', 'run', 'build'], { cwd: 'packages/tools', stdout: 'inherit' })
  Bun.spawn(['nuxt', 'dev'], { stdout: 'inherit' })
}

run()
