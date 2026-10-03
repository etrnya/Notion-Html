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

### 4. 🔬 COA 檢驗報告書 AI 輔助查核工具 (`coa-parser.html` V2.0)
專為原料驗收與標準品檢驗設計的**「證據導向」**人機協同查核工具（非單純代填表格，而是高可靠度查核輔助）：
* **📄 原文證據鏈 (Evidence & Source Page)**：AI 不僅提取標準品數值，每個核心欄位（廠牌、品名、CAS、批號、純度、效期、規格等）皆標註 COA 原始文字引用與出處頁碼（如 `📄 原文：Assay: 99.8% (P.1)`），大幅降低比對時間。
* **⚖️ 剝奪 AI 越權判定，落實品保責任邊界**：AI 僅能提供客觀事實與 `ai_suggestion`（例如：待覆核 Review）；系統初始判定強制為 `⚪ 尚未查核 (UNREVIEWED)`，最終合格與否 100% 由品保查核員核對並勾選「我已完成比對左側文件原文並確認上述數據無誤」產生簽核時間戳。
* **✏️ AI 原值 vs 人工值分離與審計軌跡 (Audit Trail)**：人工修正任何欄位皆即時標註 `✏️ 已手動修正`，保留 AI 原始辨識值，自動彙整為修正軌跡（如 `purity: AI[99.8%]→人工[99.5%]`），為後續 AI 辨識錯誤資料集分析提供珍貴資產。
* **🛡️ BYOK 本機隔離與明確資安邊界**：金鑰儲存在使用者個人瀏覽器的 `LocalStorage`，無任何中繼伺服器；提供「🗑️ 清除金鑰」按鈕，並於加入佇列時進行 25MB 檔案大小安全門禁。
* **⚡ 退避重試與抗抖動 (Exponential Backoff + Jitter)**：批次或單檔遇到 Google 伺服器 503/429 流量高峰時，自動以指數遞增與隨機延遲進行穩健重試，徹底防止多端同時重試造成的流量風暴。
* **PDF 與 JPG 全格式批次匯入**：支援拖曳多份電子版 PDF、紙本掃描 JPG/PNG，循序佇列避免超速。
* **360 度上下左右無死角平移與視野置中**：內建繪圖級 Transform 增量畫布平移引擎，滑鼠左鍵按住拖曳可隨心所欲上下左右移動視野，並附「↺ 視野置中」一鍵歸位。
* **雙模式結果匯出與 Notion 專用剪貼簿**：
  - **📥 下載 CSV**：內建 UTF-8 BOM，欄位包含品保判定、核簽狀態、CAS/純度原文證據與修訂軌跡，在 Windows Excel 點開繁體中文 100% 正常不亂碼。
  - **📋 複製為 Notion 格式 (雙 MIME 支援)**：同時寫入標準 HTML Table 與 TSV，在 Notion 頁面或資料庫任意空白處按 `Ctrl+V`，**100% 自動依照欄位精準填入**！

---

## 🛡️ 資安風險檢查與隱私保護說明

1. **金鑰存放安全性 (BYOK 本機隔離)**：
   - 您的 Gemini API Key 儲存於當前瀏覽器的 `LocalStorage`（明文快取，方便下次開啟免重填）。
   - 所有 API 請求皆由瀏覽器**直接加密（HTTPS）傳送至 Google 官方端點**（`generativelanguage.googleapis.com`）。
   - **完全沒有任何第三方中繼後端**，作者或外部人員絕對無法接觸您的 API 金鑰。
   - 提供「🗑️ 清除金鑰」按鈕，若在公用電腦或評鑑場合使用，可於使用完畢後一鍵清除。
2. **COA 檢驗報告隱私與資料政策**：
   - **文件處理流程**：文件於瀏覽器端進行本機預覽（PDF.js）；辨識時，文件內容會以 Base64 格式直接傳送至使用者選定的 Google Gemini API 端點，完全不經過本專案的任何伺服器。
   - **Google 免費用戶 (Free Tier)**：依據 Google 官方服務條款，免費用戶之輸入內容可能會由 Google 人工抽檢用於訓練與改進模型。
   - **Google 付費用戶 (Pay-as-you-go)**：若綁定信用卡啟用付費帳號，Google 明確承諾**不會**將您的 Prompt 與文件用於模型訓練，商用機密性最高。
   - *公部門與實驗室建議*：若處理極度機密、涉及專利或保密協定 (NDA) 之 COA，建議綁定付費帳號調用，或遮蔽機密專利代碼後再進行解析。
