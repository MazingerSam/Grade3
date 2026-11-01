---
name: elementary-math-interactive-curriculum
description: >-
  用於設計、開發、升級與維護國小各年級（1~6年級，如 3上、3下、4上等）數學高互動教學樂園、SVG/Canvas 幾何與位值操作教具、線上測驗卷自動批改評分系統、Google OAuth 實名授權白名單與 Cloudflare Pages/D1 雲端後台發布。
---

# 國小數學高互動教學系統與線上評量雲端架構技能 (Elementary Math Interactive Curriculum Skill)

本技能匯聚「木新思達國小三年級上學期數學互動教學網」的完整實踐經驗，提供 AI 代理在面對國小數學（K-6 各年級學期）教材互動化、數位教具開發、自動批改評量與雲端學習歷程建置時的權威指引與標準作業程序 (SOP)。

---

## 1. 核心設計原則 (Core Design Principles)

1. **具體到抽象（CPA 教學法）**：
   - **Concrete（具體實物操弄）**：優先採用拖拉積木、錢幣、量杯倒水、切蛋糕、滑桿旋轉三角板等可動態操作之教具。
   - **Pictorial（圖像化表徵）**：陣列圖、線段倍數圖、平方公分方格網、數線跳躍。
   - **Abstract（符號化抽象）**：對照直式直覺拆解（展開式 ➔ 簡便式）、算式記錄、分數符號。
2. **兒童友善介面（Child-Friendly UI）**：
   - 大字體、高對比、溫暖圓角卡片（`border-radius: 14px~18px`）。
   - 即時正向回饋：Web Audio API 動態頻率合成音效（答對勝利和弦、交卷星號獎勵特效、答錯溫和提示），不使用外部音效檔案以確保秒開。
   - 台灣教育部課綱規範用詞校正：例如分數念法嚴格為「十分之幾」（避免一十分之幾）、題目人名以「小思」、「小達」等親切情境呈現。
3. **無框架極速加載（Zero-Dependency Performance）**：
   - 採用原生 Vanilla JS (ES6+)、HTML5 與 CSS3，不引入肥大的前端框架，全站加載時間 < 1 秒。
   - 幾何與向量視覺化使用原生 SVG 與 HTML5 Canvas，保證在 iPad、觸控大螢幕與桌機皆 1:1 精準顯示。

---

## 2. 九類高頻數學教具開發範式 (Interactive Manipulative Patterns)

在開發或擴充新單元教具時，請依循下列經過驗證的開發模式：

### 2.1 位值積木與錢幣合成台 (Place Value & Regrouping)
- **應用單元**：萬以內數、十萬以內數、小數
- **實作關鍵**：
  - 定位板劃分「千位、百位、十位、個位」。
  - 支援點選/拖拉加入千格積木、百格板、十格橘條、單顆積木（或 1000/100/10/1 元錢幣）。
  - **滿十進位機制**：提供「滿十自動換錢/化聚」按鈕，即時將 10 個一換成 1 個十，並自動轉換為國字讀法（如「三千零五」）。

### 2.2 動態直式進退位拆解機 (Dynamic Vertical Arithmetic)
- **應用單元**：多位數加減法、乘法、除法
- **實作關鍵**：
  - 逐步演示（Step-by-step）：點選「下一步」逐步引導個位相加/相減、十位進退位。
  - 跨 0 連續退位（如 `500 - 247`、`6000 - 2685`）：以紅色劃線與上方小數字動態標註借位歷程。

### 2.3 1:1 實體比例虛擬直尺與量測 (Virtual Ruler & Measurement)
- **應用單元**：公釐 (mm)、公分 (cm)、公尺 (m)
- **實作關鍵**：
  - SVG 向量精確刻度：每 1mm 一細線、每 5mm 一中線、每 10mm (1cm) 一粗線並標數字。
  - 支援 Pointer Events 拖拉直尺覆蓋於物體上方實測。
  - 紙帶重疊動態算則：滑桿調整兩條紙帶重疊長度，即時運算「總長 ＝ 紙帶A ＋ 紙帶B － 重疊部分」。

### 2.4 倍數線段圖與面積陣列 (Multiplication & Division Array)
- **應用單元**：乘法、除法、分數乘法
- **實作關鍵**：
  - 差異化思維視覺對照：在連乘兩步驟（例如 `(6×4)×2` vs `6×(4×2)`），必須提供**兩種不同的圖像分解**，避免使用同一張圖導致學生無法想像差異。
  - 乘法直式展開式（分步顯示每位相乘積）與簡便直式切換。

