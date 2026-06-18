import { NextRequest, NextResponse } from 'next/server'
import { query, queryOne } from '@/lib/db'
import { requireUser } from '@/lib/auth'
export async function GET(req: NextRequest) {
  try {
    const {id:uid} = await requireUser(req)
    const days = Number(req.nextUrl.searchParams.get('days')||30)
    const [daily, style, weakness] = await Promise.all([
      query(`SELECT CAST(last_viewed_at AS DATE) AS date, SUM(time_spent_seconds)/60 AS minutes FROM user_lesson_progress WHERE user_id=@uid AND last_viewed_at>=DATEADD(day,-@days,GETDATE()) GROUP BY CAST(last_viewed_at AS DATE) ORDER BY date`,{uid,days}),
      queryOne(`SELECT visual_score,auditory_score,reading_writing_score,kinesthetic_score,dominant_style FROM ai_learning_styles WHERE user_id=@uid`,{uid}),
      query(`SELECT uw.error_frequency, cc.name AS category FROM user_weaknesses uw JOIN course_categories cc ON cc.id=uw.category_id WHERE uw.user_id=@uid ORDER BY uw.error_frequency DESC`,{uid}),
    ])
    return NextResponse.json({data:{daily,style,weakness}})
  } catch(e:unknown){ if(e instanceof Error&&e.message==='UNAUTHORIZED') return NextResponse.json({error:'Chưa đăng nhập'},{status:401}); return NextResponse.json({error:'Lỗi máy chủ'},{status:500}) }
}