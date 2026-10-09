/* =========================================================
   木新思達國小三年級上學期 (3上) 線上測驗中心與自動批改系統 (quiz.js)
   依據 木新思達「04卷類」(學前檢測、基礎能力、隨堂練習、學後檢測、素養挑戰) 題庫設計
   ========================================================= */

let quizState = {
  studentClass: localStorage.getItem('kx_g3_class') || '三年一班',
  studentSeat: localStorage.getItem('kx_g3_seat') || '1',
  studentName: localStorage.getItem('kx_g3_name') || '',
  currentUnit: 1,
  currentPaperIdx: 0, // 0..4 (共 5 份測驗卷/單元)
  submitted: false,
  records: JSON.parse(localStorage.getItem('kx_g3_quiz_records') || '[]')
};

const unitTitles = {
  1: '第 1 單元：10000以內的數',
  2: '第 2 單元：四位數的加減',
  3: '第 3 單元：毫米 (mm)',
  4: '第 4 單元：乘 法',
  5: '第 5 單元：角與形狀',
  6: '第 6 單元：面 積 (cm²)',
  7: '第 7 單元：除 法',
  8: '第 8 單元：公升和毫升',
  9: '第 9 單元：分 數'
};

const paperTypes = [
  { code: 'P1', name: '第 1 卷：單元學前檢測卷', tag: '舊經驗暖身', color: '#0EA5E9' },
  { code: 'P2', name: '第 2 卷：基礎能力練習卷', tag: '基本功精熟', color: '#10B981' },
  { code: 'P3', name: '第 3 卷：隨堂練習單', tag: '課堂核心題', color: '#F59E0B' },
  { code: 'P4', name: '第 4 卷：單元學後檢測卷', tag: '綜合總評量', color: '#6366F1' },
  { code: 'P5', name: '第 5 卷：數學素養與資優挑戰卷', tag: '生活素養題', color: '#EC4899' }
];

