// ── Users (7 tables) ──────────────────────────────────────────
export interface User { id:number; email:string; role:'admin'|'teacher'|'student'|'ai_agent'; status:'active'|'inactive'|'banned'; created_at:string; updated_at:string }
export interface UserProfile { id:number; user_id:number; full_name:string; avatar?:string; bio?:string; date_of_birth?:string; gender?:string; country?:string; created_at:string; updated_at:string }
export interface UserSettings { id:number; user_id:number; language:string; timezone:string; email_notifications:boolean; marketing_emails:boolean; private_profile:boolean }
export interface UserSession { id:number; user_id:number; token:string; ip_address?:string; user_agent?:string; last_activity?:string; expires_at?:string }
export interface UserDevice { id:number; user_id:number; device_name?:string; device_type?:string; os?:string; browser?:string; last_used_at?:string }
export interface UserFollower { id:number; follower_id:number; following_id:number; created_at:string }
export interface UserBlocked { id:number; blocker_id:number; blocked_id:number; created_at:string }

// ── Competency & AI Rec (3 tables) ───────────────────────────
export interface InputCompetencyTest { id:number; user_id:number; requires_test:boolean; test_status:'not_started'|'in_progress'|'completed'|'skipped'; competency_level?:'beginner'|'intermediate'|'advanced'|'expert'; score?:number; ai_evaluation?:string; tested_at?:string; created_at:string }
export interface AILearningStyle { id:number; user_id:number; visual_score:number; auditory_score:number; reading_writing_score:number; kinesthetic_score:number; dominant_style?:'visual'|'auditory'|'reading_writing'|'kinesthetic'; updated_at:string }
export interface AIRecommendation { id:number; user_id:number; recommendation_type:'course'|'exercise'|'article'; target_id:number; reason_phrase?:string; confidence_score?:number; is_applied:boolean; created_at:string; course?:Course }

// ── Gamification (3 tables) ───────────────────────────────────
export interface Badge { id:number; name:string; description?:string; icon?:string; criteria_type?:string; criteria_value?:string; created_at:string }
export interface UserBadge { id:number; user_id:number; badge_id:number; awarded_at:string; badge?:Badge }
export interface Achievement { id:number; user_id:number; title:string; description?:string; icon?:string; points:number; created_at:string }

// ── Courses (8 tables) ────────────────────────────────────────
export interface CourseCategory { id:number; name:string; description?:string; parent_id?:number; created_at:string }
export interface CourseLevel { id:number; name:string; description?:string; order_index:number; created_at:string }
export interface Course { id:number; category_id:number; level_id:number; instructor_id:number; title:string; description?:string; thumbnail?:string; status:'draft'|'published'|'archived'; created_at:string; updated_at:string; category?:CourseCategory; level?:CourseLevel; instructor?:UserProfile; avg_rating?:number; total_lessons?:number; enrolled_count?:number; progress_percentage?:number; is_enrolled?:boolean; tags?:CourseTag[] }
export interface CourseModule { id:number; course_id:number; title:string; description?:string; order_index:number; created_at:string; lessons?:CourseLesson[] }
export interface CourseLesson { id:number; module_id:number; title:string; content_type?:'video'|'document'|'quiz'|'ai_chat'; content_body?:string; video_url?:string; duration_minutes:number; order_index:number; created_at:string; is_completed?:boolean; time_spent_seconds?:number; attachments?:LessonAttachment[] }
export interface LessonAttachment { id:number; lesson_id:number; file_name:string; file_path:string; file_size_bytes?:number; created_at:string }
export interface CourseTag { id:number; name:string; created_at:string }
export interface CourseTagMapping { id:number; course_id:number; tag_id:number }

// ── Progress & Learning Path (5 tables) ───────────────────────
export interface UserEnrollment { id:number; user_id:number; course_id:number; progress_percentage:number; status:'enrolled'|'in_progress'|'completed'; enrolled_at:string; completed_at?:string; course?:Course }
export interface UserLessonProgress { id:number; user_id:number; lesson_id:number; is_completed:boolean; last_viewed_at?:string; time_spent_seconds:number; completed_at?:string }
export interface AILearningPath { id:number; user_id:number; title?:string; target_goal?:string; estimated_days?:number; created_at:string; nodes?:AILearningPathNode[]; overall_progress?:number }
export interface AILearningPathNode { id:number; path_id:number; course_id:number; node_order:number; status:'locked'|'unlocked'|'active'|'completed'; course?:Course }
export interface UserStudyStreak { id:number; user_id:number; current_streak:number; longest_streak:number; last_active_date?:string; updated_at:string }

