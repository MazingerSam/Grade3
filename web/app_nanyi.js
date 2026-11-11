/* =========================================================
   木新思達 國小數學 (南一版 1上~6上) 互動教具與課程引擎 (app_nanyi.js)
   依據 D:\國小南一\2.數學 115備課資源（課前診斷、單元學習單、八格活動單、Follow Me學素養）
   遵循 making_math_interaction 技能：仿三年級標準卡片架構、CPA 具體-圖像-抽象原則、
   無 inline display:none、全套 5 卷測驗連動與 URL 參數直達
   ========================================================= */

let activePublisher = localStorage.getItem('kx_active_publisher') || 'nanyi'; // 'kangxuan' | 'nanyi'
if (typeof window !== 'undefined') window.activePublisher = activePublisher;

// 南一版專屬教具互動狀態機
const nyState = {
  // 2上 U10：平面圖形（周界、內部、外部、神射手靶心、幾何圖形拼貼）
  g2u10: {
    mode: 'target', // 'target' (神射手) | 'garden' (祕密花園周界) | 'shapes' (三角形/正方形/長方形)
    shots10: 4,
    shots6: 3,
    shots2: 5,
    shots0: 6,
    gardenSides: [11, 8, 12, 9],
    shapeType: 'square',
    story: '【Follow Me 神射手】棠棠參加固定靶射擊比賽，靶心 10 分區射中 4 發、6 分區 3 發、2 分區 5 發，靶外（外部）0 分有 6 發，觀察靶的周界、內部與外部！'
  },
  // 3上 U9：圓（修理盾牌、小人國設計家、圓心、半徑、直徑、圓規畫圓）
  g3u9: {
    radius: 3,
    showFold: true,
    compassOpen: 3,
    story: '【設計家＆修理盾牌】小噹來到小人國，以圓柱當「圓心」，把圓規張開「半徑 3 公分」畫出圓形遊樂場，直徑剛好是 6 公分！'
  },
  // 4上 U7：數量關係（圖形規律、百數表拼圖、奇偶數乘法、火車座位與桌椅規律）
  g4u7: {
    mode: 'hundred', // 'hundred' (百數表骰子展開圖) | 'pattern' (圖形與數列規律) | 'tables' (方桌併攏規律)
    baseNum: 55,
    tablesCount: 4,
    seqStart: 18,
    seqStep: 7,
    story: '【好玩的數學】湯基郎和內紫蔻拿百數表剪成骰子展開圖！觀察百數表中「左右相鄰差 1、上下相鄰差 10」以及「奇數 × 奇數 ＝ 奇數」的規律！'
  },
  // 5上 U1：折線圖（南北溫差大雙折線圖、5月31日氣溫變化、波浪省略記號）
  g5u1: {
    mode: 'dual', // 'dual' (南北溫差雙折線圖) | 'single' (5月31日氣溫折線圖)
    useWave: true,
    selectedHour: 10,
    southTemps: [18, 21, 21, 24, 28, 29, 30, 26, 24, 23], // 8時~17時
    northTemps: [15, 16, 17, 21, 26, 29, 28, 25, 21, 17],
    story: '【南北溫差大】觀察南部與北部 8 時到 17 時的平均氣溫雙折線圖！點選時刻比較兩地溫差，看看幾時兩地氣溫一樣高！'
  },
  // 5上 U9：時間的乘除（幸福動物園運動大會、時間複名數乘除、60進位與24進位）
  g5u9: {
    op: 'mul', // 'mul' | 'div_unit' | 'div_ratio'
    min1: 1,
    sec1: 36,
    factor: 2,
    totalMin: 3,
    totalSec: 15,
    divCount: 5,
    story: '【幸福動物園運動大會】猴子阿宏爬樹花了 1 分鐘 36 秒鐘，阿銘花的時間是阿宏的 2 倍，滿 60 秒進 1 分鐘，阿銘共花了 3 分鐘 12 秒鐘！'
  },
  // 5上 U10：正方體和長方體（濃情巧克力防震壓條、透視圖、展開圖、表面積）
  g5u10: {
    shape: 'cuboid', // 'cube' | 'cuboid'
    len: 12,
    wid: 10,
    hei: 9,
    showNet: false,
    story: '【濃情巧克力工廠】安安在巧克力工廠看到長 12cm、寬 10cm、高 9cm 的乙容器，加裝 12 條邊防震壓條，並計算 6 個面的包裝紙表面積！'
  }
};

/* =========================================================
   南一版 1上~6上 完整課綱結構與康軒共享單元映射表
   type: 'shared' -> 調用現有高互動 CPA 教具並替換為南一版生活情境橫幅
   type: 'custom' -> 渲染南一版專屬獨立單元セクション
   ========================================================= */
