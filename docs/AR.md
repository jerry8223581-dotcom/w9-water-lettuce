# AR辨識圖製作與實機驗證

本版有ar.html、MindAR影像追蹤控制程式與原創圖卡PNG，但**沒有targets.mind**。因此預設targetsConfigured=false，學生看到明確提示、相機按鈕停用，並可返回一般3D。沒有空白假辨識檔。

1. 在教師頁下載 `assets/ar_target.png`。這是本專案的示意觀察卡，不是課本圖片或已驗證的辨識標記。
2. 開啟 [MindAR官方Image Targets Compiler](https://hiukim.github.io/mind-ar-js-doc/tools/compile/)，上傳同一張PNG並編譯，下載結果。
3. 命名為 `targets.mind` 放在assets；單張圖的targetIndex為0。若使用多圖，索引依編譯上傳順序，須調整config。
4. `js/config.js` 中設ar.targetsConfigured=true，targetsPath保持相對路徑。不能編譯後更換圖案、裁切或拉伸比例。
5. 以紙本或另一台裝置全圖顯示圖卡；使用HTTPS學生網址，在支援相機的手機瀏覽器開AR，按開啟相機並允許權限。
6. 實測找到圖卡、失去圖卡、重新找到、未辨識逾時、拒絕權限、關閉相機，以及重新開啟。關閉AR應釋放相機軌道；離開頁面也會要求停止。
7. 依實際GLB與圖卡尺寸調整CONFIG.ar.scale、position、rotation；觀察模型有沒有朝向正確、是否過大、過暗。資料存在不代表追蹤成效通過。

圖卡應有足夠清晰、分布均勻的細節，避免大塊純色、重複圖案、反光與動態螢幕動畫。原稿以蓮座葉片、根部、文字及不對稱細節提供特徵，但追蹤品質仍需編譯及實機測試。原稿可修改，修改後必須重新編譯。

程式固定使用MindAR 1.2.5及A-Frame 1.5.0，僅在辨識檔已設定且使用者按按鈕時載入；需要網路。相機影像只在裝置端運算，不錄製、不送至GAS。

官方參考：[MindAR Build the page](https://hiukim.github.io/mind-ar-js-doc/quick-start/webpage/)。本次未啟動任何真實相機，也未編譯、掃描或宣稱AR辨識成功。