### 2.5 角度滑桿與旋轉三角板 (Angles & Geometry Shapes)
- **應用單元**：角、直角、三角形、四邊形
- **實作關鍵**：
  - 扇子張開角滑桿：具備「張開角度」、「邊長」、「旋轉角度」3 條獨立滑桿，破解「邊越長角越大」的典型迷思。
  - 透明三角板比對：可拖拉並旋轉三角板，其直角 `∟` 可吸附至幾何圖形頂點（如小房子屋頂 90 度直角）進行驗證。
  - 方格紙動態頂點：在點陣方格紙上拖拉 4 個頂點，即時檢驗「四邊等長」與「四個直角」是否成立。

### 2.6 平方公分板與不規則面積估測 (Area Grid & Estimation)
- **應用單元**：面積 (cm²)、平方公尺
- **實作關鍵**：
  - 格點點選畫布：支援點擊切換「整格 (1 cm²)」與「半格 (0.5 cm²)」，邏輯自動將每 2 個半格湊成 1 個整格計算總面積。
  - 不規則圖案（如樹葉、手掌）：提供「內部完整方格」與「外部包圍方格」雙層切換，視覺化「夾擊估測範圍（如 12 ~ 30 cm²）」。

### 2.7 餘數分裝模擬器 (Division & Remainder)
- **應用單元**：除法、因數倍數
- **實作關鍵**：
  - 實物分盤視覺化：拉動滑桿調整被除數與除數，畫面即時將糖果分裝到盤子中，剩餘的糖果落在盤外（餘數）。
  - 「餘數一定要比除數小」迷思診斷：設計情境題（如剪彩帶 `34÷8`），標記錯誤解法的漏洞。
  - 「商數加 1」應用題情境判斷（如搭船需不需要多租一艘）。

### 2.8 動態液面量杯模擬器 (Capacity: Liter & Milliliter)
- **應用單元**：公升與毫升、容量計算
- **實作關鍵**：
  - SVG 2000mL 雙刻度量杯（每 100mL 一大格、每 20mL 一小格）。
  - 點選各容量日常容器（10mL 漱口水、375mL 鮮奶、1000mL 水瓶）倒入量杯，液面平滑上升（CSS transition）。
  - 單名數（1200 mL）與複名數（1 公升 200 毫升）雙向即時化聚對照。

### 2.9 分數圓形切片塗色與彩帶比大小 (Fractions)
- **應用單元**：分數、同分母加減
- **實作關鍵**：
  - SVG 圓形切片平分器：滑桿選取分母（2~12等分），點擊扇區塗色，即時顯示 `n/d 個蛋糕`。
  - 離散量情境：一盒 10 個果凍，點擊分配給不同學生，標記各自占幾分之幾盒。
  - 1 公尺彩帶比大小：視覺化長度條比對同分母分數大小。

---

## 3. 45 份線上測驗卷引擎規範 (Quiz & Assessment Engine)

每單元規劃 **5 份測驗卷**（全冊 9 單元共 45 份卷，每卷 5 題，滿分 100 分）：
1. **第 1 卷：單元學前檢測卷**（舊經驗診斷）
2. **第 2 卷：基礎能力練習卷**（核心概念精熟）
3. **第 3 卷：隨堂練習單**（課堂經典題）
4. **第 4 卷：單元學後檢測卷**（單元綜合評量）
5. **第 5 卷：數學素養與資優挑戰卷**（生活情境與加深題）

### 3.1 題型 JSON 格式標準
題庫定義於 `quiz.js` 的 `QUIZ_BANK[unitIdx][paperIdx]` 中：
```javascript
// 1. 單選題
{ type: 'mc', q: '題目說明', options: ['選項A', '選項B', '選項C'], ans: '選項A', explain: '解析說明' }

// 2. 是非題
{ type: 'tf', q: '題目陳述', ans: 'O', explain: '解析說明' } // ans 為 'O' 或 'X'

// 3. 比大小題
{ type: 'cmp', q: '比一比，請選擇 ＞、＜ 或 ＝：', left: '6/7', right: '5/7', ans: '>', explain: '解析' }

// 4. 填空題
{ type: 'fill', q: '題目說明', ans: '3000', unitLabel: '元', explain: '解析' }
```

