'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
export default function RegisterPage() {
  const router = useRouter()
  const [form, setForm] = useState({email:'',password:'',full_name:'',role:'student'})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const submit = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true); setError('')
    try {
      const r = await fetch('/api/auth/register',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(form)})
      const d = await r.json()
      if (!r.ok) { setError(d.error||'Lỗi đăng ký'); return }
      router.push(d.redirect||'/competency-test')
    } catch { setError('Lỗi kết nối') } finally { setLoading(false) }
  }
  return (
    <div className="min-h-screen bg-bg-dark flex items-center justify-center p-4">
      <div className="absolute -top-48 -left-48 w-[600px] h-[600px] rounded-full bg-brand opacity-[0.14] blur-[100px]"/>
      <div className="w-full max-w-md relative z-10 animate-fadeUp">
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-brand to-second flex items-center justify-center text-3xl mx-auto mb-4">🤖</div>
          <h1 className="text-2xl font-extrabold">Tạo tài khoản mới</h1>
          <p className="text-sm text-tx-muted mt-1">Bắt đầu hành trình học tập thông minh</p>
        </div>
        <div className="card">
          {error && <div className="mb-4 px-4 py-3 rounded-xl bg-danger/10 border border-danger/30 text-danger text-sm">{error}</div>}
          <form onSubmit={submit} className="space-y-4">
            <div><label className="label">Họ và tên</label><input className="input" placeholder="Nguyễn Văn A" value={form.full_name} onChange={e=>setForm(f=>({...f,full_name:e.target.value}))} required/></div>
            <div><label className="label">Email</label><input className="input" type="email" placeholder="example@gmail.com" value={form.email} onChange={e=>setForm(f=>({...f,email:e.target.value}))} required/></div>
            <div><label className="label">Mật khẩu (tối thiểu 8 ký tự)</label><input className="input" type="password" placeholder="••••••••" value={form.password} onChange={e=>setForm(f=>({...f,password:e.target.value}))} required minLength={8}/></div>
            <div><label className="label">Bạn là</label>
              <select className="input" value={form.role} onChange={e=>setForm(f=>({...f,role:e.target.value}))}>
                <option value="student">Học viên</option><option value="teacher">Giảng viên</option>
              </select>
            </div>
            <button type="submit" className="btn-primary w-full py-3 text-base" disabled={loading}>{loading?'⏳ Đang tạo tài khoản...':'Đăng ký ngay'}</button>
          </form>
          <p className="text-center mt-5 text-sm text-tx-muted">Đã có tài khoản? <Link href="/login" className="text-brand-light font-semibold hover:underline">Đăng nhập</Link></p>
        </div>
      </div>
    </div>
  )
}