import Database from '@tauri-apps/plugin-sql'

interface Sqlite {
  db?: Database
}

const sql = `CREATE TABLE IF NOT EXISTS conversations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    create_time DATETIME DEFAULT CURRENT_TIMESTAMP,
    update_time DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    role TEXT NOT NULL,
    content TEXT,
    images TEXT,
    conversation_id INTEGER,
    create_time DATETIME DEFAULT CURRENT_TIMESTAMP,
    update_time DATETIME DEFAULT CURRENT_TIMESTAMP
);`

export const sqlite: Sqlite = { db: undefined }

export async function ensureSqlite() {
  if (sqlite.db)
    await sqlite.db.close()
  await ensureFile('dolla.db')
  sqlite.db = await Database.load('sqlite:dolla.db')
  await sqlite.db.execute(sql)
}

export async function getSqliteInstance() {
  if (!sqlite.db)
    await ensureSqlite()
  return sqlite.db!
}