3. **雲端試算表 (GAS) 權限邊界**：
   - `instrument-status` 與 `audit-countdown` 使用 Google Apps Script 同步，部署為「任何人皆可存取」。只要知道 GAS 網址的人即可讀寫該表。
   - *建議事項*：請妥善保管您的 GAS 部署網址，勿將私人 GAS 網址公開至公開討論區；內部企業亦可限制為僅限機構內部帳號存取。

---

## 💰 AI 模型計費與成本效益分析

許多同仁常擔心：「使用最新的 Gemini Flash 模型進行辨識會不會很貴？」
**答案是：極度便宜，甚至一般實驗室日常使用「完全免費」！**

| 方案類型 | 費率說明 | 每日/每月額度 | 換算一份 COA 成本 |
| :--- | :--- | :--- | :--- |
| **免費方案 (Free Tier)** | **$0 元 (完全免費)** | 每日最高 **1,000 ~ 1,500 次請求**、15 RPM | **$0 NTD (完全免費)** |
| **付費方案 (Pay-as-you-go)** | Flash 每百萬 Token 僅約 $0.075 ~ $0.10 美元 | 無硬性每日次數上限 | 約 **$0.003 ~ $0.01 NTD** (新台幣不到 1 分錢！) |

> 💡 **試算**：一份 1~2 頁的標準品 COA PDF 大約消耗 1,200 ~ 2,500 Tokens。在付費方案下，**辨識 100 ~ 300 份 COA 僅需新台幣約 1 元**！相較於 GPT-4o（每份約 0.2 ~ 0.5 元），成本節省達 95% 以上。

---

## ⚡ 批次辨識穩定性與防塞車指引

當一次放入多份（例如 5~20 份）PDF 批次辨識時，請注意以下最佳實踐：
1. **為什麼偶爾會出現 503 (High Demand)？**
   - 這是 Google 當前全球伺服器偶發的流量高峰排隊機制，**並非您的檔案有誤或額度耗盡**。
   - 本工具內建**指數退避自動重試機制**，若連線失敗，點擊佇列中的檔案即可「⚡ 立即重新辨識此檔案」，無須整批重傳。
2. **循序佇列 (Sequential Queue) 機制**：
   - 本工具採用循序佇列設計（辨識完一份間隔 1.8 秒再辨識下一份），此間隔經過精密調校，能完美符合 Google 免費用戶每分鐘 15 RPM 的頻率限制，防止觸發 HTTP 429 速率封鎖。
3. **建議處理量**：
   - 建議單次批次放入 **5 ~ 15 份** 為最佳體驗區間；若有上百份需求，建議分批（每批 10~15 份）放入處理，以確保記憶體與網路傳輸順暢。

---

## 📋 Notion 表格貼入教學

複製出來的資料無法對齊 Notion 欄位？請依照以下兩種方式操作：
* **方法 A：貼在 Notion 空白頁面（最推薦）**
  1. 點擊本工具的 **「📋 複製當前 (Notion 表格)」** 或 **「📋 複製全部 (Notion 表格)」**。
  2. 到 Notion 頁面的空白行，直接按下鍵盤 **`Ctrl + V`**（Mac 為 `Cmd + V`）。
  3. Notion 會自動辨識為標準表格，所有 11 個欄位（廠牌、品名、CAS、批號、純度、效期...）將精確分欄呈現！
* **方法 B：貼入既有的 Notion 資料庫 (Database Table View)**
  1. 在 Notion 資料庫中，先**點選第一欄的第一格儲存格**（讓該儲存格呈現選取框狀態）。
  2. 直接按下鍵盤 **`Ctrl + V`**，數據將自動往右、往下依序填入各個對應儲存格。

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
│   ├── coa-parser.html           # COA 檢驗報告書 AI 智慧辨識中心 (主程式)
│   └── coa-parser-v1-stable.html # COA 檢驗報告書 v1.0 封存穩定版 (雙軌備份)
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

## ⚖️ 開源授權與作者資訊 (License & Author)

* **作者 (Author)**：陳彥廷 (etrnya)
* **GitHub 專案**：[https://github.com/etrnya/Notion-Html](https://github.com/etrnya/Notion-Html)
* **授權協議**：本專案採用 **MIT License** 授權。詳見 [LICENSE](LICENSE) 檔案。
* Copyright © 2026 etrnya (陳彥廷). All Rights Reserved.
