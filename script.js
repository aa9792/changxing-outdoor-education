const routes = [
  {
    id: "home-rail",
    title: "鐵道尋蹤：我們的家鄉線",
    theme: "七堵在地走讀",
    grade: "校本鐵道課程",
    image: "成果照片/361167_0.jpg",
    document: "鐵道尋蹤我們的家鄉線：.pdf",
    color: "#2f6f73",
    summary:
      "從長興國小與七堵車站的日常地景出發，讓學生踏查車站、公園、舊照片與社區路徑，理解鐵道如何成為家鄉的生活節奏。",
    stops: ["長興國小", "七堵車站", "鐵道周邊社區", "地方公共空間"],
    tasks: [
      "比對老照片與現地景觀，建構城市變遷的時間感。",
      "記錄鐵道設施與生活環境的關係，形成家鄉導覽素材。",
      "從觀察到提案，思考公共空間如何更友善。"
    ],
    coords: [
      [25.094, 121.713],
      [25.092, 121.714],
      [25.095, 121.716],
      [25.097, 121.712]
    ]
  },
  {
    id: "metro-tech",
    title: "聽見海浪與鐵道的交響：三貂角極東點探險行",
    theme: "海浪、鐵道與極東點探究",
    grade: "中、高年級版本",
    image: "成果照片/361168_0.jpg",
    document: "聽見海浪與鐵道的交響：三貂角極東點探險行 (中、高年級版本).docx",
    color: "#126c9a",
    summary:
      "以馬崗潮間帶、舊草嶺隧道、三貂角燈塔與地方食農文化為核心，讓中年級透過遊覽車與文化體驗親近海岸，高年級以火車與單車進行鐵道、潮間帶與極東地景探究。",
    stops: ["長興國小", "福隆車站", "舊草嶺隧道", "馬崗潮間帶", "三貂角燈塔"],
    tasks: [
      "運用平板拍攝並辨識潮間帶生物特徵，建立馬崗海岸生態觀察紀錄。",
      "比較中年級遊覽車文化體驗與高年級火車單車探究的學習路徑。",
      "觀察三貂角極東點地景、海岸防風建築與舊草嶺隧道鐵道聲學現象。"
    ],
    coords: [
      [25.094, 121.713],
      [25.0165, 121.9445],
      [25.019, 121.946],
      [25.0075, 121.995],
      [25.0068, 122.002]
    ]
  },
  {
    id: "rail-harbor",
    title: "軌道傳承．海港共生",
    theme: "礦業、鐵道與港灣",
    grade: "優質路線",
    image: "成果照片/遊基隆港2.jpg",
    document: "軌道傳承．海港共生：家鄉文化跨域深度走讀計畫.pdf",
    color: "#af563d",
    summary:
      "以七堵鐵道節點為起點，串聯猴硐礦區與基隆港，理解能源開採、鐵路運輸與國際貿易交織出的產業鏈。",
    stops: ["長興國小", "猴硐礦區", "基隆車站", "基隆港"],
    tasks: [
      "踏查礦坑、舊線遺構與港口設施，理解產業流動。",
      "用圖像、照片與口述資料比對歷史變遷。",
      "提出文化保存、港灣空間或導覽活化的友善提案。"
    ],
    coords: [
      [25.094, 121.713],
      [25.0872, 121.8275],
      [25.1314, 121.7392],
      [25.133, 121.744]
    ]
  },
  {
    id: "multi-rail",
    title: "軌道領航員：智慧交通運作與多鐵樞紐見習之旅",
    theme: "智慧交通與多鐵樞紐",
    grade: "五、六年級",
    image: "成果照片/361169_0.jpg",
    document: "軌道領航員：智慧交通運作與多鐵樞紐見習之旅.docx",
    color: "#c98722",
    summary:
      "整合五年級捷運行控與北投機廠見習，以及六年級台鐵、高鐵、機捷與機場樞紐串聯，讓學生從深度技術觀察到廣度轉乘體驗，理解智慧交通、安全監控、車輛維修與多模式運輸網絡。",
    stops: ["長興國小", "七堵車站", "台北車站捷運行控中心", "北投機廠", "南港車站", "Xpark", "桃園國際機場"],
    tasks: [
      "記錄捷運行控系統、安全監控與車輛維修保養流程，連結交通職涯探索。",
      "比較台鐵、高鐵與機場捷運的速度、車廂設計、轉乘動線與服務功能。",
      "觀察南港、桃園、機場與台北車站的多模式轉運設計，並以數位學習單完成反思。"
    ],
    coords: [
      [25.094, 121.713],
      [25.092, 121.714],
      [25.0478, 121.517],
      [25.1305, 121.498],
      [25.0533, 121.607],
      [25.016, 121.215],
      [25.0806, 121.232]
    ]
  },
  {
    id: "sanxia",
    title: "三峽與鐵道：穿越時空的運輸之旅",
    theme: "歷史街區與產業運輸",
    grade: "四年級",
    image: "成果照片/361170_0.jpg",
    document: "三峽與鐵道：穿越時空的運輸之旅.pdf",
    color: "#5f8f3f",
    summary:
      "透過金牛角 DIY、祖師廟走讀與藍染體驗，理解三峽產業如何透過輕便鐵道與鶯歌車站連結到更大的市場。",
    stops: ["長興國小", "三峽老街", "祖師廟", "藍染體驗館", "鶯歌車站"],
    tasks: [
      "從手作體驗理解地方產業與職人精神。",
      "認識三峽與鶯歌雙城的運輸歷史。",
      "討論輕便鐵道如何支持藍染布料與地方物流。"
    ],
    coords: [
      [25.094, 121.713],
      [24.934, 121.369],
      [24.9345, 121.3692],
      [24.9332, 121.3695],
      [24.9546, 121.3555]
    ]
  },
  {
    id: "marine",
    title: "海科館戶外教育",
    theme: "海洋生態與 STEAM",
    grade: "二年級",
    image: "成果照片/361171_0.jpg",
    document: "長興國小海科館戶外教育計畫.pdf",
    color: "#305f9f",
    summary:
      "結合容軒步道、海洋劇場、DIY 教室與兒童廳，讓低年級學生用五官探索海岸林與海洋生態，並以手作收斂學習經驗。",
    stops: ["長興國小", "容軒步道", "國立海洋科技博物館", "海洋劇場", "兒童廳"],
    tasks: [
      "在步道進行生態感知觀察，認識海岸林植物。",
      "觀賞海洋劇場，理解海洋生態多樣性。",
      "製作海藻鑰匙圈，把海洋元素轉化為 STEAM 作品。"
    ],
    coords: [
      [25.094, 121.713],
      [25.137, 121.797],
      [25.14, 121.799],
      [25.141, 121.801],
      [25.139, 121.798]
    ]
  }
];

