/* Personal explorer. Realtime sharing is an explicit, ephemeral opt-in. */
(() => {
  'use strict';
  const $ = s => document.querySelector(s);
  const svg = $('#island'), viewport = $('#viewport'), ocean = $('#ocean');
  const ns = 'http://www.w3.org/2000/svg';
  const esc = s => String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const defaults = {name:'小島旅人',skin:'#e6bc94',hair:'#4e493d',style:'short',shirt:'#d9ad52',hat:'explorer',bag:true};
  const skins = ['#f1d3b0','#e6bc94','#c58d65','#956544'];
  const shirts = ['#d9ad52','#6ca69b','#668ea7','#c67d68','#8a82ac'];
  const hairs = ['#4e493d','#76523a','#aa8454','#6d7372'];
  const nodes = [...document.querySelectorAll('[data-node]')].map(el => ({id:el.dataset.node,name:el.dataset.islandname,x:+el.dataset.x,y:+el.dataset.y}));
  const islands = [{id:'school',name:'長興國小・七堵站',x:635,y:479},...nodes];
  const order = ['home-rail','sanxia','marine','metro-tech','rail-harbor','risk-management','multi-rail','school'];
  const getIsland = id => islands.find(x => x.id === id) || islands[0];
  let look = {...defaults}, current = 'school', enabled = false, draft = {...defaults}, crowned = false;
  let walkAt = 115, walkGoal = 115, ride = null, queuedDestination = null, keys = new Set(), last = null;
  try {
    const saved = JSON.parse(localStorage.getItem('changxing-traveller') || 'null');
    if (saved?.look) {
      look = {...defaults,...saved.look};
      look.name = String(look.name).slice(0,12);
      if (!skins.includes(look.skin)) look.skin = defaults.skin;
      if (!shirts.includes(look.shirt)) look.shirt = defaults.shirt;
      if (!hairs.includes(look.hair)) look.hair = defaults.hair;
      if (!['short','long','curly'].includes(look.style)) look.style = 'short';
      if (!['none','explorer'].includes(look.hat)) look.hat = 'explorer';
      current = getIsland(saved.island).id;
      enabled = true;
    }
  } catch {}
  function save() { try {localStorage.setItem('changxing-traveller',JSON.stringify({look,island:current}));} catch {} }
  function figure(a,tag=false) {
    const hair = a.style === 'long' ? '<path d="M-9-35Q-12-52 0-52Q12-52 9-33L12-22-10-22Z" fill="'+a.hair+'"/>' : a.style === 'curly' ? [-6,0,6].map(x=>`<circle cx="${x}" cy="-48" r="5.5" fill="${a.hair}"/>`).join('') : `<path d="M-9-40Q-10-53 0-53Q10-53 9-40L4-46-8-42Z" fill="${a.hair}"/>`;
    return `<ellipse cy="3" rx="13" ry="5" fill="#315e5533"/><ellipse class="traveller-ring" cy="3" rx="16" ry="7" fill="none" stroke="#f4d878" stroke-width="2"/>${a.bag?'<rect x="-13" y="-31" width="9" height="18" rx="4" fill="#5c8687"/>':''}<g class="my-leg left"><path d="M-4-9L-6 1" stroke="#4f6968" stroke-width="5" stroke-linecap="round"/></g><g class="my-leg right"><path d="M4-9L6 1" stroke="#4f6968" stroke-width="5" stroke-linecap="round"/></g><path d="M-7-32Q0-36 7-32L10-11H-10Z" fill="${a.shirt}"/><path d="M-5-30v17m10-17v17" stroke="#efe6c5" stroke-width="1.3"/><path d="M-8-29L-13-17M8-29L13-17" stroke="${a.skin}" stroke-width="4" stroke-linecap="round"/>${hair}<circle cy="-41" r="9" fill="${a.skin}"/><path d="M-8-44Q-8-51 0-50Q7-50 8-45L2-47-8-43Z" fill="${a.hair}"/><circle cx="-3" cy="-41" r="1" fill="#43574b"/><circle cx="3" cy="-41" r="1" fill="#43574b"/><path d="M-2-36q2 2 4 0" stroke="#9d6f55" fill="none"/>${a.hat==='explorer'&&!a.crowned?'<path d="M-10-48q0-13 10-13q10 0 10 13Z" fill="#d4b65c"/><path d="M-13-47H13" stroke="#b59b4b" stroke-width="3"/>':''}${a.crowned?'<g class="champion-crown"><path d="M-11-54L-14-68-5-62 0-73 5-62 14-68 11-54Z" fill="#f5cf59" stroke="#a87a27" stroke-width="1.6"/><path d="M-11-56H11" stroke="#fff1a0" stroke-width="2"/><circle cy="-59" r="2.5" fill="#c7754d"/></g>':''}${tag?`<rect x="-44" y="${a.crowned?-103:-80}" width="88" height="16" rx="8" fill="#fff9e8" stroke="#d6c994"/><text y="${a.crowned?-92:-69}" text-anchor="middle" font-size="9" font-weight="700" fill="#3d6556">${esc(a.name)}</text>`:''}`;
  }
  const actor = document.createElementNS(ns,'g');
  actor.id = 'my-traveller'; actor.setAttribute('aria-hidden','true');
  viewport.append(actor);
  const path = document.createElementNS(ns,'path');
  path.id = 'traveller-walk-path';
  path.setAttribute('d','M-108 9L-77 31L-29 44L17 35L64 27L108 5');
  path.setAttribute('fill','none');
  path.setAttribute('stroke','#fbebad'); path.setAttribute('stroke-width','2'); path.setAttribute('stroke-dasharray','3 4');
  viewport.insertBefore(path,actor);
  const pathLength = path.getTotalLength();
  const circuit = $('#traveller-rail-route');
  const circuitLength = circuit.getTotalLength();
  const stops = new Map(islands.map(island => {
    let best=0, distance=Infinity;
    for (let i=0;i<=1600;i++) {const l=circuitLength*i/1600,p=circuit.getPointAtLength(l),d=(p.x-island.x)**2+(p.y-island.y)**2;if(d<distance){distance=d;best=l;}}
    return [island.id,best];
  }));
  const playerTrain = document.createElementNS(ns,'g');
  playerTrain.id='traveller-train'; playerTrain.setAttribute('aria-hidden','true');
  playerTrain.innerHTML='<g transform="scale(1.15)"><rect x="-32" y="-8" width="28" height="16" rx="4" fill="#a4d6c8" stroke="#456e65"/><rect x="-1" y="-8" width="32" height="16" rx="5" fill="#b0dfce" stroke="#456e65"/><path d="M-28-9H-8M3-9H22" stroke="#8b9d92" stroke-width="3"/><path d="M-26-2h6m4 0h6M5-2h5m5 0h5" stroke="#345855" stroke-width="5"/><path d="M25-7q6 1 6 6v7h-6Z" fill="#e3efdc"/><path d="M-29 5H-7M3 5H25" stroke="#d6ebd8" stroke-width="2"/><path d="M-4 0h3" stroke="#58796c"/><circle cx="13" cy="-20" r="9" fill="#edcc67" stroke="#fff2c9" stroke-width="2"/><text x="13" y="-17" font-size="7" text-anchor="middle" fill="#345e50">我</text></g>';
  $('.rail-vehicles').append(playerTrain);
  playerTrain.style.display='none';
  ocean.insertAdjacentHTML('beforeend',`<button class="create-traveller-launch" id="create-traveller">建立我的角色 ＋</button><section id="traveller-hud" class="traveller-hud" aria-label="我的角色漫遊" hidden><div class="traveller-hud-top"><strong id="traveller-name"></strong><button id="traveller-minimize" aria-label="收起角色操作">−</button></div><p id="traveller-place"></p><p id="traveller-message" role="status" aria-live="polite"></p><div class="traveller-actions"><button id="traveller-ride">搭海風號 🚆</button><button id="traveller-focus">找到我</button><button id="traveller-edit">換造型</button><button id="traveller-end">結束漫遊</button></div><div class="walking-pad" aria-label="手機行走按鈕"><button data-walk="-1" aria-label="沿步道往左走">←</button><span>點島上地面也能行走<br>電腦可用 ← → 或 A D</span><button data-walk="1" aria-label="沿步道往右走">→</button></div></section>`);
  document.body.insertAdjacentHTML('beforeend',`<dialog id="avatar-creator" aria-labelledby="avatar-title"><button class="dialog-close" id="avatar-close" aria-label="關閉角色建立">×</button><p class="eyebrow">MY ISLAND EXPLORER</p><h2 id="avatar-title">建立我的小島角色</h2><p class="avatar-lead">選一個喜歡的樣子，走進山海課堂。</p><div class="avatar-editor"><div class="avatar-preview"><svg id="avatar-preview-svg" viewBox="-40 -75 80 100" aria-label="角色外觀預覽"></svg><p id="avatar-preview-name"></p></div><form id="avatar-form"><label class="avatar-field">角色暱稱<input id="avatar-nickname" maxlength="12" autocomplete="off" value="小島旅人"></label><fieldset><legend>膚色</legend><div class="avatar-swatches">${skins.map((c,i)=>`<label style="--swatch:${c}"><input type="radio" name="skin" value="${c}" aria-label="膚色 ${i+1}"><span></span></label>`).join('')}</div></fieldset><div class="avatar-two"><label class="avatar-field">髮型<select name="style"><option value="short">短髮</option><option value="long">長髮</option><option value="curly">捲髮</option></select></label><label class="avatar-field">帽子<select name="hat"><option value="explorer">探險帽</option><option value="none">不戴帽子</option></select></label></div><fieldset><legend>髮色</legend><div class="avatar-swatches">${hairs.map((c,i)=>`<label style="--swatch:${c}"><input type="radio" name="hair" value="${c}" aria-label="髮色 ${i+1}"><span></span></label>`).join('')}</div></fieldset><fieldset><legend>服裝顏色</legend><div class="avatar-swatches">${shirts.map((c,i)=>`<label style="--swatch:${c}"><input type="radio" name="shirt" value="${c}" aria-label="服裝顏色 ${i+1}"><span></span></label>`).join('')}</div></fieldset><label class="avatar-bag"><input type="checkbox" name="bag">帶上探索背包</label><button class="primary" type="submit">開始我的小島旅程 →</button></form></div><p class="draft-note">角色會儲存在這台裝置。開啟即時同遊後，暱稱、造型與位置會分享給同房在線旅人。</p></dialog><dialog id="train-destinations" aria-labelledby="train-title"><button class="dialog-close" id="train-close" aria-label="關閉目的地選擇">×</button><p class="eyebrow">SEA BREEZE EXPRESS</p><h2 id="train-title">下一站，去哪座島？</h2><p class="detail-summary">角色會先走向月台，再搭乘海風號。進島時列車會隱入站內，抵達後就能下車探索。</p><div id="destination-list"></div></dialog>`);
  const form = $('#avatar-form'), editor = $('#avatar-creator');
  function preview() {
    const f=new FormData(form);
    draft={name:$('#avatar-nickname').value.trim()||'小島旅人',skin:f.get('skin'),hair:f.get('hair'),style:f.get('style'),shirt:f.get('shirt'),hat:f.get('hat'),bag:f.has('bag')};
    $('#avatar-preview-svg').innerHTML=figure({...draft,crowned});
    $('#avatar-preview-name').textContent=draft.name;
  }
  function openEditor() {
    if(ride||queuedDestination){message('抵達下一站後就可以更換造型。');return;}
    $('#avatar-nickname').value=look.name;
    for(const key of ['skin','hair','shirt'])form.querySelector(`[name="${key}"][value="${look[key]}"]`).checked=true;
    form.elements.style.value=look.style;form.elements.hat.value=look.hat;form.elements.bag.checked=look.bag;
    preview();editor.showModal();
  }
  form.addEventListener('input',preview);
  form.addEventListener('change',preview);
  form.addEventListener('submit',e=>{e.preventDefault();preview();look={...draft};enabled=true;actor.innerHTML=figure({...look,crowned},true);editor.close();save();updateHUD();focusCurrent();message('點選這座島的地面行走，或搭海風號前往下一島。');});
  $('#avatar-close').addEventListener('click',()=>editor.close());
  $('#create-traveller').addEventListener('click',openEditor);
  $('#traveller-edit').addEventListener('click',openEditor);
  $('#traveller-focus').addEventListener('click',()=>{if(ride){window.dispatchEvent(new Event('traveller:overview'));return;}focusCurrent();});
  $('#traveller-minimize').addEventListener('click',()=>{
    const compact=$('#traveller-hud').classList.toggle('is-compact');
    $('#traveller-minimize').textContent=compact?'+':'−';
    $('#traveller-minimize').setAttribute('aria-label',compact?'展開角色操作':'收起角色操作');
  });
  $('#traveller-end').addEventListener('click',()=>{
    if(ride||queuedDestination){message('請先等海風號抵達目的地。');return;}
    enabled=false;keys.clear();updateHUD();
  });
  function focusCurrent(){window.dispatchEvent(new CustomEvent('traveller:focus',{detail:{id:current}}));}
  function updateHUD(){
    $('#create-traveller').hidden=enabled;
    $('#traveller-hud').hidden=!enabled;
    actor.style.display=enabled&&!ride?'':'none';
    path.style.display=enabled&&!ride?'':'none';
    $('#traveller-name').textContent=look.name+(crowned?' 👑':'');
    $('#traveller-place').textContent='目前所在｜'+getIsland(current).name;
    $('#traveller-ride').disabled=!!ride||!!queuedDestination;
    $('#traveller-edit').disabled=!!ride||!!queuedDestination;
    ocean.classList.toggle('has-traveller',enabled);
  }
  let lastMessage='';
  function message(text){if(text!==lastMessage){$('#traveller-message').textContent=text;lastMessage=text;}}
  function nearestWalk(point){
    let at=0,best=Infinity;
    for(let l=0;l<=pathLength;l+=2){const p=path.getPointAtLength(l),d=(p.x-point.x)**2+(p.y-point.y)**2;if(d<best){best=d;at=l;}}
    return at;
  }
  const stationAt=nearestWalk({x:-30,y:40});
  function openDestinations(){
    if(!enabled||ride||queuedDestination)return;
    const next=order[(order.indexOf(current)+1)%order.length];
    $('#destination-list').innerHTML=order.map(id=>{const island=getIsland(id);return `<button data-destination="${id}" ${id===current?'disabled':''}><strong>${island.name}</strong><span>${id===current?'目前所在':id===next?'下一站 →':'搭車前往 →'}</span></button>`;}).join('');
    $('#destination-list').querySelectorAll('[data-destination]').forEach(b=>b.addEventListener('click',()=>{
      queuedDestination=b.dataset.destination;walkGoal=stationAt;keys.clear();$('#train-destinations').close();
      focusCurrent();updateHUD();message('正在走向月台，準備搭乘海風號…');
    }));
    $('#train-destinations').showModal();
  }
  $('#traveller-ride').addEventListener('click',openDestinations);
  $('#train-close').addEventListener('click',()=>$('#train-destinations').close());
  function startRide(id){
    const start=stops.get(current),end=stops.get(id),distance=(end-start+circuitLength)%circuitLength;
    ride={destination:id,start,distance,travelled:0,lastPercent:-1};queuedDestination=null;
    playerTrain.style.display='';updateHUD();window.dispatchEvent(new Event('traveller:overview'));
    message('已上車｜前往'+getIsland(id).name+'，0%');
  }
  function modalOpen(){return !!document.querySelector('dialog[open]');}
  function sceneClick(e){
    if(!enabled||ride||queuedDestination||modalOpen()||e.button!==0)return;
    const target=e.target.closest('[data-node],[data-school]');
    if(!target)return;
    const id=target.hasAttribute('data-school')?'school':target.dataset.node;
    if(id!==current)return;
    const matrix=viewport.getScreenCTM();if(!matrix)return;
    const p=new DOMPoint(e.clientX,e.clientY).matrixTransform(matrix.inverse()),island=getIsland(current);
    walkGoal=nearestWalk({x:p.x-island.x,y:p.y-island.y});
    e.preventDefault();e.stopImmediatePropagation();message('沿著島上步道走走，看看周圍的學習場景。');
  }
  $('#scene').addEventListener('pointerdown',sceneClick,true);
  $('#scene').addEventListener('click',e=>{
    if(!enabled||ride||modalOpen())return;
    const t=e.target.closest('[data-node],[data-school]');
    if(t&&(t.hasAttribute('data-school')?'school':t.dataset.node)===current){e.preventDefault();e.stopImmediatePropagation();}
  },true);
  function editing(e){return e.target.closest('input,textarea,select,[contenteditable="true"]')||modalOpen();}
  const motionKeys=new Set(['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','a','d','w','s','A','D','W','S']);
  window.addEventListener('keydown',e=>{if(enabled&&!ride&&!queuedDestination&&!editing(e)&&motionKeys.has(e.key)){e.preventDefault();keys.add(e.key);}});
  window.addEventListener('keyup',e=>keys.delete(e.key));
  window.addEventListener('blur',()=>keys.clear());
  document.querySelectorAll('[data-walk]').forEach(b=>{
    b.addEventListener('pointerdown',e=>{e.preventDefault();if(ride||queuedDestination)return;keys.add(+b.dataset.walk<0?'ArrowLeft':'ArrowRight');b.setPointerCapture(e.pointerId);});
    const stop=()=>keys.clear();b.addEventListener('pointerup',stop);b.addEventListener('pointercancel',stop);b.addEventListener('lostpointercapture',stop);
    b.addEventListener('click',()=>{if(!ride&&!queuedDestination)walkGoal=Math.max(0,Math.min(pathLength,walkAt+Number(b.dataset.walk)*22));});
  });
  window.addEventListener('island:role-selected',()=>{let saved=false;try{saved=!!localStorage.getItem('changxing-traveller');}catch{}if(!enabled&&!saved)openEditor();});
  function frame(now){
    const dt=last===null?0:Math.min(.05,(now-last)/1000);last=now;
    const paused=ocean.classList.contains('paused')||modalOpen()||document.hidden;
    if(enabled&&!paused){
      if(ride){
        ride.travelled=Math.min(ride.distance,ride.travelled+100*dt);
        const l=(ride.start+ride.travelled)%circuitLength,p=circuit.getPointAtLength(l),q=circuit.getPointAtLength((l+1)%circuitLength);
        const angle=Math.atan2(q.y-p.y,q.x-p.x)*180/Math.PI;
        playerTrain.setAttribute('transform',`translate(${p.x} ${p.y}) rotate(${angle})`);
        const percent=Math.floor(10*ride.travelled/ride.distance)*10;
        if(percent!==ride.lastPercent){ride.lastPercent=percent;message('已上車｜前往'+getIsland(ride.destination).name+'，'+percent+'%');}
        if(ride.travelled>=ride.distance){current=ride.destination;ride=null;walkAt=walkGoal=stationAt;playerTrain.style.display='none';save();updateHUD();focusCurrent();message('已抵達'+getIsland(current).name+'，下車後可點地面繼續探索。');}
      } else {
        let direction=0;
        if([...keys].some(k=>['ArrowLeft','ArrowUp','a','A','w','W'].includes(k)))direction--;
        if([...keys].some(k=>['ArrowRight','ArrowDown','d','D','s','S'].includes(k)))direction++;
        if(direction)walkGoal=Math.max(0,Math.min(pathLength,walkAt+direction*45*dt));
        const delta=walkGoal-walkAt,move=Math.sign(delta)*Math.min(Math.abs(delta),45*dt);
        walkAt+=move;actor.classList.toggle('is-walking',Math.abs(move)>.01);
        if(queuedDestination&&Math.abs(walkGoal-walkAt)<.1)startRide(queuedDestination);
      }
    }else actor.classList.remove('is-walking');
    if(enabled&&!ride){const i=getIsland(current),p=path.getPointAtLength(walkAt);actor.setAttribute('transform',`translate(${i.x+p.x} ${i.y+p.y})`);path.setAttribute('transform',`translate(${i.x} ${i.y})`);}
    requestAnimationFrame(frame);
  }
  window.addEventListener('passport:achievement',e=>{const next=e.detail?.complete===true;if(next===crowned)return;crowned=next;actor.innerHTML=figure({...look,crowned},true);updateHUD();});
  window.addEventListener('traveller:stop-walking',()=>{if(!ride&&!queuedDestination){keys.clear();walkGoal=walkAt;actor.classList.remove('is-walking');}});
  actor.innerHTML=figure({...look,crowned},true);updateHUD();
  message('點島上地面行走；搭海風號就能前往其他小島。');
  window.ChangxingTraveller = Object.freeze({
    snapshot() {
      const p=ride?circuit.getPointAtLength((ride.start+ride.travelled)%circuitLength):path.getPointAtLength(walkAt),i=getIsland(current);
      const q=ride?circuit.getPointAtLength((ride.start+ride.travelled+1)%circuitLength):p;
      return {enabled,crowned,boarding:!!queuedDestination,look:{...look},island:current,x:ride?p.x:i.x+p.x,y:ride?p.y:i.y+p.y,riding:!!ride,angle:ride?Math.atan2(q.y-p.y,q.x-p.x)*180/Math.PI:0,destination:ride?.destination||'',walking:actor.classList.contains('is-walking')};
    },
    figure, train:playerTrain.innerHTML.replace('>我<','>在線<'),
    islands:islands.map(i=>({...i}))
  });
  requestAnimationFrame(frame);
})();

