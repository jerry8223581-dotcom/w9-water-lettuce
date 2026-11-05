import pathlib,urllib.request,ssl,json,hashlib
ROOT=pathlib.Path(__file__).resolve().parents[1];context=ssl.create_default_context();context.verify_flags &= ~ssl.VERIFY_X509_STRICT
files={
 'model-viewer.min.js':'https://cdn.jsdelivr.net/npm/@google/model-viewer@4.1.0/dist/model-viewer.min.js',
 'qrcode.js':'https://cdn.jsdelivr.net/npm/qrcode-generator@1.4.4/qrcode.js',
 'model-viewer-LICENSE.txt':'https://raw.githubusercontent.com/google/model-viewer/master/LICENSE',
 'qrcode-LICENSE.txt':'https://raw.githubusercontent.com/kazuhikoarase/qrcode-generator/master/LICENSE'
}
records=[]
for name,url in files.items():
    data=urllib.request.urlopen(url,context=context,timeout=60).read();(ROOT/'vendor'/name).write_bytes(data);records.append(dict(file=name,url=url,sha256=hashlib.sha256(data).hexdigest(),bytes=len(data)))
(ROOT/'vendor'/'sources.json').write_text(json.dumps(records,indent=2),encoding='utf-8');print([(r['file'],r['bytes']) for r in records])