const routeTemplates = {
  "home-rail": {
    before: ["閱讀七堵車站與校園周邊地圖。", "觀察老照片，討論家鄉地景的變與不變。"],
    during: ["踏查車站與鐵道周邊公共空間。", "記錄鐵道設施、通學路徑與社區生活線索。"],
    after: ["整理家鄉導覽稿。", "提出公共空間友善改善想法。"],
    outcomes: ["家鄉鐵道觀察紀錄", "小小導覽員口說稿", "空間改善提案"],
    checklistSummary: "能以學校附近及社區人文環境為核心，完成觀察、紀錄、分享與地方認同的學習歷程。",
    checklistResults: [
      { topic: "有意義的學習", indicator: "認識學校附近及社區的人文環境", result: "優", evidence: "以七堵車站、鐵道周邊社區與公共空間作為主要踏查場域。" },
      { topic: "有意義的學習", indicator: "實際觀測社區周邊環境事物並提出觀察心得", result: "優", evidence: "透過老照片比對、地景踏查與家鄉導覽任務整理觀察。" },
      { topic: "友善環境", indicator: "從活動過程認識地方優勢並產生地方認同", result: "優", evidence: "以七堵鐵道節點連結學生通學經驗與家鄉文化記憶。" },
      { topic: "尊重與關懷他人", indicator: "傾聽同儕觀察並分享自身經驗", result: "良", evidence: "可於後續成果展加入同儕互評與導覽回饋紀錄，使證據更完整。" }
    ]
  },
  "metro-tech": {
    before: [
      "中年級認識馬崗海女文化與地理位置，學習看懂潮汐表，練習平板拍照與愛護生物觀念。",
      "高年級認識舊草嶺隧道歷史與鐵道聲學，演練單車手勢、道路安全與潮間帶生態紀錄技巧。",
      "依中央氣象署預報確認潮汐時間，完成健康調查、保險、平板防水套與防滑鞋等裝備檢核。"
    ],
    during: [
      "中年級以遊覽車前往馬崗，進行潮間帶生態觀察、草仔粿 DIY、在地午餐與三貂角燈塔地景眺望。",
      "高年級搭火車至福隆，騎乘單車通過舊草嶺隧道前往馬崗，執行潮間帶生物測量、紀錄與無痕飲食。",
      "行程中嚴格分組與點名，動態監控天候與潮汐；若遇雨天，中年級改室內導覽與 DIY，高年級啟動火車或公車備案。"
    ],
    after: [
      "中年級舉辦照片分享會，展示最喜歡的潮間帶生物並品嚐自製草仔粿，分享地方特產與文化優勢。",
      "高年級繪製馬崗潮間帶生物分布圖，分析遊客對海岸生態的影響並提出改善構想。",
      "盤點歸還防滑鞋、平板、單車與安全帽，蒐集回饋單並召開教師檢討會議，優化動線與風險處置。"
    ],
    outcomes: ["潮間帶生物照片紀錄", "馬崗潮間帶生物分布圖", "三貂角極東點地景觀察", "無痕飲食與海岸友善行動反思"],
    checklistSummary: "能結合海岸潮間帶、鐵道隧道、單車移動與地方食農文化，讓學生透過五官感知、實地觀察、紀錄與反思，形成珍愛自然與友善環境的行動意識。",
    checklistResults: [
      { topic: "有意義的學習", indicator: "運用符合個人能力的學習工具認識自然與人文環境", result: "優", evidence: "以平板拍攝、潮汐表判讀、潮間帶觀察與三貂角燈塔地景紀錄作為主要學習工具。" },
      { topic: "健康的身心", indicator: "透過五官感知環境並安全完成戶外學習活動", result: "優", evidence: "課程安排防滑鞋、防水套、單車手勢、潮汐撤離與分組點名，能支撐海岸與單車場域安全。" },
      { topic: "友善環境", indicator: "認識地方環境優勢並產生地方情感與認同", result: "優", evidence: "透過馬崗海女文化、草仔粿食農、極東點地景與潮間帶生態，連結地方特色與文化優勢。" },
      { topic: "尊重與關懷他人", indicator: "遵守保護環境規範並身體力行不破壞環境", result: "良", evidence: "文件已納入無痕飲食、淨灘構想與潮間帶界線管控，後續可補學生實際行動照片。" }
    ]
  },
  "rail-harbor": {
    before: ["認識七堵鐵道、猴硐礦業與基隆港的產業關係。", "閱讀煤礦、鐵道與港口照片。"],
    during: ["踏查猴硐礦區與基隆港場域。", "比對礦業、鐵道與港灣如何形成產業鏈。"],
    after: ["製作產業流動路線圖。", "提出文化保存或港灣導覽提案。"],
    outcomes: ["產業鏈走讀紀錄", "港灣與礦業導覽圖", "文化保存提案"],
    checklistSummary: "能從七堵鐵道延伸至猴硐礦業與基隆港，形成跨區人文產業脈絡與地方行動構想。",
    checklistResults: [
      { topic: "有意義的學習", indicator: "認識且記錄臺灣各地人文環境特色", result: "優", evidence: "路線串聯鐵道、礦業、港灣，能完整呈現產業鏈發展脈絡。" },
      { topic: "有意義的學習", indicator: "提出對觀察事物的發現與學習收穫", result: "優", evidence: "透過圖像、照片與口述資料比對，產出產業流動與港灣觀察。" },
      { topic: "友善環境", indicator: "發掘地方優勢並產生發展地方優勢的策略與行動構想", result: "良", evidence: "已有文化保存與導覽提案方向，建議補上學生提案成品照片。" },
      { topic: "尊重與關懷他人", indicator: "共同討論垃圾減量與維護環境永續策略", result: "良", evidence: "港灣與礦區走讀可加入無痕、減塑與場域復原檢核。" }
    ]
  },
  "multi-rail": {
    before: [
      "五年級認識七堵車站、台北車站捷運行控中心與北投機廠，練習平板數位學習單操作。",
      "六年級認識接駁與轉運站功能，比較台鐵、高鐵、機捷的速度、軌距與供電。",
      "完成健康調查表、平板防摔殼與掛繩檢查，預先下載離線版學習單與地圖。"
    ],
    during: [
      "五年級於七堵、台北車站與北投機廠拍攝車輛維修保養過程，錄音訪談捷運調度員與維修工程師。",
      "六年級從七堵搭台鐵至南港，轉乘高鐵到桃園，參訪 Xpark，再搭機捷前往桃園機場與台北車站。",
      "在南港、桃園與台北等轉乘點宣告迷路集合點，實施平板設備夥伴制並落實月台黃線外候車。"
    ],
    after: [
      "五年級以小組發表回顧捷運技術、行控安全與交通職涯發展。",
      "六年級統整三種鐵道系統差異，討論七堵調車場對台灣貨運與鐵道網絡的重要性。",
      "統一回收平板設備，檢查資料完整度，蒐集活動回饋單並檢討轉乘流暢度與數位工具效益。"
    ],
    outcomes: ["智慧交通數位學習單", "捷運行控與機廠職涯訪談紀錄", "多鐵系統比較表", "轉乘樞紐觀察與安全反思"],
    checklistSummary: "能從捷運行控與機廠深度見習，延伸到台鐵、高鐵、機捷與機場樞紐的廣度體驗，完成交通系統比較、職涯探索與公共安全素養學習。",
    checklistResults: [
      { topic: "有意義的學習", indicator: "認識且記錄臺灣各地人文環境特色", result: "優", evidence: "路線包含捷運行控中心、北投機廠、南港高鐵、桃園機捷、Xpark 與機場樞紐等多元人文交通場域。" },
      { topic: "有意義的學習", indicator: "運用工具觀測、記錄環境特性並撰寫觀察心得", result: "優", evidence: "文件明列平板數位學習單、拍攝維修保養、錄音訪談、轉乘動線紀錄與車廂系統比較。" },
      { topic: "健康的身心", indicator: "安全完成戶外及海洋教育課程體驗並提出省思", result: "良", evidence: "課程已納入月台黃線、教師夾心防護網、迷路集合點、補水遮蔭與設備夥伴制。" },
      { topic: "尊重與關懷他人", indicator: "團隊活動中相互合作並朝共同目標邁進", result: "良", evidence: "長距離跨系統轉乘需分組合作、清點與設備互助，建議成果加入小組分工與同儕回饋紀錄。" }
    ]
  },
  sanxia: {
    before: ["認識三峽老街、金牛角、藍染與輕便鐵道歷史。", "討論產業如何依靠運輸系統向外連結。"],
    during: ["進行金牛角 DIY、祖師廟走讀與藍染體驗。", "觀察三峽與鶯歌之間的交通與產業關係。"],
    after: ["整理地方產業故事。", "比較傳統運輸與今日交通方式。"],
    outcomes: ["三峽產業走讀紀錄", "藍染或手作作品", "運輸史學習單"],
    checklistSummary: "能以三峽老街產業與輕便鐵道歷史為脈絡，完成文化走讀、手作體驗與運輸史理解。",
    checklistResults: [
      { topic: "有意義的學習", indicator: "認識且記錄臺灣各地人文環境特色", result: "優", evidence: "走讀三峽老街、祖師廟、藍染與金牛角產業場域。" },
      { topic: "有意義的學習", indicator: "提出對觀察事物的發現與學習收穫", result: "優", evidence: "透過產業手作與輕便鐵道故事連結地方物流與文化。" },
      { topic: "友善環境", indicator: "從活動過程認識地方優勢並產生地方認同", result: "良", evidence: "能理解三峽產業特色，建議補上學生對在地文化保存的反思。" },
      { topic: "尊重與關懷他人", indicator: "傾聽同儕觀察與想法並正向回饋", result: "良", evidence: "可於藍染與老街走讀後加入作品分享與同儕回饋。" }
    ]
  },
  marine: {
    before: ["建立海科館、鯊魚與海岸林先備知識。", "練習用五官進行自然觀察。"],
    during: ["走讀容軒步道，觀察海岸林植物。", "參觀海洋劇場與兒童廳，完成海藻鑰匙圈實作。"],
    after: ["畫下印象最深刻的海洋畫面。", "分享基隆海洋資源與友善環境行動。"],
    outcomes: ["海洋觀察圖文紀錄", "海藻鑰匙圈作品", "友善海洋分享"],
    checklistSummary: "能透過海科館與步道體驗，運用五官感知海洋與海岸林環境，並形成友善環境態度。",
    checklistResults: [
      { topic: "有意義的學習", indicator: "認識學校附近及社區的自然環境", result: "優", evidence: "容軒步道與海科館展場能連結基隆海洋與海岸林特色。" },
      { topic: "健康的身心", indicator: "透過五官感知環境並安全完成戶外學習活動", result: "優", evidence: "課程明確安排步道觀察、展廳探索、定點喝水與安全提醒。" },
      { topic: "有意義的學習", indicator: "實際觀測後產生珍愛環境的情感態度", result: "良", evidence: "透過海洋劇場與 DIY 作品收斂經驗，建議加入學生口述或圖文反思。" },
      { topic: "尊重與關懷他人", indicator: "遵守保護環境規範並不破壞環境", result: "良", evidence: "可在成果中補充垃圾帶走、展館禮儀與海洋友善行動紀錄。" }
    ]
  }
};

