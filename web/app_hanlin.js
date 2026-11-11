/* =========================================================
   木新思達 國小數學 1~6 年級上學期 — 翰林版 (Hanlin) 課程導航與專屬互動教具引擎
   依據 D:\國小翰林\2.數學 (115上1~6年級備課資料：A6素養學習單、A7主題學習單、B5八格練習卷) 建置
   同時內建「全版本（康軒・南一・翰林）1~6年級全單元觀念實作與互動練習挑戰引擎」
   ========================================================= */

const HANLIN_CURRICULUM = {
  '1上': [
    { uNum: 1, icon: '✏️', name: '10以內的數', desc: '過關印章換鉛筆＆動物園寶寶・認識1～10與0', title: '1. 10以內的數', navLabel: '1. 10以內的數', subTitle: '【翰林1上】過關印章換鉛筆與動物園寶寶學習單：認識 1～10 的數與 0', refSec: 'g1_unit1', initFn: 'renderG1U1' },
    { uNum: 2, icon: '🦒', name: '比長短', desc: '買櫃子＆好高的長頸鹿・端點對齊與繩子複製比較', title: '2. 比長短', navLabel: '2. 比長短', subTitle: '【翰林1上】買櫃子與好高的長頸鹿學習單：端點對齊直觀比較、繩子複製與方格計數', refSec: 'g1_unit2', initFn: 'renderG1U2' },
    { uNum: 3, icon: '🌳', name: '順序與多少', desc: '阿公的果樹＆動物拼圖・左右方向第幾個與比多少', title: '3. 順序與多少', navLabel: '3. 順序與多少', subTitle: '【翰林1上】阿公的果樹與動物拼圖學習單：分辨左右方向、「第幾個」與「幾個」及比多少', refSec: 'g1_unit3', initFn: 'renderG1U3' },
    { uNum: 4, icon: '🏀', name: '分與合', desc: '分組活動投球・10以內數的分與合數字樹', title: '4. 分與合', navLabel: '4. 分與合', subTitle: '【翰林1上】分組活動投球學習單：操作花片探索 10 以內的分與合數字樹', refSec: 'g1_unit4', initFn: 'renderG1U4' },
    { uNum: 5, icon: '🎨', name: '認識形狀', desc: '拼貼畫・長方形正方形三角形圓形分類統計', title: '5. 認識形狀', navLabel: '5. 認識形狀', subTitle: '【翰林1上】拼貼畫形狀學習單：辨認長方形、正方形、三角形與圓形並分類統計', refSec: 'g1_unit5', initFn: 'renderG1U5' },
    { uNum: 6, icon: '🎡', name: '10以內的加法', desc: '遊樂園排排隊・摩天輪與咖啡杯合起來的加法', title: '6. 10以內的加法', navLabel: '6. 10以內加法', subTitle: '【翰林1上】遊樂園排排隊（摩天輪與咖啡杯）學習單：認識加號「＋」、合起來與 0 的加法', refSec: 'g1_unit7', initFn: 'renderG1U7' },
    { uNum: 7, icon: '🍫', name: '10以內的減法', desc: '巧克力工廠・愛心與星星巧克力拿走與比多少', title: '7. 10以內的減法', navLabel: '7. 10以內減法', subTitle: '【翰林1上】巧克力工廠（愛心與星星材料包）學習單：拿走、比多少與還差多少', refSec: 'g1_unit8', initFn: 'renderG1U8' },
    { uNum: 8, icon: '🥚', name: '30以內的數', desc: '集點大作戰・集滿30張貼紙換馬克杯與十格陣列', title: '8. 30以內的數', navLabel: '8. 30以內的數', subTitle: '【翰林1上】集點大作戰（集滿30張雞蛋貼紙換馬克杯）學習單：10 個一數與十格陣列', refSec: 'g1_unit6', initFn: 'renderG1U6' },
    { uNum: 9, icon: '⛺', name: '時 間', desc: '皮皮露營趣・報讀鐘面幾點鐘與幾點半', title: '9. 時間', navLabel: '9. 時間', subTitle: '【翰林1上】皮皮露營趣學習單：長針指 12 是整點、長針指 6 是半點與先後順序', refSec: 'g1_unit9', initFn: 'renderG1U9' }
  ],
  '2上': [
    { uNum: 1, icon: '🎟️', name: '200以內的數', desc: '歡樂熊遊戲屋彩券＆多喝水・百位認識與兌換', title: '1. 200以內的數', navLabel: '1. 200以內的數', subTitle: '【翰林2上】歡樂熊遊戲屋彩券與多喝水學習單：認識百位、100張/10張/1張兌換與比大小', refSec: 'g2_unit1', initFn: 'renderG2U1' },
    { uNum: 2, icon: '⛴️', name: '二位數的加減法', desc: '戶外教育淡水渡船・二位數直式進位與退位', title: '2. 二位數的加減法', navLabel: '2. 二位數加減', subTitle: '【翰林2上】戶外教育淡水渡船學習單：二位數直式進位加法與退位減法（借1當10）', refSec: 'g2_unit2', initFn: 'renderG2U2' },
    { uNum: 3, icon: '😷', name: '認識公分', desc: '口罩收納夾鏈袋・刻度0對齊與斷尺實測計算', title: '3. 認識公分', navLabel: '3. 認識公分', subTitle: '【翰林2上】口罩收納夾鏈袋學習單：尺的刻度 0 對齊、斷尺測量與公分加減', refSec: 'g2_unit3', initFn: 'renderG2U3' },
    { uNum: 4, icon: '🍬', name: '加減應用', desc: '誰遺失了袋子・加減互逆關係與驗算推理', title: '4. 加減應用', navLabel: '4. 加減應用', subTitle: '【翰林2上】誰遺失了袋子學習單：加減互逆關係（部分-全體線段圖）與驗算', refSec: 'g2_unit4', initFn: 'renderG2U4' },
    { uNum: 5, icon: '🧃', name: '容 量', desc: '同樂會飲料杯・液量保留與幾個小杯比較容量', title: '5. 容量', navLabel: '5. 容量', subTitle: '【翰林2上】同樂會飲料杯比較學習單：液量保留概念、直觀比較與個別單位（幾個小杯）比較', refSec: 'g2_unit10', initFn: 'renderG2U10' },
    { uNum: 6, icon: '🖍️', name: '加減兩步驟', desc: '買文具・連加連減與加減混合兩步驟問題', title: '6. 加減兩步驟', navLabel: '6. 加減兩步驟', subTitle: '【翰林2上】買文具學習單：連加、連減與加減混合兩步驟問題拆解', refSec: 'g2_unit6', initFn: 'renderG2U6' },
    { uNum: 7, icon: '🧶', name: '乘法（一）', desc: '織毛衣袖子與鈕扣・2、5、4、8的乘法矩陣', title: '7. 乘法（一）', navLabel: '7. 乘法(一)', subTitle: '【翰林2上】織毛衣（袖子、鈕扣、毛線球）學習單：2、5、4、8 的乘法矩陣與倍數意義', refSec: 'g2_unit7', initFn: 'renderG2U7' },
    { uNum: 8, icon: '🚉', name: '時 間', desc: '準時到達火車站・報讀幾時幾分與經過時間', title: '8. 時間', navLabel: '8. 時間', subTitle: '【翰林2上】準時到達臺北火車站學習單：長針每大格5分、每小格1分，報讀幾時幾分與經過時間', refSec: 'g2_unit8', initFn: 'renderG2U8' },
    { uNum: 9, icon: '🧴', name: '乘法（二）', desc: '防疫組合包・3、6、7、9的乘法與交換律', title: '9. 乘法（二）', navLabel: '9. 乘法(二)', subTitle: '【翰林2上】防疫組合包（洗手乳、乾洗手、口罩）學習單：3、6、7、9 的乘法與交換律', refSec: 'g2_unit9', initFn: 'renderG2U9' },
    { uNum: 10, icon: '🪟', name: '面的大小比較', desc: '哪一扇窗戶最大・便利貼鋪滿與重疊比較面積', title: '10. 面的大小比較', navLabel: '10. 面的大小', subTitle: '【翰林2上】哪一扇窗戶最大（便利貼鋪滿比較）學習單：重疊直接比較與方格計數間接比較', refSec: 'g2_unit5', initFn: 'renderG2U5' }
  ],
  '3上': [
    { uNum: 1, icon: '🎧', name: '10000以內的數', desc: '禮物選選看耳朵賣場・千位認識與錢幣兌換', title: '1. 10000以內的數', navLabel: '1. 10000以內的數', subTitle: '【翰林3上】禮物選選看（耳朵科技賣場）學習單：認識千位、錢幣積木兌換與四位數比大小', refSec: 'unit1', initFn: 'renderU1Board' },
    { uNum: 2, icon: '🚄', name: '10000以內的加減', desc: '旅遊的花費・四位數直式進位加與連續退位減', title: '2. 10000以內的加減', navLabel: '2. 四位數加減', subTitle: '【翰林3上】旅遊的花費（高鐵與飯店方案）學習單：四位數直式進位加法、連續退位減法', refSec: 'unit2', initFn: 'renderU2Vertical' },
    { uNum: 3, icon: '🎀', name: '毫米與數線', desc: '買蕾絲花邊・1cm＝10mm實測與數線跳躍', title: '3. 毫米與數線', navLabel: '3. 毫米與數線', subTitle: '【翰林3上】買蕾絲花邊學習單：1 公分＝10 毫米、公分與毫米複名數計算及數線跳躍', refSec: 'unit3', initFn: 'renderU3RulerCanvas' },
    { uNum: 4, icon: '🍫', name: '乘 法', desc: '零食熱量大調查＆蠟筆城堡・二三位數×一位數', title: '4. 乘法', navLabel: '4. 乘法', subTitle: '【翰林3上】零食熱量大調查與幸福蠟筆城堡學習單：二、三位數乘以一位數直式進位演算', refSec: 'unit4', initFn: 'renderU4Multiplication' },
    { uNum: 5, icon: '📐', name: '角與形狀', desc: '圖形內的角・直角銳角鈍角與正方形長方形', title: '5. 角與形狀', navLabel: '5. 角與形狀', subTitle: '【翰林3上】圖形內的角學習單：認識直角、銳角、鈍角，三角板比對與正方形、長方形性質', refSec: 'unit5', initFn: 'updateFanVisual' },
    { uNum: 6, icon: '🍭', name: '除 法', desc: '糖果工坊大調查・除法直式商與餘數及奇偶數', title: '6. 除法', navLabel: '6. 除法', subTitle: '【翰林3上】糖果工坊大調查（單價比較）學習單：除法直式商與餘數（餘數必小於除數）及奇偶數', refSec: 'unit7', initFn: 'updateU7Visual' },
    { uNum: 7, icon: '⚖️', name: '公斤與公克', desc: '你的書包有多重・1kg/3kg磅秤指針與天平推理', title: '7. 公斤與公克', navLabel: '7. 公斤與公克', subTitle: '【翰林3上】你的書包有多重？學習單：1kg/3kg磅秤指針刻度判讀、1公斤＝1000公克與天平推理', custom: true, secId: 'hl_g3_unit7', initFn: 'renderHlG3U7' },
    { uNum: 8, icon: '🧱', name: '分 數', desc: '牆面設計比賽・幾分之幾與同分母分數加減', title: '8. 分數', navLabel: '8. 分數', subTitle: '【翰林3上】牆面設計比賽（圍牆磁磚塗色）學習單：幾分之幾、同分母分數加減與 1 的等值分數', refSec: 'unit9', initFn: 'renderU9Pie' },
    { uNum: 9, icon: '📋', name: '列表與規律', desc: '早餐吃什麼價目表・二維統計表・串珠與方格規律', title: '9. 列表與規律', navLabel: '9. 列表與規律', subTitle: '【翰林3上】早餐吃什麼價目表、客運時刻表、二維分類統計表、珠子與階梯方格規律', custom: true, secId: 'hl_g3_unit9', initFn: 'renderHlG3U9' }
  ],
  '4上': [
    { uNum: 1, icon: '🍍', name: '一億以內的數', desc: '閱讀排行榜＆我愛鳳梨・萬家族與個家族四位一節', title: '1. 一億以內的數', navLabel: '1. 一億以內的數', subTitle: '【翰林4上】閱讀排行榜（達文西密碼8000萬本）與我愛鳳梨學習單：萬家族與個家族四位一節', refSec: 'g4_unit1', initUnit: 1 },
    { uNum: 2, icon: '🚅', name: '乘 法', desc: '省錢大作戰高鐵票・多位數乘以二三位數直式', title: '2. 乘法', navLabel: '2. 乘法', subTitle: '【翰林4上】省錢大作戰（高鐵團體票與全票優待票比較）學習單：多位數乘以二、三位數直式', refSec: 'g4_unit2', initUnit: 2 },
    { uNum: 3, icon: '🛝', name: '角 度', desc: '好玩安全的角度・溜滑梯30°量角器實測與旋轉角', title: '3. 角度', navLabel: '3. 角度', subTitle: '【翰林4上】好玩安全的角度（溜滑梯夾角30°與海盜船擺盪80°）學習單：量角器實測與角度合成', refSec: 'g4_unit3', initUnit: 3 },
    { uNum: 4, icon: '🧴', name: '假分數與帶分數', desc: '家裡大消毒漂白水・假分數帶分數互化與加減', title: '4. 假分數與帶分數', navLabel: '4. 假分數與帶分數', subTitle: '【翰林4上】家裡大消毒（漂白水1/4瓶蓋調配）學習單：真分數、假分數與帶分數互化及加減', refSec: 'g4_unit9', initUnit: 9 },
    { uNum: 5, icon: '🗼', name: '公 里', desc: '燈塔之旅607公里・1km＝1000m換算與計算', title: '5. 公里', navLabel: '5. 公里', subTitle: '【翰林4上】燈塔之旅（全臺五大燈塔607公里）學習單：1 公里＝1000 公尺換算與複名數計算', refSec: 'g4_unit5', initUnit: 5 },
    { uNum: 6, icon: '🧪', name: '除 法', desc: '防疫大搶購酒精單價・除數為二三位數直式試商', title: '6. 除法', navLabel: '6. 除法', subTitle: '【翰林4上】防疫大搶購（潔菌酒精四種包裝單價比較）學習單：除數為二、三位數的直式試商', refSec: 'g4_unit4', initUnit: 4 },
    { uNum: 7, icon: '🛡️', name: '三角形與全等', desc: '班級徽章設計・正三角形等腰三角形與全等對應', title: '7. 三角形與全等', navLabel: '7. 三角形與全等', subTitle: '【翰林4上】班級徽章（正三角形、等腰三角形、直角三角形）學習單：三角形分類與全等對應', refSec: 'g4_unit6', initUnit: 6 },
    { uNum: 8, icon: '🧶', name: '兩步驟問題與併式', desc: '手作材料包・括號先算與加減乘除併式規則', title: '8. 兩步驟問題與併式', navLabel: '8. 兩步驟與併式', subTitle: '【翰林4上】手作材料包學習單：括號先算、由左而右與四則併式規則', refSec: 'g4_unit8', initUnit: 8 },
    { uNum: 9, icon: '🚇', name: '二位小數', desc: '臺北捷運大解密・百分位0.01與小數直式加減', title: '9. 二位小數', navLabel: '9. 二位小數', subTitle: '【翰林4上】臺北捷運大解密（圓山到象山里程票價）學習單：認識百分位 0.01 與小數直式加減', refSec: 'g4_unit7', initUnit: 7 },
    { uNum: 10, icon: '📊', name: '統計圖表', desc: '接種疫苗速報・複式長條圖與折線圖趨勢判讀', title: '10. 統計圖表', navLabel: '10. 統計圖表', subTitle: '【翰林4上】接種疫苗速報（幸福里公費與自費複式長條圖）與折線圖判讀', refSec: 'g4_unit10', initUnit: 10 }
  ],
  '5上': [
    { uNum: 1, icon: '📈', name: '折線圖', desc: '新冠肺炎雙折線圖・波浪省略記號與趨勢判讀', title: '1. 折線圖', navLabel: '1. 折線圖', subTitle: '【翰林5上】新冠肺炎本土與境外移入雙折線圖學習單：波浪省略記號與趨勢變化判讀', refSec: 'ny_g5_unit1', initFn: 'renderNyG5U1' },
    { uNum: 2, icon: '🔐', name: '倍數與因數', desc: '設定安全的密碼・因數彩虹列舉與2/3/5/10倍數', title: '2. 倍數與因數', navLabel: '2. 倍數與因數', subTitle: '【翰林5上】設定安全的密碼（丹丹6的倍數字母密碼）學習單：因數彩虹成對列舉與2、3、5、10倍數判別', refSec: 'g5_unit2', initUnit: 2 },
    { uNum: 3, icon: '🏮', name: '平面圖形', desc: '三角形拼拼看・三邊關係・內角和180°與正多邊形', title: '3. 平面圖形', navLabel: '3. 平面圖形', subTitle: '【翰林5上】三角形拼拼看（任意兩邊和大於第三邊、大角對大邊、三角形內角和180°與正多邊形）', refSec: 'g5_unit5', initUnit: 5 },
    { uNum: 4, icon: '🟦', name: '公倍數與公因數', desc: '拼出正方形・長6寬4卡紙拼最小正方形GCD/LCM', title: '4. 公倍數與公因數', navLabel: '4. 公倍數與公因數', subTitle: '【翰林5上】拼出正方形（長6cm寬4cm卡紙拼最小正方形邊長12cm）學習單：GCD與LCM應用', refSec: 'g5_unit3', initUnit: 3 },
    { uNum: 5, icon: '⚽', name: '立體形體', desc: '玩具球裝箱・面的垂直平行・角柱角錐與球心截面', title: '5. 立體形體', navLabel: '5. 立體形體', subTitle: '【翰林5上】玩具球裝箱（43×39×32紙箱）學習單：面的垂直平行、角柱角錐頂點邊面與球心截面', refSec: 'g5_unit10', initUnit: 10 },
    { uNum: 6, icon: '☕', name: '整數四則運算', desc: '滿額送馬克杯・四則運算優先順序與乘法分配律', title: '6. 整數四則運算', navLabel: '6. 整數四則運算', subTitle: '【翰林5上】滿額送馬克杯（滿168元送1個）學習單：四則運算規則、結合律與乘法分配律', refSec: 'g5_unit8', initUnit: 8 },
    { uNum: 7, icon: '🍕', name: '擴、約分與加減', desc: '誰吃得比較多・擴分約分通分與異分母分數加減', title: '7. 擴、約分與加減', navLabel: '7. 擴約分與加減', subTitle: '【翰林5上】誰吃得比較多（披薩1/4＋2/6通分比較）學習單：擴分、約分、通分與異分母分數加減', refSec: 'g5_unit6', initUnit: 6 },
    { uNum: 8, icon: '🗺️', name: '面 積', desc: '三浦摺疊・平行四邊形三角形梯形等積割補', title: '8. 面積', navLabel: '8. 面積', subTitle: '【翰林5上】三浦摺疊（平行四邊形展開25倍＝2400cm²）學習單：平行四邊形、三角形、梯形面積割補', refSec: 'g5_unit9', initUnit: 9 },
    { uNum: 9, icon: '🥮', name: '乘以幾分之一', desc: '誰的答案正確・整數相除a÷b＝a/b與乘以1/b等於除以b', title: '9. 乘以幾分之一', navLabel: '9. 乘以幾分之一', subTitle: '【翰林5上】誰的答案正確呢（蛋黃酥與芝麻粉分裝）學習單：分數表示整數相除 a÷b＝a/b、乘以 1/b 等於除以 b', custom: true, secId: 'hl_g5_unit9', initFn: 'renderHlG5U9' },
    { uNum: 10, icon: '🪭', name: '扇 形', desc: '拼成一個圓・認識扇形・圓心角與幾分之幾圓', title: '10. 扇形', navLabel: '10. 扇形', subTitle: '【翰林5上】拼成一個圓（康華挑選半徑5cm扇形湊滿360°）學習單：認識扇形、圓心角與幾分之幾圓', custom: true, secId: 'hl_g5_unit10', initFn: 'renderHlG5U10' }
  ],
  '6上': [
    { uNum: 1, icon: '🍜', name: '最大公因數與最小公倍數', desc: '每日特餐週期相遇・質因數分解與短除法互質', title: '1. 最大公因數與最小公倍數', navLabel: '1. 公因數與公倍數', subTitle: '【翰林6上】每日特餐（木須炒麵每3天、魚丸湯每4天輪流推出）學習單：質因數分解、短除法與互質', refSec: 'g6_unit1', initUnit: 1 },
    { uNum: 2, icon: '🎀', name: '分數除法', desc: '該選哪種緞帶・除以分數等於乘以倒數與分裝', title: '2. 分數除法', navLabel: '2. 分數除法', subTitle: '【翰林6上】該選哪種緞帶呢（2又1/2m與1又1/5m整除30m）學習單：除以分數等於乘以倒數與有餘數的分裝', refSec: 'g6_unit2', initUnit: 2 },
    { uNum: 3, icon: '🌾', name: '小數除法', desc: '米的分裝・除數化整小數點移位與餘數原始對齊', title: '3. 小數除法', navLabel: '3. 小數除法', subTitle: '【翰林6上】米的分裝（白米85.1kg與糙米63.45kg分裝）學習單：小數除法移位法則、餘數原始對齊與四捨五入', refSec: 'g6_unit4', initUnit: 4 },
    { uNum: 4, icon: '🥣', name: '比與比值', desc: '怎樣買最划算・相等的比・最簡整數比與比例', title: '4. 比與比值', navLabel: '4. 比與比值', subTitle: '【翰林6上】怎樣買最划算（麥片特大包、中包、小包比值比較）學習單：相等的比、最簡整數比與比例應用', refSec: 'g6_unit5', initUnit: 5 },
    { uNum: 5, icon: '🍹', name: '兩量關係', desc: '園遊會酸梅汁・基準量與比較量・兩量和與兩量差', title: '5. 兩量關係', navLabel: '5. 兩量關係', subTitle: '【翰林6上】園遊會酸梅汁（原汁加4倍水調配4.5L與加六成、加八成定價）學習單：基準量與比較量、兩量和與兩量差', custom: true, secId: 'hl_g6_unit5', initFn: 'renderHlG6U5' },
    { uNum: 6, icon: '🐱', name: '圓周長與扇形周長', desc: '扇形貓抓板・圓周率3.14・扇形弧長＋2條半徑', title: '6. 圓周長與扇形周長', navLabel: '6. 圓與扇形周長', subTitle: '【翰林6上】扇形貓抓板（半徑40cm的1/4圓扇形底座貼毛邊142.8cm）學習單：圓周率3.14、圓周長與扇形周長', refSec: 'g6_unit6', initUnit: 6 },
    { uNum: 7, icon: '🗺️', name: '放大、縮小與比例尺', desc: '路線長度有多長・對應角相等・長度k倍面積k²倍', title: '7. 放大、縮小與比例尺', navLabel: '7. 縮放與比例尺', subTitle: '【翰林6上】路線長度有多長（信義運動中心到象山站15cm比例尺1cm:30m＝450m）學習單：對應角相等與比例尺', refSec: 'g6_unit9', initUnit: 9 },
    { uNum: 8, icon: '🏃', name: '怎樣解題', desc: '馬拉松間隔・空心多邊形規律・蛋糕組合・和差問題', title: '8. 怎樣解題', navLabel: '8. 怎樣解題', subTitle: '【翰林6上】馬拉松補給站間隔問題、空心三角形與方磚數形規則、香香蛋糕店搭配組合乘法原理、果汁和差問題', custom: true, secId: 'hl_g6_unit8', initFn: 'renderHlG6U8' }
  ]
};

