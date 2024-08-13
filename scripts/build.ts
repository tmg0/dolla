import { execa } from 'execa'

async function run() {
  await execa('bun', ['run', 'clean'], { stdio: 'inherit' })
  await execa('bun', ['run', 'build'], { cwd: 'packages/tools', stdio: 'inherit' })
  await execa('nuxt', ['generate'], { stdio: 'inherit' })
}

run()