let selectedRoute = routes[0].id;
let routeLayers = new Map();
const GEMINI_GEM_URL = "https://gemini.google.com/gem/1iUpTQAtI5qmsaB3sjeQpnixcilM1IgFQ?usp=sharing";

function routeById(id) {
  return routes.find((route) => route.id === id) || routes[0];
}

function initRouteButtons() {
  const routeButtons = document.querySelector("#route-buttons");
  const routeTabs = document.querySelector("#route-tabs");

  routeButtons.innerHTML = routes
    .map(
      (route) => `
        <button type="button" data-route="${route.id}">
          <strong>${route.title}</strong>
          <span>${route.theme}</span>
        </button>
      `
    )
    .join("");

  routeTabs.innerHTML = routes
    .map(
      (route) => `
        <button type="button" role="tab" id="tab-${route.id}" aria-controls="panel-${route.id}" data-route="${route.id}">
          ${route.title}
        </button>
      `
    )
    .join("");

  routeButtons.querySelectorAll("[data-route]").forEach((button) => {
    button.addEventListener("click", () => selectRoute(button.dataset.route, true, false));
  });

  routeTabs.querySelectorAll("[data-route]").forEach((button) => {
    button.addEventListener("click", () => selectRoute(button.dataset.route, false, false));
  });
}

