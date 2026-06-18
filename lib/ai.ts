import { exec, queryOne } from './db'

const KEY   = process.env.OPENAI_API_KEY || ''
const MODEL = process.env.OPENAI_MODEL   || 'gpt-4o-mini'
const URL   = 'https://api.openai.com/v1/chat/completions'

export interface ChatMsg { role:'system'|'user'|'assistant'; content:string }
export interface AIResult { text:string; prompt_tokens:number; completion_tokens:number; cost:number }

export async function callAI(msgs: ChatMsg[], userId?: number, maxTokens = 1000): Promise<AIResult> {
  const res  = await fetch(URL, {
    method: 'POST',
    headers: { 'Content-Type':'application/json', Authorization:`Bearer ${KEY}` },
    body: JSON.stringify({ model:MODEL, messages:msgs, max_tokens:maxTokens }),
  })
  if (!res.ok) throw new Error(`OpenAI ${res.status}: ${await res.text()}`)
  const d   = await res.json()
  const pt  = d.usage?.prompt_tokens     || 0
  const ct  = d.usage?.completion_tokens || 0
  const cost= pt*0.00000015 + ct*0.0000006
  if (userId) {
    await exec(
      `INSERT INTO ai_api_logs(user_id,provider,model_used,prompt_tokens,completion_tokens,total_cost,created_at)
       VALUES(@uid,'openai',@m,@pt,@ct,@cost,GETDATE())`,
      { uid:userId, m:MODEL, pt, ct, cost }
    )
  }
  return { text: d.choices?.[0]?.message?.content || '', prompt_tokens:pt, completion_tokens:ct, cost }
}

export async function getPrompt(useCase: string): Promise<string> {
  const row = await queryOne<{system_prompt:string}>(`SELECT system_prompt FROM ai_prompts_library WHERE use_case=@uc`, { uc:useCase })
  return row?.system_prompt || DEFAULTS[useCase] || 'Bạn là trợ lý AI hữu ích.'
}

const DEFAULTS: Record<string,string> = {
  tutor_chat: `Bạn là AI Tutor thông minh cho nền tảng học tiếng Anh. Hãy giải thích rõ ràng, dùng ví dụ thực tế, trả lời bằng tiếng Việt. Khuyến khích học viên và gợi ý bài tập khi phù hợp.`,
  competency_eval: `Bạn là chuyên gia đánh giá năng lực học viên. Phân tích kết quả và trả về JSON hợp lệ (không markdown):
{"competency_level":"beginner|intermediate|advanced|expert","score":0-100,"dominant_style":"visual|auditory|reading_writing|kinesthetic","evaluation":"nhận xét ngắn"}`,
  path_gen: `Bạn là AI tạo lộ trình học cá nhân hóa. Dựa trên thông tin học viên, trả về JSON hợp lệ (không markdown):
{"title":"tên lộ trình","target_goal":"mục tiêu","estimated_days":90,"course_ids":[1,2,3],"reasoning":"lý do"}`,
  note_summary: `Tóm tắt ghi chú học tập này thành các bullet points ngắn gọn, súc tích bằng tiếng Việt. Tối đa 150 từ.`,
  quiz_feedback: `Phân tích câu trả lời quiz và giải thích ngắn gọn (dưới 80 từ, tiếng Việt) tại sao đúng/sai.`,
}

export async function evaluateCompetency(userId:number, answers:{q:string;a:string;correct:boolean;time:number}[], goal:string) {
  const sys = await getPrompt('competency_eval')
  const user = `Mục tiêu: ${goal}\nTổng câu: ${answers.length}\nĐúng: ${answers.filter(x=>x.correct).length}\nChi tiết: ${JSON.stringify(answers.slice(0,8))}`
  const r = await callAI([{role:'system',content:sys},{role:'user',content:user}], userId, 400)
  try { return JSON.parse(r.text.replace(/```json|```/g,'').trim()) }
  catch { return { competency_level:'beginner', score:50, dominant_style:'visual', evaluation:r.text } }
}

export async function generatePath(userId:number, level:string, style:string, goal:string, courseIds:number[]) {
  const sys  = await getPrompt('path_gen')
  const user = `Năng lực: ${level}\nPhong cách học: ${style}\nMục tiêu: ${goal}\nKhóa học ID có sẵn: [${courseIds.join(',')}]`
  const r = await callAI([{role:'system',content:sys},{role:'user',content:user}], userId, 600)
  try { return JSON.parse(r.text.replace(/```json|```/g,'').trim()) }
  catch { return { title:`Lộ trình ${goal}`, target_goal:goal, estimated_days:90, course_ids:courseIds.slice(0,5) } }
}
