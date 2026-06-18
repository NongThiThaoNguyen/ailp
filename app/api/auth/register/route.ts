import { NextRequest, NextResponse } from 'next/server'
import { query, exec } from '@/lib/db'
import { hashPwd, signToken, createSession, cookieCfg } from '@/lib/auth'
import { z } from 'zod'
const S = z.object({ email:z.string().email(), password:z.string().min(8), full_name:z.string().min(2), role:z.enum(['student','teacher']).default('student') })
export async function POST(req: NextRequest) {
  try {
    const p = S.safeParse(await req.json())
    if (!p.success) return NextResponse.json({error:'Dữ liệu không hợp lệ',details:p.error.flatten()},{status:400})
    const { email,password,full_name,role } = p.data
    if ((await query(`SELECT id FROM users WHERE email=@e`,{e:email})).length)
      return NextResponse.json({error:'Email đã được sử dụng'},{status:409})
    const hashed = await hashPwd(password)
    const {insertedId:uid} = await exec(`INSERT INTO users(email,password,role,status,created_at,updated_at) OUTPUT INSERTED.id AS inserted_id VALUES(@e,@p,@r,'active',GETDATE(),GETDATE())`,{e:email,p:hashed,r:role})
    if (!uid) throw new Error('Insert failed')
    await Promise.all([
      exec(`INSERT INTO user_profiles(user_id,full_name,created_at,updated_at) VALUES(@uid,@fn,GETDATE(),GETDATE())`,{uid,fn:full_name}),
      exec(`INSERT INTO user_settings(user_id,language,timezone,email_notifications,marketing_emails,private_profile,created_at,updated_at) VALUES(@uid,'vi','SE Asia Standard Time',1,0,0,GETDATE(),GETDATE())`,{uid}),
      exec(`INSERT INTO user_study_streaks(user_id,current_streak,longest_streak,updated_at) VALUES(@uid,0,0,GETDATE())`,{uid}),
      exec(`INSERT INTO input_competency_tests(user_id,requires_test,test_status,created_at) VALUES(@uid,1,'not_started',GETDATE())`,{uid}),
    ])
    const token = await signToken({userId:uid,email,role})
    await createSession(uid,token,req)
    const r = NextResponse.json({message:'Đăng ký thành công',userId:uid,redirect:'/competency-test'},{status:201})
    r.cookies.set(cookieCfg(token)); return r
  } catch(e){console.error('[register]',e);return NextResponse.json({error:'Lỗi máy chủ'},{status:500})}
}