function renderRoutePanel(route) {
  const panel = document.querySelector("#route-panel");
  const template = routeTemplates[route.id];
  panel.id = "route-panel";
  panel.setAttribute("role", "tabpanel");
  panel.setAttribute("aria-labelledby", `tab-${route.id}`);
  panel.innerHTML = `
    <div class="route-template">
      <div class="route-template-hero">
        <div>
          <p class="eyebrow">${route.theme}</p>
          <h3>${route.title}</h3>
          <p>${route.summary}</p>
          <div class="meta">
            <span>${route.grade}</span>
            <span>${route.stops.length} 個學習站點</span>
            <span>成果文件連結</span>
          </div>
        </div>
        <img src="${route.image}" alt="${route.title}成果照片" />
      </div>

      <section class="template-block">
        <h4>路線流程</h4>
        <div class="stop-flow">
          ${route.stops.map((stop, index) => `<span>${index + 1}. ${stop}</span>`).join("")}
        </div>
      </section>

      <section class="template-grid" aria-label="課程三階段">
        <article>
          <h4>出發前</h4>
          <ul>${template.before.map((item) => `<li>${item}</li>`).join("")}</ul>
        </article>
        <article>
          <h4>行程中</h4>
          <ul>${template.during.map((item) => `<li>${item}</li>`).join("")}</ul>
        </article>
        <article>
          <h4>回到校園</h4>
          <ul>${template.after.map((item) => `<li>${item}</li>`).join("")}</ul>
        </article>
      </section>

      <section class="template-grid two-col" aria-label="學習任務與成果呈現">
        <article>
          <h4>學習任務</h4>
          <ul>${route.tasks.map((task) => `<li>${task}</li>`).join("")}</ul>
        </article>
        <article>
          <h4>成果呈現</h4>
          <ul>${template.outcomes.map((item) => `<li>${item}</li>`).join("")}</ul>
        </article>
      </section>

      <section class="checklist-review" aria-label="國小階段戶外及海洋教育學習主題輔導指標檢核表檢視結果">
        <div class="checklist-heading">
          <div>
            <p class="eyebrow">Checklist Review</p>
            <h4>國小階段戶外及海洋教育學習主題輔導指標檢視結果</h4>
          </div>
          <p>${template.checklistSummary}</p>
        </div>
        <div class="checklist-grid">
          ${template.checklistResults
            .map(
              (item) => `
                <article class="checklist-card">
                  <div>
                    <span class="check-topic">${item.topic}</span>
                    <strong>${item.indicator}</strong>
                  </div>
                  <span class="check-score ${item.result === "優" ? "best" : "good"}">${item.result}</span>
                  <p>${item.evidence}</p>
                </article>
              `
            )
            .join("")}
        </div>
      </section>

      <a class="document-link" href="${route.document}" target="_blank" rel="noopener">開啟成果文件 PDF</a>
    </div>
  `;
}

