'use client'
import { useState, useEffect, useRef } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import Sidebar from '@/components/layout/Sidebar'
const LS = [
  {id:1,title:'Listening Strategies Intro',done:true},{id:2,title:'Note-taking Techniques',done:true},
  {id:3,title:'Relative Clauses',done:false,current:true},{id:4,title:'Passive Voice',done:false},{id:5,title:'Writing Task 1',done:false,locked:true},
]
export default function LessonPage() {
  const {id} = useParams()
  const [tab, setTab] = useState('Nội dung bài học')
  const [note, setNote] = useState('')
  const [timeSpent, setTimeSpent] = useState(0)
  const timer = useRef<ReturnType<typeof setInterval>|null>(null)
  useEffect(()=>{ timer.current=setInterval(()=>setTimeSpent(p=>p+1),1000); return ()=>{ if(timer.current)clearInterval(timer.current) } },[])
  const markDone = async () => {
    await fetch(`/api/lessons/${id}/progress`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({time_spent_seconds:timeSpent,is_completed:true})}).catch(()=>{})
    alert('✅ Đã đánh dấu hoàn thành!')
  }
  const TABS = ['Nội dung bài học','Tài liệu','Ghi chú','Thảo luận']
  return (
    <div className="flex min-h-screen bg-bg-dark">
      <Sidebar/>
      <aside className="w-72 bg-bg-card border-r border-bdr flex flex-col sticky top-0 h-screen overflow-y-auto shrink-0">
        <div className="p-5 border-b border-bdr">
          <Link href="/courses/1" className="flex items-center gap-2 text-sm text-tx-muted hover:text-brand-light mb-3 font-medium">← Quay lại</Link>
          <div className="font-bold text-sm mb-1">IELTS 6.5 Overall</div>
          <div className="text-xs text-tx-muted mb-3">Tuần 4 / 12</div>
          <div className="progress mb-1"><div className="progress-fill" style={{width:'60%'}}/></div>
          <div className="flex justify-between text-[11px] text-tx-muted"><span>60% hoàn thành</span><span>⭐ 4.9</span></div>
        </div>
        <div className="p-4 flex-1">
          <div className="slabel">Nội dung khóa học</div>
          <div className="space-y-1">{LS.map(l=>(
            <div key={l.id} className={`flex items-center gap-2.5 p-2.5 rounded-xl cursor-pointer transition-all ${l.current?'bg-brand/12':l.locked?'opacity-50':'hover:bg-bg-card2'}`}>
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs shrink-0 ${l.done?'bg-ok text-white':l.current?'bg-brand text-white':'bg-bg-card2 border border-bdr text-tx-dim'}`}>{l.done?'✓':l.locked?'🔒':'▶'}</div>
              <span className={`text-sm flex-1 ${l.current?'text-brand-light font-semibold':l.locked?'text-tx-dim':'text-tx-sec'}`}>{l.title}</span>
            </div>
          ))}</div>
        </div>
      </aside>
      <div className="flex-1 flex flex-col">
        <header className="topbar"><div className="font-bold text-sm">3. Grammar for IELTS — Relative Clauses</div><div className="flex items-center gap-3"><span className="text-xs text-tx-muted">Tuần 4/12 · 60%</span><button onClick={markDone} className="btn-primary text-xs px-3 py-2">Đánh dấu hoàn thành ✓</button></div></header>
        <div className="flex-1 overflow-y-auto p-6">
          {/* Video */}
          <div className="w-full aspect-video rounded-2xl overflow-hidden relative mb-5 cursor-pointer bg-gradient-to-br from-[#0D1B3E] to-[#1B0D3E] max-h-[420px]">
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
              <div className="text-white/40 text-base">Relative Clauses (Mệnh đề quan hệ)</div>
              <Link href={`/quiz/1`} className="w-16 h-16 bg-gradient-to-br from-brand to-second rounded-full flex items-center justify-center text-3xl text-white shadow-[0_0_30px_rgba(108,99,255,0.4)] hover:scale-110 transition-transform">▶</Link>
              <div className="text-white/40 text-sm">Nhấn để xem / Làm quiz</div>
            </div>
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 flex items-center gap-3">
              <span className="text-white">▶</span>
              <div className="flex-1 h-1 bg-white/20 rounded-full"><div className="h-full w-[45%] bg-brand rounded-full"/></div>
              <span className="text-xs text-white/60">05:32 / 12:30</span>
            </div>
          </div>
          {/* Tabs */}
          <div className="flex gap-0 bg-bg-card rounded-xl p-1 w-fit mb-5">{TABS.map(t=><button key={t} onClick={()=>setTab(t)} className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${tab===t?'bg-brand text-white':'text-tx-muted hover:text-tx-base'}`}>{t}</button>)}</div>
          {tab==='Nội dung bài học' && <div className="space-y-4">
            <div className="card"><h4 className="font-bold mb-2">Mệnh đề quan hệ (Relative Clauses)</h4><p className="text-sm text-tx-sec leading-relaxed">Mệnh đề quan hệ dùng để bổ sung thông tin cho danh từ đứng phía trước, sử dụng các đại từ quan hệ: <strong>who, whom, which, that, whose, where, when</strong>.</p></div>
            <div className="card"><h4 className="font-bold mb-2">Ví dụ thực tế</h4><div className="space-y-2 text-sm text-tx-sec"><p>• The man <em className="text-brand-light font-semibold">who is standing</em> over there is my uncle.</p><p>• The book <em className="text-brand-light font-semibold">that I read</em> is interesting.</p><p>• This is the house <em className="text-brand-light font-semibold">where I was born</em>.</p></div></div>
            <div className="card"><h4 className="font-bold mb-2">Phân loại đại từ quan hệ</h4><div className="grid grid-cols-2 gap-2 text-sm">{[['who / whom','Người (chủ ngữ/tân ngữ)'],['which','Vật, sự việc'],['that','Người hoặc vật'],['whose','Sở hữu'],['where','Nơi chốn'],['when','Thời gian']].map(([w,d])=><div key={w} className="flex gap-2 p-2 bg-bg-card2 rounded-lg"><code className="text-brand-light font-mono font-bold shrink-0">{w}</code><span className="text-tx-muted">{d}</span></div>)}</div></div>
          </div>}
          {tab==='Tài liệu' && <div className="space-y-3">{[{name:'Bài tập Relative Clauses.pdf',size:'245 KB',icon:'📄'},{name:'Vocabulary List.docx',size:'128 KB',icon:'📝'},{name:'Audio: Listening Practice.mp3',size:'12 MB',icon:'🎵'}].map(f=><a key={f.name} href="#" className="flex items-center gap-3 p-4 card hover:border-brand transition-colors cursor-pointer"><span className="text-2xl">{f.icon}</span><div className="flex-1"><div className="text-sm font-semibold">{f.name}</div><div className="text-xs text-tx-muted">{f.size}</div></div><span className="text-tx-muted hover:text-brand-light">⬇</span></a>)}</div>}
          {tab==='Ghi chú' && <div className="card"><h4 className="font-bold mb-3">Ghi chú của bạn</h4><textarea className="input min-h-[200px] resize-y" placeholder="Ghi chú bài học tại đây..." value={note} onChange={e=>setNote(e.target.value)}/><button className="btn-primary mt-3">💾 Lưu ghi chú (AI sẽ tóm tắt)</button></div>}
          {tab==='Thảo luận' && <div className="space-y-4">{[{user:'Trần Thị B',text:'Bài giảng rất dễ hiểu! 🙏',time:'1 giờ trước'},{user:'Lê Văn C',text:'Cho hỏi "whose" có thể dùng cho vật không ạ?',time:'30 phút trước'}].map((c,i)=><div key={i} className="flex gap-3"><div className="w-9 h-9 rounded-full bg-gradient-to-br from-brand to-second flex items-center justify-center text-xs font-bold text-white shrink-0">{c.user[0]}</div><div className="flex-1"><div className="text-sm font-semibold">{c.user} <span className="text-[11px] text-tx-dim font-normal">{c.time}</span></div><div className="text-sm text-tx-sec mt-0.5">{c.text}</div></div></div>)}</div>}
        </div>
      </div>
    </div>
  )
}