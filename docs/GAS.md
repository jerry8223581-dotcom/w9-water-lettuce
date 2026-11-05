# GAS部署與私人試算表

以下步驟涉及Google登入、授權及建立外部部署；本次未執行，須先由教師確認。

1. 教師建立一份私人Google試算表，不設定「知道連結的任何人」讀取。複製網址 `/d/` 後、`/edit` 前的試算表ID。
2. 在試算表的「擴充功能 → Apps Script」開啟專案，貼上本專案 `gas/Code.gs`。也可用獨立Apps Script專案。
3. 「專案設定 → 指令碼屬性」新增：

| 屬性 | 值 |
| --- | --- |
| SPREADSHEET_ID | 這份私人試算表的ID（只放在私人指令碼屬性） |
| SHEET_NAME | 大萍學習成果 |
| ALLOWED_ORIGINS | JSON陣列，例如 `["https://你的帳號.github.io","http://localhost:8000"]` |

origin只有協定、主機與必要連接埠，**沒有專案子目錄、沒有末尾斜線**。正式上課後可移除localhost。不能填星號。若預覽使用127.0.0.1，需把其精確origin另列。

4. 選取並執行 `initialize`，由教師檢查權限後授權。它建立工作表與13欄標題，已有不同欄名時會拒絕，不清除任何資料。若另有既有表格，改用新SHEET_NAME。
5. 「部署 → 新增部署 → 網頁應用程式」；執行身分選教師本人（部署者），可存取對象需允許**任何人／包含未登入者**。選項若被學校Workspace禁止，先請管理者確認合規做法，不能繞過限制，也不能宣稱學生不需登入已達成。
6. 教師確認後部署，取得 `/exec` 網址；不要使用只供開發者存取的 `/dev`。填入網站 `js/config.js` 的 `appsScriptEndpoint`，再發布靜態檔。網址是公開接收端點，不是密碼；試算表ID及權杖不得放前端。
7. 修改GAS後更新部署版本；只儲存程式不一定更新原 `/exec` 的版本。

官方流程：[Apps Script Web Apps](https://developers.google.com/apps-script/guides/web)。

## 跨網域與回覆協議

GitHub Pages與GAS不同來源；本版採瀏覽器原生POST表單送至隱藏iframe，避免JSON fetch的跨域預檢假設。GAS的HTML Service可能包含自己的sandbox iframe，因此回覆使用 `window.top.postMessage`，目標為允許清單中的**精確學生網站origin**，不是 `*`。回覆不包含學生回答。

GAS先驗證欄位，取得ScriptLock，依requestId及內容SHA-256去重，自行計分，appendRow、flush並讀回識別碼確認後才發 `ok:true` 與回執。前端驗證Google回覆來源、requestId與每次嘗試的新nonce，再顯示分數。資料只走POST，不把答案放在URL。文字以純文字保存，避免試算表公式注入。

官方機制：[HTML Service sandbox](https://developers.google.com/apps-script/guides/html/restrictions)、[ALLOWALL iframe設定](https://developers.google.com/apps-script/reference/html/x-frame-options-mode)。由於需要iframe嵌入，採ALLOWALL；後端精確origin白名單與前端nonce配對缺一不可。這是匿名收件服務，不是可信身分驗證，也不提供公開成績查詢。

20秒無回覆只表示**無法確認是否儲存**。瀏覽器阻擋嵌入、Google登入頁、網路中斷等都不會被誤判為成功；同一頁重試沿用requestId以確認前次紀錄，不要立即重開頁造成識別碼遺失。

## 正式端測試資料（手動，不使用真實學生）

先在未登入Google的無痕視窗，開啟 `/exec` 確認能看到服務文字；這只驗證可存取，不代表寫入成功。

在學生網站填：組別「測試組」、座號「8」、代號「Demo8」；三題分別填「綠色葉片圍成一圈」、「根垂在水中，沒有固定水底」、「葉片有含氣構造」。選B、C，確認繳交。必須同時確認：

- 頁面在確認儲存後顯示100分與回執。
- 教師私人工作表確實新增一列，各欄與答案、總分一致。
- 不登入教師帳號也能完成；學生不能讀取整張表。
- 改選A、A得0分，B、A得50分（另開新測試頁各一次）。
- 連點或逾時同頁重試不增加重複列。
- 故意暫時設定錯誤SHEET_NAME欄位或停用接收端，必須顯示失敗／逾時，不顯示成功；測完恢復正確設定。

測試列由教師自行辨認，是否刪除由教師決定，本工具不代刪資料。若學校政策或瀏覽器擋住iframe，先處理政策與部署設定，不能改成no-cors後假報成功。

## 本次已驗證範圍

使用**原始Code.gs**在Node沙盒運行，配記憶體假試算表；以兩個不同port模擬跨來源，並多包一層iframe，實際跑POST及postMessage。成功、寫入失敗、無回覆、錯nonce、去重、內容衝突、欄位檢查、伺服器分數及文字公式跳脫均已測。本次沒有Google授權、正式匿名部署或真實線上試算表驗證，這些仍待教師操作。