const NANYI_CURRICULUM = {
  '1上': [
    { u: 1, icon: '🦁', name: '數到10', desc: '動物嘉年華・點子卡・1~10與0', type: 'shared', refSec: 'g1_unit1', renderFn: 'renderG1U1', bannerSub: '結合南一版「動物嘉年華、Follow Me學素養」，透過五五點子卡與積木認識 1～10 與 0！' },
    { u: 2, icon: '📏', name: '比長短', desc: '比一比・齊頭對齊・直線與彎線', type: 'shared', refSec: 'g1_unit2', renderFn: 'renderG1U2', bannerSub: '結合南一版「比一比學習單」，掌握端點對齊基準線、直接比較與方格測量！' },
    { u: 3, icon: '🎪', name: '分與合', desc: '馬戲團・10的分合・合十好朋友', type: 'shared', refSec: 'g1_unit4', renderFn: 'renderG1U4', bannerSub: '結合南一版「馬戲團學習單」，操作蘋果樹分與合與 10 的組成分解！' },
    { u: 4, icon: '🙏', name: '順序和多少', desc: '我是如來佛・第幾個與幾個・比多少', type: 'shared', refSec: 'g1_unit3', renderFn: 'renderG1U3', bannerSub: '結合南一版「我是如來佛學習單」，分清排隊序數（第幾個）與基數（幾個）並連線比多少！' },
    { u: 5, icon: '🏕️', name: '數到30', desc: '一起去踏青・十個一數・位值硬幣', type: 'shared', refSec: 'g1_unit6', renderFn: 'renderG1U6', bannerSub: '結合南一版「一起去踏青學習單」，用十個一捆與 10 元硬幣認識 30 以內的數！' },
    { u: 6, icon: '🗺️', name: '加一加', desc: '藏寶圖・合併與添加・加法算式', type: 'shared', refSec: 'g1_unit7', renderFn: 'renderG1U7', bannerSub: '結合南一版「藏寶圖學習單」，體驗生活合併與添加情境、熟練 10 以內加法心算！' },
    { u: 7, icon: '🎨', name: '認識形狀', desc: '小小設計師・立體與平面簡單形狀', type: 'shared', refSec: 'g1_unit5', renderFn: 'renderG1U5', bannerSub: '結合南一版「小小設計師學習單」，操作方盒、圓罐、球與簡單平面圖形分類！' },
    { u: 8, icon: '🦸', name: '減一減與加減應用', desc: '英雄救美・拿走與比較・相差多少', type: 'shared', refSec: 'g1_unit8', renderFn: 'renderG1U8', bannerSub: '結合南一版「英雄救美學習單」，動態操作氣球拿走與比較多少的減法應用！' },
    { u: 9, icon: '⏰', name: '讀鐘錶', desc: '時鐘滴答滴答・整點與半點報時', type: 'shared', refSec: 'g1_unit9', renderFn: 'renderG1U9', bannerSub: '結合南一版「時鐘滴答滴答學習單」，撥動長針與短針精準判讀整點與半點！' }
  ],
  '2上': [
    { u: 1, icon: '🤖', name: '數到300', desc: '玩具天地・3個百・百十個位值表', type: 'shared', refSec: 'g2_unit1', renderFn: 'renderG2U1', bannerSub: '結合南一版「玩具天地學習單」，擴充百位、十位、個位位值板與鈔票換算至 300！' },
    { u: 2, icon: '🧮', name: '二位數的加減', desc: '請你幫幫忙・直式進位與借位退位', type: 'shared', refSec: 'g2_unit2', renderFn: 'renderG2U2', bannerSub: '結合南一版「請你幫幫忙學習單」，視覺化二位數直式滿十進一與退十借位！' },
    { u: 3, icon: '📐', name: '幾公分', desc: '愛麗絲的仙境・公分尺實測與斷尺', type: 'shared', refSec: 'g2_unit3', renderFn: 'renderG2U3', bannerSub: '結合南一版「愛麗絲的仙境學習單」，操作公分(cm)刻度尺量物體與斷尺相減！' },
    { u: 4, icon: '🔄', name: '加減的關係與應用', desc: '精打細算・加減互逆與驗算線段圖', type: 'shared', refSec: 'g2_unit4', renderFn: 'renderG2U4', bannerSub: '結合南一版「精打細算學習單」，透過部分-整體線段圖掌握加減互逆與求未知數！' },
    { u: 5, icon: '🥤', name: '容 量', desc: '斤斤計較・量杯倒水直觀與間接比較', type: 'shared', refSec: 'g2_unit10', renderFn: 'renderG2U10', bannerSub: '結合南一版「斤斤計較學習單」，操作透明水杯倒水比較水位高低與容量守恆！' },
    { u: 6, icon: '🥪', name: '兩步驟的加減', desc: '買早餐・先算什麼再算什麼', type: 'shared', refSec: 'g2_unit6', renderFn: 'renderG2U6', bannerSub: '結合南一版「買早餐學習單」，拆解兩步驟加減問題，清楚掌握先算與後算！' },
    { u: 7, icon: '🥂', name: '2、5、4、8的乘法', desc: '喝喜酒囉・連加簡記與倍數跳躍', type: 'shared', refSec: 'g2_unit7', renderFn: 'renderG2U7', bannerSub: '結合南一版「喝喜酒囉學習單」，從連加走入 2、5、4、8 的乘法矩陣與數線！' },
    { u: 8, icon: '🕰️', name: '幾時幾分', desc: '快樂星期六・鐘面5分一數與經過時間', type: 'shared', refSec: 'g2_unit8', renderFn: 'renderG2U8', bannerSub: '結合南一版「快樂星期六學習單」，觀察鐘面大格 5 分、小格 1 分精準報時！' },
    { u: 9, icon: '🏃', name: '3、6、7、9的乘法', desc: '運動會・九九乘法與矩陣交換律', type: 'shared', refSec: 'g2_unit9', renderFn: 'renderG2U9', bannerSub: '結合南一版「運動會學習單」，探索 3、6、7、9 的乘法口訣與陣列旋轉交換律！' },
    { u: 10, icon: '🎯', name: '平面圖形', desc: '祕密花園＆神射手・周界內外部・幾何邊角', type: 'custom', secId: 'ny_g2_unit10', renderFn: 'renderNyG2U10' }
  ],
  '3上': [
    { u: 1, icon: '🍱', name: '數到10000', desc: '38℃簡餐店・千百十個積木與錢幣', type: 'shared', refSec: 'unit1', renderFn: 'renderU1Board', bannerSub: '結合南一版「38℃簡餐店學習單」，拖拉千格積木與千元鈔票認識一萬以內的數！' },
    { u: 2, icon: '💻', name: '四位數的加減', desc: '烏魯木電腦展・四位數直式進退位', type: 'shared', refSec: 'unit2', renderFn: 'renderU2Vertical', bannerSub: '結合南一版「烏魯木電腦展學習單」，操作四位數直式連續進位與跨零借位！' },
    { u: 3, icon: '✏️', name: '乘 法', desc: '莉莉文具店・二三位數乘以一位數', type: 'shared', refSec: 'unit4', renderFn: 'renderU4Multiplication', bannerSub: '結合南一版「莉莉文具店學習單」，從位值陣列理解直式乘法與連乘兩步驟應用！' },
    { u: 4, icon: '📏', name: '幾毫米', desc: '考考你・1公分=10毫米實測與換算', type: 'shared', refSec: 'unit3', renderFn: 'renderU3RulerCanvas', bannerSub: '結合南一版「考考你學習單」，拖拉毫米直尺實測長度並進行公分與毫米化聚加減！' },
    { u: 5, icon: '📐', name: '角、正方形和長方形', desc: '大競賽・直角三角板比角與四邊形性質', type: 'shared', refSec: 'unit5', renderFn: 'updateFanVisual', bannerSub: '結合南一版「大競賽學習單」，操作扇子張角、三角板直角檢測與正方形長方形繪製！' },
    { u: 6, icon: '🎂', name: '除 法', desc: '爺爺的生日・平分分裝與直式有餘數除法', type: 'shared', refSec: 'unit7', renderFn: 'updateU7Visual', bannerSub: '結合南一版「爺爺的生日學習單」，動手分裝禮物並演練除法直式商與餘數關係！' },
    { u: 7, icon: '🥛', name: '公升和毫升', desc: '小威生病了・1公升=1000毫升量杯', type: 'shared', refSec: 'unit8', renderFn: 'renderU8Beaker', bannerSub: '結合南一版「小威生病了學習單」，注水觀察公升與毫升量杯刻度及複名數加減！' },
    { u: 8, icon: '🎁', name: '分 數', desc: '禮物・連續量與離散量平分・同分母比大小', type: 'shared', refSec: 'unit9', renderFn: 'renderU9Pie', bannerSub: '結合南一版「禮物學習單」，切分披薩與離散果凍認識幾分之幾並比較分數大小！' },
    { u: 9, icon: '🛡️', name: '圓', desc: '設計家＆修理盾牌・圓心半徑直徑・圓規畫圓', type: 'custom', secId: 'ny_g3_unit9', renderFn: 'renderNyG3U9' }
  ],
  '4上': [
    { u: 1, icon: '🚗', name: '一億以內的數', desc: '歡喜買車去・萬家族與億位定位板', type: 'shared', refSec: 'g4_unit1', initUnit: 1, bannerSub: '結合南一版「歡喜買車去學習單」，操作一億以內大數四位一節定位板與加減！' },
    { u: 2, icon: '👟', name: '乘 法', desc: '鞋店週年慶・多位数乘以二三位數直式', type: 'shared', refSec: 'g4_unit2', initUnit: 2, bannerSub: '結合南一版「鞋店週年慶學習單」，拆解直式乘法位值對齊與末位 0 簡便算法！' },
    { u: 3, icon: '🧭', name: '角 度', desc: '闖關遊戲・量角器實測與旋轉角和差', type: 'shared', refSec: 'g4_unit3', initUnit: 3, bannerSub: '結合南一版「闖關遊戲學習單」，旋轉透明量角器測量角度、認識銳角鈍角平角周角！' },
    { u: 4, icon: '🏊', name: '除 法', desc: '親水公園快樂遊記・除以二位數試商法', type: 'shared', refSec: 'g4_unit4', initUnit: 4, bannerSub: '結合南一版「親水公園快樂遊記學習單」，演練四位數除以二位數估商調商與驗算！' },
    { u: 5, icon: '🔺', name: '三角形', desc: '運動會・等腰正三角形分類與全等對應', type: 'shared', refSec: 'g4_unit6', initUnit: 6, bannerSub: '結合南一版「運動會學習單」，拖拉三角形頂點探索正三角形、等腰三角形與直角三角形！' },
    { u: 6, icon: '🍕', name: '分 數', desc: '大胃王選拔・假分數帶分數互換與加減', type: 'shared', refSec: 'g4_unit9', initUnit: 9, bannerSub: '結合南一版「大胃王選拔學習單」，透過圓餅圖操作假分數與帶分數化聚及借位減法！' },
    { u: 7, icon: '🎲', name: '數量關係', desc: '好玩的數學・圖形規律・百數表・奇偶數', type: 'custom', secId: 'ny_g4_unit7', renderFn: 'renderNyG4U7' },
    { u: 8, icon: '🏰', name: '整數四則', desc: '迷宮大考驗・括號先算與先乘除後加減', type: 'shared', refSec: 'g4_unit8', initUnit: 8, bannerSub: '結合南一版「迷宮大考驗學習單」，用計算樹階梯圖掌握兩步驟併式與四則混合順序！' },
    { u: 9, icon: '🥬', name: '小 數', desc: '買菜趣・二位小數百格板與小數點對齊', type: 'shared', refSec: 'g4_unit7', initUnit: 7, bannerSub: '結合南一版「買菜趣學習單」，操作 100 格二位小數塗色板與小數直式加減！' },
    { u: 10, icon: '🚆', name: '長 度', desc: '交通便利網・1公里=1000公尺化聚與計算', type: 'shared', refSec: 'g4_unit5', initUnit: 5, bannerSub: '結合南一版「交通便利網學習單」，透過跑道圈數換算公里與公尺並進行複名數加減乘除！' }
  ],
  '5上': [
    { u: 1, icon: '📈', name: '折線圖', desc: '南北溫差大・雙折線圖判讀與波浪省略線', type: 'custom', secId: 'ny_g5_unit1', renderFn: 'renderNyG5U1' },
    { u: 2, icon: '🌈', name: '因數和倍數', desc: '拼拼剪剪・因數彩虹・公因數與公倍數', type: 'shared', refSec: 'g5_unit2', initUnit: 2, bannerSub: '結合南一版「拼拼剪剪學習單」，用長方形排列找因數彩虹、判別 2/3/5/10 倍數與公因數公倍數！' },
    { u: 3, icon: '🦁', name: '多邊形', desc: '可愛動物園・三角形三邊關係與多邊形內角和', type: 'shared', refSec: 'g5_unit5', initUnit: 5, bannerSub: '結合南一版「可愛動物園學習單」，探索三角形任意兩邊和大於第三邊、內角和 180° 與多邊形內角和！' },
    { u: 4, icon: '🥟', name: '擴分、約分和通分', desc: '好吃的水餃・等值分數切分與通分比大小', type: 'shared', refSec: 'g5_unit4', initUnit: 4, bannerSub: '結合南一版「好吃的水餃學習單」，動態切分等值分數模型，掌握擴分、約分與通分比大小！' },
    { u: 5, icon: '🪞', name: '線對稱圖形', desc: '相同的另一半・對稱軸鏡射與對稱點邊角', type: 'shared', refSec: 'g5_unit7', initUnit: 7, bannerSub: '結合南一版「相同的另一半學習單」，在互動方格畫布繪製線對稱圖形的另一半並檢驗對稱軸性質！' },
    { u: 6, icon: '🎂', name: '異分母分數的加減', desc: '生日快樂・通分母視覺化與帶分數加減', type: 'shared', refSec: 'g5_unit6', initUnit: 6, bannerSub: '結合南一版「生日快樂學習單」，將異分母分數通分為同分母分數進行加減與借位運算！' },
    { u: 7, icon: '🛒', name: '整數四則計算', desc: '大賣場・交換律結合律與乘法對加減分配律', type: 'shared', refSec: 'g5_unit8', initUnit: 8, bannerSub: '結合南一版「大賣場學習單」，透過面積模型直觀理解四則運算性質與分配律簡算巧算！' },
    { u: 8, icon: '🏰', name: '平行四邊形、三角形和梯形的面積', desc: '娃娃兵蓋城堡・剪拼割補推導面積公式', type: 'shared', refSec: 'g5_unit9', initUnit: 9, bannerSub: '結合南一版「娃娃兵蓋城堡學習單」，動態操作平行四邊形、三角形與梯形的等積割補拼合！' },
    { u: 9, icon: '⏱️', name: '時間的乘除', desc: '運動大會・日時分秒複名數乘除與倍數', type: 'custom', secId: 'ny_g5_unit9', renderFn: 'renderNyG5U9' },
    { u: 10, icon: '🍫', name: '正方體和長方體', desc: '濃情巧克力・邊角面關係・展開圖與表面積', type: 'custom', secId: 'ny_g5_unit10', renderFn: 'renderNyG5U10' }
  ],
  '6上': [
    { u: 1, icon: '🪜', name: '質因數分解和短除法', desc: '拼拼湊湊＆畢業旅行・短除法求GCD與LCM', type: 'shared', refSec: 'g6_unit1', initUnit: 1, bannerSub: '結合南一版「拼拼湊湊＆畢業旅行Follow Me」，用質因數分解樹與短除法求最大公因數與最小公倍數！' },
    { u: 2, icon: '🦒', name: '分數的除法', desc: '小小動物園・除以分數等於乘以倒數分裝圖解', type: 'shared', refSec: 'g6_unit2', initUnit: 2, bannerSub: '結合南一版「小小動物園學習單」，視覺化驗證同分母與異分母分數除法、顛倒相乘與商的大小關係！' },
    { u: 3, icon: '🍽️', name: '小數的除法', desc: '生日大餐・除數化整小數點右移與餘數對齊', type: 'shared', refSec: 'g6_unit4', initUnit: 4, bannerSub: '結合南一版「生日大餐學習單」，動態演示小數除法直式移位與「商的小數點對齊新位置、餘數對齊原位置」！' },
    { u: 4, icon: '🎡', name: '圓周長和圓面積', desc: '夢幻摩天輪・圓周率3.14・圓切拼長方形面積', type: 'shared', refSec: 'g6_unit7', initUnit: 7, bannerSub: '結合南一版「夢幻摩天輪學習單」，掌握圓周長＝直徑×3.14，並將圓切拼成近似長方形推導圓面積＝半徑×半徑×3.14！' },
    { u: 5, icon: '🐒', name: '比和比值', desc: '西遊記・相等的比・最簡整數比與比例應用', type: 'shared', refSec: 'g6_unit5', initUnit: 5, bannerSub: '結合南一版「西遊記學習單」，操作比與比值天平、化為最簡整數比並解決生活比例分配問題！' },
    { u: 6, icon: '🛸', name: '扇形的弧長和面積', desc: '外星人・幾分之幾圓弧長・扇形周長與面積', type: 'shared', refSec: 'g6_unit6', initUnit: 6, bannerSub: '結合南一版「外星人學習單」，調整圓心角計算幾分之幾圓的扇形弧長、周長（弧長+2半徑）與扇形面積！' },
    { u: 7, icon: '🚄', name: '速 率', desc: '探望奶奶・距離時間速率魔法三角與單位換算', type: 'shared', refSec: 'g6_unit8', initUnit: 8, bannerSub: '結合南一版「探望奶奶學習單」，透過競速模擬掌握時速、分速、秒速換算與平均速率計算！' },
    { u: 8, icon: '🧠', name: '數量關係', desc: '動動腦・植樹問題間隔規律・雞兔同籠與數列', type: 'shared', refSec: 'g6_unit3', initUnit: 3, bannerSub: '結合南一版「動動腦學習單」，動態操作路燈植樹兩端種/不種、正方形牙籤規律與數量關係推理！' }
  ]
};

