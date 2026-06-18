import { NextRequest, NextResponse } from 'next/server'
import { queryOne } from '@/lib/db'
import { verifyPwd, signToken, createSession, cookieCfg } from '@/lib/auth'
import { z } from 'zod'
const S = z.object({email:z.string().email(),password:z.string().min(1)})
export async function POST(req: NextRequest) {
  try {
    const p = S.safeParse(await req.json())
    if (!p.success) return NextResponse.json({error:'Dữ liệu không hợp lệ'},{status:400})
    const {email,password} = p.data
    const u = await queryOne<{id:number;email:string;password:string;role:string;status:string}>(`SELECT id,email,password,role,status FROM users WHERE email=@e`,{e:email})
    if (!u) return NextResponse.json({error:'Email hoặc mật khẩu không đúng'},{status:401})
    if (u.status!=='active') return NextResponse.json({error:'Tài khoản đã bị khóa'},{status:403})
    if (!await verifyPwd(password,u.password)) return NextResponse.json({error:'Email hoặc mật khẩu không đúng'},{status:401})
    const test = await queryOne<{test_status:string}>(`SELECT test_status FROM input_competency_tests WHERE user_id=@uid`,{uid:u.id})
    const token = await signToken({userId:u.id,email:u.email,role:u.role})
    await createSession(u.id,token,req)
    const redirect = test?.test_status==='not_started'?'/competency-test':'/dashboard'
    const res = NextResponse.json({message:'Đăng nhập thành công',user:{id:u.id,email:u.email,role:u.role},redirect})
    res.cookies.set(cookieCfg(token)); return res
  } catch(e){console.error('[login]',e);return NextResponse.json({error:'Lỗi máy chủ'},{status:500})}
}
