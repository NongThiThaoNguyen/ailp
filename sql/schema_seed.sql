-- ============================================================
-- AI LEARNING PLATFORM — SEED DATA
-- Chạy sau khi đã tạo 50 bảng schema
-- ============================================================
USE AILearningPlatform;
GO

-- ── Course Levels ──
INSERT INTO course_levels(name,description,order_index,created_at) VALUES
(N'Cơ bản',    N'Dành cho người mới bắt đầu',    1, GETDATE()),
(N'Trung bình',N'Đã có kiến thức nền tảng',       2, GETDATE()),
(N'Nâng cao',  N'Cho người học chuyên sâu',        3, GETDATE()),
(N'Chuyên gia',N'Trình độ chuyên nghiệp',          4, GETDATE());

-- ── Course Categories ──
INSERT INTO course_categories(name,description,created_at) VALUES
(N'IELTS',          N'Luyện thi IELTS Academic & General',   GETDATE()),
(N'TOEIC',          N'Luyện thi TOEIC Listening & Reading',  GETDATE()),
(N'Giao tiếp',      N'Tiếng Anh giao tiếp hàng ngày',       GETDATE()),
(N'Ngữ pháp',       N'Grammar từ cơ bản đến nâng cao',       GETDATE()),
(N'Từ vựng',        N'Vocabulary theo chủ đề',               GETDATE()),
(N'Phát âm',        N'Pronunciation & Phonetics',            GETDATE());

-- ── Admin / Instructor user ──
INSERT INTO users(email,password,role,status,created_at,updated_at) VALUES
('admin@ailearn.vn','$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMqJqhN7LqZFOxzSJl3U5OsG2.','admin','active',GETDATE(),GETDATE()),
('gv.nguyen@ailearn.vn','$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMqJqhN7LqZFOxzSJl3U5OsG2.','teacher','active',GETDATE(),GETDATE());

INSERT INTO user_profiles(user_id,full_name,country,created_at,updated_at) VALUES
(1,N'Admin Hệ thống',N'Vietnam',GETDATE(),GETDATE()),
(2,N'Nguyễn Thị Lan',N'Vietnam',GETDATE(),GETDATE());

-- ── Courses ──
INSERT INTO courses(category_id,level_id,instructor_id,title,description,status,created_at,updated_at) VALUES
(1,2,2,N'IELTS 6.5 Overall',  N'Lộ trình toàn diện từ 5.0 lên 6.5 với AI cá nhân hóa','published',GETDATE(),GETDATE()),
(2,2,2,N'TOEIC 500+',          N'Đạt 500+ TOEIC trong 2 tháng','published',GETDATE(),GETDATE()),
(3,1,2,N'Tiếng Anh giao tiếp', N'Giao tiếp tự tin trong 3 tháng','published',GETDATE(),GETDATE()),
(4,1,2,N'Ngữ pháp nền tảng',   N'Nắm vững toàn bộ ngữ pháp cơ bản','published',GETDATE(),GETDATE()),
(1,3,2,N'IELTS Reading 7.0+',  N'Chiến lược Reading nâng cao','published',GETDATE(),GETDATE()),
(1,3,2,N'IELTS Listening 8.0', N'Luyện nghe chuyên sâu','published',GETDATE(),GETDATE());

-- ── Course Tags ──
INSERT INTO course_tags(name,created_at) VALUES
('IELTS',GETDATE()),('TOEIC',GETDATE()),('Grammar',GETDATE()),
('Listening',GETDATE()),('Reading',GETDATE()),('Writing',GETDATE()),('Speaking',GETDATE());

INSERT INTO course_tag_mappings(course_id,tag_id) VALUES
(1,1),(1,4),(1,5),(1,6),(1,7),(2,2),(3,7),(4,3),(5,1),(5,5),(6,1),(6,4);

