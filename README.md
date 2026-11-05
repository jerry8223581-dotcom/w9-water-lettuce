# 水中漂浮的祕密－大萍 AR 探索教室

國小四年級自然「水中世界－探索水生植物」靜態教學網站。介面、3D模型、學習單、評量與GAS接收程式已建立；**尚未登入、授權、公開部署或連接真實試算表**。

## 立即預覽

在此資料夾開啟終端機：

```powershell
py -3 -m http.server 8000 --bind 127.0.0.1
```

瀏覽 `http://localhost:8000/`。也可雙擊 `StartLocalPreview.cmd`，保留視窗，按Ctrl+C停止。若沒有 `py`，改用已安裝的Python執行同一指令。

本專案使用JavaScript模組，請使用HTTP預覽，不要直接雙擊HTML。3D及主要教學資源已放本機；啟用AR時才會下載固定版本的A-Frame及MindAR。相機需HTTPS或localhost。沒有npm安裝與建置步驟。

## 已完成與狀態

| 功能 | 本版狀態 |
| --- | --- |
| 首頁、五階段指導語、三項學習目標 | 可操作 |
| 3D旋轉、縮放、重設、模型座標標記 | 已以真實GLB在Edge驗證 |
| 學習單與兩題Bloom評量 | 可填寫、必填檢查、確認繳交 |
| 計分 | 記憶題B、理解題C，每題50分；伺服器重新計分 |
| GAS跨網域回覆 | 原Code.gs＋不同來源多層iframe模擬驗證通過；**不是Google正式環境驗證** |
| Google試算表 | 尚未設定；不會假報繳交成功 |
| AR相機與追蹤 | 頁面及控制程式已備；**缺targets.mind，明確停用相機** |
| AR辨識原稿 | assets/ar_target.svg與png已建立，未編譯、未實機驗證 |
| 課堂QR | teacher.html輸入公開HTTPS網址後可產生、下載SVG |
| GitHub Pages | 已驗證雙層子目錄資源路徑，尚未公開部署 |

## 教材與模型來源

在目前工作目錄及桌面附近有限範圍，未找到W9簡報、南一自然課本、既有GLB或辨識檔。本版僅依任務中提供的三項大萍介紹、學習單與兩題評量製作，**不聲稱引述或已核對課本**。教師拿到教材後仍需核對用語與對應頁次，勿把本版當作出版社原文。

`assets/water_lettuce.glb` 是本專案以標準Python幾何程式產生的原創簡化示意模型，含21片蓮座狀綠葉與懸垂分枝細根，非其他植物模型或實物掃描；不呈現微觀含氣組織。模型約479KB。無Blender環境，因此**Blender重建腳本尚未執行／匯出**；現有GLB是獨立程式生成，不能稱為Blender驗證成果。

重新產生同一示意模型：

```powershell
py -3 tools/generate_model.py
```

此命令會覆寫本專案的生成示意GLB；若已換成實際模型，請先另存或指定改寫輸出路徑。Blender重建方式及外觀調整見 [docs/MODEL.md](docs/MODEL.md)。

## 三個主要設定

修改 `js/config.js`：

1. `modelPath`、`cameraOrbit`、`cameraTarget` 及 `hotspots`：GLB與標記。`position`、`normal`是模型空間3D座標，並非螢幕絕對位置。更換模型須重新確認座標、尺度、光照。
2. `ar.targetsConfigured`：只有真正編譯並放入 `assets/targets.mind` 後才設為true。沒有假造或空白.mind。詳見 [docs/AR.md](docs/AR.md)。
3. `appsScriptEndpoint`：GAS部署的 `/exec` 網址；`publicSiteUrl`：學生網站完整HTTPS網址。設定網址不代表已通過正式寫入測試。

## Google Apps Script與資料保存

完整服務位於 `gas/Code.gs`。試算表欄位包括時間、組別、座號、學生代號、三題回答、兩題評量答案及總分，另有去重識別碼、內容雜湊和回執。

前端不以 `fetch(...,{mode:'no-cors'})` 的不透明回應判定成功；它把POST表單送入隱藏iframe，由GAS確認試算表寫入後以 `window.top.postMessage` 回覆。會核對Google來源、requestId及隨機nonce；HTML Service的內層iframe也能回覆。逾時、無回覆、錯誤來源或錯誤nonce都不會顯示成功。相同內容重試沿用requestId，伺服器在鎖定中去重；伺服器自行計分，不信任前端送來的分數。

學生資料只經HTTPS POST送往教師私人試算表，不寫入Git、網址參數、localStorage或程式紀錄；測試使用合成資料與記憶體假試算表，不是真實學生資料。代號為自填，來源白名單不是身分驗證；本版沒有學生登入。正式上課需由教師控制代號、試算表權限及課後保留期限。

學生送出期間請勿重新整理。網路逾時可能已寫入但未收到回覆，留在原頁重試才能沿用去重識別碼；重新開頁不保留學生回答。部署、匿名權限、跨網域與實際試算表寫入仍須按 [docs/GAS.md](docs/GAS.md) 完成驗證，尤其學校Workspace可能限制匿名存取或嵌入。

## 部署與AR製作

- [GitHub Pages部署步驟](docs/DEPLOY.md)
- [GAS部署、試算表與測試資料](docs/GAS.md)
- [AR圖卡編譯與實機測試](docs/AR.md)
- [模型與Blender腳本](docs/MODEL.md)
- [實測結果及限制](docs/TESTING.md)

公開部署、登入及授權尚未執行；要由教師確認後再做。不要把學生名冊、真實答案、試算表匯出、密碼或權杖加入公開儲存庫。

已指定的儲存庫為 https://github.com/jerry8223581-dotcom/w9-water-lettuce 。預定學生網站為 https://jerry8223581-dotcom.github.io/w9-water-lettuce/ ，目前只完成本機子目錄驗證；尚未推送或宣稱此公開網址可用。公開部署後還須從該HTTPS網址檢查實際資源載入。

## 檔案

```text
index.html / ar.html / teacher.html
css/style.css
js/config.js / app.js / quiz.js / submission.js / ar.js / teacher.js
assets/water_lettuce.glb
assets/plant-illustration.svg
assets/ar_target.svg / ar_target.png
assets/targets.README.md          # targets.mind尚未提供
gas/Code.gs
vendor/                         # model-viewer、QR庫及授權
tools/                          # 模型、Blender、圖卡與固定版本下載腳本
tests/                          # 瀏覽器及Code.gs沙盒測試
docs/                           # 部署、AR、GAS、模型及測試說明
StartLocalPreview.cmd
```

完整檔案盤點為 `docs/FILES.txt`。`test-results/` 是本機驗證截圖與報告，已列入.gitignore，不需公開。這些檔案不是學生資料。
