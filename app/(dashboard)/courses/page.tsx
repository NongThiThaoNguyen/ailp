'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
const TABS = ['Tất cả','IELTS','TOEIC','Tiếng Anh giao tiếp','Ngữ pháp']
const FALLBACK = [
  {id:1,title:'IELTS 6.5 Overall',category_name:'IELTS',level_name:'Trung bình',emoji:'🎯',grad:'from-[#0D1B2A] to-[#1B3A5C]',lvlCls:'text-accent',is_enrolled:true,progress_percentage:60,avg_rating:4.9,total_lessons:32},
  {id:2,title:'TOEIC 500+',category_name:'TOEIC',level_name:'Trung bình',emoji:'💼',grad:'from-[#1A0D2E] to-[#3D1B6E]',lvlCls:'text-accent',is_enrolled:true,progress_percentage:40,avg_rating:4.8,total_lessons:28},
  {id:3,title:'Tiếng Anh giao tiếp',category_name:'Giao tiếp',level_name:'Cơ bản',emoji:'💬',grad:'from-[#0D2A1A] to-[#1B5C3A]',lvlCls:'text-ok',is_enrolled:true,progress_percentage:20,avg_rating:4.7,total_lessons:25},
  {id:4,title:'Ngữ pháp nền tảng',category_name:'Ngữ pháp',level_name:'Cơ bản',emoji:'📖',grad:'from-[#2A1A0D] to-[#6E3D1B]',lvlCls:'text-ok',is_enrolled:true,progress_percentage:70,avg_rating:4.9,total_lessons:18},
  {id:5,title:'IELTS Reading Nâng cao',category_name:'IELTS',level_name:'Nâng cao',emoji:'🎓',grad:'from-[#2A0D1A] to-[#6E1B3D]',lvlCls:'text-second',is_enrolled:false,progress_percentage:0,avg_rating:4.8,total_lessons:20},
  {id:6,title:'IELTS Listening Chuyên sâu',category_name:'IELTS',level_name:'Nâng cao',emoji:'🎤',grad:'from-[#1A2A0D] to-[#3D5C1B]',lvlCls:'text-second',is_enrolled:false,progress_percentage:0,avg_rating:4.9,total_lessons:18},
]
export default function CoursesPage() {
  const [tab, setTab] = useState('Tất cả')
  const [courses, setCourses] = useState<typeof FALLBACK>(FALLBACK)
  useEffect(()=>{
    fetch(`/api/courses?${tab!=='Tất cả'?`category=${encodeURIComponent(tab)}`:''}`)
      .then(r=>r.json()).then(d=>{ if(d.data?.length) setCourses(d.data) }).catch(()=>{})
  },[tab])
  const filtered = tab==='Tất cả'?courses:courses.filter(c=>(c as unknown as {category_name:string}).category_name?.includes(tab)||c.title?.includes(tab))
  return (
    <div className="animate-fadeUp">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-extrabold">📚 Khóa học</h1>
        <div className="searchbar w-64"><span className="text-tx-dim text-sm">🔍</span><input placeholder="Tìm kiếm khóa học..."/></div>
      </div>
      <div className="flex gap-2 flex-wrap mb-6">{TABS.map(t=><button key={t} className={`ftab ${tab===t?'on':''}`} onClick={()=>setTab(t)}>{t}</button>)}</div>
      <div className="grid grid-cols-3 gap-5">
        {filtered.map((c,i)=>{
          const fc = FALLBACK[i]||FALLBACK[0]
          return (
            <div key={c.id} className="card-hover flex flex-col overflow-hidden !p-0">
              <div className={`h-36 bg-gradient-to-br ${fc.grad} flex items-center justify-center relative`}>
                <span className="text-5xl">{fc.emoji}</span>
                <span className={`absolute top-2.5 right-2.5 text-[11px] font-semibold ${fc.lvlCls} bg-black/50 px-2 py-0.5 rounded-lg`}>{c.level_name||fc.level_name}</span>
              </div>
              <div className="p-4 flex flex-col flex-1">
                <div className="text-[11px] font-semibold text-brand-light mb-1.5">{(c as unknown as {category_name:string}).category_name||fc.category_name}</div>
                <h3 className="text-sm font-bold leading-snug mb-2">{c.title}</h3>
                <div className="flex gap-3 text-xs text-tx-muted mb-3"><span>📖 {c.total_lessons||fc.total_lessons} bài</span><span>⭐ {(c.avg_rating||fc.avg_rating)?.toFixed(1)}</span></div>
                {(c.is_enrolled||fc.is_enrolled) && <><div className="progress mb-1"><div className="progress-fill" style={{width:`${c.progress_percentage||fc.progress_percentage}%`}}/></div><div className="text-[11px] text-tx-muted mb-3">{c.progress_percentage||fc.progress_percentage}% hoàn thành</div></>}
                <div className="flex items-center justify-between mt-auto">
                  <span className="text-sm font-extrabold text-brand-light">{(c.is_enrolled||fc.is_enrolled)?'Đã đăng ký':'Đăng ký học'}</span>
                  <Link href={`/courses/${c.id}`} className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-all ${(c.is_enrolled||fc.is_enrolled)?'bg-ok text-white hover:bg-teal-500':'bg-brand text-white hover:bg-brand-dark'}`}>{(c.is_enrolled||fc.is_enrolled)?'Tiếp tục':'Đăng ký'}</Link>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}