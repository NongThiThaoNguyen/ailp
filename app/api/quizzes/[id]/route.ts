import { NextRequest, NextResponse } from 'next/server'
import { queryOne, query } from '@/lib/db'
import { requireUser } from '@/lib/auth'

export async function GET(req: NextRequest, ctx: {params:Promise<{id:string}>}) {
  try {
    await requireUser(req)
    const {id} = await ctx.params
    const quizId = Number(id)
    if (isNaN(quizId)) return NextResponse.json({error:'Quiz ID không hợp lệ'},{status:400})

    const quiz = await queryOne(
      `SELECT q.id,q.title,q.passing_score,q.time_limit_minutes,q.lesson_id
       FROM quizzes q WHERE q.id=@qid`,
      {qid:quizId}
    )
    if (!quiz) return NextResponse.json({error:'Quiz không tồn tại'},{status:404})

    const questions = await query(
      `SELECT qb.id,qb.question_text,qb.question_type,qb.difficulty_level,qqm.order_index
       FROM quiz_question_mappings qqm
       JOIN question_bank qb ON qb.id=qqm.question_id
       WHERE qqm.quiz_id=@qid ORDER BY qqm.order_index`,
      {qid:quizId}
    )
    const questionsWithOpts = await Promise.all(
      (questions as Array<{id:number;question_text:string;question_type:string;difficulty_level:string;order_index:number}>).map(async q => {
        const opts = await query(
          `SELECT id,answer_text FROM question_answers WHERE question_id=@qid ORDER BY id`,
          {qid:q.id}
        )
        return {...q, options: opts}
      })
    )
    return NextResponse.json({data:{...quiz, questions: questionsWithOpts}})
  } catch(e:unknown){
    if(e instanceof Error&&e.message==='UNAUTHORIZED') return NextResponse.json({error:'Chưa đăng nhập'},{status:401})
    return NextResponse.json({error:'Lỗi máy chủ'},{status:500})
  }
}