// 儲存原始康軒單元選單 HTML 與原始單元 Banner 標題，以便在康軒與南一之間無損秒切
const origNavHTMLCache = {};
const origBannerCache = {};

function cacheOriginalDOM() {
  const navIds = ['unitNavG1', 'unitNavG2', 'unitNavG3', 'unitNavG4', 'unitNavG5', 'unitNavG6'];
  navIds.forEach(id => {
    const el = document.getElementById(id);
    if (el && !origNavHTMLCache[id]) {
      origNavHTMLCache[id] = el.innerHTML;
    }
  });
}

/* =========================================================
   出版社版本切換核心控制器 (康軒版 vs 南一版 vs 翰林版)
   ========================================================= */
function switchPublisher(pub) {
  if (pub !== 'kangxuan' && pub !== 'nanyi' && pub !== 'hanlin') pub = 'kangxuan';
  activePublisher = pub;
  if (typeof window !== 'undefined') window.activePublisher = pub;
  localStorage.setItem('kx_active_publisher', pub);
  cacheOriginalDOM();

  if (typeof playTone === 'function') playTone(587.33, 0.09);

  // 更新頂部版本切換按鈕樣式
  const btnKx = document.getElementById('pubBtnKangxuan');
  const btnNy = document.getElementById('pubBtnNanyi');
  const btnHl = document.getElementById('pubBtnHanlin');
  if (btnKx) {
    btnKx.classList.toggle('active', pub === 'kangxuan');
    btnKx.style.background = (pub === 'kangxuan') ? '#F59E0B' : 'rgba(255,255,255,0.15)';
    btnKx.style.color = (pub === 'kangxuan') ? '#78350F' : '#FFFFFF';
    btnKx.style.boxShadow = (pub === 'kangxuan') ? '0 3px 0 #B45309' : 'none';
  }
  if (btnNy) {
    btnNy.classList.toggle('active', pub === 'nanyi');
    btnNy.style.background = (pub === 'nanyi') ? '#10B981' : 'rgba(255,255,255,0.15)';
    btnNy.style.color = '#FFFFFF';
    btnNy.style.boxShadow = (pub === 'nanyi') ? '0 3px 0 #047857' : 'none';
  }
  if (btnHl) {
    btnHl.classList.toggle('active', pub === 'hanlin');
    btnHl.style.background = (pub === 'hanlin') ? '#EA580C' : 'rgba(255,255,255,0.15)';
    btnHl.style.color = '#FFFFFF';
    btnHl.style.boxShadow = (pub === 'hanlin') ? '0 3px 0 #9A3412' : 'none';
  }

  // 更新頂部測驗中心總卷數按鈕文字
  const topQuizBtn = document.getElementById('topQuizCenterBtn');
  if (topQuizBtn) {
    if (pub === 'nanyi') {
      topQuizBtn.innerHTML = '📝 南一測驗中心 (280份卷)';
    } else if (pub === 'hanlin') {
      topQuizBtn.innerHTML = '📝 翰林測驗中心 (280份卷)';
    } else {
      topQuizBtn.innerHTML = '📝 康軒測驗中心 (285份卷)';
    }
  }

  // 重建六個年級的單元導覽列
  rebuildAllUnitNavs(pub);

  // 重新套用當前所在的年級與第 1 單元
  const curGrade = localStorage.getItem('kx_active_grade') || '3上';
  if (typeof switchGrade === 'function') {
    switchGrade(curGrade);
  }
}

function rebuildAllUnitNavs(pub) {
  cacheOriginalDOM();
  const gradeMap = {
    '1上': 'unitNavG1',
    '2上': 'unitNavG2',
    '3上': 'unitNavG3',
    '4上': 'unitNavG4',
    '5上': 'unitNavG5',
    '6上': 'unitNavG6'
  };

  if (pub === 'kangxuan') {
    // 還原康軒原始單元選單與單元 Banner
    Object.keys(gradeMap).forEach(g => {
      const navId = gradeMap[g];
      const navEl = document.getElementById(navId);
      if (navEl && origNavHTMLCache[navId]) {
        navEl.innerHTML = origNavHTMLCache[navId];
      }
    });
    restoreAllOriginalBanners();
    return;
  }

  if (pub === 'hanlin' && typeof HANLIN_CURRICULUM !== 'undefined') {
    // 建立翰林版 1上~6上 單元導覽列
    Object.keys(HANLIN_CURRICULUM).forEach(grade => {
      const navId = gradeMap[grade];
      const navEl = document.getElementById(navId);
      if (!navEl) return;
      const units = HANLIN_CURRICULUM[grade];
      const totalPapers = units.length * 5;

      let html = units.map((item, idx) => `
        <button class="unit-tab ${idx === 0 ? 'active' : ''}" onclick="switchHlUnit('${grade}', ${item.uNum})" id="hl_${grade}_tab${item.uNum}">
          <span class="unit-num" style="background:#FFF7ED; color:#C2410C;">翰林 第 ${item.uNum} 單元</span>
          <span class="unit-icon">${item.icon || '📙'}</span>
          <span class="unit-name">${item.name}</span>
          <span class="unit-desc">${item.desc}</span>
        </button>
      `).join('');

      const quizTabNum = units.length + 1;
      html += `
        <button class="unit-tab" onclick="switchHlUnit('${grade}', ${quizTabNum})" id="hl_${grade}_tab${quizTabNum}" style="border-color:#EA580C; background:#FFF7ED;">
          <span class="unit-num" style="background:#EA580C; color:white;">翰林自動批改評量</span>
          <span class="unit-icon">📝</span>
          <span class="unit-name">線上測驗中心</span>
          <span class="unit-desc">翰林${grade} ${units.length}單元 × 5卷 ＝ ${totalPapers}份卷</span>
        </button>
      `;
      navEl.innerHTML = html;
    });
    return;
  }

  // 建立南一版 1上~6上 單元導覽列
  Object.keys(NANYI_CURRICULUM).forEach(grade => {
    const navId = gradeMap[grade];
    const navEl = document.getElementById(navId);
    if (!navEl) return;
    const units = NANYI_CURRICULUM[grade];
    const totalPapers = units.length * 5;

    let html = units.map((item, idx) => `
      <button class="unit-tab ${idx === 0 ? 'active' : ''}" onclick="switchNyUnit('${grade}', ${item.u})" id="ny_${grade}_tab${item.u}">
        <span class="unit-num" style="background:#ECFDF5; color:#047857;">南一 第 ${item.u} 單元</span>
        <span class="unit-icon">${item.icon}</span>
        <span class="unit-name">${item.name}</span>
        <span class="unit-desc">${item.desc}</span>
      </button>
    `).join('');

    // 加入線上測驗中心頁籤
    const quizTabNum = units.length + 1;
    html += `
      <button class="unit-tab" onclick="switchNyUnit('${grade}', ${quizTabNum})" id="ny_${grade}_tab${quizTabNum}" style="border-color:#10B981; background:#ECFDF5;">
        <span class="unit-num" style="background:#059669; color:white;">南一自動批改評量</span>
        <span class="unit-icon">📝</span>
        <span class="unit-name">線上測驗中心</span>
        <span class="unit-desc">南一${grade} ${units.length}單元 × 5卷 ＝ ${totalPapers}份卷</span>
      </button>
    `;
    navEl.innerHTML = html;
  });
}

function restoreAllOriginalBanners() {
  Object.keys(origBannerCache).forEach(secId => {
    const sec = document.getElementById(secId);
    if (!sec) return;
    const h2 = sec.querySelector('.unit-banner-info h2');
    const p = sec.querySelector('.unit-banner-info p');
    const btn = sec.querySelector('.submode-switcher .btn-Amber, .submode-switcher .quiz-cta');
    if (h2 && origBannerCache[secId].h2) h2.innerHTML = origBannerCache[secId].h2;
    if (p && origBannerCache[secId].p) p.innerHTML = origBannerCache[secId].p;
    if (btn && origBannerCache[secId].btnOnclick) btn.setAttribute('onclick', origBannerCache[secId].btnOnclick);
  });
}

function hideAllNyCustomSections() {
  const customIds = ['ny_g2_unit10', 'ny_g3_unit9', 'ny_g4_unit7', 'ny_g5_unit1', 'ny_g5_unit9', 'ny_g5_unit10'];
  customIds.forEach(id => {
    const sec = document.getElementById(id);
    if (sec) {
      sec.classList.remove('active');
      sec.style.display = 'none';
    }
  });
}

/* =========================================================
   南一版單元切換器 switchNyUnit(grade, unitNum)
   ========================================================= */
