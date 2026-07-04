# Notion Widgets 專案 - AI 助理開發與防坑指南

本文件定義了 `Notion-Html` 專案特定的設計限制、瀏覽器沙盒地雷與 UI 排版原則。

---

## 🛠️ 1. 技術棧與架構

- **核心技術**：HTML5, Vanilla CSS (極致深色與自適應主題), Vanilla JS。
- **儲存機制**：本機 `localStorage` 離線快取 + Google Sheets (GAS) 雲端 API 自動同步。
- **部署方式**：GitHub Pages 靜態代碼發布。

---

## 🚫 2. Notion 嵌入專案專屬地雷 (AI 必須遵循的防線)

### A. 嚴禁使用原生對話框 (`confirm()`, `alert()`, `prompt()`)
* **地雷原因**：Notion 嵌入區塊（Embed block）是在沙盒 `<iframe>` 中渲染的。基於瀏覽器安全政策，沙盒 iframe 會完全阻擋並忽視 native modal popups。如果調用 `confirm()`，會直接拋出錯誤並導致後續的刪除、還原等邏輯完全中斷。
* **開發規則**：必須使用**網頁內置的 HTML 二次確認按鈕**。例如：點選「🗑️ 刪除」時，將按鈕轉為紅色的 `⚠️ 確定刪除?`，再次點選時才執行實際動作。

### B. LocalStorage 異常捕獲 (Null Origin 沙盒防禦)
* **地雷原因**：當使用者直接在 Notion 中以「上傳 HTML 檔案附件」的方式嵌入小工具時，瀏覽器會給予 `null` origin 安全域，這會導致直接讀寫 `localStorage` 拋出 `SecurityError` 崩潰。
* **開發規則**：所有讀寫 `localStorage` 的動作必須用 `try-catch` 包裹。如果寫入失敗，必須自動回退至**記憶體暫存模式 (In-memory Array)**，確保頁面不會崩潰，且在目前對話階段仍能正常操作。

### C. 響應式嵌入尺寸限制
* **地雷原因**：Notion 嵌入區塊的寬度由使用者拖曳決定，在手機版上寬度甚至可能小於 180px。如果對 `body` 進行 `min-height: 100vh` 或 Flex 垂直置中，內容會被 iframe 強制裁切，導致手機上看不到。
* **開發規則**：
  1. `body` 必須設置為 `background-color: transparent; padding: 4px; display: block;`，背景透明以融入 Notion 主題。
  2. 卡片與容器寬度必須為 `width: 100%; max-width: 100%;`，標頭與按鈕組使用 `flex-wrap: wrap` 允許在手機窄版下自動換行。
