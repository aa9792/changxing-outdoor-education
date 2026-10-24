/* Long-lived curriculum content stays in script.js; this atlas uses its exported snapshot. */
(() => {
'use strict';
const metadata = {
 'home-rail': {no:'01',name:'家鄉鐵道',sub:'七堵的日常，就是學習起點',zone:'local',location:'基隆七堵',photo:'home.jpg',x:300,y:620,type:'community'},
 marine: {no:'02',name:'海洋探索',sub:'用五官閱讀海岸與海科館',zone:'ocean',location:'基隆八斗子',photo:'marine.jpg',x:665,y:300,type:'museum'},
 'rail-harbor': {no:'03',name:'港都與礦業',sub:'沿著鐵道，讀懂港城脈絡',zone:'local',location:'基隆港、七堵與新北猴硐',photo:'harbor.jpg',x:1000,y:595,type:'harbor'},
 sanxia: {no:'04',name:'產業文化',sub:'走進老街，認識手作與運輸',zone:'city',location:'新北三峽、鶯歌',photo:'culture.jpg',x:305,y:360,type:'village'},
 'multi-rail': {no:'05',name:'智慧交通',sub:'觀察城市如何安全地移動',zone:'city',location:'七堵出發，延伸臺北、南港與桃園',photo:'transit.jpg',x:640,y:700,type:'hub'},
 'metro-tech': {no:'06',name:'極東海岸',sub:'聽見海浪與鐵道的交響',zone:'ocean',location:'新北福隆、馬崗、三貂角',photo:'coast.jpg',x:1010,y:310,type:'lighthouse'}
};
const routes = ISLAND_DATA.routes.map(r => ({...r,...metadata[r.id]})).sort((a,b)=>a.no.localeCompare(b.no));
const $ = s => document.querySelector(s);
const esc = s => String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let active=null,filter='all',query='',zoom=1,pan={x:0,y:0},drag=null,visited=new Set();
try {visited=new Set(JSON.parse(localStorage.getItem('changxing-island-read')||'[]').filter(id=>metadata[id]));}catch{}
const poly=(points,fill,extra='')=>`<polygon points="${points}" fill="${fill}" ${extra}/>`;
function box(x,y,w,d,h,c='#e9d6a0',roof='#a65c43'){
 return poly(`${x-w/2},${y-h-d/2} ${x},${y-h} ${x},${y} ${x-w/2},${y-d/2}`,c)+poly(`${x},${y-h} ${x+w/2},${y-h-d/2} ${x+w/2},${y-d/2} ${x},${y}`,'#c5bf94')+poly(`${x-w/2},${y-h-d/2} ${x},${y-h-d} ${x+w/2},${y-h-d/2} ${x},${y-h}`,roof);
}
function tree(x,y,s=1){return `<g transform="translate(${x} ${y}) scale(${s})"><ellipse cy="5" rx="13" ry="6" fill="#527e6230"/><path d="M0 0V-26" stroke="#8a7960" stroke-width="4"/><path d="M0-65L-18-29H-11L-24-12H24L11-29H18Z" fill="#497b65"/><path d="M0-65V-12H24L11-29H18Z" fill="#608b6b"/></g>`;}
function school(){return `<g>${box(575,453,155,70,54,'#e4d6a6','#d98564')}${box(533,445,62,42,70,'#f5e8bd','#ca7354')}<path d="M518 385h28v35h-28z" fill="#d0dfd0"/><circle cx="532" cy="397" r="9" fill="#fffcdd"/><path d="M532 391v6l4 3" stroke="#6f8673" fill="none"/><path d="M553 423h13v20h-13zM579 409h13v16h-13zM603 398h13v16h-13z" fill="#6e9c96"/><path d="M625 386v-60" stroke="#8d8670" stroke-width="2"/><path d="M626 327l31 10-31 10" fill="#d68a5b"/><text x="565" y="465" font-size="12" fill="#3f6555" font-weight="700">長興國小</text></g>`;}
function building(r){let x=r.x,y=r.y;
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
 if(r.type==='station')return `${box(x,y,150,65,35,'#eddeb4','#cf8262')}<path d="M${x-60} ${y-63}l60-28 60 28-60 27Z" fill="#995c48"/><path d="M${x-26} ${y-39}h46v19h-46Z" fill="#f7f3da"/><text x="${x-18}" y="${y-26}" font-size="12" fill="#455d4a">七 堵</text><path d="M${x-55} ${y-31}v20m27-6v-18m72-2v16" stroke="#6a9c92" stroke-width="11"/>`;
 if(r.type==='museum')return `${box(x,y,150,70,21,'#dbe1cf','#c4d5c9')}<path d="M${x-60} ${y-53}C${x-55} ${y-136} ${x+46} ${y-143} ${x+65} ${y-73}L${x+65} ${y-48}Q${x} ${y-21} ${x-60} ${y-53}" fill="#8ab2b3"/><path d="M${x-60} ${y-53}Q${x+4} ${y-96} ${x+65} ${y-73}M${x-23} ${y-117}Q${x+6} ${y-76} ${x+3} ${y-37}M${x+15} ${y-119}Q${x+30} ${y-82} ${x+31} ${y-43}" fill="none" stroke="#e1eee0" stroke-width="3"/><path d="M${x-55} ${y-55}Q${x-45} ${y-118} ${x} ${y-121}" fill="none" stroke="#c3dedd" stroke-width="5"/>`;
 if(r.type==='lighthouse')return `<ellipse cx="${x}" cy="${y}" rx="50" ry="22" fill="#b1c7ac"/><path d="M${x-22} ${y-8}l8-116h28l9 116Z" fill="#ffefd1"/><path d="M${x-17} ${y-57}h35l3 23h-40Z" fill="#d58563"/><path d="M${x-17} ${y-123}v-23h35v23Z" fill="#9fbdad"/><path d="M${x-23} ${y-146}l23-15 23 15Z" fill="#bd745a"/><path d="M${x-24} ${y-122}h48" stroke="#647e70" stroke-width="4"/><circle cx="${x}" cy="${y-135}" r="7" fill="#fff5ae"/><path d="M${x-40} ${y+13}l18-12M${x+24} ${y+15}l16-7" stroke="#8eac95" stroke-width="6"/>`;
 if(r.type==='village')return `${box(x-33,y,75,43,42,'#e4c59b','#aa624c')}${box(x+35,y-27,75,43,51,'#eee0b7','#b97754')}<path d="M${x-46} ${y-26}v18m16-9v-18m55-17v-19m20 9v18" stroke="#789c94" stroke-width="9"/><path d="M${x-28} ${y+14}l68-30" stroke="#b8b198" stroke-width="8"/><path d="M${x-67} ${y-7}l-20 12M${x+60} ${y-20}l23 7" stroke="#769d75" stroke-width="10"/>`;
 if(r.type==='hub')return `${box(x-23,y-8,110,56,65,'#cfd6c4','#78998f')}${box(x+57,y-32,55,40,109,'#dce0c9','#88a99a')}<path d="M${x+42} ${y-129}v80m15-89v83m-94 7v31m22-39v33m23-42v30" stroke="#82a69e" stroke-width="7"/><path d="M${x-87} ${y+14}l110-48 48 25-110 48Z" fill="#e4d6ad"/><path d="M${x-64} ${y+14}l103-45" stroke="#9d9f8a" stroke-width="4"/><g class="floaty"><path d="M${x-60} ${y-2}l70-31 25 11-70 32Z" fill="#faf0ce"/><path d="M${x-53} ${y-5}l56-25 11 5-56 26Z" fill="#819e96"/><path d="M${x-63} ${y-2}v14l28 12v-14Z" fill="#cf8f63"/></g>`;
 return `${box(x-32,y-15,93,55,40,'#edcea0','#b77859')}<path d="M${x-70} ${y-68}v-85h91v11h-81v74m12-55 48 26m-48-39 31 17" stroke="#be9f63" stroke-width="6" fill="none"/><path d="M${x+21} ${y-139}v63" stroke="#6d8a78" stroke-width="2"/>${box(x+45,y+1,66,35,24,'#9abfb4','#78aaa3')}${box(x+77,y-18,60,32,20,'#dcad72','#d2bf8c')}<path d="M${x-82} ${y+10}l155-5 25 26-163 9Z" fill="#c2b491"/><path d="M${x-28} ${y+55}l86-1-13 24-64 4Z" fill="#f1e3bf"/><path d="M${x-12} ${y+46}h35v16h-35Z" fill="#88b1a5"/>`;
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
function railway(){
 const loop='M300 660 Q460 785 640 740 Q860 760 1000 635 Q1140 490 1010 350 Q845 247 665 340 Q465 250 305 400 Q171 514 300 660Z';
 const branch='M635 510 Q520 565 640 740';
 function track(d){return `<path class="bridge-shadow" d="${d}" transform="translate(0 12)"/><path class="bridge-deck" d="${d}"/><path class="sleepers" d="${d}"/><path class="rail-outer" d="${d}"/><path class="rail-inner" d="${d}"/>`;}
 const piers=[[210,523],[433,735],[825,731],[1094,492],[853,307],[473,316],[580,614]].map(([x,y])=>`<g class="bridge-pier"><path d="M${x-7} ${y}v25l7 5 7-5v-25" fill="#73978d"/><ellipse cx="${x}" cy="${y+30}" rx="15" ry="4" fill="#629f9b" opacity=".22"/></g>`).join('');
 const train=(begin,color)=>`<g class="island-train" aria-hidden="true"><g><rect x="-32" y="-7" width="27" height="14" rx="4" fill="#fff4d8" stroke="#547b74" stroke-width="1.5"/><path d="M-29 2h21" stroke="${color}" stroke-width="3"/><path d="M-27-3h5m4 0h5" stroke="#668f91" stroke-width="4"/><rect x="-2" y="-7" width="31" height="14" rx="5" fill="#fff4d8" stroke="#547b74" stroke-width="1.5"/><path d="M1 2h24" stroke="${color}" stroke-width="3"/><path d="M3-3h5m4 0h5m5-1h3" stroke="#668f91" stroke-width="4"/><path d="M-5 0h3" stroke="#547b74" stroke-width="2"/></g><animateMotion path="${loop}" dur="65s" begin="${begin}s" rotate="auto" repeatCount="indefinite"/></g>`;
 return `<g class="connections" aria-label="串聯六座課程島的示意鐵道">${piers}${track(loop)}${track(branch)}${train(-8,'#ce7955')}${train(-40,'#609b96')}</g>`;
}
function platform(r){return `<g class="station-platform" aria-hidden="true" transform="translate(${r.x-30} ${r.y+40})"><rect x="-22" y="-7" width="44" height="10" rx="3" fill="#f5e4be" stroke="#c1ac7d"/><path d="M-19-5h38" stroke="#d49557" stroke-width="2"/><path d="M-14-8v-13m28 13v-13" stroke="#6e8a79" stroke-width="2"/><path d="M-24-21h48l-5-6h-38Z" fill="#638e80"/><rect x="-9" y="-19" width="18" height="8" rx="2" fill="#fff4da"/><text y="-12" text-anchor="middle" font-size="6" fill="#496c5e">${r.no} 站</text></g>`;}
function draw(){
 const waves=Array.from({length:30},(_,i)=>{let x=55+(i*113)%1090,y=290+(i*91)%520;return `<path class="water-line" d="M${x} ${y}q10 5 20 0m10 0q8 4 17 0" stroke="#eff9e8" fill="none" opacity=".5" stroke-width="2" style="animation-delay:${i/4}s"/>`;}).join('');
 const central=`${islandGround(635,479)}<g transform="translate(585 472) scale(.4) translate(-575 -453)">${school()}</g><g transform="translate(695 474) scale(.47) translate(-300 -620)">${building({x:300,y:620,type:'station'})}</g><path d="M619 474L650 486" stroke="#e6dbb6" stroke-width="8" stroke-dasharray="3 3"/><text x="695" y="490" text-anchor="middle" font-size="10" fill="#386052" font-weight="700">台鐵七堵站</text>${tree(524,476,.48)}<g class="school-tag"><rect x="542" y="506" width="186" height="25" rx="12" fill="#fffaf0"/><text x="635" y="523" text-anchor="middle" font-size="11" font-weight="700" fill="#386052">長興國小 × 七堵車站・出發點</text></g>`;
 const nodes=routes.slice().sort((a,b)=>a.y-b.y).map((r,i)=>`<g class="node" data-node="${r.id}" tabindex="0" role="button" aria-label="探索${r.name}：${r.title}" aria-pressed="false">${islandGround(r.x,r.y,r.zone==='ocean'?'coast':r.zone==='city'?'culture':'green')}<g transform="translate(${r.x} ${r.y}) scale(.83) translate(${-r.x} ${-r.y})">${building(r)}</g>${tree(r.x-103,r.y-28,.65)}${tree(r.x+111,r.y-15,.55)}${people(r.x,r.y,i)}${platform(r)}${nameplate(r)}</g>`).join('');
 $('#island').innerHTML=`${waves}<g id="viewport">${railway()}${central}${nodes}<g class="boat"><path d="M837 705l68 1-17 16-44-3Z" fill="#f5ecd3"/><path d="M851 692h32v16h-32Z" fill="#d9d9bc"/><path d="M861 684h6v9h-6Z" fill="#d28a61"/><path d="M835 730q18 6 38 0" stroke="#e7f4df" stroke-width="2" fill="none"/></g><g transform="translate(117 685)"><path d="M0 0l28 17L0 9l-28 8Z" fill="#5e8a7b"/><text x="0" y="-12" text-anchor="middle" fill="#65877a" font-size="12">N</text></g></g>`;
 document.querySelectorAll('[data-node]').forEach(node=>{node.addEventListener('click',()=>openRoute(node.dataset.node));node.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();openRoute(node.dataset.node);}});});
}