// ── Quiz & Questions (7 tables) ───────────────────────────────
export interface QuestionBank { id:number; creator_id?:number; question_text:string; question_type?:'multiple_choice'|'essay'|'code'; difficulty_level?:'easy'|'medium'|'hard'; created_at:string; answers?:QuestionAnswer[] }
export interface QuestionAnswer { id:number; question_id:number; answer_text:string; is_correct:boolean }
export interface Quiz { id:number; lesson_id:number; title:string; passing_score:number; time_limit_minutes:number; created_at:string; questions?:QuestionBank[] }
export interface QuizQuestionMapping { id:number; quiz_id:number; question_id:number; order_index:number }
export interface QuizAttempt { id:number; user_id:number; quiz_id:number; score_achieved?:number; is_passed?:boolean; started_at:string; submitted_at?:string; details?:QuizAttemptDetail[] }
export interface QuizAttemptDetail { id:number; attempt_id:number; question_id:number; selected_answer_id?:number; essay_answer?:string; is_correct_result?:boolean; ai_feedback?:string }
export interface UserWeakness { id:number; user_id:number; category_id:number; error_frequency:number; ai_remediation_status?:string; updated_at:string; category?:CourseCategory }

// ── AI Chatbot (4 tables) ─────────────────────────────────────
export interface AIConversation { id:number; user_id:number; lesson_id?:number; title?:string; created_at:string; messages?:AIMessage[] }
export interface AIMessage { id:number; conversation_id:number; sender:'user'|'ai'; message_text:string; sent_at:string }
export interface AIPromptsLibrary { id:number; name:string; system_prompt:string; use_case?:string; created_at:string }
export interface UserNoteWithAI { id:number; user_id:number; lesson_id?:number; raw_note?:string; ai_summarized?:string; created_at:string }

// ── Forum & Social (5 tables) ─────────────────────────────────
export interface ForumPost { id:number; author_id:number; title:string; content:string; views_count:number; created_at:string; updated_at:string; author?:UserProfile; likes_count?:number; comments_count?:number; is_liked?:boolean }
export interface ForumComment { id:number; post_id:number; user_id:number; parent_comment_id?:number; content:string; created_at:string; user?:UserProfile; replies?:ForumComment[] }
export interface PostLike { id:number; post_id:number; user_id:number; created_at:string }
export interface CourseReview { id:number; course_id:number; user_id:number; rating:1|2|3|4|5; review_text?:string; created_at:string; user?:UserProfile }
export interface Notification { id:number; user_id:number; title?:string; message?:string; is_read:boolean; notification_type?:string; created_at:string }

// ── Subscription & Payment (4 tables) ────────────────────────
export interface SubscriptionPlan { id:number; name:string; description?:string; price:number; duration_days:number; created_at:string }
export interface UserSubscription { id:number; user_id:number; plan_id:number; start_date:string; end_date:string; status:'active'|'expired'|'cancelled'; plan?:SubscriptionPlan }
export interface PaymentTransaction { id:number; user_id:number; amount:number; currency:string; payment_gateway?:string; gateway_transaction_id?:string; status?:string; created_at:string }
export interface DiscountCode { id:number; code:string; discount_percentage?:number; valid_until?:string; usage_limit?:number; current_usage:number }

// ── System & Logs (4 tables) ─────────────────────────────────
export interface SystemSetting { id:number; setting_key:string; setting_value?:string; description?:string }
export interface AuditLog { id:number; user_id?:number; action?:string; table_name?:string; record_id?:number; old_value?:string; new_value?:string; created_at:string }
export interface AIApiLog { id:number; user_id?:number; provider?:string; model_used?:string; prompt_tokens?:number; completion_tokens?:number; total_cost?:number; created_at:string }
export interface UserFeedback { id:number; user_id?:number; feedback_type?:string; content:string; screenshot_url?:string; status:string; created_at:string }

// ── API helpers ───────────────────────────────────────────────
export interface ApiOk<T> { data: T }
export interface ApiErr { error: string; details?: unknown }
export interface DashboardSummary { minutes_today:number; diff_minutes:number; lessons_today:number; diff_lessons:number; avg_score:number; diff_score:number; streak_days:number; longest_streak:number; unread_notifications:number; total_lessons_completed:number }
