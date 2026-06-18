import sql from 'mssql'

const cfg: sql.config = {
  server:   process.env.DB_SERVER   || 'localhost',
  database: process.env.DB_NAME     || 'AILearningPlatform',
  user:     process.env.DB_USER     || 'sa',
  password: process.env.DB_PASSWORD || '',
  port:     Number(process.env.DB_PORT || 1433),
  options: {
    encrypt:                process.env.DB_ENCRYPT === 'true',
    trustServerCertificate: process.env.DB_TRUST_CERT !== 'false',
    enableArithAbort:       true,
  },
  pool: { max:10, min:0, idleTimeoutMillis:30000 },
}

let pool: sql.ConnectionPool | null = null

export async function getPool(): Promise<sql.ConnectionPool> {
  if (pool?.connected) return pool
  pool = await new sql.ConnectionPool(cfg).connect()
  pool.on('error', () => { pool = null })
  return pool
}

type Primitive = string | number | boolean | Date | null | undefined

function bind(req: sql.Request, params: Record<string, Primitive>) {
  for (const [k, v] of Object.entries(params)) {
    if (v === null || v === undefined)      req.input(k, sql.NVarChar, null)
    else if (typeof v === 'boolean')        req.input(k, sql.Bit, v ? 1 : 0)
    else if (v instanceof Date)             req.input(k, sql.DateTime, v)
    else if (typeof v === 'number' && Number.isInteger(v)) req.input(k, sql.Int, v)
    else if (typeof v === 'number')         req.input(k, sql.Decimal(18,4), v)
    else                                    req.input(k, sql.NVarChar(sql.MAX), String(v))
  }
}

export async function query<T = Record<string,unknown>>(
  q: string, params: Record<string, Primitive> = {}
): Promise<T[]> {
  const r = (await getPool()).request()
  bind(r, params)
  return (await r.query<T>(q)).recordset
}

export async function queryOne<T = Record<string,unknown>>(
  q: string, params: Record<string, Primitive> = {}
): Promise<T | null> {
  return (await query<T>(q, params))[0] ?? null
}

export async function exec(
  q: string, params: Record<string, Primitive> = {}
): Promise<{ rowsAffected: number; insertedId?: number }> {
  const r = (await getPool()).request()
  bind(r, params)
  const res = await r.query(q)
  const rows = res.recordset as Array<{inserted_id?:number}>|undefined
  return { rowsAffected: res.rowsAffected[0]??0, insertedId: rows?.[0]?.inserted_id }
}

export { sql }
