/* Ephemeral PeerJS/WebRTC room. No visitor history, camera, microphone or chat log. */
(() => {
  'use strict';
  const api=window.ChangxingTraveller,$=s=>document.querySelector(s),ns='http://www.w3.org/2000/svg';
  if(!api)return;
  const islandIds=new Set(api.islands.map(i=>i.id));
  const colors={skin:['#f1d3b0','#e6bc94','#c58d65','#956544'],hair:['#4e493d','#76523a','#aa8454','#6d7372'],shirt:['#d9ad52','#6ca69b','#668ea7','#c67d68','#8a82ac']};
  const phrases=['👋 向大家揮手','🚆 一起搭海風號','🔎 我有新發現'];
  const roomParam=new URL(location.href).searchParams.get('room');
  const roomValue=/^[a-zA-Z0-9-]{1,16}$/.test(roomParam||'')?roomParam:'public';
  $('#overview').insertAdjacentHTML('beforebegin',`<section class="live-panel" aria-label="即時同遊"><div class="live-heading"><h3>即時同遊 <span id="live-count">未加入</span></h3><button id="live-toggle">開啟同遊</button></div><p id="live-status" role="status">與同時在線的人相遇，看見彼此走動與搭車。</p><label class="live-room">同遊房間<input id="live-room" maxlength="16" pattern="[a-zA-Z0-9-]{1,16}" value="${roomValue}" aria-label="同遊房間代碼"><button id="live-copy">複製邀請</button></label><div id="live-people"></div><div class="live-greetings">${phrases.map((p,i)=>`<button data-greeting="${i}" disabled>${p}</button>`).join('')}</div><p id="live-message" aria-live="polite"></p><small>先建立角色，再開啟同遊。共用房間 public，或輸入相同英文／數字代碼；每房最多 8 人。僅分享暱稱、造型與位置，離線即離場。請勿使用真實姓名。連線服務：PeerJS；部分校園網路可能阻擋。</small></section>`);
  const layer=document.createElementNS(ns,'g');layer.id='live-travellers';layer.setAttribute('aria-hidden','true');$('#viewport').append(layer);
  let active=false,peer=null,host=false,upstream=null,generation=0,retryTimer=null,poll=null,lastWave=0,room='';
  let ownId='',lastRoster=0,lastList='';const links=new Map(),states=new Map(),actors=new Map();
  function status(s){$('#live-status').textContent=s;}
  function clean(raw){
    if(!raw||typeof raw!=='object'||!raw.enabled||!islandIds.has(raw.island)||!Number.isFinite(raw.x)||!Number.isFinite(raw.y)||raw.x<0||raw.x>1200||raw.y<0||raw.y>1100)return null;
    const a=raw.look;if(!a||typeof a!=='object')return null;
    const look={name:String(a.name||'小島旅人').replace(/[\u0000-\u001f\u007f]/g,'').slice(0,12),style:['short','long','curly'].includes(a.style)?a.style:'short',hat:a.hat==='none'?'none':'explorer',bag:a.bag===true};
    for(const k of Object.keys(colors))look[k]=colors[k].includes(a[k])?a[k]:colors[k][0];
    return {enabled:true,look,island:raw.island,x:raw.x,y:raw.y,riding:raw.riding===true,angle:Number.isFinite(raw.angle)?Math.max(-180,Math.min(180,raw.angle)):0,destination:islandIds.has(raw.destination)?raw.destination:'',walking:raw.walking===true};
  }
  function send(c,data){if(c?.open)try{c.send(data);}catch{}}
  function roster(){return [...states].map(([id,p])=>({id,state:p.state}));}
  function broadcast(){const data={type:'roster',people:roster()};for(const c of links.values())send(c,data);if(host)status(links.size?'房間 '+room+' 已連線。點旅人名稱可找到對方。':'房間 '+room+' 已連線，等待其他旅人加入。');render();}
  function render(){
    const remote=[...states].filter(([id])=>id!==ownId);
    for(const [id,e] of actors)if(!states.has(id)||id===ownId){e.actor.remove();e.train.remove();actors.delete(id);}
    for(const [id,{state:s}] of remote){
      let e=actors.get(id);
      if(!e){const actor=document.createElementNS(ns,'g'),train=document.createElementNS(ns,'g');actor.classList.add('live-traveller');train.classList.add('live-train');layer.append(actor);$('.rail-vehicles').append(train);train.innerHTML=api.train;e={actor,train,look:''};actors.set(id,e);}
      const signature=JSON.stringify(s.look);if(signature!==e.look){e.actor.innerHTML=api.figure({...s.look,name:'● '+s.look.name},true);e.look=signature;}
      e.actor.style.display=s.riding?'none':'';e.train.style.display=s.riding?'':'none';e.actor.classList.toggle('is-walking',s.walking);
      e.actor.setAttribute('transform',`translate(${s.x} ${s.y})`);e.train.setAttribute('transform',`translate(${s.x} ${s.y}) rotate(${s.angle})`);
      e.actor.dataset.island=s.island;
    }
    $('#live-count').textContent=active?`${states.size} 人在線`:'未加入';
    const list=$('#live-people'),signature=JSON.stringify([...states].map(([id,{state:s}])=>[id,s.look.name,s.island,s.riding,s.destination]));
    if(signature===lastList)return;lastList=signature;list.replaceChildren();
    for(const [id,{state:s}] of states){
      const b=document.createElement('button'),i=api.islands.find(i=>i.id===s.island);b.className='live-person';
      b.textContent=`${id===ownId?'我 · ': '● '}${s.look.name}｜${s.riding?'搭車中 → '+(api.islands.find(i=>i.id===s.destination)?.name||'下一島'):i.name}`;
      b.addEventListener('click',()=>window.dispatchEvent(new CustomEvent(s.riding?'traveller:overview':'traveller:focus',{detail:{id:s.island}})));list.append(b);
    }
  }
  function clearPeers(){for(const e of actors.values()){e.actor.remove();e.train.remove();}actors.clear();states.clear();links.clear();upstream=null;host=false;ownId='';}
  function stop(){active=false;generation++;clearTimeout(retryTimer);clearInterval(poll);peer?.destroy();peer=null;clearPeers();$('#live-toggle').textContent='開啟同遊';$('#live-room').disabled=false;document.querySelectorAll('[data-greeting]').forEach(b=>b.disabled=true);status('已離開同遊；你可以繼續自己探索。');render();}
  function retry(g,text){if(!active||g!==generation)return;status(text);clearTimeout(retryTimer);retryTimer=setTimeout(()=>{if(active&&g===generation)connect();},2500+Math.random()*2000);}
  function receiveRoster(data){
    if(data.type!=='roster'||!Array.isArray(data.people))return;
    lastRoster=Date.now();states.clear();for(const p of data.people.slice(0,8)){if(typeof p?.id!=='string'||p.id.length>100)continue;const s=clean(p.state);if(s)states.set(p.id,{state:s,at:Date.now()});}render();
  }
  function showWave(id,n){const p=states.get(id);if(!p||!Number.isInteger(n)||!phrases[n])return;$('#live-message').textContent=`${p.state.look.name}：${phrases[n]}`;const e=actors.get(id);if(e){e.actor.classList.add('is-waving');setTimeout(()=>e.actor.classList.remove('is-waving'),1600);}}
  function bind(c,g,isHost){
    let seen=Date.now(),lastPacket=0,lastGreeting=0;
    c.on('open',()=>{
      if(g!==generation||!active){c.close();return;}
      if(isHost){if(links.size>=7){send(c,{type:'full'});setTimeout(()=>c.close(),300);return;}links.set(c.peer,c);broadcast();}
      else {upstream=c;lastRoster=Date.now();status('已連上同遊房間 '+room+'。點旅人名稱可找到對方。');send(c,{type:'state',state:api.snapshot()});}
    });
    c.on('data',data=>{
      if(g!==generation||!active||!data||typeof data!=='object')return;seen=Date.now();
      if(isHost){
        if(!links.has(c.peer))return;
        if(data.type==='state'&&Date.now()-lastPacket>65){lastPacket=Date.now();const s=clean(data.state);if(s){states.set(c.peer,{state:s,at:seen});broadcast();}}
        if(data.type==='wave'&&Date.now()-lastGreeting>2500&&Number.isInteger(data.n)&&phrases[data.n]){lastGreeting=Date.now();showWave(c.peer,data.n);for(const out of links.values())send(out,{type:'wave',id:c.peer,n:data.n});}
      }else{if(data.type==='full'){stop();status('這個房間已滿（8 人），請換個房間代碼再加入。');}else if(data.type==='wave')showWave(data.id,data.n);else receiveRoster(data);}
    });
    c.on('close',()=>{if(g!==generation||!active)return;if(isHost){links.delete(c.peer);states.delete(c.peer);broadcast();}else{clearPeers();render();retry(g,'同遊連線中斷，正在重新集合…');}});
    c.on('error',()=>{if(g===generation)retry(g,'連線未完成，正在重試；若持續失敗，請換個網路。');});
    setTimeout(()=>{if(g===generation&&active&&!c.open)retry(g,'暫時無法連上其他旅人，正在重試…');},12000);
  }
  function connect(){
    if(!active)return;
    const g=++generation;clearTimeout(retryTimer);peer?.destroy();clearPeers();render();status('正在連接同遊房間 '+room+'…');
    if(!window.Peer){status('連線元件未載入，請重新整理後再試。');return;}
    const hub='changxing-learning-islands-v1-'+room.toLowerCase();
    peer=new Peer(hub,{debug:0});const candidate=peer;
    peer.on('open',()=>{if(g!==generation)return;host=true;ownId=peer.id;const s=clean(api.snapshot());if(s)states.set(ownId,{state:s,at:Date.now()});status('房間 '+room+' 已連線，等待其他旅人加入。');render();});
    peer.on('connection',c=>bind(c,g,true));
    peer.on('error',e=>{
      if(g!==generation||!active)return;
      if(e.type==='unavailable-id'){
        peer=null;candidate.destroy();peer=new Peer(undefined,{debug:0});
        peer.on('open',()=>{if(g!==generation)return;ownId=peer.id;bind(peer.connect(hub,{reliable:true,serialization:'json'}),g,false);});
        peer.on('error',()=>retry(g,'連線未完成，正在重試…'));
        peer.on('disconnected',()=>retry(g,'網路中斷，正在重新連線…'));
      }else retry(g,'連線服務暫時無法使用，正在重試…');
    });
    candidate.on('disconnected',()=>{if(peer===candidate)retry(g,'網路中斷，正在重新連線…');});
  }
  $('#live-toggle').addEventListener('click',()=>{
    if(active){stop();return;}if(!api.snapshot().enabled){status('請先按「建立我的角色」，完成造型後再開啟同遊。');$('#create-traveller').click();return;}
    room=$('#live-room').value.trim().toLowerCase();if(!/^[a-z0-9-]{1,16}$/.test(room)){status('房間代碼請填 1–16 個英文字母、數字或連字號。');return;}
    active=true;$('#live-room').disabled=true;$('#live-toggle').textContent='離開同遊';document.querySelectorAll('[data-greeting]').forEach(b=>b.disabled=false);connect();
    poll=setInterval(()=>{
      if(!active)return;const s=clean(api.snapshot());if(!s){stop();return;}
      if(host&&ownId){states.set(ownId,{state:s,at:Date.now()});for(const [id,p] of states)if(id!==ownId&&Date.now()-p.at>15000){links.get(id)?.close();links.delete(id);states.delete(id);}broadcast();}
      else if(upstream?.open){if(Date.now()-lastRoster>15000){upstream.close();}else send(upstream,{type:'state',state:s});}
    },150);
  });
  document.querySelectorAll('[data-greeting]').forEach(b=>b.addEventListener('click',()=>{if(!active||Date.now()-lastWave<3000)return;lastWave=Date.now();const n=+b.dataset.greeting;if(host){showWave(ownId,n);for(const c of links.values())send(c,{type:'wave',id:ownId,n});}else send(upstream,{type:'wave',n});}));
  $('#live-copy').addEventListener('click',async()=>{const url=new URL(location.href);url.searchParams.set('room',$('#live-room').value.trim()||'public');try{await navigator.clipboard.writeText(url.href);$('#live-message').textContent='邀請網址已複製。朋友開啟後選角色，再按「開啟同遊」。';}catch{$('#live-message').textContent='邀請網址：'+url.href;}});
  window.addEventListener('pagehide',()=>{if(active)stop();});
})();


