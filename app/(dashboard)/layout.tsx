import Sidebar from '@/components/layout/Sidebar'
import Topbar  from '@/components/layout/Topbar'

export default function DashLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-bg-dark">
      <Sidebar />
      <div className="main-content">
        <Topbar />
        <main className="page-body">{children}</main>
      </div>
    </div>
  )
}
