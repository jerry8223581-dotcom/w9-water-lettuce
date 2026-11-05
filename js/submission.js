const GOOGLE_ORIGIN=/^https:\/\/(?:script\.google\.com|[a-z0-9-]+\.googleusercontent\.com)$/i;
const loopback=h=>['localhost','127.0.0.1','[::1]'].includes(h);
export function endpointAllowed(value){try{const u=new URL(value);return(u.origin==='https://script.google.com'&&/^\/macros\/s\/[A-Za-z0-9_-]+\/exec$/.test(u.pathname))||(loopback(location.hostname)&&loopback(u.hostname)&&u.protocol==='http:');}catch{return false;}}
export function randomToken(){return [...crypto.getRandomValues(new Uint8Array(16))].map(n=>n.toString(16).padStart(2,'0')).join('');}
export function createSubmissionClient({endpoint,timeoutMs=20000}){let busy=false;return{submit(payload){
 if(busy)return Promise.reject(new Error('正在繳交中，請等一下。'));
 if(!endpointAllowed(endpoint))return Promise.reject(new Error('老師還沒開放繳交，請先保留畫面並告訴老師。'));
 if(location.origin==='null')return Promise.reject(new Error('請透過網站網址開啟，才能安全繳交。'));
 busy=true;return new Promise((resolve,reject)=>{
  const nonce=randomToken(),id=payload.requestId,frame=document.createElement('iframe'),form=document.createElement('form');frame.name='submission-'+nonce;frame.title='學習單儲存回覆';frame.hidden=true;form.method='POST';form.action=endpoint;form.target=frame.name;form.hidden=true;
  for(const[name,value]of Object.entries({payload:JSON.stringify({...payload,nonce}),parentOrigin:location.origin})){const input=document.createElement('input');input.type='hidden';input.name=name;input.value=value;form.append(input);}
  const u=new URL(endpoint),isLocal=loopback(location.hostname)&&loopback(u.hostname);let timer;
  const cleanup=()=>{clearTimeout(timer);window.removeEventListener('message',receive);form.remove();frame.remove();busy=false;};
  const receive=event=>{const data=event.data,trusted=isLocal?event.origin===u.origin:GOOGLE_ORIGIN.test(event.origin);if(!trusted||!event.source||!data||data.type!=='dapin-submission-result'||data.nonce!==nonce||data.requestId!==id)return;if(data.ok===true&&[0,50,100].includes(data.score)&&typeof data.receipt==='string'&&data.receipt.length>=8){cleanup();resolve({score:data.score,receipt:data.receipt});}else if(data.ok===false){cleanup();reject(new Error(data.message||'儲存尚未成功，請稍後再試。'));}};
  window.addEventListener('message',receive);timer=setTimeout(()=>{cleanup();reject(new Error('還沒收到儲存回覆，不能確認是否成功。請保留畫面，稍後再按繳交確認；不要重新填寫。'));},timeoutMs);document.body.append(frame,form);try{HTMLFormElement.prototype.submit.call(form);}catch{cleanup();reject(new Error('無法送出，請檢查網路後再試。'));}
 });
}};}
