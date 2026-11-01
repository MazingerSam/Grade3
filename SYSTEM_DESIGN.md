# 木新思達國小三年級數學互動教學網 - 系統架構與程式設計維護手冊 (SYSTEM_DESIGN.md)

本文件完整記錄「木新思達國小三年級上學期（3上）全冊 9 大單元互動學習網」的系統架構、前端元件邏輯、後端 API 設計、資料庫結構、業務流程圖以及未來升級擴充規範，供開發人員維護、升級與內容擴充使用。

---

## 目錄 (Table of Contents)
1. [專案概述與技術架構](#1-專案概述與技術架構)
2. [系統目錄結構與模組職責](#2-系統目錄結構與模組職責)
3. [核心功能業務流程設計](#3-核心功能業務流程設計)
   - 3.1 [學生與管理員身分認證流程 (Auth Flow)](#31-學生與管理員身分認證流程-auth-flow)
   - 3.2 [九大單元互動教具運作邏輯 (Interactive Modules)](#32-九大單元互動教具運作邏輯-interactive-modules)
   - 3.3 [線上測驗與自動批改流程 (Quiz & Grading Flow)](#33-線上測驗與自動批改流程-quiz--grading-flow)
   - 3.4 [管理員中心與全體學生成績歷程管理 (Admin Center)](#34-管理員中心與全體學生成績歷程管理-admin-center)
4. [資料庫綱要設計 (Cloudflare D1 Schema)](#4-資料庫綱要設計-cloudflare-d1-schema)
5. [後端 API 介面規格 (Pages Functions API Specs)](#5-後端-api-介面規格-pages-functions-api-specs)
6. [題庫結構與擴充指南 (Quiz Bank Extension)](#6-題庫結構與擴充指南-quiz-bank-extension)
7. [未來升級與維護指南 (Maintenance & Roadmap)](#7-未來升級與維護指南-maintenance--roadmap)

---

## 1. 專案概述與技術架構

### 1.1 專案目標
依據「木新思達國小三年級上學期」數學課程綱要，建置具備「高操作性、兒童友善介面、即時回饋」的單頁式（SPA）互動教學網。系統包含：
- **9 大核心教學單元**：全互動教具（拖拉、滑桿、切換、SVG 幾何即時運算）。
- **線上測驗中心**：全冊 9 單元 × 每單元 5 份卷（45 份卷，共 225 題），支援實名應試、自動批改與詳解展示。
- **身分驗證與授權機制**：整合 Google OAuth 與後台白名單，嚴格限制每組學生帳號限定登入單一年級（3上）。
- **學習歷程與錯題診斷**：作答成果自動入庫 Cloudflare D1，支援管理員總覽與全班成績匯出。

### 1.2 技術棧選型 (Tech Stack)

| 層級 | 技術選型 | 選擇理由與設計優勢 |
| :--- | :--- | :--- |
| **前端表現層** | 原生 HTML5 / CSS3 / Vanilla JS (ES6+) | 零打包依賴、極致加載速度（< 1s）、跨設備（iPad/平板/桌機）高相容性。 |
| **視覺互動與音效** | SVG / Canvas API / Web Audio API | 幾何圖形高精度向量渲染；無外部音訊檔案依賴，程式動態合成激勵音效。 |
| **雲端無伺服器架構** | Cloudflare Pages & Pages Functions | 全球 Edge CDN 分散式快取，秒級響應，內建 Serverless Functions API。 |
| **資料庫儲存層** | Cloudflare D1 (分散式 SQLite) | 支援標準 SQL，原生整合 Pages Functions，具備高可用性與交易安全性。 |
| **本地快取備援** | Web Storage API (localStorage) | 離線與網路冷啟動備援快取，保障弱網環境下依然能順暢教學。 |

---

## 2. 系統目錄結構與模組職責

```text
Grade3/
├── web/                           # 前端與 Cloudflare Pages 根目錄
│   ├── index.html                 # 單頁式教學網主體結構、導覽列與各單元視覺容器
│   ├── styles.css                 # 兒童友善配色系統、自適應卡片與按鈕樣式、動畫效果
│   ├── app.js                     # 9 大單元互動操弄核心邏輯、SVG/Canvas 渲染與 Web Audio
│   ├── quiz.js                    # 線上測驗中心引擎、45 份測驗卷題庫、批改評分與 CSV 匯出
│   ├── auth.js                    # 身分認證模組、Google OAuth、D1 白名單同步、管理員中心邏輯
│   ├── schema.sql                 # Cloudflare D1 資料庫結構定義腳本
│   ├── wrangler.toml              # Cloudflare Pages 與 D1 資料庫綁定設定檔
│   └── functions/                 # Cloudflare Pages Functions (Serverless 後端 API)
│       ├── _db.js                 # D1 資料庫存取適配器 (支援原生綁定與動態記憶體備援)
│       └── api/
│           ├── auth/
│           │   └── google.js      # Google OAuth JWT 憑證後端解析與白名單驗證
│           ├── admin/
│           │   └── users.js       # 管理員白名單增刪查改、學生成績總覽與錯題熱力圖 API
│           └── quiz/
│               └── record.js      # 測驗成績提交、歷程查詢與錯題庫寫入 API
├── 康軒版/ / 南一版/ / 翰林版/       # 課綱備課參考資源
├── SYSTEM_DESIGN.md               # [本文件] 系統架構與程式設計維護手冊
├── AGENTS.md                      # AI 代理工作規範與單元範疇清單
└── README.md                      # 專案首頁說明檔
```

---

## 3. 核心功能業務流程設計

### 3.1 學生與管理員身分認證流程 (Auth Flow)

系統採「實名 Google 帳號授權制」，每位學生帳號僅能存取單一年級（3上），並支援「雙軌登入驗證」：

```mermaid
flowchart TD
    A[使用者開啟網頁] --> B{檢查 localStorage 是否已登入?}
    B -- 是 --> C[更新右上角使用者狀態]
    B -- 否 --> D[彈出登入對話框]
    
    D --> E[方式一: 輸入已獲授權之 Gmail]
    D --> F[方式二: 點選 Google 官方登入按鈕]
    D --> G[管理員: 點選管理員快速登入 (Pipdapha)]

    E --> H[前端驗證帳號]
    F --> I[Google 彈出視窗並回傳 JWT] --> H

    H --> J{向 D1 查詢該帳號是否在白名單?}
    J -- 否 --> K[彈出「權限不足或未授權」視窗，拒絕進入]
    J -- 是 --> L{檢查帳號綁定年級}
    
    L -- 非 3上 且非 Admin --> M[彈出「年級不符」提示 (每組帳號限定單一年級)，拒絕進入]
    L -- 3上 或 Admin --> N[驗證通過!]
    
    N --> O[寫入 session 並更新姓名至 quizState]
    O --> P[重新渲染測驗區，標記當前應試帳號]
    O --> Q[解除彈窗，進入教材與測驗區]
    
    G --> R[直接賦予 Admin 身分，進入管理模式]
```

- **身分隔離原則**：登入時嚴格分離學生與管理員名稱。學生登入時自動以白名單姓名（或 Email 前綴，如 `sam0927x`）更新應試資料，徹底清除前次管理員快取，絕不發生帳號混淆。

---

### 3.2 九大單元互動教具運作邏輯 (Interactive Modules)

在 `web/app.js` 中實現了全冊 9 單元的專屬教學元件：

| 單元 | 模組名稱 | 關鍵技術與互動亮點 | 對應核心函數 |
| :--- | :--- | :--- | :--- |
| **U1** | 10000以內的數 | 錢幣與積木拖拉至定位板；滿十自動進位化聚；玉山/奇萊山定位板對齊比大小；青蛙跳整數數線。 | `renderU1Canvas()`, `addBlock()`, `resetU1Blocks()` |
| **U2** | 四位數的加減 | 橫式轉動態直式進位與跨 0 連退位拆解；飲食熱量滑桿與小思晚餐 600 大卡挑戰。 | `renderU2StepAddition()`, `renderU2Slider()` |
| **U3** | 毫米 (mm) | **1:1 實體比例虛擬直尺**（支援滑鼠/觸控拖拉與微調量測鉛筆微雕、變色龍）；紙帶重疊黏貼總長度動態運算。 | `initRulerDrag()`, `updateTapeOverlap()` |
| **U4** | 乘法 | 二/三位數乘以一位數直式（展開式 vs 簡便式）；**連乘兩步驟小思與小達差異化視覺圖示**；乘法估算。 | `renderU4Multiplication()`, `toggleU4Idea()` |
| **U5** | 角與形狀 | 扇子張開角滑桿（破除邊越長角越大迷思）；可旋轉三角板驗證小房子直角（頂端 90 度直角）；方格紙頂點拖拉。 | `renderFanAngle()`, `rotateSetSquare()` |
| **U6** | 面積 (cm²) | 平方公分板（點選塗色 1 格與 0.5 格半格湊整格）；內部完整格與外部包圍格不規則圖案夾擊估測。 | `toggleGridCell()`, `estimateIrregularArea()` |
| **U7** | 除法 | 萬聖節分裝平分模擬器；直式除法；「餘數一定要比除數小」剪彩帶診斷；天鵝船「商數要不要加 1」應用題。 | `simulateHalloweenDivide()`, `checkU7RemainderQuiz()` |
| **U8** | 公升和毫升 | **2000mL 動態倒水量杯模擬器**（液面動態上升、毫升與公升即時複名數轉換）；容量加減圖解。 | `pourIntoBeaker()`, `setBeakerVolume()` |
| **U9** | 分數 | 草莓蛋糕平分切片塗色（修正念法為「十分之幾」）；離散量一盒 10 個果凍分配；彩帶同分母分數比大小。 | `renderPieFraction()`, `setU9JellyPreset()` |

---

### 3.3 線上測驗與自動批改流程 (Quiz & Grading Flow)

`web/quiz.js` 涵蓋了 45 份測驗卷（每卷 5 題，每題 20 分，滿分 100 分）：

```mermaid
flowchart LR
    A[學生選取單元與卷別] --> B[載入題庫 QUIZ_BANK]
    B --> C[學生填寫作答]
    C --> D[點擊「交卷並自動批改給分」]
    D --> E[normalizeAnswer 答案標準化]
    E --> F[計算得分與答對題數]
    F --> G[收集錯題清單 wrongQuestions]
    G --> H[更新題目卡片顏色與展開訂正解析]
    H --> I[儲存至本機 localStorage 紀錄表]
    I --> J[發送非同步 POST /api/quiz/record]
    J --> K[(Cloudflare D1 資料庫)]
```

- **作答資料防竄改與關聯**：
  在送出測驗成績時，系統自動將 `email`、`studentName`、`studentClass`、`seatNum`、`unit`、`paperIdx`、`score` 及 `wrongQuestions` 一同寫入 D1 資料庫中的 `quiz_attempts` 與 `wrong_questions` 資料表。

---

### 3.4 管理員中心與全體學生成績歷程管理 (Admin Center)

點擊右上角「⚙️ 管理中心」，開啟系統管理員彈窗：
1. **Google OAuth Client ID 設定卡片**：管理員可隨時自訂更新正式的 Web Client ID。
2. **新增/指派帳號**：填寫 Gmail、姓名、身分（學生/管理員）、年級（3上/3下/全學年），點擊後同步寫入 D1 並快取至本地名單。
3. **全冊 9 單元錯題累計分佈**：圖表化呈現全體學生在各單元的錯題總數，作為加強練習之依據。
4. **🏆 各學生測驗成績與作答歷程總表**：
   - 包含「依學生帳號篩選」與「依單元篩選」。
   - 詳細呈現：作答時間、學生信箱、學生姓名、班級座號、單元卷別、得分（彩色分數膠囊）、答對與錯題數。
   - 提供「📥 匯出成績單 (CSV)」按鈕，一鍵下載 UTF-8 帶 BOM 的標準 Excel 格式報表。

---

## 4. 資料庫綱要設計 (Cloudflare D1 Schema)

檔案位置：[`web/schema.sql`](file:///c:/Users/sam09/OneDrive/文件/AiAgent/Grade3/web/schema.sql)

```sql
-- 1. 授權使用者名單 (白名單、年級限制、角色管理)
CREATE TABLE IF NOT EXISTS allowed_users (
    email TEXT PRIMARY KEY,
    name TEXT,
    role TEXT NOT NULL DEFAULT 'student', -- 'student' 或 'admin'
    grade TEXT NOT NULL DEFAULT '3上',     -- 帳號綁定年級，如 '3上'；admin 可為 'all'
    status TEXT NOT NULL DEFAULT 'active', -- 'active' (啟用), 'inactive' (停用)
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

-- 3. 錯題紀錄專表 (供日後補救練習與弱點分析)
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

-- 4. 預設全系統最高權限管理員
INSERT OR IGNORE INTO allowed_users (email, name, role, grade, status)
VALUES ('pipdapha@gmail.com', '系統管理員 (Pipdapha)', 'admin', 'all', 'active');
```

---

## 5. 後端 API 介面規格 (Pages Functions API Specs)

所有 API 端點皆位於 `web/functions/` 目錄下：

### 5.1 `/api/admin/users` (管理員核心 API)
- **GET**：取得白名單使用者清單、近期 50 筆測驗歷程 (`recentAttempts`)、各單元錯題累計 (`wrongSummary`)。
  - Header: `x-admin-email: <admin_email>`
  - Response: `{ success: true, users: [...], recentAttempts: [...], wrongSummary: [...] }`
- **POST**：新增或修改使用者（Email、姓名、角色、年級）。
  - Body: `{ email: string, name: string, role: string, grade: string, status: string }`
- **DELETE**：刪除指定使用者的存取權限。
  - Query: `?email=<target_email>`

### 5.2 `/api/quiz/record` (測驗成果與錯題紀錄 API)
- **POST**：提交測驗成果與錯題。
  - Body 格式：
    ```json
    {
      "email": "sam0927x@gmail.com",
      "studentName": "小思",
      "studentClass": "三年一班",
      "seatNum": "5",
      "grade": "3上",
      "unit": 1,
      "paperIdx": 0,
      "paperName": "第 1 卷：單元學前檢測卷",
      "score": 100,
      "correctCount": 5,
      "totalCount": 5,
      "wrongQuestions": []
    }
    ```
- **GET**：查詢個人近期 30 筆測驗紀錄與 50 筆待補救錯題清單。
  - Query: `?email=<user_email>`

---

## 6. 題庫結構與擴充指南 (Quiz Bank Extension)

題庫位於 [`web/quiz.js`](file:///c:/Users/sam09/OneDrive/文件/AiAgent/Grade3/web/quiz.js) 的 `QUIZ_BANK` 常數中。

### 6.1 題型規格定義
- **單選題 (`mc`)**：
  ```javascript
  {
    type: 'mc',
    q: '題目文字說明',
    options: ['選項A', '選項B', '選項C'],
    ans: '選項A', // 必須與 options 其中一項完全相符
    explain: '題目詳細訂正與解析'
  }
  ```
- **是非題 (`tf`)**：
  ```javascript
  {
    type: 'tf',
    q: '題目陳述',
    ans: 'O', // 'O' 或 'X'
    explain: '解析說明'
  }
  ```
- **大小比較題 (`cmp`)**：
  ```javascript
  {
    type: 'cmp',
    q: '比一比，請選擇 ＞、＜ 或 ＝：',
    left: '左側算式或數字',
    right: '右側算式或數字',
    ans: '>', // '>' | '<' | '='
    explain: '比大小解題關鍵'
  }
  ```
- **填空題 (`fill`)**：
  ```javascript
  {
    type: 'fill',
    q: '填充題目問題',
    ans: '3000', // 支援字串或數字
    unitLabel: '元', // 題目後方單位提示 (選填)
    explain: '解題步驟'
  }
  ```

### 6.2 新增或修改試卷步驟
1. 開啟 `web/quiz.js`。
2. 搜尋對應單元（例如 `// ================= 第 1 單元：10000以內的數 =================`）。
3. 陣列索引對應 5 份試卷：
   - 索引 0：第 1 卷（學前檢測卷）
   - 索引 1：第 2 卷（基礎能力練習卷）
   - 索引 2：第 3 卷（隨堂練習單）
   - 索引 3：第 4 卷（學後檢測卷）
   - 索引 4：第 5 卷（素養挑戰卷）
4. 直接替換題目的 `q`, `ans`, `explain` 即可，系統會自動在存檔後即時套用評分。

---

## 7. 未來升級與維護指南 (Maintenance & Roadmap)

### 7.1 本地開發與語法檢查
```bash
# 檢查 JavaScript 語法是否無誤
node --check web/app.js
node --check web/quiz.js
node --check web/auth.js
```

### 7.2 雲端部署最佳實踐 (Cloudflare Pages)
在 Windows 環境下，若遇到 Node.js v24 的 libuv 非同步斷言問題，可採用內建穩定執行期進行部署：
```cmd
set PATH=C:\Users\sam09\AppData\Local\OpenAI\Codex\runtimes\cua_node\fb8898c05a62885e\bin;%PATH%
cd /d C:\Users\sam09\OneDrive\文件\AiAgent\Grade3\web
npx wrangler pages deploy . --project-name kangxuan-grade3-math --branch main --commit-dirty=true
```

### 7.3 未來擴充藍圖建議
1. **單元擴充（三年級下學期 3下）**：
   - `web/app.js` 中新增 3 下單元（如「小數」、「重量 (kg/g)」、「時間」）。
   - 在 `adminDashboardModal` 與 `auth.js` 中擴充指定年級切換器，支援一位學生帳號平滑升級至 3 下。
2. **AI 個性化錯題家教**：
   - 利用 `wrong_questions` 資料表中收集的錯題，串接 Gemini API / Cloudflare Workers AI，為特定學生動態生成 3 題客製化補救練習卷。
3. **班級群組批量匯入**：
   - 在管理員中心增加「批次匯入學生名單 (Excel/CSV)」功能，支援一鍵匯入全班 30 位學生之 Google 帳號與座號。

---

*本文件最後更新日期：2026 年 10 月 10 日*
*維護者：木新思達教學研發團隊*