window.HANLIN_CURRICULUM = HANLIN_CURRICULUM;

/* =========================================================
   翰林版單元導覽列渲染與單元切換器
   ========================================================= */
function hideAllHlCustomSections() {
  const ids = ['hl_g3_unit7', 'hl_g3_unit9', 'hl_g5_unit9', 'hl_g5_unit10', 'hl_g6_unit5', 'hl_g6_unit8'];
  ids.forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      el.classList.remove('active');
      el.style.display = 'none';
    }
  });
}
window.hideAllHlCustomSections = hideAllHlCustomSections;

function switchHlUnit(grade, uNum) {
  if (typeof playTone === 'function') playTone(493.88, 0.08);
  const units = HANLIN_CURRICULUM[grade] || HANLIN_CURRICULUM['3上'];
  const quizTabNum = units.length + 1;

  // 更新選單 Tab active 狀態
  for (let i = 1; i <= quizTabNum; i++) {
    const tab = document.getElementById(`hl_${grade}_tab${i}`);
    if (tab) tab.classList.toggle('active', i === uNum);
  }

  // 隱藏所有區段
  if (typeof hideAllGradeSections === 'function') hideAllGradeSections();
  if (typeof hideAllNyCustomSections === 'function') hideAllNyCustomSections();
  hideAllHlCustomSections();

  // 若點擊測驗中心
  if (uNum === quizTabNum || uNum >= 99) {
    const u10Sec = document.getElementById('unit10');
    if (u10Sec) {
      u10Sec.classList.add('active');
      u10Sec.style.display = 'block';
    }
    if (typeof setQuizGrade === 'function') setQuizGrade(grade, true);
    if (typeof renderQuizCenter === 'function') renderQuizCenter();
    return;
  }

  const target = units.find(u => u.uNum === uNum) || units[0];
  if (!target) return;

  let activeSecId = '';
  if (target.custom) {
    activeSecId = target.secId;
    const sec = document.getElementById(target.secId);
    if (sec) {
      sec.classList.add('active');
      sec.style.display = 'block';
    }
    if (target.initFn && typeof window[target.initFn] === 'function') {
      window[target.initFn]();
    }
  } else {
    activeSecId = target.refSec;
    const sec = document.getElementById(target.refSec);
    if (sec) {
      const h2 = sec.querySelector('.unit-banner-info h2');
      const p = sec.querySelector('.unit-banner-info p');
      const btn = sec.querySelector('.submode-switcher .btn-Amber, .submode-switcher .quiz-cta, .submode-switcher button');
      if (typeof origBannerCache !== 'undefined' && !origBannerCache[target.refSec]) {
        origBannerCache[target.refSec] = {
          h2: h2 ? h2.innerHTML : '',
          p: p ? p.innerHTML : '',
          btnOnclick: btn ? btn.getAttribute('onclick') : ''
        };
      }
      if (h2) {
        h2.innerHTML = `${target.icon || '📙'} 【翰林版 ${grade}】第 ${target.uNum} 單元：${target.name}`;
      }
      if (p) {
        p.innerHTML = target.subTitle;
      }
      if (btn) {
        btn.setAttribute('onclick', `openHlUnitQuiz('${grade}', ${target.uNum})`);
        btn.innerHTML = `📝 參加翰林第${target.uNum}單元測驗 (5份卷)`;
      }

      sec.classList.add('active');
      sec.style.display = 'block';
    }

    if (target.initUnit && grade === '4上' && typeof initG4Unit === 'function') {
      initG4Unit(target.initUnit);
    } else if (target.initUnit && grade === '5上' && typeof initG5Unit === 'function') {
      initG5Unit(target.initUnit);
    } else if (target.initUnit && grade === '6上' && typeof initG6Unit === 'function') {
      initG6Unit(target.initUnit);
    } else if (target.initFn && typeof window[target.initFn] === 'function') {
      window[target.initFn]();
    }
  }

  // 渲染通用「觀念實作與互動練習工作坊」
  if (activeSecId && typeof renderUnitPracticeLab === 'function') {
    renderUnitPracticeLab(activeSecId, 'hanlin', grade, target.uNum);
  }

  if (typeof window.MathMLRenderer !== 'undefined' && typeof window.MathMLRenderer.renderElement === 'function') {
    const activeSec = document.querySelector('.unit-section.active');
    if (activeSec) window.MathMLRenderer.renderElement(activeSec);
  }
}
window.switchHlUnit = switchHlUnit;