function updateActiveStates() {
  document.querySelectorAll("[data-route]").forEach((button) => {
    const active = button.dataset.route === selectedRoute;
    button.classList.toggle("active", active);
    if (button.getAttribute("role") === "tab") {
      button.setAttribute("aria-selected", active ? "true" : "false");
      button.setAttribute("tabindex", active ? "0" : "-1");
    }
  });
}

function selectRoute(id, scrollToRoutes = false, focusMap = false) {
  selectedRoute = id;
  const route = routeById(id);
  renderRoutePanel(route);
  updateActiveStates();
  updateMapHighlight(id);

  if (scrollToRoutes) {
    document.querySelector("#routes").scrollIntoView({ behavior: "smooth", block: "start" });
  }

  if (focusMap) {
    document.querySelector(`[data-map-route="${id}"]`)?.scrollIntoView({ block: "nearest", inline: "nearest" });
  }
}

function projectPoint(coord, bounds) {
  const [lat, lng] = coord;
  const width = 1000;
  const height = 620;
  const pad = 72;
  const x = pad + ((lng - bounds.minLng) / (bounds.maxLng - bounds.minLng)) * (width - pad * 2);
  const y = pad + ((bounds.maxLat - lat) / (bounds.maxLat - bounds.minLat)) * (height - pad * 2);
  return [Number(x.toFixed(1)), Number(y.toFixed(1))];
}