/* 9 單元 × 5 份測驗卷 × 每卷 5 題 (每題 20 分，滿分 100 分)
   題型支援：
   - 'mc': 單選題 (options, ans)
   - 'tf': 是非題 (ans: 'O' | 'X')
   - 'cmp': 比大小題 (left, right, ans: '>' | '<' | '=')
   - 'fill': 填充題 (ans: 字串或數字, unitLabel)
*/
const QUIZ_BANK = {
  // ================= 第 1 單元：10000以內的數 =================
  1: [
    // 卷1：學前檢測卷
    [
      { type: 'fill', q: '按照順序填填看：286 → 296 → ( ？ ) → 316 → 326', ans: '306', explain: '每次往上加 10，296 再加 10 是 306。' },
      { type: 'fill', q: '用阿拉伯數字寫寫看：「六百零六」記作多少？', ans: '606', explain: '6 個百、0 個十和 6 個一，記作 606。' },
      { type: 'fill', q: '6 個百、3 個十和 15 個一合起來是多少？', ans: '645', explain: '15 個一可以換成 1 個十和 5 個一，600 + 30 + 15 = 645。' },
      { type: 'cmp', q: '比比看，請選出正確的符號：', left: '481', right: '487', ans: '<', explain: '百位與十位相同，個位 1 < 7，所以 481 < 487。' },
      { type: 'mc', q: '條紋緞帶長 3 公分，點點緞帶長 4 公分，兩條緞帶接在一起共長幾公分？', options: ['6 公分', '7 公分', '8 公分', '12 公分'], ans: '7 公分', explain: '3 + 4 = 7（公分）。' }
    ],
    // 卷2：基礎能力練習卷
    [
      { type: 'fill', q: '按照順序填填看：2970 → 2980 → 2990 → ( ？ ) → 3010', ans: '3000', explain: '2990 再加 10，滿十個十進位成 3000。' },
      { type: 'fill', q: '「五千零八」用阿拉伯數字記作多少？', ans: '5008', explain: '千位是 5，百位和十位都是 0，個位是 8，記作 5008。' },
      { type: 'fill', q: '5 個千、13 個百、2 個十和 1 個一合起來是多少？', ans: '6321', explain: '13 個百是 1300，5000 + 1300 + 20 + 1 = 6321。' },
      { type: 'fill', q: '40 張 100 元鈔票合起來共有多少元？', ans: '4000', unitLabel: '元', explain: '10 張 100 元是 1000 元，40 張 100 元就是 4000 元。' },
      { type: 'mc', q: '在四位數「7407」中，左邊千位的 7 表示多少？', options: ['7', '70', '700', '7000'], ans: '7000', explain: '千位的 7 代表 7 個千，也就是 7000；個位的 7 代表 7。' }
    ],
    // 卷3：隨堂練習單
    [
      { type: 'fill', q: '按照順序填填看：8002 → 8001 → ( ？ ) → 7999', ans: '8000', explain: '每次少 1，8001 減 1 是 8000。' },
      { type: 'fill', q: '7 個千、5 個十和 2 個一合起來是多少？（注意百位是 0 喔）', ans: '7052', explain: '千位 7、百位 0、十位 5、個位 2，合起來是 7052。' },
      { type: 'cmp', q: '比比看，請選擇 ＞、＜ 或 ＝：', left: '九千零五', right: '9005', ans: '=', explain: '九千零五記作 9005，兩數相等。' },
      { type: 'fill', q: '媽媽買一件大衣外套付了 2 張一千元、1 張一百元和 13 個十元，一共是多少元？', ans: '2230', unitLabel: '元', explain: '2000 + 100 + 130 = 2230 元。' },
      { type: 'mc', q: '在數線上，5 比 8 小，所以 5 的位置會在 8 的哪一邊？', options: ['左邊', '右邊', '一樣的位置'], ans: '左邊', explain: '數線上越左邊的數越小，越右邊的數越大。' }
    ],
    // 卷4：單元學後檢測卷
    [
      { type: 'fill', q: '小華家到圖書館的距離大約是「八千零一」公尺，用數字記作多少？', ans: '8001', unitLabel: '公尺', explain: '8 個千和 1 個一，中間百位和十位補 0，記作 8001。' },
      { type: 'fill', q: '5 個千、3 個百和 18 個一合起來是多少？', ans: '5318', explain: '5000 + 300 + 18 = 5318。' },
      { type: 'fill', q: '定位板上寫著「8 [？] 3 6」，如果這個四位數要最大，百位的 [？] 應該填什麼數字？', ans: '9', explain: '百位填入最大的數字 9 時，8936 會最大。' },
      { type: 'cmp', q: '比比看，請選擇 ＞、＜ 或 ＝：', left: '七千二百零七', right: '7270', ans: '<', explain: '七千二百零七是 7207，十位的 0 < 7，所以 7207 < 7270。' },
      { type: 'fill', q: '在每格為 1 的數線上，從數字 3 的位置往右移動 6 格，會停在哪一個數字？', ans: '9', explain: '往右移動是加：3 + 6 = 9。' }
    ],
    // 卷5：數學素養與資優挑戰卷
    [
      { type: 'fill', q: '【特好超市買東西】媽媽買了 610 元的東西，拿 1 張 1000 元大鈔，又多給店員 1 個 10 元硬幣（共付 1010 元），店員應該找回幾張 100 元紙鈔？', ans: '4', unitLabel: '張', explain: '1010 - 610 = 400 元，也就是 4 張 100 元紙鈔！' },
      { type: 'fill', q: '承上題，媽媽原本錢包有 2 張 1000 元和 3 個 10 元（共 2030 元），買完 610 元東西後還剩下多少元？', ans: '1420', unitLabel: '元', explain: '2030 - 610 = 1420 元。' },
      { type: 'mc', q: '動物園舉辦河馬餵食活動，入場券編號從 0001 到 4000，末三碼是「326」的可以參加，共有幾張中獎號碼？', options: ['2 張', '3 張', '4 張', '5 張'], ans: '4 張', explain: '分別是 0326、1326、2326、3326，共 4 張。' },
      { type: 'fill', q: '用 0、2、5、8 四張數字卡排出「最大的四位數」是多少？', ans: '8520', explain: '由大到小排列在高位：8520。' },
      { type: 'fill', q: '蝴蝶在數線上往右飛了 4 格後，停在 9 的位置，請問蝴蝶原本是從哪一個數字開始飛的？', ans: '5', explain: '9 - 4 = 5，從 5 往右飛 4 格會到 9。' }
    ]
  ],

  // ================= 第 2 單元：四位數的加減 =================
  2: [
    // 卷1：學前檢測卷
    [
      { type: 'fill', q: '算算看：358 ＋ 427 ＝ ( ？ )', ans: '785', explain: '個位 8+7=15 進 1，十位 1+5+2=8，百位 3+4=7，答案是 785。' },
      { type: 'fill', q: '算算看：543 － 76 ＝ ( ？ )', ans: '467', explain: '543 減 76 連續退位後等於 467。' },
      { type: 'mc', q: '293 最接近下面哪一個整百的數？', options: ['200', '300', '400'], ans: '300', explain: '293 在 200 和 300 之間，距離 300 只有 7，最接近 300。' },
      { type: 'fill', q: '小思買了一本 185 元的記事本和一枝 65 元的自動鉛筆，共花了多少元？', ans: '250', unitLabel: '元', explain: '185 + 65 = 250 元。' },
      { type: 'fill', q: '承上題，小思帶了 500 元，買完這兩樣東西後還剩下多少元？', ans: '250', unitLabel: '元', explain: '500 - 250 = 250 元。' }
    ],
    // 卷2：基礎能力練習卷
    [
      { type: 'fill', q: '直式算算看：635 ＋ 874 ＝ ( ？ )', ans: '1509', explain: '635 + 874 = 1509。' },
      { type: 'fill', q: '直式算算看：2365 ＋ 745 ＝ ( ？ )', ans: '3110', explain: '2365 + 745 = 3110。' },
      { type: 'fill', q: '直式算算看：610 － 356 ＝ ( ？ )', ans: '254', explain: '610 - 356 = 254。' },
      { type: 'fill', q: '直式算算看：900 － 342 ＝ ( ？ )', ans: '558', explain: '900 跨零退位減 342 等於 558。' },
      { type: 'fill', q: '直式算算看：7023 － 4209 ＝ ( ？ )', ans: '2814', explain: '7023 - 4209 = 2814。' }
    ],
    // 卷3：隨堂練習單
    [
      { type: 'fill', q: '直式算算看：2593 ＋ 4736 ＝ ( ？ )', ans: '7329', explain: '2593 + 4736 = 7329。' },
      { type: 'fill', q: '直式算算看：5000 － 2488 ＝ ( ？ )', ans: '2512', explain: '5000 連續退位減 2488 等於 2512。' },
      { type: 'mc', q: '一顆足球 405 元、一隻棒球手套 696 元，兩樣合起來大約是多少元？', options: ['1000 元', '1100 元', '1200 元'], ans: '1100 元', explain: '405 大約 400，696 大約 700，400 + 700 = 1100 元。' },
      { type: 'fill', q: '安樂社區有 2608 個人，其中女生有 1348 個人，男生有多少個人？', ans: '1260', unitLabel: '人', explain: '2608 - 1348 = 1260 人。' },
      { type: 'fill', q: '牙膏工廠昨天生產了 6000 條牙膏，今天比昨天少生產 1012 條，今天生產了幾條牙膏？', ans: '4988', unitLabel: '條', explain: '6000 - 1012 = 4988 條。' }
    ],
    // 卷4：單元學後檢測卷
    [
      { type: 'fill', q: '直式算算看：85 ＋ 5936 ＝ ( ？ )', ans: '6021', explain: '注意位值對齊：85 + 5936 = 6021。' },
      { type: 'mc', q: '估估看，「4992 － 2015」的答案最接近哪一個數？', options: ['1000', '2000', '3000'], ans: '3000', explain: '4992 大約是 5000，2015 大約是 2000，5000 - 2000 = 3000。' },
      { type: 'fill', q: '一架遙控飛機 2689 元，一輛遙控汽車 1453 元，爸爸各買一個一共要付多少元？', ans: '4142', unitLabel: '元', explain: '2689 + 1453 = 4142 元。' },
      { type: 'fill', q: '雲凱有 5000 元，他買了一架 2689 元的遙控飛機後，還剩下多少元？', ans: '2311', unitLabel: '元', explain: '5000 - 2689 = 2311 元。' },
      { type: 'fill', q: '一個洋娃娃 599 元，媽媽買 2 個洋娃娃，一共要付多少元？', ans: '1198', unitLabel: '元', explain: '599 + 599 = 1198 元。' }
    ],
    // 卷5：數學素養與資優挑戰卷
    [
      { type: 'fill', q: '【城市旅遊】文化園區昨天參觀人數 1227 人，今天參觀人數 878 人，兩天共有幾人參觀？', ans: '2105', unitLabel: '人', explain: '1227 + 878 = 2105 人。' },
      { type: 'fill', q: '【熱量估算】小思一天需攝取約 1600 大卡，早餐吃了約 400 大卡，午餐吃了 613 大卡（約 600 大卡），晚餐大約還要吃幾百大卡？', ans: '600', unitLabel: '大卡', explain: '1600 - (400 + 600) = 600 大卡。' },
      { type: 'mc', q: '【算式合理性檢驗】小明算「2903 ＋ 1110 ＝ 3013」，用估算檢查看看他算得對不對？', options: ['對，答案很接近 3000', '不對！2903約3000，1110約1000，加起來應該約4000'], ans: '不對！2903約3000，1110約1000，加起來應該約4000', explain: '2903 + 1110 正確答案是 4013，小明忘了千位進位。' },
      { type: 'fill', q: '哥哥買一雙籃球鞋，用了 800 元的禮券後，還要再付 1475 元，這雙籃球鞋原價是多少元？', ans: '2275', unitLabel: '元', explain: '800 + 1475 = 2275 元。' },
      { type: 'fill', q: '用 1、4、7、9 四張卡片排出的「最大四位數」減去「最小四位數」，相差多少？（9741 － 1479）', ans: '8262', explain: '9741 - 1479 = 8262。' }
    ]
  ],

  // ================= 第 3 單元：毫米 (mm) =================
  3: [
    // 卷1：學前檢測卷
    [
      { type: 'fill', q: '直尺上的 1 公分平分成 10 小格，每一小格的長度是幾毫米 (mm)？', ans: '1', unitLabel: '毫米', explain: '尺上 1 小格是 1 毫米，1 公分 = 10 毫米。' },
      { type: 'fill', q: '1 公分 ＝ ( ？ ) 毫米', ans: '10', unitLabel: '毫米', explain: '10 小格是 10 毫米，和 1 公分一樣長。' },
      { type: 'fill', q: '40 毫米 ＝ ( ？ ) 公分', ans: '4', unitLabel: '公分', explain: '10 毫米是 1 公分，40 毫米就是 4 公分。' },
      { type: 'mc', q: '一本數學課本的厚度大約是多少？', options: ['8 毫米', '8 公分', '8 公尺'], ans: '8 毫米', explain: '課本厚度不到 1 公分，大約是 8 毫米。' },
      { type: 'cmp', q: '比比看，請選擇 ＞、＜ 或 ＝：', left: '25 毫米', right: '30 毫米', ans: '<', explain: '25 毫米小於 30 毫米。' }
    ],
    // 卷2：基礎能力練習卷
    [
      { type: 'fill', q: '5 公分 3 毫米 ＝ ( ？ ) 毫米', ans: '53', unitLabel: '毫米', explain: '5 公分是 50 毫米，50 + 3 = 53 毫米。' },
      { type: 'fill', q: '9 公分 1 毫米 ＝ ( ？ ) 毫米', ans: '91', unitLabel: '毫米', explain: '9 公分是 90 毫米，90 + 1 = 91 毫米。' },
      { type: 'fill', q: '87 毫米 ＝ 8 公分 ( ？ ) 毫米', ans: '7', unitLabel: '毫米', explain: '80 毫米是 8 公分，還剩下 7 毫米。' },
      { type: 'cmp', q: '比比看，請選擇 ＞、＜ 或 ＝：', left: '8 公分 8 毫米', right: '88 毫米', ans: '=', explain: '8 公分 8 毫米換算後就是 88 毫米。' },
      { type: 'cmp', q: '比比看，請選擇 ＞、＜ 或 ＝：', left: '15 公分', right: '134 毫米', ans: '>', explain: '15 公分 = 150 毫米，150 毫米 > 134 毫米。' }
    ],
    // 卷3：隨堂練習單
    [
      { type: 'mc', q: '選出合理的長度單位：小朋友「食指的長度」大約是 52 ( ？ )', options: ['毫米', '公分', '公尺'], ans: '毫米', explain: '52 毫米 = 5 公分 2 毫米，符合食指長度。' },
      { type: 'mc', q: '選出合理的長度單位：一顆「花生米的長度」大約是 1 ( ？ )', options: ['毫米', '公分', '公尺'], ans: '公分', explain: '一顆花生米約 1 公分（10 毫米）。' },
      { type: 'fill', q: '算算看：32 毫米 ＋ 63 毫米 ＝ ( ？ ) 毫米', ans: '95', unitLabel: '毫米', explain: '32 + 63 = 95 毫米（也就是 9 公分 5 毫米）。' },
      { type: 'fill', q: '藍繩長 12 公分 8 毫米，紅繩長 130 毫米，兩條繩子相差幾毫米？', ans: '2', unitLabel: '毫米', explain: '12 公分 8 毫米 = 128 毫米，130 - 128 = 2 毫米。' },
      { type: 'fill', q: '甲蠶寶寶身長 56 毫米，乙蠶寶寶身長 4 公分 9 毫米，兩隻蠶寶寶相差幾毫米？', ans: '7', unitLabel: '毫米', explain: '4 公分 9 毫米 = 49 毫米，56 - 49 = 7 毫米。' }
    ],
    // 卷4：單元學後檢測卷
    [
      { type: 'cmp', q: '比比看，請選擇 ＞、＜ 或 ＝：', left: '6 公分 9 毫米', right: '7 公分', ans: '<', explain: '6 公分 9 毫米 = 69 毫米，7 公分 = 70 毫米，69 < 70。' },
      { type: 'fill', q: '甲緞帶長 9 毫米，乙緞帶長 5 公分 2 毫米（52 毫米），兩條緞帶相差幾毫米？', ans: '43', unitLabel: '毫米', explain: '52 毫米 - 9 毫米 = 43 毫米（4 公分 3 毫米）。' },
      { type: 'fill', q: '元樂的綠豆苗高 11 公分 9 毫米，佩珍的綠豆苗高 10 公分 5 毫米，元樂的綠豆苗比佩珍的高多少毫米？', ans: '14', unitLabel: '毫米', explain: '11 公分 9 毫米 - 10 公分 5 毫米 = 1 公分 4 毫米 = 14 毫米。' },
      { type: 'fill', q: '哥哥的橡皮擦長 45 毫米，奕晴的橡皮擦比哥哥的長 16 毫米，奕晴的橡皮擦長幾毫米？', ans: '61', unitLabel: '毫米', explain: '45 + 16 = 61 毫米（6 公分 1 毫米）。' },
      { type: 'fill', q: '黃繩子長 63 毫米，綠繩子比黃繩子短 3 公分 6 毫米（36 毫米），綠繩子長幾毫米？', ans: '27', unitLabel: '毫米', explain: '63 - 36 = 27 毫米（2 公分 7 毫米）。' }
    ],
    // 卷5：數學素養與資優挑戰卷
    [
      { type: 'mc', q: '【環保筷選盒子】彥辰有一雙長 20 公分 3 毫米的環保筷，要選哪一個盒子才裝得下？', options: ['ㄅ盒子（長 189 毫米）', 'ㄆ盒子（長 22 公分 5 毫米）'], ans: 'ㄆ盒子（長 22 公分 5 毫米）', explain: '189 毫米 = 18 公分 9 毫米（太短）；22 公分 5 毫米 > 20 公分 3 毫米，才裝得下！' },
      { type: 'mc', q: '【課本動動腦】把兩條各長 5 公分 5 毫米的紙帶，中間重疊黏貼起來，黏好後的總長會如何？', options: ['比 11 公分長', '剛好 11 公分', '比 11 公分短'], ans: '比 11 公分短', explain: '頭尾接排是 11 公分，但中間有重疊黏貼的地方，所以總長會比 11 公分短！' },
      { type: 'fill', q: '承上題，如果兩條 55 毫米的紙帶，中間重疊黏貼了 8 毫米，黏起來後的總長是幾毫米？', ans: '102', unitLabel: '毫米', explain: '55 + 55 - 8 = 102 毫米（10 公分 2 毫米）。' },
      { type: 'fill', q: '一本百科全書厚 3 公分 8 毫米，2 本相同的百科全書疊在一起，共厚幾毫米？', ans: '76', unitLabel: '毫米', explain: '38 毫米 + 38 毫米 = 76 毫米（7 公分 6 毫米）。' },
      { type: 'fill', q: '在直尺上從刻度「2 公分 4 毫米」畫一條直線到刻度「8 公分 1 毫米」，這條線長幾毫米？', ans: '57', unitLabel: '毫米', explain: '81 毫米 - 24 毫米 = 57 毫米（5 公分 7 毫米）。' }
    ]
  ],

  // ================= 第 4 單元：乘 法 =================
  4: [
    // 卷1：學前檢測卷
    [
      { type: 'fill', q: '一顆茶葉蛋 8 元，買了 4 顆要多少元？', ans: '32', unitLabel: '元', explain: '8 × 4 = 32 元。' },
      { type: 'fill', q: '玩一次彈珠臺要 20 元，品睿玩了 3 次，共花了多少元？', ans: '60', unitLabel: '元', explain: '20 × 3 = 60 元。' },
      { type: 'fill', q: '算算看：40 × 5 ＝ ( ？ )', ans: '200', explain: '4 個十乘以 5 是 20 個十，也就是 200。' },
      { type: 'fill', q: '算算看：300 × 3 ＝ ( ？ )', ans: '900', explain: '3 個百乘以 3 是 9 個百，也就是 900。' },
      { type: 'fill', q: '演藝廳一場可容納 400 人，舉辦 5 場音樂會，最多可以有幾個人來看表演？', ans: '2000', unitLabel: '人', explain: '400 × 5 = 2000 人。' }
    ],
    // 卷2：基礎能力練習卷
    [
      { type: 'fill', q: '直式算算看：86 × 5 ＝ ( ？ )', ans: '430', explain: '86 × 5 = 430。' },
      { type: 'fill', q: '直式算算看：32 × 9 ＝ ( ？ )', ans: '288', explain: '32 × 9 = 288。' },
      { type: 'fill', q: '直式算算看：120 × 3 ＝ ( ？ )', ans: '360', explain: '120 × 3 = 360。' },
      { type: 'fill', q: '直式算算看：706 × 6 ＝ ( ？ )', ans: '4236', explain: '個位 6×6=36 進 3，十位 0×6+3=3，百位 7×6=42，得 4236。' },
      { type: 'fill', q: '直式算算看：295 × 6 ＝ ( ？ )', ans: '1770', explain: '295 × 6 = 1770。' }
    ],
    // 卷3：隨堂練習單
    [
      { type: 'fill', q: '直式算算看：69 × 8 ＝ ( ？ )', ans: '552', explain: '69 × 8 = 552。' },
      { type: 'fill', q: '直式算算看：808 × 7 ＝ ( ？ )', ans: '5656', explain: '808 × 7 = 5656。' },
      { type: 'mc', q: '估估看，「72 × 9」的答案最接近下面哪一個數？', options: ['180', '540', '630', '720'], ans: '630', explain: '72 最接近 70，70 × 9 = 630。' },
      { type: 'fill', q: '小櫻每天存 885 元，一個星期（7 天）可以存多少元？', ans: '6195', unitLabel: '元', explain: '885 × 7 = 6195 元。' },
      { type: 'fill', q: '妹妹今年 4 歲，姐姐的年齡是妹妹的 3 倍，媽媽的年齡是姐姐的 3 倍，媽媽今年幾歲？', ans: '36', unitLabel: '歲', explain: '4 × 3 = 12（姐姐），12 × 3 = 36 歲（媽媽）。' }
    ],
    // 卷4：單元學後檢測卷
    [
      { type: 'fill', q: '一盒蘋果有 8 個，一箱有 6 盒，訂購 4 箱一共有多少個蘋果？', ans: '192', unitLabel: '個', explain: '8 × 6 = 48，48 × 4 = 192 個。' },
      { type: 'fill', q: '弟弟有 75 元，哥哥的錢是弟弟的 3 倍，姐姐的錢是哥哥的 2 倍，姐姐有多少元？', ans: '450', unitLabel: '元', explain: '75 × 3 = 225，225 × 2 = 450 元。' },
      { type: 'mc', q: '估估看，「291 × 6」大約是多少？', options: ['1200', '1600', '1800'], ans: '1800', explain: '291 大約是 300，300 × 6 = 1800。' },
      { type: 'fill', q: '哥哥每天存 231 元，一星期（7 天）可以存多少元？', ans: '1617', unitLabel: '元', explain: '231 × 7 = 1617 元。' },
      { type: 'fill', q: '一本雜誌賣 199 元，媽媽一次買了 9 本，共要付多少元？', ans: '1791', unitLabel: '元', explain: '199 × 9 = 1791 元。' }
    ],
    // 卷5：數學素養與資優挑戰卷
    [
      { type: 'fill', q: '一臺削鉛筆機賣 178 元，一組有 4 臺，圖書館買了 3 組，共要付幾元？', ans: '2136', unitLabel: '元', explain: '178 × 4 = 712，712 × 3 = 2136 元。' },
      { type: 'mc', q: '【洗衣精划算比一比】一罐桶裝洗衣精賣 500 元，一包補充包賣 198 元。買 1 罐桶裝和買 3 包補充包，哪一種比較便宜？', options: ['買 1 罐桶裝（500 元）比較便宜', '買 3 包補充包比較便宜', '一樣便宜'], ans: '買 1 罐桶裝（500 元）比較便宜', explain: '198 大約是 200，買 3 包補充包大約要 600 元（實際 594 元），比 500 元貴！' },
      { type: 'fill', q: '【倍數動動腦】自動鉛筆是鉛筆的 4 倍貴，鉛筆盒又是自動鉛筆的 3 倍貴，請問鉛筆盒是鉛筆的幾倍貴？', ans: '12', unitLabel: '倍', explain: '4 × 3 = 12 倍。' },
      { type: 'fill', q: '王叔叔在田裡插秧，一排插 205 株，插了 8 排，共插了多少株秧苗？', ans: '1640', unitLabel: '株', explain: '205 × 8 = 1640 株。' },
      { type: 'mc', q: '姐姐帶了 150 元，想買 6 盒每盒 32 元的巧克力，請問錢夠不夠？', options: ['夠', '不夠（30×6=180 就已經超過 150 元了）'], ans: '不夠（30×6=180 就已經超過 150 元了）', explain: '32 × 6 = 192 元，150 元不夠買。' }
    ]
  ],

  // ================= 第 5 單元：角與形狀 =================
  5: [
    // 卷1：學前檢測卷
    [
      { type: 'tf', q: '角是由 1 個頂點和 2 條直線的邊所組成的。', ans: 'O', explain: '正確！角有 1 個尖尖的頂點和 2 條直線邊。' },
      { type: 'tf', q: '角的兩條邊畫得越長，這個角就會越大。', ans: 'X', explain: '錯！角的大小只跟兩邊「張開的程度」有關，與邊的長短無關。' },
      { type: 'mc', q: '把一把紙扇子漸漸打開時，扇子的角會有什麼變化？', options: ['角會漸漸變大', '角會漸漸變小', '角的大小不變'], ans: '角會漸漸變大', explain: '張開程度越大，角就越大。' },
      { type: 'mc', q: '比直角小的角稱為什麼角？', options: ['銳角', '直角', '鈍角'], ans: '銳角', explain: '比直角小的是銳角，比直角大的是鈍角。' },
      { type: 'fill', q: '一個正方形一共有幾個直角？', ans: '4', unitLabel: '個', explain: '正方形和長方形都有 4 個直角。' }
    ],
    // 卷2：基礎能力練習卷
    [
      { type: 'tf', q: '角的開口方向朝左或朝右，會影響角的大小。', ans: 'X', explain: '錯！開口方向改變，張開角度不變，角還是一樣大。' },
      { type: 'mc', q: '一個三角板上有 3 個角，其中有幾個直角、幾個銳角？', options: ['1 個直角、2 個銳角', '2 個直角、1 個銳角', '1 個直角、2 個鈍角'], ans: '1 個直角、2 個銳角', explain: '每個直角三角板都有 1 個直角和 2 個銳角。' },
      { type: 'tf', q: '正方形的 4 條邊一樣長，而且 4 個角都是直角。', ans: 'O', explain: '正確！這是正方形的定義特徵。' },
      { type: 'tf', q: '長方形的上下兩條邊一樣長，左右兩條邊不一樣長。', ans: 'X', explain: '錯！長方形的上下對邊一樣長，左右對邊也一樣長！' },
      { type: 'mc', q: '比直角大的角稱為什麼角？', options: ['銳角', '直角', '鈍角'], ans: '鈍角', explain: '比 90° 直角張得更大的角稱為鈍角。' }
    ],
    // 卷3：隨堂練習單
    [
      { type: 'tf', q: '時鐘在「4 點整」的時候，分針與時針所夾的角是銳角。', ans: 'X', explain: '錯！3 點整是直角，4 點整張開比 3 點整更大，所以是鈍角！' },
      { type: 'mc', q: '時鐘在「3 點整」或「9 點整」的時候，時針與分針夾成什麼角？', options: ['銳角', '直角', '鈍角'], ans: '直角', explain: '3 點整與 9 點整時針分針垂直，是標準的直角。' },
      { type: 'mc', q: '用兩枝鉛筆做角，固定乙鉛筆不動，把甲鉛筆往外拉開，角會怎麼變？', options: ['變大', '變小', '不變'], ans: '變大', explain: '往外張開會使角變大。' },
      { type: 'fill', q: '一個長方形的長邊是 5 公分、短邊是 3 公分，它的對邊（另一條長邊）是幾公分？', ans: '5', unitLabel: '公分', explain: '長方形上下對邊等長，所以另一條長邊也是 5 公分。' },
      { type: 'mc', q: '如果手邊沒有三角板，怎樣用一張不規則的紙摺出一個直角？', options: ['隨便對摺 1 次', '先摺出一條直線邊，再把直線邊對齊疊合對摺 1 次'], ans: '先摺出一條直線邊，再把直線邊對齊疊合對摺 1 次', explain: '對摺兩次且將第一道摺線對齊，就能摺出精準的直角！' }
    ],
    // 卷4：單元學後檢測卷
    [
      { type: 'tf', q: '角是由 1 個頂點和 1 條邊所組成的。', ans: 'X', explain: '錯！角需要 1 個頂點和 2 條直線邊。' },
      { type: 'mc', q: '妮妮說：「∠2 的邊長比 ∠1 長，所以 ∠2 一定比較大。」請問妮妮說得對嗎？', options: ['對', '不對，要把兩個角的頂點和一邊疊合比張開程度才知道'], ans: '不對，要把兩個角的頂點和一邊疊合比張開程度才知道', explain: '邊的長短不影響角的大小。' },
      { type: 'mc', q: '如果接在一起的兩條線是彎彎的曲線，這樣算是角嗎？', options: ['算', '不算，角的兩條邊都必須是直線'], ans: '不算，角的兩條邊都必須是直線', explain: '角的兩邊必須是直線段。' },
      { type: 'fill', q: '一個正方形的其中一條邊長是 4 公分，請問它另外三條邊的長度各是幾公分？', ans: '4', unitLabel: '公分', explain: '正方形 4 條邊都等長，都是 4 公分。' },
      { type: 'mc', q: '平行四邊形（斜斜的四邊形）雖然對邊一樣長，但它是不是長方形？為什麼？', options: ['是長方形', '不是長方形，因為它的 4 個角不是直角'], ans: '不是長方形，因為它的 4 個角不是直角', explain: '長方形除了對邊等長，4 個角還必須都是直角。' }
    ],
    // 卷5：數學素養與資優挑戰卷
    [
      { type: 'mc', q: '【北歐尖頂屋】北歐常下雪，藍屋頂的頂角是 ∠1（較寬），紅屋頂的頂角是 ∠2（較尖），哪一個角比較大？', options: ['∠1 比較大（∠1 ＞ ∠2）', '∠2 比較大（∠2 ＞ ∠1）'], ans: '∠1 比較大（∠1 ＞ ∠2）', explain: '疊合後可看出藍屋頂張開程度較大，所以 ∠1 ＞ ∠2。' },
      { type: 'mc', q: '【課本動動腦】一個四邊形的 4 條邊都是 5 公分，它「一定」是正方形嗎？', options: ['一定是正方形', '不一定！如果 4 個角不是直角（例如菱形），就不是正方形'], ans: '不一定！如果 4 個角不是直角（例如菱形），就不是正方形', explain: '必須同時滿足「4 條邊等長」且「4 個角都是直角」才是正方形！' },
      { type: 'fill', q: '把一張長 8 公分、寬 5 公分的長方形色紙，剪下一個最大的正方形，這個正方形的邊長會是幾公分？', ans: '5', unitLabel: '公分', explain: '受限於短邊寬度 5 公分，剪下最大的正方形邊長為 5 公分。' },
      { type: 'fill', q: '兩個完全一樣大的正方形並排拼成一個長方形，這個新長方形有幾個直角？', ans: '4', unitLabel: '個', explain: '拼成一個大長方形後，外圍依然是 4 個直角。' },
      { type: 'mc', q: '把一個直角和一個銳角比大小，哪一個比較大？', options: ['直角比較大', '銳角比較大', '一樣大'], ans: '直角比較大', explain: '鈍角 ＞ 直角 ＞ 銳角。' }
    ]
  ],

  // ================= 第 6 單元：面 積 =================
  6: [
    // 卷1：學前檢測卷
    [
      { type: 'fill', q: '邊長 1 公分的正方形，它的面積是幾平方公分？', ans: '1', unitLabel: '平方公分', explain: '邊長 1 公分的正方形面積定義為 1 平方公分 (1 cm²)。' },
      { type: 'mc', q: '「1 平方公分」用英文符號怎麼記？', options: ['1 cm', '1 cm²', '1 mm'], ans: '1 cm²', explain: 'cm² 代表平方公分。' },
      { type: 'fill', q: '一張小卡片剛好可以用 15 個白色方瓦（每個 1 平方公分）排滿，這張小卡片的面積是幾平方公分？', ans: '15', unitLabel: '平方公分', explain: '15 個 1 平方公分合起來是 15 平方公分。' },
      { type: 'fill', q: '在方格紙上，2 個「半格」可以合成幾個「整格」？', ans: '1', unitLabel: '個', explain: '2 個半格剛好拼成 1 個完整的 1 平方公分整格。' },
      { type: 'mc', q: '把一張面積 16 平方公分的正方形色紙剪成 2 片三角形，再拼成一個大三角形，面積會變多少？', options: ['變大', '變小', '一樣是 16 平方公分'], ans: '一樣是 16 平方公分', explain: '面積保留概念：圖形切割重組後，總面積不變！' }
    ],
    // 卷2：基礎能力練習卷
    [
      { type: 'fill', q: '一個圖形在平方公分板上占了 8 個整格和 4 個半格，它的面積是多少平方公分？', ans: '10', unitLabel: '平方公分', explain: '4 個半格 = 2 個整格，8 + 2 = 10 平方公分。' },
      { type: 'fill', q: '卡片 A 在平方公分板上，橫的一排有 6 格，全部有 9 排，面積是多少 cm²？', ans: '54', unitLabel: 'cm²', explain: '6 × 9 = 54 平方公分。' },
      { type: 'fill', q: '卡片 B 在平方公分板上，橫的一排有 8 格，全部有 4 排，面積是多少 cm²？', ans: '32', unitLabel: 'cm²', explain: '8 × 4 = 32 平方公分。' },
      { type: 'mc', q: '估估看，小朋友的一片「大拇指指甲」面積大約是多少？', options: ['1 平方公分', '10 平方公分', '100 平方公分'], ans: '1 平方公分', explain: '大拇指指甲寬約 1 公分，面積大約是 1 平方公分。' },
      { type: 'mc', q: '估估看，一張「學生證 / 健保卡」的面積大約是多少平方公分？', options: ['5 平方公分', '50 平方公分', '550 平方公分'], ans: '50 平方公分', explain: '學生證與健保卡約 8.5cm × 5.4cm，面積約 50 平方公分。' }
    ],
    // 卷3：隨堂練習單
    [
      { type: 'fill', q: '甲圖形是 11 平方公分，乙圖形是 8 平方公分，丙圖形是 6 平方公分，丁圖形是 11 平方公分。甲和丁都是幾平方公分？', ans: '11', unitLabel: '平方公分', explain: '甲和丁面積一樣大，都是 11 平方公分。' },
      { type: 'mc', q: '估估看，一張「高鐵車票」的面積大約是多少平方公分？', options: ['45 平方公分', '450 平方公分'], ans: '45 平方公分', explain: '高鐵車票與名片、健保卡大小相近，約 45 平方公分。' },
      { type: 'mc', q: '估估看，「數學課本封面」的面積大約是多少平方公分？', options: ['55 平方公分', '550 平方公分'], ans: '550 平方公分', explain: '數學課本約 26cm × 21cm，面積約 550 平方公分。' },
      { type: 'fill', q: '方格點上，每 4 個相鄰點圍成的小正方形是 1 cm²。圖形乙是 8 cm²，圖形甲是 6 cm²，乙比甲大幾 cm²？', ans: '2', unitLabel: 'cm²', explain: '8 - 6 = 2 平方公分。' },
      { type: 'fill', q: '一個三角形在方格紙上占了 3 個整格和 6 個半格，面積是幾平方公分？', ans: '6', unitLabel: '平方公分', explain: '6 個半格湊成 3 個整格，3 + 3 = 6 平方公分。' }
    ],
    // 卷4：單元學後檢測卷
    [
      { type: 'fill', q: '檢測卷圖形中，甲的面積是 4 平方公分，庚的面積是 13 平方公分，甲的面積比庚小幾平方公分？', ans: '9', unitLabel: '平方公分', explain: '13 - 4 = 9 平方公分。' },
      { type: 'fill', q: '檢測卷中，甲=4 cm²、乙=13 cm²、丁=7 cm²、戊=8 cm²、己=16 cm²，請問最大的「己」是幾平方公分？', ans: '16', unitLabel: '平方公分', explain: '16 > 13 > 8 > 7 > 4，己最大是 16 平方公分。' },
      { type: 'fill', q: '一個邊長 4 公分的正方形，用平方公分板量，共有幾格 1 平方公分？', ans: '16', unitLabel: '平方公分', explain: '一排 4 格，共 4 排：4 × 4 = 16 平方公分。' },
      { type: 'fill', q: '10 個「半格」合起來是多少平方公分？', ans: '5', unitLabel: '平方公分', explain: '每 2 個半格合成 1 平方公分，10 ÷ 2 = 5 平方公分。' },
      { type: 'mc', q: '面積都是 12 平方公分的長方形和三角形，誰比較大？', options: ['長方形比較大', '三角形比較大', '一樣大（都是 12 平方公分）'], ans: '一樣大（都是 12 平方公分）', explain: '形狀不同但面積數值相同時，面積一樣大。' }
    ],
    // 卷5：數學素養與資優挑戰卷
    [
      { type: 'mc', q: '【雲朵圖案平方公分板估測】一個圓弧圖案內部有「4×3＝12」個完整方格，外圍被「6×5＝30」個方格包住，這個圖案的面積範圍為何？', options: ['比 12 平方公分小', '比 12 平方公分大，且比 30 平方公分小', '比 30 平方公分大'], ans: '比 12 平方公分大，且比 30 平方公分小', explain: '圖案包含 12 個完整格還有邊緣部分，故大於 12 cm²；又完全在 30 格長方形內，故小於 30 cm²。' },
      { type: 'mc', q: '【樹葉面積動動腦】一片樹葉在平方公分板上，完整的方格有 6 格，不完整的邊緣方格有 14 格（共占 20 格），下面哪一個最可能是樹葉面積？', options: ['4 平方公分', '13 平方公分', '25 平方公分'], ans: '13 平方公分', explain: '樹葉面積一定大於 6 cm² 且小於 20 cm²，因此 13 平方公分最合理！' },
      { type: 'fill', q: '把一張長 7 公分、寬 4 公分的長方形卡片蓋上平方公分板，面積是多少平方公分？', ans: '28', unitLabel: '平方公分', explain: '一排 7 格、共 4 排：7 × 4 = 28 平方公分。' },
      { type: 'fill', q: '美式餐廳牆上有三張海報：A 海報占 24 格、B 海報占 28 格、C 海報占 25 格，最大的海報和最小的海報相差幾格？', ans: '4', unitLabel: '格', explain: '28 - 24 = 4 格。' },
      { type: 'fill', q: '用 2 個面積各是 9 平方公分的正方形拼成一個長方形（不重疊），面積會是多少平方公分？', ans: '18', unitLabel: '平方公分', explain: '9 + 9 = 18 平方公分。' }
    ]
  ],

  // ================= 第 7 單元：除 法 =================
  7: [
    // 卷1：學前檢測卷
    [
      { type: 'fill', q: '萬聖節有 12 個蛋糕，每 3 個裝一盤，最多可以裝成幾盤？（12 ÷ 3）', ans: '4', unitLabel: '盤', explain: '12 ÷ 3 = 4 盤。' },
      { type: 'fill', q: '把 15 片餅乾平分給 5 個小朋友，一個小朋友可以分到幾片餅乾？（15 ÷ 5）', ans: '3', unitLabel: '片', explain: '15 ÷ 5 = 3 片。' },
      { type: 'mc', q: '在算式「13 ÷ 3 ＝ 4 … 1」中，數字「1」稱為什麼？', options: ['被除數', '除數', '商', '餘數'], ans: '餘數', explain: '13 是被除數，3 是除數，4 是商，1 是餘數。' },
      { type: 'fill', q: '長 24 公分的彩帶，每 6 公分剪成 1 段，可以剪成幾段？', ans: '4', unitLabel: '段', explain: '24 ÷ 6 = 4 段。' },
      { type: 'tf', q: '當除法剛好分完、沒有剩下時，餘數是 0，我們稱為「整除」。', ans: 'O', explain: '正確！餘數為 0 稱為整除。' }
    ],
    // 卷2：基礎能力練習卷
    [
      { type: 'fill', q: '算算看：45 ÷ 6 ＝ 7 … ( ？ )，請問餘數是多少？', ans: '3', explain: '6 × 7 = 42，45 - 42 = 3。' },
      { type: 'fill', q: '算算看：50 ÷ 7 ＝ ( ？ ) … 1，請問商是多少？', ans: '7', explain: '7 × 7 = 49，50 - 49 = 1，商是 7。' },
      { type: 'fill', q: '算算看：37 ÷ 4 ＝ 9 … ( ？ )，請問餘數是多少？', ans: '1', explain: '4 × 9 = 36，37 - 36 = 1。' },
      { type: 'fill', q: '算算看：53 ÷ 8 ＝ ( ？ ) … 5，請問商是多少？', ans: '6', explain: '8 × 6 = 48，53 - 48 = 5，商是 6。' },
      { type: 'fill', q: '算算看：62 ÷ 7 ＝ 8 … ( ？ )，請問餘數是多少？', ans: '6', explain: '7 × 8 = 56，62 - 56 = 6。' }
    ],
    // 卷3：隨堂練習單
    [
      { type: 'mc', q: '在除法計算中，「餘數」和「除數」有什麼關係？', options: ['餘數一定要比除數小', '餘數可以比除數大', '餘數可以等於除數'], ans: '餘數一定要比除數小', explain: '如果餘數大於或等於除數，代表還可以繼續分！所以餘數一定比除數小。' },
      { type: 'fill', q: '當除數是 4 的時候，最大的餘數可能是多少？', ans: '3', explain: '比 4 小的整數有 0, 1, 2, 3，所以最大餘數是 3。' },
      { type: 'fill', q: '一盒小番茄有 29 顆，每個人分 6 顆，最多可以分給幾個人？（29 ÷ 6 ＝ 4 … 5）', ans: '4', unitLabel: '個人', explain: '29 ÷ 6 = 4 … 5，剩下的 5 顆不夠分給第 5 個人，所以最多分給 4 個人。' },
      { type: 'fill', q: '芬芬有 56 張色紙，每 8 張裝成一包，最多可以裝成幾包？', ans: '7', unitLabel: '包', explain: '56 ÷ 8 = 7 包。' },
      { type: 'fill', q: '有 35 顆巧克力，平分裝成 4 包，盡量分完，還剩下幾顆巧克力？', ans: '3', unitLabel: '顆', explain: '35 ÷ 4 = 8 … 3，每包 8 顆，還剩下 3 顆。' }
    ],
    // 卷4：單元學後檢測卷
    [
      { type: 'mc', q: '有一箱芒果，每 5 顆裝成一袋，盡量分完，最後「不可能」剩下幾顆芒果？', options: ['1 顆', '3 顆', '4 顆', '5 顆'], ans: '5 顆', explain: '除數是 5，餘數必須比 5 小（只能剩 1, 2, 3, 4 顆），若剩 5 顆又可以裝成 1 袋了！' },
      { type: 'mc', q: '有一些餅乾，平分給 7 個人，盡量分完，最多會剩下幾包餅乾？', options: ['6 包', '7 包', '9 包'], ans: '6 包', explain: '除數是 7，餘數一定要比 7 小，所以最多剩下 6 包！' },
      { type: 'fill', q: '媽媽煮了 12 顆湯圓，平分裝成 3 碗，每碗有幾顆湯圓？', ans: '4', unitLabel: '顆', explain: '12 ÷ 3 = 4 顆。' },
      { type: 'fill', q: '把 49 個蘋果，每 5 個裝成一袋，最多可以「裝滿」幾袋？', ans: '9', unitLabel: '袋', explain: '49 ÷ 5 = 9 … 4，剩下的 4 個不夠裝滿一袋，所以最多裝滿 9 袋。' },
      { type: 'fill', q: '一瓶汽水可以倒滿 6 杯，33 個小朋友一人喝 1 杯，最少要準備幾瓶汽水才夠？', ans: '6', unitLabel: '瓶', explain: '33 ÷ 6 = 5 … 3，剩下的 3 個小朋友也要開 1 瓶汽水，5 + 1 = 6 瓶！' }
    ],
    // 卷5：數學素養與資優挑戰卷
    [
      { type: 'fill', q: '【天鵝船應用】有 34 個小朋友要坐天鵝船，一艘天鵝船可以坐 4 個人，最少需要幾艘天鵝船才夠坐？', ans: '9', unitLabel: '艘', explain: '34 ÷ 4 = 8 … 2，剩下的 2 人也需要 1 艘船，8 + 1 = 9 艘。' },
      { type: 'fill', q: '【請吃布丁】老師請 46 個小朋友吃布丁，一人吃 1 個。一盒布丁有 6 個，老師最少要買幾盒才夠？', ans: '8', unitLabel: '盒', explain: '46 ÷ 6 = 7 … 4，7 盒只有 42 個，還要再買 1 盒：7 + 1 = 8 盒。' },
      { type: 'fill', q: '老師有 65 片餅乾要平分給 7 個小朋友，盡量分完，每個小朋友最多可以分到幾片餅乾？', ans: '9', unitLabel: '片', explain: '65 ÷ 7 = 9 … 2，剩下 2 片不夠分，每人最多分到 9 片（不用加 1）。' },
      { type: 'mc', q: '四十幾個蘋果平分給 8 位同學，盡量分完後，最多還剩下幾個蘋果？', options: ['5 個', '7 個', '8 個', '9 個'], ans: '7 個', explain: '平分給 8 位同學，除數是 8，餘數最大是 7。' },
      { type: 'fill', q: '某數除以 6，商是 8，餘數是 5，請問這個「某數（被除數）」是多少？', ans: '53', explain: '6 × 8 + 5 = 48 + 5 = 53。' }
    ]
  ],

  // ================= 第 8 單元：公升和毫升 =================
  8: [
    // 卷1：學前檢測卷
    [
      { type: 'fill', q: '1 公升 (L) ＝ ( ？ ) 毫升 (mL)', ans: '1000', unitLabel: '毫升', explain: '1 公升等於 1000 毫升。' },
      { type: 'fill', q: '2 公升的礦泉水可以倒滿幾個 1 公升的量杯？', ans: '2', unitLabel: '個', explain: '2 公升包含 2 個 1 公升。' },
      { type: 'fill', q: '100 毫升是幾個 1 毫升合起來的？', ans: '100', unitLabel: '個', explain: '100 個 1 毫升就是 100 毫升。' },
      { type: 'mc', q: '每次使用含氟漱口水漱口，大約需要多少容量？', options: ['10 毫升 (mL)', '10 公升 (L)', '1000 公升'], ans: '10 毫升 (mL)', explain: '漱口水每次約 10 毫升。' },
      { type: 'cmp', q: '比比看，請選擇 ＞、＜ 或 ＝：', left: '980 毫升', right: '1000 毫升', ans: '<', explain: '980 < 1000。' }
    ],
    // 卷2：基礎能力練習卷
    [
      { type: 'fill', q: '2084 毫升 ＝ 2 公升 ( ？ ) 毫升', ans: '84', unitLabel: '毫升', explain: '2000 毫升是 2 公升，還剩 84 毫升。' },
      { type: 'fill', q: '5005 毫升 ＝ 5 公升 ( ？ ) 毫升', ans: '5', unitLabel: '毫升', explain: '5000 毫升是 5 公升，剩下 5 毫升。' },
      { type: 'fill', q: '7 公升 60 毫升 ＝ ( ？ ) 毫升', ans: '7060', unitLabel: '毫升', explain: '7 公升 = 7000 毫升，7000 + 60 = 7060 毫升。' },
      { type: 'fill', q: '8 公升 ＝ ( ？ ) 毫升', ans: '8000', unitLabel: '毫升', explain: '8 × 1000 = 8000 毫升。' },
      { type: 'fill', q: '3000 毫升 ＝ ( ？ ) 公升', ans: '3', unitLabel: '公升', explain: '3000 毫升是 3 個 1000 毫升，也就是 3 公升。' }
    ],
    // 卷3：隨堂練習單
    [
      { type: 'cmp', q: '比比看，請選擇 ＞、＜ 或 ＝：', left: '3 公升', right: '2999 毫升', ans: '>', explain: '3 公升 = 3000 毫升 > 2999 毫升。' },
      { type: 'cmp', q: '比比看，請選擇 ＞、＜ 或 ＝：', left: '7 公升 560 毫升', right: '7560 毫升', ans: '=', explain: '7 公升 560 毫升 = 7560 毫升。' },
      { type: 'cmp', q: '比比看，請選擇 ＞、＜ 或 ＝：', left: '9 公升 80 毫升', right: '9800 毫升', ans: '<', explain: '9 公升 80 毫升是 9080 毫升 < 9800 毫升。' },
      { type: 'fill', q: '冰箱裡有 500 毫升的果汁，媽媽請客倒出了 350 毫升後，還剩下多少毫升？', ans: '150', unitLabel: '毫升', explain: '500 - 350 = 150 毫升。' },
      { type: 'fill', q: '兩瓶鮮乳，一瓶 375 毫升，另一瓶 290 毫升，兩瓶合起來是幾毫升？', ans: '665', unitLabel: '毫升', explain: '375 + 290 = 665 毫升。' }
    ],
    // 卷4：單元學後檢測卷
    [
      { type: 'fill', q: '4 公升 5 毫升 ＋ 1 公升 900 毫升 ＝ 5 公升 ( ？ ) 毫升', ans: '905', unitLabel: '毫升', explain: '公升 4+1=5 公升，毫升 5+900=905 毫升。' },
      { type: 'fill', q: '爸爸買了一瓶 1 公升 200 毫升的柳橙汁和一瓶 1 公升 350 毫升的烏梅汁，合起來共是幾毫升？', ans: '2550', unitLabel: '毫升', explain: '1200 + 1350 = 2550 毫升（2 公升 550 毫升）。' },
      { type: 'fill', q: '一瓶礦泉水有 2 公升 500 毫升，哥哥喝了 489 毫升，還剩下 2 公升 ( ？ ) 毫升？', ans: '11', unitLabel: '毫升', explain: '500 毫升 - 489 毫升 = 11 毫升，剩 2 公升 11 毫升。' },
      { type: 'fill', q: '有一個 3500 毫升的容器，已經裝了 2 公升 90 毫升（2090 毫升）的水，還差幾毫升就可以裝滿？', ans: '1410', unitLabel: '毫升', explain: '3500 - 2090 = 1410 毫升。' },
      { type: 'fill', q: '7 公升 650 毫升 － 1584 毫升 ＝ 6 公升 ( ？ ) 毫升', ans: '66', unitLabel: '毫升', explain: '7650 - 1584 = 6066 毫升 = 6 公升 66 毫升。' }
    ],
    // 卷5：數學素養與資優挑戰卷
    [
      { type: 'fill', q: '兩瓶沐浴乳，一瓶是 1250 毫升，另一瓶是 350 毫升，合起來共是幾毫升？', ans: '1600', unitLabel: '毫升', explain: '1250 + 350 = 1600 毫升（1 公升 600 毫升）。' },
      { type: 'fill', q: '桌上的鍋子容量是 1370 毫升，水壺容量是 1 公升 450 毫升，鍋子和水壺的容量相差多少毫升？', ans: '80', unitLabel: '毫升', explain: '1 公升 450 毫升 = 1450 毫升，1450 - 1370 = 80 毫升。' },
      { type: 'mc', q: '一個 1000mL 量杯，分成 10 大格，每一大格再平分成 2 小格，請問「1 小格」代表多少毫升？', options: ['10 毫升', '50 毫升', '100 毫升'], ans: '50 毫升', explain: '1000 ÷ 10 = 100（1 大格是 100mL），再平分 2 小格，1 小格是 50mL。' },
      { type: 'fill', q: '小保溫瓶裝 1 公升 480 毫升，大保溫瓶裝 2 公升 150 毫升，合起來共是多少毫升？', ans: '3630', unitLabel: '毫升', explain: '1480 + 2150 = 3630 毫升（3 公升 630 毫升）。' },
      { type: 'fill', q: '把 3 公升的果汁平分倒進 6 個一樣大的杯子裡，每個杯子有幾毫升的果汁？', ans: '500', unitLabel: '毫升', explain: '3 公升 = 3000 毫升，3000 ÷ 6 = 500 毫升。' }
    ]
  ],

  // ================= 第 9 單元：分 數 =================
  9: [
    // 卷1：學前檢測卷
    [
      { type: 'fill', q: '把一個圓形草莓蛋糕平分成 4 塊，其中的 1 塊是四分之幾個蛋糕？（請填分子數字）', ans: '1', explain: '平分成 4 塊，1 塊是 1/4 個蛋糕。' },
      { type: 'fill', q: '「七分之三」記成 3/7，請問它的「分子」是多少？', ans: '3', explain: '分數橫線上方是分子（3），下方是分母（7）。' },
      { type: 'fill', q: '承上題，「七分之三（3/7）」的「分母」是多少？', ans: '7', explain: '分母表示全部平分成的份數，是 7。' },
      { type: 'tf', q: '4/4 個蛋糕和「1 個」完整的蛋糕一樣大。', ans: 'O', explain: '正確！平分成 4 份再拿全部 4 份，就是 1 整塊完整蛋糕。' },
      { type: 'mc', q: '一個披薩平分成 8 片，品妍吃了 3 片，是吃了幾個披薩？', options: ['1/8 個', '3/8 個', '8/3 個'], ans: '3/8 個', explain: '3 片是 3 個 1/8，也就是 3/8 個披薩。' }
    ],
    // 卷2：基礎能力練習卷
    [
      { type: 'fill', q: '一個蜂蜜蛋糕平分成 12 塊，小俊想買 4/12 個蛋糕，是買了幾塊？', ans: '4', unitLabel: '塊', explain: '1 塊是 1/12 個，4/12 個就是 4 塊。' },
      { type: 'fill', q: '按照分數順序填填看：1/6 → 2/6 → ( ？/6 ) → 4/6（請填分子數字）', ans: '3', explain: '每次累加 1/6，2/6 下一個是 3/6。' },
      { type: 'cmp', q: '比一比，請選擇 ＞、＜ 或 ＝：', left: '6/7', right: '5/7', ans: '>', explain: '6 個 1/7 比 5 個 1/7 大，所以 6/7 > 5/7。' },
      { type: 'cmp', q: '比一比，請選擇 ＞、＜ 或 ＝：', left: '9/9', right: '1', ans: '=', explain: '9/9 和 1 一樣大。' },
      { type: 'cmp', q: '比一比，請選擇 ＞、＜ 或 ＝：', left: '3/11', right: '4 個 1/11', ans: '<', explain: '4 個 1/11 是 4/11，3/11 < 4/11。' }
    ],
    // 卷3：隨堂練習單
    [
      { type: 'fill', q: '一盒 10 個裝的果凍，小思吃了 3 個，是吃了十分之幾盒果凍？（請填分子數字）', ans: '3', explain: '10 個是 1 盒，3 個是 3/10 盒。' },
      { type: 'fill', q: '承上題，小達吃了 4/10 盒果凍，小思和小達吃完後，還剩下幾個果凍？', ans: '3', unitLabel: '個', explain: '10 - 3 - 4 = 3 個（也就是 3/10 盒）。' },
      { type: 'fill', q: '一條長 1 公尺的橘色緞帶平分成 10 等分，藍色緞帶和 7 等分的橘色緞帶一樣長，是十分之幾公尺？（填分子）', ans: '7', explain: '7 個 1/10 公尺是 7/10 公尺。' },
      { type: 'mc', q: '有 2 條一樣的壽司卷，思妤吃了 2/5 條，詠安吃了 4/5 條，誰吃的比較多？', options: ['思妤', '詠安', '一樣多'], ans: '詠安', explain: '4/5 > 2/5，所以詠安吃的比較多。' },
      { type: 'mc', q: '一盒檸檬塔有 9 個，宥廷吃了 5/9 盒，芯語吃了 3/9 盒，誰吃的比較少？', options: ['宥廷', '芯語', '一樣少'], ans: '芯語', explain: '3/9 盒（3 個）< 5/9 盒（5 個），所以芯語吃的比較少。' }
    ],
    // 卷4：單元學後檢測卷
    [
      { type: 'cmp', q: '比一比，請選擇 ＞、＜ 或 ＝：', left: '2/12', right: '十二分之五', ans: '<', explain: '十二分之五是 5/12，2/12 < 5/12。' },
      { type: 'mc', q: '一個披薩平分成 6 片，姐姐吃了 1/6 個，弟弟吃了 3 片（3/6 個），誰吃的披薩比較少？', options: ['姐姐', '弟弟', '一樣多'], ans: '姐姐', explain: '姐姐吃 1 片 (1/6)，弟弟吃 3 片 (3/6)，姐姐比較少。' },
      { type: 'mc', q: '一袋小餐包有 9 個，至芳吃了 2/9 袋，景弘吃了 4 個（4/9 袋），誰吃的小餐包比較多？', options: ['至芳', '景弘', '一樣多'], ans: '景弘', explain: '2/9 袋是 2 個，景弘吃了 4 個，所以景弘比較多。' },
      { type: 'mc', q: '有 2 條一樣大的蜂蜜蛋糕，小華吃 5/10 條，小萱吃 1 條，誰吃的比較多？', options: ['小華', '小萱', '一樣多'], ans: '小萱', explain: '1 條 = 10/10 條，10/10 > 5/10，所以小萱吃的比較多。' },
      { type: 'cmp', q: '比一比，兩盒一樣都是 12 顆裝的球：', left: '6/12 盒球', right: '8/12 盒球', ans: '<', explain: '6/12 < 8/12。' }
    ],
    // 卷5：數學素養與資優挑戰卷
    [
      { type: 'mc', q: '【切藍莓蛋糕迷思】小明把藍莓蛋糕切成 6 片（其中 2 大片各占 1/4，4 小片各占 1/8），小明吃了 1 小片，是多少個蛋糕？', options: ['1/6 個蛋糕', '1/8 個蛋糕（因為沒有平分成 6 片，平分後其實是 8 片）'], ans: '1/8 個蛋糕（因為沒有平分成 6 片，平分後其實是 8 片）', explain: '分數必須建立在「平分」前提下，把大片再對切平分後共 8 小片，所以 1 小片是 1/8 個！' },
      { type: 'mc', q: '【小泡芙盒動動腦】一盒小泡芙有 6 個，哥哥先拿走 1 個（1/6 盒），妹妹再拿走 1 個，請問妹妹拿走的是幾盒？', options: ['1/5 盒', '1/6 盒（因為「一盒」的整體基準仍然是 6 個）'], ans: '1/6 盒（因為「一盒」的整體基準仍然是 6 個）', explain: '「整體 1 盒」有 6 個泡芙不會改變，所以 1 個永遠是 1/6 盒！' },
      { type: 'mc', q: '【開心農場的菜園】農場主人把一塊長方形菜園分成 1 小塊（占 1/3）種小白菜、1 大塊（占 2/3）種高麗菜。小思說小白菜是 1/2 塊地，對嗎？', options: ['對，因為分成 2 塊', '不對！因為兩塊沒有一樣大，平分後小白菜其實占 1/3 塊地'], ans: '不對！因為兩塊沒有一樣大，平分後小白菜其實占 1/3 塊地', explain: '沒有平分就不能直接說 1/2，摺起來比對可發現是平分成 3 份中的 1 份（1/3）。' },
      { type: 'fill', q: '一盒餅乾有 10 片，品妍拿了 5 片，柏宇拿了 4/10 盒，請問兩個人一共拿了十分之幾盒餅乾？（填分子）', ans: '9', explain: '5 片是 5/10 盒，5/10 + 4/10 = 9/10 盒。' },
      { type: 'fill', q: '一條紙條平分成 11 份，塗色部分是 6/11 條，請問還要再塗幾份才會變成「1 整條」紙條？', ans: '5', unitLabel: '份', explain: '1 整條是 11/11，11 - 6 = 5 份。' }
    ]
  ]
};