function openHlUnitQuiz(grade, uNum) {
  const units = HANLIN_CURRICULUM[grade] || [];
  const quizTabNum = units.length + 1;
  if (typeof setQuizGrade === 'function') setQuizGrade(grade, true);
  switchHlUnit(grade, quizTabNum);
  if (typeof selectQuizUnit === 'function') selectQuizUnit(uNum);
}
window.openHlUnitQuiz = openHlUnitQuiz;

/* =========================================================
   翰林版 6 大專屬特色單元 CPA 互動教具狀態與渲染器
   1. hl_g3_unit7 (3上第7單元：公斤與公克 — 1kg/3kg彈簧磅秤指針、潔雅書包重量檢測與天平推理)
   2. hl_g3_unit9 (3上第9單元：列表與規律 — 早餐店/電影院二維查表、串珠與階梯方格規律)
   3. hl_g5_unit9 (5上第9單元：乘以幾分之一 — 整數相除 a÷b=a/b 披薩切割與整數×1/b、芝麻粉分裝診斷)
   4. hl_g5_unit10 (5上第10單元：扇形 — 圓心角與幾分之幾圓量角器、康華扇形拼成一個圓實驗室)
   5. hl_g6_unit5 (6上第5單元：兩量關係 — 基準量與比較量動態倍數圖、兩量和/差、園遊會酸梅汁模擬器)
   6. hl_g6_unit8 (6上第8單元：怎樣解題 — 馬拉松間隔、空心多邊形數形規律、蛋糕店組合樹狀圖、果汁和差問題)
   ========================================================= */
const hlState = {
  g3u7: { grams: 2400, maxKg: 3, bagRemoved: 600, mode: 'scale' },
  g3u9: { tab: 'table', foodIdx: 0, drinkIdx: 1, stepN: 5, beadCheckIdx: 10 },
  g5u9: { pizzas: 3, people: 4, intVal: 12, unitDen: 4, sesameKg: 18, packKg: 4 },
  g5u10: { deg: 90, radius: 5, puzzlePieces: ['1/4', '1/2', '1/8', '1/8'] },
  g6u5: { baseVal: 0.9, ratio: 4, mode: 'sum', baseName: '酸梅原汁(基準量)', compName: '水(比較量)', unit: '公升' },
  g6u8: { tab: 'interval', roadKm: 42, stepKm: 3, endMode: 'none', polySides: 3, polyPerSide: 8, cakeN: 4, cookieN: 3, drinkN: 4, sumVal: 1500, diffVal: 250 }
};

/* ----- 1. 翰林 3上 第 7 單元：公斤與公克 (hl_g3_unit7) ----- */
function renderHlG3U7() {
  const wrap = document.getElementById('hlG3U7Display');
  if (!wrap) return;
  const st = hlState.g3u7;
  const maxG = st.maxKg * 1000;
  const g = Math.min(maxG, Math.max(0, st.grams));
  const kgPart = Math.floor(g / 1000);
  const gPart = g % 1000;

  // 繪製圓形彈簧磅秤 SVG
  const cx = 135, cy = 135, r = 105;
  const deg = (g / maxG) * 360;
  const rad = (deg - 90) * Math.PI / 180;
  const px = cx + (r - 22) * Math.cos(rad);
  const py = cy + (r - 22) * Math.sin(rad);

  let ticks = '';
  const totalTicks = st.maxKg === 1 ? 20 : 30; // 1kg: 每大格50g(共20格); 3kg: 每大格100g(共30格)
  for (let i = 0; i < totalTicks; i++) {
    const a = (i * 360 / totalTicks - 90) * Math.PI / 180;
    const isMajor = (st.maxKg === 1) ? (i % 2 === 0) : (i % 5 === 0);
    const rIn = isMajor ? r - 14 : r - 7;
    const x1 = cx + rIn * Math.cos(a), y1 = cy + rIn * Math.sin(a);
    const x2 = cx + r * Math.cos(a), y2 = cy + r * Math.sin(a);
    ticks += `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${isMajor ? '#1E293B' : '#94A3B8'}" stroke-width="${isMajor ? 2.5 : 1.2}"/>`;
    if (isMajor) {
      const tx = cx + (r - 27) * Math.cos(a);
      const ty = cy + (r - 27) * Math.sin(a) + 4;
      const valG = Math.round((i / totalTicks) * maxG);
      const label = (valG === 0) ? `${st.maxKg}kg(0)` : (valG % 1000 === 0 ? `${valG / 1000}kg` : `${valG}g`);
      ticks += `<text x="${tx}" y="${ty}" text-anchor="middle" font-size="9.5" font-weight="800" fill="#1E3A8A">${label}</text>`;
    }
  }

  const isOverweight = g > 2900;

  wrap.innerHTML = `
    <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(280px, 1fr)); gap:1.25rem; align-items:center;">
      <div style="text-align:center; background:#F8FAFC; border:2px solid #CBD5E1; border-radius:16px; padding:1rem;">
        <div style="display:flex; justify-content:center; gap:0.5rem; margin-bottom:0.5rem;">
          <button class="btn ${st.maxKg === 1 ? 'btn-primary' : 'btn-outline'}" style="padding:4px 12px; font-size:0.85rem;" onclick="hlState.g3u7.maxKg=1;if(hlState.g3u7.grams>1000)hlState.g3u7.grams=780;renderHlG3U7()">⚖️ 1 公斤秤 (每格50g)</button>
          <button class="btn ${st.maxKg === 3 ? 'btn-primary' : 'btn-outline'}" style="padding:4px 12px; font-size:0.85rem;" onclick="hlState.g3u7.maxKg=3;renderHlG3U7()">⚖️ 3 公斤秤 (每格100g)</button>
        </div>
        <svg width="270" height="270" viewBox="0 0 270 270" style="max-width:100%;">
          <!-- 秤盤 -->
          <rect x="65" y="4" width="140" height="12" rx="5" fill="#64748B" />
          <rect x="125" y="16" width="20" height="14" fill="#94A3B8" />
          <!-- 秤面外框 -->
          <circle cx="${cx}" cy="${cy}" r="${r + 8}" fill="#E2E8F0" stroke="#475569" stroke-width="3"/>
          <circle cx="${cx}" cy="${cy}" r="${r}" fill="#FFFFFF" stroke="#94A3B8" stroke-width="1.5"/>
          ${ticks}
          <!-- 指針 -->
          <line x1="${cx}" y1="${cy}" x2="${px}" y2="${py}" stroke="#DC2626" stroke-width="4" stroke-linecap="round"/>
          <circle cx="${cx}" cy="${cy}" r="7" fill="#DC2626"/>
          <text x="${cx}" y="${cy + 36}" text-anchor="middle" font-size="13" font-weight="900" fill="#0F172A">${g} g</text>
        </svg>
      </div>
      <div>
        <div style="background:#EFF6FF; border:2px solid #93C5FD; border-radius:14px; padding:1rem; margin-bottom:0.85rem;">
          <div style="font-weight:800; color:#1E40AF; margin-bottom:0.4rem;">🎚️ 拖動滑桿或點擊砝碼調整秤上物品重量：</div>
          <input type="range" min="0" max="${maxG}" step="${st.maxKg === 1 ? 10 : 50}" value="${g}" oninput="hlState.g3u7.grams=Number(this.value);renderHlG3U7()" style="width:100%; margin-bottom:0.5rem;" />
          <div style="display:flex; gap:0.4rem; flex-wrap:wrap;">
            <button class="btn btn-outline" style="padding:3px 9px; font-size:0.82rem;" onclick="hlState.g3u7.grams=Math.max(0,hlState.g3u7.grams-100);renderHlG3U7()">－100g</button>
            <button class="btn btn-outline" style="padding:3px 9px; font-size:0.82rem;" onclick="hlState.g3u7.grams=Math.min(${maxG},hlState.g3u7.grams+100);renderHlG3U7()">＋100g</button>
            <button class="btn btn-outline" style="padding:3px 9px; font-size:0.82rem;" onclick="hlState.g3u7.grams=Math.max(0,hlState.g3u7.grams-500);renderHlG3U7()">－500g</button>
            <button class="btn btn-outline" style="padding:3px 9px; font-size:0.82rem;" onclick="hlState.g3u7.grams=Math.min(${maxG},hlState.g3u7.grams+500);renderHlG3U7()">＋500g</button>
          </div>
        </div>
        <div style="background:#FEF3C7; border:2px solid #F59E0B; border-radius:14px; padding:1rem; line-height:1.8;">
          <div style="font-size:1.1rem; font-weight:900; color:#92400E;">📊 重量單位即時換算看板：</div>
          <div style="font-size:1.25rem; font-weight:900; color:#1E293B; margin:0.35rem 0;">
            <span style="color:#DC2626;">${g} 公克 (g)</span> ＝ <span style="color:#2563EB;">${kgPart} 公斤 (kg) ${gPart} 公克 (g)</span>
          </div>
          <div style="font-size:0.9rem; color:#475569;">
            💡 換算算式：${kgPart} × 1000 ＋ ${gPart} ＝ <strong>${g}</strong> 公克
          </div>
          <div style="margin-top:0.5rem; padding:0.45rem 0.75rem; border-radius:8px; background:${isOverweight ? '#FEE2E2' : '#DCFCE7'}; color:${isOverweight ? '#991B1B' : '#166534'}; font-weight:800; font-size:0.88rem;">
            🎒 【素養：潔雅書包健康檢測 (上限 2kg 900g＝2900g)】：
            ${isOverweight ? `⚠️ 目前 ${g}g 超重了 ${g - 2900} 公克！快取出玩具減重！` : `✅ 目前 ${kgPart}公斤${gPart}公克，符合健康標準（比上限輕 ${2900 - g}g）！`}
          </div>
        </div>
      </div>
    </div>
  `;
}

