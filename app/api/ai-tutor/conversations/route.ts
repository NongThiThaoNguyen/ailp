import { NextRequest, NextResponse } from 'next/server'
import { query, exec } from '@/lib/db'
import { requireUser } from '@/lib/auth'
import { z } from 'zod'
const S = z.object({title:z.string().optional(),lesson_id:z.number().optional()})
export async function GET(req: NextRequest) {
  try {
    const {id:uid} = await requireUser(req)
    const convs = await query(`SELECT TOP 20 id,title,lesson_id,created_at FROM ai_conversations WHERE user_id=@uid ORDER BY created_at DESC`,{uid})
    return NextResponse.json({data:convs})
  } catch(e:unknown){ if(e instanceof Error&&e.message==='UNAUTHORIZED') return NextResponse.json({error:'Chưa đăng nhập'},{status:401}); return NextResponse.json({error:'Lỗi máy chủ'},{status:500}) }
}
export async function POST(req: NextRequest) {
  try {
    const {id:uid} = await requireUser(req)
    const p = S.safeParse(await req.json())
    const {title,lesson_id} = p.success?p.data:{}
    const {insertedId} = await exec(`INSERT INTO ai_conversations(user_id,lesson_id,title,created_at) OUTPUT INSERTED.id AS inserted_id VALUES(@uid,@lid,@t,GETDATE())`,{uid,lid:lesson_id??null,t:title??'Cuộc hội thoại mới'})
    return NextResponse.json({data:{id:insertedId}},{status:201})
  } catch(e:unknown){ if(e instanceof Error&&e.message==='UNAUTHORIZED') return NextResponse.json({error:'Chưa đăng nhập'},{status:401}); return NextResponse.json({error:'Lỗi máy chủ'},{status:500}) }
}