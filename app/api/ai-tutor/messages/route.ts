import { NextRequest, NextResponse } from 'next/server'
import { query, queryOne, exec } from '@/lib/db'
import { requireUser } from '@/lib/auth'
import { callAI, getPrompt } from '@/lib/ai'
import { z } from 'zod'
import type { AIMessage } from '@/types'
const S = z.object({conversation_id:z.number(),message:z.string().min(1).max(4000),lesson_context:z.string().optional()})
export async function POST(req: NextRequest) {
  try {
    const user = await requireUser(req)
    const p = S.safeParse(await req.json())
    if (!p.success) return NextResponse.json({error:'Dữ liệu không hợp lệ'},{status:400})
    const {conversation_id,message,lesson_context} = p.data
    const conv = await queryOne(`SELECT id FROM ai_conversations WHERE id=@cid AND user_id=@uid`,{cid:conversation_id,uid:user.id})
    if (!conv) return NextResponse.json({error:'Cuộc hội thoại không tồn tại'},{status:404})
    await exec(`INSERT INTO ai_messages(conversation_id,sender,message_text,sent_at) VALUES(@cid,'user',@txt,GETDATE())`,{cid:conversation_id,txt:message})
    const hist = (await query<AIMessage>(`SELECT TOP 10 sender,message_text FROM ai_messages WHERE conversation_id=@cid ORDER BY sent_at DESC`,{cid:conversation_id})).reverse()
    const sys = (await getPrompt('tutor_chat'))+(lesson_context?`\n\nNgữ cảnh bài học:\n${lesson_context}`:'')
    const msgs = [{role:'system' as const,content:sys},...hist.slice(0,-1).map(m=>({role:(m.sender==='user'?'user':'assistant') as 'user'|'assistant',content:m.message_text})),{role:'user' as const,content:message}]
    const result = await callAI(msgs,user.id,1000)
    const {insertedId} = await exec(`INSERT INTO ai_messages(conversation_id,sender,message_text,sent_at) OUTPUT INSERTED.id AS inserted_id VALUES(@cid,'ai',@txt,GETDATE())`,{cid:conversation_id,txt:result.text})
    return NextResponse.json({data:{message_id:insertedId,ai_response:result.text,tokens_used:result.prompt_tokens+result.completion_tokens,cost:result.cost}})
  } catch(e:unknown){ if(e instanceof Error&&e.message==='UNAUTHORIZED') return NextResponse.json({error:'Chưa đăng nhập'},{status:401}); console.error('[ai-tutor/messages]',e); return NextResponse.json({error:'Lỗi máy chủ'},{status:500}) }
}