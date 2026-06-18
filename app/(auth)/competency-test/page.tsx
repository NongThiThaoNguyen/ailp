'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

const QUESTIONS = [
  { id:1, text:'Choose the correct sentence:', opts:[{id:1,t:'She don\'t like coffee.'},{id:2,t:'She doesn\'t like coffee.'},{id:3,t:'She not like coffee.'},{id:4,t:'She isn\'t like coffee.'}], correct:2 },
  { id:2, text:'The meeting _____ at 9 AM tomorrow.', opts:[{id:5,t:'will start'},{id:6,t:'is starting'},{id:7,t:'starts'},{id:8,t:'started'}], correct:7 },
  { id:3, text:'I _____ here since 2020.', opts:[{id:9,t:'work'},{id:10,t:'worked'},{id:11,t:'have worked'},{id:12,t:'am working'}], correct:11 },
  { id:4, text:'If I _____ rich, I would travel the world.', opts:[{id:13,t:'am'},{id:14,t:'were'},{id:15,t:'was'},{id:16,t:'will be'}], correct:14 },
  { id:5, text:'The book _____ by Hemingway is my favorite.', opts:[{id:17,t:'writing'},{id:18,t:'wrote'},{id:19,t:'written'},{id:20,t:'writes'}], correct:19 },
]

