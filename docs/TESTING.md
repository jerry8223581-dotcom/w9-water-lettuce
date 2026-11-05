# 實際測試與驗證界線

完整機器可讀結果：本機test-results/results.json。桌面與手機截圖：test-results/desktop.png、mobile.png。AR圖卡PNG由瀏覽器從原創SVG實際匯出，非空白占位。

本次使用Windows Microsoft Edge無頭瀏覽器、真實model-viewer 4.1.0與GLB，以及暫時HTTP伺服器。測試完成會關閉瀏覽器及兩個測試伺服器，沒有公開部署。

| 實際檢查 | 結果 |
| --- | --- |
| 首頁與資源在 /lesson/dapin/ 雙層子目錄載入 | 通過 |
| 真實GLB載入，三個標記以data-position／data-normal定位 | 通過 |
| 介紹切換、視角改變時標記投影移動、重設視角 | 通過 |
| 模型載入失敗提示、重新載入入口與文字替代 | 通過 |
| 必填與全部評量完成檢查；未設定GAS不假報成功 | 通過 |
| 0／50／100分計算、後端忽略偽造前端分數 | 通過 |
| AR缺少targets.mind，明確提示並停用相機、提供3D入口 | 通過 |
| 跨來源POST、多層iframe的postMessage成功回覆與連點保護 | 通過（模擬Google包覆機制） |
| 寫入失敗、無回覆、錯nonce均不顯示成功、保留回答 | 通過（模擬後端） |
| 原始Code.gs的欄位、去重、內容衝突、鎖定與公式跳脫 | 通過（記憶體試算表） |
| QR產生、SVG下載連結與AR PNG匯出 | 通過 |
| 375px手機版及桌面顯示、沒有水平截斷、相對資源路徑 | 通過 |

自動化彙整為10組檢查，每組含多個斷言。測試只使用合成資料，不會把學生答案寫入檔案或外部服務。

## 待實機／正式服務驗證

- 南一課本與W9簡報未提供，教材章節、頁碼與用語待核對。
- targets.mind尚未編譯，不可能宣稱追蹤成功；實體卡、手機相機權限、targetFound／targetLost、追蹤穩定性與關閉相機須實測。
- 手機真實觸控與各瀏覽器GPU差異，不能用375px桌面模擬取代。
- GAS教師授權、部署為任何人可存取、無痕匿名提交、HTML Service正式環境包覆與實際試算表列寫入，均尚未操作。
- Google可能因學校政策、瀏覽器或嵌入限制不回傳；此時只能判定未確認，必須完成docs/GAS.md的正式端測試。
- GitHub Pages尚未公開，實際HTTPS網址及QR手機掃描待部署後檢查。
- Blender未安裝，Blender腳本未執行；現有GLB為標準Python原創生成，已真實載入。

## 重跑測試（本機驗證腳本，不納入公開儲存庫）

開發驗證可執行 `node tests/run.cjs`。預設載入Playwright套件；若已在其他位置安裝，可透過PLAYWRIGHT_MODULE環境變數指定唯讀的套件路徑，程式碼不包含個人磁碟路徑。這不是學生網站的依賴，部署不需npm install或測試套件。

上傳前另外以儲存庫的實際子目錄 `/w9-water-lettuce/` 重跑相同檢查。預定網址為 `https://jerry8223581-dotcom.github.io/w9-water-lettuce/`；本機測試通過不能取代正式公開部署後的HTTPS驗證。

本次測試不等於外部服務已部署，也不等於AR已在手機通過。