-- ── Modules & Lessons (Course 1 — IELTS 6.5) ──
INSERT INTO course_modules(course_id,title,order_index,created_at) VALUES
(1,N'Module 1: Listening Strategies',1,GETDATE()),
(1,N'Module 2: Reading Skills',      2,GETDATE()),
(1,N'Module 3: Grammar for IELTS',   3,GETDATE()),
(1,N'Module 4: Writing Tasks',       4,GETDATE());

INSERT INTO course_lessons(module_id,title,content_type,content_body,duration_minutes,order_index,created_at) VALUES
(1,N'Chiến lược nghe chủ động',       'video',  N'Kỹ thuật nghe tích cực giúp cải thiện điểm Listening IELTS.',15,1,GETDATE()),
(1,N'Note-taking Techniques',          'video',  N'Cách ghi chép nhanh khi nghe IELTS.',20,2,GETDATE()),
(2,N'Skimming & Scanning',             'video',  N'Đọc lướt và đọc quét để tiết kiệm thời gian.',18,1,GETDATE()),
(2,N'Từ vựng học thuật IELTS',        'document',N'Danh sách 500 từ vựng học thuật cần thiết.',25,2,GETDATE()),
(3,N'Relative Clauses',                'video',  N'Mệnh đề quan hệ — who, which, that, whose, where.',18,1,GETDATE()),
(3,N'Passive Voice',                   'video',  N'Câu bị động trong văn viết học thuật.',20,2,GETDATE()),
(4,N'Writing Task 1 — Biểu đồ',       'video',  N'Cách mô tả biểu đồ, bảng số liệu.',30,1,GETDATE()),
(4,N'Writing Task 2 — Argumentative', 'video',  N'Cách viết bài luận tranh luận.',35,2,GETDATE());

-- ── Question Bank (for competency test) ──
INSERT INTO question_bank(creator_id,question_text,question_type,difficulty_level,created_at) VALUES
(2,N'Choose the correct sentence:','multiple_choice','easy',GETDATE()),
(2,N'The meeting _____ at 9 AM tomorrow.','multiple_choice','easy',GETDATE()),
(2,N'I _____ here since 2020.','multiple_choice','medium',GETDATE()),
(2,N'If I _____ rich, I would travel the world.','multiple_choice','medium',GETDATE()),
(2,N'The book _____ by Hemingway is my favorite.','multiple_choice','hard',GETDATE()),
(2,N'The man _____ is standing over there is my uncle.','multiple_choice','medium',GETDATE()),
(2,N'This is the house _____ I was born.','multiple_choice','medium',GETDATE()),
(2,N'The woman _____ car was stolen reported it to police.','multiple_choice','hard',GETDATE());

INSERT INTO question_answers(question_id,answer_text,is_correct) VALUES
(1,N'She don''t like coffee.',0),(1,N'She doesn''t like coffee.',1),(1,N'She not like coffee.',0),(1,N'She isn''t like coffee.',0),
(2,N'will start',0),(2,N'is starting',0),(2,N'starts',1),(2,N'started',0),
(3,N'work',0),(3,N'worked',0),(3,N'have worked',1),(3,N'am working',0),
(4,N'am',0),(4,N'were',1),(4,N'was',0),(4,N'will be',0),
(5,N'writing',0),(5,N'wrote',0),(5,N'written',1),(5,N'writes',0),
(6,N'who',1),(6,N'which',0),(6,N'whose',0),(6,N'whom',0),
(7,N'which',0),(7,N'that',0),(7,N'where',1),(7,N'when',0),
(8,N'who',0),(8,N'which',0),(8,N'whose',1),(8,N'whom',0);

-- ── Quiz (lesson 5 = Relative Clauses) ──
INSERT INTO quizzes(lesson_id,title,passing_score,time_limit_minutes,created_at) VALUES
(5,N'Quiz: Relative Clauses',70,15,GETDATE());

INSERT INTO quiz_question_mappings(quiz_id,question_id,order_index) VALUES
(1,6,1),(1,7,2),(1,8,3),(1,1,4),(1,2,5);