function selectQuizUnit(u) {
  quizState.currentUnit = u;
  quizState.currentPaperIdx = 0;
  quizState.submitted = false;
  playTone(523.25, 0.08);
  renderQuizCenter();
}

function selectQuizPaper(pIdx) {
  quizState.currentPaperIdx = pIdx;
  quizState.submitted = false;
  playTone(587.33, 0.08);
  renderQuizCenter();
}

function saveStudentProfile() {
  const clsEl = document.getElementById('quizStudentClass');
  const seatEl = document.getElementById('quizStudentSeat');
  const nameEl = document.getElementById('quizStudentName');
  if (clsEl) {
    quizState.studentClass = clsEl.value.trim() || '三年一班';
    localStorage.setItem('kx_g3_class', quizState.studentClass);
  }
  if (seatEl) {
    quizState.studentSeat = seatEl.value.trim() || '1';
    localStorage.setItem('kx_g3_seat', quizState.studentSeat);
  }
  if (nameEl) {
    quizState.studentName = nameEl.value.trim();
    localStorage.setItem('kx_g3_name', quizState.studentName);
  }
}

function renderQuizCenter() {
  const container = document.getElementById('quizAppRoot');
  if (!container) return;

  const u = quizState.currentUnit;
  const pIdx = quizState.currentPaperIdx;
  const pInfo = paperTypes[pIdx];
  const questions = QUIZ_BANK[u][pIdx];

  // 1. 單元按鈕列 (1~9)
  let unitBtnsHtml = '';
  for (let i = 1; i <= 9; i++) {
    const active = i === u;
    unitBtnsHtml += `
      <button class="btn ${active ? 'btn-primary' : 'btn-outline'}" onclick="selectQuizUnit(${i})" style="font-size:0.88rem; padding:0.45rem 0.85rem;">
        第 ${i} 單元
      </button>
    `;
  }

  // 2. 該單元的 5 份測驗卷切換卡
  let paperTabsHtml = paperTypes.map((pt, idx) => {
    const active = idx === pIdx;
    // 查找是否已有最高分紀錄
    const bestRec = quizState.records
      .filter(r => r.unit === u && r.paperIdx === idx && (!quizState.studentName || r.name === quizState.studentName))
      .sort((a, b) => b.score - a.score)[0];
    return `
      <div onclick="selectQuizPaper(${idx})" style="
        cursor:pointer;
        padding:0.85rem;
        border-radius:14px;
        border:3px solid ${active ? pt.color : '#CBD5E1'};
        background:${active ? '#F8FAFC' : 'white'};
        box-shadow:${active ? `0 4px 0 ${pt.color}` : 'none'};
        transition:all 0.15s;
      ">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.25rem;">
          <span style="background:${pt.color}; color:white; font-size:0.75rem; font-weight:900; padding:2px 8px; border-radius:99px;">${pt.tag}</span>
          ${bestRec ? `<span style="font-size:0.8rem; font-weight:900; color:#059669;">🏆 ${bestRec.score}分</span>` : `<span style="font-size:0.75rem; color:#94A3B8;">未測驗</span>`}
        </div>
        <div style="font-weight:900; font-size:0.95rem; color:#1E293B;">${pt.name}</div>
      </div>
    `;
  }).join('');

  // 3. 題目列表
  let qListHtml = questions.map((item, qIdx) => {
    let inputHtml = '';
    if (item.type === 'mc') {
      inputHtml = `<div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(210px, 1fr)); gap:0.5rem; margin-top:0.65rem;">
        ${item.options.map((opt, oIdx) => `
          <label style="display:flex; align-items:center; gap:0.5rem; background:#F8FAFC; border:2px solid #CBD5E1; padding:0.6rem 0.9rem; border-radius:10px; cursor:pointer; font-weight:800;">
            <input type="radio" name="q_${qIdx}" value="${opt}" style="width:18px; height:18px;" />
            <span>(${oIdx + 1}) ${opt}</span>
          </label>
        `).join('')}
      </div>`;
    } else if (item.type === 'tf') {
      inputHtml = `<div style="display:flex; gap:1rem; margin-top:0.65rem;">
        <label style="display:flex; align-items:center; gap:0.4rem; background:#ECFDF5; border:2px solid #6EE7B7; padding:0.5rem 1.2rem; border-radius:10px; cursor:pointer; font-weight:900; color:#065F46;">
          <input type="radio" name="q_${qIdx}" value="O" style="width:18px; height:18px;" /> ⭕ 對 (○)
        </label>
        <label style="display:flex; align-items:center; gap:0.4rem; background:#FEF2F2; border:2px solid #FCA5A5; padding:0.5rem 1.2rem; border-radius:10px; cursor:pointer; font-weight:900; color:#991B1B;">
          <input type="radio" name="q_${qIdx}" value="X" style="width:18px; height:18px;" /> ❌ 錯 (×)
        </label>
      </div>`;
    } else if (item.type === 'cmp') {
      inputHtml = `<div style="display:flex; align-items:center; gap:0.75rem; flex-wrap:wrap; margin-top:0.65rem; background:#F8FAFC; padding:0.75rem 1rem; border-radius:12px; border:2px solid #E2E8F0;">
        <span style="font-size:1.25rem; font-weight:900; color:#1E3A8A;">${item.left}</span>
        <select id="q_input_${qIdx}" style="padding:0.4rem 0.8rem; font-size:1.2rem; font-weight:900; border-radius:8px; border:2px solid #3B82F6; color:#1D4ED8;">
          <option value="">請選擇</option>
          <option value=">">＞（大於）</option>
          <option value="=">＝（等於）</option>
          <option value="<">＜（小於）</option>
        </select>
        <span style="font-size:1.25rem; font-weight:900; color:#1E3A8A;">${item.right}</span>
      </div>`;
    } else {
      // fill
      inputHtml = `<div style="display:flex; align-items:center; gap:0.5rem; margin-top:0.65rem;">
        <span style="font-weight:800; color:#475569;">請填入答案：</span>
        <input type="text" id="q_input_${qIdx}" placeholder="輸入數字或答案" style="width:160px; padding:0.5rem 0.8rem; font-size:1.1rem; font-weight:900; border-radius:10px; border:2px solid #94A3B8;" />
        ${item.unitLabel ? `<span style="font-weight:900; color:#1E293B;">${item.unitLabel}</span>` : ''}
      </div>`;
    }

    return `
      <div id="q_card_${qIdx}" style="background:white; border:2px solid #E2E8F0; border-radius:16px; padding:1.15rem; margin-bottom:1rem;">
        <div style="display:flex; justify-content:space-between; align-items:flex-start; gap:0.5rem;">
          <div style="font-weight:900; font-size:1.06rem; color:#1E293B;">
            <span style="background:#DBEAFE; color:#1E40AF; padding:2px 9px; border-radius:8px; margin-right:6px;">第 ${qIdx + 1} 題</span>
            ${item.q}
          </div>
          <span style="font-size:0.82rem; font-weight:800; color:#64748B; white-space:nowrap;">配分 20 分</span>
        </div>
        ${inputHtml}
        <div id="q_explain_${qIdx}" style="display:none; margin-top:0.75rem; padding:0.65rem 0.9rem; border-radius:10px; font-size:0.92rem; font-weight:800;"></div>
      </div>
    `;
  }).join('');

  container.innerHTML = `
    <!-- 學生個人資料與總體統計列 -->
    <div class="workspace-card" style="background:linear-gradient(135deg, #EFF6FF 0%, #E0E7FF 100%); border-color:#818CF8;">
      <div style="display:flex; flex-wrap:wrap; justify-content:space-between; align-items:center; gap:1rem;">
        <div style="display:flex; flex-wrap:wrap; align-items:center; gap:0.65rem;">
          <span style="font-weight:900; color:#312E81; font-size:1.05rem;">🧑‍🎓 學生應試資料：</span>
          <input type="text" id="quizStudentClass" value="${quizState.studentClass}" placeholder="班級 (例:三年一班)" onchange="saveStudentProfile()" style="width:125px; padding:0.45rem 0.7rem; border-radius:10px; border:2px solid #6366F1; font-weight:800;" />
          <input type="number" id="quizStudentSeat" value="${quizState.studentSeat}" placeholder="座號" min="1" max="50" onchange="saveStudentProfile()" style="width:75px; padding:0.45rem 0.7rem; border-radius:10px; border:2px solid #6366F1; font-weight:800;" />
          <input type="text" id="quizStudentName" value="${quizState.studentName}" placeholder="請輸入學生姓名" onchange="saveStudentProfile()" style="width:155px; padding:0.45rem 0.7rem; border-radius:10px; border:2px solid #4F46E5; font-weight:900; background:white;" />
        </div>
        <div style="display:flex; gap:0.5rem; flex-wrap:wrap;">
          <button class="btn btn-green" onclick="exportQuizCSV()">📥 匯出成績單 (CSV)</button>
          <button class="btn btn-outline" onclick="clearQuizRecords()">🗑️ 清除成績紀錄</button>
        </div>
      </div>
    </div>

    <!-- 單元選擇與 5 份測驗卷選擇 -->
    <div class="workspace-card">
      <div style="margin-bottom:0.85rem;">
        <div style="font-weight:900; color:#1E3A8A; margin-bottom:0.45rem;">1️⃣ 選擇測驗單元（全冊 9 單元 × 每單元 5 份卷 ＝ 共 45 份線上測驗卷）：</div>
        <div style="display:flex; flex-wrap:wrap; gap:0.45rem;">${unitBtnsHtml}</div>
      </div>

      <div style="margin-bottom:1.25rem;">
        <div style="font-weight:900; color:#1E3A8A; margin-bottom:0.45rem;">2️⃣ 選擇【${unitTitles[u]}】的測驗卷別：</div>
        <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(200px, 1fr)); gap:0.65rem;">
          ${paperTabsHtml}
        </div>
      </div>

      <!-- 試卷標頭 -->
      <div style="background:#FFFBEB; border:3px solid ${pInfo.color}; border-radius:16px; padding:1rem 1.25rem; margin-bottom:1.25rem; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:0.75rem;">
        <div>
          <span style="background:${pInfo.color}; color:white; font-weight:900; font-size:0.82rem; padding:3px 10px; border-radius:99px;">${pInfo.tag}</span>
          <h3 style="font-size:1.3rem; font-weight:900; color:#1E293B; margin-top:0.25rem;">${unitTitles[u]} — ${pInfo.name}</h3>
        </div>
        <div id="quizLiveScoreBadge" style="font-family:'Fredoka', sans-serif; font-size:1.6rem; font-weight:900; color:#B91C1C; background:white; padding:0.4rem 1.1rem; border-radius:12px; border:2px solid #FCA5A5;">
          滿分：100 分
        </div>
      </div>

      <!-- 試題區 -->
      <div id="quizQuestionsWrap">
        ${qListHtml}
      </div>

      <!-- 交卷批改按鈕列 -->
      <div style="display:flex; justify-content:center; gap:1rem; margin-top:1.25rem; flex-wrap:wrap;">
        <button class="btn btn-primary" style="font-size:1.15rem; padding:0.8rem 2.2rem;" onclick="gradeCurrentQuiz()">
          ✅ 交卷並自動批改給分
        </button>
        <button class="btn btn-outline" style="font-size:1.05rem; padding:0.8rem 1.5rem;" onclick="selectQuizPaper(${pIdx})">
          🔄 重新作答本卷
        </button>
      </div>

      <div id="quizSummaryBanner" class="feedback-banner" style="display:none; margin-top:1.25rem;"></div>
    </div>

    <!-- 歷史成績排行榜 -->
    <div style="margin-top: 1.5rem;">
      <div class="workspace-card" style="box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
        <h3 style="color:#1E3A8A; font-size:1.2rem; margin-bottom:0.75rem;">📊 學生測驗成績紀錄表（共 ${quizState.records.length} 筆紀錄）</h3>
        <div id="quizScoreboardWrap" style="max-height:360px; overflow-y:auto;">
          ${renderScoreboardTable()}
        </div>
      </div>
    </div>
  `;
}

