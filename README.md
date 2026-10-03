# 🔬 Notion Lab Widgets (實驗室 Notion 智慧嵌入小工具)

[English] | [繁體中文]

這是一套專為**化學與食品分析實驗室**設計的 Notion 網頁小工具 (Notion Embed Widgets)。本專案完全開源，旨在提升實驗室日常管理、分析工作，以及評鑑稽核準備的數字化協作效率。

本套工具支援**「本機 LocalStorage 離線模式」**與**「Google Sheets (GAS) 雲端即時同步模式」**，不論您是個人單機使用，還是想與整個實驗室團隊「跨電腦、跨手機即時同步」狀態，皆能輕鬆應對。

---

## 🌟 核心小工具介紹

### 1. 🧪 溶液配製與稀釋助手 (`solution-calculator.html`)
專為分析化學調配標準品設計的計算器：
* **標準品配製濃度計算 (固體)**：由於標準品粉末稱重非常微量且精確度極高（多在 10 mg 左右），本工具支援「秤重後反算濃度」。輸入**實際稱重重量 (mg)**、**定量體積 (mL)**，並自動代入來自 COA（檢驗報告書）的**標準品純度 (%)**。
* **成鹽/結晶水分子量校正**：新增目標物與藥品的分子量欄位，自動計算係數 $F = \frac{\text{MW}_{\text{free}}}{\text{MW}_{\text{salt}}}$。若無成鹽校正，分子量欄位留空即可。
* **反算濃度公式**：$C\text{ (ppm)} = \frac{W\text{ (mg)} \times (\text{Purity} / 100) \times F}{V\text{ (mL)} / 1000} = \frac{W \times \text{Purity} \times F \times 10}{V}$

### 2. 🖥️ 儀器運作狀態看板 (`instrument-status.html`)
分析儀器室的即時狀態中樞：
* 可追蹤 LC-MS/MS (新55)、QTRAP2、Orbitrap QE 等分析機台運作與預約狀態。
* **雲端即時同步**：支援串接 Google Sheet (GAS) 雲端資料庫。
* 狀態燈號支援：`運作正常` 🟢、`預約/維護` 🟡、`硬體異常` 🔴。
* 支援管理介面：可動態**新增、刪除儀器**，並可隨時**編輯修改名稱、使用者與狀態備註**（雙擊/點擊兩下按鈕以確認刪除，避免 Notion 沙盒阻擋）。

### 3. ⏰ 評鑑與認證倒數計時器 (`audit-countdown.html`)
* 倒數追蹤重要里程碑（如：TFDA 實地查核、能力試驗、內稽）。
* **雲端即時同步**：支援串接 Google Sheet (GAS) 雲端資料庫。
* 支援管理與排序介面：可修改各里程碑的名稱、目標日期，或將項目刪除。提供 **▲ 上移** 與 **▼ 下移** 排序功能。

### 4. 🔬 COA 檢驗報告書 AI 智慧辨識中心 (`coa-parser.html`)
專為原料驗收與標準品檢驗設計的輕量純前端 AI 提取工具：
* **BYOK 自帶金鑰**：支援同仁各自輸入免費 Gemini API Key，本地加密儲存於各瀏覽器，互不干擾、零資安外洩疑慮。
* **PDF 與 JPG 全格式批次匯入**：支援拖曳多份電子版 PDF、紙本掃描 JPG/PNG，提供佇列清單依序批次處理。
* **手機現場拍照即驗**：支援 RWD 響應式佈局與後置相機直拍 (`capture="environment"`)，倉庫現場開箱即拍即驗。
* **電腦端接力與替換 PDF**：現場拍照記錄後，可回辦公室電腦點擊「替換正式 PDF」更新高清電子原檔。
* **雙模式結果匯出**：
  - **📥 下載 CSV**：內建 UTF-8 BOM，在 Windows Excel 點開繁體中文 100% 正常不亂碼。
  - **📋 複製為 Notion 格式**：一鍵複製 TSV/Markdown，直接至 Notion Database 或筆記按 `Ctrl+V` 即自動對齊填入！

---

## ☁️ 雲端即時同步部署指南 (Google Sheets GAS)

若您希望與同組同事「跨電腦、跨手機即時看到相同的儀器與里程碑狀態」，請遵循以下步驟串接您的 Google 試算表：

