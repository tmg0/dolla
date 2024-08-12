import { basename } from 'pathe'
import { hash } from 'ohash'
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

export function createContext() {
  const logger = new Logger()
  const options = resolveOptions()

  async function createArticles() {
    const filepaths = options.articles
    const loaders = filepaths.map(createLoader).filter(Boolean)
    const files = await Promise.all(loaders.map(loader => loader?.load()))
    const data = files.map(docs => ({ name: basename(docs![0]?.metadata.source), content: docs![0]?.pageContent }))
    return createManyArticles(options.db, data)
  }

  async function semanticSearch({ limit, articleIds }: Partial<SemanticSearchOptions> = {}): Promise<Chunk[]> {
    const question = options.q
    if (!question)
      return []
    const embedding = await embed(question)
    if (!embedding)
      return []
    const chunkIds = articleIds ? findChunksByArticleIds(options.db, articleIds).map(({ id }) => id) as number[] : undefined
    const rowIds = semanticSearchWithBgeM3(options.db, embedding, limit, chunkIds).map(({ rowid }) => rowid)
    if (!rowIds.length)
      return []
    const sql = `SELECT * from chunks WHERE id IN (${rowIds.join(', ')});`
    return options.db.prepare(sql).all() as Chunk[]
  }

  return {
    options,
    logger,
    createArticles,
    semanticSearch,
  }
}

function findArticlesByHash(db: any, hash: string[]): Article[] {
  const query = hash.map(item => `hash = '${item}'`).join(' OR ')
  const sql = `SELECT * from articles WHERE ${query};`
  return db.prepare(sql).all()
}

async function createManyArticles(db: any, values: Article[]) {
  values = values.map(item => ({ ...item, hash: hash(item.content) }))
  const map: Record<string, Article> = {}
  values.forEach(value => map[value.hash!] = value)
  const exists = findArticlesByHash(db, Object.keys(map))
  const filters: Record<string, Article> = {}
  Object.entries(map).forEach(([hash, item]) => {
    if (!exists.some(item => hash === item.hash))
      filters[hash] = item
  })

  const a = Object.values(filters)
  if (!a.length)
    return exists

  const sql = `INSERT INTO articles (name, hash) VALUES ${a.map(({ name, hash }) => `('${name}', '${hash}')`).join(', ')};`
  db.prepare(sql).run()
  const articles = findArticlesByHash(db, a.map(({ hash }) => hash!))

  async function split({ id, hash }: Article) {
    const { content } = map[hash!] ?? {}
    if (id && content) {
      const texts = await splitter.createDocuments([content])
      const chunks: Chunk[] = texts.map(({ pageContent }) => ({ article_id: id, content: pageContent }))
      createManyChunks(db, chunks)
    }
  }

  await Promise.all(articles.map(split))
  return [...exists, ...articles]
}

async function createManyChunks(db: any, values: Chunk[]) {
  if (!values.length)
    return
  const sql = `INSERT INTO chunks (article_id, content) VALUES ${values.map(({ article_id, content }) => `(${article_id}, '${content}')`).join(', ')};`
  db.prepare(sql).run()
  const chunks = findChunksByArticleIds(db, [values[0]!.article_id])
  await Promise.all(chunks.map(chunk => createEmbeddings(db, chunk)))
}

async function createEmbeddings(db: any, chunk: Chunk) {
  const embedding = await embed(chunk.content)
  if (!embedding?.length)
    return
  const sql = `INSERT INTO bge_m3 (rowid, embedding) VALUES (${chunk.id}, '[${embedding.join(', ')}]');`
  db.prepare(sql).run()
}

function findChunksByArticleIds(db: any, articleIds: number[]): Chunk[] {
  const query = articleIds.map(id => `article_id = ${id}`).join(' OR ')
  const sql = `SELECT * from chunks WHERE ${query};`
  const chunks = db.prepare(sql).all()
  if (Array.isArray(chunks))
    return chunks
  return [chunks].filter(Boolean)
}

function semanticSearchWithBgeM3(db: any, embedding: number[], limit: number = 5, ids: number[] = []): { rowid: number }[] {
  const query = [ids.length && `rowid IN (${ids.join(', ')})`, `embedding MATCH '[${embedding.join(', ')}]'`].filter(Boolean).join(' AND ')
  const sql = `SELECT rowid from bge_m3 WHERE ${query} ORDER BY distance LIMIT ${limit};`
  return db.prepare(sql).all()
}
