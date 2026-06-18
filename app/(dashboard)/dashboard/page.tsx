'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
const EMOJIS = ['🎧','📝','📖']
const GRADIENTS = ['from-[#1a1040] to-[#3D2C8D]','from-[#0F2A1A] to-[#1B7A4A]','from-[#2A0F1A] to-[#7A1B4A]']
const DIFFS = ['Dễ','Trung bình','Khó']
const DIFF_CLS = ['text-ok','text-accent','text-second']
const PATH_ITEMS = [
  {name:'Listening Strategies',pct:75,color:'#6C63FF',meta:'✅ Tuần 4/12',rem:'3 giờ còn lại'},
  {name:'Reading Practice',pct:40,color:'#4ECDC4',meta:'📚 Đang học',rem:'8 giờ còn lại'},
  {name:'Grammar for IELTS',pct:20,color:'#FFB347',meta:'🆕 Mới bắt đầu',rem:'15 giờ còn lại'},
  {name:'Writing Task 1',pct:0,color:'#6B5F9E',meta:'🔒 Chưa mở khóa',rem:''},
]
interface Summary { minutes_today:number;diff_minutes:number;lessons_today:number;diff_lessons:number;avg_score:number;diff_score:number;streak_days:number;unread_notifications:number }
interface Rec { id:number;title:string;cat_name:string;level_name:string;confidence_score:number }
export default function DashboardPage() {
  const [summary, setSummary] = useState<Summary|null>(null)
  const [recs, setRecs] = useState<Rec[]>([])
  useEffect(()=>{
    fetch('/api/dashboard/summary').then(r=>r.json()).then(d=>{ if(d.data) setSummary(d.data) })
    fetch('/api/dashboard/recommendations').then(r=>r.json()).then(d=>{ if(d.data) setRecs(d.data) })
  },[])
  const stats = [
    {icon:'⏱️',val:summary?`${summary.minutes_today} phút`:'-- phút',label:'Thời gian hôm nay',diff:summary?`${summary.diff_minutes>=0?'+':''}${summary.diff_minutes} phút so với hôm qua`:'',color:'bg-brand'},
    {icon:'📖',val:summary?`${summary.lessons_today} bài`:'-- bài',label:'Bài đã hoàn thành',diff:summary?`${summary.diff_lessons>=0?'+':''}${summary.diff_lessons} bài so với hôm qua`:'',color:'bg-ok'},
    {icon:'📈',val:summary?`${summary.avg_score}%`:'-- %',label:'Điểm trung bình',diff:summary?`${summary.diff_score>=0?'+':''}${summary.diff_score}% tuần trước`:'',color:'bg-accent'},
    {icon:'🔥',val:summary?`${summary.streak_days} ngày`:'-- ngày',label:'Chuỗi ngày học',diff:'Tuyệt vời! 🔥',color:'bg-second'},
  ]
  return (
    <div className="animate-fadeUp">
      <h1 className="text-2xl font-extrabold mb-1">Xin chào, <span className="gtext">Nguyễn Văn A</span>! 👋</h1>
      <p className="text-sm text-tx-muted mb-7">Hôm nay bạn muốn học gì? Tiếp tục hành trình của bạn nào!</p>
      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {stats.map(s=>(
          <div key={s.label} className="card relative overflow-hidden">
            <div className={`absolute -top-6 -right-6 w-24 h-24 rounded-full opacity-[0.07] ${s.color}`}/>
            <span className="text-2xl mb-2 block">{s.icon}</span>
            <div className="text-2xl font-extrabold">{s.val}</div>
            <div className="text-xs text-tx-muted mt-0.5">{s.label}</div>
            <div className="text-[11px] font-semibold text-ok mt-1.5">{s.diff}</div>
          </div>
        ))}
      </div>
      {/* 2-col */}
      <div className="grid grid-cols-[1.6fr_1fr] gap-5 mb-5">
        <div className="card">
          <div className="flex items-start justify-between mb-4">
            <div><h3 className="font-bold">Lộ trình học tập của bạn</h3><p className="text-xs text-tx-muted mt-0.5">Mục tiêu: IELTS 6.5 Overall vào 30/06/2025</p></div>
            <Link href="/learning-path" className="btn-outline text-xs px-3 py-1.5">Xem chi tiết</Link>
          </div>
          <div className="space-y-4">
            {PATH_ITEMS.map(p=>(
              <div key={p.name}>
                <div className="flex justify-between items-center mb-1.5"><span className="text-sm font-semibold">{p.name}</span><span className="text-xs text-tx-muted">{p.pct}%</span></div>
                <div className="progress"><div className="progress-fill" style={{width:`${p.pct}%`,background:p.pct===0?'var(--tw-gradient-stops)':p.color}}/></div>
                <div className="flex justify-between mt-1"><span className="text-[11px] text-tx-dim">{p.meta}</span><span className="text-[11px] text-tx-dim">{p.rem}</span></div>
              </div>
            ))}
          </div>
        </div>
        <div className="card">
          <div className="flex items-center justify-between mb-4"><h3 className="font-bold">AI gợi ý cho bạn</h3><Link href="/courses" className="btn-outline text-xs px-3 py-1.5">Xem thêm</Link></div>
          <div className="space-y-2">
            {(recs.length?recs:[{id:1,title:'Bài nghe nền tảng #12',cat_name:'Listening',level_name:'Cơ bản',confidence_score:95},{id:2,title:'Ngữ pháp: Mệnh đề quan hệ',cat_name:'Grammar',level_name:'Trung bình',confidence_score:88},{id:3,title:'Đề luyện IELTS Reading',cat_name:'Reading',level_name:'Nâng cao',confidence_score:80}]).slice(0,3).map((r,i)=>(
              <Link key={r.id} href="/courses" className="flex items-center gap-3 p-3 rounded-xl hover:bg-bg-card2 transition-colors group">
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-xl shrink-0 bg-gradient-to-br ${GRADIENTS[i]}`}>{EMOJIS[i]}</div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold truncate group-hover:text-brand-light transition-colors">{r.title}</div>
                  <div className="text-xs text-tx-muted mt-0.5">{r.cat_name} · <span className={DIFF_CLS[i]}>{DIFFS[i]}</span></div>
                </div>
                <button className="text-[11px] font-bold px-3 py-1.5 rounded-lg bg-brand text-white hover:bg-brand-dark transition-colors shrink-0">Học ngay</button>
              </Link>
            ))}
          </div>
        </div>
      </div>
      {/* AI banner */}
      <div className="rounded-2xl bg-gradient-to-r from-[#1A1040] to-[#2D1B69] border border-brand/30 p-5 flex items-center gap-5">
        <span className="text-5xl animate-float shrink-0">🤖</span>
        <div className="flex-1">
          <div className="font-bold mb-1">AI Tutor luôn sẵn sàng hỗ trợ bạn!</div>
          <div className="text-sm text-white/60 mb-3">Giải thắc mắc, luyện bài tập, gợi ý khóa học — hỏi AI ngay nhé!</div>
          <Link href="/ai-tutor" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-brand to-second hover:-translate-y-px hover:shadow-[0_8px_24px_rgba(108,99,255,0.4)] transition-all">Chat với AI Tutor →</Link>
        </div>
      </div>
    </div>
  )
}