function switchNyUnit(grade, unitNum) {
  if (typeof playTone === 'function') playTone(440, 0.08);
  const units = NANYI_CURRICULUM[grade] || [];
  const quizTabNum = units.length + 1;

  // 更新選單 Tab active 狀態
  for (let i = 1; i <= quizTabNum; i++) {
    const tab = document.getElementById(`ny_${grade}_tab${i}`);
    if (tab) tab.classList.toggle('active', i === unitNum);
  }

  // 隱藏所有區段
  if (typeof hideAllGradeSections === 'function') hideAllGradeSections();
  hideAllNyCustomSections();
  if (typeof hideAllHlCustomSections === 'function') hideAllHlCustomSections();

  // 若點擊測驗中心
  if (unitNum === quizTabNum || unitNum >= 99) {
    const u10Sec = document.getElementById('unit10');
    if (u10Sec) {
      u10Sec.classList.add('active');
      u10Sec.style.display = 'block';
    }
    if (typeof setQuizGrade === 'function') setQuizGrade(grade, true);
    if (typeof renderQuizCenter === 'function') renderQuizCenter();
    return;
  }

  const item = units.find(x => x.u === unitNum) || units[0];
  if (!item) return;

  if (item.type === 'custom') {
    const sec = document.getElementById(item.secId);
    if (sec) {
      sec.classList.add('active');
      sec.style.display = 'block';
    }
    if (item.renderFn && typeof window[item.renderFn] === 'function') {
      window[item.renderFn]();
    }
  } else if (item.type === 'shared') {
    const sec = document.getElementById(item.refSec);
    if (sec) {
      // 快取原始康軒標題以便切回康軒時還原
      const h2 = sec.querySelector('.unit-banner-info h2');
      const p = sec.querySelector('.unit-banner-info p');
      const btn = sec.querySelector('.submode-switcher .btn-Amber, .submode-switcher .quiz-cta');
      if (!origBannerCache[item.refSec]) {
        origBannerCache[item.refSec] = {
          h2: h2 ? h2.innerHTML : '',
          p: p ? p.innerHTML : '',
          btnOnclick: btn ? btn.getAttribute('onclick') : ''
        };
      }
      // 動態套用南一版專屬單元名稱、圖示與教材情境描述
      if (h2) {
        h2.innerHTML = `${item.icon} 【南一版 ${grade}】第 ${item.u} 單元：${item.name}`;
      }
      if (p && item.bannerSub) {
        p.innerHTML = item.bannerSub;
      }
      if (btn) {
        btn.setAttribute('onclick', `openNyUnitQuiz('${grade}', ${item.u})`);
        btn.innerHTML = `📝 參加南一第${item.u}單元測驗 (5份卷)`;
      }

      sec.classList.add('active');
      sec.style.display = 'block';

      // 觸發對應教具渲染器
      if (item.initUnit && grade === '4上' && typeof initG4Unit === 'function') {
        initG4Unit(item.initUnit);
      } else if (item.initUnit && grade === '5上' && typeof initG5Unit === 'function') {
        initG5Unit(item.initUnit);
      } else if (item.initUnit && grade === '6上' && typeof initG6Unit === 'function') {
        initG6Unit(item.initUnit);
      } else if (item.renderFn && typeof window[item.renderFn] === 'function') {
        window[item.renderFn]();
      }
    }
  }

  const activeSecId = item.type === 'custom' ? item.secId : item.refSec;
  if (activeSecId && typeof renderUnitPracticeLab === 'function') {
    renderUnitPracticeLab(activeSecId, 'nanyi', grade, item.u);
  }

  if (typeof window.MathMLRenderer !== 'undefined' && typeof window.MathMLRenderer.renderElement === 'function') {
    const activeSec = document.querySelector('.unit-section.active');
    if (activeSec) window.MathMLRenderer.renderElement(activeSec);
  }
}

function openNyUnitQuiz(grade, unitNum) {
  const units = NANYI_CURRICULUM[grade] || [];
  const quizTabNum = units.length + 1;
  if (typeof setQuizGrade === 'function') setQuizGrade(grade, true);
  switchNyUnit(grade, quizTabNum);
  if (typeof selectQuizUnit === 'function') selectQuizUnit(unitNum);
}

/* =========================================================
   南一專屬互動教具 1：【2上 第10單元：平面圖形】
   結合「Follow Me 神射手（靶心周界、內部、外部計分）」與「祕密花園（周長與幾何邊角）」
   ========================================================= */
function setNyG2U10Preset(mode, s10, s6, s2, s0, story) {
  nyState.g2u10.mode = mode;
  nyState.g2u10.shots10 = s10;
  nyState.g2u10.shots6 = s6;
  nyState.g2u10.shots2 = s2;
  nyState.g2u10.shots0 = s0;
  nyState.g2u10.story = story;
  const el = document.getElementById('nyG2U10TaskText');
  if (el) el.innerHTML = story;
  renderNyG2U10();
  if (typeof playTone === 'function') playTone(523.25, 0.08);
}

function randomNyG2U10Task() {
  const s10 = Math.floor(Math.random() * 5) + 2;
  const s6 = Math.floor(Math.random() * 5) + 2;
  const s2 = Math.floor(Math.random() * 5) + 2;
  const s0 = Math.floor(Math.random() * 5) + 1;
  const inside = s10 + s6 + s2;
  const score = s10 * 10 + s6 * 6 + s2 * 2;
  setNyG2U10Preset(
    'target',
    s10, s6, s2, s0,
    `【隨機神射手挑戰】選手共射了 <strong>${inside + s0}</strong> 發子彈！靶的<strong>內部</strong>有 ${inside} 個彈孔（10分${s10}發、6分${s6}發、2分${s2}發），靶的<strong>外部</strong>有 ${s0} 個彈孔（0分），總得分是 <strong>${score} 分</strong>！`
  );
}

function adjustNyG2U10Shot(zone, delta) {
  if (zone === 10) nyState.g2u10.shots10 = Math.max(0, Math.min(10, nyState.g2u10.shots10 + delta));
  if (zone === 6) nyState.g2u10.shots6 = Math.max(0, Math.min(10, nyState.g2u10.shots6 + delta));
  if (zone === 2) nyState.g2u10.shots2 = Math.max(0, Math.min(10, nyState.g2u10.shots2 + delta));
  if (zone === 0) nyState.g2u10.shots0 = Math.max(0, Math.min(10, nyState.g2u10.shots0 + delta));
  renderNyG2U10();
  if (typeof playTone === 'function') playTone(659.25, 0.06);
}

function renderNyG2U10() {
  const wrap = document.getElementById('nyG2U10Display');
  if (!wrap) return;
  const { shots10, shots6, shots2, shots0 } = nyState.g2u10;
  const insideCount = shots10 + shots6 + shots2;
  const totalShots = insideCount + shots0;
  const totalScore = shots10 * 10 + shots6 * 6 + shots2 * 2;

  // 產生彈孔 SVG 點位
  let dotsSvg = '';
  const drawDots = (count, minR, maxR, color) => {
    for (let i = 0; i < count; i++) {
      const angle = (i * (360 / Math.max(1, count)) + 25) * (Math.PI / 180);
      const r = (minR + maxR) / 2;
      const cx = 130 + r * Math.cos(angle);
      const cy = 130 + r * Math.sin(angle);
      dotsSvg += `<circle cx="${cx.toFixed(1)}" cy="${cy.toFixed(1)}" r="5" fill="${color}" stroke="#FFFFFF" stroke-width="1.5"/>`;
    }
  };
  drawDots(shots10, 0, 24, '#EF4444');
  drawDots(shots6, 36, 54, '#F59E0B');
  drawDots(shots2, 68, 86, '#3B82F6');
  drawDots(shots0, 106, 120, '#64748B');

  wrap.innerHTML = `
    <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(300px, 1fr)); gap:1.25rem; align-items:center;">
      <!-- 左側：互動射擊靶（周界、內部、外部） -->
      <div style="background:#F8FAFC; border:2px solid #CBD5E1; border-radius:16px; padding:1.1rem; text-align:center;">
        <div style="font-weight:900; color:#1E3A8A; margin-bottom:0.5rem; font-size:1.05rem;">
          🎯 Follow Me 神射手固定靶（紅線為最外圈「周界」）
        </div>
        <svg viewBox="0 0 260 260" style="width:100%; max-width:250px; height:auto; background:#FFFFFF; border-radius:12px; border:1px solid #E2E8F0;">
          <!-- 外部標示 -->
          <text x="12" y="20" font-size="11" font-weight="900" fill="#64748B">靶的外部 (0分)</text>
          <!-- 2分區 (最外圈周界 r=95) -->
          <circle cx="130" cy="130" r="95" fill="#DBEAFE" stroke="#DC2626" stroke-width="3.5"/>
          <!-- 6分區 (r=62) -->
          <circle cx="130" cy="130" r="62" fill="#FEF3C7" stroke="#475569" stroke-width="2"/>
          <!-- 10分靶心 (r=30) -->
          <circle cx="130" cy="130" r="30" fill="#FEE2E2" stroke="#475569" stroke-width="2"/>
          <text x="130" y="134" font-size="13" font-weight="900" fill="#991B1B" text-anchor="middle">10分</text>
          <text x="176" y="134" font-size="12" font-weight="900" fill="#92400E" text-anchor="middle">6分</text>
          <text x="208" y="134" font-size="12" font-weight="900" fill="#1E40AF" text-anchor="middle">2分</text>
          ${dotsSvg}
        </svg>
        <div style="font-size:0.82rem; color:#DC2626; font-weight:800; margin-top:0.4rem;">
          🔴 紅色粗圈就是「周界」：圈內是「內部」，圈外是「外部」！
        </div>
      </div>

      <!-- 右側：計分統計表與平面圖形幾何性質 -->
      <div style="display:flex; flex-direction:column; gap:0.85rem;">
        <div style="background:#FFFFFF; border:2px solid #93C5FD; border-radius:14px; padding:1rem;">
          <div style="font-weight:900; color:#1E40AF; margin-bottom:0.6rem;">📊 調整各區射中發數（即時統計內外部與總分）：</div>
          <div style="display:grid; grid-template-columns:repeat(4, 1fr); gap:0.5rem; text-align:center;">
            <div style="background:#FEF2F2; padding:0.5rem; border-radius:10px; border:1px solid #FCA5A5;">
              <div style="font-size:0.8rem; font-weight:800; color:#991B1B;">內部 10分</div>
              <div style="font-size:1.3rem; font-weight:900; color:#DC2626; margin:4px 0;">${shots10} 發</div>
              <button class="btn btn-outline" style="padding:2px 8px;" onclick="adjustNyG2U10Shot(10, -1)">-</button>
              <button class="btn btn-outline" style="padding:2px 8px;" onclick="adjustNyG2U10Shot(10, 1)">+</button>
            </div>
            <div style="background:#FFFBEB; padding:0.5rem; border-radius:10px; border:1px solid #FCD34D;">
              <div style="font-size:0.8rem; font-weight:800; color:#92400E;">內部 6分</div>
              <div style="font-size:1.3rem; font-weight:900; color:#D97706; margin:4px 0;">${shots6} 發</div>
              <button class="btn btn-outline" style="padding:2px 8px;" onclick="adjustNyG2U10Shot(6, -1)">-</button>
              <button class="btn btn-outline" style="padding:2px 8px;" onclick="adjustNyG2U10Shot(6, 1)">+</button>
            </div>
            <div style="background:#EFF6FF; padding:0.5rem; border-radius:10px; border:1px solid #93C5FD;">
              <div style="font-size:0.8rem; font-weight:800; color:#1E40AF;">內部 2分</div>
              <div style="font-size:1.3rem; font-weight:900; color:#2563EB; margin:4px 0;">${shots2} 發</div>
              <button class="btn btn-outline" style="padding:2px 8px;" onclick="adjustNyG2U10Shot(2, -1)">-</button>
              <button class="btn btn-outline" style="padding:2px 8px;" onclick="adjustNyG2U10Shot(2, 1)">+</button>
            </div>
            <div style="background:#F1F5F9; padding:0.5rem; border-radius:10px; border:1px solid #CBD5E1;">
              <div style="font-size:0.8rem; font-weight:800; color:#475569;">外部 0分</div>
              <div style="font-size:1.3rem; font-weight:900; color:#334155; margin:4px 0;">${shots0} 發</div>
              <button class="btn btn-outline" style="padding:2px 8px;" onclick="adjustNyG2U10Shot(0, -1)">-</button>
              <button class="btn btn-outline" style="padding:2px 8px;" onclick="adjustNyG2U10Shot(0, 1)">+</button>
            </div>
          </div>

          <div style="margin-top:0.85rem; background:#ECFDF5; border:1.5px solid #6EE7B7; border-radius:10px; padding:0.75rem; font-weight:800; color:#065F46; line-height:1.6;">
            ✅ 總共射擊：<strong>${totalShots} 發</strong> ｜ 在靶的<strong>內部</strong>：<strong>${insideCount} 個</strong>彈孔 ｜ 在靶的<strong>外部</strong>：<strong>${shots0} 個</strong>彈孔<br/>
            🏆 總得分算式：10×${shots10} ＋ 6×${shots6} ＋ 2×${shots2} ＝ <strong>${totalScore} 分</strong>！
          </div>
        </div>

        <!-- 平面圖形邊、角、頂點一覽 -->
        <div style="background:#FFFBEB; border:2px solid #FCD34D; border-radius:14px; padding:0.85rem 1rem; font-size:0.9rem; font-weight:800; color:#78350F;">
          📐 <strong>平面圖形構成要素（祕密花園小木屋）</strong>：<br/>
          ・<strong>三角形</strong>：3 條邊、3 個角、3 個頂點。<br/>
          ・<strong>正方形</strong>：4 條邊（<strong>4 條邊都一樣長</strong>）、4 個角、4 個頂點。<br/>
          ・<strong>長方形</strong>：4 條邊（<strong>上下對邊一樣長、左右對邊一樣長</strong>）、4 個角、4 個頂點。
        </div>
      </div>
    </div>
  `;
}

