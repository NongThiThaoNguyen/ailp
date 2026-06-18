import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db'
import { requireUser } from '@/lib/auth'
export async function GET(req: NextRequest) {
  try {
    const {id:uid} = await requireUser(req)
    const [badges, achievements, streak] = await Promise.all([
      query(`SELECT b.id,b.name,b.description,b.icon,b.criteria_type,b.criteria_value,ub.awarded_at,CASE WHEN ub.id IS NULL THEN 0 ELSE 1 END AS earned FROM badges b LEFT JOIN user_badges ub ON ub.badge_id=b.id AND ub.user_id=@uid`,{uid}),
      query(`SELECT * FROM achievements WHERE user_id=@uid ORDER BY created_at DESC`,{uid}),
      query(`SELECT current_streak,longest_streak FROM user_study_streaks WHERE user_id=@uid`,{uid}),
    ])
    return NextResponse.json({data:{badges,achievements,streak:streak[0]||{current_streak:0,longest_streak:0}}})
  } catch(e:unknown){ if(e instanceof Error&&e.message==='UNAUTHORIZED') return NextResponse.json({error:'Chưa đăng nhập'},{status:401}); return NextResponse.json({error:'Lỗi máy chủ'},{status:500}) }
}