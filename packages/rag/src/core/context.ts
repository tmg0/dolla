import { embed } from './ollama'
import type { Options } from './options'

interface SemanticSearchOptions {
  articleId: number
  limit: number
}

interface Chunk {
  id: number
  article_id: number
  content: string
}

export function createContext(options: Options) {
  async function createArticle(filepath: string) {
    return filepath
  }

  async function semanticSearch({ limit, articleId }: Partial<SemanticSearchOptions> = {}): Promise<Chunk[]> {
    const input = options.input
    if (!input)
      return []
    const embedding = await embed(input)
    if (!embedding)
      return []
    const chunkIds = articleId ? findChunksByArticleId(options.db, articleId).map(({ id }) => id) : undefined
    const rowIds = semanticSearchWithBgeM3(options.db, embedding, limit, chunkIds).map(({ rowid }) => rowid)
    const sql = `SELECT * from chunks WHERE id IN (${rowIds.join(', ')});`
    return options.db.prepare(sql).get() as Chunk[]
  }

  return {
    options,
    createArticle,
    semanticSearch,
  }
}

function findChunksByArticleId(db: any, articleId: number): Chunk[] {
  const sql = `SELECT * from chunks WHERE article_id = ${articleId};`
  return db.prepare(sql).get()
}

function semanticSearchWithBgeM3(db: any, embedding: number[], limit: number = 5, ids: number[] = []): { rowid: number }[] {
  const queries = [ids.length && `rowid IN (${ids.join(', ')})`, `embedding MATCH ${JSON.stringify(embedding)}`].filter(Boolean)
  const sql = `SELECT * from bge_m3 WHERE ${queries.join(' AND ')} ORDER BY distance LIMIT ${limit};`
  return db.prepare(sql).get()
}