/* =========================================================
   南一專屬互動教具 2：【3上 第9單元：圓】
   結合「修理盾牌（對摺找圓心、含半徑碎片）」與「小人國設計家（圓規張開半徑畫圓）」
   ========================================================= */
function setNyG3U9Preset(radius, showFold, story) {
  nyState.g3u9.radius = radius;
  nyState.g3u9.showFold = showFold;
  nyState.g3u9.story = story;
  const el = document.getElementById('nyG3U9TaskText');
  if (el) el.innerHTML = story;
  renderNyG3U9();
  if (typeof playTone === 'function') playTone(523.25, 0.08);
}

function randomNyG3U9Task() {
  const r = Math.floor(Math.random() * 6) + 2; // 2~7 cm
  setNyG3U9Preset(
    r,
    true,
    `【隨機畫圓挑戰】請把圓規兩腳張開 <strong>${r} 公分</strong>（半徑 ＝ ${r} 公分），畫出一個大圓，算算看它的直徑是 <strong>${r * 2} 公分</strong>！`
  );
}

function changeNyG3U9Radius(val) {
  nyState.g3u9.radius = Number(val);
  renderNyG3U9();
  if (typeof playTone === 'function') playTone(587.33, 0.06);
}

function toggleNyG3U9Fold() {
  nyState.g3u9.showFold = !nyState.g3u9.showFold;
  renderNyG3U9();
}

function renderNyG3U9() {
  const wrap = document.getElementById('nyG3U9Display');
  if (!wrap) return;
  const { radius, showFold } = nyState.g3u9;
  const diameter = radius * 2;
  const svgR = radius * 14; // 視覺縮放 (2cm~7cm -> 28px~98px)

  wrap.innerHTML = `
    <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(300px, 1fr)); gap:1.25rem; align-items:center;">
      <!-- 左側：互動圓規與圓心半徑直徑視覺化 -->
      <div style="background:#F8FAFC; border:2px solid #CBD5E1; border-radius:16px; padding:1rem; text-align:center;">
        <div style="font-weight:900; color:#1E3A8A; margin-bottom:0.5rem;">
          🧭 圓規畫圓與「對摺再對摺找圓心」實驗台
        </div>
        <svg viewBox="0 0 260 240" style="width:100%; max-width:260px; height:auto; background:#FFFFFF; border-radius:12px; border:1px solid #E2E8F0;">
          <!-- 對摺虛線 (兩條直徑交於圓心) -->
          ${showFold ? `
            <line x1="${130 - svgR}" y1="125" x2="${130 + svgR}" y2="125" stroke="#3B82F6" stroke-width="2.5" stroke-dasharray="5,4"/>
            <line x1="130" y1="${125 - svgR}" x2="130" y2="${125 + svgR}" stroke="#94A3B8" stroke-width="1.5" stroke-dasharray="4,4"/>
            <text x="130" y="${125 - svgR - 6}" font-size="11" font-weight="900" fill="#1D4ED8" text-anchor="middle">直徑 ＝ ${diameter} cm (通過圓心最長)</text>
          ` : ''}
          <!-- 圓周 -->
          <circle cx="130" cy="125" r="${svgR}" fill="rgba(59, 130, 246, 0.1)" stroke="#1E40AF" stroke-width="3"/>
          <!-- 半徑紅線 -->
          <line x1="130" y1="125" x2="${130 + svgR}" y2="125" stroke="#DC2626" stroke-width="3.5"/>
          <text x="${130 + svgR / 2}" y="116" font-size="12" font-weight="900" fill="#DC2626" text-anchor="middle">半徑 ${radius}cm</text>
          <!-- 圓心點 -->
          <circle cx="130" cy="125" r="5" fill="#DC2626" stroke="#FFFFFF" stroke-width="1.5"/>
          <text x="118" y="142" font-size="12" font-weight="900" fill="#991B1B" text-anchor="end">圓心</text>
          <!-- 簡易圓規示意 -->
          <line x1="130" y1="55" x2="130" y2="125" stroke="#475569" stroke-width="3"/>
          <line x1="130" y1="55" x2="${130 + svgR}" y2="125" stroke="#475569" stroke-width="3"/>
          <circle cx="130" cy="52" r="6" fill="#F59E0B"/>
        </svg>
      </div>

      <!-- 右側：控制面板與算式卡片 -->
      <div style="display:flex; flex-direction:column; gap:0.85rem;">
        <div style="background:#FFFFFF; border:2px solid #93C5FD; border-radius:14px; padding:1rem;">
          <label style="font-weight:900; color:#1E3A8A; display:block; margin-bottom:0.4rem;">
            📏 調整圓規張開寬度（半徑）：<span style="color:#DC2626; font-size:1.3rem;">${radius} 公分</span>
          </label>
          <input type="range" min="1" max="7" step="0.5" value="${radius}" class="edu-slider" oninput="changeNyG3U9Radius(this.value)" style="width:100%;" />
          
          <div style="display:flex; gap:0.5rem; margin-top:0.75rem; flex-wrap:wrap;">
            <button class="btn btn-outline" onclick="toggleNyG3U9Fold()">
              ${showFold ? '🙈 隱藏對摺線（直徑）' : '📄 顯示對摺再對摺找圓心（直徑）'}
            </button>
          </div>

          <div style="margin-top:0.85rem; background:#EFF6FF; border:2px solid #60A5FA; border-radius:12px; padding:0.85rem; font-weight:900; color:#1E3A8A; line-height:1.7;">
            ⭕ <strong>圓心</strong>：1 個（圓正中央的點，圓規針尖刺的位置）<br/>
            🔴 <strong>半徑</strong>：<strong>${radius} 公分</strong>（圓心到圓周的距離，有無限多條且一樣長）<br/>
            🔵 <strong>直徑</strong>：${radius} × 2 ＝ <strong>${diameter} 公分</strong>（通過圓心且兩端在圓周，是圓內最長的線段！）
          </div>
        </div>
      </div>
    </div>
  `;
}

/* =========================================================
   南一專屬互動教具 3：【4上 第7單元：數量關係】
   結合「好玩的數學（百數表骰子展開圖、奇偶數相乘、方桌併攏與圖形規律）」
   ========================================================= */
function setNyG4U7Preset(baseNum, tablesCount, story) {
  nyState.g4u7.baseNum = baseNum;
  nyState.g4u7.tablesCount = tablesCount;
  nyState.g4u7.story = story;
  const el = document.getElementById('nyG4U7TaskText');
  if (el) el.innerHTML = story;
  renderNyG4U7();
  if (typeof playTone === 'function') playTone(523.25, 0.08);
}

function randomNyG4U7Task() {
  const row = Math.floor(Math.random() * 6) + 1;
  const col = Math.floor(Math.random() * 6) + 2;
  const base = row * 10 + col;
  const t = Math.floor(Math.random() * 6) + 2;
  setNyG4U7Preset(
    base,
    t,
    `【隨機規律挑戰】在百數表十字展開圖中，中心格是 <strong>${base}</strong>，上方是 ${base - 10}、下方是 ${base + 10}、左邊是 ${base - 1}、右邊是 ${base + 1}！同時觀察 ${t} 張方桌併攏可坐 <strong>${2 + t * 2} 人</strong>！`
  );
}

function changeNyG4U7Base(delta) {
  let next = nyState.g4u7.baseNum + delta;
  if (next < 12) next = 12;
  if (next > 88) next = 88;
  nyState.g4u7.baseNum = next;
  renderNyG4U7();
  if (typeof playTone === 'function') playTone(587.33, 0.06);
}

function changeNyG4U7Tables(val) {
  nyState.g4u7.tablesCount = Number(val);
  renderNyG4U7();
  if (typeof playTone === 'function') playTone(659.25, 0.06);
}

