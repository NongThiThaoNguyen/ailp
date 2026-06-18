import { NextRequest, NextResponse } from 'next/server'
import { queryOne, query, exec } from '@/lib/db'
import { requireUser } from '@/lib/auth'

export async function GET(req: NextRequest, ctx: {params:Promise<{id:string}>}) {
  try {
    const user = await requireUser(req)
    const {id} = await ctx.params
    const cid  = Number(id)
    if (isNaN(cid)) return NextResponse.json({error:'ID không hợp lệ'},{status:400})

    const course = await queryOne(
      `SELECT c.*,cc.name AS category_name,cl.name AS level_name,up.full_name AS instructor_name,
              ISNULL(AVG(cr.rating),0) AS avg_rating,
              MAX(CASE WHEN ue.user_id=@uid THEN ue.progress_percentage ELSE 0 END) AS progress_percentage,
              MAX(CASE WHEN ue.user_id=@uid THEN 1 ELSE 0 END) AS is_enrolled
       FROM courses c
       LEFT JOIN course_categories cc ON cc.id=c.category_id
       LEFT JOIN course_levels cl ON cl.id=c.level_id
       LEFT JOIN user_profiles up ON up.user_id=c.instructor_id
       LEFT JOIN course_reviews cr ON cr.course_id=c.id
       LEFT JOIN user_enrollments ue ON ue.course_id=c.id
       WHERE c.id=@cid
       GROUP BY c.id,c.category_id,c.level_id,c.instructor_id,c.title,c.description,c.thumbnail,c.status,c.created_at,c.updated_at,cc.name,cl.name,up.full_name`,
      {uid:user.id,cid}
    )
    if (!course) return NextResponse.json({error:'Không tìm thấy khóa học'},{status:404})

    const modules = await query(
      `SELECT cm.id,cm.title,cm.order_index FROM course_modules cm WHERE cm.course_id=@cid ORDER BY cm.order_index`,
      {cid}
    )
    const modulesWithLessons = await Promise.all(
      (modules as Array<{id:number;title:string;order_index:number}>).map(async m => {
        const lessons = await query(
          `SELECT cl.id,cl.title,cl.content_type,cl.duration_minutes,cl.order_index,
                  ISNULL(ulp.is_completed,0) AS is_completed,ISNULL(ulp.time_spent_seconds,0) AS time_spent
           FROM course_lessons cl
           LEFT JOIN user_lesson_progress ulp ON ulp.lesson_id=cl.id AND ulp.user_id=@uid
           WHERE cl.module_id=@mid ORDER BY cl.order_index`,
          {uid:user.id,mid:m.id}
        )
        return {...m, lessons}
      })
    )
    return NextResponse.json({data:{...course, modules: modulesWithLessons}})
  } catch(e:unknown){
    if(e instanceof Error&&e.message==='UNAUTHORIZED') return NextResponse.json({error:'Chưa đăng nhập'},{status:401})
    return NextResponse.json({error:'Lỗi máy chủ'},{status:500})
  }
}

export async function POST(req: NextRequest, ctx: {params:Promise<{id:string}>}) {
  try {
    const user = await requireUser(req)
    const {id} = await ctx.params
    const cid  = Number(id)
    const exists = await queryOne(`SELECT id FROM user_enrollments WHERE user_id=@uid AND course_id=@cid`,{uid:user.id,cid})
    if (exists) return NextResponse.json({error:'Đã đăng ký khóa học này'},{status:409})
    await exec(`INSERT INTO user_enrollments(user_id,course_id,progress_percentage,status,enrolled_at) VALUES(@uid,@cid,0,'enrolled',GETDATE())`,{uid:user.id,cid})
    return NextResponse.json({message:'Đăng ký thành công'},{status:201})
  } catch(e:unknown){
    if(e instanceof Error&&e.message==='UNAUTHORIZED') return NextResponse.json({error:'Chưa đăng nhập'},{status:401})
    return NextResponse.json({error:'Lỗi máy chủ'},{status:500})
  }
}