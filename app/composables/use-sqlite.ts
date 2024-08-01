import type Database from '@tauri-apps/plugin-sql'

type Table = 'conversations' | 'messages'

interface CreateOptions {
  data: Record<string, string | number | undefined>
}

interface UpdateOptions {
  data: Record<string, string | number>
  where?: Record<string, string | number>
}

interface FindOptions {
  where?: Record<string, string | number>
}

interface DeleteOptions {
  where?: Record<string, string | number>
}

export function useSqlite() {
  const db = ref<Database>()
  const isReady = ref(false)

  getSqliteInstance().then((i) => {
    db.value = i
    isReady.value = true
  })

  function create(table: Table, options: CreateOptions) {
    const data = Object.entries(options.data)
    const keys = data.map(([k]) => k)
    const values = data.map(([_, v]) => JSON.stringify(v))
    const sql = `INSERT into ${table} (${keys.join(', ')}) VALUES (${values.join(', ')})`
    return db.value?.execute(sql)
  }

  async function createAndReturn<T>(table: Table, options: CreateOptions) {
    const response = await create(table, options)
    const [record] = (await findMany<T>(table, { where: { id: response!.lastInsertId } })) ?? []
    return record
  }

  async function update(table: Table, options: UpdateOptions) {
    const data = Object.entries(options.data).map(([k, v]) => `${k} = ${JSON.stringify(v)}`)
    let sql = `UPDATE ${table} SET ${data.join(', ')}`

    if (options.where) {
      const query = Object.entries(options.where).map(([k, v]) => `${k} = ${JSON.stringify(v)}`).join(' AND ')
      sql = `${sql} WHERE ${query}`
    }

    await db.value?.execute(sql)
  }

  function findMany<T>(table: Table, options: FindOptions = {}) {
    let sql = `SELECT * from ${table}`

    if (options.where) {
      const query = Object.entries(options.where).map(([k, v]) => `${k} = ${JSON.stringify(v)}`).join(' AND ')
      sql = `${sql} WHERE ${query}`
    }

    return db.value?.select<T[]>(sql)
  }

  async function deleteMany(table: Table, options: DeleteOptions = {}) {
    let sql = `DELETE from ${table}`

    if (options.where) {
      const query = Object.entries(options.where).map(([k, v]) => `${k} = ${JSON.stringify(v)}`).join(' AND ')
      sql = `${sql} WHERE ${query}`
    }

    await db.value?.execute(sql)
  }

  return {
    db,
    isReady,
    create,
    createAndReturn,
    update,
    findMany,
    deleteMany,
  }
}