### 步驟 1：準備 Google 試算表
1. 建立或開啟您的 Google 試算表：
   * 儀器看板試算表：[點此參考/使用您的試算表](https://docs.google.com/spreadsheets/d/1A6JdygFF3LCz99jHlSEXh4AyEv_i9hdZLDpMEF3bJRM/edit)
   * 倒數計時試算表：[點此參考/使用您的試算表](https://docs.google.com/spreadsheets/d/14KAfUTW1q5ITpndMOZ5V2wYY4qooncwnyf5yZNzA6sc/edit)
2. 在試算表的第一行（Row 1）手動填寫欄位標題（注意：必須完全符合大小寫）：
   * 儀器看板：`id` | `name` | `status` | `user` | `note`
   * 倒數計時：`id` | `title` | `targetDate` | `startDate`

### 步驟 2：貼上並部署 Apps Script
1. 在試算表選單中點選 **擴充功能 (Extensions)** > **Apps Script**。
2. 將本專案對應的 `.gs` 程式碼貼入編輯器中：
   * 儀器看板程式碼：[gas/instrument-status-gas.gs](gas/instrument-status-gas.gs)
   * 倒數計時程式碼：[gas/audit-countdown-gas.gs](gas/audit-countdown-gas.gs)
3. 點選右上角的 **部署 (Deploy)** > **新增部署 (New deployment)**。
4. 點選左上角齒輪，選擇 **網頁應用程式 (Web app)**。
5. 設定如下：
   * **執行身份 (Execute as)**：選擇 **我 (Me)**
   * **誰有權生存取權 (Who has access)**：選擇 **任何人 (Anyone)**
6. 點選 **部署**，並授權您的 Google 帳戶權限。
7. 複製產生的 **網頁應用程式網址 (Web app URL)**。

### 步驟 3：在小工具 UI 中啟用同步
1. 以瀏覽器開啟小工具網頁，或於 Notion 嵌入中，點擊標頭的 **`☁️ 本機模式`** 按鈕，這會展開「雲端同步設定」面板。
2. 將剛才複製的 **GAS 網頁應用程式網址** 貼入輸入框中，點擊 **儲存**。
3. 標頭的狀態會變更為 `🟢 雲端同步`，此後不論是新增、刪除、排序、還是編輯狀態，資料都會自動同步到您的 Google 試算表中！同組同仁只需在他們的瀏覽器進行相同設定，即可即時共用相同的看板狀態。

---

## 🚀 Notion 嵌入指南

1. **部署靜態檔案**：將此專案推送到 GitHub 並開啟 **GitHub Pages** 服務（詳見 settings > Pages）。
2. **在 Notion 中嵌入**：在 Notion 頁面輸入 `/embed`，並將您的 GitHub Pages 連結（例如 `https://<您的帳號>.github.io/notion-lab-widgets/widgets/instrument-status.html`）填入完成嵌入。
3. **手機版自適應優化建議**：
   * 手機版螢幕較窄，請**避免將小工具在 Notion 中以左右雙欄 (columns) 併排**，應改為垂直上下堆疊。
   * Notion Embed block 預設高度較矮，請在 Notion 編輯模式下**拉曳區塊底部的黑色把手將其高度拉高**（建議拉至約 350px-400px），即可完整顯示，避免滾動條產生。

---

## 📂 專案檔案結構

```text
notion-lab-widgets/
├── widgets/
│   ├── solution-calculator.html  # 溶液配製與稀釋計算器
│   ├── instrument-status.html    # 儀器運作狀態看板
│   ├── audit-countdown.html      # 評鑑與認證倒數計時器
│   └── coa-parser.html           # COA 檢驗報告書 AI 智慧辨識中心 (BYOK/CSV)
├── gas/
│   ├── instrument-status-gas.gs  # 儀器狀態看板 GAS 程式碼
│   └── audit-countdown-gas.gs    # 里程碑倒數 GAS 程式碼
├── .agents/
│   └── AGENTS.md                 # 專案特定 AI 開發規則與踩坑筆記
├── DEVELOPMENT_GUIDE.md          # 開發者與部署整合指南
├── .gitignore                    # Git 忽略設定
├── LICENSE                       # MIT 開源授權協議
└── README.md                     # 本說明文件
```

---

## ⚖️ 開源授權 (License)

本專案採用 **MIT License** 授權。詳見 [LICENSE](LICENSE) 檔案。
