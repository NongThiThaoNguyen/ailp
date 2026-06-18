'use client'
import { useEffect, useState } from 'react'
const TABS = ['Huy hiệu','Cấp độ','Xếp hạng']
const FBADGES = [
  {id:1,name:'7 ngày liên tiếp',description:'Học 7 ngày không nghỉ',icon:'👑',earned:true,progress:null,max:null},
  {id:2,name:'50 bài học',description:'Hoàn thành 50 bài học',icon:'📚',earned:true,progress:null,max:null},
  {id:3,name:'Chuyên cần',description:'Đạt 100 điểm trong quiz',icon:'⭐',earned:false,progress:20,max:30},
  {id:4,name:'Quiz Master',description:'Hoàn thành 30 bài quiz',icon:'🧠',earned:false,progress:70,max:100},
  {id:5,name:'Siêu học giả',description:'Hoàn thành 200 bài học',icon:'🎓',earned:false,progress:150,max:200},
  {id:6,name:'IELTS 6.5',description:'Đạt mục tiêu IELTS 6.5',icon:'🌟',earned:false,progress:null,max:null,locked:true},
  {id:7,name:'Thần tốc',description:'Học 10 ngày liên tiếp',icon:'⚡',earned:false,progress:6,max:10},
  {id:8,name:'Top 10',description:'Top 10 người học xuất sắc',icon:'🏅',earned:false,progress:null,max:null,note:'Top 8 · Gần rồi!'},
  {id:9,name:'Kim cương',description:'Đạt cấp độ Kim cương',icon:'💎',earned:false,progress:null,max:null,locked:true},
]
const BOARD = [{r:1,n:'Trần Thị B',pts:2840,av:'TB'},{r:2,n:'Lê Văn C',pts:2310,av:'LC'},{r:3,n:'Phạm Thị D',pts:1980,av:'PD'},{r:4,n:'Nguyễn Văn A',pts:1750,av:'NV',me:true},{r:5,n:'Hoàng Thị E',pts:1620,av:'HE'}]
interface B { id:number;name:string;description?:string;icon?:string;earned:boolean;progress?:number|null;max?:number|null;locked?:boolean;note?:string }
export default function AchievementsPage() {
  const [tab, setTab] = useState('Huy hiệu')
  const [badges, setBadges] = useState<B[]>(FBADGES)
  useEffect(()=>{ fetch('/api/achievements').then(r=>r.json()).then(d=>{ if(d.data?.badges?.length) setBadges(d.data.badges) }).catch(()=>{}) },[])
  return (
    <div className="animate-fadeUp">
      <h1 className="text-2xl font-extrabold mb-6">🏆 Thành tích</h1>
      <div className="flex gap-0 bg-bg-card2 rounded-xl p-1 w-fit mb-6">{TABS.map(t=><button key={t} onClick={()=>setTab(t)} className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all ${tab===t?'bg-brand text-white':'text-tx-muted hover:text-tx-base'}`}>{t}</button>)}</div>
      {tab==='Huy hiệu' && <div className="grid grid-cols-3 gap-4">{badges.map((b:B)=>(
        <div key={b.id} className={`card text-center transition-all hover:-translate-y-0.5 ${b.earned?'border-brand/40':'border-bdr'} ${b.locked?'opacity-50':''}`}>
          <span className="text-5xl mb-3 block">{b.icon||'🏅'}</span>
          <div className="font-bold text-sm mb-1">{b.name}</div>
          <div className="text-xs text-tx-muted mb-3">{b.description}</div>
          {b.earned && <span className="chip chip-success">✅ Đã đạt</span>}
          {!b.earned && b.progress!=null && b.max!=null && <div><div className="progress mb-1"><div className="progress-fill" style={{width:`${(b.progress/b.max)*100}%`}}/></div><span className="text-[11px] text-accent font-semibold">{b.progress}/{b.max}</span></div>}
          {!b.earned && b.locked && <span className="text-[11px] text-tx-dim">🔒 Chưa mở khóa</span>}
          {b.note && <span className="text-[11px] text-accent font-semibold">{b.note}</span>}
        </div>
      ))}</div>}
      {tab==='Cấp độ' && <div className="card max-w-md">
        <div className="flex items-center gap-4 mb-6"><div className="w-20 h-20 rounded-full bg-gradient-to-br from-brand to-second flex items-center justify-center text-3xl font-black text-white">15</div><div><div className="text-lg font-bold">Cấp 15 — Học giả</div><div className="text-sm text-tx-muted">1500 / 2000 XP</div><div className="progress w-48 mt-2"><div className="progress-fill" style={{width:'75%'}}/></div></div></div>
        <div className="space-y-3">{[{l:10,n:'Người học',xp:500,done:true},{l:12,n:'Học viên tích cực',xp:800,done:true},{l:15,n:'Học giả',xp:1500,done:true},{l:20,n:'Chuyên gia',xp:3000,done:false},{l:30,n:'Kim cương',xp:10000,done:false}].map(lv=><div key={lv.l} className={`flex items-center gap-3 p-3 rounded-xl border ${lv.done?'border-brand/30 bg-brand/6':'border-bdr'}`}><div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${lv.done?'bg-brand text-white':'bg-bg-card2 text-tx-muted'}`}>{lv.l}</div><div className="flex-1"><div className="text-sm font-semibold">{lv.n}</div><div className="text-xs text-tx-muted">{lv.xp.toLocaleString()} XP</div></div>{lv.done&&<span className="text-ok">✓</span>}</div>)}</div>
      </div>}
      {tab==='Xếp hạng' && <div className="card max-w-lg">
        <h3 className="font-bold mb-4">Bảng xếp hạng tuần này</h3>
        <div className="space-y-2">{BOARD.map(u=><div key={u.r} className={`flex items-center gap-3 p-3 rounded-xl transition-all ${(u as unknown as {me?:boolean}).me?'bg-brand/12 border border-brand/30':'hover:bg-bg-card2'}`}><div className={`w-8 text-center font-extrabold text-lg ${u.r<=3?'text-accent':(u as unknown as {me?:boolean}).me?'text-brand-light':'text-tx-muted'}`}>{u.r===1?'🥇':u.r===2?'🥈':u.r===3?'🥉':u.r}</div><div className="w-9 h-9 rounded-full bg-gradient-to-br from-brand to-second flex items-center justify-center text-xs font-bold text-white">{u.av}</div><div className="flex-1"><span className={`text-sm font-semibold ${(u as unknown as {me?:boolean}).me?'text-brand-light':''}`}>{u.n}</span>{(u as unknown as {me?:boolean}).me&&<span className="chip chip-brand ml-1.5 text-[10px]">Bạn</span>}</div><div className="text-sm font-bold text-accent">{u.pts.toLocaleString()} XP</div></div>)}</div>
      </div>}
    </div>
  )
}