'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
const SCENARIOS = [
  {name:'Kịch bản nhanh',days:90,daily:'60 phút/ngày',prob:85,color:'text-ok',border:'border-ok/30',bg:'bg-ok/10'},
  {name:'Kịch bản tiêu chuẩn',days:120,daily:'45 phút/ngày',prob:72,color:'text-brand-light',border:'border-brand/30',bg:'bg-brand/8'},
  {name:'Kịch bản dài hơi',days:180,daily:'30 phút/ngày',prob:60,color:'text-accent',border:'border-accent/30',bg:'bg-accent/10'},
]
const GAPS = [
  {skill:'Listening',current:'6.0',target:'6.5',pct:80,color:'#6C63FF'},
  {skill:'Reading',current:'5.5',target:'6.5',pct:55,color:'#FFB347'},
  {skill:'Writing',current:'5.0',target:'6.5',pct:40,color:'#FF6B9D'},
  {skill:'Speaking',current:'5.5',target:'6.5',pct:65,color:'#4ECDC4'},
]
interface PathNode { course_id:number;title:string;status:string;progress:number;cat_name:string;level_name:string;node_order:number }
interface LPath { title:string;target_goal:string;estimated_days:number;overall_progress:number;nodes:PathNode[] }
export default function LearningPathPage() {
  const [path, setPath] = useState<LPath|null>(null)
  useEffect(()=>{ fetch('/api/learning-paths').then(r=>r.json()).then(d=>{ if(d.data) setPath(d.data) }).catch(()=>{}) },[])
  const nodes: PathNode[] = path?.nodes || [
    {course_id:1,title:'IELTS 6.5 Overall',status:'active',progress:60,cat_name:'IELTS',level_name:'Trung bình',node_order:1},
    {course_id:2,title:'Ngữ pháp nền tảng',status:'active',progress:70,cat_name:'Ngữ pháp',level_name:'Cơ bản',node_order:2},
    {course_id:3,title:'IELTS Reading Nâng cao',status:'locked',progress:0,cat_name:'IELTS',level_name:'Nâng cao',node_order:3},
    {course_id:4,title:'IELTS Listening Chuyên sâu',status:'locked',progress:0,cat_name:'IELTS',level_name:'Nâng cao',node_order:4},
  ]
  const statusIcon:{[k:string]:string} = {completed:'✅',active:'▶️',locked:'🔒',unlocked:'⭕'}
  const statusColor:{[k:string]:string} = {completed:'border-ok/40 bg-ok/8',active:'border-brand/40 bg-brand/8',locked:'border-bdr opacity-50',unlocked:'border-bdr'}
  return (
    <div className="animate-fadeUp">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-extrabold">🗺️ Lộ trình học tập</h1>
        <Link href="/ai-tutor" className="btn-primary">🤖 AI tạo lộ trình mới</Link>
      </div>
      {/* Path header */}
      <div className="rounded-2xl bg-gradient-to-r from-[#1A1040] to-[#2D1B69] border border-brand/30 p-5 mb-6">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-lg font-extrabold mb-1">{path?.title||'🎯 IELTS 6.5 Overall'}</h2>
            <p className="text-sm text-white/60">Mục tiêu đến {new Date(Date.now()+90*86400000).toLocaleDateString('vi')} · {path?.estimated_days||90} ngày</p>
            <div className="flex gap-4 mt-3">
              <span className="text-sm text-ok">✅ Tiến độ tổng: {path?.overall_progress||35}%</span>
              <span className="text-sm text-accent">📊 AI đánh giá: Tốt</span>
            </div>
          </div>
          <div className="text-right shrink-0"><div className="text-4xl font-extrabold gtext">{path?.overall_progress||35}%</div><div className="text-xs text-white/50 mt-0.5">Hoàn thành</div></div>
        </div>
        <div className="progress mt-4 h-2"><div className="progress-fill h-full" style={{width:`${path?.overall_progress||35}%`}}/></div>
      </div>
      <div className="grid grid-cols-[1fr_1fr] gap-5 mb-5">
        {/* Nodes */}
        <div className="card">
          <h3 className="font-bold mb-4">📋 Các khóa học trong lộ trình</h3>
          <div className="space-y-3">
            {nodes.map(n=>(
              <div key={n.node_order} className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${statusColor[n.status]||'border-bdr'}`}>
                <div className="text-xl w-8 text-center shrink-0">{statusIcon[n.status]||'⭕'}</div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold truncate">{n.title}</div>
                  <div className="text-xs text-tx-muted mt-0.5">{n.cat_name} · {n.level_name}</div>
                  {n.status!=='locked' && n.progress>0 && <div className="progress mt-1.5 h-1"><div className="progress-fill h-full" style={{width:`${n.progress}%`}}/></div>}
                </div>
                {n.status==='active' && <Link href={`/courses/${n.course_id}`} className="btn-primary text-xs px-3 py-1.5 shrink-0">Học ngay</Link>}
                {n.status==='completed' && <span className="chip chip-success shrink-0">✓ Hoàn thành</span>}
              </div>
            ))}
          </div>
        </div>
        {/* Scenarios */}
        <div className="space-y-5">
          <div className="card">
            <h3 className="font-bold mb-4">📅 Kịch bản AI đề xuất</h3>
            <div className="space-y-3">
              {SCENARIOS.map((s,i)=>(
                <div key={s.name} className={`p-3.5 rounded-xl border ${s.border} ${s.bg}`}>
                  <div className="flex justify-between items-center mb-1.5">
                    <span className={`text-sm font-bold ${s.color}`}>{i===0?'⚡':i===1?'📈':'🐌'} {s.name}</span>
                    <span className={`text-sm font-extrabold ${s.color}`}>{s.prob}%</span>
                  </div>
                  <div className="text-xs text-tx-muted">{s.daily} · {s.days} ngày · Khả năng đạt: {s.prob>=80?'Cao':s.prob>=65?'Trung bình':'Thấp'}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="card">
            <h3 className="font-bold mb-4">📊 Phân tích khoảng cách năng lực</h3>
            <div className="space-y-3">
              {GAPS.map(g=>(
                <div key={g.skill} className="flex items-center gap-3 p-3 bg-bg-card2 rounded-xl">
                  <span className="text-xl w-8">{g.skill==='Listening'?'🎧':g.skill==='Reading'?'📖':g.skill==='Writing'?'✍️':'🗣️'}</span>
                  <div className="flex-1">
                    <div className="flex justify-between text-xs mb-1.5"><span className="font-medium">{g.skill}</span><span style={{color:g.color}} className="font-semibold">{g.current} → {g.target}</span></div>
                    <div className="progress h-1.5"><div className="h-full rounded-full transition-all duration-700" style={{width:`${g.pct}%`,background:g.color}}/></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}