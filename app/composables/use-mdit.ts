import markdownit from 'markdown-it'
import Shiki from '@shikijs/markdown-it'

const md = markdownit()

async function register() {
  md.use(await Shiki({
    themes: {
      light: 'vitesse-dark',
      dark: 'vitesse-dark',
    },
  }))
}

register()

export function useMdit() {
  return {
    md,
  }
}