function initMap() {
  const mapEl = document.querySelector("#route-map");
  mapEl.innerHTML = `
    <figure class="route-map-figure">
      <img src="北台灣鐵道大探索.png" alt="北台灣鐵道大探索戶外教育地圖" />
    </figure>
  `;
}

function updateMapHighlight(id) {
  document.querySelectorAll("[data-map-route]").forEach((item) => {
    item.classList.toggle("is-active", item.dataset.mapRoute === id);
  });
}

function buildGemPrompt() {
  const grade = document.querySelector("#planner-grade")?.value || "";
  const topic = document.querySelector("#planner-topic")?.value || "";
  const sites = document.querySelector("#planner-sites")?.value || "";
  const budget = document.querySelector("#planner-budget")?.value || "";
  const risk = document.querySelector("#planner-risk")?.value || "";

  return `請協助我規劃一份國小戶外教育課程設計草案。

基本條件：
- 年級與人數：${grade}
- 路線主題：${topic}
- 主要場域：${sites}
- 經費重點：${budget}
- 風險重點：${risk}

請依下列格式輸出：
1. 課程理念與學習目標
2. 路線設計規劃：出發前、行程中、回到校園三階段
3. 行程時間表與站點學習任務
4. 經費規劃表：項目、估算方式、單價、數量、總價、備註
5. 國小階段戶外及海洋教育學習主題輔導指標檢核：學習主題、對應指標、檢核表現、佐證資料
6. 風險規劃：風險辨識、風險調控、事故處置、復原回饋
7. 學生學習單與成果產出建議

請以國小教師可直接修改使用的語氣撰寫，並以表格和條列為主。`;
}

