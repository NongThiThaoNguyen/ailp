import { NextRequest, NextResponse } from 'next/server'
import { queryOne, query, exec } from '@/lib/db'
import { requireUser } from '@/lib/auth'
import { callAI, getPrompt } from '@/lib/ai'
import { z } from 'zod'

const S = z.object({
  answers: z.array(z.object({
    question_id:        z.number(),
    selected_answer_id: z.number().optional(),
    essay_answer:       z.string().optional(),
  }))
})

async function updateStreak(userId: number) {
  const today = new Date().toISOString().split('T')[0]
  const s = await queryOne<{id:number;current_streak:number;longest_streak:number;last_active_date:string}>(
    `SELECT id,current_streak,longest_streak,CONVERT(varchar,last_active_date,23) AS last_active_date FROM user_study_streaks WHERE user_id=@uid`,
    {uid:userId}
  )
  if (!s) return
  if (s.last_active_date === today) return
  const yest = new Date(Date.now()-86400000).toISOString().split('T')[0]
  const newStr = s.last_active_date===yest ? s.current_streak+1 : 1
  const lng    = Math.max(newStr, s.longest_streak)
  await exec(`UPDATE user_study_streaks SET current_streak=@s,longest_streak=@l,last_active_date=@d,updated_at=GETDATE() WHERE id=@id`,
    {id:s.id,s:newStr,l:lng,d:today})
}

async function checkBadges(userId: number) {
  const badges = await query<{id:number;criteria_type:string;criteria_value:string}>(
    `SELECT id,criteria_type,criteria_value FROM badges`
  )
  for (const b of badges) {
    const has = await queryOne(`SELECT id FROM user_badges WHERE user_id=@uid AND badge_id=@bid`,{uid:userId,bid:b.id})
    if (has) continue
    let earned = false
    if (b.criteria_type==='quizzes_done') {
      const c = await queryOne<{c:number}>(`SELECT COUNT(*) AS c FROM quiz_attempts WHERE user_id=@uid AND is_passed=1`,{uid:userId})
      earned = (c?.c||0) >= Number(b.criteria_value)
    } else if (b.criteria_type==='lessons_completed') {
      const c = await queryOne<{c:number}>(`SELECT COUNT(*) AS c FROM user_lesson_progress WHERE user_id=@uid AND is_completed=1`,{uid:userId})
      earned = (c?.c||0) >= Number(b.criteria_value)
    } else if (b.criteria_type==='streak') {
      const st = await queryOne<{current_streak:number}>(`SELECT current_streak FROM user_study_streaks WHERE user_id=@uid`,{uid:userId})
      earned = (st?.current_streak||0) >= Number(b.criteria_value)
    }
    if (earned) {
      await exec(`INSERT INTO user_badges(user_id,badge_id,awarded_at) VALUES(@uid,@bid,GETDATE())`,{uid:userId,bid:b.id})
      await exec(`INSERT INTO notifications(user_id,title,message,is_read,notification_type,created_at) VALUES(@uid,N'Huy hiệu mới!',N'Bạn vừa nhận được huy hiệu mới! Kiểm tra trang Thành tích.',0,'badge',GETDATE())`,{uid:userId})
    }
  }
}

export async function POST(req: NextRequest, ctx: {params:Promise<{id:string}>}) {
  try {
    const user   = await requireUser(req)
    const {id}   = await ctx.params
    const quizId = Number(id)
    if (isNaN(quizId)) return NextResponse.json({error:'Quiz ID không hợp lệ'},{status:400})

    const p = S.safeParse(await req.json())
    if (!p.success) return NextResponse.json({error:'Dữ liệu không hợp lệ'},{status:400})

    const quiz = await queryOne<{id:number;passing_score:number;title:string}>(
      `SELECT id,passing_score,title FROM quizzes WHERE id=@qid`,{qid:quizId}
    )
    if (!quiz) return NextResponse.json({error:'Quiz không tồn tại'},{status:404})

    const {insertedId:attemptId} = await exec(
      `INSERT INTO quiz_attempts(user_id,quiz_id,started_at) OUTPUT INSERTED.id AS inserted_id VALUES(@uid,@qid,GETDATE())`,
      {uid:user.id,qid:quizId}
    )
    if (!attemptId) throw new Error('Cannot create attempt')

    let correct = 0
    const total = p.data.answers.length

    for (const a of p.data.answers) {
      const correctAns = await queryOne<{id:number}>(`SELECT id FROM question_answers WHERE question_id=@qid AND is_correct=1`,{qid:a.question_id})
      const isCorrect   = a.selected_answer_id ? a.selected_answer_id===correctAns?.id : false
      if (isCorrect) correct++

      let aiFeedback: string|null = null
      if (a.essay_answer) {
        const qRow = await queryOne<{question_text:string}>(`SELECT question_text FROM question_bank WHERE id=@qid`,{qid:a.question_id})
        const sys  = await getPrompt('quiz_feedback')
        const res  = await callAI([{role:'system',content:sys},{role:'user',content:`Câu hỏi: ${qRow?.question_text}
Câu trả lời: ${a.essay_answer}`}],user.id,150)
        aiFeedback = res.text
      }

      await exec(
        `INSERT INTO quiz_attempt_details(attempt_id,question_id,selected_answer_id,essay_answer,is_correct_result,ai_feedback) VALUES(@aid,@qid,@selid,@essay,@correct,@fb)`,
        {aid:attemptId,qid:a.question_id,selid:a.selected_answer_id??null,essay:a.essay_answer??null,correct:isCorrect,fb:aiFeedback}
      )

      if (!isCorrect) {
        const catRow = await queryOne<{category_id:number}>(
          `SELECT c.category_id FROM courses c JOIN course_modules cm ON cm.course_id=c.id JOIN course_lessons cl ON cl.module_id=cm.id JOIN quizzes q ON q.lesson_id=cl.id WHERE q.id=@qid`,
          {qid:quizId}
        )
        if (catRow?.category_id) {
          const wk = await queryOne<{id:number}>(`SELECT id FROM user_weaknesses WHERE user_id=@uid AND category_id=@cid`,{uid:user.id,cid:catRow.category_id})
          if (wk) await exec(`UPDATE user_weaknesses SET error_frequency=error_frequency+1,updated_at=GETDATE() WHERE id=@id`,{id:wk.id})
          else    await exec(`INSERT INTO user_weaknesses(user_id,category_id,error_frequency,updated_at) VALUES(@uid,@cid,1,GETDATE())`,{uid:user.id,cid:catRow.category_id})
        }
      }
    }

    const score  = total>0 ? Math.round(correct/total*100) : 0
    const passed = score >= quiz.passing_score
    await exec(`UPDATE quiz_attempts SET score_achieved=@sc,is_passed=@ps,submitted_at=GETDATE() WHERE id=@aid`,
      {sc:score,ps:passed,aid:attemptId})

    await Promise.all([checkBadges(user.id), updateStreak(user.id)])

    return NextResponse.json({data:{attempt_id:attemptId,score,is_passed:passed,correct,total,passing_score:quiz.passing_score}})
  } catch(e:unknown){
    if(e instanceof Error&&e.message==='UNAUTHORIZED') return NextResponse.json({error:'Chưa đăng nhập'},{status:401})
    console.error('[quiz/attempt]',e)
    return NextResponse.json({error:'Lỗi máy chủ'},{status:500})
  }
}