function renderNyG4U7() {
  const wrap = document.getElementById('nyG4U7Display');
  if (!wrap) return;
  const { baseNum, tablesCount } = nyState.g4u7;
  const seats = 2 + tablesCount * 2;
  const isOdd = baseNum % 2 !== 0;

  wrap.innerHTML = `
    <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(300px, 1fr)); gap:1.25rem;">
      <!-- 左側：百數表骰子展開圖規律 -->
      <div style="background:#F8FAFC; border:2px solid #CBD5E1; border-radius:16px; padding:1rem; text-align:center;">
        <div style="font-weight:900; color:#1E3A8A; margin-bottom:0.6rem;">
          🎲 百數表「骰子展開圖」行列規律探索器
        </div>
        <div style="display:inline-grid; grid-template-columns:repeat(3, 64px); gap:6px; margin:0.5rem auto;">
          <div></div>
          <div style="background:#DBEAFE; border:2px solid #2563EB; border-radius:10px; padding:0.6rem 0; font-weight:900; font-size:1.15rem; color:#1E3A8A;">
            ${baseNum - 10}<div style="font-size:0.7rem; color:#2563EB;">(-10)</div>
          </div>
          <div></div>

          <div style="background:#FEF3C7; border:2px solid #D97706; border-radius:10px; padding:0.6rem 0; font-weight:900; font-size:1.15rem; color:#92400E;">
            ${baseNum - 1}<div style="font-size:0.7rem; color:#B45309;">(-1)</div>
          </div>
          <div style="background:#DC2626; border:3px solid #991B1B; border-radius:10px; padding:0.6rem 0; font-weight:900; font-size:1.3rem; color:white;">
            ${baseNum}<div style="font-size:0.7rem; color:#FEE2E2;">中心數</div>
          </div>
          <div style="background:#FEF3C7; border:2px solid #D97706; border-radius:10px; padding:0.6rem 0; font-weight:900; font-size:1.15rem; color:#92400E;">
            ${baseNum + 1}<div style="font-size:0.7rem; color:#B45309;">(+1)</div>
          </div>

          <div></div>
          <div style="background:#DBEAFE; border:2px solid #2563EB; border-radius:10px; padding:0.6rem 0; font-weight:900; font-size:1.15rem; color:#1E3A8A;">
            ${baseNum + 10}<div style="font-size:0.7rem; color:#2563EB;">(+10)</div>
          </div>
          <div></div>

          <div></div>
          <div style="background:#E0E7FF; border:2px solid #4F46E5; border-radius:10px; padding:0.6rem 0; font-weight:900; font-size:1.15rem; color:#312E81;">
            ${baseNum + 20}<div style="font-size:0.7rem; color:#4338CA;">(+20)</div>
          </div>
          <div></div>
        </div>

        <div style="display:flex; justify-content:center; gap:0.4rem; margin-top:0.6rem; flex-wrap:wrap;">
          <button class="btn btn-outline" onclick="changeNyG4U7Base(-10)">⬆ 往上列 (-10)</button>
          <button class="btn btn-outline" onclick="changeNyG4U7Base(-1)">⬅ 往左格 (-1)</button>
          <button class="btn btn-outline" onclick="changeNyG4U7Base(1)">➡ 往右格 (+1)</button>
          <button class="btn btn-outline" onclick="changeNyG4U7Base(10)">⬇ 往下列 (+10)</button>
        </div>

        <div style="margin-top:0.75rem; background:#FFFBEB; border:1px solid #FCD34D; border-radius:10px; padding:0.6rem; font-size:0.88rem; font-weight:800; color:#78350F;">
          💡 中心數 <strong>${baseNum}</strong> 是 <strong>${isOdd ? '奇數（單數）' : '偶數（雙數）'}</strong>！<br/>
          奇偶規律：<strong>奇×奇＝奇</strong> ｜ <strong>奇×偶＝偶</strong> ｜ <strong>奇＋奇＝偶</strong>
        </div>
      </div>

      <!-- 右側：方桌併攏圖形規律 -->
      <div style="background:#FFFFFF; border:2px solid #93C5FD; border-radius:16px; padding:1rem; display:flex; flex-direction:column; justify-content:space-between;">
        <div>
          <div style="font-weight:900; color:#1E3A8A; margin-bottom:0.5rem;">
            🪑 餐廳方桌併攏規律：<strong>${tablesCount} 張方桌</strong>排一排可坐幾人？
          </div>
          <input type="range" min="1" max="7" value="${tablesCount}" class="edu-slider" oninput="changeNyG4U7Tables(this.value)" style="width:100%; margin-bottom:0.75rem;" />

          <div style="display:flex; justify-content:center; align-items:center; gap:2px; padding:1rem; background:#F8FAFC; border-radius:12px; border:1px solid #E2E8F0; overflow-x:auto;">
            <span style="font-size:1.4rem;" title="左端1人">🧑</span>
            ${Array.from({ length: tablesCount }).map((_, idx) => `
              <div style="display:flex; flex-direction:column; align-items:center; margin:0 2px;">
                <span style="font-size:1.2rem;">🧑</span>
                <div style="width:42px; height:42px; background:#FBBF24; border:2px solid #B45309; border-radius:6px; display:flex; align-items:center; justify-content:center; font-weight:900; color:#78350F; font-size:0.85rem;">
                  桌${idx + 1}
                </div>
                <span style="font-size:1.2rem;">🧑</span>
              </div>
            `).join('')}
            <span style="font-size:1.4rem;" title="右端1人">🧑</span>
          </div>
        </div>

        <div style="margin-top:0.85rem; background:#ECFDF5; border:2px solid #6EE7B7; border-radius:12px; padding:0.85rem; font-weight:900; color:#065F46; line-height:1.6;">
          🔍 <strong>規律推導</strong>：<br/>
          ・每張方桌上下各坐 2 人：2 × ${tablesCount} ＝ ${tablesCount * 2} 人<br/>
          ・再加上左右兩端固定 2 人：${tablesCount * 2} ＋ 2 ＝ <strong>${seats} 人</strong>！<br/>
          （每多併 1 張方桌，就會多坐 <strong>2 人</strong>！）
        </div>
      </div>
    </div>
  `;
}

/* =========================================================
   南一專屬互動教具 4：【5上 第1單元：折線圖】
   結合「南北溫差大（雙折線圖比較、交會點、最大溫差、波浪省略記號）」
   ========================================================= */
function setNyG5U1Preset(hour, useWave, story) {
  nyState.g5u1.selectedHour = hour;
  nyState.g5u1.useWave = useWave;
  nyState.g5u1.story = story;
  const el = document.getElementById('nyG5U1TaskText');
  if (el) el.innerHTML = story;
  renderNyG5U1();
  if (typeof playTone === 'function') playTone(523.25, 0.08);
}

function randomNyG5U1Task() {
  const hours = [8, 9, 10, 11, 12, 13, 14, 15, 16, 17];
  const h = hours[Math.floor(Math.random() * hours.length)];
  const idx = h - 8;
  const s = nyState.g5u1.southTemps[idx];
  const n = nyState.g5u1.northTemps[idx];
  setNyG5U1Preset(
    h,
    true,
    `【隨機時刻判讀】請看折線圖在 <strong>${h} 時</strong> 的數據：南部氣溫是 <strong>${s}°C</strong>，北部氣溫是 <strong>${n}°C</strong>，兩地相差 <strong>${Math.abs(s - n)}°C</strong>！`
  );
}

function toggleNyG5U1Wave() {
  nyState.g5u1.useWave = !nyState.g5u1.useWave;
  renderNyG5U1();
  if (typeof playTone === 'function') playTone(587.33, 0.06);
}

function selectNyG5U1Hour(h) {
  nyState.g5u1.selectedHour = h;
  renderNyG5U1();
  if (typeof playTone === 'function') playTone(659.25, 0.06);
}

function renderNyG5U1() {
  const wrap = document.getElementById('nyG5U1Display');
  if (!wrap) return;
  const { useWave, selectedHour, southTemps, northTemps } = nyState.g5u1;
  const minYVal = useWave ? 12 : 0;
  const maxYVal = 32;
  const chartW = 420;
  const chartH = 175;
  const ox = 52;
  const oy = 200;

  const getY = (val) => oy - ((val - minYVal) / (maxYVal - minYVal)) * chartH;
  const getX = (i) => ox + 20 + i * 40;

  let gridSvg = '';
  const step = useWave ? 4 : 5;
  for (let v = (useWave ? 15 : 0); v <= 30; v += step) {
    const y = getY(v);
    gridSvg += `<line x1="${ox}" y1="${y}" x2="${ox + chartW}" y2="${y}" stroke="#E2E8F0" stroke-width="1" stroke-dasharray="3,3"/>`;
    gridSvg += `<text x="${ox - 8}" y="${y + 4}" font-size="10" font-weight="800" fill="#64748B" text-anchor="end">${v}°</text>`;
  }

  let sPath = '';
  let nPath = '';
  let dotsSvg = '';

  for (let i = 0; i < 10; i++) {
    const h = 8 + i;
    const x = getX(i);
    const sy = getY(southTemps[i]);
    const ny = getY(northTemps[i]);
    sPath += (i === 0 ? `M ${x} ${sy}` : ` L ${x} ${sy}`);
    nPath += (i === 0 ? `M ${x} ${ny}` : ` L ${x} ${ny}`);

    const isSel = (h === selectedHour);
    if (isSel) {
      dotsSvg += `<line x1="${x}" y1="${oy - chartH}" x2="${x}" y2="${oy}" stroke="#F59E0B" stroke-width="2.5" stroke-dasharray="4,3"/>`;
    }
    dotsSvg += `
      <circle cx="${x}" cy="${sy}" r="${isSel ? 6.5 : 4.5}" fill="#DC2626" stroke="white" stroke-width="1.5" style="cursor:pointer;" onclick="selectNyG5U1Hour(${h})"/>
      <text x="${x}" y="${sy - 9}" font-size="9.5" font-weight="900" fill="#DC2626" text-anchor="middle">${southTemps[i]}</text>
      <circle cx="${x}" cy="${ny}" r="${isSel ? 6.5 : 4.5}" fill="#2563EB" stroke="white" stroke-width="1.5" style="cursor:pointer;" onclick="selectNyG5U1Hour(${h})"/>
      <text x="${x}" y="${ny + 15}" font-size="9.5" font-weight="900" fill="#2563EB" text-anchor="middle">${northTemps[i]}</text>
      <text x="${x}" y="${oy + 16}" font-size="10.5" font-weight="${isSel ? '900' : '700'}" fill="${isSel ? '#D97706' : '#1E293B'}" text-anchor="middle" style="cursor:pointer;" onclick="selectNyG5U1Hour(${h})">${h}時</text>
    `;
  }

  const selIdx = selectedHour - 8;
  const selS = southTemps[selIdx];
  const selN = northTemps[selIdx];
  const diff = Math.abs(selS - selN);

  wrap.innerHTML = `
    <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(320px, 1fr)); gap:1.25rem; align-items:center;">
      <!-- 左側：雙折線圖 SVG -->
      <div style="background:#FFFFFF; border:2px solid #CBD5E1; border-radius:16px; padding:1rem; text-align:center;">
        <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:0.5rem; margin-bottom:0.4rem;">
          <span style="font-weight:900; color:#1E3A8A;">📈 南、北部某日平均氣溫雙折線圖</span>
          <span style="font-size:0.82rem; font-weight:800;">
            <span style="color:#DC2626;">● 南部實線</span> ｜ <span style="color:#2563EB;">● 北部虛線</span>
          </span>
        </div>
        <svg viewBox="0 0 490 230" style="width:100%; height:auto;">
          <line x1="${ox}" y1="${oy}" x2="${ox + chartW}" y2="${oy}" stroke="#1E293B" stroke-width="2"/>
          <line x1="${ox}" y1="${oy}" x2="${ox}" y2="${oy - chartH - 10}" stroke="#1E293B" stroke-width="2"/>
          <text x="${ox - 6}" y="18" font-size="10" font-weight="900" fill="#64748B" text-anchor="end">(°C)</text>
          ${useWave ? `
            <path d="M ${ox - 6} ${oy - 10} Q ${ox} ${oy - 15} ${ox - 6} ${oy - 20} Q ${ox - 12} ${oy - 25} ${ox - 6} ${oy - 30}" fill="none" stroke="#EF4444" stroke-width="2"/>
          ` : ''}
          ${gridSvg}
          <path d="${sPath}" fill="none" stroke="#DC2626" stroke-width="3"/>
          <path d="${nPath}" fill="none" stroke="#2563EB" stroke-width="2.5" stroke-dasharray="6,4"/>
          ${dotsSvg}
        </svg>
      </div>

      <!-- 右側：時刻選擇與判讀結果 -->
      <div style="display:flex; flex-direction:column; gap:0.85rem;">
        <div style="background:#F8FAFC; border:2px solid #93C5FD; border-radius:14px; padding:1rem;">
          <div style="font-weight:900; color:#1E40AF; margin-bottom:0.5rem;">🕒 點選時刻檢視南、北部氣溫與溫差：</div>
          <div style="display:flex; flex-wrap:wrap; gap:0.35rem; margin-bottom:0.75rem;">
            ${[8, 9, 10, 11, 12, 13, 14, 15, 16, 17].map(h => `
              <button class="btn ${h === selectedHour ? 'btn-primary' : 'btn-outline'}" style="padding:0.25rem 0.6rem; font-size:0.85rem;" onclick="selectNyG5U1Hour(${h})">${h}時</button>
            `).join('')}
          </div>

          <button class="btn btn-outline" style="width:100%; margin-bottom:0.75rem;" onclick="toggleNyG5U1Wave()">
            ${useWave ? '〰️ 目前：使用波浪省略記號 (放大15°~30°起伏)' : '📏 目前：從 0°C 完整顯示 (無波浪省略記號)'}
          </button>

          <div style="background:#EFF6FF; border:2px solid #60A5FA; border-radius:12px; padding:0.85rem; font-weight:800; color:#1E3A8A; line-height:1.65;">
            📍 <strong>${selectedHour} 時氣溫判讀</strong>：<br/>
            ・🔴 南部平均氣溫：<strong>${selS} °C</strong><br/>
            ・🔵 北部平均氣溫：<strong>${selN} °C</strong><br/>
            ・🌡️ 兩地溫差：${Math.max(selS, selN)} － ${Math.min(selS, selN)} ＝ <strong>${diff} °C</strong>
            ${diff === 0 ? '<span style="color:#059669;">（⭐ 兩條折線交會，南北氣溫一樣高！）</span>' : ''}
            ${selectedHour === 17 ? '<span style="color:#DC2626;">（🔥 全天溫差最大的時刻，相差 6°C！）</span>' : ''}
          </div>
        </div>
      </div>
    </div>
  `;
}