function initGemPlanner() {
  const fields = document.querySelectorAll("#planner-grade, #planner-topic, #planner-sites, #planner-budget, #planner-risk");
  const promptBox = document.querySelector("#gem-prompt");
  const copyButton = document.querySelector("#copy-gem-prompt");
  const copyStatus = document.querySelector("#copy-status");
  const gemLink = document.querySelector("#open-gem-link");

  if (!promptBox) return;

  const updatePrompt = () => {
    promptBox.value = buildGemPrompt();
  };

  fields.forEach((field) => field.addEventListener("input", updatePrompt));
  updatePrompt();

  if (GEMINI_GEM_URL && gemLink) {
    gemLink.href = GEMINI_GEM_URL;
    gemLink.textContent = "開啟 Gemini Gem";
    gemLink.removeAttribute("aria-disabled");
    gemLink.classList.add("is-ready");
  }

  copyButton?.addEventListener("click", async () => {
    promptBox.select();
    try {
      await navigator.clipboard.writeText(promptBox.value);
      copyStatus.textContent = "已複製，可貼到 Gemini Gem。";
    } catch {
      document.execCommand("copy");
      copyStatus.textContent = "已選取提示詞，可使用 Ctrl+C 複製。";
    }
  });
}

function lessonValue(id) {
  return document.querySelector(`#${id}`)?.value.trim() || "";
}

function lessonLines(id) {
  return lessonValue(id)
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
}

function lessonNumber(id, fallback) {
  const value = Number(lessonValue(id));
  return Number.isFinite(value) ? value : fallback;
}

function lessonChecklistResults() {
  return [1, 2, 3]
    .map((index) => ({
      topic: lessonValue(`check-topic-${index}`),
      indicator: lessonValue(`check-indicator-${index}`),
      result: lessonValue(`check-result-${index}`) || "良",
      evidence: lessonValue(`check-evidence-${index}`),
    }))
    .filter((item) => item.topic || item.indicator || item.evidence);
}

function normalizedRouteId() {
  const rawId = lessonValue("new-route-id") || lessonValue("new-route-title") || "new-route";
  return rawId
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-_]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "") || "new-route";
}

function buildRouteDataSnippet() {
  const routeData = {
    id: normalizedRouteId(),
    title: lessonValue("new-route-title") || "新路線名稱",
    theme: lessonValue("new-route-theme") || "家鄉走讀與場域探究",
    grade: lessonValue("new-route-grade") || "中高年級",
    image: lessonValue("new-route-image") || "成果照片/照片檔名.jpg",
    document: lessonValue("new-route-document") || "路線資料/教案檔名.pdf",
    color: "#2f6f73",
    summary: lessonValue("new-route-summary") || "請填入路線摘要。",
    stops: lessonLines("new-route-stops"),
    tasks: lessonLines("new-route-tasks"),
    coords: [[lessonNumber("new-route-lat", 25.094), lessonNumber("new-route-lng", 121.713)]],
  };

  return `${JSON.stringify(routeData, null, 2)},`;
}

function buildTemplateDataSnippet() {
  const templateData = {
    before: lessonLines("new-route-before"),
    during: lessonLines("new-route-during"),
    after: lessonLines("new-route-after"),
    outcomes: lessonLines("new-route-outcomes"),
    checklistSummary: lessonValue("new-route-checklist-summary") || "請填入指標檢核摘要。",
    checklistResults: lessonChecklistResults(),
  };

  return `${JSON.stringify(normalizedRouteId())}: ${JSON.stringify(templateData, null, 2)},`;
}

