import Database from 'bun:sqlite'
import * as sqliteVec from 'sqlite-vec'

Database.setCustomSQLite('./deps/libsqlite3.dylib')

interface VecVersion {
  vec_version: string
}

const sql = `CREATE TABLE IF NOT EXISTS articles (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    hash TEXT
);

CREATE TABLE IF NOT EXISTS conversation_articles (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    conversation_id INTEGER,
    article_id INTEGER
);

CREATE TABLE IF NOT EXISTS chunks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    article_id INTEGER,
    content TEXT
);

CREATE VIRTUAL TABLE IF NOT EXISTS llama3_1 USING vec0(
  embedding float[4096],
);`

export function setupSqlite(filename: string) {
  const db = new Database(filename)
  sqliteVec.load(db)
  db.exec(sql)
  return db
}

export function queryVecVersion(db: any): VecVersion {
  return db.prepare('select vec_version() as vec_version;').get()
}