function setHlG3U7Preset(maxKg, grams, msg) {
  hlState.g3u7.maxKg = maxKg;
  hlState.g3u7.grams = grams;
  const t = document.getElementById('hlG3U7TaskText');
  if (t && msg) t.textContent = msg;
  renderHlG3U7();
}

function randomHlG3U7Task() {
  const maxKg = Math.random() < 0.4 ? 1 : 3;
  const step = maxKg === 1 ? 50 : 100;
  const grams = Math.floor(Math.random() * ((maxKg * 1000) / step - 2) + 2) * step;
  const kg = Math.floor(grams / 1000), g = grams % 1000;
  setHlG3U7Preset(maxKg, grams, `【隨機秤重挑戰】把水果禮盒放上 ${maxKg} 公斤秤，指針指在 ${grams} 公克，也就是 ${kg} 公斤 ${g} 公克！`);
}
window.renderHlG3U7 = renderHlG3U7;
window.setHlG3U7Preset = setHlG3U7Preset;
window.randomHlG3U7Task = randomHlG3U7Task;

/* ----- 2. 翰林 3上 第 9 單元：列表與規律 (hl_g3_unit9) ----- */
function renderHlG3U9() {
  const wrap = document.getElementById('hlG3U9Display');
  if (!wrap) return;
  const st = hlState.g3u9;
  const foods = [
    { name: '火腿蛋吐司', price: 40 },
    { name: '鮪魚蛋餅', price: 35 },
    { name: '蔬菜蛋餅', price: 30 },
    { name: '總匯三明治', price: 55 }
  ];
  const drinks = [
    { name: '溫豆漿', price: 20 },
    { name: '小冰奶', price: 15 },
    { name: '鮮奶茶', price: 30 }
  ];
  const f = foods[st.foodIdx] || foods[0];
  const d = drinks[st.drinkIdx] || drinks[0];
  const totalCost = f.price + d.price;

  // 階梯方格規律：圖1=15, 圖2=10(-5), 圖3=6(-4), 圖4=3(-3), 圖5=1(-2)
  const stepCounts = [15, 10, 6, 3, 1];
  const beadIdx = st.beadCheckIdx;
  const isBlackBead = (beadIdx % 3 === 1); // ● ○ ○ 循環

  wrap.innerHTML = `
    <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(300px, 1fr)); gap:1.25rem;">
      <!-- 左側：早餐吃什麼二維價目表互動點餐 -->
      <div style="background:#F8FAFC; border:2px solid #CBD5E1; border-radius:14px; padding:1rem;">
        <div style="font-weight:900; color:#1E3A8A; font-size:1.05rem; margin-bottom:0.5rem;">🥪 9-1 生活中的表格：【素養：早餐吃什麼】二維組合查詢</div>
        <div style="font-size:0.85rem; color:#475569; margin-bottom:0.5rem;">點選表格中的格子，自動查詢「餐點＋飲料」交叉合計金額：</div>
        <table style="width:100%; border-collapse:collapse; font-size:0.88rem; text-align:center; background:white;">
          <thead>
            <tr style="background:#DBEAFE; color:#1E3A8A;">
              <th style="border:1px solid #93C5FD; padding:6px;">餐點 ＼ 飲料</th>
              ${drinks.map((dr, di) => `<th style="border:1px solid #93C5FD; padding:6px;">${dr.name}<br/><span style="font-size:0.78rem; color:#2563EB;">(${dr.price}元)</span></th>`).join('')}
            </tr>
          </thead>
          <tbody>
            ${foods.map((fd, fi) => `
              <tr>
                <td style="border:1px solid #CBD5E1; padding:6px; font-weight:800; background:#F1F5F9;">${fd.name} (${fd.price}元)</td>
                ${drinks.map((dr, di) => {
                  const active = (fi === st.foodIdx && di === st.drinkIdx);
                  return `<td onclick="hlState.g3u9.foodIdx=${fi};hlState.g3u9.drinkIdx=${di};renderHlG3U9()" style="border:1px solid #CBD5E1; padding:8px; cursor:pointer; font-weight:900; background:${active ? '#FEF08A' : '#FFFFFF'}; color:${active ? '#B91C1C' : '#334155'}; transition:all 0.15s;">
                    ${fd.price + dr.price} 元 ${active ? '👈' : ''}
                  </td>`;
                }).join('')}
              </tr>
            `).join('')}
          </tbody>
        </table>
        <div style="margin-top:0.65rem; background:#EFF6FF; border-radius:8px; padding:0.5rem 0.75rem; font-weight:800; color:#1E40AF; font-size:0.92rem;">
          🧾 目前選擇：<strong>${f.name}(${f.price}元) ＋ ${d.name}(${d.price}元) ＝ 共 ${totalCost} 元</strong>（付 100 元找回 ${100 - totalCost} 元）
        </div>
      </div>

      <!-- 右側：9-3 珠子圖案規律 & 9-4 階梯方格數形規律 -->
      <div style="background:#FFFBEB; border:2px solid #FCD34D; border-radius:14px; padding:1rem;">
        <div style="font-weight:900; color:#92400E; font-size:1.05rem; margin-bottom:0.5rem;">📿 9-3 圖案規律（● ○ ○ 3顆一組循環）</div>
        <div style="display:flex; gap:5px; flex-wrap:wrap; align-items:center; background:white; padding:0.6rem; border-radius:10px; border:1px solid #FDE68A; margin-bottom:0.5rem;">
          ${Array.from({ length: 12 }, (_, idx) => {
            const n = idx + 1;
            const black = (n % 3 === 1);
            const isSel = (n === beadIdx);
            return `<div onclick="hlState.g3u9.beadCheckIdx=${n};renderHlG3U9()" style="width:32px; height:32px; border-radius:50%; background:${black ? '#1E293B' : '#FFFFFF'}; color:${black ? '#FFFFFF' : '#1E293B'}; border:2.5px solid ${isSel ? '#DC2626' : '#475569'}; display:flex; align-items:center; justify-content:center; font-size:0.78rem; font-weight:900; cursor:pointer; box-shadow:${isSel ? '0 0 0 3px #FCA5A5' : 'none'};">${n}</div>`;
          }).join('')}
        </div>
        <div style="font-size:0.9rem; font-weight:800; color:#B45309; margin-bottom:0.85rem;">
          🔍 點擊珠子編號：第 <strong>${beadIdx}</strong> 顆珠子是「<strong>${isBlackBead ? '● 黑珠 (每組第1顆)' : '○ 白珠'}</strong>」！
        </div>

        <hr style="border:none; border-top:1px dashed #F59E0B; margin:0.6rem 0;"/>
        <div style="font-weight:900; color:#92400E; font-size:1.02rem; margin-bottom:0.4rem;">🧱 9-4 數形規律：階梯方格遞減 (15 ➔ 10 ➔ 6 ➔ 3 ➔ 1)</div>
        <div style="display:flex; gap:0.8rem; align-items:flex-end; justify-content:space-around; background:white; padding:0.65rem; border-radius:10px; border:1px solid #FDE68A;">
          ${[5, 4, 3, 2, 1].map((rows, gIdx) => {
            const count = stepCounts[gIdx];
            return `<div style="text-align:center;">
              <div style="display:inline-flex; flex-direction:column; align-items:flex-start; gap:2px;">
                ${Array.from({ length: rows }, (_, r) => `
                  <div style="display:flex; gap:2px;">
                    ${Array.from({ length: r + 1 }, () => `<div style="width:11px; height:11px; background:#3B82F6; border-radius:2px;"></div>`).join('')}
                  </div>
                `).join('')}
              </div>
              <div style="font-size:0.78rem; font-weight:900; color:#1E293B; margin-top:4px;">圖${gIdx + 1}<br/><span style="color:#DC2626;">${count}格</span></div>
            </div>`;
          }).join('')}
        </div>
        <div style="font-size:0.85rem; color:#475569; margin-top:0.4rem; font-weight:700;">
          💡 相鄰兩圖相差：<strong>-5、-4、-3、-2</strong>，所以圖 5 剩下 3 － 2 ＝ <strong>1 個方格</strong>！
        </div>
      </div>
    </div>
  `;
}

function setHlG3U9Preset(foodIdx, drinkIdx, beadIdx, msg) {
  hlState.g3u9.foodIdx = foodIdx;
  hlState.g3u9.drinkIdx = drinkIdx;
  hlState.g3u9.beadCheckIdx = beadIdx;
  const t = document.getElementById('hlG3U9TaskText');
  if (t && msg) t.textContent = msg;
  renderHlG3U9();
}

function randomHlG3U9Task() {
  const fi = Math.floor(Math.random() * 4);
  const di = Math.floor(Math.random() * 3);
  const bi = Math.floor(Math.random() * 12) + 1;
  setHlG3U9Preset(fi, di, bi, `【隨機查表與規律挑戰】點選左方早餐價目表查看總金額，並檢視右方第 ${bi} 顆珠子的顏色規律！`);
}
window.renderHlG3U9 = renderHlG3U9;
window.setHlG3U9Preset = setHlG3U9Preset;
window.randomHlG3U9Task = randomHlG3U9Task;

