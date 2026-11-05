# 原創大萍教學示意模型

現有assets/water_lettuce.glb可直接用於model-viewer，已真實載入驗證。模型為程式生成的簡化大萍，包含外、中、內三圈共21片綠葉及17組懸垂分枝根。不是別種植物替代、不是課本原圖，也不是實物比例或微觀剖面。

開發環境無Blender；因此所附Blender重建腳本尚未執行、其匯出結果尚未驗證。現有GLB是tools/generate_model.py直接以glTF 2.0二進位格式生成，不應稱為Blender匯出。

## Blender重建

安裝Blender後，在專案根目錄執行（請依實際安裝位置調整）：

```powershell
& 'C:\Program Files\Blender Foundation\Blender 4.5\blender.exe' --background --python tools/blender_water_lettuce.py -- assets/water_lettuce_blender.glb
```

腳本使用新場景，不讀取其他.blend；若指定輸出已存在會拒絕覆寫。若把Blender當作互動工具，先另存工作檔，再以文字編輯器執行腳本。腳本用共用幾何，轉換Blender的Z向上與GLB的Y向上。

確認新GLB葉色、根部、比例與朝向後，才把CONFIG.modelPath改為新路徑。本版材質採非金屬、高粗糙度綠葉，3D頁使用neutral環境與1.05曝光；有實際模型時應再測亮度，避免全白或過暗。

## 標記

js/config.js的hotspots內，每個標記有id、number、title、position、normal、text。position採模型空間公尺；normal為向量。model-viewer會把相同slot名稱hotspot-*的按鈕投影到模型位置，隨鏡頭旋轉而移動，不是固定螢幕座標。

更換模型後可用 [model-viewer Editor](https://modelviewer.dev/editor/) 取得座標。原則上葉片標記在葉面，根部在根系中段，生長方式在整株附近。原模型的含氣組織沒有幾何放大，資訊由旁邊文字說明，避免把模型表面當成葉片內部。

官方參考：[model-viewer annotations](https://modelviewer.dev/examples/annotations/)。
