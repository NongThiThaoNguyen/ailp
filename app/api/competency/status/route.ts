import { NextRequest, NextResponse } from 'next/server'
import { queryOne } from '@/lib/db'
import { requireUser } from '@/lib/auth'
export async function GET(req: NextRequest) {
  try {
    const {id:uid} = await requireUser(req)
    const t = await queryOne(`SELECT id,test_status,competency_level,score,ai_evaluation,tested_at FROM input_competency_tests WHERE user_id=@uid`,{uid})
    return NextResponse.json({data:t})
  } catch(e:unknown){ if(e instanceof Error&&e.message==='UNAUTHORIZED') return NextResponse.json({error:'Chưa đăng nhập'},{status:401}); return NextResponse.json({error:'Lỗi máy chủ'},{status:500}) }
}