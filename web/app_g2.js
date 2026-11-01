/* =========================================================
   木新思達 國小二年級數學 (2上) 高互動教學樂園模組 - app_g2.js
   涵蓋 108 課綱 2上 全冊 10 大單元高階具體-圖像-抽象 (CPA) 互動教具
   ========================================================= */

// 2上 全域狀態
const g2State = {
  currentUnit: 1,
  // U1: 200以內的數
  u1: { num: 146 },
  // U2: 二位數的直式加減
  u2: { n1: 38, n2: 25, op: '+' },
  // U3: 量長度
  u3: { start: 0, end: 8 },
  // U4: 加減關係與應用
  u4: { a: 35, b: 25 },
  // U5: 面積的大小比較
  u5: { rowsA: 3, colsA: 4, rowsB: 2, colsB: 6 },
  // U6: 兩步驟的加減
  u6: { initial: 50, step1: 18, step2: 12, mode: 'sub_both' },
  // U7: 2、5、4、8的乘法
  u7: { base: 5, times: 4 },
  // U8: 幾時幾分
  u8: { hour: 8, minute: 25 },
  // U9: 3、6、9、7的乘法
  u9: { base: 9, times: 6 },
  // U10: 容量與重量
  u10: { mode: 'weight', itemLeft: 'melon', itemRight: 'pineapple', qtyRight: 4 }
};

