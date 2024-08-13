import { execa } from 'execa'

async function run() {
  await execa('nuxt', ['dev'], { stdio: 'inherit' })
}

run()
