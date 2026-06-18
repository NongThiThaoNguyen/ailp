import { NextRequest, NextResponse } from 'next/server'
import { queryOne } from '@/lib/db'
import { requireUser } from '@/lib/auth'
export async function GET(req: NextRequest) {
  try {
    const {id:uid} = await requireUser(req)
    const [tod,yes,lt,ly,an,ap,str,unr,tot] = await Promise.all([
      queryOne<{m:number}>(`SELECT ISNULL(SUM(time_spent_seconds),0)/60 AS m FROM user_lesson_progress WHERE user_id=@uid AND CAST(last_viewed_at AS DATE)=CAST(GETDATE() AS DATE)`,{uid}),
      queryOne<{m:number}>(`SELECT ISNULL(SUM(time_spent_seconds),0)/60 AS m FROM user_lesson_progress WHERE user_id=@uid AND CAST(last_viewed_at AS DATE)=CAST(DATEADD(day,-1,GETDATE()) AS DATE)`,{uid}),
      queryOne<{c:number}>(`SELECT COUNT(*) AS c FROM user_lesson_progress WHERE user_id=@uid AND is_completed=1 AND CAST(completed_at AS DATE)=CAST(GETDATE() AS DATE)`,{uid}),
      queryOne<{c:number}>(`SELECT COUNT(*) AS c FROM user_lesson_progress WHERE user_id=@uid AND is_completed=1 AND CAST(completed_at AS DATE)=CAST(DATEADD(day,-1,GETDATE()) AS DATE)`,{uid}),
      queryOne<{a:number}>(`SELECT ISNULL(AVG(score_achieved),0) AS a FROM quiz_attempts WHERE user_id=@uid AND started_at>=DATEADD(day,-30,GETDATE())`,{uid}),
      queryOne<{a:number}>(`SELECT ISNULL(AVG(score_achieved),0) AS a FROM quiz_attempts WHERE user_id=@uid AND started_at BETWEEN DATEADD(day,-60,GETDATE()) AND DATEADD(day,-30,GETDATE())`,{uid}),
      queryOne<{cur:number;lng:number}>(`SELECT current_streak AS cur,longest_streak AS lng FROM user_study_streaks WHERE user_id=@uid`,{uid}),
      queryOne<{c:number}>(`SELECT COUNT(*) AS c FROM notifications WHERE user_id=@uid AND is_read=0`,{uid}),
      queryOne<{c:number}>(`SELECT COUNT(*) AS c FROM user_lesson_progress WHERE user_id=@uid AND is_completed=1`,{uid}),
    ])
    return NextResponse.json({data:{minutes_today:tod?.m??0,diff_minutes:(tod?.m??0)-(yes?.m??0),lessons_today:lt?.c??0,diff_lessons:(lt?.c??0)-(ly?.c??0),avg_score:Math.round(an?.a??0),diff_score:Math.round((an?.a??0)-(ap?.a??0)),streak_days:str?.cur??0,longest_streak:str?.lng??0,unread_notifications:unr?.c??0,total_lessons_completed:tot?.c??0}})
  } catch(e:unknown){ if(e instanceof Error&&e.message==='UNAUTHORIZED') return NextResponse.json({error:'Chưa đăng nhập'},{status:401}); return NextResponse.json({error:'Lỗi máy chủ'},{status:500}) }
}