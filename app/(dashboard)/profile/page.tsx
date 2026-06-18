'use client'
import { useState, useEffect } from 'react'
interface ProfileData { full_name:string; email:string; date_of_birth:string; country:string; language:string; timezone:string; email_notifications:boolean; marketing_emails:boolean; private_profile:boolean }
export default function ProfilePage() {
  const [data, setData] = useState<ProfileData>({full_name:'Nông Thị Thảo Ngyên',email:'nguyenntttb01430@gmail.com',date_of_birth:'2000-01-01',country:'Việt Nam',language:'vi',timezone:'Asia/Ho_Chi_Minh',email_notifications:true,marketing_emails:false,private_profile:false})
  const [saved, setSaved] = useState(false)
  const [loading, setLoading] = useState(false)
  useEffect(()=>{
    fetch('/api/profile').then(r=>r.json()).then(d=>{
      if(d.data?.profile) setData((p:ProfileData)=>({...p,...d.data.profile,...(d.data.settings||{})}))
    }).catch(()=>{})
  },[])
  const save = async () => {
    setLoading(true)
    await fetch('/api/profile',{method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify(data)}).catch(()=>{})
    setLoading(false); setSaved(true); setTimeout(()=>setSaved(false),2500)
  }
  const tog = (k:keyof ProfileData) => setData(p=>({...p,[k]:!p[k]}))
  return (
    <div className="animate-fadeUp">
      <h1 className="text-2xl font-extrabold mb-6">⚙️ Cài đặt</h1>
      <div className="grid grid-cols-[300px_1fr] gap-5">
        <div className="space-y-4">
          <div className="card text-center">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-brand to-second flex items-center justify-center text-3xl font-black text-white mx-auto mb-4">NV</div>
            <div className="font-extrabold text-lg">{data.full_name}</div>
            <div className="text-sm text-tx-muted mb-3">{data.email}</div>
            <span className="inline-flex items-center gap-1.5 bg-gradient-to-r from-yellow-400 to-amber-500 text-black px-3 py-1 rounded-full text-xs font-bold">⭐ Premium Member</span>
            <div className="mt-4 p-4 bg-bg-card2 rounded-xl text-left">
              <div className="flex justify-between items-center mb-2"><span className="text-xs text-tx-muted">Cấp độ</span><span className="text-2xl font-extrabold gtext">15</span></div>
              <div className="progress mb-1"><div className="progress-fill" style={{width:'75%'}}/></div>
              <div className="flex justify-between text-[11px] text-tx-dim"><span>1500 / 2000 XP</span><span>Lên cấp 16</span></div>
            </div>
            <div className="mt-3 text-left space-y-2">
              <div className="text-xs text-tx-muted">Mục tiêu</div><span className="chip chip-brand">IELTS 6.5 Overall</span>
              <div className="text-xs text-tx-muted mt-2">Giờ học/ngày</div><span className="chip chip-brand">60 phút</span>
            </div>
          </div>
        </div>
        <div className="space-y-4">
          <div className="card">
            <h3 className="font-bold mb-4">Thông tin cá nhân</h3>
            <div className="grid grid-cols-2 gap-4">
              <div><label className="label">Họ và tên</label><input className="input" value={data.full_name} onChange={e=>setData(p=>({...p,full_name:e.target.value}))}/></div>
              <div><label className="label">Email</label><input className="input" type="email" value={data.email} onChange={e=>setData(p=>({...p,email:e.target.value}))}/></div>
              <div><label className="label">Ngày sinh</label><input className="input" type="date" value={data.date_of_birth} onChange={e=>setData(p=>({...p,date_of_birth:e.target.value}))}/></div>
              <div><label className="label">Quốc gia</label><input className="input" value={data.country} onChange={e=>setData(p=>({...p,country:e.target.value}))}/></div>
              <div><label className="label">Mục tiêu học</label><input className="input" defaultValue="IELTS 6.5 Overall"/></div>
              <div><label className="label">Giờ học mỗi ngày</label><select className="input"><option>30 phút</option><option selected>60 phút</option><option>90 phút</option></select></div>
            </div>
          </div>
          <div className="card">
            <h3 className="font-bold mb-4">Cài đặt thông báo</h3>
            <div className="divide-y divide-bdr">
              {([['Thông báo email','email_notifications'],['Email marketing','marketing_emails'],['Hồ sơ riêng tư','private_profile']] as [string,keyof ProfileData][]).map(([l,k])=>(
                <div key={k} className="flex items-center justify-between py-3">
                  <span className="text-sm font-medium">{l}</span>
                  <button onClick={()=>tog(k)} className={`w-11 h-6 rounded-full relative transition-colors duration-200 ${data[k]?'bg-brand':'bg-bg-card3'}`}>
                    <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all duration-200 ${data[k]?'left-5':'left-0.5'}`}/>
                  </button>
                </div>
              ))}
            </div>
          </div>
          <div className="card">
            <h3 className="font-bold mb-4">Ngôn ngữ & Múi giờ</h3>
            <div className="grid grid-cols-2 gap-4">
              <div><label className="label">Ngôn ngữ</label><select className="input" value={data.language} onChange={e=>setData(p=>({...p,language:e.target.value}))}><option value="vi">Tiếng Việt</option><option value="en">English</option></select></div>
              <div><label className="label">Múi giờ</label><select className="input"><option>Asia/Ho_Chi_Minh (GMT+7)</option><option>UTC</option></select></div>
            </div>
          </div>
          <button onClick={save} disabled={loading} className={`btn-primary w-full py-3 text-base ${saved?'from-ok to-teal-500':''}`}>{saved?'✓ Đã lưu thay đổi!':loading?'⏳ Đang lưu...':'Lưu thay đổi'}</button>
        </div>
      </div>
    </div>
  )
}