export async function ensureSqlite() {
  await ensureFile('dolla.db')
}
