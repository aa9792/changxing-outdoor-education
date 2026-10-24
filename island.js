/* Long-lived curriculum content stays in script.js; this atlas uses its exported snapshot. */
(() => {
'use strict';
const metadata = {
 'home-rail': {no:'01',name:'家鄉鐵道',sub:'七堵的日常，就是學習起點',zone:'local',location:'基隆七堵',photo:'home.jpg',x:300,y:620,type:'community'},
 marine: {no:'02',name:'海洋探索',sub:'用五官閱讀海岸與海科館',zone:'ocean',location:'基隆八斗子',photo:'marine-nmmst.png',x:665,y:300,type:'museum'},
 'rail-harbor': {no:'03',name:'港都與礦業',sub:'沿著鐵道，讀懂港城脈絡',zone:'local',location:'基隆港、七堵與新北猴硐',photo:'harbor.jpg',x:1000,y:595,type:'harbor'},
 sanxia: {no:'04',name:'產業文化',sub:'走進老街，認識手作與運輸',zone:'city',location:'新北三峽、鶯歌',photo:'culture.jpg',x:305,y:360,type:'village'},
 'multi-rail': {no:'05',name:'智慧交通',sub:'觀察城市如何安全地移動',zone:'city',location:'七堵出發，延伸臺北、南港與桃園',photo:'transit.jpg',x:640,y:700,type:'hub'},
 'risk-management': {no:'07',name:'風險管理',sub:'出發前，把安全準備好',zone:'safety',location:'規定・檢核・家長通知單',x:1000,y:850,type:'safety'},
 'metro-tech': {no:'06',name:'極東海岸',sub:'聽見海浪與鐵道的交響',zone:'ocean',location:'新北福隆、馬崗、三貂角',photo:'coast.jpg',x:1010,y:310,type:'lighthouse'}
};
const routes = [...ISLAND_DATA.routes,{id:'risk-management',title:'戶外教育安全資源中心',summary:'集中查閱規定、完成行前準備與製作家長通知單。',tasks:['官方規定','風險評估','行前檢核','家長通知單','同意回條']}].map(r => ({...r,...metadata[r.id]})).sort((a,b)=>a.no.localeCompare(b.no));
const $ = s => document.querySelector(s);
const esc = s => String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let active=null,filter='all',query='',zoom=1,pan={x:0,y:0},drag=null,visited=new Set();
try {visited=new Set(JSON.parse(localStorage.getItem('changxing-island-read')||'[]').filter(id=>metadata[id]));}catch{}
const ROLE_PROFILES={
 teacher:{label:'教師',eyebrow:'TEACHER / 備課與實施',title:'把場域，設計成學習。',intro:'先看課程目標與探究任務，再準備行前、現場與課後安排。',actions:[['課程設計工具','整理教案與學習任務','curriculum.html#lesson-builder'],['安全與通知單','規定、檢核與家長溝通','#risk-management']]},
 student:{label:'學生',eyebrow:'STUDENT / 探索與發現',title:'帶著好奇，出發探險。',intro:'選一座小島，領取觀察任務，把看見的線索寫成自己的發現。',actions:[['我的行前安全任務','出發前，和老師一起準備','#risk-management']]},
 partner:{label:'協作教師夥伴',eyebrow:'PARTNER / 共備與協作',title:'一起共備，讓學習走得更遠。',intro:'從路線需求討論場域資源、教材與帶隊分工，匯出共備紀錄。',actions:[['協作前的安全共識','核對人力、分組與應變安排','#risk-management'],['開啟教案共備工具','對齊行前、現場與課後設計','curriculum.html#lesson-builder']]},
 coach:{label:'課程輔導員',eyebrow:'COACH / 課程檢視與佐證',title:'從學習現場，看見課程成長。',intro:'從四個觀察面向提出問題、核對佐證，再記錄支持學校的下一步。',actions:[['安全規劃與文件檢視','核對規定、行前準備與通知流程','#risk-management'],['查看校本課程脈絡','理解 TRAIN 與路線設計','curriculum.html#train-method']]}
};
let currentRole='teacher',roleSelected=false;
try{const saved=sessionStorage.getItem('changxing-role');if(ROLE_PROFILES[saved]){currentRole=saved;roleSelected=true;}}catch{}
const roleDrafts=new Map(),reviewDrafts=new Map();
function roleRouteSubtitle(r){if(r.zone==='safety')return currentRole==='student'?'出發前的九個安全小任務':'規定、行前檢核與通知單';return {teacher:r.sub,student:r.tasks[0],partner:'對齊目標・教材資源・帶隊分工',coach:'檢視課程目標・學生作品・回饋改進'}[currentRole];}
function renderRoleOverview(){const p=ROLE_PROFILES[currentRole];document.body.dataset.role=currentRole;$('#current-role').textContent=p.label+'視角';$('.panel-heading .eyebrow').textContent=p.eyebrow;$('.panel-heading h2').textContent=p.title;$('.panel-heading>p:last-child').textContent=p.intro;$('#role-tools').innerHTML=p.actions.map(([title,desc,href])=>`<a href="${href}"><strong>${title} <span>↗</span></strong><small>${desc}</small></a>`).join('');$('.panel-footer>a').hidden=currentRole==='student';$('.method-note').hidden=currentRole==='student';}
function chooseRole(id){if(!ROLE_PROFILES[id])return;currentRole=id;roleSelected=true;try{sessionStorage.setItem('changxing-role',id);}catch{}renderRoleOverview();renderList();if(active)openRoute(active,false);$('#role-entry').close();$('#change-role').focus({preventScroll:true});}
function exportRoleRecord(r){const note=$('#role-note')?.value||'';const status=[...document.querySelectorAll('.review-state')].map(el=>el.dataset.dimension+'：'+el.options[el.selectedIndex].text).join('\n');const p=ROLE_PROFILES[currentRole];const text=`長興國小戶外教育島｜${p.label}紀錄\n路線：${r.name}\n場域：${r.location}\n\n${currentRole==='student'?'任務：\n'+r.tasks.map((t,i)=>(i+1)+'. '+t).join('\n'):''}\n${status}\n\n${note}\n\n本紀錄為使用者草稿，須搭配現場觀察與實際作品確認。`;const url=URL.createObjectURL(new Blob([text],{type:'text/plain;charset=utf-8'}));const link=document.createElement('a');link.href=url;link.download=`${r.name}_${p.label}紀錄.txt`;link.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}
function roleNote(r,prompt){const key=currentRole+':'+r.id;return `<label class="role-note-label" for="role-note">${prompt}</label><textarea id="role-note" rows="5" placeholder="在這裡整理你的紀錄…">${esc(roleDrafts.get(key)||'')}</textarea><button type="button" id="export-role-note" class="role-export">下載${currentRole==='student'?'探究筆記':currentRole==='partner'?'共備紀錄':'輔導觀察紀錄'} TXT ↓</button><small class="draft-note">文字僅暫存在本次頁面；離開前請下載保存。</small>`;}
function roleModule(r){
 if(currentRole==='teacher'&&r.id==='risk-management')return `<section class="role-module"><p class="eyebrow">教師行前準備</p><h3>先核對規定，再完成家長溝通</h3><ol><li>對照官方規定、核定計畫與學校補充公文。</li><li>完成下方行前檢核，記錄風險與分工。</li><li>使用通知單工具，依校內流程收回回條。</li></ol></section>`;
 if(currentRole==='teacher')return `<section class="role-module"><p class="eyebrow">教學準備</p><h3>從這條路線開始備課</h3><ol><li>用下方探究任務對齊學習目標與學生年段。</li><li>展開「行前、現場與課後怎麼學」，檢查教學銜接。</li><li>到風險管理島完成安全準備，再製作通知單。</li></ol><a href="#risk-management">開啟風險管理島 →</a></section>`;
 if(currentRole==='student')return `<section class="role-module"><p class="eyebrow">我的探究筆記</p><h3>把觀察變成自己的發現</h3><p>可以想一想：我看見什麼？哪個線索讓我改變想法？我還想問什麼？</p>${roleNote(r,'寫下你的發現與想問的問題')}</section>`;
 if(currentRole==='partner')return `<section class="role-module"><p class="eyebrow">協作共備工作區</p><h3>先對齊目標，再分工</h3><dl><dt>課程目標</dt><dd>${esc(r.tasks[0]||'共同完成安全行前準備')}</dd><dt>可討論的場域資源</dt><dd>${esc(r.location)}</dd><dt>行前共備</dt><dd>誰準備教材、誰聯繫場域、如何照顧不同學生需求？</dd><dt>現場分工</dt><dd>誰負責教學引導、分組點名、隊伍前後照看與緊急聯繫？</dd><dt>課後回饋</dt><dd>如何共同整理作品、觀察紀錄與下一次的調整？</dd></dl>${roleNote(r,'記錄分工、需要的資源與待確認事項')}</section>`;
 const dimensions=['有意義的學習','健康的身心','尊重與關懷他人','友善環境'];const prompts=['任務如何連結真實場域？學生用了什麼方法記錄、分析與省思？','學生如何安全移動、覺察環境並照顧自己的身心需求？','學生如何協作、傾聽不同經驗並照顧團隊成員？','學生是否從地方觀察延伸到友善環境的具體行動？'];return `<section class="role-module"><p class="eyebrow">課程輔導觀察卡</p><h3>用問題與佐證，支持課程改進</h3>${dimensions.map((d,i)=>`<div class="review-dimension"><strong>${d}</strong><p>${prompts[i]}</p><label>佐證狀態 <select class="review-state" data-dimension="${d}"><option>待現場確認</option><option>已有佐證可討論</option><option>需要補充資料</option></select></label></div>`).join('')}<p class="draft-note">此處為輔導觀察面向，不自動判定學生達標。請核對實際作品、教師紀錄與正式檢核表。</p>${roleNote(r,'記錄看到的佐證、追問與下一步建議')}</section>`;
}
function applyRoleDetail(r){
 if(currentRole==='student'){
 if(r.id==='risk-management'){const tasks=['跟老師確認集合時間與地點','記住自己的小組與帶隊老師','聽懂交通、步道或海岸安全提醒','準備飲水、適合的衣物與必要用品','需要協助或身體不舒服時，立刻告訴老師','知道離隊或迷路時要留在安全處並找老師協助','觀察天候與環境，跟隨老師調整行動','和夥伴一起走，不擅自離隊','回來後分享一件讓活動更安全的方法'];$('#detail').innerHTML=`<div class="detail-header"><button class="back" id="back">← 回到所有小島</button></div><div class="detail-content"><p class="eyebrow">學生安全任務 / 07</p><h2 tabindex="-1">安全出發，我準備好了嗎？</h2><p class="detail-summary">和老師一起讀一讀、確認自己的準備。這些勾選是自我提醒，出發與行程仍由老師安排。</p><div class="safety-checklist">${tasks.map(t=>`<label><input type="checkbox"><span>${t}</span></label>`).join('')}</div><p class="risk-progress" aria-live="polite">已確認 0 / 9 項</p><div class="return-row"><button id="back-bottom">← 回到所有小島</button></div></div>`;}
 else $('#detail').innerHTML=`<div class="detail-header"><button class="back" id="back">← 回到所有小島</button></div><figure class="detail-photo"><img src="assets/island/${r.photo}" alt="${r.name}活動照片"><figcaption>長興國小既有課程照片</figcaption></figure><div class="detail-content"><p class="eyebrow">STUDENT MISSION / ${r.no}</p><h2 tabindex="-1">${r.name}：我的探索任務</h2><p class="detail-summary">${esc(r.summary)}</p><div class="student-missions">${r.tasks.map((t,i)=>`<article><span>任務 ${i+1}</span><p>${esc(t)}</p></article>`).join('')}</div>${roleModule(r)}<details><summary>看看這座島的活動紀錄</summary>${activitySection(r.id)}</details><a class="primary" href="#risk-management">完成行前安全任務 →</a><div class="return-row"><button id="back-bottom">← 繼續探索其他小島</button></div></div>`;
 }else if(currentRole==='partner'&&r.id!=='risk-management'){
 const t=ISLAND_DATA.templates[r.id];$('#detail').innerHTML=`<div class="detail-header"><button class="back" id="back">← 回到所有小島</button></div><div class="detail-content"><p class="eyebrow">CO-PLANNING / ${r.no}</p><h2 tabindex="-1">${r.name}：協作共備</h2><p class="detail-summary">${esc(r.summary)}</p>${roleModule(r)}<details><summary>課程銜接與教材需求</summary><h3>行前</h3><ul>${t.before.map(x=>`<li>${esc(x)}</li>`).join('')}</ul><h3>現場</h3><ul>${t.during.map(x=>`<li>${esc(x)}</li>`).join('')}</ul><h3>課後</h3><ul>${t.after.map(x=>`<li>${esc(x)}</li>`).join('')}</ul></details>${activitySection(r.id)}<a class="primary" href="#risk-management">核對安全分工與行前準備 →</a><div class="return-row"><button id="back-bottom">← 回到所有小島</button></div></div>`;
 }else {const target=$('#detail .detail-summary');target.insertAdjacentHTML('afterend',roleModule(r));}
 if(currentRole==='coach'){$('#detail h2').textContent=r.name+'：課程輔導檢視';document.querySelectorAll('.review-state').forEach(el=>{const key=r.id+':'+el.dataset.dimension;el.value=reviewDrafts.get(key)||'待現場確認';el.addEventListener('change',()=>reviewDrafts.set(key,el.value));});}
 const note=$('#role-note');if(note){note.addEventListener('input',()=>roleDrafts.set(currentRole+':'+r.id,note.value));$('#export-role-note').addEventListener('click',()=>exportRoleRecord(r));}
}
const poly=(points,fill,extra='')=>`<polygon points="${points}" fill="${fill}" ${extra}/>`;
function box(x,y,w,d,h,c='#e9d6a0',roof='#a65c43'){
 return poly(`${x-w/2},${y-h-d/2} ${x},${y-h} ${x},${y} ${x-w/2},${y-d/2}`,c)+poly(`${x},${y-h} ${x+w/2},${y-h-d/2} ${x+w/2},${y-d/2} ${x},${y}`,'#c5bf94')+poly(`${x-w/2},${y-h-d/2} ${x},${y-h-d} ${x+w/2},${y-h-d/2} ${x},${y-h}`,roof);
}
function tree(x,y,s=1){return `<g transform="translate(${x} ${y}) scale(${s})"><ellipse cy="5" rx="13" ry="6" fill="#527e6230"/><path d="M0 0V-26" stroke="#8a7960" stroke-width="4"/><path d="M0-65L-18-29H-11L-24-12H24L11-29H18Z" fill="#497b65"/><path d="M0-65V-12H24L11-29H18Z" fill="#608b6b"/></g>`;}
function school(){return `<g transform="translate(575 453)" class="changxing-campus">
 <path d="M-137-17L49-54 139 17-46 65Z" fill="#b7b6a1"/>
 <path d="M-84 4L44-24 95 8-29 41Z" fill="#b98460"/><path d="M-72 7L43-18M-55 18L62-9M-37 30L78 0" stroke="#c99e77" stroke-width="1"/>
 <path d="M-81-133L95-168V-61L-81-26Z" fill="#dec796" stroke="#a88d63" stroke-width="1.5"/>
 <path d="M-120-159L-81-133V-26L-120-53Z" fill="#b99e70"/>
 <path d="M-120-159L57-193 95-168-81-133Z" fill="#a9ad9e" stroke="#d4bc8d" stroke-width="3"/>
 <path d="M-120-159v-7L57-200 95-175v7L57-193Z" fill="#d8bf8c"/>
 <path d="M-83-137L95-172v7L-83-130Z" fill="#e9d5a5"/>
 ${Array.from({length:11},(_,i)=>{let xx=-68+i*14,yy=-114-i*2.8;return `<path d="M${xx} ${yy+15}v-15q5-12 10-2v15Z" fill="#625f4b" stroke="#ab8356" stroke-width="2"/><path d="M${xx+5} ${yy-3}v17" stroke="#d3b888" stroke-width="1"/>`;}).join('')}
 <path d="M-73-85L97-119 104-109-67-75Z" fill="#767b67"/><path d="M-67-75L104-109v5L-67-70Z" fill="#9c9e7d"/>
 <path d="M-50-68L69-92v37L-50-31Z" fill="#cfb27e"/><path d="M-3-65L27-71v38l-30 6Z" fill="#596d5b"/><path d="M-44-47L-35-49v20l-9 2m94-39 9-2v20l-9 2" fill="#8a9b7d"/>
 <text x="15" y="-70" text-anchor="middle" transform="rotate(-11 15 -70)" font-size="11" font-weight="700" fill="#765736">基隆市長興國小</text>
 <path d="M-118-156v-25l29 18v25Z" fill="#dac28e"/><path d="M-118-181l29 18 13-4-29-17Z" fill="#a8a791"/>
 <path d="M78-168v-30l18-3 18 12v30l-18-12Z" fill="#ceb380"/><path d="M78-198l18-4 18 12-18 4Z" fill="#aaa58d"/>
 <path d="M-115-178L-65-188-30-166-80-155Z" fill="#4d6a72" stroke="#d1d9cb" stroke-width="2"/>
 ${[0,1,2,3].map(i=>`<path d="M${-106+i*12}-180l35 23" stroke="#a9bec0" stroke-width="1"/>`).join('')}
 <path d="M-103-168l50-10m-39 18 50-10" stroke="#a9bec0" stroke-width="1"/>
 <path d="M-110-57Q-100-73-86-64L-42 7-66 18Z" fill="#4d8270" stroke="#a3ba9b" stroke-width="2"/>
 <path d="M-102-55L-57 16m-44-60 24-5m-17 17 24-5m-17 17 24-5m-16 17 24-5" stroke="#a3ba9b" stroke-width="1.5"/>
 <path d="M-104-54v17m62 44v17" stroke="#83947a" stroke-width="2"/>
 ${box(-99,43,66,36,39,'#cbb584','#a7a78c')}
 <path d="M-127 12l52-10 12 9-52 10Z" fill="#d5b57e"/><path d="M-123 24l43-9v15l-43 9Z" fill="#739b87"/><path d="M-107 21v15m15-18v15" stroke="#d3d5ac" stroke-width="2"/>
 <path d="M-125 34l44-9 8 8-45 10Z" fill="#78a08a"/>
 <path d="M-50 29l8-2v33l-8 2m95-53 8-2v33l-8 2" stroke="#8c8166" stroke-width="7"/>
 <path d="M-35 40L39 23v19L-35 60Z" fill="#9ba893" stroke="#586f61" stroke-width="2"/>
 ${Array.from({length:10},(_,i)=>`<path d="M${-31+i*7} ${39-i*1.6}v19" stroke="#586f61" stroke-width="1.5"/>`).join('')}
 <path d="M-59 46l-8-24 10-13 13 12 2 23Z" fill="#a2a28a"/><text x="-55" y="23" writing-mode="tb" font-size="5" fill="#955640">長興國小</text>
 <g class="campus-vehicle"><animateMotion path="M-30 7L35-8" dur="10s" begin="-2s" repeatCount="indefinite" keyPoints="0;1;1;0;0" keyTimes="0;.4;.5;.9;1" calcMode="linear"/><g transform="translate(-22 66) rotate(-12)"><rect x="-28" y="-13" width="55" height="22" rx="6" fill="#e2b84b" stroke="#a9873b"/><path d="M-20-10h31v10h-31Z" fill="#688c83"/><path d="M-10-10V0M0-10V0" stroke="#d7c782" stroke-width="2"/><path d="M17-10h7v13h-7Z" fill="#637f76"/><circle cx="-17" cy="10" r="5" fill="#495d56"/><circle cx="17" cy="10" r="5" fill="#495d56"/></g></g>
 <g class="campus-vehicle"><animateMotion path="M22-5L-30 7" dur="13s" begin="-7s" repeatCount="indefinite" keyPoints="0;1;1;0;0" keyTimes="0;.4;.5;.9;1" calcMode="linear"/><g transform="translate(57 52) rotate(-12)"><rect x="-20" y="-8" width="40" height="15" rx="6" fill="#b1bdb4"/><path d="M-10-9l7-7h12l8 7Z" fill="#d5dbcb"/><path d="M-2-14h10l5 5H-8Z" fill="#688d89"/><circle cx="-11" cy="8" r="4" fill="#4d6258"/><circle cx="12" cy="8" r="4" fill="#4d6258"/></g></g>
 ${[[-126,-53,22],[31,10,19],[110,-26,20],[126,-63,18]].map(([xx,yy,rr])=>`<g><ellipse cx="${xx}" cy="${yy+8}" rx="${rr}" ry="8" fill="#54765722"/><path d="M${xx} ${yy}v-32" stroke="#85774e" stroke-width="4"/><circle cx="${xx}" cy="${yy-41}" r="${rr}" fill="#5e8054"/><circle cx="${xx-8}" cy="${yy-48}" r="${rr*.65}" fill="#7e9b60"/></g>`).join('')}
 <g class="campus-walker"><animateMotion path="M-27 7Q-4-4 22-14" dur="9s" begin="-2s" repeatCount="indefinite" keyPoints="0;1;1;0" keyTimes="0;.43;.55;1" calcMode="linear"/><g transform="scale(.8)">${person('#e2bd55',true,'walk')}</g></g><g class="campus-walker"><animateMotion path="M18 15L-18 29" dur="7s" repeatCount="indefinite" keyPoints="0;1;0" keyTimes="0;.5;1" calcMode="linear"/><g transform="scale(.8)">${person('#6e9d96',true,'walk')}</g></g>
 </g>`;}

function building(r){let x=r.x,y=r.y;
 if(r.type==='safety')return `<g transform="translate(${x} ${y})" class="risk-wood-office">
 <path d="M-125 1L56-37 131 10-51 51Z" fill="#d0d5ba"/>
 <path d="M-119 27Q-52 13 6 42L-12 53Q-73 27-126 39Z" fill="#b97660"/><path d="M-121 32Q-60 19-1 46m-119-8q53-9 108 14" stroke="#eee5c9" stroke-width="1.3" fill="none"/>
 <path d="M-66 12L87-18 119 3-35 36Z" fill="#d5d3bd"/>
 <path d="M-54-85L92-113V-8L-54 21Z" fill="#c2965f" stroke="#936e46" stroke-width="1.3"/>
 <path d="M92-113l30 21V13L92-8Z" fill="#a87947"/>
 <path d="M-54-85L13-140 92-113Z" fill="#d4ac70" stroke="#9e7649" stroke-width="2"/>
 <path d="M-42-87L13-131 78-111Z" fill="#8fafa2" stroke="#936e46" stroke-width="2"/>
 <path d="M-11-111v19m30-38v33m29-25v20" stroke="#a67b49" stroke-width="3"/>
 <path d="M-66-84L13-146 51-153 132-120 95-108 13-140-58-79Z" fill="#5e6d65" stroke="#3d544c" stroke-width="2"/>
 <path d="M-64-78L13-135 95-102v-9L13-144-64-87Z" fill="#c58e51"/>
 <path d="M-45-63L83-89V-9L-45 17Z" fill="#86aaa0" class="night-window"/>
 <path d="M99-94l16 11V3L99-8Z" fill="#7d9e93" class="night-window"/>
 <path d="M-38-4L78-27v14L-38 10Z" fill="#a1bba0" opacity=".7"/>
 <path d="M-13-15L30-24v4L-13-11Z" fill="#b18c55"/><path d="M-10-11V6m35-24V0" stroke="#8d7147" stroke-width="2"/>
 <path d="M-3 3v-14l9-2V1m13-2v-14l9-2v14" stroke="#a67e46" stroke-width="2.5" fill="none"/>
 <path d="M47-64l28-6v45l-28 6Z" fill="#a28250"/><path d="M49-50l24-5m-24 19 24-5" stroke="#deb47c" stroke-width="2"/>
 <path d="M52-60h8v8h-8Z" fill="#c28a4b"/><path d="M64-64h7v9h-7Z" fill="#bc7952"/><path d="M51-44h9v8h-9Z" fill="#e0b459"/><path d="M64-46h7v9h-7Z" fill="#73958b"/>
 <path d="M-49-66V20m38-94V12m46-95V2m51-95V-8m18-88V2" stroke="#b58b53" stroke-width="4"/>
 <path d="M-49-42L86-69m-135 36L86-60" stroke="#bb985e" stroke-width="2"/>
 <path d="M-48-78L87-105v27L-48-51Z" fill="#ddb77e" stroke="#bc915b" stroke-width="1.2"/>
 <text x="18" y="-84" transform="rotate(-11 18 -84)" text-anchor="middle" font-size="9" font-weight="700" fill="#4b5a43">戶外風險管理辦公室</text><text x="18" y="-73" transform="rotate(-11 18 -73)" text-anchor="middle" font-size="5.5" fill="#5b6a4e">基隆市戶外教育中心</text>
 ${[[-51,16],[88,-10],[116,8]].map(([xx,yy])=>`<path d="M${xx-7} ${yy-19}l14-3v28l-14 3Z" fill="#a1a99a" stroke="#818e7e"/><path d="M${xx-5} ${yy-16}l5-1 2 6-5 2Zm5 10 6-1 1 6-6 1m-9-2 4-1 1 6-4 1" fill="#d2ccb0"/>`).join('')}
 <path d="M-9 20L78 2 89 8 1 27Z" fill="#e5dfc9"/><path d="M1 27L89 8v4L1 31Z" fill="#a5b09b"/><path d="M1 31L89 12l8 5-89 19Z" fill="#d4d3bc"/>
 <path d="M-73 24L-11 11l11 7-63 14Z" fill="#c2cab1"/><path d="M-72 23V6l60-12v17m-60 3 60-12" fill="none" stroke="#a0b7a5" stroke-width="1.8"/>
 <path d="M-110 17v-54m40 46v-54" stroke="#9b7e4b" stroke-width="3"/><path d="M-117-38l49-10 9 7-50 10Z" fill="#596f60"/>
 <path d="M-106-32l33-7v36l-33 7Z" fill="#dcdaba" stroke="#a48b53" stroke-width="2"/>
 <path d="M-103-24l5 5 6-10 5 3 7-8m-23 22 8-5 4 7 9-8" fill="none" stroke="#86a47c" stroke-width="2"/><path d="M-100-28q17 12 20 18" stroke="#81a5a3" stroke-width="1.5" fill="none"/>
 <path d="M-62 10V-103" stroke="#687d67" stroke-width="3"/><path d="M-73-83h22v18h-22Z" fill="#72928a" stroke="#b0c4ae"/><path d="M-72-77l19-3m-19 7 19-3" stroke="#bdd4bf" stroke-width="1"/>
 <g transform="translate(-62 -104)"><animateTransform attributeName="transform" type="rotate" values="0;360" dur="4s" repeatCount="indefinite" additive="sum"/><path d="M-12 0H12M0-10V10" stroke="#667d68" stroke-width="2"/><circle cx="-12" r="3" fill="#59715d"/><circle cx="12" r="3" fill="#59715d"/><circle cy="-10" r="3" fill="#59715d"/></g>
 <path d="M-69-62l15-3 5 13-15 3Z" fill="#507d8d" stroke="#d6dfc7"/><path d="M-65-63l4 12m3-13 4 12" stroke="#a2c6c2" stroke-width=".8"/>
 ${[[-96,26],[-29,21],[106,15]].map(([xx,yy])=>`<path d="M${xx-7} ${yy-8}h14l-2 12h-10Z" fill="#b29468"/><path d="M${xx} ${yy-8}q-14-15-11-22q11 2 11 18q0-18 10-23q4 13-10 23Z" fill="#71945f"/>`).join('')}
 <g transform="translate(42 27) scale(.7)">${person('#d6b45b',true,'observe')}</g>
 </g>`;
 if(r.type==='community')return `<g transform="translate(${x} ${y})" class="heritage-station">
 <path d="M-111 9L65-7 111 17-66 39Z" fill="#bdb9a5"/>
 <path d="M-77 27L58 15 73 22-63 36Z" fill="#e0d9bf"/><path d="M-63 36L73 22v5L-63 41Z" fill="#a5a28f"/><path d="M-63 41L73 27 85 33-51 47Z" fill="#d9d4c1"/><path d="M-51 47L85 33v4L-51 51Z" fill="#a5a28f"/>
 <path d="M-87-48L70-61 70 0-87 14Z" fill="#76533c"/><path d="M70-61L98-46V12L70 0Z" fill="#654b39"/>
 ${[-43,-36,-29,-22,-15,-8].map(v=>`<path d="M-85 ${v+2}L69 ${v-11}" stroke="#a0805c" stroke-width="1.3"/>`).join('')}
 ${[-66,-28,11,47].map(v=>`<path d="M${v} -37l24-2v31l-24 2Z" fill="#4c5747" stroke="#b29871" stroke-width="2"/><path d="M${v+8} -37v31m8-32v31m-16-19 24-2m-24 12 24-2" stroke="#b29871" stroke-width="1.3"/>`).join('')}
 <path d="M-89-46L72-60 98-46 79-40-91-26-111-37Z" fill="#4d5148"/><path d="M-91-78L68-91 101-51-111-33Z" fill="#797b69" stroke="#4f564b" stroke-width="2"/>
 ${Array.from({length:18},(_,i)=>`<path d="M${-86+i*8.6} ${-78-i*.7}l-17 40" stroke="#a8a78d" stroke-width="1"/>`).join('')}
 <path d="M-99-66L79-81M-104-53L88-67M-110-39L99-53" stroke="#555e50" stroke-width="1.5"/><path d="M-95-79L69-92" stroke="#c0b99d" stroke-width="3"/>
 <path d="M-104-37L102-54" stroke="#544437" stroke-width="4"/>
 ${[-91,-47,3,52,92].map(v=>`<path d="M${v} ${-36-(v+91)*.08}v53" stroke="#886a4b" stroke-width="4"/>`).join('')}
 <path d="M-99 18L96 1" stroke="#b4a98e" stroke-width="4"/>
 <path d="M-53-57L49-66v18L-53-39Z" fill="#e3d5a0" stroke="#78694b" stroke-width="1"/><text x="-2" y="-46" transform="rotate(-5 -2 -46)" text-anchor="middle" font-size="12" font-weight="700" letter-spacing="3" fill="#333d63">七堵舊車站</text>
 <path d="M-112 11v21m27-23v21m-27-12 27-2m-27 10 27-2" stroke="#8b9786" stroke-width="1.5"/><path d="M-113 11l29-2" stroke="#d9dec8" stroke-width="2"/>
 <g transform="translate(-100 22)" fill="none" stroke="#c1c6ab" stroke-width="1.5"><circle cx="-5" cy="-3" r="4"/><circle cx="7" cy="-4" r="4"/><path d="M-12-8l2-10h12v9h11v6H-14v-5Z"/></g>
 <path d="M-19 8l35-3 8 5-35 3Z" fill="#aab29c"/>
 <text x="-3" y="62" text-anchor="middle" font-size="11" font-weight="700" fill="#455d4a">鐵道園區</text></g>`;
 if(r.type==='station')return `<g transform="translate(${x} ${y})" class="qidu-modern-station">
 <path d="M-103 4L69-25 112 9-60 42Z" fill="#c7c9ba"/>
 <path d="M-95 39L100 3 119 18-78 56Z" fill="#8e9c94"/><path d="M-85 48L110 12" stroke="#e9d995" stroke-width="2" stroke-dasharray="13 8"/>
 <path d="M-78-143L-10-156V-15L-78-2Z" fill="#d8dbce" stroke="#a4b2a5" stroke-width="1.5"/>
 <path d="M-100-157L-78-143V-2L-100-18Z" fill="#a9b8ae"/>
 <path d="M-100-157L-33-170-10-156-78-143Z" fill="#e6e7db"/>
 <path d="M-11-139Q40-95 94-113V-21Q49-4-11-15Z" fill="#b6c6bb" stroke="#899e95" stroke-width="2"/>
 <path d="M-9-127Q43-86 92-103V-80Q41-63-9-101Z" fill="#719a9d"/><path d="M-9-91Q43-51 92-68V-45Q41-29-9-65Z" fill="#7a9fa0"/>
 ${Array.from({length:9},(_,i)=>{let xx=i*11,yy=-117+Math.sin(i/8*Math.PI/2)*20;return `<path d="M${xx} ${yy}v79" stroke="#d8dfcf" stroke-width="2"/>`;}).join('')}
 <path d="M-10-137Q42-94 96-113" fill="none" stroke="#e4e5d7" stroke-width="5"/>
 <path d="M-3-145v13m16-2v14m17-5v14m17-8v14m18-13v14m18-16v14" stroke="#92aaa0" stroke-width="2"/>
 <path d="M-71-181L-20-191-20-156-71-146Z" fill="none" stroke="#a5b3aa" stroke-width="8"/><path d="M-71-181L-83-189-32-199-20-191" fill="none" stroke="#d5dcd0" stroke-width="8"/>
 <path d="M-53-184v34m16-37v34" stroke="#d4dcd0" stroke-width="2"/>
 <text x="-44" y="-131" text-anchor="middle" transform="rotate(-10 -44 -131)" font-size="10" font-weight="700" fill="#427b93">七堵車站</text>
 ${[-112,-96,-80,-64,-48].map(yy=>`<path d="M-75 ${yy}l62-12" stroke="#b6c0b2" stroke-width="1"/>`).join('')}
 <path d="M-12-152v135" stroke="#718d80" stroke-width="3"/><path d="M-17-132l11-2m-11 14 11-2m-11 14 11-2m-11 14 11-2m-11 14 11-2m-11 14 11-2" stroke="#a3b3a4" stroke-width="2"/>
 <path d="M-77-32L-12-44V-14L-77-2Z" fill="#5d7971"/><path d="M-62-34v29m19-33v29m19-33v29" stroke="#d1d6c2" stroke-width="3"/>
 <path d="M-7-30Q41-4 94-22l7 8Q45 5-7-19Z" fill="#a9b3a3"/>
 ${[8,32,56,81].map(xx=>`<path d="M${xx} -16v29" stroke="#d1d7c7" stroke-width="5"/>`).join('')}
 <path d="M4 13V-141" stroke="#c75d49" stroke-width="6"/><path d="M-1-141l10-2" stroke="#e57b5b" stroke-width="4"/>
 <path d="M-6-71Q19-48 42-62M-7-61Q18-38 42-52M-7-51Q18-28 42-42" fill="none" stroke="#d3634a" stroke-width="4"/>
 <path d="M-3-69Q17-51 36-60M-3-59Q17-41 36-50M-3-49Q17-31 36-40" fill="none" stroke="#efbf8c" stroke-width="1.5"/>
 <path d="M-91 18v-27q0-7 8-7h9M94 5v-26q0-7 8-7h8" fill="none" stroke="#607e72" stroke-width="2"/><path d="M-81-16h9m32 0h9" stroke="#d9dfb4" stroke-width="3"/>
 <path d="M-55 33l17-3m-12 7 17-3m-12 7 17-3m-12 7 17-3" stroke="#eff1dc" stroke-width="3"/>
 <g class="campus-vehicle"><animateMotion path="M-55 10L15-3" dur="9s" begin="-4s" repeatCount="indefinite" keyPoints="0;1;1;0;0" keyTimes="0;.4;.5;.9;1" calcMode="linear"/><g transform="translate(73 30) rotate(-10)"><rect x="-15" y="-6" width="30" height="12" rx="4" fill="#dcb34f"/><path d="M-8-7l4-5h10l6 5Z" fill="#f2d57c"/><path d="M-3-10h8l4 4H-6Z" fill="#739695"/><circle cx="-9" cy="6" r="3" fill="#4f655b"/><circle cx="9" cy="6" r="3" fill="#4f655b"/></g></g>
 <g transform="translate(46 13) scale(.65)">${person('#6d9b99',false,'talk')}</g><g class="station-walker"><animateMotion path="M-62 21L-17 10" dur="8s" begin="-4s" repeatCount="indefinite" keyPoints="0;1;0" keyTimes="0;.5;1" calcMode="linear"/><g transform="scale(.8)">${person('#d6b254',true,'walk')}</g></g>
 </g>`;
 if(r.type==='museum')return `<g transform="translate(${x} ${y})" class="marine-museum">
 <path d="M-119 2L49-34 125 7-43 46Z" fill="#c8cfbf"/>
 <path d="M-111 8L48-26 111 9-49 43Z" fill="#dce1d2"/>
 <path d="M58-107L111-117v113L58 7Z" fill="#526564"/><path d="M111-117L130-105V7L111-4Z" fill="#3d5655"/><path d="M58-107l54-11 18 13-53 11Z" fill="#6a7c77"/>
 ${[0,1,2,3].map(i=>`<path d="M79 ${-91+i*23}l8-2v9l-8 2m16-13 8-2v9l-8 2" fill="#8ab1b3"/>`).join('')}
 <path d="M63-103l10-2v72l-10 2Z" fill="#78ada6"/><path d="M64-95l8 8-8 8 8 8-8 8" stroke="#d1d4a1" stroke-width="3" fill="none"/>
 <path d="M-31-116L63-135V-31L-31-11Z" fill="#83a7a6" stroke="#c0cfc3" stroke-width="2"/>
 <path d="M-31-116l-17-12 94-20 17 13Z" fill="#d0d5c7"/>
 ${Array.from({length:12},(_,i)=>`<path d="M${-28+i*8} ${-116-i*1.65}v101" stroke="#c9d7cb" stroke-width="1.3"/>`).join('')}
 <path d="M-30-91L63-110m-93 43 93-19m-93 43 93-19" stroke="#d5ddce" stroke-width="3"/>
 <path d="M-93-115L-31-128V-11L-93 2Z" fill="#d9dbcf" stroke="#a9b7ab" stroke-width="1.5"/>
 <path d="M-109-128L-93-115V2l-16-13Z" fill="#b3bfb3"/><path d="M-109-128l62-13 16 13-62 13Z" fill="#e7e7db"/>
 <path d="M-95-143L-35-156-35-130-95-117Z" fill="#6b9296" stroke="#bdc7ba" stroke-width="4"/>
 <path d="M-108-150L-48-163-35-156-95-143Z" fill="#d3d8ca"/>
 <path d="M-80-112v103m19-107v103" stroke="#c2c8b9" stroke-width="1"/><path d="M-91-88l58-12m-58 38 58-12m-58 38 58-12" stroke="#b9c2b5" stroke-width="1"/>
 <path d="M-74-101l12-3v43l-12 3Z" fill="#80acb1"/><path d="M-68-102v43m-6-21 12-3" stroke="#d9e0d3" stroke-width="1"/>
 <path d="M-30-126L-7-131V-37L-30-32Z" fill="#405a57"/>
 ${Array.from({length:9},(_,i)=>`<path d="M-30 ${-118+i*10}l23-5" stroke="#8b9e8d" stroke-width="2"/>`).join('')}
 <path d="M-24-126v91m9-93v91" stroke="#9eafa0" stroke-width="1.2"/>
 <path d="M-108-42L-22-60 1-42-91-23Z" fill="#abb7ab"/><path d="M-108-42l17 19V7l-11-6Z" fill="#7c9187"/><path d="M-91-23L1-42V-11L-91 7Z" fill="#3f6465"/>
 ${Array.from({length:10},(_,i)=>`<path d="M${-87+i*9} ${-24-i*1.8}l2 29" stroke="#9eb7ad" stroke-width="1.2"/>`).join('')}
 <path d="M-4-26L62-40v12L-4-14Z" fill="#cdd5c6"/><text x="29" y="-25" text-anchor="middle" transform="rotate(-12 29 -25)" font-size="6.5" font-weight="700" fill="#4a6760">國立海洋科技博物館</text>
 <path d="M-1-13L57-25v21L-1 8Z" fill="#5d8787"/>
 <path d="M7-14V6m14-23V3m14-23V0m14-23v20" stroke="#d0d7c6" stroke-width="2"/>
 <path d="M7 8L61-4 71 1 16 14Z" fill="#b3bdac"/><path d="M16 14L71 1v4L16 18Z" fill="#8c9e8d"/>
 <path d="M16 18L71 5l8 4-55 14Z" fill="#d5dccc"/>
 <path d="M-117 34L76-7 88 0-105 42Z" fill="#a8c9c1" fill-opacity=".8" stroke="#e1e9d8" stroke-width="1.5"/>
 ${Array.from({length:12},(_,i)=>`<path d="M${-112+i*16} ${35-i*3.4}v17m0-17 11-2" stroke="#e0e7d4" stroke-width="1.5"/>`).join('')}
 <path d="M-106 51L85 10" stroke="#aebda9" stroke-width="2"/>
 <path d="M87 15l20-4 13 7-21 5Z" fill="#83a175"/><path d="M-120 17l18-4 7 5-18 5Z" fill="#8aa97b"/>
 <path d="M94 12v-23" stroke="#7c8364" stroke-width="2.5"/><circle cx="94" cy="-15" r="10" fill="#64885e"/><circle cx="89" cy="-20" r="7" fill="#86a16c"/>
 <path d="M-115 13v-25" stroke="#799587" stroke-width="2"/><path d="M-118-12h8" stroke="#e8e5bd" stroke-width="3"/>
 <g><animateMotion path="M-39 17L11 6" dur="9s" begin="-3s" repeatCount="indefinite" keyPoints="0;1;0" keyTimes="0;.5;1" calcMode="linear"/><g transform="scale(.65)">${person('#d8b653',true,'walk')}</g></g>
 </g>`;
 if(r.type==='lighthouse')return `<g transform="translate(${x} ${y})" class="sandiaojiao-coast">
 <path d="M-117 0Q-104-31-63-29L68-24 123 4 97 31-48 45Z" fill="#aac18e"/>
 <path d="M-85 21Q-27 3 15 17T91 14" fill="none" stroke="#dfd7b5" stroke-width="11" stroke-linecap="round"/>
 <path d="M-82-28L7-46 34-29-55-9Z" fill="#f0efdc"/><path d="M-82-28v32l88-18v-32Z" fill="#d7ddcc"/><path d="M6-46l28 17V4L6-14Z" fill="#bdcebe"/>
 <path d="M-73-17l16-3V0l-16 3m37-28 16-3v20l-16 3" fill="#7e9890"/><path d="M13-30l11 6v18l-11-6Z" fill="#78938a"/>
 <path d="M-57-112Q-36-123-15-112V-15Q-36-4-57-15Z" fill="#eeefdf" stroke="#c5d0c0" stroke-width="1.3"/>
 <path d="M-29-115Q-21-115-15-112V-15q-7 4-14 5Z" fill="#d5decc"/>
 <path d="M-41-47h8v14h-8Z" fill="#81998f"/>
 <ellipse cx="-36" cy="-113" rx="30" ry="9" fill="#d4decc" stroke="#8da397" stroke-width="1.3"/>
 <path d="M-65-112v-12q30-16 59 0v12M-65-118q30-16 59 0" fill="none" stroke="#7a9388" stroke-width="1.1"/>
 ${[-60,-50,-39,-27,-16,-9].map(xx=>`<path d="M${xx}-116v-12" stroke="#7a9388" stroke-width="1"/>`).join('')}
 <g class="night-only lighthouse-beacon" aria-hidden="true"><g class="beacon-sweep"><animateTransform attributeName="transform" type="rotate" values="-17 -36 -137;17 -36 -137;-17 -36 -137" dur="9s" repeatCount="indefinite"/><path d="M-36-137L200-190 207-94Z" fill="url(#beacon-beam)"/><path d="M-36-137L190-153 194-131Z" fill="#fff3b9" opacity=".16"/></g></g>
 <path d="M-53-149Q-36-158-19-149v30q-17 8-34 0Z" fill="#b7cbbc" stroke="#819b90" stroke-width="1.5"/>
 <path d="M-45-152v33m10-35v37m10-35v33" stroke="#e1e7d4" stroke-width="1.5"/>
 <g class="night-only beacon-lamp"><ellipse cx="-36" cy="-136" rx="25" ry="31" fill="url(#lamp-halo)"/><ellipse cx="-36" cy="-136" rx="7" ry="11" fill="#fff3b9"/></g>
 <ellipse cx="-36" cy="-149" rx="20" ry="6" fill="#768c80"/>
 <path d="M-54-150Q-52-173-36-174Q-20-173-18-150Z" fill="#5b7065"/><path d="M-36-174v-9" stroke="#50675c" stroke-width="2"/><circle cx="-36" cy="-181" r="3" fill="#4c6257"/>
 <path d="M-62-143q26-12 52 0" fill="none" stroke="#b0c2b0" stroke-width="3"/>
 <path d="M-100 3Q-69 19-43 12" fill="none" stroke="#ecedd9" stroke-width="8"/><path d="M-100 3v18q27 14 55 8V12" fill="#d4ddc6" stroke="#b7c8b1" stroke-width="1"/>
 <path d="M-102-8l16-3 7 5v39l-16 3-7-5Z" fill="#e9ead5" stroke="#becbb5"/>
 <path d="M-101-8l16-3 7 5-16 3Z" fill="#f5f1df"/>
 <rect x="-98" y="-2" width="15" height="8" rx="1" fill="#649892"/><text x="-90" y="4" font-size="5" text-anchor="middle" fill="#f1f1d8">38</text>
 <text x="-91" y="10" writing-mode="tb" font-size="5" font-weight="700" fill="#516b5a">三貂角燈塔</text>
 <path d="M-75 17l27-6v20l-27 6Z" fill="#69867a"/><path d="M-71 16v19m7-21v19m7-21v19m7-21v19" stroke="#b1c3ab" stroke-width="1.5"/>
 <path d="M57 14V-91" stroke="#5a6752" stroke-width="5"/><circle cx="57" cy="-93" r="4" fill="#54614e"/>
 <path d="M57-84L8-106-3-101 8-89 57-67Z" fill="#826949" stroke="#5e624c"/><text x="28" y="-86" transform="rotate(24 28 -86)" text-anchor="middle" font-size="6" fill="#eeebcf">舊草嶺隧道</text>
 <path d="M57-66L119-89 130-83 120-73 57-50Z" fill="#8a7050" stroke="#5e624c"/><text x="91" y="-67" transform="rotate(-20 91 -67)" text-anchor="middle" font-size="6" fill="#eeebcf">舊草嶺環狀線</text>
 <path d="M57-45L119-68 132-62 120-52 57-29Z" fill="#927651" stroke="#5e624c"/><text x="92" y="-46" transform="rotate(-20 92 -46)" text-anchor="middle" font-size="7" fill="#f1ebcf">馬崗漁村</text>
 <text x="92" y="-39" transform="rotate(-20 92 -39)" text-anchor="middle" font-size="3.5" fill="#dcdac0">Magang Fishing Village</text>
 ${[[93,23],[104,16],[-108,26],[74,7]].map(([xx,yy])=>`<path d="M${xx-7} ${yy}q2-16 7-20v20q2-19 9-22l-5 22" fill="#71965e" stroke="#809e69" stroke-width="1"/>`).join('')}
 <path d="M104 31l11-5 9 6-4 7-14-1Z" fill="#8d9e89"/><path d="M-114 32l10-4 11 8-4 4-13-1Z" fill="#a6b099"/>
 <g class="coast-cyclist"><animateMotion path="M-23 27Q12 17 58 27" dur="11s" begin="-4s" repeatCount="indefinite" keyPoints="0;1;1;0" keyTimes="0;.43;.55;1" calcMode="linear"/>
 <circle cx="-9" cy="0" r="6" fill="none" stroke="#58766a" stroke-width="1.5"/><circle cx="10" cy="0" r="6" fill="none" stroke="#58766a" stroke-width="1.5"/><path d="M-9 0l7-10 5 10H-9m12 0 5-13m-10 3h9" fill="none" stroke="#b58555" stroke-width="1.5"/>
 <path d="M-1-12l4-10 6 5" stroke="#d6b45d" stroke-width="4" fill="none"/><path d="M0-11l-3 6 6 4m2-18 4 7" stroke="#617e70" stroke-width="2" fill="none"/><circle cx="4" cy="-27" r="4" fill="#e0ba91"/><path d="M0-29q4-7 9 0Z" fill="#7fa5a1"/>
 </g>
 </g>`;
 if(r.type==='village')return `<g transform="translate(${x} ${y})" class="sanxia-old-street">
 <path d="M-124 3L48-31 127 12-46 49Z" fill="#bcbba4"/><path d="M-109 13L52-20 112 12-49 46Z" fill="#cfcbbb"/>
 ${Array.from({length:8},(_,i)=>`<path d="M${-105+i*20} ${14-i*4.1}l58 32" stroke="#a9b09d" stroke-width="1"/>`).join('')}
 <path d="M-99 20L65-14m-149 43 164-34m-148 43 164-34" stroke="#e5ddc7" stroke-width="1"/>
 ${[[-102,-58,54,68],[-49,-78,64,79],[14,-49,46,59]].map(([xx,yy,ww,hh],index)=>`<g><path d="M${xx} ${yy}l${ww}-11v${hh}l-${ww} 11Z" fill="${index===1?'#aa7054':'#bc805c'}" stroke="#895f46" stroke-width="1.2"/>
 ${Array.from({length:Math.floor(hh/7)},(_,i)=>`<path d="M${xx+2} ${yy+6+i*7}l${ww-4}-${(ww-4)*.2}" stroke="#d19a75" stroke-width=".7"/>`).join('')}
 ${[0,1].map(i=>{let px=xx+8+i*(ww/2),py=yy+hh-2-i*(ww/10);return `<path d="M${px} ${py}v-24q8-17 16-3v24Z" fill="#4e6353" stroke="#d6a479" stroke-width="2"/>`;}).join('')}
 <path d="M${xx-2} ${yy-3}l${ww+4}-${ww*.2}v8l-${ww+4} ${ww*.2}Z" fill="#d3a27b"/>
 <path d="M${xx+5} ${yy-5}v-11l${ww-10}-${(ww-10)*.2}v11" fill="#b47b5c" stroke="#d7aa80" stroke-width="2"/>
 ${[0,1,2,3,4].map(i=>`<path d="M${xx+8+i*(ww-12)/5} ${yy-10-i*(ww-12)/25}l3-4 3 2-3 4Z" fill="#5b6851"/>`).join('')}
 ${index===1?`<path d="M${xx+6} ${yy+28}l${ww-12}-${(ww-12)*.2}v14l-${ww-12} ${(ww-12)*.2}Z" fill="#6a7860"/><path d="M${xx+ww/2} ${yy+23}v15" stroke="#c49a70" stroke-width="2"/><path d="M${xx+12} ${yy+2}l${ww-24}-${(ww-24)*.2}v11l-${ww-24} ${(ww-24)*.2}Z" fill="#d0b58c"/>`:''}</g>`).join('')}
 <path d="M60-137L103-146V-2L60 7Z" fill="#b37553" stroke="#875f47" stroke-width="1.5"/><path d="M103-146l22 14V12L103-2Z" fill="#926447"/><path d="M60-137l43-9 22 14-43 9Z" fill="#c49b75"/>
 <path d="M57-142L104-152l24 15" stroke="#d4ab83" stroke-width="3" fill="none"/>
 ${[-114,-78,-41].map(yy=>`<path d="M65 ${yy}l33-7" stroke="#775c46" stroke-width="2"/><path d="M67 ${yy+5}l10-2v22l-10 2m10-13 20-4" fill="#657b64" stroke="#d0a179" stroke-width="1.3"/><path d="M86 ${yy+1}l10-2v22l-10 2Z" fill="#657b64" stroke="#d0a179" stroke-width="1.3"/>`).join('')}
 <path d="M59-18l46-9 11 8-47 10Z" fill="#6c947b"/><path d="M61-13l46-9v5l-46 9Z" fill="#cfb08a"/>
 <path d="M70-8v14m21-18V2" stroke="#e0b68d" stroke-width="3"/>
 <path d="M-109-91Q0-52 115-100M-104-49Q-4-16 109-57" fill="none" stroke="#6a887c" stroke-width="1"/>
 ${[[-92,-87],[-52,-76],[-8,-70],[37,-77],[82,-90],[-84,-43],[-40,-31],[5,-31],[50,-38],[91,-50]].map(([xx,yy],i)=>`<g><animateTransform attributeName="transform" type="rotate" values="-4 ${xx} ${yy};4 ${xx} ${yy};-4 ${xx} ${yy}" dur="${4+i*.3}s" repeatCount="indefinite"/><path d="M${xx} ${yy}v7" stroke="#738d7d"/><ellipse cx="${xx}" cy="${yy+14}" rx="7" ry="9" fill="${i%2?'#719fab':'#5c91a3'}"/><path d="M${xx-3} ${yy+6}q-3 8 0 16m6-16q3 8 0 16" stroke="#9ebdb9" stroke-width=".7" fill="none"/></g>`).join('')}
 <path d="M-8-70v22l13 8 1-28Z" fill="#6995a4"/><text x="-1" y="-58" writing-mode="tb" font-size="4" fill="#dfe8d1">三峽</text>
 <path d="M-91 3l12-2v16l-12 2Z" fill="#6b8f9e"/><text x="-85" y="8" text-anchor="middle" font-size="4" fill="#e8e3c4">藍染</text>
 <path d="M15 6l15-3 8 4-15 3Z" fill="#b29166"/><path d="M20 3v-12m11 10v-12" stroke="#9b8060" stroke-width="1.5"/><path d="M16-10l19-4v11l-19 4Z" fill="#6894a2"/>
 ${[[-108,14],[-62,21],[48,1],[102,16]].map(([xx,yy])=>`<path d="M${xx-4} ${yy-5}h8l-1 8h-6Z" fill="#ad7c57"/><circle cx="${xx}" cy="${yy-10}" r="7" fill="#789261"/>`).join('')}
 <g><animateMotion path="M-45 29L23 14" dur="10s" begin="-3s" repeatCount="indefinite" keyPoints="0;1;0" keyTimes="0;.5;1" calcMode="linear"/><g transform="scale(.7)">${person('#d6b355',true,'walk')}</g></g>
 </g>`;
 if(r.type==='hub')return `<g transform="translate(${x} ${y})" class="taipei-transport-hub">
 <path d="M-128 0L61-39 132 8-58 51Z" fill="#c2cbb7"/>
 <path d="M-114 4L57-31 111 4-61 43Z" fill="#d6c9ad"/>
 <path d="M-98-83L71-117V-32L-98 2Z" fill="#bba881"/><path d="M71-117l37 24v84L71-32Z" fill="#9b9677"/>
 <path d="M-93-69L69-102v58L-93-11Z" fill="#57665a"/>
 ${Array.from({length:16},(_,i)=>`<path d="M${-88+i*10} ${-73-i*2.02}v65" stroke="#d2c4a0" stroke-width="3"/>`).join('')}
 <path d="M-97-28L72-62v12L-97-16Z" fill="#d2c09b"/><path d="M-97-57L72-91v7L-97-50Z" fill="#9d9776"/>
 <path d="M78-105v68m10-61v68m10-61v68" stroke="#c0b896" stroke-width="3"/>
 <path d="M-114-91L75-130 121-100-68-59Z" fill="#985c4b"/>
 <path d="M-86-127L45-153 75-130-114-91Z" fill="#d59077"/>
 <path d="M-86-127L45-153 88-123-42-96Z" fill="#c57c65"/>
 <path d="M-86-127L-114-91-68-59-42-96Z" fill="#b96d58"/>
 <path d="M45-153L88-123 121-100 75-130Z" fill="#af6b57"/>
 <path d="M-114-91L-68-59 121-100" stroke="#f0d9ba" stroke-width="3" fill="none"/>
 <path d="M-86-127L45-153 88-123" stroke="#f5dfbf" stroke-width="2" fill="none"/>
 <path d="M-26-12L19-21V-2L-26 7Z" fill="#d6caa7"/><path d="M-20-10l33-7v15l-33 7Z" fill="#73928a"/>
 <text x="-4" y="-23" transform="rotate(-11 -4 -23)" text-anchor="middle" font-size="9" font-weight="700" fill="#f1e5c6">臺北車站</text>
 <path d="M-37 9L27-4 40 3-24 17Z" fill="#e4d9bb"/><path d="M-24 17L40 3v4L-24 21Z" fill="#a7aa90"/><path d="M-24 21L40 7l10 5-65 14Z" fill="#d9d0b3"/>
 <path d="M-95 18L-49 9-32 19-79 29Z" fill="#b2ad90"/><path d="M-89 18L-52 11-42 18-79 25Z" fill="#9fb295"/>
 <path d="M51 5L87-3 103 7 66 15Z" fill="#aab496"/><path d="M-77 34L-41 27-30 34-66 41Z" fill="#acb59a"/>
 <path d="M-115 30L84-11 128 15-71 58Z" fill="none" stroke="#81988d" stroke-width="13"/>
 <path d="M-114 30L84-11 128 15-71 58" fill="none" stroke="#e6d9a0" stroke-width="1.4" stroke-dasharray="8 6"/>
 <path d="M-99 24l11-2m-8 5 11-2m-8 5 11-2m64 14 11-2m-8 5 11-2m-8 5 11-2" stroke="#f1eed8" stroke-width="2"/>
 ${[[-95,5],[-65,29],[82,-4],[112,13]].map(([xx,yy])=>`<path d="M${xx} ${yy}v-20" stroke="#718c7b" stroke-width="2"/><circle cx="${xx}" cy="${yy-21}" r="3" fill="#e4dfb4"/>`).join('')}
 ${[[-72,17],[77,4],[-53,33]].map(([xx,yy])=>`<path d="M${xx} ${yy}v-19" stroke="#877e55" stroke-width="2"/><circle cx="${xx}" cy="${yy-25}" r="10" fill="#6d8e5e"/><circle cx="${xx-4}" cy="${yy-29}" r="6" fill="#92aa74"/>`).join('')}
 <g><animateMotion path="M-59 48L50 26" dur="11s" begin="-3s" repeatCount="indefinite" keyPoints="0;1;1;0" keyTimes="0;.42;.56;1" calcMode="linear"/><g transform="rotate(-12)"><rect x="-19" y="-7" width="38" height="14" rx="4" fill="#ecdbaf" stroke="#748f7d"/><path d="M-16-4h27v6h-27Z" fill="#759e99"/><path d="M-8-4v6m8-6v6" stroke="#d5d9bb"/><path d="M-17 4h33" stroke="#bd7458" stroke-width="3"/><circle cx="-11" cy="8" r="3" fill="#4b6357"/><circle cx="12" cy="8" r="3" fill="#4b6357"/></g></g>
 <g><animateMotion path="M89-3L115 14" dur="8s" repeatCount="indefinite" keyPoints="0;1;0" keyTimes="0;.5;1" calcMode="linear"/><g transform="rotate(30)"><rect x="-11" y="-5" width="22" height="10" rx="3" fill="#dcb650"/><path d="M-6-6h11v5H-6Z" fill="#779b90"/><circle cx="-6" cy="5" r="2.5" fill="#506859"/><circle cx="7" cy="5" r="2.5" fill="#506859"/></g></g>
 <g><animateMotion path="M-38 20L11 10" dur="8s" begin="-2s" repeatCount="indefinite" keyPoints="0;1;0" keyTimes="0;.5;1" calcMode="linear"/><g transform="scale(.65)">${person('#d9b758',true,'walk')}</g></g>
 </g>`;
 return `<g transform="translate(${x} ${y})" class="harbor-station-port">
 <defs><clipPath id="harbor-glass"><path d="M-109-91Q-61-117-12-86L-25-5Q-63 12-97-11Z"/></clipPath></defs>
 <path d="M-126 8L43-27 132 13-39 48Z" fill="#c1c7b4"/><path d="M-116 10L21-19 44-8-94 24Z" fill="#d9ddcc"/>
 <path d="M-14-83L34-66V-7L-25-5Z" fill="#bdc7bc"/><path d="M-5-64l37 13v31L-12-34Z" fill="#759d9b"/><path d="M3-62v31m11-27v30m11-26v30" stroke="#d0d9c9" stroke-width="2"/>
 <path d="M-109-91Q-61-117-12-86L-25-5Q-63 12-97-11Z" fill="#526f6b" stroke="#c3cec0" stroke-width="2"/>
 <g clip-path="url(#harbor-glass)" stroke="#b5cbbd" stroke-width="1.2">
 ${Array.from({length:10},(_,i)=>`<path d="M${-160+i*19}-119l78 145M${-160+i*19}-119l-70 145"/>`).join('')}
 <path d="M-117-66Q-63-84-8-63M-110-30Q-62-48-17-27" fill="none" stroke="#87a99b"/>
 </g>
 <path d="M-116-100Q-79-152-28-122Q-8-117 3-98L-12-83Q-66-115-108-84Z" fill="#9fa99c" stroke="#6d8177" stroke-width="2"/>
 <path d="M-115-100Q-74-135-22-109L-9-95Q-65-118-108-92Z" fill="#d2d7c9"/>
 <path d="M-106-91Q-65-113-15-89" stroke="#e0e4d5" stroke-width="2" fill="none"/>
 <path d="M-95-99l21-21 29 12m-27-12 5 22m22-11 18 20" stroke="#566f65" stroke-width="2" fill="none"/>
 <path d="M-72-16l20-4v25l-20 4Z" fill="#8eb5aa" stroke="#e2e7d7" stroke-width="1.5"/><path d="M-62-18V7" stroke="#dce4d4" stroke-width="1.5"/>
 <text x="-57" y="-29" text-anchor="middle" font-size="9" font-weight="700" fill="#f4f0d6">基隆車站</text>
 <path d="M-13-24L34-10 51-2-3-17Z" fill="#9bbeb1" stroke="#d6e1cf"/><path d="M0-16V7m17-17v22m16-17v22" stroke="#829b8c" stroke-width="2"/>
 <path d="M-100 30L38 2 49 9-88 38Z" fill="#869b90"/><path d="M-94 35L42 7" stroke="#e7d99f" stroke-width="1.5" stroke-dasharray="10 7"/>
 <path d="M22-3L123 3 120 26 23 19Z" fill="#9caa97"/><path d="M25 0L122 6" stroke="#e2d5ab" stroke-width="3"/>
 ${[[43,-43,'#738f99'],[68,-38,'#a86a54'],[95,-34,'#91a188'],[58,-20,'#b29861'],[84,-16,'#6d9797']].map(([xx,yy,col])=>`${box(xx,yy,29,15,15,col,col)}<path d="M${xx-10} ${yy-17}v9m5-11v9m5-11v9m5-11v9" stroke="#d1d1af" stroke-width=".8"/>`).join('')}
 ${[[39,-88,'#638f9c'],[85,-75,'#b36952']].map(([xx,yy,col])=>`<g><path d="M${xx-16} ${yy+83}v-112h46v7h-39v105m-7-89 40 20m-40-29 40 20m-34 78 25-78m-28-16 35-10" stroke="${col}" stroke-width="4" fill="none"/></g>`).join('')}
 <path d="M-4 33Q57 19 126 36L118 56Q46 65-8 46Z" fill="#79a9a4" opacity=".65"/>
 <g class="cargo-ship" id="loading-ship">
 <path d="M4 31L109 31 97 48 18 48Z" fill="#405c58"/><path d="M17 45h80" stroke="#a96b51" stroke-width="3"/>
 <path d="M16 17h16v17H16Z" fill="#eee6c9"/><path d="M12 14h22v5H12Z" fill="#e6e7d1"/><path d="M20 10h7v6h-7Z" fill="#dbdfc9"/><path d="M18 21h11" stroke="#799d95" stroke-width="3"/>
 ${[[41,20,'#a77457'],[62,20,'#759b98'],[83,20,'#b5a16b'],[62,8,'#b46e55']].map(([xx,yy,col],i)=>`<g class="loaded-container" data-cargo="${i}" opacity="0"><rect x="${xx}" y="${yy}" width="19" height="12" fill="${col}" stroke="#e2d1a5" stroke-width=".5"/><path d="M${xx+4} ${yy+2}v8m5-8v8m5-8v8" stroke="#dfd5b3" stroke-width=".7"/></g>`).join('')}
 <path d="M-1 51q22 5 42 0m35 3q20 3 37-2" stroke="#e3eee0" stroke-width="2" fill="none"/></g>
 ${[0,1].map(i=>`<g class="loading-rig" data-rig="${i}"><rect class="trolley" x="${i?91:64}" y="${i?-100:-113}" width="8" height="6" fill="#d6ba79"/><line class="hoist-cable" x1="${i?95:68}" y1="${i?-97:-110}" x2="${i?95:68}" y2="-65" stroke="#426b64" stroke-width="1"/><g class="spreader" transform="translate(${i?95:68} -65)"><path d="M-10 0H10m-9 0v4m18-4v4" fill="none" stroke="#e0b453" stroke-width="2"/></g><g class="carried-container" opacity="0"><rect x="-9.5" width="19" height="12" fill="${i?'#b46e55':'#759b98'}" stroke="#dfd5b3" stroke-width=".7"/><path d="M-5 2v8m5-8v8m5-8v8" stroke="#e5d9b6" stroke-width=".7"/></g></g>`).join('')}
 <text id="port-status" x="45" y="-145" text-anchor="middle" font-size="6" font-weight="700" fill="#456c61">靠泊待裝 · 0 / 4 櫃</text>
 <path d="M-119 11v-24m0 0h8" stroke="#6d897a" stroke-width="2"/>
 <g transform="translate(-100 22) scale(.65)">${person('#d5b557',true,'observe')}</g>
 </g>`;
}
function nameplate(r){let x=r.x-83,y=r.y+55;return `<g class="nameplate"><path d="M${r.x} ${y}v-18" stroke="#7b8b71" stroke-width="2"/><rect class="plate" x="${x}" y="${y}" width="166" height="49" rx="20"/><text class="node-number" x="${x+13}" y="${y+24}">${r.no}</text><text x="${x+43}" y="${y+23}">${r.name}</text><text class="node-sub" x="${x+43}" y="${y+39}">${r.location.split('，')[0].slice(0,10)}</text></g>`;}
function islandGround(x,y,kind='green'){
 const grass=kind==='coast'?'#b5c8a0':kind==='culture'?'#b3c28f':'#abc798';
 const shore='M-143 -7Q-155 -31 -108 -48L-32 -77Q5 -86 47 -66L115 -43Q155 -29 148 -1L127 31Q113 48 72 52L8 75Q-22 81 -52 62L-119 37Q-158 25 -143 -7Z';
 return `<g transform="translate(${x} ${y})" class="island-ground"><ellipse cx="0" cy="27" rx="156" ry="76" fill="#68a9a4" opacity=".12"/><path d="${shore}" transform="translate(0 21)" fill="#9cab82"/><path d="${shore}" fill="#e8dfb9" stroke="#f3e6c3" stroke-width="4"/><path d="M-129 -10Q-139 -29 -100 -37L-29 -62Q3 -72 44 -52L108 -31Q140 -21 133 0L114 22Q104 36 65 39L6 60Q-19 66 -45 49L-107 25Q-143 14 -129 -10Z" fill="${grass}"/><path d="M-101 17Q-46 45 12 29T104 -1" fill="none" stroke="#dad1ad" stroke-width="10" stroke-linecap="round"/><path d="M-152 50q25 9 49 1m157 17q40 5 72-17" fill="none" stroke="#eaf6e6" stroke-width="2" opacity=".7"/></g>`;
}
function person(color='#e2b851',hat=true,gesture='walk'){
 return `<ellipse cy="3" rx="7" ry="3" fill="#3d665426"/><path d="M-2 -5L-4 2M2 -5L5 2" stroke="#455e5a" stroke-width="3" stroke-linecap="round">${gesture==='walk'?'<animateTransform attributeName="transform" type="rotate" values="-10 0 -5;10 0 -5;-10 0 -5" dur=".6s" repeatCount="indefinite"/>':''}</path><path d="M-4 -16Q0 -19 4 -16L5 -6H-5Z" fill="${color}"/><path d="M-3 -15v8m6-8v8" stroke="#fff3c5" stroke-width="1.2"/><rect x="-7" y="-16" width="4" height="9" rx="2" fill="#6d9696"/><path d="M-5 -14L-8 -8" stroke="#e2b58d" stroke-width="2.8" stroke-linecap="round"/><path d="M5 -14L9 ${gesture==='observe'?'-19':'-9'}" stroke="#e2b58d" stroke-width="2.8" stroke-linecap="round">${gesture==='talk'?'<animateTransform attributeName="transform" type="rotate" values="0 5 -14;-35 5 -14;0 5 -14" dur="2.3s" repeatCount="indefinite"/>':''}</path><circle cy="-22" r="5.3" fill="#e4bb94"/><path d="M-5 -24Q-4 -30 1 -28Q6 -28 6 -23Z" fill="#515f53"/>${hat?'<path d="M-7 -24Q-6 -31 0 -31Q6 -31 7 -24Z" fill="#e4c461"/><path d="M-8 -23H8" stroke="#c9a447" stroke-width="2"/>':''}${gesture==='observe'?'<rect x="7" y="-22" width="6" height="4" rx="1" fill="#526f74"/>':''}`;
}
function people(x,y,index){
 const tracks=['M-108 1Q-80 32 -41 33Q-19 25 0 12','M92 -14Q113 16 75 34Q49 43 24 37','M-86 22Q-61 44 -25 34Q-7 30 9 18'];
 return `<g class="people" transform="translate(${x} ${y})" aria-hidden="true"><g class="walker">${person('#ddb650')}<animateMotion path="${tracks[index%3]}" dur="${11+index}s" begin="-${index+2}s" repeatCount="indefinite" keyPoints="0;1;1;0;0" keyTimes="0;.42;.52;.94;1" calcMode="linear"/></g><g class="walker">${person('#d38a68')}<animateMotion path="${tracks[(index+1)%3]}" dur="${14+index}s" begin="-${index+5}s" repeatCount="indefinite" keyPoints="0;1;1;0" keyTimes="0;.46;.55;1" calcMode="linear"/></g><g transform="translate(77 13)">${person('#6f9e9d',true,'observe')}</g><g transform="translate(-63 12)">${person('#d38a68',false,'talk')}</g><g transform="translate(-47 20)">${person('#e2bd55',true,'talk')}</g></g>`;
}
function railway(trainsOnly=false){
 const segments=['M220 430 Q180 490 220 550','M430 655 Q470 690 505 710','M775 718 Q845 710 900 662','M1085 540 Q1140 470 1085 385','M815 310 Q840 300 865 310','M450 340 Q480 320 520 315','M430 575 Q490 545 525 520','M770 505 Q830 515 880 550','M660 555 Q690 600 660 625','M1000 680 Q1040 725 1000 775','M865 850 Q810 810 775 750'];
 const loop=segments.join(' ');
 const circuit='M300 620 L220 550 Q180 490 220 430 L305 360 L450 340 Q480 320 520 315 L665 300 L815 310 Q840 300 865 310 L1010 310 L1085 385 Q1140 470 1085 540 L1000 595 L1000 680 Q1040 725 1000 775 L1000 850 L865 850 Q810 810 775 750 L640 700 L660 625 Q690 600 660 555 L635 479 L525 520 Q490 545 430 575 L300 620Z';
 const branch='';
 function track(d){return `<path class="bridge-shadow" d="${d}" transform="translate(0 12)"/><path class="bridge-deck" d="${d}"/><path class="sleepers" d="${d}"/><path class="rail-outer" d="${d}"/><path class="rail-inner" d="${d}"/>`;}
 const piers=[[200,490],[470,690],[842,705],[1110,465],[485,325],[485,545],[825,515],[674,594]].map(([x,y])=>`<g class="bridge-pier"><path d="M${x-7} ${y}v25l7 5 7-5v-25" fill="#73978d"/><ellipse cx="${x}" cy="${y+30}" rx="15" ry="4" fill="#629f9b" opacity=".22"/></g>`).join('');
 const train=(begin,color,path=loop,duration=65,shuttle=false)=>`<g class="island-train" aria-hidden="true"><g transform="scale(1.1)"><rect x="-32" y="-7" width="27" height="14" rx="4" fill="#a4d6c8" stroke="#547b74" stroke-width="1.5"/><path d="M-29 2h21" stroke="#d2e8d8" stroke-width="3"/><path d="M-27-3h5m4 0h5" stroke="#385b59" stroke-width="4"/><rect x="-2" y="-7" width="31" height="14" rx="5" fill="#a4d6c8" stroke="#547b74" stroke-width="1.5"/><path d="M23-6q6 1 6 6v5h-6Z" fill="#d7e8d9"/><path d="M-28-8H-8M2-8H20" stroke="#899b92" stroke-width="3"/><circle cx="26" cy="4" r="1" fill="#f2dca1"/><path d="M1 2h24" stroke="#d2e8d8" stroke-width="3"/><path d="M3-3h5m4 0h5m5-1h3" stroke="#385b59" stroke-width="4"/><path d="M-5 0h3" stroke="#547b74" stroke-width="2"/></g><animateMotion path="${path}" dur="${duration}s" begin="${begin}s" rotate="auto" repeatCount="indefinite" ${shuttle?'keyPoints=".4;.6;.6;.4;.4" keyTimes="0;.43;.5;.93;1" calcMode="linear"':''}/></g>`;
 if(trainsOnly)return `<g class="rail-vehicles" aria-hidden="true">${train(0,'#ce7955',circuit,52)}${train(-17.33,'#609b96',circuit,52)}${train(-34.66,'#d6a64a',circuit,52)}</g>`;
 return `<g class="connections" aria-label="串聯小島的跨海鐵道">${piers}${track(loop)}</g>`;
}
function platform(r){return `<g class="station-platform" aria-hidden="true" transform="translate(${r.x-30} ${r.y+40})"><rect x="-22" y="-7" width="44" height="10" rx="3" fill="#f5e4be" stroke="#c1ac7d"/><path d="M-19-5h38" stroke="#d49557" stroke-width="2"/><path d="M-14-8v-13m28 13v-13" stroke="#6e8a79" stroke-width="2"/><path d="M-24-21h48l-5-6h-38Z" fill="#638e80"/><rect x="-9" y="-19" width="18" height="8" rx="2" fill="#fff4da"/><text y="-12" text-anchor="middle" font-size="6" fill="#496c5e">${r.no} 站</text></g>`;}
function nightFacilities(x,y){return `<g class="night-only night-facilities" aria-hidden="true" transform="translate(${x} ${y})">${[[-109,14],[101,18]].map(([xx,yy])=>`<ellipse cx="${xx}" cy="${yy}" rx="26" ry="11" fill="url(#ground-halo)"/><path d="M${xx} ${yy}v-27" stroke="#8eab92" stroke-width="2"/><circle cx="${xx}" cy="${yy-28}" r="16" fill="url(#lamp-halo)"/><circle cx="${xx}" cy="${yy-28}" r="3.4" fill="#ffebae"/>`).join('')}</g>`;}
function illuminateWindows(){
 const selectors=['.changxing-campus [fill="#625f4b"]','.changxing-campus [fill="#596d5b"]','.heritage-station [fill="#4c5747"]','.qidu-modern-station [fill="#719a9d"]','.qidu-modern-station [fill="#7a9fa0"]','.qidu-modern-station [fill="#5d7971"]','.marine-museum [fill="#83a7a6"]','.marine-museum [fill="#3f6465"]','.marine-museum [fill="#80acb1"]','.sanxia-old-street [fill="#4e6353"]','.sanxia-old-street [fill="#657b64"]','.taipei-transport-hub [fill="#57665a"]','.harbor-station-port [clip-path="url(#harbor-glass)"]','.sandiaojiao-coast [fill="#b7cbbc"]'];
 document.querySelectorAll(selectors.join(',')).forEach(el=>el.classList.add('night-window'));
 document.querySelectorAll('.harbor-station-port > path[fill="#526f6b"]').forEach(el=>el.classList.add('night-window'));
}
function draw(){
 const waves=Array.from({length:30},(_,i)=>{let x=55+(i*113)%1090,y=290+(i*91)%520;return `<path class="water-line" d="M${x} ${y}q10 5 20 0m10 0q8 4 17 0" stroke="#eff9e8" fill="none" opacity=".5" stroke-width="2" style="animation-delay:${i/4}s"/>`;}).join('');
 const central=`${islandGround(635,479)}<g transform="translate(581 471) scale(.53) translate(-575 -453)">${school()}</g><g transform="translate(714 476) scale(.49) translate(-300 -620)">${building({x:300,y:620,type:'station'})}</g><path d="M619 474L650 486" stroke="#e6dbb6" stroke-width="8" stroke-dasharray="3 3"/><text x="715" y="493" text-anchor="middle" font-size="10" fill="#386052" font-weight="700">台鐵七堵站</text>${tree(524,476,.48)}${nightFacilities(635,479)}<g class="school-tag"><rect x="542" y="536" width="186" height="25" rx="12" fill="#fffaf0"/><text x="635" y="553" text-anchor="middle" font-size="11" font-weight="700" fill="#386052">長興國小 × 七堵車站・出發點</text></g>`;
 const nodes=routes.slice().sort((a,b)=>a.y-b.y).map((r,i)=>`<g class="node" data-node="${r.id}" tabindex="0" role="button" aria-label="探索${r.name}：${r.title}" aria-pressed="false">${islandGround(r.x,r.y,r.zone==='ocean'?'coast':r.zone==='city'?'culture':'green')}<g transform="translate(${r.x} ${r.y}) scale(.83) translate(${-r.x} ${-r.y})">${building(r)}</g>${r.type==='safety'?'':tree(r.x-103,r.y-28,.65)}${['lighthouse','safety'].includes(r.type)?'':tree(r.x+111,r.y-15,.55)}${nightFacilities(r.x,r.y)}${people(r.x,r.y,i)}${platform(r)}${nameplate(r)}</g>`).join('');
 $('#island').innerHTML=`<defs><radialGradient id="lamp-halo"><stop stop-color="#ffe8a0" stop-opacity=".7"/><stop offset="1" stop-color="#ffdf85" stop-opacity="0"/></radialGradient><radialGradient id="ground-halo"><stop stop-color="#ffdf8a" stop-opacity=".38"/><stop offset="1" stop-color="#ffdf8a" stop-opacity="0"/></radialGradient><linearGradient id="beacon-beam" gradientUnits="userSpaceOnUse" x1="-36" y1="-137" x2="205" y2="-140"><stop stop-color="#fff4b6" stop-opacity=".72"/><stop offset="1" stop-color="#fff4b6" stop-opacity="0"/></linearGradient></defs>${waves}<g id="viewport">${railway()}${railway(true)}<g data-school="true" role="button" tabindex="0" aria-label="放大長興國小與七堵車站" style="cursor:pointer">${central}</g>${nodes}<g class="night-only guided-vessel" aria-hidden="true"><g><animateMotion path="M1100 177Q1140 200 1170 177" dur="17s" repeatCount="indefinite" keyPoints="0;1;0" keyTimes="0;.5;1" calcMode="linear"/><ellipse cy="15" rx="32" ry="8" fill="#a3c5af" opacity=".14"/><path d="M-28 4H28L17 17H-17Z" fill="#a7c6bb"/><path d="M-13-9h22V5h-22Z" fill="#d1ddc8"/><path d="M-9-6H5v6H-9Z" fill="#ffe3a0"/><path d="M0-9v-13" stroke="#a9c1ad" stroke-width="2"/><circle cy="-23" r="2" fill="#fff2bc"/><circle cx="-22" cy="4" r="2" fill="#d68b6b"/><circle cx="22" cy="4" r="2" fill="#9ed6ba"/><path d="M-23 23q23 6 46 0" stroke="#cadbd0" stroke-width="2" opacity=".5" fill="none"/></g></g><g class="boat"><path d="M837 705l68 1-17 16-44-3Z" fill="#f5ecd3"/><path d="M851 692h32v16h-32Z" fill="#d9d9bc"/><path d="M861 684h6v9h-6Z" fill="#d28a61"/><path d="M835 730q18 6 38 0" stroke="#e7f4df" stroke-width="2" fill="none"/></g><g transform="translate(117 685)"><path d="M0 0l28 17L0 9l-28 8Z" fill="#5e8a7b"/><text x="0" y="-12" text-anchor="middle" fill="#65877a" font-size="12">N</text></g></g>`;
 const schoolNode=$('[data-school]');schoolNode.addEventListener('click',()=>focusSchool());schoolNode.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();focusSchool();}});
 illuminateWindows();
 document.querySelectorAll('[data-node]').forEach(node=>{node.addEventListener('click',()=>openRoute(node.dataset.node));node.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();openRoute(node.dataset.node);}});});
}