/* ----- 3. 翰林 5上 第 9 單元：乘以幾分之一 (hl_g5_unit9) ----- */
function renderHlG5U9() {
  const wrap = document.getElementById('hlG5U9Display');
  if (!wrap) return;
  const st = hlState.g5u9;
  const a = st.pizzas;
  const b = st.people;
  const wholePart = Math.floor(a / b);
  const remPart = a % b;

  // 繪製 a 個披薩，每個切成 b 等份
  let pizzasSvg = '';
  for (let p = 0; p < a; p++) {
    const cx = 48, cy = 48, r = 40;
    let slices = '';
    for (let i = 0; i < b; i++) {
      const a1 = (i * 360 / b - 90) * Math.PI / 180;
      const a2 = ((i + 1) * 360 / b - 90) * Math.PI / 180;
      const x1 = cx + r * Math.cos(a1), y1 = cy + r * Math.sin(a1);
      const x2 = cx + r * Math.cos(a2), y2 = cy + r * Math.sin(a2);
      const isMine = (i === 0); // 每塊披薩拿 1/b 給第 1 個人
      slices += `<path d="M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 0 1 ${x2} ${y2} Z" fill="${isMine ? '#F59E0B' : '#FEF3C7'}" stroke="#B45309" stroke-width="1.8"/>`;
    }
    pizzasSvg += `
      <div style="text-align:center;">
        <svg width="96" height="96" viewBox="0 0 96 96">${slices}</svg>
        <div style="font-size:0.78rem; font-weight:800; color:#92400E;">拿 1/${b} 個</div>
      </div>
    `;
  }

  // 右側：整數 A 乘以 1/d 與除以 d 的等價關係
  const A = st.intVal;
  const d = st.unitDen;
  const resVal = Math.round((A / d) * 100) / 100;

  wrap.innerHTML = `
    <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(300px, 1fr)); gap:1.25rem;">
      <!-- 左側：9-1 分數表示整數相除的結果 (a ÷ b = a/b) -->
      <div style="background:#FFFBEB; border:2px solid #FCD34D; border-radius:14px; padding:1rem;">
        <div style="font-weight:900; color:#92400E; font-size:1.05rem; margin-bottom:0.5rem;">🍕 9-1 分數表示整數相除的結果（a ÷ b ＝ a/b）</div>
        <div style="display:flex; gap:0.75rem; align-items:center; flex-wrap:wrap; margin-bottom:0.65rem;">
          <label style="font-weight:800; font-size:0.9rem;">披薩個數 (a＝${a})：
            <input type="range" min="1" max="7" value="${a}" oninput="hlState.g5u9.pizzas=Number(this.value);renderHlG5U9()" style="width:90px; vertical-align:middle;"/>
          </label>
          <label style="font-weight:800; font-size:0.9rem;">平分人數 (b＝${b})：
            <input type="range" min="2" max="8" value="${b}" oninput="hlState.g5u9.people=Number(this.value);renderHlG5U9()" style="width:90px; vertical-align:middle;"/>
          </label>
        </div>
        <div style="display:flex; gap:0.4rem; flex-wrap:wrap; justify-content:center; background:white; padding:0.6rem; border-radius:10px; border:1px solid #FDE68A;">
          ${pizzasSvg}
        </div>
        <div style="margin-top:0.65rem; font-size:1.05rem; font-weight:900; color:#1E293B; text-align:center;">
          ${a} 個披薩平分給 ${b} 人：<strong>${a} ÷ ${b} ＝ ${a} × (1/${b}) ＝ <span style="color:#DC2626; font-size:1.25rem;">${a}/${b}</span> 個</strong>
          ${wholePart > 0 && remPart > 0 ? `<span style="color:#2563EB;">（＝ ${wholePart} 又 ${remPart}/${b} 個）</span>` : ''}
        </div>
      </div>

      <!-- 右側：9-2 & 9-3 整數乘以 1/b 與除以 b 等價 + 妮妮算式迷思診斷 -->
      <div style="background:#EFF6FF; border:2px solid #93C5FD; border-radius:14px; padding:1rem;">
        <div style="font-weight:900; color:#1E3A8A; font-size:1.05rem; margin-bottom:0.5rem;">🥮 9-2 & 9-3 整數乘以 1/b 等於除以 b（素養：蛋黃酥與芝麻粉）</div>
        <div style="display:flex; gap:0.75rem; align-items:center; flex-wrap:wrap; margin-bottom:0.65rem;">
          <label style="font-weight:800; font-size:0.9rem;">總數量 A (＝${A})：
            <input type="range" min="4" max="36" step="2" value="${A}" oninput="hlState.g5u9.intVal=Number(this.value);renderHlG5U9()" style="width:90px; vertical-align:middle;"/>
          </label>
          <label style="font-weight:800; font-size:0.9rem;">乘以 1/b (b＝${d})：
            <input type="range" min="2" max="9" value="${d}" oninput="hlState.g5u9.unitDen=Number(this.value);renderHlG5U9()" style="width:90px; vertical-align:middle;"/>
          </label>
        </div>
        <div style="background:white; border:1px solid #BFDBFE; border-radius:10px; padding:0.75rem; text-align:center; margin-bottom:0.65rem;">
          <div style="font-size:1.2rem; font-weight:900; color:#1E40AF;">
            ${A} × <span style="color:#DC2626;">(1/${d})</span> ＝ ${A} ÷ <span style="color:#DC2626;">${d}</span> ＝ <strong style="color:#047857; font-size:1.35rem;">${A % d === 0 ? (A / d) : `${A}/${d} (${Math.floor(A / d)}又${A % d}/${d})`}</strong>
          </div>
          <div style="font-size:0.86rem; color:#475569; margin-top:0.35rem;">
            💡 把 ${A} 平分成 ${d} 份取 1 份，所以「<strong>乘以 1/${d}</strong>」跟「<strong>除以 ${d}</strong>」結果完全相同！
          </div>
        </div>
        <div style="background:#FEF2F2; border:1.5px solid #FCA5A5; border-radius:10px; padding:0.65rem 0.85rem; font-size:0.88rem; line-height:1.65; color:#7F1D1D;">
          <strong>🩺 【素養學習單：誰的答案正確呢】迷思診斷：</strong><br/>
          • <strong>第1題</strong>：12 個蛋黃酥的 1/4 盒放進烤箱 ➔ 12 × 1/4 ＝ 12 ÷ 4 ＝ <strong>3 個</strong>（妮妮答對✅）。<br/>
          • <strong>第2題</strong>：18 公斤芝麻粉每 4 公斤裝一包 ➔ 妮妮算出剩下 2 公斤就寫「2 包」是錯的❌！剩下的 2 公斤還可裝 <strong>2/4 包</strong>，正確答案是 18 ÷ 4 ＝ <strong>18/4 ＝ 4 又 2/4 包</strong>！
        </div>
      </div>
    </div>
  `;
}

function setHlG5U9Preset(pizzas, people, intVal, unitDen, msg) {
  hlState.g5u9.pizzas = pizzas;
  hlState.g5u9.people = people;
  hlState.g5u9.intVal = intVal;
  hlState.g5u9.unitDen = unitDen;
  const t = document.getElementById('hlG5U9TaskText');
  if (t && msg) t.textContent = msg;
  renderHlG5U9();
}

function randomHlG5U9Task() {
  const p = Math.floor(Math.random() * 6) + 2;
  const b = Math.floor(Math.random() * 6) + 3;
  const A = (Math.floor(Math.random() * 8) + 2) * 3;
  setHlG5U9Preset(p, b, A, 3, `【隨機分數倍挑戰】左方：${p} 個披薩平分給 ${b} 人每人得 ${p}/${b} 個；右方：${A} × 1/3 ＝ ${A} ÷ 3 ＝ ${A / 3}！`);
}
window.renderHlG5U9 = renderHlG5U9;
window.setHlG5U9Preset = setHlG5U9Preset;
window.randomHlG5U9Task = randomHlG5U9Task;

/* ----- 4. 翰林 5上 第 10 單元：扇形 (hl_g5_unit10) ----- */
function gcdHl(a, b) { return b === 0 ? a : gcdHl(b, a % b); }

