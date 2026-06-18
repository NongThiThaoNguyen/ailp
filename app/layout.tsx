import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'AI Learn — Học thông minh hơn mỗi ngày',
  description: 'Nền tảng học tập AI cá nhân hóa — lộ trình riêng, AI Tutor 24/7',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  )
}