function normalizeAnswer(str) {
  if (str === undefined || str === null) return '';
  // 將全形數字轉半形並移除空白
  return String(str)
    .trim()
    .replace(/[０-９]/g, s => String.fromCharCode(s.charCodeAt(0) - 0xFEE0))
    .replace(/\s+/g, '');
}

function gradeCurrentQuiz() {
  saveStudentProfile();
  if (!quizState.studentName) {
    quizState.studentName = '小小數學家';
    const nameInput = document.getElementById('quizStudentName');
    if (nameInput) nameInput.value = quizState.studentName;
    localStorage.setItem('kx_g3_name', quizState.studentName);
  }

  const u = quizState.currentUnit;
  const pIdx = quizState.currentPaperIdx;
  const questions = QUIZ_BANK[u][pIdx];

  let score = 0;
  let correctCount = 0;

  questions.forEach((item, qIdx) => {
    let userAns = '';
    if (item.type === 'mc' || item.type === 'tf') {
      const checked = document.querySelector(`input[name="q_${qIdx}"]:checked`);
      if (checked) userAns = checked.value;
    } else {
      const inp = document.getElementById(`q_input_${qIdx}`);
      if (inp) userAns = inp.value;
    }

    const isCorrect = normalizeAnswer(userAns) === normalizeAnswer(item.ans);
    if (isCorrect) {
      score += 20;
      correctCount++;
    }

    const card = document.getElementById(`q_card_${qIdx}`);
    const exp = document.getElementById(`q_explain_${qIdx}`);
    if (card && exp) {
      card.style.borderColor = isCorrect ? '#10B981' : '#EF4444';
      card.style.background = isCorrect ? '#F0FDF4' : '#FEF2F2';
      exp.style.display = 'block';
      exp.style.background = isCorrect ? '#DCFCE7' : '#FEE2E2';
      exp.style.color = isCorrect ? '#065F46' : '#991B1B';
      exp.innerHTML = isCorrect
        ? `✅ 答對了！（＋20 分） 💡 解析：${item.explain}`
        : `❌ 答錯了（你的答案：${userAns || '未作答'} ｜ 正確答案：<strong>${item.ans}</strong>）<br/>💡 訂正解析：${item.explain}`;
    }
  });

  // 儲存成績紀錄
  const now = new Date();
  const timeStr = `${now.getFullYear()}/${String(now.getMonth() + 1).padStart(2, '0')}/${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
  const rec = {
    time: timeStr,
    studentClass: quizState.studentClass,
    seat: quizState.studentSeat,
    name: quizState.studentName,
    unit: u,
    unitTitle: unitTitles[u],
    paperIdx: pIdx,
    paperName: paperTypes[pIdx].name,
    score,
    correctCount
  };
  quizState.records.unshift(rec);
  localStorage.setItem('kx_g3_quiz_records', JSON.stringify(quizState.records));

  // 更新分數徽章與鼓勵語
  const badge = document.getElementById('quizLiveScoreBadge');
  if (badge) {
    badge.textContent = `得分：${score} 分`;
    badge.style.color = score >= 80 ? '#059669' : score >= 60 ? '#D97706' : '#DC2626';
  }

  const banner = document.getElementById('quizSummaryBanner');
  if (banner) {
    banner.style.display = 'flex';
    banner.className = score >= 80 ? 'feedback-banner success' : 'feedback-banner warning';
    const comment = score === 100
      ? '🏆 太神啦！滿分 100 分！完全掌握這個單元的觀念！'
      : score >= 80
      ? '🎉 表現優異！只差一點點就滿分囉，看看上方紅色題目的訂正解析吧！'
      : '💪 再接再厲！先閱讀每一題下方的訂正解析，或回到互動教具區操作看看，再挑戰一次！';
    banner.innerHTML = `📝 批改完成！<strong>${quizState.studentClass} ${quizState.studentSeat}號 ${quizState.studentName}</strong> 在【${unitTitles[u]} - ${paperTypes[pIdx].name}】答對 <strong>${correctCount}/5 題</strong>，總分：<strong>${score} 分</strong>！${comment}`;
  }

  const sbWrap = document.getElementById('quizScoreboardWrap');
  if (sbWrap) sbWrap.innerHTML = renderScoreboardTable();

  if (score >= 60) addStar(Math.floor(score / 20));
  else playTone(330, 0.15);
}

function renderScoreboardTable() {
  if (!quizState.records.length) {
    return `<div style="padding:1.5rem; text-align:center; color:#64748B; font-weight:700;">目前尚無測驗紀錄，輸入姓名並完成上方任一份測驗卷即可自動記錄成績！</div>`;
  }
  return `
    <table style="width:100%; border-collapse:collapse; font-size:0.88rem; text-align:left;">
      <thead>
        <tr style="background:#F1F5F9; border-bottom:2px solid #CBD5E1;">
          <th style="padding:0.55rem;">姓名 (班級座號)</th>
          <th style="padding:0.55rem;">單元與卷別</th>
          <th style="padding:0.55rem;">分數</th>
          <th style="padding:0.55rem;">時間</th>
        </tr>
      </thead>
      <tbody>
        ${quizState.records.map(r => `
          <tr style="border-bottom:1px solid #E2E8F0;">
            <td style="padding:0.55rem; font-weight:900; color:#1E293B;">${r.name} <span style="font-size:0.78rem; color:#64748B;">(${r.studentClass} #${r.seat})</span></td>
            <td style="padding:0.55rem; font-weight:700; color:#334155;">U${r.unit} - ${r.paperName}</td>
            <td style="padding:0.55rem; font-weight:900; color:${r.score >= 80 ? '#059669' : r.score >= 60 ? '#D97706' : '#DC2626'};">${r.score} 分 (${r.correctCount}/5)</td>
            <td style="padding:0.55rem; color:#64748B; font-size:0.78rem;">${r.time}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  `;
}

function exportQuizCSV() {
  if (!quizState.records.length) {
    alert('目前還沒有任何測驗成績可以匯出喔！');
    return;
  }
  const headers = ['測驗時間', '班級', '座號', '學生姓名', '單元', '測驗卷名稱', '答對題數', '得分'];
  const rows = quizState.records.map(r => [
    r.time,
    r.studentClass,
    r.seat,
    r.name,
    r.unitTitle,
    r.paperName,
    `${r.correctCount}/5`,
    r.score
  ]);
  const csvContent = '\uFEFF' + [headers, ...rows].map(e => e.map(v => `"${String(v).replace(/"/g, '""')}"`).join(',')).join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `木新思達3上數學線上測驗成績單_${quizState.studentName || '全班'}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

function clearQuizRecords() {
  if (confirm('確定要清除這台電腦上的所有測驗成績紀錄嗎？')) {
    quizState.records = [];
    localStorage.removeItem('kx_g3_quiz_records');
    renderQuizCenter();
  }
}

window.addEventListener('DOMContentLoaded', () => {
  renderQuizCenter();
});