function renderHlG5U10() {
  const wrap = document.getElementById('hlG5U10Display');
  if (!wrap) return;
  const st = hlState.g5u10;
  const deg = st.deg;
  const g = gcdHl(deg, 360);
  const fNum = deg / g, fDen = 360 / g;

  const cx = 115, cy = 115, r = 88;
  const a1 = -Math.PI / 2;
  const a2 = a1 + (deg * Math.PI / 180);
  const x2 = cx + r * Math.cos(a2), y2 = cy + r * Math.sin(a2);
  const large = deg > 180 ? 1 : 0;

  // 康華拼成一個圓素養實驗室
  const pieceDegMap = { '1/2': 180, '1/3': 120, '1/4': 90, '1/6': 60, '1/8': 45, '1/12': 30 };
  const totalPuzzleDeg = st.puzzlePieces.reduce((acc, p) => acc + (pieceDegMap[p] || 0), 0);
  let curAngle = -90;
  const colors = ['#60A5FA', '#34D399', '#FBBF24', '#F87171', '#A78BFA', '#F472B6', '#2DD4BF'];
  let puzzlePaths = '';
  st.puzzlePieces.forEach((p, idx) => {
    const d = pieceDegMap[p] || 0;
    if (curAngle + 90 >= 360) return;
    const drawD = Math.min(d, 360 - (curAngle + 90));
    const r1 = curAngle * Math.PI / 180;
    const r2 = (curAngle + drawD) * Math.PI / 180;
    const px1 = cx + r * Math.cos(r1), py1 = cy + r * Math.sin(r1);
    const px2 = cx + r * Math.cos(r2), py2 = cy + r * Math.sin(r2);
    const lg = drawD > 180 ? 1 : 0;
    puzzlePaths += `<path d="M ${cx} ${cy} L ${px1} ${py1} A ${r} ${r} 0 ${lg} 1 ${px2} ${py2} Z" fill="${colors[idx % colors.length]}" stroke="#1E293B" stroke-width="2"/>`;
    curAngle += drawD;
  });

  wrap.innerHTML = `
    <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(300px, 1fr)); gap:1.25rem;">
      <!-- 左側：扇形圓心角與幾分之幾圓動態量角器 -->
      <div style="background:#F8FAFC; border:2px solid #CBD5E1; border-radius:14px; padding:1rem; text-align:center;">
        <div style="font-weight:900; color:#1E3A8A; font-size:1.05rem; margin-bottom:0.5rem;">📐 10-2 & 10-3 扇形圓心角與幾分之幾圓轉換儀</div>
        <div style="display:flex; gap:0.35rem; justify-content:center; flex-wrap:wrap; margin-bottom:0.5rem;">
          <button class="btn btn-outline" style="padding:2px 8px; font-size:0.8rem;" onclick="hlState.g5u10.deg=30;renderHlG5U10()">1/12圓(30°)</button>
          <button class="btn btn-outline" style="padding:2px 8px; font-size:0.8rem;" onclick="hlState.g5u10.deg=45;renderHlG5U10()">1/8圓(45°)</button>
          <button class="btn btn-outline" style="padding:2px 8px; font-size:0.8rem;" onclick="hlState.g5u10.deg=60;renderHlG5U10()">1/6圓(60°)</button>
          <button class="btn btn-outline" style="padding:2px 8px; font-size:0.8rem;" onclick="hlState.g5u10.deg=90;renderHlG5U10()">1/4圓(90°)</button>
          <button class="btn btn-outline" style="padding:2px 8px; font-size:0.8rem;" onclick="hlState.g5u10.deg=120;renderHlG5U10()">1/3圓(120°)</button>
          <button class="btn btn-outline" style="padding:2px 8px; font-size:0.8rem;" onclick="hlState.g5u10.deg=180;renderHlG5U10()">1/2圓(180°)</button>
        </div>
        <input type="range" min="15" max="360" step="15" value="${deg}" oninput="hlState.g5u10.deg=Number(this.value);renderHlG5U10()" style="width:85%; margin-bottom:0.4rem;"/>
        <div>
          <svg width="230" height="230" viewBox="0 0 230 230">
            <circle cx="${cx}" cy="${cy}" r="${r}" fill="#F1F5F9" stroke="#94A3B8" stroke-width="1.5" stroke-dasharray="4,3"/>
            ${deg === 360
              ? `<circle cx="${cx}" cy="${cy}" r="${r}" fill="#FDE68A" stroke="#D97706" stroke-width="2.5"/>`
              : `<path d="M ${cx} ${cy} L ${cx} ${cy - r} A ${r} ${r} 0 ${large} 1 ${x2} ${y2} Z" fill="#FDE68A" stroke="#D97706" stroke-width="2.5"/>`
            }
            <circle cx="${cx}" cy="${cy}" r="4.5" fill="#B91C1C"/>
            <text x="${cx}" y="${cy + 24}" text-anchor="middle" font-size="14" font-weight="900" fill="#B91C1C">${deg}°</text>
          </svg>
        </div>
        <div style="font-size:1.05rem; font-weight:900; color:#1E293B;">
          圓心角 <span style="color:#DC2626;">${deg}°</span> ＝ <span style="color:#2563EB;">${deg}/360</span> 圓 ＝ 最簡分數 <strong style="color:#047857; font-size:1.25rem;">${fDen === 1 ? '1 (整圓)' : `${fNum}/${fDen}`}</strong> 圓
        </div>
        <div style="font-size:0.85rem; color:#64748B; margin-top:0.25rem;">
          剩下的扇形圓心角：360° － ${deg}° ＝ <strong>${360 - deg}°</strong>
        </div>
      </div>

      <!-- 右側：素養學習單「拼成一個圓」互動拼圖 -->
      <div style="background:#FFFBEB; border:2px solid #FCD34D; border-radius:14px; padding:1rem; text-align:center;">
        <div style="font-weight:900; color:#92400E; font-size:1.05rem; margin-bottom:0.4rem;">🧩 【素養學習單：拼成一個圓】扇形拼圖實驗室 (半徑皆為 5cm)</div>
        <div style="font-size:0.85rem; color:#475569; margin-bottom:0.5rem;">點擊按鈕加入相同半徑的扇形，湊滿 <strong>360° (1個整圓)</strong>：</div>
        <div style="display:flex; gap:0.35rem; justify-content:center; flex-wrap:wrap; margin-bottom:0.5rem;">
          <button class="btn btn-primary" style="padding:3px 9px; font-size:0.82rem;" onclick="hlState.g5u10.puzzlePieces.push('1/2');renderHlG5U10()">＋ㄆ(1/2圓=180°)</button>
          <button class="btn btn-primary" style="padding:3px 9px; font-size:0.82rem;" onclick="hlState.g5u10.puzzlePieces.push('1/4');renderHlG5U10()">＋ㄅ(1/4圓=90°)</button>
          <button class="btn btn-primary" style="padding:3px 9px; font-size:0.82rem;" onclick="hlState.g5u10.puzzlePieces.push('1/8');renderHlG5U10()">＋ㄇ(1/8圓=45°)</button>
          <button class="btn btn-primary" style="padding:3px 9px; font-size:0.82rem;" onclick="hlState.g5u10.puzzlePieces.push('1/6');renderHlG5U10()">＋1/6圓(60°)</button>
          <button class="btn btn-outline" style="padding:3px 9px; font-size:0.82rem;" onclick="hlState.g5u10.puzzlePieces=[];renderHlG5U10()">🗑️ 清空重拼</button>
        </div>
        <svg width="210" height="210" viewBox="0 0 230 230">
          <circle cx="${cx}" cy="${cy}" r="${r}" fill="#FFFFFF" stroke="#CBD5E1" stroke-width="2" stroke-dasharray="5,4"/>
          ${puzzlePaths}
          <circle cx="${cx}" cy="${cy}" r="4" fill="#0F172A"/>
        </svg>
        <div style="font-size:0.92rem; font-weight:800; color:#1E293B; margin-top:0.25rem;">
          目前扇形：${st.puzzlePieces.length ? st.puzzlePieces.map(p => `${p}圓`).join(' ＋ ') : '尚未放入扇形'}
        </div>
        <div style="margin-top:0.4rem; padding:0.45rem; border-radius:8px; font-weight:900; font-size:0.92rem; background:${totalPuzzleDeg === 360 ? '#DCFCE7' : (totalPuzzleDeg > 360 ? '#FEE2E2' : '#EFF6FF')}; color:${totalPuzzleDeg === 360 ? '#166534' : (totalPuzzleDeg > 360 ? '#991B1B' : '#1E40AF')};">
          ${totalPuzzleDeg === 360
            ? '🎉 太棒了！圓心角總和剛好 360°，完美拼成 1 個完整的圓！'
            : (totalPuzzleDeg < 360
              ? `目前圓心角共 ${totalPuzzleDeg}°，還差 ${360 - totalPuzzleDeg}°（${(360 - totalPuzzleDeg) / gcdHl(360 - totalPuzzleDeg, 360)}/${360 / gcdHl(360 - totalPuzzleDeg, 360)} 圓）！`
              : `⚠️ 圓心角總和 ${totalPuzzleDeg}° 已經超過 360°（超出 ${totalPuzzleDeg - 360}°）囉！`)}
        </div>
      </div>
    </div>
  `;
}

function setHlG5U10Preset(deg, pieces, msg) {
  hlState.g5u10.deg = deg;
  hlState.g5u10.puzzlePieces = pieces.slice();
  const t = document.getElementById('hlG5U10TaskText');
  if (t && msg) t.textContent = msg;
  renderHlG5U10();
}

function randomHlG5U10Task() {
  const degs = [30, 45, 60, 72, 90, 120, 135, 150, 180, 240, 270];
  const d = degs[Math.floor(Math.random() * degs.length)];
  setHlG5U10Preset(d, ['1/2', '1/4'], `【隨機扇形挑戰】圓心角 ${d}° 的扇形是幾分之幾圓？右方已放入 1/2 圓和 1/4 圓，還差多少才能拼成一個圓？`);
}
window.renderHlG5U10 = renderHlG5U10;
window.setHlG5U10Preset = setHlG5U10Preset;
window.randomHlG5U10Task = randomHlG5U10Task;

/* ----- 5. 翰林 6上 第 5 單元：兩量關係 (hl_g6_unit5) ----- */
function renderHlG6U5() {
  const wrap = document.getElementById('hlG6U5Display');
  if (!wrap) return;
  const st = hlState.g6u5;
  const base = Number(st.baseVal);
  const r = Number(st.ratio);
  const comp = Math.round(base * r * 100) / 100;
  const sum = Math.round(base * (1 + r) * 100) / 100;
  const diff = Math.round(Math.abs(base * (r - 1)) * 100) / 100;

  const maxRatio = Math.max(1, r);
  const basePct = Math.min(100, Math.round((1 / (1 + maxRatio)) * 100));
  const compPct = Math.min(100, Math.round((r / (1 + maxRatio)) * 100));

  wrap.innerHTML = `
    <div style="background:#F8FAFC; border:2px solid #CBD5E1; border-radius:14px; padding:1.15rem;">
      <div style="display:flex; gap:1rem; align-items:center; flex-wrap:wrap; margin-bottom:1rem; background:white; padding:0.75rem 1rem; border-radius:10px; border:1px solid #E2E8F0;">
        <label style="font-weight:800; color:#1E40AF;">基準量 (當作 1)：
          <input type="number" step="0.1" value="${base}" min="0.1" max="5000" onchange="hlState.g6u5.baseVal=Number(this.value);renderHlG6U5()" style="width:85px; padding:4px 8px; font-weight:900; border:2px solid #3B82F6; border-radius:6px;"/> ${st.unit}
        </label>
        <label style="font-weight:800; color:#047857;">比值 (倍數 r)：
          <input type="number" step="0.1" value="${r}" min="0.1" max="20" onchange="hlState.g6u5.ratio=Number(this.value);renderHlG6U5()" style="width:75px; padding:4px 8px; font-weight:900; border:2px solid #10B981; border-radius:6px;"/> 倍
        </label>
        <button class="btn btn-primary" style="padding:5px 12px;" onclick="renderHlG6U5()">🔄 更新線段圖</button>
      </div>

      <!-- 動態基準量與比較量倍數線段圖 -->
      <div style="background:white; border:1.5px solid #CBD5E1; border-radius:12px; padding:1rem; margin-bottom:1rem;">
        <div style="margin-bottom:0.75rem;">
          <div style="display:flex; justify-content:space-between; font-weight:800; font-size:0.92rem; color:#1E40AF; margin-bottom:4px;">
            <span>🔵 ${st.baseName}（基準量 ＝ 1 倍）</span>
            <span><strong>${base} ${st.unit}</strong></span>
          </div>
          <div style="width:${Math.max(15, basePct)}%; height:26px; background:linear-gradient(90deg, #3B82F6, #2563EB); border-radius:6px; display:flex; align-items:center; justify-content:center; color:white; font-weight:900; font-size:0.82rem;">1 倍 (${base})</div>
        </div>
        <div>
          <div style="display:flex; justify-content:space-between; font-weight:800; font-size:0.92rem; color:#047857; margin-bottom:4px;">
            <span>🟢 ${st.compName}（比較量 ＝ ${r} 倍）</span>
            <span>${base} × ${r} ＝ <strong>${comp} ${st.unit}</strong></span>
          </div>
          <div style="width:${Math.max(15, compPct)}%; height:26px; background:linear-gradient(90deg, #10B981, #059669); border-radius:6px; display:flex; align-items:center; justify-content:center; color:white; font-weight:900; font-size:0.82rem;">${r} 倍 (${comp})</div>
        </div>
      </div>

      <!-- 三大關係公式卡片：比較量、兩量和、兩量差 -->
      <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(220px, 1fr)); gap:0.85rem;">
        <div style="background:#EFF6FF; border:2px solid #93C5FD; border-radius:12px; padding:0.85rem;">
          <div style="font-weight:900; color:#1E40AF; font-size:0.98rem;">1️⃣ 5-1 比較量與基準量</div>
          <div style="font-size:1.1rem; font-weight:900; color:#1E293B; margin:0.35rem 0;">
            ${base} × ${r} ＝ <span style="color:#2563EB;">${comp}</span> ${st.unit}
          </div>
          <div style="font-size:0.83rem; color:#475569;">逆算基準量：${comp} ÷ ${r} ＝ ${base} ${st.unit}</div>
        </div>
        <div style="background:#ECFDF5; border:2px solid #6EE7B7; border-radius:12px; padding:0.85rem;">
          <div style="font-weight:900; color:#047857; font-size:0.98rem;">2️⃣ 5-2 兩量的和 (1 ＋ r 倍)</div>
          <div style="font-size:1.1rem; font-weight:900; color:#1E293B; margin:0.35rem 0;">
            ${base} × (1 ＋ ${r}) ＝ <span style="color:#059669;">${sum}</span> ${st.unit}
          </div>
          <div style="font-size:0.83rem; color:#475569;">由和逆推基準量：${sum} ÷ ${(1 + r).toFixed(2).replace(/\.00$/, '')} ＝ ${base}</div>
        </div>
        <div style="background:#FEF3C7; border:2px solid #FCD34D; border-radius:12px; padding:0.85rem;">
          <div style="font-weight:900; color:#B45309; font-size:0.98rem;">3️⃣ 5-3 兩量的差 (|r － 1| 倍)</div>
          <div style="font-size:1.1rem; font-weight:900; color:#1E293B; margin:0.35rem 0;">
            ${base} × |${r} － 1| ＝ <span style="color:#D97706;">${diff}</span> ${st.unit}
          </div>
          <div style="font-size:0.83rem; color:#475569;">相差倍數：|${r} － 1| ＝ ${Math.abs(Math.round((r - 1) * 100) / 100)} 倍</div>
        </div>
      </div>
    </div>
  `;
}

