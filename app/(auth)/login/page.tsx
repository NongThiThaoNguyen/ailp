'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
export default function LoginPage() {
  const router = useRouter()
  const [form, setForm] = useState({email:'',password:''})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    router.push('/dashboard')
  }
  return (
    <div className="min-h-screen bg-bg-dark flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute -top-48 -left-48 w-[600px] h-[600px] rounded-full bg-brand opacity-[0.14] blur-[100px]"/>
      <div className="absolute -bottom-48 -right-48 w-[500px] h-[500px] rounded-full bg-second opacity-[0.10] blur-[100px]"/>
      <div className="relative z-10 flex w-full max-w-[920px] min-h-[580px] rounded-2xl overflow-hidden shadow-[0_32px_80px_rgba(0,0,0,0.6)] animate-fadeUp">
        {/* Left */}
        <div className="flex-1 bg-gradient-to-br from-[#12073A] via-[#2D1B69] to-[#5040B0] p-12 flex flex-col justify-between relative overflow-hidden">
          <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full bg-white/[0.04]"/>
          <div className="absolute -bottom-16 -left-16 w-52 h-52 rounded-full bg-white/[0.04]"/>
          <div className="relative z-10">
            <span className="inline-block bg-white/[0.12] border border-white/20 rounded-full px-4 py-1.5 text-xs font-semibold mb-5">🤖 AI-Powered Learning</span>
            <h1 className="text-[34px] font-black leading-[1.2] mb-4">Học thông minh hơn<br/>mỗi <span className="gtext-gold">ngày</span></h1>
            <p className="text-sm text-white/60 leading-relaxed max-w-xs">AI Learn đồng hành cùng bạn. Lộ trình cá nhân hóa, AI Tutor 24/7, theo dõi tiến độ thông minh.</p>
          </div>
          <div className="text-center py-4 relative z-10"><span className="text-[84px] animate-float block">🤖</span></div>
          <div className="flex gap-4 relative z-10">
            {[['50K+','Học viên'],['200+','Khóa học'],['4.9⭐','Đánh giá']].map(([n,l])=>(
              <div key={l} className="flex-1 bg-white/[0.08] border border-white/10 rounded-xl p-3 backdrop-blur-sm">
                <div className="text-lg font-black">{n}</div><div className="text-[11px] text-white/60 mt-0.5">{l}</div>
              </div>
            ))}
          </div>
        </div>
        {/* Right */}
        <div className="flex-1 bg-bg-card p-10 flex flex-col justify-center">
          <h2 className="text-2xl font-extrabold mb-1">Chào mừng trở lại! 👋</h2>
          <p className="text-sm text-tx-muted mb-7">Đăng nhập để tiếp tục hành trình học tập</p>
          <button className="oauth-btn mb-3"><span className="w-5 h-5 rounded-full bg-white flex items-center justify-center text-[#4285F4] text-xs font-black">G</span>Đăng nhập với Google</button>
          <button className="oauth-btn mb-5"><span className="w-5 h-5 rounded-full bg-[#1877F2] flex items-center justify-center text-white text-xs font-black">f</span>Đăng nhập với Facebook</button>
          <div className="divider mb-5"><span>hoặc</span></div>
          {error && <div className="mb-4 px-4 py-3 rounded-xl bg-danger/10 border border-danger/30 text-danger text-sm">{error}</div>}
          <form onSubmit={submit} className="space-y-4">
            <div><label className="label">Email của bạn</label><input className="input" type="email" placeholder="example@gmail.com" value={form.email} onChange={e=>setForm(f=>({...f,email:e.target.value}))} /></div>
            <div>
              <div className="flex items-center justify-between mb-1.5"><label className="label !mb-0">Mật khẩu</label><button type="button" className="text-xs text-brand-light font-semibold hover:underline">Quên mật khẩu?</button></div>
              <input className="input" type="password" placeholder="••••••••" value={form.password} onChange={e=>setForm(f=>({...f,password:e.target.value}))} />
            </div>
            <button type="submit" className="btn-primary w-full py-3 text-base" disabled={loading}>{loading?'⏳ Đang đăng nhập...':'Đăng nhập'}</button>
          </form>
          <p className="text-center mt-5 text-sm text-tx-muted">Chưa có tài khoản? <Link href="/register" className="text-brand-light font-semibold hover:underline">Đăng ký ngay</Link></p>
        </div>
      </div>
    </div>
  )
}