export default function CompetencyTestPage() {
  const router = useRouter()
  const [step, setStep] = useState<'intro'|'test'|'submitting'>('intro')
  const [cur, setCur] = useState(0)
  const [ans, setAns] = useState<Record<number,number>>({})
  const [goal, setGoal] = useState('IELTS 6.5')
  const [startTime] = useState(Date.now())

  const submit = async () => {
    setStep('submitting')
    const answers = QUESTIONS.map(q => ({
      question_id:   q.id,
      answer_id:     ans[q.id],
      time_seconds:  Math.floor((Date.now()-startTime)/1000/QUESTIONS.length),
    }))
    try {
      const r = await fetch('/api/competency/submit', {
        method:  'POST',
        headers: { 'Content-Type':'application/json' },
        body:    JSON.stringify({ answers, target_goal: goal }),
      })
      const d = await r.json()
      if (r.ok) router.push(d.data?.redirect || '/dashboard')
      else      router.push('/dashboard')
    } catch { router.push('/dashboard') }
  }

  if (step === 'intro') return (
    <div className="min-h-screen bg-bg-dark flex items-center justify-center p-4">
      <div className="absolute -top-48 -left-48 w-[500px] h-[500px] rounded-full bg-brand opacity-[0.12] blur-[100px]"/>
      <div className="w-full max-w-lg relative z-10 animate-fadeUp">
        <div className="card text-center p-8">
          <div className="text-6xl mb-5 animate-float block">🧠</div>
          <h1 className="text-2xl font-extrabold mb-3">Bài kiểm tra năng lực đầu vào</h1>
          <p className="text-sm text-tx-muted mb-6 leading-relaxed">
            AI sẽ đánh giá năng lực hiện tại của bạn và tạo lộ trình học tập cá nhân hóa phù hợp nhất.<br/>
            Bài test gồm <strong className="text-tx-base">5 câu hỏi</strong>, mất khoảng <strong className="text-tx-base">5 phút</strong>.
          </p>
          <div className="mb-6">
            <label className="label text-left block">🎯 Mục tiêu học tập của bạn</label>
            <select className="input" value={goal} onChange={e=>setGoal(e.target.value)}>
              <option>IELTS 6.5</option>
              <option>IELTS 7.0</option>
              <option>TOEIC 700+</option>
              <option>Tiếng Anh giao tiếp</option>
              <option>Tiếng Anh thương mại</option>
            </select>
          </div>
          <div className="grid grid-cols-3 gap-3 mb-6 text-sm">
            {[['🤖','AI chấm điểm'],['📊','Phân tích VARK'],['🗺️','Tạo lộ trình']].map(([i,l])=>(
              <div key={l} className="bg-bg-card2 rounded-xl p-3">
                <div className="text-2xl mb-1">{i}</div>
                <div className="text-xs text-tx-muted">{l}</div>
              </div>
            ))}
          </div>
          <button className="btn-primary w-full py-3 text-base" onClick={()=>setStep('test')}>
            Bắt đầu kiểm tra →
          </button>
          <button className="text-xs text-tx-dim mt-3 hover:text-tx-muted transition-colors" onClick={()=>router.push('/dashboard')}>
            Bỏ qua và vào trang chủ
          </button>
        </div>
      </div>
    </div>
  )

  if (step === 'submitting') return (
    <div className="min-h-screen bg-bg-dark flex items-center justify-center">
      <div className="card text-center p-10 max-w-sm w-full animate-fadeUp">
        <div className="text-5xl mb-4 animate-float block">🤖</div>
        <h2 className="text-xl font-bold mb-2">AI đang phân tích...</h2>
        <p className="text-sm text-tx-muted mb-4">Đang đánh giá năng lực và tạo lộ trình học tập cá nhân hóa cho bạn</p>
        <div className="flex justify-center gap-1.5">
          <span className="dot"/><span className="dot"/><span className="dot"/>
        </div>
      </div>
    </div>
  )

  const q = QUESTIONS[cur]
  return (
    <div className="min-h-screen bg-bg-dark flex items-center justify-center p-4">
      <div className="absolute -top-48 -right-48 w-[500px] h-[500px] rounded-full bg-second opacity-[0.08] blur-[100px]"/>
      <div className="w-full max-w-xl relative z-10 animate-fadeUp">
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div>
            <div className="text-sm font-bold text-brand-light mb-0.5">🧠 Kiểm tra năng lực đầu vào</div>
            <div className="text-xs text-tx-muted">Câu {cur+1} / {QUESTIONS.length}</div>
          </div>
          <div className="chip chip-brand">🎯 {goal}</div>
        </div>
        {/* Progress */}
        <div className="progress h-2 mb-6">
          <div className="progress-fill h-full" style={{width:`${((cur+1)/QUESTIONS.length)*100}%`}}/>
        </div>
        {/* Question */}
        <div className="card mb-5">
          <div className="text-[11px] font-bold tracking-widest text-brand-light mb-3">
            CÂU HỎI {cur+1}/{QUESTIONS.length}
          </div>
          <p className="text-lg font-bold leading-relaxed mb-6">{q.text}</p>
          <div className="space-y-2.5">
            {q.opts.map((o,i) => (
              <div key={o.id}
                className={`q-opt ${ans[q.id]===o.id?'sel':''}`}
                onClick={()=>setAns(p=>({...p,[q.id]:o.id}))}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0 ${ans[q.id]===o.id?'bg-brand text-white':'bg-bg-card2 text-tx-muted'}`}>
                  {String.fromCharCode(65+i)}
                </div>
                <span className="text-sm font-medium">{o.t}</span>
              </div>
            ))}
          </div>
        </div>
        {/* Nav */}
        <div className="flex items-center justify-between">
          <button className="btn-ghost" onClick={()=>setCur(p=>Math.max(0,p-1))} disabled={cur===0}>← Quay lại</button>
          <div className="flex gap-1.5">
            {QUESTIONS.map((_,i)=>(
              <button key={i} onClick={()=>setCur(i)}
                className={`rounded-full transition-all duration-200 ${i===cur?'w-6 h-2.5 bg-brand':ans[QUESTIONS[i].id]?'w-2.5 h-2.5 bg-ok':'w-2.5 h-2.5 bg-bg-card3 border border-bdr'}`}/>
            ))}
          </div>
          {cur < QUESTIONS.length-1
            ? <button className="btn-primary" onClick={()=>setCur(p=>p+1)} disabled={!ans[q.id]}>Câu tiếp →</button>
            : <button className="btn-primary" onClick={submit} disabled={!ans[q.id]}>Nộp bài & AI phân tích ✓</button>
          }
        </div>
      </div>
    </div>
  )
}