# GitHub Pages部署

本次只有本機專案，沒有登入GitHub、推送或公開部署。以下涉及對外公開，先由教師確認要發布的內容。

1. 使用已建立的儲存庫 `jerry8223581-dotcom/w9-water-lettuce`。將本專案內容放在儲存庫根目錄，確保index.html、ar.html、teacher.html、css、js、assets、vendor與.nojekyll均包含。本機Git準備與commit不等於已推送或發布。
2. 不上傳學生名冊、真實回答、試算表匯出、憑證或密碼。test-results已忽略。gas/Code.gs是無帳密的程式碼，試算表ID只放Google的私人指令碼屬性。
3. 在儲存庫 **Settings → Pages → Build and deployment**，Source選 **Deploy from a branch**，選擇main與 `/(root)`，Save。
4. 等待GitHub部署完成，使用預定HTTPS網址 `https://jerry8223581-dotcom.github.io/w9-water-lettuce/`。不要把目前的docs資料夾選成發布根目錄，因為它只有說明。
5. 打開學生頁、AR頁、教師頁，確認GLB、JS、CSS及圖卡都可載入。已以 `/lesson/dapin/` 雙層子目錄驗證相對路徑，沒有依賴磁碟絕對路徑。
6. 設定GAS的ALLOWED_ORIGINS為 `https://jerry8223581-dotcom.github.io`；依GAS.md完成匿名實際繳交測試。
7. 將CONFIG.publicSiteUrl填完整公開學生網站網址，或在teacher.html直接輸入網址，產生並下載課堂QR。先用另一支手機掃描確認，再給學生使用。
8. AR只在真正提供targets.mind及完成手機實測後開放；否則維持明確未設定狀態，3D課程仍可使用。

官方步驟：[Configuring a publishing source for GitHub Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site)。公開頁面與學生資料接收服務分開：網站可公開，但私人試算表不得開放讀取。
