import { cookies } from 'next/headers'
import { NextRequest } from 'next/server'
import { query, queryOne, exec } from './db'
import type { User } from '@/types'
import bcrypt from 'bcryptjs'
import { verifyToken } from './jwt-edge'

export { signToken, verifyToken } from './jwt-edge'

const COOKIE = 'al_token'

export const hashPwd   = (p: string) => bcrypt.hash(p, 12)
export const verifyPwd = (p: string, h: string) => bcrypt.compare(p, h)

export async function getUser(req?: NextRequest): Promise<User | null> {
  let token: string | undefined
  if (req) {
    token = req.cookies.get(COOKIE)?.value || req.headers.get('authorization')?.replace('Bearer ','')
  } else {
    const jar = await cookies()
    token = jar.get(COOKIE)?.value
  }
  if (!token) return null
  const p = await verifyToken(token)
  if (!p) return null
  return queryOne<User>(`SELECT id,email,role,status,created_at,updated_at FROM users WHERE id=@id AND status='active'`, { id: p.userId })
}

export async function requireUser(req?: NextRequest): Promise<User> {
  const u = await getUser(req)
  if (!u) throw Object.assign(new Error('UNAUTHORIZED'), { status: 401 })
  return u
}

export async function createSession(userId: number, token: string, req?: NextRequest) {
  const ua  = req?.headers.get('user-agent') || null
  const ip  = req?.headers.get('x-forwarded-for')?.split(',')[0] || null
  const exp = new Date(Date.now() + 7*24*3600*1000)
  await exec(
    `INSERT INTO user_sessions(user_id,token,ip_address,user_agent,last_activity,created_at,expires_at)
     VALUES(@uid,@tok,@ip,@ua,GETDATE(),GETDATE(),@exp)`,
    { uid:userId, tok:token, ip, ua, exp }
  )
}

export function cookieCfg(token: string) {
  return { name:COOKIE, value:token, httpOnly:true, secure:process.env.NODE_ENV==='production', sameSite:'lax' as const, maxAge:7*24*3600, path:'/' }
}