-- ── Subscription Plans ──
INSERT INTO subscription_plans(name,description,price,duration_days,created_at) VALUES
(N'Free',      N'Truy cập cơ bản, tối đa 3 khóa học',          0,      36500,GETDATE()),
(N'Premium',   N'Truy cập không giới hạn, AI Tutor 24/7',       199000, 30,   GETDATE()),
(N'Premium 6M',N'Tiết kiệm 30% so với gói tháng',               999000, 180,  GETDATE()),
(N'Premium 1Y',N'Tiết kiệm 50% so với gói tháng, ưu tiên hỗ trợ',1990000,365,GETDATE());

-- ── Badges ──
INSERT INTO badges(name,description,icon,criteria_type,criteria_value,created_at) VALUES
(N'7 ngày liên tiếp', N'Học 7 ngày không nghỉ',       '👑','streak',        '7', GETDATE()),
(N'50 bài học',       N'Hoàn thành 50 bài học',        '📚','lessons_completed','50',GETDATE()),
(N'Quiz Master',      N'Vượt qua 10 bài quiz',         '🧠','quizzes_done',  '10',GETDATE()),
(N'Chuyên cần',       N'Vượt qua 30 bài quiz',         '⭐','quizzes_done',  '30',GETDATE()),
(N'Siêu học giả',     N'Hoàn thành 200 bài học',       '🎓','lessons_completed','200',GETDATE()),
(N'Thần tốc',         N'Học 10 ngày liên tiếp',        '⚡','streak',        '10',GETDATE()),
(N'Kim cương',        N'Học 30 ngày liên tiếp',        '💎','streak',        '30',GETDATE());

-- ── AI Prompts Library ──
INSERT INTO ai_prompts_library(name,system_prompt,use_case,created_at) VALUES
(N'Tutor Chat',
N'Bạn là AI Tutor thông minh cho nền tảng học tiếng Anh. Hãy giải thích rõ ràng, dùng ví dụ thực tế, trả lời bằng tiếng Việt. Khuyến khích học viên và gợi ý bài tập khi phù hợp. Giữ câu trả lời súc tích dưới 200 từ.',
'tutor_chat',GETDATE()),

(N'Competency Evaluation',
N'Bạn là chuyên gia đánh giá năng lực học viên. Phân tích kết quả và trả về JSON hợp lệ (không có markdown):
{"competency_level":"beginner|intermediate|advanced|expert","score":0-100,"dominant_style":"visual|auditory|reading_writing|kinesthetic","evaluation":"nhận xét ngắn gọn bằng tiếng Việt"}',
'competency_eval',GETDATE()),

(N'Learning Path Generation',
N'Bạn là AI tạo lộ trình học cá nhân hóa. Dựa trên thông tin học viên, trả về JSON hợp lệ (không có markdown):
{"title":"tên lộ trình","target_goal":"mục tiêu","estimated_days":90,"course_ids":[1,2,3],"reasoning":"lý do ngắn gọn"}',
'path_gen',GETDATE()),

(N'Note Summarizer',
N'Tóm tắt ghi chú học tập thành các bullet points ngắn gọn, súc tích bằng tiếng Việt. Tối đa 150 từ.',
'note_summary',GETDATE()),

(N'Quiz Feedback',
N'Phân tích câu trả lời quiz và giải thích ngắn gọn (dưới 80 từ, tiếng Việt) tại sao đúng hoặc sai. Gợi ý cách ghi nhớ.',
'quiz_feedback',GETDATE());

-- ── System Settings ──
INSERT INTO system_settings(setting_key,setting_value,description) VALUES
('app_name',        'AI Learn',        N'Tên ứng dụng'),
('app_version',     '1.0.0',           N'Phiên bản hiện tại'),
('max_quiz_attempts','3',              N'Số lần thi lại tối đa'),
('streak_reset_hour','0',             N'Giờ reset streak (UTC)'),
('ai_model',        'gpt-4o-mini',     N'Model AI đang sử dụng'),
('free_courses_limit','3',            N'Giới hạn khóa học miễn phí');

PRINT N'Seed data inserted successfully!';
GO