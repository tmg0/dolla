import { createContext } from './core/context'

async function main() {
  const ctx = createContext()
  const articles = await ctx.createArticles()
  const chunks = await ctx.semanticSearch({ articleIds: articles.map(({ id }) => id!) })
  const contents = chunks.map(({ content }) => content)
  ctx.logger.log(contents)
}

main()