function setHlG6U5Preset(baseVal, ratio, baseName, compName, unit, msg) {
  hlState.g6u5.baseVal = baseVal;
  hlState.g6u5.ratio = ratio;
  hlState.g6u5.baseName = baseName;
  hlState.g6u5.compName = compName;
  hlState.g6u5.unit = unit;
  const t = document.getElementById('hlG6U5TaskText');
  if (t && msg) t.textContent = msg;
  renderHlG6U5();
}

function randomHlG6U5Task() {
  const presets = [
    [600, 3, '椅子價錢', '桌子價錢', '元', '【隨機挑戰：桌椅兩量和】椅子 600 元，桌子是椅子的 3 倍，買一套桌椅共 600 × (1＋3) ＝ 2400 元！'],
    [1500, 0.8, '外套定價', '八折售價', '元', '【隨機挑戰：週年慶打折】外套定價 1500 元打八折(0.8倍)，售價 1200 元，便宜了 1500 × (1－0.8) ＝ 300 元！'],
    [25, 1.4, '去年產量', '今年產量(增四成)', '公噸', '【隨機挑戰：產量加成】去年產量 25 公噸，今年增加四成(1.4倍)，今年產量 25 × (1＋0.4) ＝ 35 公噸！']
  ];
  const p = presets[Math.floor(Math.random() * presets.length)];
  setHlG6U5Preset(p[0], p[1], p[2], p[3], p[4], p[5]);
}
window.renderHlG6U5 = renderHlG6U5;
window.setHlG6U5Preset = setHlG6U5Preset;
window.randomHlG6U5Task = randomHlG6U5Task;

/* ----- 6. 翰林 6上 第 8 單元：怎樣解題 (hl_g6_unit8) ----- */
function renderHlG6U8() {
  const wrap = document.getElementById('hlG6U8Display');
  if (!wrap) return;
  const st = hlState.g6u8;
  const intervals = Math.floor(st.roadKm / st.stepKm);
  const stationCount = st.endMode === 'both' ? intervals + 1 : (st.endMode === 'none' ? Math.max(0, intervals - 1) : intervals);

  // 8-2 空心正多邊形花片數：(每邊個數 - 1) × 邊數
  const hollowTokens = (st.polyPerSide - 1) * st.polySides;
  // 8-3 選擇與組合
  const totalCombos = st.cakeN * st.cookieN * st.drinkN;
  // 8-4 和差問題
  const bigNum = (st.sumVal + st.diffVal) / 2;
  const smallNum = (st.sumVal - st.diffVal) / 2;

  wrap.innerHTML = `
    <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(300px, 1fr)); gap:1.15rem;">
      <!-- 卡片1：8-1 馬拉松補給站間隔問題 & 8-2 空心正多邊形數形規則 -->
      <div style="background:#F8FAFC; border:2px solid #CBD5E1; border-radius:14px; padding:1rem;">
        <div style="font-weight:900; color:#1E3A8A; font-size:1.02rem; margin-bottom:0.4rem;">🏃 8-1 間隔問題：【素養：馬拉松補給站與救護站】</div>
        <div style="display:flex; gap:0.5rem; flex-wrap:wrap; align-items:center; margin-bottom:0.5rem; font-size:0.88rem;">
          <label style="font-weight:800;">全長：<input type="number" value="${st.roadKm}" min="6" max="120" step="3" onchange="hlState.g6u8.roadKm=Number(this.value);renderHlG6U8()" style="width:60px; padding:2px 6px; font-weight:900;"/> km</label>
          <label style="font-weight:800;">間隔：<input type="number" value="${st.stepKm}" min="1" max="30" onchange="hlState.g6u8.stepKm=Number(this.value);renderHlG6U8()" style="width:55px; padding:2px 6px; font-weight:900;"/> km</label>
          <select onchange="hlState.g6u8.endMode=this.value;renderHlG6U8()" style="padding:3px 6px; font-weight:800; border-radius:6px;">
            <option value="none" ${st.endMode === 'none' ? 'selected' : ''}>兩端都不設 (間隔－1)</option>
            <option value="both" ${st.endMode === 'both' ? 'selected' : ''}>兩端都設 (間隔＋1)</option>
            <option value="one" ${st.endMode === 'one' ? 'selected' : ''}>只設一端/環形 (＝間隔)</option>
          </select>
        </div>
        <div style="background:#EFF6FF; border-radius:8px; padding:0.55rem 0.75rem; font-size:0.92rem; font-weight:800; color:#1E40AF; margin-bottom:0.85rem;">
          間隔數 ＝ ${st.roadKm} ÷ ${st.stepKm} ＝ <strong>${intervals}</strong> 個間隔 ➔ 站數 ＝ <strong style="color:#DC2626; font-size:1.15rem;">${stationCount}</strong> 個站！
        </div>

        <hr style="border:none; border-top:1px dashed #CBD5E1; margin:0.65rem 0;"/>
        <div style="font-weight:900; color:#1E3A8A; font-size:1.02rem; margin-bottom:0.4rem;">🔺 8-2 數形規則：空心正多邊形花片總數</div>
        <div style="display:flex; gap:0.6rem; align-items:center; flex-wrap:wrap; margin-bottom:0.45rem; font-size:0.88rem;">
          <label style="font-weight:800;">正多邊形邊數：
            <select onchange="hlState.g6u8.polySides=Number(this.value);renderHlG6U8()" style="padding:3px 6px; font-weight:800; border-radius:6px;">
              <option value="3" ${st.polySides === 3 ? 'selected' : ''}>空心正三角形 (3邊)</option>
              <option value="4" ${st.polySides === 4 ? 'selected' : ''}>空心正方形 (4邊)</option>
              <option value="5" ${st.polySides === 5 ? 'selected' : ''}>空心正五邊形 (5邊)</option>
              <option value="6" ${st.polySides === 6 ? 'selected' : ''}>空心正六邊形 (6邊)</option>
            </select>
          </label>
          <label style="font-weight:800;">每邊花片數 N＝<strong>${st.polyPerSide}</strong>
            <input type="range" min="3" max="15" value="${st.polyPerSide}" oninput="hlState.g6u8.polyPerSide=Number(this.value);renderHlG6U8()" style="width:85px; vertical-align:middle;"/>
          </label>
        </div>
        <div style="background:#ECFDF5; border-radius:8px; padding:0.55rem 0.75rem; font-size:0.92rem; font-weight:800; color:#047857;">
          💡 扣掉重複頂點公式：(每邊 ${st.polyPerSide} － 1) × ${st.polySides} 條邊 ＝ <strong style="color:#DC2626; font-size:1.15rem;">${hollowTokens}</strong> 個花片！
        </div>
      </div>

      <!-- 卡片2：8-3 選擇與組合乘法原理 & 8-4 和差問題線段圖解器 -->
      <div style="background:#FFFBEB; border:2px solid #FCD34D; border-radius:14px; padding:1rem;">
        <div style="font-weight:900; color:#92400E; font-size:1.02rem; margin-bottom:0.4rem;">🍰 8-3 選擇與組合：【香香蛋糕店下午茶套餐】</div>
        <div style="display:flex; gap:0.5rem; flex-wrap:wrap; align-items:center; margin-bottom:0.45rem; font-size:0.88rem;">
          <label style="font-weight:800;">🍰蛋糕：<input type="number" value="${st.cakeN}" min="1" max="10" onchange="hlState.g6u8.cakeN=Number(this.value);renderHlG6U8()" style="width:50px; padding:2px 5px; font-weight:900;"/> 種</label>
          <label style="font-weight:800;">🍪餅乾：<input type="number" value="${st.cookieN}" min="1" max="10" onchange="hlState.g6u8.cookieN=Number(this.value);renderHlG6U8()" style="width:50px; padding:2px 5px; font-weight:900;"/> 種</label>
          <label style="font-weight:800;">🥤飲料：<input type="number" value="${st.drinkN}" min="1" max="10" onchange="hlState.g6u8.drinkN=Number(this.value);renderHlG6U8()" style="width:50px; padding:2px 5px; font-weight:900;"/> 種</label>
        </div>
        <div style="background:white; border:1px solid #FDE68A; border-radius:8px; padding:0.55rem 0.75rem; font-size:0.92rem; font-weight:800; color:#B45309; margin-bottom:0.85rem;">
          🌳 樹狀圖乘法原理：${st.cakeN} × ${st.cookieN} × ${st.drinkN} ＝ 共 <strong style="color:#DC2626; font-size:1.15rem;">${totalCombos}</strong> 種搭配方法！
        </div>

        <hr style="border:none; border-top:1px dashed #F59E0B; margin:0.65rem 0;"/>
        <div style="font-weight:900; color:#92400E; font-size:1.02rem; margin-bottom:0.4rem;">🧃 8-4 和差問題：【大小瓶果汁線段圖解器】</div>
        <div style="display:flex; gap:0.6rem; flex-wrap:wrap; align-items:center; margin-bottom:0.45rem; font-size:0.88rem;">
          <label style="font-weight:800;">兩數和：<input type="number" value="${st.sumVal}" step="10" onchange="hlState.g6u8.sumVal=Number(this.value);renderHlG6U8()" style="width:75px; padding:2px 6px; font-weight:900;"/></label>
          <label style="font-weight:800;">兩數差：<input type="number" value="${st.diffVal}" step="10" onchange="hlState.g6u8.diffVal=Number(this.value);renderHlG6U8()" style="width:70px; padding:2px 6px; font-weight:900;"/></label>
        </div>
        <div style="background:white; border:1px solid #FDE68A; border-radius:8px; padding:0.6rem 0.75rem; font-size:0.9rem; line-height:1.7;">
          <div>🔴 <strong>大數 ＝ (和 ＋ 差) ÷ 2</strong> ＝ (${st.sumVal} ＋ ${st.diffVal}) ÷ 2 ＝ <strong style="color:#DC2626; font-size:1.1rem;">${bigNum}</strong></div>
          <div>🔵 <strong>小數 ＝ (和 － 差) ÷ 2</strong> ＝ (${st.sumVal} － ${st.diffVal}) ÷ 2 ＝ <strong style="color:#2563EB; font-size:1.1rem;">${smallNum}</strong></div>
        </div>
      </div>
    </div>
  `;
}

function setHlG6U8Preset(roadKm, stepKm, endMode, polySides, polyPerSide, cakeN, cookieN, drinkN, sumVal, diffVal, msg) {
  Object.assign(hlState.g6u8, { roadKm, stepKm, endMode, polySides, polyPerSide, cakeN, cookieN, drinkN, sumVal, diffVal });
  const t = document.getElementById('hlG6U8TaskText');
  if (t && msg) t.textContent = msg;
  renderHlG6U8();
}

function randomHlG6U8Task() {
  const s = (Math.floor(Math.random() * 12) + 8) * 100;
  const d = (Math.floor(Math.random() * 4) + 1) * 50;
  const perSide = Math.floor(Math.random() * 8) + 5;
  setHlG6U8Preset(42, 3, 'none', 4, perSide, 4, 3, 4, s, d, `【隨機解題挑戰】每邊 ${perSide} 個花片的空心正方形共有 ${(perSide - 1) * 4} 個花片；兩數和 ${s}、差 ${d} 時，大數是 ${(s + d) / 2}、小數是 ${(s - d) / 2}！`);
}
window.renderHlG6U8 = renderHlG6U8;
window.setHlG6U8Preset = setHlG6U8Preset;
window.randomHlG6U8Task = randomHlG6U8Task;

