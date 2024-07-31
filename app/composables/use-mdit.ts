import markdownit from 'markdown-it'
import Shiki from '@shikijs/markdown-it'

const md = markdownit()

md.use(await Shiki({
  themes: {
    light: 'vitesse-dark',
    dark: 'vitesse-dark',
  },
}))

export function useMdit() {
  return {
    md,
  }
}
