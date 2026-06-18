import { NextRequest, NextResponse } from 'next/server'
import { queryOne, exec } from '@/lib/db'
import { requireUser } from '@/lib/auth'
import { z } from 'zod'
const S = z.object({time_spent_seconds:z.number().min(0),is_completed:z.boolean().default(false)})
export async function POST(req: NextRequest, ctx: {params:Promise<{id:string}>}) {
  try {
    const user = await requireUser(req)
    const {id} = await ctx.params
    const lid = Number(id)
    const p = S.safeParse(await req.json())
    if (!p.success) return NextResponse.json({error:'Dữ liệu không hợp lệ'},{status:400})
    const {time_spent_seconds,is_completed} = p.data
    const existing = await queryOne(`SELECT id,time_spent_seconds FROM user_lesson_progress WHERE user_id=@uid AND lesson_id=@lid`,{uid:user.id,lid})
    if (existing) {
      await exec(`UPDATE user_lesson_progress SET time_spent_seconds=time_spent_seconds+@t,is_completed=CASE WHEN @done=1 THEN 1 ELSE is_completed END,last_viewed_at=GETDATE(),completed_at=CASE WHEN @done=1 AND completed_at IS NULL THEN GETDATE() ELSE completed_at END WHERE user_id=@uid AND lesson_id=@lid`,{uid:user.id,lid,t:time_spent_seconds,done:is_completed})
    } else {
      await exec(`INSERT INTO user_lesson_progress(user_id,lesson_id,is_completed,last_viewed_at,time_spent_seconds,completed_at) VALUES(@uid,@lid,@done,GETDATE(),@t,CASE WHEN @done=1 THEN GETDATE() ELSE NULL END)`,{uid:user.id,lid,done:is_completed,t:time_spent_seconds})
    }
    // Update enrollment progress
    const progress = await queryOne<{total:number;done:number}>(`SELECT COUNT(cl.id) AS total, SUM(CASE WHEN ulp.is_completed=1 THEN 1 ELSE 0 END) AS done FROM course_lessons cl JOIN course_modules cm ON cm.id=cl.module_id JOIN courses c ON c.id=cm.course_id JOIN user_enrollments ue ON ue.course_id=c.id AND ue.user_id=@uid LEFT JOIN user_lesson_progress ulp ON ulp.lesson_id=cl.id AND ulp.user_id=@uid WHERE c.id=(SELECT cm2.course_id FROM course_modules cm2 JOIN course_lessons cl2 ON cl2.module_id=cm2.id WHERE cl2.id=@lid)`,{uid:user.id,lid})
    if (progress && progress.total>0) {
      const pct = Math.round(progress.done/progress.total*100)
      await exec(`UPDATE user_enrollments SET progress_percentage=@pct,status=CASE WHEN @pct=100 THEN 'completed' ELSE 'in_progress' END,completed_at=CASE WHEN @pct=100 AND completed_at IS NULL THEN GETDATE() ELSE completed_at END WHERE user_id=@uid AND course_id=(SELECT cm2.course_id FROM course_modules cm2 JOIN course_lessons cl2 ON cl2.module_id=cm2.id WHERE cl2.id=@lid)`,{uid:user.id,lid,pct})
    }
    return NextResponse.json({message:'Cập nhật tiến độ thành công'})
  } catch(e:unknown){ if(e instanceof Error&&e.message==='UNAUTHORIZED') return NextResponse.json({error:'Chưa đăng nhập'},{status:401}); return NextResponse.json({error:'Lỗi máy chủ'},{status:500}) }
}