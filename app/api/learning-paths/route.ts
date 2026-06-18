import { NextRequest, NextResponse } from 'next/server'
import { query, queryOne } from '@/lib/db'
import { requireUser } from '@/lib/auth'
export async function GET(req: NextRequest) {
  try {
    const {id:uid} = await requireUser(req)
    const path = await queryOne(`SELECT id,title,target_goal,estimated_days,created_at FROM ai_learning_paths WHERE user_id=@uid ORDER BY created_at DESC`,{uid})
    if (!path) return NextResponse.json({data:null})
    const pid = (path as {id:number}).id
    const nodes = await query(`SELECT n.id,n.node_order,n.status,c.id AS course_id,c.title,c.description,c.thumbnail,cl.name AS level_name,cc.name AS cat_name,ISNULL(ue.progress_percentage,0) AS progress FROM ai_learning_path_nodes n JOIN courses c ON c.id=n.course_id LEFT JOIN course_levels cl ON cl.id=c.level_id LEFT JOIN course_categories cc ON cc.id=c.category_id LEFT JOIN user_enrollments ue ON ue.course_id=c.id AND ue.user_id=@uid WHERE n.path_id=@pid ORDER BY n.node_order`,{uid,pid})
    const done  = nodes.filter((n:unknown)=>(n as {status:string}).status==='completed').length
    return NextResponse.json({data:{...path, nodes, overall_progress: nodes.length? Math.round(done/nodes.length*100):0}})
  } catch(e:unknown){ if(e instanceof Error&&e.message==='UNAUTHORIZED') return NextResponse.json({error:'Chưa đăng nhập'},{status:401}); return NextResponse.json({error:'Lỗi máy chủ'},{status:500}) }
}