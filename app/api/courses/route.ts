import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db'
import { requireUser } from '@/lib/auth'
export async function GET(req: NextRequest) {
  try {
    const user = await requireUser(req)
    const s = req.nextUrl.searchParams
    const cat = s.get('category'), lvl = s.get('level'), search = s.get('q'), page = Number(s.get('page')||1), limit = 12
    const offset = (page-1)*limit
    let where = `WHERE c.status='published'`
    const params: Record<string, any> = {uid:user.id, limit, offset}
    if (cat)    { where += ` AND cc.name=@cat`;    params.cat=cat }
    if (lvl)    { where += ` AND cl.name=@lvl`;    params.lvl=lvl }
    if (search) { where += ` AND c.title LIKE @q`; params.q=`%${search}%` }
    const courses = await query(`
      SELECT c.id,c.title,c.description,c.thumbnail,c.status,c.created_at,
             cc.name AS category_name, cl.name AS level_name, cl.order_index,
             up.full_name AS instructor_name,
             ISNULL(AVG(cr.rating),0) AS avg_rating,
             COUNT(DISTINCT cl2.id) AS total_lessons,
             COUNT(DISTINCT ue.id) AS enrolled_count,
             MAX(CASE WHEN ue2.user_id=@uid THEN 1 ELSE 0 END) AS is_enrolled,
             MAX(CASE WHEN ue2.user_id=@uid THEN ue2.progress_percentage ELSE 0 END) AS progress_percentage
      FROM courses c
      LEFT JOIN course_categories cc ON cc.id=c.category_id
      LEFT JOIN course_levels cl ON cl.id=c.level_id
      LEFT JOIN user_profiles up ON up.user_id=c.instructor_id
      LEFT JOIN course_reviews cr ON cr.course_id=c.id
      LEFT JOIN course_modules cm ON cm.course_id=c.id
      LEFT JOIN course_lessons cl2 ON cl2.module_id=cm.id
      LEFT JOIN user_enrollments ue ON ue.course_id=c.id
      LEFT JOIN user_enrollments ue2 ON ue2.course_id=c.id AND ue2.user_id=@uid
      ${where}
      GROUP BY c.id,c.title,c.description,c.thumbnail,c.status,c.created_at,cc.name,cl.name,cl.order_index,up.full_name
      ORDER BY c.created_at DESC
      OFFSET @offset ROWS FETCH NEXT @limit ROWS ONLY`,params)
    return NextResponse.json({data:courses})
  } catch(e:unknown){ if(e instanceof Error&&e.message==='UNAUTHORIZED') return NextResponse.json({error:'Chưa đăng nhập'},{status:401}); return NextResponse.json({error:'Lỗi máy chủ'},{status:500}) }
}