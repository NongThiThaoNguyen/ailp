import Link from 'next/link'

const MODULES = [
  {id:1,title:'Module 1: Listening Strategies',lessons:[{id:1,title:'Listening Strategies Intro',duration:15,done:true},{id:2,title:'Note-taking Techniques',duration:20,done:true}]},
  {id:2,title:'Module 2: Reading Skills',lessons:[{id:3,title:'Skimming & Scanning',duration:18,done:false},{id:4,title:'Vocabulary in Context',duration:22,done:false}]},
  {id:3,title:'Module 3: Grammar for IELTS',lessons:[{id:5,title:'Relative Clauses',duration:18,done:false},{id:6,title:'Passive Voice',duration:20,done:false}]},
]

export default function CourseDetailPage() {
  return (
    <div className="animate-fadeUp">
      <div className="flex items-center justify-between mb-6">
        <Link href="/courses" className="flex items-center gap-2 text-sm text-tx-muted hover:text-brand-light transition-colors font-medium">← Quay lại</Link>
        <Link href="/quiz/1" className="btn-primary text-sm">Làm bài kiểm tra</Link>
      </div>

      <div className="flex gap-6 mb-8">
        <div className="w-48 h-36 rounded-2xl bg-gradient-to-br from-[#0D1B2A] to-[#1B3A5C] flex items-center justify-center text-6xl shrink-0">🎯</div>
        <div className="flex-1">
          <div className="chip chip-brand mb-3">IELTS</div>
          <h1 className="text-2xl font-extrabold mb-2">IELTS 6.5 Overall</h1>
          <p className="text-sm text-tx-muted mb-4 leading-relaxed">Lộ trình toàn diện từ 5.0 lên 6.5 với phương pháp học AI cá nhân hóa. Bao gồm đầy đủ 4 kỹ năng Listening, Reading, Writing, Speaking.</p>
          <div className="flex gap-4 text-sm text-tx-muted mb-4"><span>📖 32 bài học</span><span>⏱️ ~40 giờ</span><span>⭐ 4.9/5</span><span>👥 1,240 học viên</span></div>
          <div className="progress w-64"><div className="progress-fill" style={{width:'60%'}}/></div>
          <div className="text-xs text-tx-muted mt-1">60% hoàn thành</div>
        </div>
      </div>

      <div className="grid grid-cols-[1fr_320px] gap-6">
        <div>
          <h2 className="text-lg font-bold mb-4">Nội dung khóa học</h2>
          <div className="space-y-3">
            {MODULES.map(m=>(
              <div key={m.id} className="card">
                <h3 className="font-bold mb-3">{m.title}</h3>
                <div className="space-y-2">
                  {m.lessons.map(l=>(
                    <Link key={l.id} href={`/lessons/${l.id}`} className="flex items-center gap-3 p-3 rounded-xl hover:bg-bg-card2 transition-colors group">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm shrink-0 ${l.done?'bg-ok text-white':'bg-bg-card2 border border-bdr text-tx-muted'}`}>{l.done?'✓':l.id}</div>
                      <span className="flex-1 text-sm group-hover:text-brand-light transition-colors">{l.title}</span>
                      <span className="text-xs text-tx-muted shrink-0">{l.duration} phút</span>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="space-y-4">
          <div className="card">
            <h3 className="font-bold mb-3">Yêu cầu đầu vào</h3>
            <ul className="space-y-2 text-sm text-tx-muted">
              {['Tiếng Anh cơ bản (A2+)','Có mục tiêu rõ ràng','Kiên trì và chăm chỉ'].map(r=><li key={r} className="flex items-center gap-2"><span className="text-ok">✓</span>{r}</li>)}
            </ul>
          </div>
          <div className="card">
            <h3 className="font-bold mb-3">Bạn sẽ học được</h3>
            <ul className="space-y-2 text-sm text-tx-muted">
              {['Đạt IELTS 6.5 Overall','Chiến lược làm bài hiệu quả','Từ vựng học thuật nâng cao','Kỹ năng giao tiếp tự nhiên'].map(r=><li key={r} className="flex items-center gap-2"><span className="text-brand-light">→</span>{r}</li>)}
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}