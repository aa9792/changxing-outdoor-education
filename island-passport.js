/* Online island passport. Arrival comes from the traveller, never the map selection. */
(() => {
  'use strict';
  const api=window.ChangxingTraveller,$=s=>document.querySelector(s);
  if(!api)return;
  const key='changxing-passport-v1',esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const q=(text,options,answer,hint)=>({text,options,answer,hint});
  const book={
    school:{name:'長興出發島',owner:'長興引路老師',color:'#8b7953',icon:'M-20 0V-16L0-27 20-16V0ZM-26 1H26M-5 0V-12H5V0M-13-15V-8M13-15V-8',intro:'我是長興的引路老師。先認識我們的出發點，再帶著好奇走向山海！',questions:[q('長興國小旁的台鐵車站是哪一站？',['臺北站','七堵站','福隆站'],1,'長興的鐵道旅程，從七堵出發。'),q('戶外學習出發前，哪個做法最合適？',['先確認集合地點與小組夥伴','自己先跑到目的地','不用聽行前說明'],0,'先和老師確認集合與分組，才能一起安全出發。'),q('我們可以怎麼把家鄉走成課程？',['只看照片就結束','只記得吃了什麼','帶著問題觀察，再分享發現'],2,'從提問、觀察到分享，讓走讀成為學習。')]},
    'home-rail':{name:'家鄉鐵道島',owner:'七堵鐵道站長',color:'#a56b47',icon:'M-20-23H20V-1H-20ZM-14-17H-3V-8H-14ZM3-17H14V-8H3ZM-15 0L-23 12M15 0L23 12M-23 8H23',intro:'歡迎來到七堵！車站不只讓列車停靠，也留下家鄉生活的記憶。',questions:[q('島上木造建築的名稱是什麼？',['七堵舊車站','三貂角燈塔','臺北車站'],0,'看看木造站房前的招牌，上面寫著七堵舊車站。'),q('想知道鐵道周邊以前和現在有什麼不同，可以怎麼做？',['只猜以前的樣子','比對老照片與現在的景觀','只數經過幾班車'],1,'把老照片和現地景觀放在一起，找出變與不變。'),q('走讀車站周邊時，哪個行動最合適？',['跨過圍欄找近路','在月台邊追逐','遵守標示，和小組一起走'],2,'看懂標示、跟著小組，是觀察鐵道的重要準備。')]},
    marine:{name:'海洋探索島',owner:'八斗子海洋研究員',color:'#398b9a',icon:'M-23-7Q-5-25 15-7Q-5 11-23-7ZM15-7L26-18V4ZM-9-10H-8M-25 13Q-18 5-10 13T5 13T22 13',intro:'海科館和八斗子海岸藏著許多線索。一起做個細心、友善的海洋觀察家吧！',questions:[q('海洋探索島的主要建築是哪個場館？',['臺北車站','國立海洋科技博物館','七堵舊車站'],1,'島上的白色建築與玻璃廊道，對應海科館。'),q('觀察海岸生物時，哪種做法最友善？',['保持距離並記錄，不任意捕捉','帶回家當紀念','隨意翻動牠的棲地'],0,'觀察可以拍照或畫圖，讓生物留在原來的家。'),q('怎麼讓海岸觀察更有根據？',['只說很好玩','看到什麼都用猜的','記錄外形、位置與環境，再查找資料'],2,'把看見的特徵與環境記下來，再用資料確認。')]},
    'rail-harbor':{name:'港都與礦業島',owner:'基隆港領航員',color:'#647ea0',icon:'M-25-21H-4V7M-19-21V7M-22-15H0L11-7M0-15V-3M-24 8H26L17 19H-15ZM-7 1H5V8M7-1H18V8',intro:'看，橋式起重機正忙著裝船！跟著貨物的旅程，讀懂鐵道、礦業與港口的關係。',questions:[q('港邊橋式起重機主要在做什麼？',['替船隻加油','把貨櫃吊到船上或碼頭','把海水抽乾'],1,'觀察起重機如何把貨櫃從碼頭移到船上。'),q('想理解礦業與港口的連結，應追查哪條線索？',['礦產如何經由運輸送往港口','哪艘船顏色最漂亮','哪個商店最熱鬧'],0,'追蹤貨物從產地、鐵道到港口的移動過程。'),q('在港口附近走讀，哪個位置適合觀察？',['正在裝卸貨物的作業區內','貨車轉彎的路口中央','老師安排的安全觀察區'],2,'港口有大型車輛與機具，要留在安排好的安全區。')]},
    sanxia:{name:'產業文化島',owner:'三峽藍染師傅',color:'#596b9c',icon:'M-21-23L-8-28Q0-19 8-28L21-23 28-10 16-3 12-11V20H-12V-11L-16-3-28-10ZM-5-4Q7-14 5 4T-5 14',intro:'歡迎走進老街！從紅磚拱廊到一塊藍染布，每一處都有職人的故事。',questions:[q('產業文化島上的手作體驗是什麼？',['藍染','造船','火車維修'],0,'看看染缸與晾起來的藍色布料。'),q('觀察老街建築時，哪個問題能幫助我們認識地方文化？',['今天的雲像什麼','拱廊與店屋如何連結居民的生活和生意','只問哪家飲料好喝'],1,'想想建築怎麼被使用，以及它和居民生活的關係。'),q('參與藍染體驗時，怎麼做最合適？',['跳過說明，自己亂混材料','拿走別人的作品','聽師傅說明，記錄製作步驟並尊重作品'],2,'跟著職人的步驟操作，也理解每件作品背後的工夫。')]},
    'multi-rail':{name:'智慧交通島',owner:'交通調度員',color:'#ad6857',icon:'M-27-12L0-26 27-12ZM-22-10V16H22V-10M-14-5V16M-5-5V16M5-5V16M14-5V16M-28 20H28',intro:'歡迎來到交通樞紐！多種運具要順利銜接，背後需要資訊、規則與合作。',questions:[q('智慧交通島的紅屋頂建築參考哪個車站？',['七堵舊車站','臺北車站','海科館站'],1,'大面積紅色屋頂與正面柱廊，是臺北車站的造型線索。'),q('在多鐵共構車站轉乘，最應先確認什麼？',['路線、方向與轉乘標示','哪條路人最多就跟著走','只看商店招牌'],0,'讀懂路線、方向與標示，才能找到要搭乘的車。'),q('行控與調度系統的工作，主要是為了什麼？',['讓列車各自隨意發車','把所有車站關閉','協調運行並協助維持交通安全'],2,'交通運行需要協調、監控與異常處理。')]},
    'metro-tech':{name:'極東海岸島',owner:'三貂角燈塔守望員',color:'#4b9290',icon:'M-10 22L-6-13H6L10 22ZM-10-13V-23H10V-13ZM-13-24H13M-3-29H3M-17-18L-27-24M17-18L27-24M-27 25H27',intro:'燈塔照亮航路，海浪留下地景線索。到極東海岸，練習觀察，也練習敬畏自然。',questions:[q('島上的白色燈塔是哪一座？',['三貂角燈塔','七堵燈塔','臺北燈塔'],0,'看看白色塔身與島上的三貂角燈塔標示。'),q('燈塔亮燈，主要能幫助誰？',['讓火車加速','為海上船隻提供辨識與航行指引','讓海浪停止'],1,'夜晚的光束是海上航行的重要辨識線索。'),q('準備進行海岸觀察時，最合適的做法是？',['浪大也靠近岸邊拍照','獨自走進陌生潮間帶','確認天候與潮汐，遵從帶隊安排'],2,'海岸條件會變化，要依天候、潮汐與現場判斷調整。')]},
    'risk-management':{name:'風險管理島',owner:'戶外安全守護員',color:'#6e9363',icon:'M0-28L22-18V0Q20 17 0 28Q-20 17-22 0V-18ZM-11-1L-3 8 13-10',intro:'安全不是出發前勾完就結束，而是整趟旅程持續觀察、互相照顧與調整。',questions:[q('活動通知單與同意回條的主要用途是什麼？',['只是為了裝飾','讓家長了解行程與注意事項，並回覆確認','可以取代所有安全準備'],1,'通知與回條是學校和家庭溝通行程及準備的重要工具。'),q('活動中身體不舒服或需要幫忙時，應該怎麼做？',['立刻告訴帶隊老師','偷偷離隊回家','忍住，不讓任何人知道'],0,'及早告知老師，才能得到協助與適當照顧。'),q('天候或現場環境變得不安全，應如何處理？',['照原計畫硬做完','讓學生自己決定往哪走','由帶隊人員評估，調整、暫停或取消活動'],2,'安全計畫需要依現場狀況調整，必要時暫停或取消。')]}
  };
  const ids=Object.keys(book);let visits={},stamps={},storageOK=true,quizIsland=null,lastView='',newStamp='',achievement=null;
  try{const data=JSON.parse(localStorage.getItem(key)||'null');if(data?.version===1)for(const id of ids){if(Number.isFinite(data.visits?.[id])&&data.visits[id]>0)visits[id]=data.visits[id];if(Number.isFinite(data.stamps?.[id])&&data.stamps[id]>0&&visits[id])stamps[id]=data.stamps[id];}}catch{}
  function save(){try{localStorage.setItem(key,JSON.stringify({version:1,visits,stamps}));storageOK=true;}catch{storageOK=false;}}
  const date=t=>new Date(t).toLocaleDateString('zh-TW',{timeZone:'Asia/Taipei',year:'numeric',month:'2-digit',day:'2-digit'});
  const seal=(id,earned)=>{const b=book[id];return `<svg viewBox="-45 -45 90 90" aria-hidden="true" class="passport-seal ${earned?'earned':''}" style="--stamp:${b.color}"><circle r="40"/><circle r="35"/><path d="${b.icon}"/><text y="33" text-anchor="middle">${earned?'探 索 認 證':'等 待 蓋 章'}</text></svg>`;};
  $('.traveller-actions').insertAdjacentHTML('beforeend','<button id="traveller-passport">我的護照 0 / 8</button>');
  ($('.live-panel')||$('#overview')).insertAdjacentHTML('beforebegin','<button class="passport-entry" id="open-passport"><span>✦ 戶外教育護照</span><strong id="passport-mini-count">0 / 8 枚章</strong><small id="passport-mini-status">建立角色，展開你的集章旅程。</small></button>');
  document.body.insertAdjacentHTML('beforeend',`<dialog id="island-passport" aria-labelledby="passport-title"><button class="dialog-close" id="passport-close" aria-label="關閉戶外教育護照">×</button><header class="passport-cover"><p class="eyebrow">MY OUTDOOR LEARNING PASSPORT</p><h2 id="passport-title">戶外教育護照</h2><p id="passport-owner"></p><div class="passport-progress"><span id="passport-count"></span><progress id="passport-progress" max="8" value="0" aria-label="護照集章進度"></progress></div></header><p class="passport-instruction">搭車登島 → 走近巡遊的島主，自動回答三題 → 集滿八章戴皇冠。</p><section id="passport-current" aria-label="目前小島的集章任務"></section><p id="passport-feedback" role="status" aria-live="polite"></p><div class="passport-grid" id="passport-stamps"></div><p id="passport-storage" class="passport-footnote"></p></dialog><dialog id="island-quiz" aria-labelledby="island-quiz-title"><button class="dialog-close" id="quiz-close" aria-label="關閉島主問答">×</button><div class="island-host"><svg id="quiz-host" viewBox="-35 -67 70 76" aria-hidden="true"></svg><div><p class="eyebrow">ISLAND KEEPER · 島主的三個問題</p><h2 id="island-quiz-title"></h2><p id="quiz-intro"></p></div></div><form id="island-quiz-form"><div id="island-questions"></div><p id="quiz-feedback" role="status" aria-live="polite"></p><div class="quiz-actions"><button class="primary" type="submit">回答完成，請島主檢查</button><button type="button" id="quiz-back">先回護照看看</button></div></form></dialog>`);
  function update(){
    const s=api.snapshot(),count=Object.keys(stamps).length;
    if(achievement!==(count===8)){achievement=count===8;window.dispatchEvent(new CustomEvent('passport:achievement',{detail:{complete:achievement}}));}
    if(s.enabled&&!s.riding&&book[s.island]&&!visits[s.island]){visits[s.island]=Date.now();save();}
    const signature=JSON.stringify([s.enabled,s.look.name,s.island,s.riding,count,storageOK]);if(signature===lastView)return;lastView=signature;
    $('#traveller-passport').textContent=`我的護照 ${count} / 8`;
    $('#passport-mini-count').textContent=`${count} / 8 枚章`;
    $('#passport-mini-status').textContent=!s.enabled?'建立角色，展開你的集章旅程。':count===8?'👑 八關全通過！探索皇冠已戴在人物頭上。':s.riding?'海風號行進中，抵達後就能找島主。':stamps[s.island]?'本島已蓋章，繼續前往下一島吧！':`在${book[s.island]?.name||'小島'}走近「？島主」，自動開始三題挑戰。`;
    if($('#island-passport').open)renderPassport();
  }
  function renderPassport(){
    const s=api.snapshot(),count=Object.keys(stamps).length,b=book[s.island];
    $('#passport-owner').textContent=(s.enabled?s.look.name:'尚未建立角色')+' 的線上登島紀錄';$('#passport-count').textContent=count===8?'👑 八關全通過，已獲得山海探索皇冠！':`已收集 ${count} / 8 枚島嶼印章`;
    $('#passport-progress').value=count;
    $('#passport-stamps').innerHTML=ids.map(id=>`<article class="passport-page ${stamps[id]?'is-stamped':''} ${newStamp===id?'just-stamped':''}">${seal(id,!!stamps[id])}<h3>${book[id].name}</h3><p>${stamps[id]?'已蓋章 · '+date(stamps[id]):visits[id]?'已登島 · 等待挑戰':'尚未登島'}</p></article>`).join('');
    const area=$('#passport-current');area.replaceChildren();
    const title=document.createElement('h3'),p=document.createElement('p'),button=document.createElement('button');button.className='primary';
    if(!s.enabled){title.textContent='先建立你的探險角色';p.textContent='護照會跟著這台裝置上的人物，一起記錄旅程。';button.textContent='建立我的角色';button.onclick=()=>{$('#island-passport').close();$('#create-traveller').click();};}
    else if(s.riding){title.textContent='海風號行駛中';p.textContent='島主正在下一站等你。抵達下車後，再來回答問題。';button.textContent='抵達後開放挑戰';button.disabled=true;}
    else{title.textContent=b.name+' · '+b.owner;p.textContent=stamps[s.island]?'島主已為你蓋章。搭車到其他島，繼續收集新的學習故事。':'你已抵達！回答島主的三個問題，三題全對才能獲得本島印章。';button.textContent=stamps[s.island]?'本島已獲得印章':'找島主，開始三題挑戰';button.disabled=!!stamps[s.island];button.onclick=()=>openQuiz(s.island);}
    area.append(title,p,button);
    $('#passport-storage').textContent=storageOK?'護照儲存在這台裝置的瀏覽器；更換裝置或清除網站資料，紀錄不會同步。印章記錄的是本平台的線上探索。':'目前無法儲存護照，這次頁面仍可集章；重新整理後可能遺失紀錄。';
  }
  function openPassport(){update();renderPassport();$('#island-passport').showModal();}
  function openQuiz(id){
    const s=api.snapshot();if(!s.enabled||s.riding||s.boarding||s.island!==id||!visits[id]||stamps[id])return;
    lock={island:id,x:s.x,y:s.y};
    window.dispatchEvent(new Event('traveller:stop-walking'));
    quizIsland=id;const b=book[id];$('#island-passport').close();$('#island-quiz-title').textContent=b.owner;$('#quiz-intro').textContent=b.intro;
    $('#quiz-host').innerHTML=api.figure({name:b.owner,skin:'#e6bc94',hair:'#4e493d',style:'short',shirt:'#6ca69b',hat:'explorer',bag:false});
    $('#island-questions').innerHTML=b.questions.map((item,i)=>`<fieldset class="island-question"><legend><span>第 ${i+1} 題</span>${esc(item.text)}</legend>${item.options.map((text,n)=>`<label><input type="radio" name="q${i}" value="${n}" required><span>${esc(text)}</span></label>`).join('')}<p class="question-feedback" id="question-feedback-${i}"></p></fieldset>`).join('');
    $('#quiz-feedback').textContent='三題全對就能蓋章；答錯也沒關係，島主會提供提示，讓你再試一次。';$('#island-quiz').showModal();$('#island-quiz').scrollTop=0;
  }
  $('#island-quiz-form').addEventListener('submit',e=>{
    e.preventDefault();const s=api.snapshot(),id=quizIsland,b=book[id];if(!b||!s.enabled||s.riding||s.island!==id||!visits[id]){$('#quiz-feedback').textContent='請先搭車抵達這座島，再向島主挑戰。';return;}
    const answers=new FormData(e.currentTarget);let correct=0;
    b.questions.forEach((item,i)=>{const ok=answers.get('q'+i)!==null&&Number(answers.get('q'+i))===item.answer;if(ok)correct++;const field=$('#question-feedback-'+i);field.textContent=ok?'✓ 答對了！':'再想一想：'+item.hint;field.parentElement.classList.toggle('needs-review',!ok);});
    if(correct!==3){$('#quiz-feedback').textContent=`答對 ${correct} / 3 題。看看島主的提示，調整答案後可以再挑戰！`;return;}
    if(!stamps[id]){stamps[id]=Date.now();save();newStamp=id;}
    $('#island-quiz').close();lastView='';update();$('#passport-feedback').textContent=`恭喜！三題全部答對，${b.owner}為你蓋上「${b.name}」印章。`;openPassport();
  });
  $('#open-passport').addEventListener('click',()=>{$('#passport-feedback').textContent='';newStamp='';openPassport();});
  $('#traveller-passport').addEventListener('click',()=>$('#open-passport').click());
  $('#passport-close').addEventListener('click',()=>$('#island-passport').close());
  $('#quiz-close').addEventListener('click',()=>$('#island-quiz').close());
  $('#quiz-back').addEventListener('click',()=>{$('#island-quiz').close();openPassport();});
  // Keepers use the same pedestrian path as the traveller; never the sea or rail.
  const ns='http://www.w3.org/2000/svg',keeperLayer=document.createElementNS(ns,'g'),walkPath=$('#traveller-walk-path'),length=walkPath.getTotalLength(),keepers=new Map();
  keeperLayer.id='island-keepers';keeperLayer.setAttribute('aria-hidden','true');$('#viewport').append(keeperLayer);
  ids.forEach((id,index)=>{
    const island=api.islands.find(i=>i.id===id),el=document.createElementNS(ns,'g');el.classList.add('island-keeper','is-walking');el.dataset.keeper=id;
    el.innerHTML=api.figure({name:'島主 · '+book[id].owner,skin:'#e6bc94',hair:'#4e493d',style:index%3===0?'long':'short',shirt:book[id].color,hat:id==='sanxia'?'none':'explorer',bag:false},true)+'<g class="keeper-question"><circle cx="20" cy="-47" r="10" fill="#fff5d1" stroke="#9a7244"/><text x="20" y="-43" text-anchor="middle" font-size="13" font-weight="700" fill="#825e35">?</text></g>';
    keeperLayer.append(el);keepers.set(id,{el,island,at:155+index*7,direction:index%2===0?1:-1,x:0,y:0});
  });
  let lastFrame=null,lock=null,lastIsland='',arrivalAt=0;
  function patrol(now){
    const dt=lastFrame===null?0:Math.min(.05,(now-lastFrame)/1000);lastFrame=now;
    const s=api.snapshot(),modal=!!document.querySelector('dialog[open]'),paused=$('#ocean').classList.contains('paused')||document.hidden||modal,reduced=$('#ocean').classList.contains('reduced-motion');
    if(s.island!==lastIsland){lastIsland=s.island;arrivalAt=now;lock=null;}
    if(lock&&(s.island!==lock.island||Math.hypot(s.x-lock.x,s.y-lock.y)>42))lock=null;
    for(const [id,k]of keepers){
      if(!paused&&!reduced){k.at+=k.direction*13*dt;if(k.at>=length-10){k.at=length-10;k.direction=-1;}if(k.at<=35){k.at=35;k.direction=1;}}
      const p=walkPath.getPointAtLength(k.at);k.x=k.island.x+p.x;k.y=k.island.y+p.y;k.el.setAttribute('transform',`translate(${k.x} ${k.y})`);
      k.el.classList.toggle('is-walking',!paused&&!reduced);k.el.classList.toggle('keeper-cleared',!!stamps[id]);
      const question=k.el.querySelector('.keeper-question text');question.textContent=stamps[id]?'✓':'?';
    }
    const k=keepers.get(s.island);
    if(k&&!paused&&s.enabled&&!s.riding&&!s.boarding&&s.walking&&!stamps[s.island]&&!lock&&now-arrivalAt>1200&&Math.hypot(s.x-k.x,s.y-k.y)<20){
      lock={island:s.island,x:s.x,y:s.y};update();openQuiz(s.island);
    }
    requestAnimationFrame(patrol);
  }
  update();setInterval(update,500);
  requestAnimationFrame(patrol);
})();

