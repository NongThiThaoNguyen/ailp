import { NextRequest, NextResponse } from 'next/server'
import { exec } from '@/lib/db'
export async function POST(req: NextRequest) {
  const token = req.cookies.get('al_token')?.value
  if (token) await exec(`DELETE FROM user_sessions WHERE token=@t`,{t:token}).catch(()=>{})
  const r = NextResponse.json({message:'Đăng xuất thành công'})
  r.cookies.set({name:'al_token',value:'',maxAge:0,path:'/'}); return r
}
