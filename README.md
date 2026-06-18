# AI Learning Platform — Đồ án Tốt nghiệp

Nền tảng học tập AI cá nhân hóa với Next.js 14 + SQL Server + OpenAI.

## Cài đặt & Chạy

```bash
# 1. Cài dependencies
npm install

# 2. Cấu hình .env.local
cp .env.local .env.local.example
# → Điền DB_SERVER, DB_NAME, DB_USER, DB_PASSWORD, JWT_SECRET, OPENAI_API_KEY

# 3. Chạy SQL Server schema
# → Chạy file SQL trong /sql/schema.sql để tạo 50 bảng

# 4. Khởi động dev server
npm run dev
# → Truy cập http://localhost:3000
```

## Cấu trúc thư mục

```
ailp/
├── app/
│   ├── (auth)/          # Login, Register, Competency Test
│   ├── (dashboard)/     # Dashboard, Courses, Lessons, Quiz, AI Tutor, Stats, Achievements, Profile
│   └── api/             # 15+ REST API endpoints
├── components/layout/   # Sidebar, Topbar
├── lib/                 # db.ts, auth.ts, ai.ts
├── types/               # TypeScript interfaces (50 tables)
└── middleware.ts        # JWT authentication guard
```

## Tính năng AI cốt lõi

1. **Kiểm tra năng lực đầu vào** → AI phân tích → VARK learning style
2. **Tạo lộ trình cá nhân hóa** → `ai_learning_paths` + nodes
3. **AI Tutor Chat** → lịch sử `ai_messages` + tracking chi phí `ai_api_logs`
4. **Quiz thông minh** → phát hiện `user_weaknesses` → gợi ý cải thiện
5. **Gamification** → tự động trao `badges` + cập nhật `user_study_streaks`

## API Endpoints

| Method | Endpoint | Chức năng |
|--------|----------|-----------|
| POST | /api/auth/register | Đăng ký |
| POST | /api/auth/login | Đăng nhập |
| GET  | /api/dashboard/summary | Thống kê tổng quan |
| GET  | /api/dashboard/recommendations | AI gợi ý |
| POST | /api/competency/submit | Nộp bài test + AI tạo lộ trình |
| GET  | /api/learning-paths | Lộ trình học của tôi |
| GET  | /api/courses | Danh sách khóa học |
| GET  | /api/courses/[id] | Chi tiết khóa học |
| POST | /api/courses/[id] | Đăng ký khóa học |
| POST | /api/lessons/[id]/progress | Cập nhật tiến độ |
| GET  | /api/quizzes/[id] | Lấy đề quiz |
| POST | /api/quizzes/[id]/attempt | Nộp bài quiz |
| POST | /api/ai-tutor/conversations | Tạo hội thoại |
| POST | /api/ai-tutor/messages | Chat với AI Tutor |
| GET  | /api/stats | Thống kê học tập |
| GET  | /api/achievements | Huy hiệu & thành tích |
| GET/PUT | /api/profile | Xem/cập nhật hồ sơ |

## Tech Stack

- **Frontend**: Next.js 14 App Router + TailwindCSS + TypeScript + Recharts
- **Backend**: Next.js Route Handlers + JWT (jose) + Zod validation
- **Database**: SQL Server (mssql) — 50 bảng
- **AI**: OpenAI GPT-4o-mini (auto-log chi phí vào ai_api_logs)