/* =========================================================
   南一專屬互動教具 5：【5上 第9單元：時間的乘除】
   結合「幸福動物園運動大會（時間複名數乘法、等分除、包含除倍數）」
   ========================================================= */
function setNyG5U9Preset(op, min1, sec1, factor, totalMin, totalSec, divCount, story) {
  nyState.g5u9 = { op, min1, sec1, factor, totalMin, totalSec, divCount, story };
  const el = document.getElementById('nyG5U9TaskText');
  if (el) el.innerHTML = story;
  renderNyG5U9();
  if (typeof playTone === 'function') playTone(523.25, 0.08);
}

function randomNyG5U9Task() {
  const m = Math.floor(Math.random() * 3) + 1;
  const s = (Math.floor(Math.random() * 8) + 2) * 6; // 12~54
  const f = Math.floor(Math.random() * 4) + 2; // 2~5
  const totSec = (m * 60 + s) * f;
  const ansM = Math.floor(totSec / 60);
  const ansS = totSec % 60;
  setNyG5U9Preset(
    'mul', m, s, f, ansM, ansS, f,
    `【隨機運動大會挑戰】選手跑一圈操場要 <strong>${m} 分 ${s} 秒</strong>，連續跑 <strong>${f} 圈</strong>，總共花了 <strong>${ansM} 分 ${ansS} 秒</strong>！`
  );
}

function updateNyG5U9Inputs() {
  const mEl = document.getElementById('nyG5U9MinInput');
  const sEl = document.getElementById('nyG5U9SecInput');
  const fEl = document.getElementById('nyG5U9FactorInput');
  if (mEl) nyState.g5u9.min1 = Math.max(0, parseInt(mEl.value, 10) || 0);
  if (sEl) nyState.g5u9.sec1 = Math.max(0, Math.min(59, parseInt(sEl.value, 10) || 0));
  if (fEl) nyState.g5u9.factor = Math.max(1, Math.min(12, parseInt(fEl.value, 10) || 1));
  renderNyG5U9();
}

function renderNyG5U9() {
  const wrap = document.getElementById('nyG5U9Display');
  if (!wrap) return;
  const { min1, sec1, factor } = nyState.g5u9;
  const rawMin = min1 * factor;
  const rawSec = sec1 * factor;
  const carryMin = Math.floor(rawSec / 60);
  const remSec = rawSec % 60;
  const finalMin = rawMin + carryMin;
  const totalSingleSec = min1 * 60 + sec1;
  const grandTotalSec = totalSingleSec * factor;

  wrap.innerHTML = `
    <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(300px, 1fr)); gap:1.25rem;">
      <!-- 左側：時間複名數直式乘法與滿60進位 -->
      <div style="background:#F8FAFC; border:2px solid #CBD5E1; border-radius:16px; padding:1.1rem;">
        <div style="font-weight:900; color:#1E3A8A; margin-bottom:0.65rem;">
          ⏱️ 時間複名數直式乘法演算機（滿 60 秒進 1 分）
        </div>
        <div style="display:flex; gap:0.5rem; align-items:center; flex-wrap:wrap; margin-bottom:0.85rem; background:white; padding:0.65rem; border-radius:10px; border:1px solid #CBD5E1;">
          <input type="number" id="nyG5U9MinInput" value="${min1}" min="0" max="59" onchange="updateNyG5U9Inputs()" style="width:60px; padding:0.3rem; font-weight:900; text-align:center; border:2px solid #3B82F6; border-radius:8px;" />
          <span style="font-weight:800;">分</span>
          <input type="number" id="nyG5U9SecInput" value="${sec1}" min="0" max="59" onchange="updateNyG5U9Inputs()" style="width:60px; padding:0.3rem; font-weight:900; text-align:center; border:2px solid #3B82F6; border-radius:8px;" />
          <span style="font-weight:800;">秒 ×</span>
          <input type="number" id="nyG5U9FactorInput" value="${factor}" min="1" max="12" onchange="updateNyG5U9Inputs()" style="width:60px; padding:0.3rem; font-weight:900; text-align:center; border:2px solid #F59E0B; border-radius:8px;" />
          <span style="font-weight:800;">倍</span>
        </div>

        <!-- 直式板 -->
        <div style="background:#FFFFFF; border:2px solid #93C5FD; border-radius:12px; padding:1rem 1.5rem; font-family:'Fredoka', monospace; font-size:1.25rem; font-weight:900; max-width:320px; margin:0 auto;">
          <div style="display:flex; justify-content:flex-end; gap:1.5rem; color:#1E293B;">
            <span>${min1} 分</span>
            <span>${sec1} 秒</span>
          </div>
          <div style="display:flex; justify-content:space-between; border-bottom:3px solid #1E293B; padding-bottom:0.3rem; margin-bottom:0.4rem; color:#D97706;">
            <span>×</span>
            <span>${factor}</span>
          </div>
          <div style="display:flex; justify-content:flex-end; gap:1.5rem; color:#64748B; font-size:1.05rem;">
            <span>${rawMin} 分</span>
            <span>${rawSec} 秒 <span style="font-size:0.8rem; color:#DC2626;">(滿60進${carryMin}分)</span></span>
          </div>
          <div style="display:flex; justify-content:flex-end; gap:1.5rem; color:#059669; font-size:1.35rem; border-top:2px dashed #CBD5E1; padding-top:0.35rem; margin-top:0.35rem;">
            <span>＝ ${finalMin} 分</span>
            <span>${remSec} 秒</span>
          </div>
        </div>
      </div>

      <!-- 右側：時間除法（化為同單位相除）對照 -->
      <div style="background:#FFFFFF; border:2px solid #6EE7B7; border-radius:16px; padding:1.1rem; display:flex; flex-direction:column; justify-content:space-between;">
        <div>
          <div style="font-weight:900; color:#065F46; margin-bottom:0.5rem;">
            ➗ 逆運算驗證：時間的除法（先換成小單位秒鐘再除）
          </div>
          <div style="background:#ECFDF5; border-radius:12px; padding:0.9rem; font-weight:800; color:#047857; line-height:1.7;">
            1️⃣ <strong>總時間換成秒鐘</strong>：<br/>
            ${finalMin} 分 ${remSec} 秒 ＝ 60 × ${finalMin} ＋ ${remSec} ＝ <strong>${grandTotalSec} 秒</strong><br/>
            2️⃣ <strong>平分成 ${factor} 次（等分除）</strong>：<br/>
            ${grandTotalSec} 秒 ÷ ${factor} ＝ <strong>${totalSingleSec} 秒</strong> ＝ <strong>${min1} 分 ${sec1} 秒</strong><br/>
            3️⃣ <strong>包含除求倍數</strong>：<br/>
            ${grandTotalSec} 秒 ÷ ${totalSingleSec} 秒 ＝ <strong>${factor} 倍</strong>！
          </div>
        </div>

        <div style="margin-top:0.75rem; background:#FFFBEB; border:1px solid #FCD34D; border-radius:10px; padding:0.7rem; font-size:0.88rem; font-weight:800; color:#92400E;">
          💡 <strong>南一版解題口訣</strong>：小單位換大單位用「÷」（除以60或24）；大單位換小單位用「×」（乘以60或24）！
        </div>
      </div>
    </div>
  `;
}

/* =========================================================
   南一專屬互動教具 6：【5上 第10單元：正方體和長方體】
   結合「濃情巧克力學習單（防震壓條12條邊、相對面平行、相鄰面垂直、展開圖與表面積）」
   ========================================================= */
function setNyG5U10Preset(len, wid, hei, showNet, story) {
  nyState.g5u10.len = len;
  nyState.g5u10.wid = wid;
  nyState.g5u10.hei = hei;
  nyState.g5u10.showNet = showNet;
  nyState.g5u10.story = story;
  const el = document.getElementById('nyG5U10TaskText');
  if (el) el.innerHTML = story;
  renderNyG5U10();
  if (typeof playTone === 'function') playTone(523.25, 0.08);
}

