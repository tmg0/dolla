import { execa } from 'execa'

async function run() {
  await execa('pnpm', ['build'], { cwd: 'packages/tools', stdio: 'inherit' })
  await execa('nuxt', ['dev'], { stdio: 'inherit' })
}

run()
