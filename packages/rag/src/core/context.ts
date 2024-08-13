import { basename } from 'pathe'
import { hash } from 'ohash'
import type { Body } from '..'
import { splitter } from './splitter'
import { createLoader } from './loader'
import { embed } from './ollama'
import { resolveOptions } from './options'
import { Logger } from './logger'

interface SemanticSearchOptions {
  articleIds: number[]
  limit: number
}

interface Chunk {
  id?: number
  article_id: number
  content: string
}

interface Article {
  id?: number
  name: string
  content?: string
  hash?: string
}

type Context = ReturnType<typeof createContext>

export function createContext(body: Body) {
  const logger = new Logger()
  const options = resolveOptions(body)

  const ctx = {
    options,
    logger,
    createArticles,
    semanticSearch,
  }

  async function createArticles() {
    const filepaths = options.src
    const loaders = filepaths.map(createLoader).filter(Boolean)
    const files = await Promise.all(loaders.map(loader => loader?.load()))
    const data = files.map(docs => ({ name: basename(docs![0]?.metadata.source), content: docs![0]?.pageContent }))
    return createManyArticles(data, ctx)
  }

  async function semanticSearch({ limit, articleIds }: Partial<SemanticSearchOptions> = {}): Promise<Chunk[]> {
    const question = options.q
    if (!question)
      return []
    const embedding = await embed(question)
    if (!embedding)
      return []
    const chunkIds = articleIds ? findChunksByArticleIds(options.db, articleIds).map(({ id }) => id) as number[] : undefined
    const rowIds = semanticSearchWithLlama31(options.db, embedding, limit, chunkIds).map(({ rowid }) => rowid)
    ctx.logger.log(`Semantic search order by distance top ${rowIds.length}`)
    if (!rowIds.length)
      return []
    const sql = `SELECT * from chunks WHERE id IN (${rowIds.join(', ')});`
    return options.db.prepare(sql).all() as Chunk[]
  }

  return ctx
}

function findArticlesByHash(db: any, hash: string[]): Article[] {
  const query = hash.map(item => `hash = '${item}'`).join(' OR ')
  const sql = `SELECT * from articles WHERE ${query};`
  return db.prepare(sql).all()
}

async function createManyArticles(values: Article[], ctx: Context) {
  values = values.map(item => ({ ...item, hash: hash(item.content) }))
  const map: Record<string, Article> = {}
  values.forEach(value => map[value.hash!] = value)
  const exists = findArticlesByHash(ctx.options.db, Object.keys(map))
  const filters: Record<string, Article> = {}
  Object.entries(map).forEach(([hash, item]) => {
    if (!exists.some(item => hash === item.hash))
      filters[hash] = item
  })

  const a = Object.values(filters)
  if (!a.length)
    return exists

  ctx.logger.log('Create the new articles')
  const sql = `INSERT INTO articles (name, hash) VALUES ${a.map(({ name, hash }) => `('${name}', '${hash}')`).join(', ')};`
  ctx.options.db.prepare(sql).run()
  const articles = findArticlesByHash(ctx.options.db, a.map(({ hash }) => hash!))

  async function split({ id, hash }: Article) {
    const { content } = map[hash!] ?? {}
    if (id && content) {
      const texts = await splitter.createDocuments([content])
      const chunks: Chunk[] = texts.map(({ pageContent }) => ({ article_id: id, content: pageContent }))
      ctx.logger.log('Split articles by character')
      createManyChunks(chunks, ctx)
    }
  }

  await Promise.all(articles.map(split))
  return [...exists, ...articles]
}

async function createManyChunks(values: Chunk[], ctx: Context) {
  if (!values.length)
    return
  ctx.logger.log('Insert article chunks')
  const sql = `INSERT INTO chunks (article_id, content) VALUES ${values.map(({ article_id, content }) => `(${article_id}, '${content}')`).join(', ')};`
  ctx.options.db.prepare(sql).run()
  const chunks = findChunksByArticleIds(ctx.options.db, [values[0]!.article_id])
  await Promise.all(chunks.map(chunk => createEmbeddings(chunk, ctx)))
}

async function createEmbeddings(chunk: Chunk, ctx: Context) {
  ctx.logger.log('Embed chunk vector')
  const embedding = await embed(chunk.content)
  if (!embedding?.length)
    return
  ctx.logger.log('Insert embeddings to db by sqlite-vec')
  const sql = `INSERT INTO llama3_1 (rowid, embedding) VALUES (${chunk.id}, '[${embedding.join(', ')}]');`
  ctx.options.db.prepare(sql).run()
}

function findChunksByArticleIds(db: any, articleIds: number[]): Chunk[] {
  const query = articleIds.map(id => `article_id = ${id}`).join(' OR ')
  const sql = `SELECT * from chunks WHERE ${query};`
  const chunks = db.prepare(sql).all()
  if (Array.isArray(chunks))
    return chunks
  return [chunks].filter(Boolean)
}

function semanticSearchWithLlama31(db: any, embedding: number[], limit: number = 5, ids: number[] = []): { rowid: number }[] {
  const query = [ids.length && `rowid IN (${ids.join(', ')})`, `embedding MATCH '[${embedding.join(', ')}]'`].filter(Boolean).join(' AND ')
  const sql = `SELECT rowid from llama3_1 WHERE ${query} ORDER BY distance LIMIT ${limit};`
  return db.prepare(sql).all()
}