/* 切換 2上 單元 */
function switchG2Unit(unitNum) {
  if (typeof playTone === 'function') playTone(440, 0.08);

  // 點擊線上測驗中心 (第 11 個頁籤)
  if (unitNum === 11) {
    for (let i = 1; i <= 10; i++) {
      const tab = document.getElementById(`g2UnitTab${i}`);
      const sec = document.getElementById(`g2_unit${i}`);
      if (tab) tab.classList.remove('active');
      if (sec) sec.classList.remove('active');
    }
    const tab11 = document.getElementById('g2UnitTab11');
    if (tab11) tab11.classList.add('active');
    const u10Sec = document.getElementById('unit10');
    if (u10Sec) u10Sec.classList.add('active');
    if (typeof setQuizGrade === 'function') setQuizGrade('2上');
    if (typeof renderQuizCenter === 'function') renderQuizCenter();
    return;
  }

  // 隱藏測驗中心與其他年級單元
  if (typeof hideAllGradeSections === 'function') hideAllGradeSections();

  for (let i = 1; i <= 10; i++) {
    const tab = document.getElementById(`g2UnitTab${i}`);
    const sec = document.getElementById(`g2_unit${i}`);
    if (tab) tab.classList.toggle('active', i === unitNum);
    if (sec) sec.classList.toggle('active', i === unitNum);
  }
  const tab11 = document.getElementById('g2UnitTab11');
  if (tab11) tab11.classList.remove('active');

  g2State.currentUnit = unitNum;

  // 渲染對應單元教具
  if (unitNum === 1) renderG2U1();
  else if (unitNum === 2) renderG2U2();
  else if (unitNum === 3) renderG2U3();
  else if (unitNum === 4) renderG2U4();
  else if (unitNum === 5) renderG2U5();
  else if (unitNum === 6) renderG2U6();
  else if (unitNum === 7) renderG2U7();
  else if (unitNum === 8) renderG2U8();
  else if (unitNum === 9) renderG2U9();
  else if (unitNum === 10) renderG2U10();

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function openG2UnitQuiz(unitNum) {
  if (typeof setQuizGrade === 'function') setQuizGrade('2上');
  switchG2Unit(11);
  if (typeof selectUnit === 'function') selectUnit(unitNum);
}

/* =========================================================
   單元 1：200以內的數 (百數定位板 + 百元鈔硬幣)
   ========================================================= */
function setG2U1Num(val) {
  g2State.u1.num = Math.max(100, Math.min(200, val));
  renderG2U1();
}

function renderG2U1() {
  const n = g2State.u1.num;
  const hundreds = Math.floor(n / 100);
  const tens = Math.floor((n % 100) / 10);
  const ones = n % 10;
  const wrap = document.getElementById('g2U1Display');
  if (!wrap) return;

  // 百元鈔票
  let billHtml = '';
  for (let i = 0; i < hundreds; i++) {
    billHtml += '<div style="width:72px; height:42px; background:#F87171; border:2px solid #B91C1C; border-radius:4px; display:inline-flex; align-items:center; justify-content:center; color:#FFFFFF; font-weight:900; font-size:0.95rem; margin:3px; box-shadow:0 2px 4px rgba(0,0,0,0.15);">100元</div>';
  }
  // 十元硬幣
  let tensHtml = '';
  for (let i = 0; i < tens; i++) {
    tensHtml += '<div style="width:34px; height:34px; border-radius:50%; background:#FBBF24; border:2px solid #B45309; display:inline-flex; align-items:center; justify-content:center; color:#78350F; font-weight:900; font-size:0.85rem; margin:2px;">10</div>';
  }
  // 一元硬幣
  let onesHtml = '';
  for (let i = 0; i < ones; i++) {
    onesHtml += '<div style="width:26px; height:26px; border-radius:50%; background:#E2E8F0; border:1.5px solid #64748B; display:inline-flex; align-items:center; justify-content:center; color:#334155; font-weight:900; font-size:0.8rem; margin:2px;">1</div>';
  }

  wrap.innerHTML = `
    <div style="background:#FFFFFF; border:2px solid #3B82F6; border-radius:14px; padding:1.25rem; text-align:center;">
      <div style="font-size:3.5rem; font-weight:900; color:#1E40AF; line-height:1; font-family:'Fredoka', sans-serif;">${n}</div>
      <div style="font-size:1.15rem; font-weight:800; color:#475569; margin:0.4rem 0;">
        包含 <strong>${hundreds} 個百</strong>、<strong>${tens} 個十</strong> 和 <strong>${ones} 個一</strong>
      </div>

      <!-- 控制項 -->
      <div style="display:flex; justify-content:center; gap:0.4rem; flex-wrap:wrap; margin:0.75rem 0;">
        <button class="btn btn-sm btn-outline" onclick="setG2U1Num(${n - 10})">－10</button>
        <button class="btn btn-sm btn-outline" onclick="setG2U1Num(${n - 1})">➖ 減 1</button>
        <button class="btn btn-sm btn-primary" onclick="setG2U1Num(${n + 1})">➕ 加 1</button>
        <button class="btn btn-sm btn-primary" onclick="setG2U1Num(${n + 10})">＋10</button>
        <button class="btn btn-sm btn-outline" onclick="setG2U1Num(100)">100</button>
        <button class="btn btn-sm btn-outline" onclick="setG2U1Num(150)">150</button>
        <button class="btn btn-sm btn-outline" onclick="setG2U1Num(200)">200</button>
      </div>

      <!-- 三位數三欄位值板 -->
      <div style="display:grid; grid-template-columns:1fr 1fr 1fr; gap:0.85rem; max-width:540px; margin:1rem auto 0 auto;">
        <div style="background:#FEF2F2; border:2px solid #EF4444; border-radius:10px; padding:0.75rem;">
          <div style="font-weight:900; color:#DC2626; border-bottom:2px solid #EF4444; padding-bottom:0.25rem;">百位 (${hundreds})</div>
          <div style="min-height:50px; display:flex; justify-content:center; align-items:center; flex-wrap:wrap; margin-top:0.4rem;">
            ${billHtml}
          </div>
        </div>
        <div style="background:#FEF3C7; border:2px solid #F59E0B; border-radius:10px; padding:0.75rem;">
          <div style="font-weight:900; color:#B45309; border-bottom:2px solid #F59E0B; padding-bottom:0.25rem;">十位 (${tens})</div>
          <div style="min-height:50px; display:flex; justify-content:center; align-items:center; flex-wrap:wrap; margin-top:0.4rem;">
            ${tensHtml || '<span style="color:#94A3B8;">無</span>'}
          </div>
        </div>
        <div style="background:#F1F5F9; border:2px solid #94A3B8; border-radius:10px; padding:0.75rem;">
          <div style="font-weight:900; color:#334155; border-bottom:2px solid #94A3B8; padding-bottom:0.25rem;">個位 (${ones})</div>
          <div style="min-height:50px; display:flex; justify-content:center; align-items:center; flex-wrap:wrap; margin-top:0.4rem;">
            ${onesHtml || '<span style="color:#94A3B8;">無</span>'}
          </div>
        </div>
      </div>
    </div>
  `;
}

/* =========================================================
   單元 2：二位數的直式加減 (進位紅標 + 借位綠標)
   ========================================================= */
function setG2U2(n1, n2, op) {
  g2State.u2.n1 = Math.max(10, Math.min(99, n1));
  g2State.u2.n2 = Math.max(1, Math.min(99, n2));
  g2State.u2.op = op;
  renderG2U2();
}

function renderG2U2() {
  const { n1, n2, op } = g2State.u2;
  const wrap = document.getElementById('g2U2Display');
  if (!wrap) return;

  let result = 0;
  let carry = false;
  let borrow = false;
  let noteText = '';

  const n1_tens = Math.floor(n1 / 10);
  const n1_ones = n1 % 10;
  const n2_tens = Math.floor(n2 / 10);
  const n2_ones = n2 % 10;

  if (op === '+') {
    result = n1 + n2;
    carry = (n1_ones + n2_ones) >= 10;
    if (carry) {
      noteText = `🔴 <strong>進位加法</strong>：個位 ${n1_ones} ＋ ${n2_ones} ＝ ${n1_ones + n2_ones}，滿十向十位進 1！十位算式：${n1_tens} ＋ ${n2_tens} ＋ 1 ＝ ${Math.floor(result / 10)}。`;
    } else {
      noteText = `🟢 <strong>不進位加法</strong>：個位 ${n1_ones} ＋ ${n2_ones} ＝ ${n1_ones + n2_ones}，十位 ${n1_tens} ＋ ${n2_tens} ＝ ${Math.floor(result / 10)}。`;
    }
  } else {
    // 減法確保 n1 >= n2
    const safeN1 = Math.max(n1, n2);
    const safeN2 = Math.min(n1, n2);
    result = safeN1 - safeN2;
    borrow = (safeN1 % 10) < (safeN2 % 10);
    if (borrow) {
      noteText = `🟠 <strong>借位減法</strong>：個位 ${safeN1 % 10} 不夠減 ${safeN2 % 10}，向十位借 1 當 10，10 ＋ ${safeN1 % 10} － ${safeN2 % 10} ＝ ${result % 10}！十位借出後剩餘 ${Math.floor(safeN1 / 10) - 1} － ${Math.floor(safeN2 / 10)} ＝ ${Math.floor(result / 10)}。`;
    } else {
      noteText = `🟢 <strong>不借位減法</strong>：個位 ${safeN1 % 10} － ${safeN2 % 10} ＝ ${result % 10}，十位相減 ＝ ${Math.floor(result / 10)}。`;
    }
  }

  wrap.innerHTML = `
    <div style="background:#FFFFFF; border:2px solid #10B981; border-radius:14px; padding:1.25rem;">
      <h5 style="color:#047857; font-weight:800; margin-bottom:0.75rem; font-size:1.15rem; text-align:center;">
        📝 二位數直式計算機（清楚標記進位與借位）
      </h5>

      <!-- 控制輸入 -->
      <div style="display:flex; justify-content:center; gap:0.6rem; align-items:center; flex-wrap:wrap; margin-bottom:1rem;">
        <input type="number" value="${n1}" min="10" max="99" style="width:65px; padding:0.35rem; font-weight:900; font-size:1.1rem; text-align:center;" onchange="setG2U2(parseInt(this.value), ${n2}, '${op}')"/>
        <select style="padding:0.35rem 0.5rem; font-weight:900; font-size:1.1rem;" onchange="setG2U2(${n1}, ${n2}, this.value)">
          <option value="+" ${op === '+' ? 'selected' : ''}>＋ 加法</option>
          <option value="-" ${op === '-' ? 'selected' : ''}>－ 減法</option>
        </select>
        <input type="number" value="${n2}" min="1" max="99" style="width:65px; padding:0.35rem; font-weight:900; font-size:1.1rem; text-align:center;" onchange="setG2U2(${n1}, parseInt(this.value), '${op}')"/>
        <button class="btn btn-primary" onclick="renderG2U2()">直式計算</button>
      </div>

      <!-- 直式表格 -->
      <div style="text-align:center;">
        <div class="g6-vertical-div" style="font-size:1.5rem; line-height:1.6; padding:1rem 2rem;">
          <!-- 進位或借位標記行 -->
          ${carry ? '<div style="color:#DC2626; font-size:0.95rem; font-weight:900; margin-bottom:-4px;">進 1 &nbsp;</div>' : ''}
          ${borrow ? '<div style="color:#D97706; font-size:0.95rem; font-weight:900; margin-bottom:-4px;">(借10)&nbsp;</div>' : ''}
          <div>&nbsp;&nbsp;${n1}</div>
          <div style="border-bottom:2.5px solid #334155;">${op} ${n2}</div>
          <div style="color:#2563EB; font-weight:900; font-size:1.75rem; margin-top:2px;">&nbsp;&nbsp;${result}</div>
        </div>
      </div>

      <!-- 解析說明卡 -->
      <div style="background:#F0FDF4; border:1px solid #BBF7D0; border-radius:8px; padding:0.85rem; margin-top:1rem; font-size:0.98rem; line-height:1.7; color:#065F46;">
        ${noteText}
      </div>
    </div>
  `;
}

/* =========================================================
   單元 3：量長度 (公分刻度尺拖拉測量)
   ========================================================= */
function setG2U3(start, end) {
  g2State.u3.start = Math.max(0, Math.min(10, start));
  g2State.u3.end = Math.max(g2State.u3.start + 1, Math.min(15, end));
  renderG2U3();
}

function renderG2U3() {
  const { start, end } = g2State.u3;
  const length = end - start;
  const wrap = document.getElementById('g2U3Display');
  if (!wrap) return;

  const unitPx = 32;
  const originX = 30;
  const objX = originX + start * unitPx;
  const objW = length * unitPx;

  wrap.innerHTML = `
    <div style="background:#FFFFFF; border:2px solid #F59E0B; border-radius:14px; padding:1.25rem;">
      <h5 style="color:#B45309; font-weight:800; margin-bottom:0.75rem; font-size:1.15rem; text-align:center;">
        📏 虛擬公分尺測量儀：不是從 0 開始也能精準量！
      </h5>

      <!-- SVG 刻度尺與物品 -->
      <svg viewBox="0 0 540 160" class="g6-diagram-svg" style="background:#FEF3C7;">
        <!-- 待測物品 (小木棒) -->
        <g transform="translate(${objX}, 25)">
          <rect x="0" y="0" width="${objW}" height="28" fill="#F97316" stroke="#C2410C" stroke-width="2" rx="4"/>
          <text x="${objW / 2}" y="19" font-size="12" font-weight="900" fill="#FFFFFF" text-anchor="middle">小木棒（${length} 公分）</text>
          <!-- 投影虛線 -->
          <line x1="0" y1="28" x2="0" y2="60" stroke="#EA580C" stroke-width="1.5" stroke-dasharray="3"/>
          <line x1="${objW}" y1="28" x2="${objW}" y2="60" stroke="#EA580C" stroke-width="1.5" stroke-dasharray="3"/>
        </g>

        <!-- 公分直尺 (0 ~ 15 cm) -->
        <g transform="translate(${originX}, 65)">
          <rect x="0" y="0" width="${15 * unitPx}" height="55" fill="#FFFBEB" stroke="#78350F" stroke-width="2" rx="4"/>
          ${Array.from({ length: 16 }).map((_, i) => `
            <line x1="${i * unitPx}" y1="0" x2="${i * unitPx}" y2="${i % 5 === 0 ? 25 : 14}" stroke="#78350F" stroke-width="${i % 5 === 0 ? 2 : 1}"/>
            <text x="${i * unitPx}" y="42" font-size="12" font-weight="800" fill="#78350F" text-anchor="middle">${i}</text>
          `).join('')}
          <text x="${15 * unitPx - 10}" y="20" font-size="10" font-weight="900" fill="#B45309">cm</text>
        </g>
      </svg>

      <!-- 控制項 -->
      <div style="display:flex; justify-content:center; gap:1.5rem; flex-wrap:wrap; margin-top:0.85rem;">
        <div>
          <span>起點刻度：</span>
          <button class="btn btn-sm btn-outline" onclick="setG2U3(${start - 1}, ${end})">➖</button>
          <span style="font-weight:900; margin:0 0.4rem;">${start} cm</span>
          <button class="btn btn-sm btn-outline" onclick="setG2U3(${start + 1}, ${end})">➕</button>
        </div>
        <div>
          <span>終點刻度：</span>
          <button class="btn btn-sm btn-outline" onclick="setG2U3(${start}, ${end - 1})">➖</button>
          <span style="font-weight:900; margin:0 0.4rem;">${end} cm</span>
          <button class="btn btn-sm btn-outline" onclick="setG2U3(${start}, ${end + 1})">➕</button>
        </div>
        <button class="btn btn-sm btn-primary" onclick="setG2U3(0, 8)">對齊 0 刻度</button>
      </div>

      <div style="background:#FFFBEB; border:1px solid #FCD34D; border-radius:8px; padding:0.75rem; margin-top:0.75rem; text-align:center; font-size:1.15rem; color:#78350F;">
        💡 <strong>測量計算公式</strong>：終點刻度 <strong>${end}</strong> － 起點刻度 <strong>${start}</strong> ＝ <strong>${length} 公分 (cm)</strong>！
      </div>
    </div>
  `;
}

/* =========================================================
   單元 4：加減關係與應用 (線段圖解構與加減互逆)
   ========================================================= */
function setG2U4(a, b) {
  g2State.u4.a = Math.max(5, Math.min(80, a));
  g2State.u4.b = Math.max(5, Math.min(80, b));
  renderG2U4();
}

function renderG2U4() {
  const { a, b } = g2State.u4;
  const total = a + b;
  const wrap = document.getElementById('g2U4Display');
  if (!wrap) return;

  wrap.innerHTML = `
    <div style="background:#FFFFFF; border:2px solid #8B5CF6; border-radius:14px; padding:1.25rem;">
      <h5 style="color:#6D28D9; font-weight:800; margin-bottom:0.75rem; font-size:1.15rem; text-align:center;">
        ⚖️ 加減互逆與線段圖：部分與全體的關係！
      </h5>

      <!-- 線段圖 SVG -->
      <svg viewBox="0 0 540 130" class="g6-diagram-svg" style="background:#F5F3FF;">
        <!-- 全部長度線段 -->
        <g transform="translate(60, 20)">
          <rect x="0" y="0" width="420" height="24" fill="#DDD6FE" stroke="#7C3AED" stroke-width="2" rx="3"/>
          <text x="210" y="17" font-size="13" font-weight="900" fill="#5B21B6" text-anchor="middle">全體總和 ＝ ${total}</text>
        </g>

        <!-- 兩部分拆解線段 -->
        <g transform="translate(60, 65)">
          <!-- 部分 A -->
          <rect x="0" y="0" width="${420 * (a / total)}" height="26" fill="#93C5FD" stroke="#1D4ED8" stroke-width="2" rx="3"/>
          <text x="${(420 * (a / total)) / 2}" y="18" font-size="12" font-weight="900" fill="#1E40AF" text-anchor="middle">部分 A (${a})</text>

          <!-- 部分 B -->
          <rect x="${420 * (a / total)}" y="0" width="${420 * (b / total)}" height="26" fill="#FCA5A5" stroke="#B91C1C" stroke-width="2" rx="3"/>
          <text x="${420 * (a / total) + (420 * (b / total)) / 2}" y="18" font-size="12" font-weight="900" fill="#991B1B" text-anchor="middle">部分 B (${b})</text>
        </g>
      </svg>

      <!-- 互逆算式三劍客 -->
      <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(150px, 1fr)); gap:0.75rem; margin-top:0.85rem; text-align:center;">
        <div style="background:#EFF6FF; border:1px solid #BFDBFE; border-radius:8px; padding:0.6rem; font-weight:900; color:#1D4ED8;">
          ${a} ＋ ${b} ＝ ${total}
        </div>
        <div style="background:#FEF2F2; border:1px solid #FECDD3; border-radius:8px; padding:0.6rem; font-weight:900; color:#DC2626;">
          ${total} － ${a} ＝ ${b}
        </div>
        <div style="background:#F0FDF4; border:1px solid #BBF7D0; border-radius:8px; padding:0.6rem; font-weight:900; color:#059669;">
          ${total} － ${b} ＝ ${a}
        </div>
      </div>
    </div>
  `;
}

/* =========================================================
   單元 5：面積的大小比較 (方格鋪設與拼貼比較)
   ========================================================= */
function setG2U5(rA, cA, rB, cB) {
  g2State.u5.rowsA = rA;
  g2State.u5.colsA = cA;
  g2State.u5.rowsB = rB;
  g2State.u5.colsB = cB;
  renderG2U5();
}

function renderG2U5() {
  const { rowsA, colsA, rowsB, colsB } = g2State.u5;
  const areaA = rowsA * colsA;
  const areaB = rowsB * colsB;
  const wrap = document.getElementById('g2U5Display');
  if (!wrap) return;

  wrap.innerHTML = `
    <div style="background:#FFFFFF; border:2px solid #06B6D4; border-radius:14px; padding:1.25rem;">
      <h5 style="color:#0E7490; font-weight:800; margin-bottom:0.75rem; font-size:1.15rem; text-align:center;">
        🔲 面積大小比一比：數數看鋪了幾個小方格！
      </h5>

      <div style="display:grid; grid-template-columns:1fr 1fr; gap:1.25rem; text-align:center;">
        <!-- 圖形 A -->
        <div style="background:#ECFEFF; border:2px solid #06B6D4; border-radius:10px; padding:1rem;">
          <h6 style="color:#0E7490; font-weight:900; margin:0 0 0.5rem 0;">甲圖形：${rowsA} 排 × ${colsA} 個 ＝ ${areaA} 格</h6>
          <div style="display:grid; grid-template-columns:repeat(${colsA}, 26px); gap:2px; justify-content:center; margin:0.5rem 0;">
            ${Array.from({ length: areaA }).map(() => '<div style="width:26px; height:26px; background:#67E8F9; border:1px solid #0891B2;"></div>').join('')}
          </div>
          <div style="margin-top:0.5rem;">
            <button class="btn btn-sm btn-outline" onclick="setG2U5(3, 4, ${rowsB}, ${colsB})">3×4=12格</button>
            <button class="btn btn-sm btn-outline" onclick="setG2U5(4, 4, ${rowsB}, ${colsB})">4×4=16格</button>
          </div>
        </div>

        <!-- 圖形 B -->
        <div style="background:#FEF3C7; border:2px solid #F59E0B; border-radius:10px; padding:1rem;">
          <h6 style="color:#B45309; font-weight:900; margin:0 0 0.5rem 0;">乙圖形：${rowsB} 排 × ${colsB} 個 ＝ ${areaB} 格</h6>
          <div style="display:grid; grid-template-columns:repeat(${colsB}, 26px); gap:2px; justify-content:center; margin:0.5rem 0;">
            ${Array.from({ length: areaB }).map(() => '<div style="width:26px; height:26px; background:#FDE68A; border:1px solid #D97706;"></div>').join('')}
          </div>
          <div style="margin-top:0.5rem;">
            <button class="btn btn-sm btn-outline" onclick="setG2U5(${rowsA}, ${colsA}, 2, 6)">2×6=12格</button>
            <button class="btn btn-sm btn-outline" onclick="setG2U5(${rowsA}, ${colsA}, 3, 5)">3×5=15格</button>
          </div>
        </div>
      </div>

      <div style="text-align:center; margin-top:1rem; font-size:1.2rem; font-weight:900; color:#1E3A8A; background:#F0FDF4; border:1px solid #BBF7D0; border-radius:8px; padding:0.6rem;">
        ${areaA > areaB ? `🏆 甲圖形（${areaA} 格）比 乙圖形（${areaB} 格）<strong>大 ${areaA - areaB} 格</strong>！` : areaB > areaA ? `🏆 乙圖形（${areaB} 格）比 甲圖形（${areaA} 格）<strong>大 ${areaB - areaA} 格</strong>！` : `✨ 兩者面積一樣大（都是 <strong>${areaA} 格</strong>）！形狀不同但面積相同！`}
      </div>
    </div>
  `;
}

/* =========================================================
   單元 6：兩步驟的加減 (公車上下車記帳階梯)
   ========================================================= */
function setG2U6(init, s1, s2, mode) {
  g2State.u6.initial = init;
  g2State.u6.step1 = s1;
  g2State.u6.step2 = s2;
  g2State.u6.mode = mode;
  renderG2U6();
}

function renderG2U6() {
  const { initial, step1, step2, mode } = g2State.u6;
  const wrap = document.getElementById('g2U6Display');
  if (!wrap) return;

  let mid = 0, final = 0, desc = '', expr = '';
  if (mode === 'sub_both') {
    mid = initial - step1;
    final = mid - step2;
    expr = `${initial} － ${step1} － ${step2} ＝ ${final}`;
    desc = `公車上原本有 ${initial} 人，第一站下車 ${step1} 人（剩 ${mid} 人），第二站又下車 ${step2} 人，最後車上還有 <strong>${final} 人</strong>！`;
  } else if (mode === 'add_both') {
    mid = initial + step1;
    final = mid + step2;
    expr = `${initial} ＋ ${step1} ＋ ${step2} ＝ ${final}`;
    desc = `原本有 ${initial} 人，第一站上車 ${step1} 人（變 ${mid} 人），第二站又上車 ${step2} 人，最後車上共有 <strong>${final} 人</strong>！`;
  } else {
    mid = initial - step1;
    final = mid + step2;
    expr = `${initial} － ${step1} ＋ ${step2} ＝ ${final}`;
    desc = `原本有 ${initial} 人，第一站下車 ${step1} 人（剩 ${mid} 人），第二站上車 ${step2} 人，最後車上有 <strong>${final} 人</strong>！`;
  }

  wrap.innerHTML = `
    <div style="background:#FFFFFF; border:2px solid #3B82F6; border-radius:14px; padding:1.25rem;">
      <h5 style="color:#1D4ED8; font-weight:800; margin-bottom:0.75rem; font-size:1.15rem; text-align:center;">
        🚌 公車上下車：分步兩步驟列式與運算！
      </h5>

      <!-- 情境切換 -->
      <div style="display:flex; justify-content:center; gap:0.5rem; flex-wrap:wrap; margin-bottom:1rem;">
        <button class="btn ${mode === 'sub_both' ? 'btn-primary' : 'btn-outline'}" onclick="setG2U6(50, 15, 12, 'sub_both')">連減情境 (下車又下車)</button>
        <button class="btn ${mode === 'add_both' ? 'btn-primary' : 'btn-outline'}" onclick="setG2U6(20, 15, 10, 'add_both')">連加情境 (上車又上車)</button>
        <button class="btn ${mode === 'sub_add' ? 'btn-primary' : 'btn-outline'}" onclick="setG2U6(40, 15, 20, 'sub_add')">加減混合 (下車又上車)</button>
      </div>

      <!-- 階梯圖解 -->
      <div style="background:#F8FAFC; border:1px solid #CBD5E1; border-radius:10px; padding:1rem; line-height:1.8; font-size:1.05rem;">
        <div>📌 <strong>生活情境</strong>：${desc}</div>
        <div style="margin-top:0.5rem; font-weight:900; color:#1E40AF; font-size:1.35rem; background:#FFFFFF; border:1px solid #93C5FD; border-radius:8px; padding:0.6rem; text-align:center;">
          算式：${expr}
        </div>
      </div>
    </div>
  `;
}

/* =========================================================
   單元 7：2、5、4、8的乘法 (倍數跳跳機 + 陣列點子圖)
   ========================================================= */
function setG2U7(b, t) {
  g2State.u7.base = b;
  g2State.u7.times = Math.max(1, Math.min(9, t));
  renderG2U7();
}

function renderG2U7() {
  const { base, times } = g2State.u7;
  const product = base * times;
  const wrap = document.getElementById('g2U7Display');
  if (!wrap) return;

  wrap.innerHTML = `
    <div style="background:#FFFFFF; border:2px solid #F59E0B; border-radius:14px; padding:1.25rem;">
      <h5 style="color:#B45309; font-weight:800; margin-bottom:0.75rem; font-size:1.15rem; text-align:center;">
        ✖️ 乘法跳跳機（${base} 的倍數）：連加變乘法！
      </h5>

      <!-- 基數選擇 -->
      <div style="display:flex; justify-content:center; gap:0.5rem; margin-bottom:1rem;">
        ${[2, 5, 4, 8].map(n => `
          <button class="btn ${base === n ? 'btn-primary' : 'btn-outline'}" onclick="setG2U7(${n}, ${times})">${n} 的乘法</button>
        `).join('')}
      </div>

      <!-- 倍數選擇 (1 ~ 9 倍) -->
      <div style="display:flex; justify-content:center; gap:4px; flex-wrap:wrap; margin-bottom:1rem;">
        ${[1, 2, 3, 4, 5, 6, 7, 8, 9].map(t => `
          <button class="btn btn-sm ${times === t ? 'btn-primary' : 'btn-outline'}" onclick="setG2U7(${base}, ${t})">${t}倍</button>
        `).join('')}
      </div>

      <!-- 陣列點子圖 -->
      <div style="background:#FEF3C7; border:1px solid #FCD34D; border-radius:10px; padding:1rem; text-align:center;">
        <div style="font-weight:800; color:#92400E; margin-bottom:0.4rem;">
          ${times} 排，每排有 ${base} 個：
        </div>
        <div style="display:inline-block; line-height:1.2;">
          ${Array.from({ length: times }).map(() => `
            <div>${Array.from({ length: base }).map(() => '<span style="font-size:1.5rem; margin:1px;">⭐</span>').join('')}</div>
          `).join('')}
        </div>
      </div>

      <div style="margin-top:0.85rem; font-size:1.8rem; font-weight:900; color:#1E3A8A; text-align:center; background:#EFF6FF; border:1px solid #BFDBFE; border-radius:8px; padding:0.6rem;">
        ${base} × ${times} ＝ <span style="color:#DC2626; font-size:2.2rem;">${product}</span>
      </div>
    </div>
  `;
}

/* =========================================================
   單元 8：幾時幾分 (精準時鐘與時間經過)
   ========================================================= */
function setG2U8(h, m) {
  g2State.u8.hour = Math.max(1, Math.min(12, h));
  g2State.u8.minute = Math.max(0, Math.min(59, m));
  renderG2U8();
}

function renderG2U8() {
  const { hour, minute } = g2State.u8;
  const wrap = document.getElementById('g2U8Display');
  if (!wrap) return;

  const minuteAngle = minute * 6; // 360 / 60 = 6 deg/min
  const hourAngle = ((hour % 12) * 30) + (minute * 0.5); // 30 deg/hr + 0.5 deg/min

  wrap.innerHTML = `
    <div style="background:#FFFFFF; border:2px solid #3B82F6; border-radius:14px; padding:1.25rem; text-align:center;">
      <h5 style="color:#1D4ED8; font-weight:800; margin-bottom:0.6rem; font-size:1.15rem;">
        ⏰ 精準時鐘旋轉儀：分針走 1 小格是 1 分鐘！
      </h5>

      <!-- SVG 鐘面 -->
      <svg viewBox="0 0 240 240" style="width:220px; height:220px; margin:0.5rem auto; display:block;">
        <circle cx="120" cy="120" r="100" fill="#FFFFFF" stroke="#334155" stroke-width="5"/>
        <circle cx="120" cy="120" r="92" fill="#F8FAFC" stroke="#CBD5E1" stroke-width="1.5"/>

        <!-- 60 個小刻度 -->
        ${Array.from({ length: 60 }).map((_, i) => {
          const isLarge = i % 5 === 0;
          const rad = (i * 6 - 90) * (Math.PI / 180);
          const x1 = 120 + 92 * Math.cos(rad);
          const y1 = 120 + 92 * Math.sin(rad);
          const x2 = 120 + (isLarge ? 82 : 87) * Math.cos(rad);
          const y2 = 120 + (isLarge ? 82 : 87) * Math.sin(rad);
          return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${isLarge ? '#1E293B' : '#94A3B8'}" stroke-width="${isLarge ? 2 : 1}"/>`;
        }).join('')}

        <!-- 12 個數字 -->
        ${Array.from({ length: 12 }).map((_, i) => {
          const num = i === 0 ? 12 : i;
          const rad = (num * 30 - 90) * (Math.PI / 180);
          const x = 120 + 72 * Math.cos(rad);
          const y = 120 + 72 * Math.sin(rad) + 5;
          return `<text x="${x}" y="${y}" font-size="14" font-weight="900" fill="#1E293B" text-anchor="middle">${num}</text>`;
        }).join('')}

        <circle cx="120" cy="120" r="6" fill="#1E40AF"/>
        <!-- 時針 (短紅) -->
        <line x1="120" y1="120" x2="${120 + 46 * Math.sin(hourAngle * Math.PI / 180)}" y2="${120 - 46 * Math.cos(hourAngle * Math.PI / 180)}" stroke="#DC2626" stroke-width="5" stroke-linecap="round"/>
        <!-- 分針 (長藍) -->
        <line x1="120" y1="120" x2="${120 + 72 * Math.sin(minuteAngle * Math.PI / 180)}" y2="${120 - 72 * Math.cos(minuteAngle * Math.PI / 180)}" stroke="#2563EB" stroke-width="3" stroke-linecap="round"/>
      </svg>

      <div style="font-size:1.6rem; font-weight:900; color:#1E40AF; margin:0.4rem 0;">
        現在是：<span style="color:#DC2626;">${hour} 點 ${minute < 10 ? '0' + minute : minute} 分</span>
      </div>

      <!-- 控制項 -->
      <div style="display:flex; justify-content:center; gap:0.5rem; flex-wrap:wrap; margin-top:0.75rem;">
        <button class="btn btn-sm btn-outline" onclick="setG2U8(${hour}, ${minute - 5})">－5 分鐘</button>
        <button class="btn btn-sm btn-outline" onclick="setG2U8(${hour}, ${minute + 5})">＋5 分鐘</button>
        <button class="btn btn-sm btn-primary" onclick="setG2U8(${hour + 1}, ${minute})">＋1 小時</button>
        <button class="btn btn-sm btn-outline" onclick="setG2U8(8, 0)">8:00</button>
        <button class="btn btn-sm btn-outline" onclick="setG2U8(8, 30)">8:30</button>
        <button class="btn btn-sm btn-outline" onclick="setG2U8(8, 45)">8:45</button>
      </div>
    </div>
  `;
}

/* =========================================================
   單元 9：3、6、9、7的乘法 (九九乘法表全貌探索宮格)
   ========================================================= */
function setG2U9(b, t) {
  g2State.u9.base = b;
  g2State.u9.times = Math.max(1, Math.min(9, t));
  renderG2U9();
}

function renderG2U9() {
  const { base, times } = g2State.u9;
  const product = base * times;
  const wrap = document.getElementById('g2U9Display');
  if (!wrap) return;

  wrap.innerHTML = `
    <div style="background:#FFFFFF; border:2px solid #8B5CF6; border-radius:14px; padding:1.25rem;">
      <h5 style="color:#6D28D9; font-weight:800; margin-bottom:0.75rem; font-size:1.15rem; text-align:center;">
        🧩 九九乘法表探索（${base} 的倍數）：乘法交換律！
      </h5>

      <div style="display:flex; justify-content:center; gap:0.5rem; margin-bottom:1rem;">
        ${[3, 6, 9, 7].map(n => `
          <button class="btn ${base === n ? 'btn-primary' : 'btn-outline'}" onclick="setG2U9(${n}, ${times})">${n} 的乘法</button>
        `).join('')}
      </div>

      <div style="display:flex; justify-content:center; gap:4px; flex-wrap:wrap; margin-bottom:1rem;">
        ${[1, 2, 3, 4, 5, 6, 7, 8, 9].map(t => `
          <button class="btn btn-sm ${times === t ? 'btn-primary' : 'btn-outline'}" onclick="setG2U9(${base}, ${t})">${t}倍</button>
        `).join('')}
      </div>

      <div style="text-align:center; font-size:1.8rem; font-weight:900; color:#1E3A8A; background:#F5F3FF; border:1px solid #DDD6FE; border-radius:10px; padding:1rem;">
        ${base} × ${times} ＝ <span style="color:#DC2626; font-size:2.2rem;">${product}</span><br/>
        <span style="font-size:1.15rem; font-weight:800; color:#6D28D9;">
          🔁 乘法交換律：${times} × ${base} 也是 <strong>${product}</strong>！
        </span>
      </div>

      ${base === 9 ? `
        <div style="margin-top:0.75rem; background:#FFFBEB; border:1px solid #FCD34D; border-radius:8px; padding:0.6rem; text-align:center; color:#92400E; font-size:0.95rem;">
          ✨ <strong>9 的神奇魔法</strong>：9×1=9, 9×2=18(1+8=9), 9×3=27(2+7=9)...十位和個位相加恆等於 9！
        </div>
      ` : ''}
    </div>
  `;
}

/* =========================================================
   單元 10：容量與重量 (倒水容量比較 + 蹺蹺板天平)
   ========================================================= */
function setG2U10(mode, itemL, itemR, qty) {
  g2State.u10.mode = mode;
  g2State.u10.itemLeft = itemL;
  g2State.u10.itemRight = itemR;
  g2State.u10.qtyRight = qty;
  renderG2U10();
}

function renderG2U10() {
  const { mode, itemLeft, itemRight, qtyRight } = g2State.u10;
  const wrap = document.getElementById('g2U10Display');
  if (!wrap) return;

  wrap.innerHTML = `
    <div style="background:#FFFFFF; border:2px solid #10B981; border-radius:14px; padding:1.25rem;">
      <h5 style="color:#047857; font-weight:800; margin-bottom:0.75rem; font-size:1.15rem; text-align:center;">
        ⚖️ 容量與重量實驗室：倒水法與天平平衡！
      </h5>

      <div style="display:flex; justify-content:center; gap:0.75rem; margin-bottom:1rem;">
        <button class="btn ${mode === 'weight' ? 'btn-primary' : 'btn-outline'}" onclick="setG2U10('weight', 'melon', 'pineapple', 4)">⚖️ 天平秤重量</button>
        <button class="btn ${mode === 'capacity' ? 'btn-primary' : 'btn-outline'}" onclick="setG2U10('capacity', 'pitcher', 'cup', 5)">🥤 杯子倒水比容量</button>
      </div>

      ${mode === 'weight' ? `
        <!-- 天平圖解 -->
        <div style="background:#ECFDF5; border:1px solid #A7F3D0; border-radius:12px; padding:1.25rem; text-align:center;">
          <div style="font-weight:900; color:#065F46; font-size:1.2rem; margin-bottom:0.5rem;">
            天平剛好平衡：1 顆大西瓜 🍉 剛好等於 4 顆鳳梨 🍍 的重量！
          </div>
          <div style="display:flex; justify-content:center; align-items:center; gap:2rem; margin:1rem 0;">
            <div style="background:#FFFFFF; border:2px solid #10B981; border-radius:10px; padding:0.75rem 1.25rem;">
              <span style="font-size:2.8rem;">🍉</span>
              <div style="font-weight:800; color:#065F46;">左盤：1 顆西瓜</div>
            </div>
            <span style="font-size:2.5rem; font-weight:900; color:#047857;">＝</span>
            <div style="background:#FFFFFF; border:2px solid #10B981; border-radius:10px; padding:0.75rem 1.25rem;">
              <span style="font-size:2.8rem;">🍍🍍🍍🍍</span>
              <div style="font-weight:800; color:#065F46;">右盤：4 顆鳳梨</div>
            </div>
          </div>
          <div style="color:#047857; font-size:0.95rem;">
            💡 <strong>重量代換推理</strong>：如果 1 顆鳳梨等於 3 顆芒果，那麼 1 顆西瓜就等於 4 × 3 ＝ <strong>12 顆芒果</strong>！
          </div>
        </div>
      ` : `
        <!-- 倒水圖解 -->
        <div style="background:#EFF6FF; border:1px solid #BFDBFE; border-radius:12px; padding:1.25rem; text-align:center;">
          <div style="font-weight:900; color:#1E40AF; font-size:1.2rem; margin-bottom:0.5rem;">
            水壺容量剛好可以倒滿 5 個小茶杯！
          </div>
          <div style="display:flex; justify-content:center; align-items:center; gap:1.5rem; margin:1rem 0;">
            <div style="background:#FFFFFF; border:2px solid #3B82F6; border-radius:10px; padding:0.75rem 1.25rem;">
              <span style="font-size:3rem;">🏺</span>
              <div style="font-weight:800; color:#1E40AF;">大水壺 1 瓶</div>
            </div>
            <span style="font-size:2.5rem; font-weight:900; color:#2563EB;">＝</span>
            <div style="background:#FFFFFF; border:2px solid #3B82F6; border-radius:10px; padding:0.75rem 1.25rem;">
              <span style="font-size:2.2rem;">🥤🥤🥤🥤🥤</span>
              <div style="font-weight:800; color:#1E40AF;">倒滿 5 個相同杯子</div>
            </div>
          </div>
          <div style="color:#1E40AF; font-size:0.95rem;">
            💡 <strong>容量守恆性</strong>：不管把水倒進高高瘦瘦的杯子還是矮矮胖胖的碗裡，水的總量都不會改變！
          </div>
        </div>
      `}
    </div>
  `;
}

// 初始化 2上 模組
function initG2App() {
  renderG2U1();
}

if (typeof window !== 'undefined') {
  window.switchG2Unit = switchG2Unit;
  window.openG2UnitQuiz = openG2UnitQuiz;
  window.initG2App = initG2App;
  window.setG2U1Num = setG2U1Num;
  window.setG2U2 = setG2U2;
  window.setG2U3 = setG2U3;
  window.setG2U4 = setG2U4;
  window.setG2U5 = setG2U5;
  window.setG2U6 = setG2U6;
  window.setG2U7 = setG2U7;
  window.setG2U8 = setG2U8;
  window.setG2U9 = setG2U9;
  window.setG2U10 = setG2U10;
  window.renderG2U1 = renderG2U1;
  window.renderG2U2 = renderG2U2;
  window.renderG2U3 = renderG2U3;
  window.renderG2U4 = renderG2U4;
  window.renderG2U5 = renderG2U5;
  window.renderG2U6 = renderG2U6;
  window.renderG2U7 = renderG2U7;
  window.renderG2U8 = renderG2U8;
  window.renderG2U9 = renderG2U9;
  window.renderG2U10 = renderG2U10;
}
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    renderG2U1, renderG2U2, renderG2U3, renderG2U4, renderG2U5,
    renderG2U6, renderG2U7, renderG2U8, renderG2U9, renderG2U10,
    switchG2Unit, openG2UnitQuiz, initG2App
  };
}
