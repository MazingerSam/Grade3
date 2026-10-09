-- 木新思達國小數學互動網 D1 資料庫結構
-- 1. 授權使用者名單 (白名單、年級限制、角色管理)
CREATE TABLE IF NOT EXISTS allowed_users (
    email TEXT PRIMARY KEY,
    name TEXT,
    role TEXT NOT NULL DEFAULT 'student', -- 'student' 或 'admin'
    grade TEXT NOT NULL DEFAULT '3上',     -- 帳號綁定年級，如 '3上'；admin 可為 'all'
    status TEXT NOT NULL DEFAULT 'active', -- 'active', 'disabled'
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 2. 測驗成果與作答紀錄
CREATE TABLE IF NOT EXISTS quiz_attempts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT NOT NULL,
    student_name TEXT,
    student_class TEXT,
    seat_num TEXT,
    grade TEXT NOT NULL DEFAULT '3上',
    unit INTEGER NOT NULL,
    paper_idx INTEGER NOT NULL,
    paper_name TEXT,
    score INTEGER NOT NULL,
    correct_count INTEGER NOT NULL,
    total_count INTEGER NOT NULL DEFAULT 5,
    wrong_count INTEGER NOT NULL DEFAULT 0,
    time_spent_sec INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(email) REFERENCES allowed_users(email)
);

-- 3. 錯題紀錄專表 (記錄題目內容、學生錯誤答案、正確答案、單元，以供日後診斷與補救練習)
CREATE TABLE IF NOT EXISTS wrong_questions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    attempt_id INTEGER NOT NULL,
    email TEXT NOT NULL,
    grade TEXT NOT NULL DEFAULT '3上',
    unit INTEGER NOT NULL,
    paper_idx INTEGER NOT NULL,
    question_idx INTEGER NOT NULL,
    question_text TEXT NOT NULL,
    user_answer TEXT,
    correct_answer TEXT NOT NULL,
    explanation TEXT,
    review_status TEXT DEFAULT 'pending', -- 'pending' (待複習), 'mastered' (已掌握)
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(attempt_id) REFERENCES quiz_attempts(id)
);

-- 4. 預設管理員帳號 (您的帳號)
INSERT OR IGNORE INTO allowed_users (email, name, role, grade, status)
VALUES ('pipdapha@gmail.com', '系統管理員', 'admin', 'all', 'active');
