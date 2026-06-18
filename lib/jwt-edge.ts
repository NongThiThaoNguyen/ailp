import { SignJWT, jwtVerify } from 'jose'

const SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'fallback-secret-32-chars-minimum!!')
const EXPIRE = '7d'

export async function signToken(payload: { userId:number; email:string; role:string }) {
  return new SignJWT(payload).setProtectedHeader({alg:'HS256'}).setIssuedAt().setExpirationTime(EXPIRE).sign(SECRET)
}

export async function verifyToken(token: string) {
  try { return (await jwtVerify(token, SECRET)).payload as { userId:number; email:string; role:string } }
  catch { return null }
}