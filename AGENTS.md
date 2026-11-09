# AGENTS.md - 專案規範與 Agent 指引 (Project Guidelines for AI Agents)

本文件記錄 Grade4 專案的開發規範與 AI Agent 的作業流程。

## 1. 專案工作流程 SOP (Workflow Guidelines)

### 開工流程 (Start of Work)
1. 執行 `git status` 檢查當前工作區狀態。
2. 確認本次要執行的目標與需求。
3. 確認開發環境與工具狀態。

### 開發規範 (Coding Standards)
- **繁體中文說明**: 所有回應與文檔說明應優先使用繁體中文。
- **檔案連結格式**: 在對話與文件中引用檔案時，使用 clickable file links，例如 `[README.md](file:///c:/Users/sam09/OneDrive/文件/AiAgent/Grade4/README.md)`。
- **教材互動化標準**: 開發或擴充任何新備課教材之數學單元與互動網頁時，必須遵循 [making_math_interaction.md](file:///c:/Users/sam09/OneDrive/文件/AiAgent/Grade4/making_math_interaction.md) 技能指引（包含仿三年級卡片架構、CPA 原則、無 inline display:none 避坑規範、全套5卷測驗題庫與快取版本控管）。
- **程式碼品質**: 確保程式碼清潔、保持極佳的閱讀性與維護性。

### 收工流程 (End of Work)
1. 執行驗證與建置/測試，確保無語法或破壞性變更。
2. 清理臨時產出檔案。
3. 執行 `git add .` 並提交符合規範的 Commit Message (`git commit -m "<說明>"`).
4. 更新相應文檔 (如 [README.md](file:///c:/Users/sam09/OneDrive/文件/AiAgent/Grade4/README.md)) 並向使用者回報進度。