/* =========================================================
   🎯 全站通用「觀念實作與互動練習挑戰引擎 (Interactive Concept Practice Lab)」
   確保所有出版社（康軒・南一・翰林）、所有年級（1上~6上）、所有單元（共169單元）
   在操作上方 CPA 互動教具的同時，都能直接在單元頁面內進行「觀念實作任務挑戰」！
   ========================================================= */
const practiceLabState = {
  secId: '',
  pub: 'kangxuan',
  grade: '3上',
  uNum: 1,
  qIdx: 0,
  paperIdx: 0,
  solvedCount: 0,
  showHint: false,
  feedbackHtml: '',
  feedbackType: ''
};

function getPracticeQuestionsForUnit(pub, grade, uNum) {
  let bank = null;
  if (pub === 'hanlin' && window.QUIZ_BANKS_HANLIN && window.QUIZ_BANKS_HANLIN[grade]) {
    bank = window.QUIZ_BANKS_HANLIN[grade];
  } else if (pub === 'nanyi' && window.QUIZ_BANKS_NANYI && window.QUIZ_BANKS_NANYI[grade]) {
    bank = window.QUIZ_BANKS_NANYI[grade];
  } else {
    if (grade === '1上' && typeof QUIZ_BANK_G1 !== 'undefined') bank = QUIZ_BANK_G1;
    else if (grade === '2上' && typeof QUIZ_BANK_G2 !== 'undefined') bank = QUIZ_BANK_G2;
    else if (grade === '4上' && typeof QUIZ_BANK_G4 !== 'undefined') bank = QUIZ_BANK_G4;
    else if (grade === '5上' && typeof QUIZ_BANK_G5 !== 'undefined') bank = QUIZ_BANK_G5;
    else if (grade === '6上' && typeof QUIZ_BANK_G6 !== 'undefined') bank = QUIZ_BANK_G6;
    else if (typeof QUIZ_BANK !== 'undefined') bank = QUIZ_BANK;
  }
  if (!bank || !bank[uNum]) return [];
  const flat = [];
  bank[uNum].forEach((paper, pIdx) => {
    if (Array.isArray(paper)) {
      paper.forEach((q, qIdx) => {
        flat.push(Object.assign({}, q, { pIdx, qIdx }));
      });
    }
  });
  return flat;
}

function renderUnitPracticeLab(secId, pub, grade, uNum) {
  const sec = document.getElementById(secId);
  if (!sec || secId === 'unit10') return;

  if (practiceLabState.secId !== secId || practiceLabState.pub !== pub || practiceLabState.grade !== grade || practiceLabState.uNum !== uNum) {
    practiceLabState.secId = secId;
    practiceLabState.pub = pub;
    practiceLabState.grade = grade;
    practiceLabState.uNum = uNum;
    practiceLabState.qIdx = 0;
    practiceLabState.showHint = false;
    practiceLabState.feedbackHtml = '';
    practiceLabState.feedbackType = '';
  }

  let container = sec.querySelector('.unit-interactive-practice-lab');
  if (!container) {
    container = document.createElement('div');
    container.className = 'workspace-card unit-interactive-practice-lab';
    container.style.marginTop = '1.25rem';
    container.style.borderTop = '4px solid #F59E0B';
    container.style.background = 'linear-gradient(180deg, #FFFBEB 0%, #FFFFFF 100%)';
    sec.appendChild(container);
  }

  const questions = getPracticeQuestionsForUnit(pub, grade, uNum);
  if (!questions.length) return;
  const q = questions[practiceLabState.qIdx % questions.length];
  const pubBadge = pub === 'hanlin' ? '📙 翰林版' : (pub === 'nanyi' ? '📗 南一版' : '📘 康軒版');

  let inputHtml = '';
  if (q.type === 'mc') {
    inputHtml = `
      <div style="display:flex; gap:0.5rem; flex-wrap:wrap; margin-top:0.65rem;">
        ${(q.options || []).map(opt => `
          <button class="btn btn-outline" style="font-weight:800; padding:0.45rem 0.9rem; background:white;" onclick="verifyUnitPracticeAns('${String(opt).replace(/'/g, "\\'")}')">
            ${opt}
          </button>
        `).join('')}
      </div>
    `;
  } else if (q.type === 'tf') {
    inputHtml = `
      <div style="display:flex; gap:0.75rem; margin-top:0.65rem;">
        <button class="btn btn-green" style="font-weight:900; padding:0.45rem 1.25rem;" onclick="verifyUnitPracticeAns('O')">⭕ 正確 (O)</button>
        <button class="btn btn-Amber" style="font-weight:900; padding:0.45rem 1.25rem; background:#EF4444; color:white;" onclick="verifyUnitPracticeAns('X')">❌ 錯誤 (X)</button>
      </div>
    `;
  } else if (q.type === 'cmp') {
    inputHtml = `
      <div style="display:flex; align-items:center; gap:0.65rem; flex-wrap:wrap; margin-top:0.65rem; background:#F8FAFC; padding:0.6rem 0.9rem; border-radius:10px; border:1px solid #CBD5E1;">
        <span style="font-weight:900; color:#1E3A8A; font-size:1.05rem;">【 ${q.left} 】</span>
        <button class="btn btn-outline" style="font-weight:900; font-size:1.15rem; padding:4px 14px;" onclick="verifyUnitPracticeAns('>')">＞</button>
        <button class="btn btn-outline" style="font-weight:900; font-size:1.15rem; padding:4px 14px;" onclick="verifyUnitPracticeAns('=')">＝</button>
        <button class="btn btn-outline" style="font-weight:900; font-size:1.15rem; padding:4px 14px;" onclick="verifyUnitPracticeAns('<')">＜</button>
        <span style="font-weight:900; color:#047857; font-size:1.05rem;">【 ${q.right} 】</span>
      </div>
    `;
  } else {
    inputHtml = `
      <div style="display:flex; gap:0.5rem; align-items:center; flex-wrap:wrap; margin-top:0.65rem;">
        <input type="text" id="unitPracticeFillInput_${secId}" placeholder="請先操作上方教具再輸入答案..." onkeydown="if(event.key==='Enter') verifyUnitPracticeFill('${secId}')" style="padding:0.5rem 0.85rem; font-size:1rem; font-weight:800; border:2px solid #F59E0B; border-radius:8px; width:230px; background:white;" />
        ${q.unitLabel ? `<span style="font-weight:800; color:#475569;">${q.unitLabel}</span>` : ''}
        <button class="btn btn-primary" onclick="verifyUnitPracticeFill('${secId}')">✅ 驗證實作結果</button>
      </div>
    `;
  }

  container.innerHTML = `
    <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:0.5rem; margin-bottom:0.65rem;">
      <div style="display:flex; align-items:center; gap:0.5rem; flex-wrap:wrap;">
        <span style="background:#F59E0B; color:white; font-weight:900; font-size:0.82rem; padding:3px 10px; border-radius:99px;">🎯 觀念實作與隨堂互動練習</span>
        <span style="font-weight:900; color:#92400E; font-size:1rem;">${pubBadge} ${grade} 第 ${uNum} 單元 — 邊操作教具、邊驗證觀念！（第 ${(practiceLabState.qIdx % questions.length) + 1} / ${questions.length} 題）</span>
      </div>
      <div style="display:flex; gap:0.4rem; align-items:center; flex-wrap:wrap;">
        <span style="background:#FEF3C7; border:1px solid #FCD34D; color:#B45309; font-weight:900; font-size:0.82rem; padding:3px 10px; border-radius:99px;">⭐ 已實作通過：${practiceLabState.solvedCount} 題</span>
        <button class="btn btn-outline" style="padding:4px 10px; font-size:0.82rem;" onclick="toggleUnitPracticeHint()">💡 實作提示</button>
        <button class="btn btn-Amber" style="padding:4px 12px; font-size:0.82rem;" onclick="nextUnitPracticeQuestion()">🎲 換一題實作練習</button>
      </div>
    </div>

    <div style="background:white; border:1.5px solid #FDE68A; border-radius:12px; padding:0.9rem 1.1rem;">
      <div style="font-size:1.05rem; font-weight:800; color:#1E293B; line-height:1.6;">
        📌 <strong>實作任務</strong>：${q.q}
      </div>
      ${inputHtml}
      ${practiceLabState.showHint ? `
        <div style="margin-top:0.65rem; background:#EFF6FF; border:1px solid #93C5FD; border-radius:8px; padding:0.55rem 0.85rem; font-size:0.9rem; color:#1E40AF; font-weight:700;">
          🧭 <strong>操作教具與解題引導</strong>：請先在上方互動教具區調整對應數值觀察變化！提示：${q.explain}
        </div>
      ` : ''}
      ${practiceLabState.feedbackHtml ? `
        <div style="margin-top:0.65rem; padding:0.6rem 0.9rem; border-radius:8px; font-weight:800; font-size:0.92rem; background:${practiceLabState.feedbackType === 'ok' ? '#DCFCE7' : '#FEE2E2'}; color:${practiceLabState.feedbackType === 'ok' ? '#166534' : '#991B1B'}; border:1px solid ${practiceLabState.feedbackType === 'ok' ? '#86EFAC' : '#FCA5A5'};">
          ${practiceLabState.feedbackHtml}
        </div>
      ` : ''}
    </div>
  `;
}

function verifyUnitPracticeFill(secId) {
  const inp = document.getElementById(`unitPracticeFillInput_${secId}`);
  if (!inp) return;
  verifyUnitPracticeAns(inp.value.trim());
}

function verifyUnitPracticeAns(userAns) {
  const questions = getPracticeQuestionsForUnit(practiceLabState.pub, practiceLabState.grade, practiceLabState.uNum);
  if (!questions.length) return;
  const q = questions[practiceLabState.qIdx % questions.length];
  const cleanUser = String(userAns || '').replace(/\s+/g, '').toLowerCase();
  const cleanAns = String(q.ans || '').replace(/\s+/g, '').toLowerCase();

  if (cleanUser && (cleanUser === cleanAns || (Number(cleanUser) === Number(cleanAns) && !isNaN(Number(cleanAns)) && cleanUser !== ''))) {
    practiceLabState.solvedCount++;
    practiceLabState.feedbackType = 'ok';
    practiceLabState.feedbackHtml = `🎉 <strong>實作驗證正確！太棒了！</strong> 正確答案是「<strong>${q.ans}</strong>」。<br/>💡 觀念解析：${q.explain}`;
  } else {
    practiceLabState.feedbackType = 'err';
    practiceLabState.feedbackHtml = `🤔 答案「${userAns || '未填寫'}」還差一點點喔！試著調整上方互動教具再算算看，或點選「💡 實作提示」！`;
  }
  renderUnitPracticeLab(practiceLabState.secId, practiceLabState.pub, practiceLabState.grade, practiceLabState.uNum);
}

function toggleUnitPracticeHint() {
  practiceLabState.showHint = !practiceLabState.showHint;
  renderUnitPracticeLab(practiceLabState.secId, practiceLabState.pub, practiceLabState.grade, practiceLabState.uNum);
}

function nextUnitPracticeQuestion() {
  const questions = getPracticeQuestionsForUnit(practiceLabState.pub, practiceLabState.grade, practiceLabState.uNum);
  if (!questions.length) return;
  practiceLabState.qIdx = (practiceLabState.qIdx + 1) % questions.length;
  practiceLabState.showHint = false;
  practiceLabState.feedbackHtml = '';
  practiceLabState.feedbackType = '';
  renderUnitPracticeLab(practiceLabState.secId, practiceLabState.pub, practiceLabState.grade, practiceLabState.uNum);
}

window.renderUnitPracticeLab = renderUnitPracticeLab;
window.verifyUnitPracticeFill = verifyUnitPracticeFill;
window.verifyUnitPracticeAns = verifyUnitPracticeAns;
window.toggleUnitPracticeHint = toggleUnitPracticeHint;
window.nextUnitPracticeQuestion = nextUnitPracticeQuestion;