let portClock=0,portLast=null;
function animatePort(now){
 const running=active==='rail-harbor'&&zoom>=1.6&&!$('#ocean').classList.contains('paused')&&!$('#ocean').classList.contains('reduced-motion');
 if(running&&portLast!==null)portClock+=Math.min((now-portLast)/1000,.1);
 portLast=now;
 const t=portClock%43,loading=t<28,step=Math.min(3,Math.floor(t/7)),p=t%7;
 const slots=[[50.5,20],[71.5,20],[92.5,20],[71.5,8]];
 const deposited=loading?step+(p>=5.1?1:0):t<38?4:0;
 document.querySelectorAll('.loaded-container').forEach((el,i)=>el.setAttribute('opacity',i<deposited?'1':'0'));
 const ship=$('#loading-ship');let sx=0,sy=0,opacity=1;
 if(t>=30&&t<38){const k=(t-30)/8;sx=230*k;sy=-40*k;opacity=1-Math.max(0,(k-.7)/.3);}
 if(t>=38){const k=(t-38)/5;sx=-170*(1-k);sy=30*(1-k);opacity=Math.min(1,k*3);}
 ship.setAttribute('transform',`translate(${sx} ${sy})`);ship.setAttribute('opacity',opacity);
 document.querySelectorAll('.loading-rig').forEach((rig,i)=>{
 const sourceX=i?95:68,top=i?-97:-110;let xx=sourceX,yy=-65,carrying=false;
 if(loading&&i===step%2){const [destX,destY]=slots[step];
 if(p<1.2)yy=-65+33*p/1.2;
 else if(p<2){yy=-32-42*(p-1.2)/.8;carrying=true;}
 else if(p<3.7){xx=sourceX+(destX-sourceX)*(p-2)/1.7;yy=-74;carrying=true;}
 else if(p<5.1){xx=destX;yy=-74+(destY+74)*(p-3.7)/1.4;carrying=true;}
 else if(p<6.2){xx=destX;yy=destY+(-74-destY)*(p-5.1)/1.1;}
 else {xx=destX+(sourceX-destX)*(p-6.2)/.8;yy=-74;}
 }
 const cable=rig.querySelector('.hoist-cable');cable.setAttribute('x1',xx);cable.setAttribute('x2',xx);cable.setAttribute('y2',yy);
 rig.querySelector('.trolley').setAttribute('x',xx-4);
 rig.querySelector('.spreader').setAttribute('transform',`translate(${xx} ${yy})`);
 const cargo=rig.querySelector('.carried-container');cargo.setAttribute('transform',`translate(${xx} ${yy})`);cargo.setAttribute('opacity',carrying?'1':'0');
 });
 $('#port-status').textContent=t<28?`裝船中 · ${Math.min(deposited,4)} / 4 櫃`:t<30?'裝載完成 · 準備離港':t<38?'滿載離港 →':'空船進港 · 下一輪裝載';
 requestAnimationFrame(animatePort);
}
function updateRead(){ $('#read-count').textContent=`${visited.size} / ${routes.length}`; }
function renderList(){
 const shown=routes.filter(r=>(filter==='all'||r.zone===filter)&&(`${r.name} ${r.title} ${r.location} ${r.summary} ${r.tasks.join(' ')}`.toLowerCase().includes(query)));
 $('#result-count').textContent=query||filter!=='all'?`找到 ${shown.length} 個探索入口`:'六條學習路線 · 一座安全資源島';
 $('#route-index').innerHTML=shown.length?shown.map(r=>`<button class="route-card" data-route="${r.id}"><span class="route-no">${r.no}</span><span><strong>${r.name}</strong><small>${esc(roleRouteSubtitle(r))}</small></span><span class="read-mark">${visited.has(r.id)?'已讀':'↗'}</span></button>`).join(''):'<p class="empty">沒有符合的路線。<br>試試「七堵」「海洋」「交通」，或切回所有路線。</p>';
 $('#route-index').querySelectorAll('[data-route]').forEach(b=>b.addEventListener('click',()=>openRoute(b.dataset.route)));
 document.querySelectorAll('[data-node]').forEach(n=>{let matches=shown.some(r=>r.id===n.dataset.node);n.classList.toggle('dimmed',!matches);n.setAttribute('tabindex',matches?'0':'-1');});updateRead();
}
const activityRecords={
 'home-rail':{title:'家鄉鐵道｜從七堵出發',text:'現有資料收錄《我的家鄉線》影片；下方照片為猴硐鐵道相關場域影像，可連結家鄉鐵道與周邊地景的討論。',photos:[['home.jpg','猴硐鐵道場域影像']]},
 marine:{title:'海洋探索｜海科館學習足跡',text:'現有活動照片收錄師生在海科館大廳的合影，搭配本路線的步道觀察、展館探索與手作任務閱讀。',photos:[['marine-nmmst.png','海科館大廳師生活動合影']]},
 'rail-harbor':{title:'港都與礦業｜港灣與猴硐紀錄',text:'現有成果包含遊基隆港與猴硐活動照片，呈現這條路線的港灣及鐵道場域。',photos:[['harbor.jpg','遊基隆港活動照片'],['harbor-extra.jpg','遊基隆港另一個視角'],['home.jpg','猴硐活動照片']]},
 sanxia:{title:'產業文化｜三峽走讀紀錄',text:'現有成果收錄三峽活動照片，可與老街、地方產業及文化探索任務對照閱讀。',photos:[['culture.jpg','三峽活動照片']]},
 'multi-rail':{title:'智慧交通｜捷運行控中心見習',text:'現有成果收錄捷運行控中心照片，對應路線中的交通運作與安全移動探究。',photos:[['transit.jpg','捷運行控中心活動照片']]},
 'metro-tech':{title:'極東海岸｜山海探索紀錄',text:'現有資料包含《極東點探險》影片及本路線相關照片，可與福隆、馬崗及三貂角的課程任務一同閱讀。',photos:[['coast.jpg','極東海岸課程相關照片']]}
};
function activitySection(id){const a=activityRecords[id];return `<section class="activity-update" aria-label="路線活動紀錄"><p class="eyebrow">ISLAND JOURNAL · 島嶼記事</p><h3>${a.title}</h3><p>${a.text}</p><div class="activity-gallery">${a.photos.map(([file,caption])=>`<figure><a href="assets/island/${file}" target="_blank" rel="noopener" aria-label="開啟原圖：${caption}"><img src="assets/island/${file}" alt="${caption}" loading="lazy" width="600" height="400"/><span>查看原圖 ↗</span></a><figcaption>${caption}</figcaption></figure>`).join('')}</div><small>以上為資料夾現有成果；活動日期未註記，尚無法判定最近一次辦理時間。照片可點開查看。</small></section>`;}
function openRoute(id,updateHash=true){
 const r=routes.find(x=>x.id===id);if(!r)return;$('#ocean').classList.remove('school-focus');active=id;visited.add(id);try{localStorage.setItem('changxing-island-read',JSON.stringify([...visited]));}catch{}updateRead();
 if(id==='risk-management'){openRisk(r,updateHash);return;}
 const template=ISLAND_DATA.templates[id];const train=ISLAND_DATA.train[id];
 $('#overview').hidden=true;$('#detail').hidden=false;focusIsland(r);
 $('#detail').innerHTML=`<div class="detail-header"><button class="back" id="back">← 回到所有路線</button></div><figure class="detail-photo"><img src="assets/island/${r.photo}" alt="長興國小${r.name}相關戶外教育活動" width="600" height="400"><figcaption>長興國小既有課程照片</figcaption></figure><div class="detail-content"><p class="eyebrow">EXPLORE / ${r.no}</p><h2 tabindex="-1">${esc(r.name)}</h2><p class="detail-summary">${esc(r.summary)}</p><p class="route-location">場域範圍　${esc(r.location)}<br>課程標示　${esc(r.grade)}</p><div class="stops">${r.stops.map(esc).join('　／　')}</div>${id==='rail-harbor'?'<p class="port-explainer">碼頭動態示意：吊起貨櫃 → 移至船上 → 裝滿 4 櫃離港 → 空船進港。拉近時播放，可用「暫停動態」控制。</p>':''}${activitySection(id)}<h3>孩子帶著什麼任務出發？</h3><ul>${r.tasks.map(t=>`<li>${esc(t)}</li>`).join('')}</ul><h3>TRAIN，每一次探究的五個站</h3>${train.map(([title,body])=>`<div class="train-stop"><b aria-hidden="true">${title[0]}</b><div><strong>${esc(title.slice(2))}</strong><p>${esc(body)}</p></div></div>`).join('')}<details><summary>行前、現場與課後怎麼學？</summary><h3>行前準備</h3><ul>${template.before.map(t=>`<li>${esc(t)}</li>`).join('')}</ul><h3>場域學習</h3><ul>${template.during.map(t=>`<li>${esc(t)}</li>`).join('')}</ul><h3>課後整理</h3><ul>${template.after.map(t=>`<li>${esc(t)}</li>`).join('')}</ul></details><details><summary>這條路線留下哪些學習成果？</summary><ul>${template.outcomes.map(t=>`<li>${esc(t)}</li>`).join('')}</ul><p class="detail-summary">以上為課程設定的成果形式，實際學習表現須搭配學生作品與教師觀察檢視。</p></details><a class="primary" href="curriculum.html?route=${encodeURIComponent(id)}#routes">閱讀完整教案與風險規劃 ↗</a><a class="secondary-link" href="curriculum.html#lesson-builder">帶進自己的教案設計</a><div class="return-row"><button id="back-bottom">← 繼續探索其他場域</button></div></div>`;
 applyRoleDetail(r);
 $('#back').addEventListener('click',back);$('#back-bottom').addEventListener('click',back);
 document.querySelectorAll('[data-node]').forEach(n=>{let selected=n.dataset.node===id;n.classList.toggle('is-active',selected);n.setAttribute('aria-pressed',String(selected));});
 $('.panel').scrollTop=0;$('#detail h2').focus({preventScroll:true});
 if(updateHash)history.replaceState(null,'','#'+id);
}
function openRisk(r,updateHash){
 $('#overview').hidden=true;$('#detail').hidden=false;focusIsland(r);
 const links=[['基隆市政府所屬學校辦理戶外教育注意事項','基隆市政府主管法規共用系統','https://exlaw.klcg.gov.tw/LawContent.aspx?id=GL000742'],['國民中小學辦理戶外教育實施原則','教育部主管法規共用系統','https://edu.law.moe.gov.tw/LawContent.aspx?id=GL002235']];
 const checks=['課程計畫與校內核准程序已確認','場地勘查、交通與轉乘動線已檢視','天候、潮汐與停止活動的判斷方式已討論','學生個別需求、健康提醒與參與支持已安排','教師分工、帶隊人力、分組與點名機制已確認','緊急通訊、集合點、就醫管道與急救物資已備妥','家長已獲活動資訊，通知單與回條依校內流程辦理','保險、經費、交通工具與受委託事項已依規定確認','備案、取消或延期及返校後檢討方式已規劃'];
 $('#detail').innerHTML=`<div class="detail-header"><button class="back" id="back">← 回到所有小島</button></div><div class="detail-content risk-content"><p class="eyebrow">SAFETY FIRST / 07</p><h2 tabindex="-1">風險管理島</h2><p class="detail-summary">把安全準備放在出發之前。這裡集中收錄官方規定、行前檢核與通知單工具，支援每一條戶外教育路線。</p><nav class="risk-jump"><a href="#risk-rules">相關規定</a><a href="#risk-checks">行前檢核</a><a href="#risk-notices">通知單</a></nav><section id="risk-rules"><h3>官方規定</h3>${links.map(([title,source,url])=>`<a class="risk-resource" href="${url}" target="_blank" rel="noopener"><strong>${title} ↗</strong><small>${source}</small></a>`).join('')}<p class="risk-note">官方原文入口整理於 2026-10-24；實施時請查閱最新公告，並配合學校核定計畫與補充公文。</p></section><section id="risk-checks"><h3>出發前，逐項確認</h3><p class="detail-summary">供教師共備使用的工作清單，勾選只代表本次頁面上的確認，不等同完成校內審核。</p><div class="safety-checklist">${checks.map(t=>`<label><input type="checkbox"><span>${t}</span></label>`).join('')}</div><p class="risk-progress" aria-live="polite">已確認 0 / ${checks.length} 項</p><a class="risk-resource" href="assets/risk/pretrip-checklist.html" target="_blank" rel="noopener"><strong>開啟行前檢核表 ↗</strong><small>可填寫、列印或另存 PDF</small></a></section><section id="risk-notices"><h3>家長通知單與回條</h3><a class="primary" href="curriculum.html#notice-generator">製作活動通知單 →</a><p class="detail-summary">沿用既有通知單產生器，可選班級與路線，填寫出發資訊、注意事項及攜帶物品，再列印為 PDF。</p><a class="risk-resource" href="assets/risk/parent-notice.html" target="_blank" rel="noopener"><strong>家長通知暨同意回條空白範本 ↗</strong><small>可直接編輯內容，列印後依校內流程使用</small></a><p class="risk-note">空白範本為本站整理的工作用格式。家長聯絡與學生健康資料請依學校流程收回保管，勿放在公開網站。</p></section><section><h3>接回課程設計</h3><a class="secondary-link" href="curriculum.html#lesson-builder">完整教案與風險規劃工具 ↗</a></section><div class="return-row"><button id="back-bottom">← 回到所有小島</button></div></div>`;
 applyRoleDetail(r);
 $('#back').addEventListener('click',back);$('#back-bottom').addEventListener('click',back);
 document.querySelectorAll('[data-node]').forEach(n=>{const on=n.dataset.node===r.id;n.classList.toggle('is-active',on);n.setAttribute('aria-pressed',String(on));});
 $('.safety-checklist').addEventListener('change',()=>{$('.risk-progress').textContent=`已確認 ${document.querySelectorAll('.safety-checklist input:checked').length} / ${checks.length} 項`;});
 document.querySelectorAll('.risk-jump a').forEach(a=>a.addEventListener('click',e=>{e.preventDefault();$(a.getAttribute('href')).scrollIntoView({behavior:prefersReduced()?'instant':'smooth',block:'start'});}));
 $('.panel').scrollTop=0;$('#detail h2').focus({preventScroll:true});if(updateHash)history.replaceState(null,'','#'+r.id);
}
function back(){active=null;resetView();$('#detail').hidden=true;$('#overview').hidden=false;document.querySelectorAll('[data-node]').forEach(n=>{n.classList.remove('is-active');n.setAttribute('aria-pressed','false');});history.replaceState(null,'',location.pathname+location.search);renderList();$('.panel').scrollTop=0;$('#search').focus({preventScroll:true});}
function focusSchool(){ $('#ocean').classList.add('school-focus');focusIsland({x:635,y:479});}
function resetView(){ $('#ocean').classList.remove('school-focus');zoom=1;pan={x:0,y:0};transform();}
function focusIsland(r){zoom=2.35;pan={x:620-zoom*r.x-(1-zoom)*620,y:520-zoom*(r.y-15)-(1-zoom)*480};transform();}
function transform(){ $('#viewport').setAttribute('transform',`translate(${pan.x+(1-zoom)*620} ${pan.y+(1-zoom)*480}) scale(${zoom})`); }
function setZoom(v){zoom=Math.max(.75,Math.min(3,v));transform();}
function prefersReduced(){return matchMedia('(prefers-reduced-motion: reduce)').matches;}
draw();renderList();requestAnimationFrame(animatePort);
$('#search').addEventListener('input',e=>{query=e.target.value.trim().toLowerCase();renderList();});
document.querySelectorAll('[data-filter]').forEach(b=>b.addEventListener('click',()=>{filter=b.dataset.filter;document.querySelectorAll('[data-filter]').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));renderList();}));
$('#zoom-in').addEventListener('click',()=>setZoom(zoom+.15));$('#zoom-out').addEventListener('click',()=>setZoom(zoom-.15));$('#reset').addEventListener('click',resetView);
$('#connections').addEventListener('click',e=>{let on=e.currentTarget.getAttribute('aria-pressed')!=='true';e.currentTarget.setAttribute('aria-pressed',String(on));$('.connections').classList.toggle('is-off',!on);$('.rail-vehicles').classList.toggle('is-off',!on);});
$('#motion').addEventListener('click',e=>{let paused=e.currentTarget.getAttribute('aria-pressed')!=='true';e.currentTarget.setAttribute('aria-pressed',String(paused));e.currentTarget.textContent=paused?'播放動態':'暫停動態';$('#ocean').classList.toggle('paused',paused);if(paused)$('#island').pauseAnimations();else{$('#ocean').classList.remove('reduced-motion');$('#island').unpauseAnimations();}});
document.querySelectorAll('[data-light]').forEach(b=>b.addEventListener('click',()=>{document.body.dataset.light=b.dataset.light;document.querySelectorAll('[data-light]').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));}));
const scene=$('#scene');scene.addEventListener('pointerdown',e=>{if(e.target.closest('[data-node],[data-school]'))return;drag={x:e.clientX,y:e.clientY,startX:pan.x,startY:pan.y};scene.setPointerCapture(e.pointerId);});
scene.addEventListener('pointermove',e=>{if(!drag)return;let scale=1200/$('#island').getBoundingClientRect().width;pan={x:Math.max(-450,Math.min(450,drag.startX+(e.clientX-drag.x)*scale)),y:Math.max(-280,Math.min(280,drag.startY+(e.clientY-drag.y)*scale))};transform();});
scene.addEventListener('pointerup',()=>drag=null);scene.addEventListener('pointercancel',()=>drag=null);
const guide=$('#guide');$('#help').addEventListener('click',()=>guide.showModal());$('#close-guide').addEventListener('click',()=>guide.close());$('#start').addEventListener('click',()=>guide.close());
window.addEventListener('hashchange',()=>{let id=location.hash.slice(1);if(metadata[id])openRoute(id,false);else if(!id&&active)back();});
if(prefersReduced()){$('#ocean').classList.add('reduced-motion','paused');$('#island').pauseAnimations();$('#motion').setAttribute('aria-pressed','true');$('#motion').textContent='播放動態';}
const requestedLight=new URLSearchParams(location.search).get('light');if(['day','dusk','night'].includes(requestedLight)){document.body.dataset.light=requestedLight;document.querySelectorAll('[data-light]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.light===requestedLight)));}
renderRoleOverview();renderList();
$('#change-role').addEventListener('click',()=>{$('#role-entry-close').hidden=!roleSelected;$('#role-entry').showModal();});
document.querySelectorAll('[data-choose-role]').forEach(b=>b.addEventListener('click',()=>chooseRole(b.dataset.chooseRole)));
$('#role-entry-close').addEventListener('click',()=>$('#role-entry').close());
$('#role-entry').addEventListener('cancel',e=>{if(!roleSelected)e.preventDefault();});
if(!roleSelected)$('#role-entry').showModal();
let initial=location.hash.slice(1);if(metadata[initial])openRoute(initial,false);
})();
