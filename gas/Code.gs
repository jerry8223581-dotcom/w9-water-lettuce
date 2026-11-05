/** 私人Google試算表的寫入服務。部署前先設定指令碼屬性，詳見README。 */
var HEADERS_=['提交時間','組別','座號','學生代號','學習單回答1','學習單回答2','學習單回答3','評量答案1','評量答案2','評量總分','提交識別碼','內容雜湊','回執編號'];
function doGet(){return HtmlService.createHtmlOutput('<h1>大萍學習成果接收服務</h1><p>服務可存取。學生資料僅接受POST；不提供成績查詢或資料下載。</p>');}
function fail_(code){var e=new Error(code);e.code=code;throw e;}
function allowedOrigin_(origin){var raw=PropertiesService.getScriptProperties().getProperty('ALLOWED_ORIGINS');if(!raw)fail_('CONFIG');var list;try{list=JSON.parse(raw);}catch(e){fail_('CONFIG');}return Array.isArray(list)&&list.indexOf(origin)>=0&&/^(https:\/\/[a-z0-9.-]+(?::\d+)?|http:\/\/(localhost|127\.0\.0\.1)(?::\d+)?)$/i.test(origin);}
function validate_(p){
 if(!p||p.schemaVersion!==1||!/^[a-zA-Z0-9-]{16,64}$/.test(p.requestId||'')||!/^[a-f0-9]{32}$/.test(p.nonce||''))fail_('INVALID');
 if(typeof p.group!=='string'||!p.group.trim()||p.group.trim().length>20)fail_('INVALID');
 var seat=Number(p.seat);if(!Number.isInteger(seat)||seat<1||seat>99)fail_('INVALID');
 if(typeof p.studentCode!=='string'||!(/^[\p{L}\p{N}_-]{1,24}$/u).test(p.studentCode.trim()))fail_('INVALID');
 if(!Array.isArray(p.answers)||p.answers.length!==3||p.answers.some(function(a){return typeof a!=='string'||!a.trim()||a.trim().length>1000;}))fail_('INVALID');
 if(!Array.isArray(p.quizAnswers)||p.quizAnswers.length!==2||p.quizAnswers.some(function(a){return ['A','B','C','D'].indexOf(a)<0;}))fail_('INVALID');
 return {group:p.group.trim(),seat:seat,studentCode:p.studentCode.trim(),answers:p.answers.map(function(a){return a.trim();}),quizAnswers:p.quizAnswers};
}
function safeCell_(value){var s=String(value);return /^[\s]*[=+@-]/.test(s)?"'"+s:s;}
function sheet_(){var props=PropertiesService.getScriptProperties(),id=props.getProperty('SPREADSHEET_ID'),name=props.getProperty('SHEET_NAME')||'大萍學習成果';if(!id)fail_('CONFIG');var book=SpreadsheetApp.openById(id),sheet=book.getSheetByName(name)||book.insertSheet(name);if(sheet.getLastRow()===0){sheet.appendRow(HEADERS_);sheet.setFrozenRows(1);}else{var headers=sheet.getRange(1,1,1,HEADERS_.length).getValues()[0];if(JSON.stringify(headers)!==JSON.stringify(HEADERS_))fail_('HEADERS');}return sheet;}
/** 教師手動執行一次，授權並建立欄名；不清除任何既有資料。 */
function initialize(){return sheet_().getName();}
function write_(requestId,data){
 var lock=LockService.getScriptLock();if(!lock.tryLock(10000))fail_('BUSY');
 try{
  var sheet=sheet_(),canonical=JSON.stringify(data),digest=Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256,canonical,Utilities.Charset.UTF_8).map(function(b){return('0'+(b&255).toString(16)).slice(-2);}).join('');
  if(sheet.getLastRow()>1){var found=sheet.getRange(2,11,sheet.getLastRow()-1,1).createTextFinder(requestId).matchEntireCell(true).findNext();if(found){var row=sheet.getRange(found.getRow(),1,1,HEADERS_.length).getValues()[0];if(row[11]!==digest)fail_('CONFLICT');return{score:Number(row[9]),receipt:String(row[12])};}}
  var score=(data.quizAnswers[0]==='B'?50:0)+(data.quizAnswers[1]==='C'?50:0),receipt=Utilities.getUuid(),nextRow=sheet.getLastRow()+1;
  sheet.appendRow([new Date(),safeCell_(data.group),data.seat,safeCell_(data.studentCode),safeCell_(data.answers[0]),safeCell_(data.answers[1]),safeCell_(data.answers[2]),data.quizAnswers[0],data.quizAnswers[1],score,requestId,digest,receipt]);
  SpreadsheetApp.flush();var check=sheet.getRange(nextRow,11,1,3).getValues()[0];if(check[0]!==requestId||check[1]!==digest||check[2]!==receipt)fail_('STORAGE');return{score:score,receipt:receipt};
 }finally{lock.releaseLock();}
}
function response_(result,origin){
 // HTML Service會多包一層iframe，故向top回覆；限定精確網站origin，絕不使用"*"。
 var safe=JSON.stringify(result).replace(/</g,'\\u003c').replace(/\u2028/g,'\\u2028').replace(/\u2029/g,'\\u2029');
 var html='<!doctype html><meta charset="utf-8"><p>已處理繳交要求，請回學習網站查看結果。</p><script>window.top.postMessage('+safe+','+JSON.stringify(origin)+');</script>';
 return HtmlService.createHtmlOutput(html).setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}
function doPost(e){
 var origin=e&&e.parameter?e.parameter.parentOrigin:'',p=null;
 try{
  if(!allowedOrigin_(origin))return HtmlService.createHtmlOutput('<p>不允許此來源，請請老師核對網站設定。</p>');
  if(!e.parameter.payload||(e.postData&&e.postData.contents&&e.postData.contents.length>20000))fail_('INVALID');
  try{p=JSON.parse(e.parameter.payload);}catch(err){fail_('INVALID');}
  var data=validate_(p),result=write_(p.requestId,data);
  return response_({type:'dapin-submission-result',requestId:p.requestId,nonce:p.nonce,ok:true,score:result.score,receipt:result.receipt},origin);
 }catch(err){
  var messages={INVALID:'欄位還沒完整，請檢查三題學習單與兩題挑戰。',BUSY:'大家正在繳交，請等一下再試。',CONFLICT:'這次資料與先前繳交不同，請告訴老師後再試。',CONFIG:'老師的接收設定還沒完成，請先保留畫面。',HEADERS:'老師的紀錄欄位需要調整，請先保留畫面。'};
  if(p&&typeof p.requestId==='string'&&typeof p.nonce==='string')return response_({type:'dapin-submission-result',requestId:p.requestId,nonce:p.nonce,ok:false,message:messages[err.code]||'儲存尚未確認成功，請保留畫面，稍後重試。'},origin);
  return HtmlService.createHtmlOutput('<p>資料格式無法讀取，尚未確認儲存。</p>');
 }
}
