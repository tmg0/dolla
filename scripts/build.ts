import { execa } from 'execa'

async function run() {
  await execa('pnpm', ['clean'], { stdio: 'inherit' })
  await execa('pnpm', ['build'], { cwd: 'packages/tools', stdio: 'inherit' })
  await execa('nuxt', ['generate'], { stdio: 'inherit' })
}

run()