### 3.2 作答答案標準化 (Normalization)
批改時必須將全形數字轉換為半形，並濾除頭尾空白：
```javascript
function normalizeAnswer(str) {
  if (str === undefined || str === null) return '';
  return String(str)
    .trim()
    .replace(/[０-９]/g, s => String.fromCharCode(s.charCodeAt(0) - 0xFEE0))
    .replace(/\s+/g, '');
}
```

---

## 4. 身分驗證與年級授權架構 (Auth & Grade Restriction)

### 4.1 雙軌登入驗證設計
- **軌道 1（學生免阻擋直接登入）**：輸入老師已授權的 Gmail（如 `sam0927x@gmail.com`），點擊「驗證進入」，系統比對後台名單無誤後即刻登入。免受 Google 401 憑證審核未通過影響。
- **軌道 2（Google 官方 OAuth 一鍵登入）**：點擊 Google Sign-In 按鈕，前端取得 JWT 後解碼比對白名單。後台提供自訂 Client ID 填寫介面。

### 4.2 單一年級限制防護 (Single Grade Enforcement)
- 每組學生帳號限定登入一個年級（例如目前系統為 `3上`）。
- 登入時檢查 `user.grade === '3上' || user.role === 'admin'`；若不符則彈出友好提示阻擋進入。

### 4.3 帳號身分隔離（防止管理員與學生混淆）
- 學生登入時，強制將應試姓名重設為該學生姓名（或 Email 帳號前綴），絕不沿用先前管理員快取。
- 測驗卷上方明確標記：`🧑‍🎓 目前應試帳號：✉️ xxx@gmail.com ｜ 🎓 3上 正式應試中`。
- 登出時徹底清空 `localStorage` 內之姓名與作答身分。

---

## 5. 雲端後台與資料庫架構 (Cloudflare Pages + Functions + D1)

### 5.1 Cloudflare D1 資料庫結構
- `allowed_users`：白名單（email, name, role, grade, status）。
- `quiz_attempts`：作答成績歷程（email, student_name, student_class, seat_num, unit, paper_name, score, correct_count, wrong_count）。
- `wrong_questions`：錯題庫（attempt_id, email, unit, question_idx, question_text, user_answer, correct_answer, explanation）。

### 5.2 管理員中心功能規範
1. **白名單管理**：填寫 Gmail、姓名、身分、年級，一鍵授權儲存（支援即時雙軌同步）。
2. **全冊錯題熱力圖**：顯示第 1~9 單元的累積錯題數。
3. **各學生測驗成績與作答歷程總表**：
   - 支援「依學生帳號篩選」與「依單元篩選」。
   - 彩色分數徽章（滿分 100 🥇、80分藍色、60分橘色、不及格紅色）。
   - 「📥 匯出成績單 (CSV)」：匯出包含 BOM 的 Excel 相容報表。

### 5.3 Windows 環境 Cloudflare Pages 部署避坑指引
若在 Windows Node 24 環境遇到 `!(handle->flags & UV_HANDLE_CLOSING)` 之 libuv 斷言中斷：
- 使用穩定的 Node 執行期路徑（例如透過 `cmd /c "set PATH=...;%PATH% && npx wrangler pages deploy . --project-name <project> --branch main --commit-dirty=true"`）執行發布。

---

## 6. 新單元或新學期擴充 SOP (Extension Playbook)

當需要擴充「三年級下學期 (3下)」或「四年級」教材時：
1. **定義單元主題與教具需求**：確認新單元核心數學概念，套用本技能第 2 節所列的教具模式。
2. **在 `index.html` 新增單元區塊**：在 `<main>` 內加入 `<section id="unitX" class="unit-section">`，並在導覽列加入錨點按鈕。
3. **在 `app.js` 撰寫教具互動函數**：使用 SVG/Canvas 與 Pointer Events 實作可操弄元件。
4. **在 `quiz.js` 的 `QUIZ_BANK` 追加 5 份試卷**：依據第 3 節標準 JSON 格式編寫題目。
5. **在 `auth.js` 擴充年級選項**：在後台年級選單加入新學期選項（如 `3下`），並於身分比對放行該年級學生。
6. **執行驗證與發布**：
   ```cmd
   node --check web/app.js; node --check web/quiz.js; node --check web/auth.js
   npx wrangler pages deploy . --project-name <專案名稱> --branch main --commit-dirty=true
   ```
