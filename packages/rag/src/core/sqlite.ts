import Database from 'better-sqlite3'
import * as sqliteVec from 'sqlite-vec'

interface VecVersion {
  vec_version: string
}

const sql = `CREATE TABLE IF NOT EXISTS articles (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    hash TEXT
);

CREATE TABLE IF NOT EXISTS chunks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    article_id INTEGER,
    content TEXT
);

CREATE VIRTUAL TABLE IF NOT EXISTS bge_m3 USING vec0(
  embedding float[1024],
);`

export function setupSqlite(filename: string) {
  const db = new Database(filename, { fileMustExist: true })
  sqliteVec.load(db)
  db.exec(sql)
  return db
}

export function queryVecVersion(db: any): VecVersion {
  return db.prepare('select vec_version() as vec_version;').get()
}
