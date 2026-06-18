'use client'
import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
const QS = [
  {id:1,text:'The man _____ is standing over there is my uncle.',pts:10,opts:[{id:1,t:'who',c:true},{id:2,t:'which',c:false},{id:3,t:'whose',c:false},{id:4,t:'whom',c:false}]},
  {id:2,text:'The book _____ I read last week was very interesting.',pts:10,opts:[{id:5,t:'who',c:false},{id:6,t:'that',c:true},{id:7,t:'whose',c:false},{id:8,t:'where',c:false}]},
  {id:3,text:'This is the house _____ I was born.',pts:10,opts:[{id:9,t:'which',c:false},{id:10,t:'that',c:false},{id:11,t:'where',c:true},{id:12,t:'when',c:false}]},
  {id:4,text:'The woman _____ car was stolen reported it to the police.',pts:10,opts:[{id:13,t:'who',c:false},{id:14,t:'which',c:false},{id:15,t:'whose',c:true},{id:16,t:'whom',c:false}]},
  {id:5,text:'I remember the day _____ we first met.',pts:10,opts:[{id:17,t:'where',c:false},{id:18,t:'when',c:true},{id:19,t:'which',c:false},{id:20,t:'who',c:false}]},
]
export default function QuizPage() {
  const {id} = useParams()
  const router = useRouter()
  const [cur,setCur] = useState(0)
  const [ans,setAns] = useState<Record<number,number>>({})
  const [time,setTime] = useState(900)
  const [done,setDone] = useState(false)
  const [submitting,setSubmitting] = useState(false)
  useEffect(()=>{
    if(done) return
    const t = setInterval(()=>setTime(p=>{if(p<=1){clearInterval(t);setDone(true);return 0}return p-1}),1000)
    return ()=>clearInterval(t)
  },[done])
  const mm = String(Math.floor(time/60)).padStart(2,'0')
  const ss = String(time%60).padStart(2,'0')
  const q = QS[cur]
  const score = ()=>{ let c=0; QS.forEach(q=>{ const s=ans[q.id]; if(q.opts.find(o=>o.id===s)?.c) c++ }); return Math.round(c/QS.length*100) }
  const submit = async () => {
    setSubmitting(true)
    await fetch(`/api/quizzes/${id}/attempt`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({answers:QS.map(q=>({question_id:q.id,selected_answer_id:ans[q.id]}))})}).catch(()=>{})
    setDone(true); setSubmitting(false)
  }
  if (done) {
    const sc = score(); const passed = sc>=70
    return (
      <div className="min-h-screen bg-bg-dark flex items-center justify-center">
        <div className="card max-w-md w-full text-center animate-fadeUp">
          <div className="text-6xl mb-4">{passed?'🎉':'😅'}</div>
          <h2 className="text-2xl font-extrabold mb-2">{passed?'Xuất sắc!':'Cần cố gắng thêm!'}</h2>
          <div className="text-6xl font-black gtext my-4">{sc}%</div>
          <p className="text-sm text-tx-muted mb-6">{passed?'Đã vượt qua (yêu cầu 70%)':'Chưa đạt — cần 70% để qua'}</p>
          <div className="grid grid-cols-3 gap-3 mb-6 text-sm">
            <div className="bg-bg-card2 rounded-xl p-3"><div className="font-extrabold text-ok">{QS.filter(q=>q.opts.find(o=>o.id===ans[q.id])?.c).length}</div><div className="text-tx-muted text-xs mt-0.5">Đúng</div></div>
            <div className="bg-bg-card2 rounded-xl p-3"><div className="font-extrabold text-danger">{QS.length-QS.filter(q=>q.opts.find(o=>o.id===ans[q.id])?.c).length}</div><div className="text-tx-muted text-xs mt-0.5">Sai</div></div>
            <div className="bg-bg-card2 rounded-xl p-3"><div className="font-extrabold text-brand-light">{QS.length}</div><div className="text-tx-muted text-xs mt-0.5">Tổng</div></div>
          </div>
          <div className="flex gap-3">
            <button className="btn-outline flex-1" onClick={()=>{setAns({});setCur(0);setTime(900);setDone(false)}}>Làm lại</button>
            <Link href="/courses" className="btn-primary flex-1 justify-center">Về khóa học</Link>
          </div>
        </div>
      </div>
    )
  }
  return (
    <div className="min-h-screen bg-bg-dark flex items-center justify-center py-10 px-6">
      <div className="w-full max-w-2xl animate-fadeUp">
        <div className="flex items-center justify-between mb-5">
          <div><h2 className="text-xl font-extrabold">Quiz: Grammar for IELTS</h2><p className="text-sm text-tx-muted mt-0.5">Câu {cur+1}/{QS.length}</p></div>
          <div className={`flex items-center gap-2 px-4 py-2 rounded-xl border font-bold text-sm ${time<120?'border-danger bg-danger/10 text-danger':'border-bdr bg-bg-card'}`}>⏱️ {mm}:{ss}</div>
        </div>
        <div className="progress mb-6 h-2"><div className="progress-fill h-full" style={{width:`${((cur+1)/QS.length)*100}%`}}/></div>
        <div className="card mb-5">
          <div className="text-[11px] font-bold tracking-widest text-brand-light mb-3">CÂU HỎI {cur+1}/{QS.length} · {q.pts} ĐIỂM</div>
          <p className="text-lg font-bold leading-relaxed mb-6">{q.text}</p>
          <div className="space-y-2.5">{q.opts.map((o,i)=>(
            <div key={o.id} className={`q-opt ${ans[q.id]===o.id?'sel':''}`} onClick={()=>setAns(p=>({...p,[q.id]:o.id}))}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0 ${ans[q.id]===o.id?'bg-brand text-white':'bg-bg-card2 text-tx-muted'}`}>{String.fromCharCode(65+i)}</div>
              <span className="text-sm font-medium">{o.t}</span>
            </div>
          ))}</div>
        </div>
        <div className="flex items-center justify-between">
          <button className="btn-ghost" onClick={()=>setCur(Math.max(0,cur-1))} disabled={cur===0}>← Quay lại</button>
          <div className="flex gap-1.5 items-center">{QS.map((_,i)=><button key={i} onClick={()=>setCur(i)} className={`rounded-full transition-all duration-200 ${i===cur?'w-6 h-2.5 bg-brand':ans[QS[i].id]?'w-2.5 h-2.5 bg-ok':'w-2.5 h-2.5 bg-bg-card3 border border-bdr'}`}/>)}</div>
          {cur<QS.length-1?<button className="btn-primary" onClick={()=>setCur(cur+1)}>Câu tiếp →</button>:<button className="btn-primary" onClick={submit} disabled={submitting}>{submitting?'⏳ Đang nộp...':'Nộp bài ✓'}</button>}
        </div>
      </div>
    </div>
  )
}