function updateRead(){ $('#read-count').textContent=`${visited.size} / ${routes.length}`; }
function renderList(){
 const shown=routes.filter(r=>(filter==='all'||r.zone===filter)&&(`${r.name} ${r.title} ${r.location} ${r.summary} ${r.tasks.join(' ')}`.toLowerCase().includes(query)));
 $('#result-count').textContent=query||filter!=='all'?`找到 ${shown.length} 條路線`:'六條路線 · 六種看世界的方式';
 $('#route-index').innerHTML=shown.length?shown.map(r=>`<button class="route-card" data-route="${r.id}"><span class="route-no">${r.no}</span><span><strong>${r.name}</strong><small>${esc(r.sub)}</small></span><span class="read-mark">${visited.has(r.id)?'已讀':'↗'}</span></button>`).join(''):'<p class="empty">沒有符合的路線。<br>試試「七堵」「海洋」「交通」，或切回所有路線。</p>';
 $('#route-index').querySelectorAll('[data-route]').forEach(b=>b.addEventListener('click',()=>openRoute(b.dataset.route)));
 document.querySelectorAll('[data-node]').forEach(n=>{let matches=shown.some(r=>r.id===n.dataset.node);n.classList.toggle('dimmed',!matches);n.setAttribute('tabindex',matches?'0':'-1');});updateRead();
}
const activityRecords={
 'home-rail':{title:'家鄉鐵道｜從七堵出發',text:'現有資料收錄《我的家鄉線》影片；下方照片為猴硐鐵道相關場域影像，可連結家鄉鐵道與周邊地景的討論。',photos:[['home.jpg','猴硐鐵道場域影像']]},
 marine:{title:'海洋探索｜海科館學習足跡',text:'現有活動照片收錄館內團體合影，搭配本路線的步道觀察、展館探索與手作任務閱讀。',photos:[['marine.jpg','海洋探索活動合影']]},
 'rail-harbor':{title:'港都與礦業｜港灣與猴硐紀錄',text:'現有成果包含遊基隆港與猴硐活動照片，呈現這條路線的港灣及鐵道場域。',photos:[['harbor.jpg','遊基隆港活動照片'],['harbor-extra.jpg','遊基隆港另一個視角'],['home.jpg','猴硐活動照片']]},
 sanxia:{title:'產業文化｜三峽走讀紀錄',text:'現有成果收錄三峽活動照片，可與老街、地方產業及文化探索任務對照閱讀。',photos:[['culture.jpg','三峽活動照片']]},
 'multi-rail':{title:'智慧交通｜捷運行控中心見習',text:'現有成果收錄捷運行控中心照片，對應路線中的交通運作與安全移動探究。',photos:[['transit.jpg','捷運行控中心活動照片']]},
 'metro-tech':{title:'極東海岸｜山海探索紀錄',text:'現有資料包含《極東點探險》影片及本路線相關照片，可與福隆、馬崗及三貂角的課程任務一同閱讀。',photos:[['coast.jpg','極東海岸課程相關照片']]}
};
function activitySection(id){const a=activityRecords[id];return `<section class="activity-update" aria-label="路線活動紀錄"><p class="eyebrow">ISLAND JOURNAL · 島嶼記事</p><h3>${a.title}</h3><p>${a.text}</p><div class="activity-gallery">${a.photos.map(([file,caption])=>`<figure><a href="assets/island/${file}" target="_blank" rel="noopener" aria-label="開啟原圖：${caption}"><img src="assets/island/${file}" alt="${caption}" loading="lazy" width="600" height="400"/><span>查看原圖 ↗</span></a><figcaption>${caption}</figcaption></figure>`).join('')}</div><small>以上為資料夾現有成果；活動日期未註記，尚無法判定最近一次辦理時間。照片可點開查看。</small></section>`;}
function openRoute(id,updateHash=true){
 const r=routes.find(x=>x.id===id);if(!r)return;active=id;visited.add(id);try{localStorage.setItem('changxing-island-read',JSON.stringify([...visited]));}catch{}updateRead();
 const template=ISLAND_DATA.templates[id];const train=ISLAND_DATA.train[id];
 $('#overview').hidden=true;$('#detail').hidden=false;focusIsland(r);
 $('#detail').innerHTML=`<div class="detail-header"><button class="back" id="back">← 回到所有路線</button></div><figure class="detail-photo"><img src="assets/island/${r.photo}" alt="長興國小${r.name}相關戶外教育活動" width="600" height="400"><figcaption>長興國小既有課程照片</figcaption></figure><div class="detail-content"><p class="eyebrow">EXPLORE / ${r.no}</p><h2 tabindex="-1">${esc(r.name)}</h2><p class="detail-summary">${esc(r.summary)}</p><p class="route-location">場域範圍　${esc(r.location)}<br>課程標示　${esc(r.grade)}</p><div class="stops">${r.stops.map(esc).join('　／　')}</div>${activitySection(id)}<h3>孩子帶著什麼任務出發？</h3><ul>${r.tasks.map(t=>`<li>${esc(t)}</li>`).join('')}</ul><h3>TRAIN，每一次探究的五個站</h3>${train.map(([title,body])=>`<div class="train-stop"><b aria-hidden="true">${title[0]}</b><div><strong>${esc(title.slice(2))}</strong><p>${esc(body)}</p></div></div>`).join('')}<details><summary>行前、現場與課後怎麼學？</summary><h3>行前準備</h3><ul>${template.before.map(t=>`<li>${esc(t)}</li>`).join('')}</ul><h3>場域學習</h3><ul>${template.during.map(t=>`<li>${esc(t)}</li>`).join('')}</ul><h3>課後整理</h3><ul>${template.after.map(t=>`<li>${esc(t)}</li>`).join('')}</ul></details><details><summary>這條路線留下哪些學習成果？</summary><ul>${template.outcomes.map(t=>`<li>${esc(t)}</li>`).join('')}</ul><p class="detail-summary">以上為課程設定的成果形式，實際學習表現須搭配學生作品與教師觀察檢視。</p></details><a class="primary" href="curriculum.html?route=${encodeURIComponent(id)}#routes">閱讀完整教案與風險規劃 ↗</a><a class="secondary-link" href="curriculum.html#lesson-builder">帶進自己的教案設計</a><div class="return-row"><button id="back-bottom">← 繼續探索其他場域</button></div></div>`;
 $('#back').addEventListener('click',back);$('#back-bottom').addEventListener('click',back);
 document.querySelectorAll('[data-node]').forEach(n=>{let selected=n.dataset.node===id;n.classList.toggle('is-active',selected);n.setAttribute('aria-pressed',String(selected));});
 $('.panel').scrollTop=0;$('#detail h2').focus({preventScroll:true});
 if(updateHash)history.replaceState(null,'','#'+id);
}
function back(){active=null;resetView();$('#detail').hidden=true;$('#overview').hidden=false;document.querySelectorAll('[data-node]').forEach(n=>{n.classList.remove('is-active');n.setAttribute('aria-pressed','false');});history.replaceState(null,'',location.pathname+location.search);renderList();$('.panel').scrollTop=0;$('#search').focus({preventScroll:true});}
function resetView(){zoom=1;pan={x:0,y:0};transform();}
function focusIsland(r){zoom=2.35;pan={x:620-zoom*r.x-(1-zoom)*620,y:520-zoom*(r.y-15)-(1-zoom)*480};transform();}
function transform(){ $('#viewport').setAttribute('transform',`translate(${pan.x+(1-zoom)*620} ${pan.y+(1-zoom)*480}) scale(${zoom})`); }
function setZoom(v){zoom=Math.max(.75,Math.min(3,v));transform();}
function prefersReduced(){return matchMedia('(prefers-reduced-motion: reduce)').matches;}
draw();renderList();
$('#search').addEventListener('input',e=>{query=e.target.value.trim().toLowerCase();renderList();});
document.querySelectorAll('[data-filter]').forEach(b=>b.addEventListener('click',()=>{filter=b.dataset.filter;document.querySelectorAll('[data-filter]').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));renderList();}));
$('#zoom-in').addEventListener('click',()=>setZoom(zoom+.15));$('#zoom-out').addEventListener('click',()=>setZoom(zoom-.15));$('#reset').addEventListener('click',resetView);
$('#connections').addEventListener('click',e=>{let on=e.currentTarget.getAttribute('aria-pressed')!=='true';e.currentTarget.setAttribute('aria-pressed',String(on));$('.connections').classList.toggle('is-off',!on);});
$('#motion').addEventListener('click',e=>{let paused=e.currentTarget.getAttribute('aria-pressed')!=='true';e.currentTarget.setAttribute('aria-pressed',String(paused));e.currentTarget.textContent=paused?'播放動態':'暫停動態';$('#ocean').classList.toggle('paused',paused);if(paused)$('#island').pauseAnimations();else if(!prefersReduced())$('#island').unpauseAnimations();});
document.querySelectorAll('[data-light]').forEach(b=>b.addEventListener('click',()=>{document.body.dataset.light=b.dataset.light;document.querySelectorAll('[data-light]').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));}));
const scene=$('#scene');scene.addEventListener('pointerdown',e=>{if(e.target.closest('[data-node]'))return;drag={x:e.clientX,y:e.clientY,startX:pan.x,startY:pan.y};scene.setPointerCapture(e.pointerId);});
scene.addEventListener('pointermove',e=>{if(!drag)return;let scale=1200/$('#island').getBoundingClientRect().width;pan={x:Math.max(-450,Math.min(450,drag.startX+(e.clientX-drag.x)*scale)),y:Math.max(-280,Math.min(280,drag.startY+(e.clientY-drag.y)*scale))};transform();});
scene.addEventListener('pointerup',()=>drag=null);scene.addEventListener('pointercancel',()=>drag=null);
const guide=$('#guide');$('#help').addEventListener('click',()=>guide.showModal());$('#close-guide').addEventListener('click',()=>guide.close());$('#start').addEventListener('click',()=>guide.close());
window.addEventListener('hashchange',()=>{let id=location.hash.slice(1);if(metadata[id])openRoute(id,false);else if(!id&&active)back();});
if(prefersReduced()){$('#ocean').classList.add('reduced-motion');$('#island').pauseAnimations();}
let initial=location.hash.slice(1);if(metadata[initial])openRoute(initial,false);
})();
