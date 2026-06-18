'use client'
import { useEffect, useState } from 'react'
import { BarChart,Bar,XAxis,YAxis,Tooltip,ResponsiveContainer,Cell,PieChart,Pie } from 'recharts'
const TABS = ['7 ngày','30 ngày','90 ngày','Tất cả']
const FALLBACK_DAILY = [{date:'04/5',minutes:45},{date:'05/5',minutes:90},{date:'06/5',minutes:60},{date:'07/5',minutes:120},{date:'08/5',minutes:80},{date:'09/5',minutes:30},{date:'10/5',minutes:75}]
const SKILLS = [{name:'Listening',pct:80,fill:'#6C63FF'},{name:'Reading',pct:70,fill:'#4ECDC4'},{name:'Writing',pct:75,fill:'#FFB347'},{name:'Speaking',pct:65,fill:'#FF6B9D'}]
export default function StatsPage() {
  const [tab, setTab] = useState('30 ngày')
  const [daily, setDaily] = useState(FALLBACK_DAILY)
  useEffect(()=>{
    const daysMap:Record<string,number> = {'7 ngày':7,'30 ngày':30,'90 ngày':90,'Tất cả':365}
    fetch(`/api/stats?days=${daysMap[tab]||30}`).then(r=>r.json()).then(d=>{ if(d.data?.daily?.length) setDaily(d.data.daily) }).catch(()=>{})
  },[tab])
  const BIG = [{val:'12h 45m',label:'Tổng thời gian học'},{val:'124 bài',label:'Bài đã hoàn thành'},{val:'85%',label:'Điểm trung bình'},{val:'7 ngày 🔥',label:'Chuỗi ngày học'}]
  return (
    <div className="animate-fadeUp">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-extrabold">📊 Thống kê học tập</h1>
        <div className="flex gap-1 bg-bg-card2 rounded-xl p-1">{TABS.map(t=><button key={t} onClick={()=>setTab(t)} className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${tab===t?'bg-brand text-white':'text-tx-muted hover:text-tx-base'}`}>{t}</button>)}</div>
      </div>
      <div className="grid grid-cols-4 gap-4 mb-6">{BIG.map(s=><div key={s.label} className="card text-center"><div className="text-3xl font-extrabold gtext">{s.val}</div><div className="text-xs text-tx-muted mt-1.5">{s.label}</div></div>)}</div>
      <div className="grid grid-cols-[1.4fr_1fr] gap-5 mb-5">
        <div className="card">
          <h3 className="font-bold mb-1">Thời gian học theo ngày (phút)</h3>
          <p className="text-xs text-tx-muted mb-4">Hoạt động gần nhất</p>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={daily} barSize={28}>
              <XAxis dataKey="date" tick={{fill:'#6B5F9E',fontSize:11}} axisLine={false} tickLine={false}/>
              <YAxis tick={{fill:'#6B5F9E',fontSize:11}} axisLine={false} tickLine={false}/>
              <Tooltip contentStyle={{background:'#1A1530',border:'1px solid #2D2550',borderRadius:8,fontSize:12}} labelStyle={{color:'#C4BBEE'}} itemStyle={{color:'#8B85FF'}}/>
              <Bar dataKey="minutes" radius={[6,6,0,0]}>{daily.map((_,i)=><Cell key={i} fill={i===3?'#6C63FF':'#2D2550'}/>)}</Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="card">
          <h3 className="font-bold mb-1">Kỹ năng của bạn</h3>
          <p className="text-xs text-tx-muted mb-3">Phân tích AI dựa trên kết quả học tập</p>
          <div className="flex justify-center mb-3">
            <div className="relative w-36 h-36">
              <ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={SKILLS} dataKey="pct" cx="50%" cy="50%" innerRadius={42} outerRadius={60} paddingAngle={3} startAngle={90} endAngle={-270}>{SKILLS.map((s,i)=><Cell key={i} fill={s.fill}/>)}</Pie></PieChart></ResponsiveContainer>
              <div className="absolute inset-0 flex items-center justify-center"><span className="text-2xl font-extrabold gtext">85%</span></div>
            </div>
          </div>
          <div className="space-y-2.5">{SKILLS.map(s=><div key={s.name}><div className="flex justify-between text-xs mb-1"><span className="font-medium">{s.name}</span><span className="font-bold" style={{color:s.fill}}>{s.pct}%</span></div><div className="progress"><div className="h-full rounded-full transition-all duration-700" style={{width:`${s.pct}%`,background:s.fill}}/></div></div>)}</div>
        </div>
      </div>
      <div className="card">
        <h3 className="font-bold mb-4">Lịch học tập (12 tuần)</h3>
        <div className="flex gap-1 flex-wrap">{Array.from({length:84}).map((_,i)=>{const l=Math.floor(Math.random()*5);const bg=['bg-bg-card3','bg-brand/20','bg-brand/40','bg-brand/70','bg-brand'][l];return <div key={i} className={`w-4 h-4 rounded-sm ${bg}`}/>})}</div>
        <div className="flex items-center gap-2 mt-3 text-[11px] text-tx-dim"><span>Ít hơn</span>{['bg-bg-card3','bg-brand/20','bg-brand/40','bg-brand/70','bg-brand'].map((b,i)=><div key={i} className={`w-3.5 h-3.5 rounded-sm ${b}`}/>)}<span>Nhiều hơn</span></div>
      </div>
    </div>
  )
}