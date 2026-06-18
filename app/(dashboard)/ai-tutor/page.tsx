'use client'
import { useState, useRef, useEffect } from 'react'

interface Msg { id:number; role:'user'|'ai'; text:string; time:string }
const INIT:Msg[] = [{id:1,role:'ai',time:'',text:'Xin chào! 👋 Tôi là AI Tutor của bạn.\n\nTôi có thể giúp bạn:\n• Giải thích ngữ pháp, từ vựng IELTS/TOEIC\n• Luyện tập bài tập và làm đề\n• Gợi ý lộ trình học phù hợp\n• Phân tích điểm yếu và cải thiện'}]
const QUICK = ['Giải thích Relative Clauses','Luyện tập Listening IELTS','Phân tích điểm yếu của tôi','Gợi ý bài học tiếp theo']
const FALLBACK = ['Đây là câu hỏi hay! Hãy để tôi giải thích chi tiết cho bạn...','Bạn đang tiến bộ rất tốt! 🎉 Hãy tiếp tục nhé!','Tôi đã phân tích và thấy điểm cần cải thiện là Writing. Hãy luyện tập thêm nhé!']

const hhmm = () => new Date().toLocaleTimeString('vi',{hour:'2-digit',minute:'2-digit'})

export default function AITutorPage() {
  const [msgs, setMsgs] = useState<Msg[]>(INIT)
  const [input, setInput] = useState('')
  const [typing, setTyping] = useState(false)
  const [convId, setConvId] = useState<number|null>(null)
  const bot = useRef<HTMLDivElement>(null)

  useEffect(()=>{ bot.current?.scrollIntoView({behavior:'smooth'}) },[msgs,typing])

  useEffect(()=>{
    fetch('/api/ai-tutor/conversations',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({title:'AI Tutor Chat'})})
      .then(r=>r.json()).then(d=>{ if(d.data?.id) setConvId(d.data.id) }).catch(()=>{})
  },[])

  const send = async (text:string) => {
    if (!text.trim()) return
    setMsgs(p=>[...p,{id:Date.now(),role:'user',text,time:hhmm()}])
    setInput('')
    setTyping(true)
    try {
      let aiText = FALLBACK[Math.floor(Math.random()*FALLBACK.length)]
      if (convId) {
        const r = await fetch('/api/ai-tutor/messages',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({conversation_id:convId,message:text})})
        const d = await r.json()
        if (d.data?.ai_response) aiText = d.data.ai_response
      } else {
        await new Promise(r=>setTimeout(r,900))
      }
      setTyping(false)
      setMsgs(p=>[...p,{id:Date.now()+1,role:'ai',text:aiText,time:hhmm()}])
    } catch {
      setTyping(false)
      setMsgs(p=>[...p,{id:Date.now()+1,role:'ai',text:FALLBACK[0],time:hhmm()}])
    }
  }

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] overflow-hidden bg-bg-card border border-bdr rounded-xl">
      <header className="flex items-center justify-between px-7 py-4 border-b border-bdr shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-full bg-gradient-to-br from-brand to-second flex items-center justify-center text-2xl animate-pglow">🤖</div>
          <div>
            <div className="font-bold">AI Tutor</div>
            <div className="text-xs text-ok font-medium">● Đang hoạt động</div>
          </div>
        </div>
        <div className="flex gap-2">
          <button className="btn-ghost text-xs px-3 py-2" onClick={()=>{setMsgs(INIT);setConvId(null)}}>🔄 Hội thoại mới</button>
          <button className="btn-ghost text-xs px-3 py-2">📊 Phân tích học tập</button>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto px-7 py-5 space-y-4">
        {msgs.map(m=>(
          <div key={m.id} className={`flex gap-3 max-w-[78%] animate-fadeUp ${m.role==='user'?'ml-auto flex-row-reverse':''}`}>
            <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${m.role==='ai'?'bg-gradient-to-br from-brand to-second text-xl':'bg-gradient-to-br from-ok to-brand text-white text-xs font-bold'}`}>{m.role==='ai'?'🤖':'NV'}</div>
            <div>
              <div className={m.role==='ai'?'bubble-ai':'bubble-user'}>
                {m.text.split('\n').map((l,i)=><p key={i} className={i>0?'mt-1':''}>{l}</p>)}
              </div>
              {m.time && <div className={`text-[11px] text-tx-dim mt-1.5 ${m.role==='user'?'text-right':''}`}>{m.time}</div>}
            </div>
          </div>
        ))}
        {typing && (
          <div className="flex gap-3 max-w-[78%]">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-brand to-second flex items-center justify-center text-xl shrink-0">🤖</div>
            <div className="bubble-ai flex items-center gap-1.5 py-4"><span className="dot"/><span className="dot"/><span className="dot"/></div>
          </div>
        )}
        <div ref={bot}/>
      </div>

      <div className="px-7 py-4 border-t border-bdr bg-bg-card2 shrink-0">
        <div className="flex gap-2 mb-3 flex-wrap">
          {QUICK.map(q=><button key={q} onClick={()=>send(q)} className="text-xs px-3 py-1.5 rounded-full border border-bdr bg-bg-card3 text-tx-muted hover:border-brand hover:text-brand-light transition-all">{q}</button>)}
        </div>
        <div className="flex gap-3 items-center bg-bg-card3 border border-bdr rounded-2xl px-4 py-2.5 focus-within:border-brand transition-colors">
          <input className="flex-1 bg-transparent border-none outline-none text-sm text-tx-base placeholder:text-tx-dim" placeholder="Nhập câu hỏi của bạn..." value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==='Enter'&&send(input)}/>
          <button onClick={()=>send(input)} className="w-9 h-9 bg-gradient-to-br from-brand to-second rounded-xl flex items-center justify-center text-white hover:scale-105 transition-transform shrink-0">➤</button>
        </div>
      </div>
    </div>
  )
}