function updateLessonCode() {
  const routeOutput = document.querySelector("#route-code-output");
  const templateOutput = document.querySelector("#template-code-output");
  if (!routeOutput || !templateOutput) return;

  routeOutput.value = buildRouteDataSnippet();
  templateOutput.value = buildTemplateDataSnippet();
}

function setText(selector, value) {
  const target = document.querySelector(selector);
  if (target) target.textContent = value;
}

function updateLessonPreview() {
  const stops = lessonLines("new-route-stops");
  const tasks = lessonLines("new-route-tasks");
  const checks = lessonChecklistResults();
  const stopList = stops.length ? stops : ["長興國小", "地方場域", "回到校園"];

  setText("#lesson-preview-title", lessonValue("new-route-title") || "新路線名稱");
  setText("#lesson-preview-summary", lessonValue("new-route-summary") || "請填入路線摘要。");
  setText("#lesson-preview-theme", lessonValue("new-route-theme") || "家鄉走讀與場域探究");
  setText("#lesson-preview-grade", lessonValue("new-route-grade") || "中高年級");
  setText("#lesson-preview-stop-count", String(stopList.length));
  setText("#lesson-preview-task-count", String(tasks.length));
  setText("#lesson-preview-check-count", String(checks.length));

  const stopContainer = document.querySelector("#lesson-preview-stops");
  if (stopContainer) {
    stopContainer.innerHTML = "";
    stopList.forEach((stop, index) => {
      const chip = document.createElement("span");
      chip.textContent = `${index + 1}. ${stop}`;
      stopContainer.appendChild(chip);
    });
  }
}

function setBuilderStep(step) {
  const builder = document.querySelector("#lesson-builder");
  if (!builder) return;

  builder.querySelectorAll("[data-builder-step]").forEach((button) => {
    const active = button.dataset.builderStep === step;
    button.classList.toggle("active", active);
    button.setAttribute("aria-selected", active ? "true" : "false");
  });

  builder.querySelectorAll("[data-builder-panel]").forEach((panel) => {
    panel.classList.toggle("active", panel.dataset.builderPanel === step);
  });

  builder.querySelector(`[data-builder-panel="${step}"]`)?.scrollIntoView({ behavior: "smooth", block: "nearest" });
}

async function copyLessonCode(sourceSelector, label) {
  const source = document.querySelector(sourceSelector);
  const status = document.querySelector("#lesson-copy-status");
  if (!source) return;

  source.select();
  try {
    await navigator.clipboard.writeText(source.value);
    if (status) status.textContent = `${label}已複製，可以貼到 script.js。`;
  } catch {
    document.execCommand("copy");
    if (status) status.textContent = `${label}已選取，若未自動複製可按 Ctrl+C。`;
  }
}

function initLessonBuilder() {
  const builder = document.querySelector("#lesson-builder");
  if (!builder) return;

  builder.querySelectorAll("input, textarea, select").forEach((field) => {
    const updateBuilder = () => {
      updateLessonCode();
      updateLessonPreview();
    };
    field.addEventListener("input", updateBuilder);
    field.addEventListener("change", updateBuilder);
  });

  builder.querySelectorAll("[data-builder-step]").forEach((button) => {
    button.addEventListener("click", () => setBuilderStep(button.dataset.builderStep));
  });
  builder.querySelectorAll("[data-step-next]").forEach((button) => {
    button.addEventListener("click", () => setBuilderStep(button.dataset.stepNext));
  });

  document.querySelector("#generate-lesson-code")?.addEventListener("click", updateLessonCode);
  document.querySelector("#copy-route-code")?.addEventListener("click", () => copyLessonCode("#route-code-output", "routes 陣列片段"));
  document.querySelector("#copy-template-code")?.addEventListener("click", () =>
    copyLessonCode("#template-code-output", "routeTemplates 物件片段")
  );

  updateLessonCode();
  updateLessonPreview();
  setBuilderStep("basics");
}

document.addEventListener("DOMContentLoaded", () => {
  initRouteButtons();
  initMap();
  initGemPlanner();
  initLessonBuilder();
  selectRoute(selectedRoute, false, false);
});