function randomNyG5U10Task() {
  const isCube = Math.random() > 0.5;
  if (isCube) {
    const s = Math.floor(Math.random() * 8) + 4;
    setNyG5U10Preset(
      s, s, s, false,
      `【隨機正方體挑戰】邊長 <strong>${s} 公分</strong> 的正方體巧克力盒，12 條邊總長 <strong>${s * 12} 公分</strong>，6 個面的表面積是 <strong>${s * s * 6} 平方公分</strong>！`
    );
  } else {
    const l = Math.floor(Math.random() * 6) + 8;
    const w = Math.floor(Math.random() * 5) + 5;
    const h = Math.floor(Math.random() * 5) + 4;
    const area = (l * w + w * h + l * h) * 2;
    setNyG5U10Preset(
      l, w, h, true,
      `【隨機長方體挑戰】長 <strong>${l}cm</strong>、寬 <strong>${w}cm</strong>、高 <strong>${h}cm</strong> 的長方體禮盒，展開圖 6 個面的總表面積是 <strong>${area} 平方公分</strong>！`
    );
  }
}

function updateNyG5U10Dim(dim, val) {
  nyState.g5u10[dim] = Math.max(2, Math.min(20, Number(val) || 5));
  renderNyG5U10();
  if (typeof playTone === 'function') playTone(587.33, 0.06);
}

function toggleNyG5U10Net() {
  nyState.g5u10.showNet = !nyState.g5u10.showNet;
  renderNyG5U10();
}

function renderNyG5U10() {
  const wrap = document.getElementById('nyG5U10Display');
  if (!wrap) return;
  const { len, wid, hei, showNet } = nyState.g5u10;
  const isCube = (len === wid && wid === hei);
  const edgeSum = (len + wid + hei) * 4;
  const areaTop = len * wid;
  const areaFront = len * hei;
  const areaSide = wid * hei;
  const totalSurface = (areaTop + areaFront + areaSide) * 2;

  wrap.innerHTML = `
    <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(310px, 1fr)); gap:1.25rem; align-items:center;">
      <!-- 左側：3D 透視圖 vs 2D 展開圖切換 -->
      <div style="background:#F8FAFC; border:2px solid #CBD5E1; border-radius:16px; padding:1rem; text-align:center;">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.5rem;">
          <span style="font-weight:900; color:#1E3A8A;">
            🧊 ${isCube ? '正方體' : '長方體'} ${showNet ? '【6面展開圖】' : '【3D透視圖】'}
          </span>
          <button class="btn btn-outline" style="padding:0.25rem 0.65rem; font-size:0.82rem;" onclick="toggleNyG5U10Net()">
            ${showNet ? '📦 切換 3D 透視圖' : '✂️ 展開成 6 個面展開圖'}
          </button>
        </div>

        ${!showNet ? `
          <svg viewBox="0 0 280 210" style="width:100%; max-width:270px; height:auto; background:#FFFFFF; border-radius:12px; border:1px solid #E2E8F0;">
            <!-- 後方隱藏虛線 (3條看不見的邊) -->
            <line x1="95" y1="35" x2="95" y2="125" stroke="#94A3B8" stroke-width="2" stroke-dasharray="4,4"/>
            <line x1="95" y1="125" x2="45" y2="165" stroke="#94A3B8" stroke-width="2" stroke-dasharray="4,4"/>
            <line x1="95" y1="125" x2="225" y2="125" stroke="#94A3B8" stroke-width="2" stroke-dasharray="4,4"/>
            <!-- 上面 -->
            <polygon points="45,75 95,35 225,35 175,75" fill="rgba(251, 191, 36, 0.35)" stroke="#1E3A8A" stroke-width="2.5"/>
            <!-- 前面 -->
            <polygon points="45,75 175,75 175,165 45,165" fill="rgba(59, 130, 246, 0.25)" stroke="#1E3A8A" stroke-width="2.5"/>
            <!-- 右側面 -->
            <polygon points="175,75 225,35 225,125 175,165" fill="rgba(16, 185, 129, 0.3)" stroke="#1E3A8A" stroke-width="2.5"/>
            <!-- 尺寸標記 -->
            <text x="110" y="185" font-size="12" font-weight="900" fill="#1D4ED8" text-anchor="middle">長 ${len} cm</text>
            <text x="212" y="158" font-size="12" font-weight="900" fill="#047857">寬 ${wid} cm</text>
            <text x="24" y="125" font-size="12" font-weight="900" fill="#B45309">高 ${hei}cm</text>
          </svg>
        ` : `
          <svg viewBox="0 0 280 210" style="width:100%; max-width:270px; height:auto; background:#FFFFFF; border-radius:12px; border:1px solid #E2E8F0;">
            <!-- 十字展開圖 6個面 -->
            <rect x="85" y="12" width="70" height="42" fill="#FDE68A" stroke="#B45309" stroke-width="2"/>
            <text x="120" y="37" font-size="10" font-weight="900" fill="#78350F" text-anchor="middle">上面(${areaTop})</text>

            <rect x="35" y="54" width="50" height="52" fill="#A7F3D0" stroke="#047857" stroke-width="2"/>
            <text x="60" y="84" font-size="9.5" font-weight="900" fill="#065F46" text-anchor="middle">左(${areaSide})</text>

            <rect x="85" y="54" width="70" height="52" fill="#BFDBFE" stroke="#1D4ED8" stroke-width="2"/>
            <text x="120" y="84" font-size="10" font-weight="900" fill="#1E3A8A" text-anchor="middle">前面(${areaFront})</text>

            <rect x="155" y="54" width="50" height="52" fill="#A7F3D0" stroke="#047857" stroke-width="2"/>
            <text x="180" y="84" font-size="9.5" font-weight="900" fill="#065F46" text-anchor="middle">右(${areaSide})</text>

            <rect x="205" y="54" width="65" height="52" fill="#BFDBFE" stroke="#1D4ED8" stroke-width="2"/>
            <text x="237" y="84" font-size="9.5" font-weight="900" fill="#1E3A8A" text-anchor="middle">後面(${areaFront})</text>

            <rect x="85" y="106" width="70" height="42" fill="#FDE68A" stroke="#B45309" stroke-width="2"/>
            <text x="120" y="131" font-size="10" font-weight="900" fill="#78350F" text-anchor="middle">下面(${areaTop})</text>

            <text x="140" y="182" font-size="11" font-weight="900" fill="#334155" text-anchor="middle">3組全等的對面：上下、前後、左右</text>
          </svg>
        `}
      </div>

      <!-- 右側：長寬高滑桿與表面積/邊長總和算式 -->
      <div style="display:flex; flex-direction:column; gap:0.75rem;">
        <div style="background:#FFFFFF; border:2px solid #93C5FD; border-radius:14px; padding:1rem;">
          <div style="display:grid; grid-template-columns:repeat(3, 1fr); gap:0.5rem; margin-bottom:0.75rem;">
            <div>
              <label style="font-size:0.85rem; font-weight:900; color:#1D4ED8;">長：${len} cm</label>
              <input type="range" min="3" max="15" value="${len}" oninput="updateNyG5U10Dim('len', this.value)" style="width:100%;" />
            </div>
            <div>
              <label style="font-size:0.85rem; font-weight:900; color:#047857;">寬：${wid} cm</label>
              <input type="range" min="3" max="15" value="${wid}" oninput="updateNyG5U10Dim('wid', this.value)" style="width:100%;" />
            </div>
            <div>
              <label style="font-size:0.85rem; font-weight:900; color:#B45309;">高：${hei} cm</label>
              <input type="range" min="3" max="15" value="${hei}" oninput="updateNyG5U10Dim('hei', this.value)" style="width:100%;" />
            </div>
          </div>

          <div style="background:#EFF6FF; border:2px solid #60A5FA; border-radius:12px; padding:0.85rem; font-weight:800; color:#1E3A8A; line-height:1.65; font-size:0.92rem;">
            📏 <strong>12 條邊防震壓條總長</strong>：<br/>
            (${len} ＋ ${wid} ＋ ${hei}) × 4 ＝ <strong>${edgeSum} 公分</strong><br/>
            🎁 <strong>6 個面包裝紙總表面積</strong>：<br/>
            ・上下 2 面：${len}×${wid} ＝ ${areaTop} cm²<br/>
            ・前後 2 面：${len}×${hei} ＝ ${areaFront} cm²<br/>
            ・左右 2 面：${wid}×${hei} ＝ ${areaSide} cm²<br/>
            👉 總表面積 ＝ (${areaTop} ＋ ${areaFront} ＋ ${areaSide}) × 2 ＝ <strong style="color:#DC2626; font-size:1.15rem;">${totalSurface} 平方公分</strong>！
          </div>
        </div>
      </div>
    </div>
  `;
}

// 暴露全域介面
if (typeof window !== 'undefined') {
  window.activePublisher = activePublisher;
  window.NANYI_CURRICULUM = NANYI_CURRICULUM;
  window.switchPublisher = switchPublisher;
  window.switchNyUnit = switchNyUnit;
  window.openNyUnitQuiz = openNyUnitQuiz;
  window.hideAllNyCustomSections = hideAllNyCustomSections;
  window.setNyG2U10Preset = setNyG2U10Preset;
  window.randomNyG2U10Task = randomNyG2U10Task;
  window.adjustNyG2U10Shot = adjustNyG2U10Shot;
  window.renderNyG2U10 = renderNyG2U10;
  window.setNyG3U9Preset = setNyG3U9Preset;
  window.randomNyG3U9Task = randomNyG3U9Task;
  window.changeNyG3U9Radius = changeNyG3U9Radius;
  window.toggleNyG3U9Fold = toggleNyG3U9Fold;
  window.renderNyG3U9 = renderNyG3U9;
  window.setNyG4U7Preset = setNyG4U7Preset;
  window.randomNyG4U7Task = randomNyG4U7Task;
  window.changeNyG4U7Base = changeNyG4U7Base;
  window.changeNyG4U7Tables = changeNyG4U7Tables;
  window.renderNyG4U7 = renderNyG4U7;
  window.setNyG5U1Preset = setNyG5U1Preset;
  window.randomNyG5U1Task = randomNyG5U1Task;
  window.toggleNyG5U1Wave = toggleNyG5U1Wave;
  window.selectNyG5U1Hour = selectNyG5U1Hour;
  window.renderNyG5U1 = renderNyG5U1;
  window.setNyG5U9Preset = setNyG5U9Preset;
  window.randomNyG5U9Task = randomNyG5U9Task;
  window.updateNyG5U9Inputs = updateNyG5U9Inputs;
  window.renderNyG5U9 = renderNyG5U9;
  window.setNyG5U10Preset = setNyG5U10Preset;
  window.randomNyG5U10Task = randomNyG5U10Task;
  window.updateNyG5U10Dim = updateNyG5U10Dim;
  window.toggleNyG5U10Net = toggleNyG5U10Net;
  window.renderNyG5U10 = renderNyG5U10;
}
