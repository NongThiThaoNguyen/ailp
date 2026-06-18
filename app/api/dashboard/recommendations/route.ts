import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db'
import { requireUser } from '@/lib/auth'
export async function GET(req: NextRequest) {
  try {
    const {id:uid} = await requireUser(req)
    const recs = await query(`SELECT TOP 5 ar.id,ar.recommendation_type,ar.target_id,ar.reason_phrase,ar.confidence_score,c.title,cl.name AS level_name,cc.name AS cat_name FROM ai_recommendations ar LEFT JOIN courses c ON c.id=ar.target_id LEFT JOIN course_levels cl ON cl.id=c.level_id LEFT JOIN course_categories cc ON cc.id=c.category_id WHERE ar.user_id=@uid AND ar.is_applied=0 ORDER BY ar.confidence_score DESC`,{uid})
    return NextResponse.json({data:recs})
  } catch(e:unknown){ if(e instanceof Error&&e.message==='UNAUTHORIZED') return NextResponse.json({error:'Chưa đăng nhập'},{status:401}); return NextResponse.json({error:'Lỗi máy chủ'},{status:500}) }
}