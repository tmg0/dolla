import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { type InferInput, array, object, string } from 'valibot'
import { vValidator } from '@hono/valibot-validator'
import { createContext } from './core/context'

const schema = object({
  db: string(),
  q: string(),
  src: array(string()),
})

export type Body = InferInput<typeof schema>

async function main(options: Body) {
  const ctx = createContext(options)
  const articles = await ctx.createArticles()
  const chunks = await ctx.semanticSearch({ articleIds: articles.map(({ id }) => id!) })
  return chunks.map(({ content }) => content)
}

const app = new Hono()

app.use('/', cors({ origin: ['*'] }))

app.post('/', vValidator('json', schema), async (c) => {
  const options = c.req.valid('json')
  const response = await main(options)
  return c.json(response)
})

serve({
  fetch: app.fetch,
  port: 11435,
})
