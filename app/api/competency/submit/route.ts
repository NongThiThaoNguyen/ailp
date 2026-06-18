import { NextRequest, NextResponse } from 'next/server'
import { query, queryOne, exec } from '@/lib/db'
import { requireUser } from '@/lib/auth'
import { evaluateCompetency, generatePath } from '@/lib/ai'
import { z } from 'zod'
const S = z.object({answers:z.array(z.object({question_id:z.number(),answer_id:z.number().optional(),essay_answer:z.string().optional(),time_seconds:z.number().default(0)})),target_goal:z.string().min(2)})
export async function POST(req: NextRequest) {
  try {
    const user = await requireUser(req)
    const p = S.safeParse(await req.json())
    if (!p.success) return NextResponse.json({error:'Dữ liệu không hợp lệ'},{status:400})
    const {answers,target_goal} = p.data
    const test = await queryOne<{id:number;test_status:string}>(`SELECT id,test_status FROM input_competency_tests WHERE user_id=@uid`,{uid:user.id})
    if (!test) return NextResponse.json({error:'Không tìm thấy bài kiểm tra'},{status:404})
    if (test.test_status==='completed') return NextResponse.json({error:'Đã hoàn thành'},{status:409})
    await exec(`UPDATE input_competency_tests SET test_status='in_progress' WHERE id=@id`,{id:test.id})
    const details = await Promise.all(answers.map(async a=>{
      const q = await queryOne<{question_text:string;answer_text:string;is_correct:number}>(`SELECT qb.question_text,qa.answer_text,qa.is_correct FROM question_bank qb LEFT JOIN question_answers qa ON qa.id=@aid AND qa.question_id=qb.id WHERE qb.id=@qid`,{qid:a.question_id,aid:a.answer_id??0})
      return {q:q?.question_text??'',a:a.essay_answer??q?.answer_text??'',correct:(q?.is_correct??0)===1,time:a.time_seconds}
    }))
    const ev = await evaluateCompetency(user.id,details,target_goal)
    await exec(`UPDATE input_competency_tests SET test_status='completed',competency_level=@lvl,score=@sc,ai_evaluation=@ev,tested_at=GETDATE() WHERE id=@id`,{id:test.id,lvl:ev.competency_level,sc:ev.score,ev:ev.evaluation})
    const styleMap:{[k:string]:number[]} = {visual:[80,0,20,0],auditory:[0,80,20,0],reading_writing:[20,0,80,0],kinesthetic:[0,20,0,80]}
    const [v,a,r,k] = styleMap[ev.dominant_style]||[25,25,25,25]
    const hasStyle = await queryOne(`SELECT id FROM ai_learning_styles WHERE user_id=@uid`,{uid:user.id})
    if (hasStyle) await exec(`UPDATE ai_learning_styles SET visual_score=@v,auditory_score=@a,reading_writing_score=@r,kinesthetic_score=@k,dominant_style=@s,updated_at=GETDATE() WHERE user_id=@uid`,{uid:user.id,v,a,r,k,s:ev.dominant_style})
    else await exec(`INSERT INTO ai_learning_styles(user_id,visual_score,auditory_score,reading_writing_score,kinesthetic_score,dominant_style,updated_at) VALUES(@uid,@v,@a,@r,@k,@s,GETDATE())`,{uid:user.id,v,a,r,k,s:ev.dominant_style})
    const cids = (await query<{id:number}>(`SELECT TOP 20 id FROM courses WHERE status='published' ORDER BY id`)).map(c=>c.id)
    const pathData = await generatePath(user.id,ev.competency_level,ev.dominant_style,target_goal,cids)
    const {insertedId:pathId} = await exec(`INSERT INTO ai_learning_paths(user_id,title,target_goal,estimated_days,created_at) OUTPUT INSERTED.id AS inserted_id VALUES(@uid,@t,@g,@d,GETDATE())`,{uid:user.id,t:pathData.title,g:pathData.target_goal,d:pathData.estimated_days})
    if (pathId) for (let i=0;i<(pathData.course_ids||cids.slice(0,5)).length;i++) await exec(`INSERT INTO ai_learning_path_nodes(path_id,course_id,node_order,status) VALUES(@pid,@cid,@ord,@st)`,{pid:pathId,cid:(pathData.course_ids||cids.slice(0,5))[i],ord:i+1,st:i===0?'active':'locked'})
    for (const cid of (pathData.course_ids||cids.slice(0,3)).slice(0,3)) await exec(`INSERT INTO ai_recommendations(user_id,recommendation_type,target_id,reason_phrase,confidence_score,is_applied,created_at) VALUES(@uid,'course',@cid,@r,@sc,0,GETDATE())`,{uid:user.id,cid,r:`Phù hợp mục tiêu "${target_goal}"`,sc:ev.score})
    await exec(`INSERT INTO notifications(user_id,title,message,is_read,notification_type,created_at) VALUES(@uid,N'Lộ trình học đã tạo!',@msg,0,'ai_path',GETDATE())`,{uid:user.id,msg:`AI đã tạo lộ trình "${pathData.title}" cho bạn.`})
    return NextResponse.json({data:{competency_level:ev.competency_level,score:ev.score,dominant_style:ev.dominant_style,path_id:pathId,redirect:'/dashboard'}},{status:201})
  } catch(e:unknown){ if(e instanceof Error&&e.message==='UNAUTHORIZED') return NextResponse.json({error:'Chưa đăng nhập'},{status:401}); console.error('[competency/submit]',e); return NextResponse.json({error:'Lỗi máy chủ'},{status:500}) }
}