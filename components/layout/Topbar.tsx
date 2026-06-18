'use client'
import Link from 'next/link'
import { useState } from 'react'

export default function Topbar({ title, children }: { title?:string; children?:React.ReactNode }) {
  const [q, setQ] = useState('')
  return (
    <header className="topbar">
      <div className="flex-1 min-w-0">
        {title
          ? <h1 className="text-lg font-extrabold">{title}</h1>
          : <div className="searchbar max-w-sm">
              <span className="text-tx-dim text-sm shrink-0">🔍</span>
              <input placeholder="Tìm kiếm khóa học, bài học..." value={q} onChange={e=>setQ(e.target.value)} />
            </div>
        }
      </div>
      <div className="flex items-center gap-3 shrink-0">
        {children}
        <button className="btn-icon relative">
          🔔
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-second border-2 border-bg-card"/>
        </button>
        <Link href="/profile">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-brand to-second flex items-center justify-center text-xs font-bold text-white hover:scale-105 transition-transform">NV</div>
        </Link>
      </div>
    </header>
  )
}
