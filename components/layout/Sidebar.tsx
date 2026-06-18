'use client'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'

const NAV = [
  { href:'/dashboard',     icon:'🏠', label:'Tổng quan'    },
  { href:'/learning-path', icon:'🗺️', label:'Lộ trình học' },
  { href:'/courses',       icon:'📚', label:'Khóa học'     },
  { href:'/ai-tutor',      icon:'🤖', label:'AI Tutor'     },
  { href:'/stats',         icon:'📊', label:'Thống kê'     },
  { href:'/achievements',  icon:'🏆', label:'Thành tích'   },
  { href:'/profile',       icon:'⚙️', label:'Cài đặt'     },
]

export default function Sidebar() {
  const path   = usePathname()
  const router = useRouter()

  const logout = async () => {
    await fetch('/api/auth/logout', { method:'POST' })
    router.push('/login')
  }

  return (
    <aside className="sidebar">
      <Link href="/dashboard" className="flex items-center gap-2.5 px-5 py-5 border-b border-bdr shrink-0">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand to-second flex items-center justify-center text-lg">🤖</div>
        <span className="text-[17px] font-extrabold gtext">AI Learn</span>
      </Link>

      <nav className="flex-1 py-3 space-y-0.5">
        {NAV.map(n => {
          const active = path === n.href || (n.href !== '/dashboard' && path.startsWith(n.href))
          return (
            <Link key={n.href} href={n.href} className={`nav-link ${active ? 'active' : ''}`}>
              <span className="text-base w-5 text-center shrink-0">{n.icon}</span>
              <span>{n.label}</span>
            </Link>
          )
        })}
      </nav>

      <div className="border-t border-bdr p-3 space-y-1">
        <Link href="/profile" className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-brand/8 transition-colors group">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-brand to-second flex items-center justify-center text-sm font-bold text-white shrink-0">NV</div>
          <div className="min-w-0 flex-1">
            <div className="text-sm font-semibold truncate group-hover:text-brand-light transition-colors">Nguyễn Văn A</div>
            <div className="text-[11px] text-tx-muted">Premium ⭐</div>
          </div>
        </Link>
        <button onClick={logout} className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-tx-dim hover:text-danger hover:bg-danger/8 transition-all">
          <span>🚪</span><span>Đăng xuất</span>
        </button>
      </div>
    </aside>
  )
}
