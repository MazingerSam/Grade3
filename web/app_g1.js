/* =========================================================
   木新思達 國小一年級數學 (1上) 高互動教學樂園模組 - app_g1.js
   涵蓋 108 課綱 1上 全冊 9 大單元高階具體-圖像-抽象 (CPA) 互動教具
   ========================================================= */

// 1上 全域狀態
const g1State = {
  currentUnit: 1,
  // U1: 10以內的數
  u1: { count: 6 },
  // U2: 比長短
  u2: { lenA: 7, lenB: 5, aligned: true },
  // U3: 排順序、比多少
  u3: { selectedIdx: 2, numA: 6, numB: 4 },
  // U4: 分與合
  u4: { total: 10, left: 6 },
  // U5: 方盒、圓罐、球
  u5: { selectedShape: 'box' },
  // U6: 30以內的數
  u6: { num: 24 },
  // U7: 10以內的加法
  u7: { a: 4, b: 3 },
  // U8: 10以內的減法
  u8: { a: 8, b: 3 },
  // U9: 幾點鐘
  u9: { hour: 3, isHalf: false }
};

/* 切換 1上 單元 */
function switchG1Unit(unitNum) {
  if (typeof playTone === 'function') playTone(440, 0.08);

  // 點擊線上測驗中心 (第 10 個頁籤)
  if (unitNum === 10) {
    for (let i = 1; i <= 9; i++) {
      const tab = document.getElementById(`g1UnitTab${i}`);
      const sec = document.getElementById(`g1_unit${i}`);
      if (tab) tab.classList.remove('active');
      if (sec) sec.classList.remove('active');
    }
    const tab10 = document.getElementById('g1UnitTab10');
    if (tab10) tab10.classList.add('active');
    const u10Sec = document.getElementById('unit10');
    if (u10Sec) u10Sec.classList.add('active');
    if (typeof setQuizGrade === 'function') setQuizGrade('1上');
    if (typeof renderQuizCenter === 'function') renderQuizCenter();
    return;
  }

  // 隱藏測驗中心與其他年級單元
  if (typeof hideAllGradeSections === 'function') hideAllGradeSections();

  for (let i = 1; i <= 9; i++) {
    const tab = document.getElementById(`g1UnitTab${i}`);
    const sec = document.getElementById(`g1_unit${i}`);
    if (tab) tab.classList.toggle('active', i === unitNum);
    if (sec) {
      sec.classList.toggle('active', i === unitNum);
      sec.style.display = (i === unitNum ? 'block' : 'none');
    }
  }
  const tab10 = document.getElementById('g1UnitTab10');
  if (tab10) tab10.classList.remove('active');

  g1State.currentUnit = unitNum;

  // 渲染對應單元教具
  if (unitNum === 1) renderG1U1();
  else if (unitNum === 2) renderG1U2();
  else if (unitNum === 3) renderG1U3();
  else if (unitNum === 4) renderG1U4();
  else if (unitNum === 5) renderG1U5();
  else if (unitNum === 6) renderG1U6();
  else if (unitNum === 7) renderG1U7();
  else if (unitNum === 8) renderG1U8();
  else if (unitNum === 9) renderG1U9();

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function openG1UnitQuiz(unitNum) {
  if (typeof setQuizGrade === 'function') setQuizGrade('1上');
  switchG1Unit(10);
  if (typeof selectUnit === 'function') selectUnit(unitNum);
}

/* =========================================================
   單元 1：10以內的數 (積木火車 + 點子卡 + 國字數字)
   ========================================================= */
function setG1U1Count(val) {
  g1State.u1.count = Math.max(0, Math.min(10, val));
  renderG1U1();
}

function renderG1U1() {
  const c = g1State.u1.count;
  const numChinese = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九', '十'];
  const zhDigits = ['零', '壹', '貳', '參', '肆', '伍', '陸', '柒', '捌', '玖', '拾'];

  const wrap = document.getElementById('g1U1Display');
  if (!wrap) return;

  // 積木積木方塊
  let blocksHtml = '';
  for (let i = 1; i <= 10; i++) {
    const active = i <= c;
    const bg = active ? '#3B82F6' : '#F1F5F9';
    const border = active ? '#1D4ED8' : '#CBD5E1';
    const textCol = active ? '#FFFFFF' : '#94A3B8';
    blocksHtml += `
      <div onclick="setG1U1Count(${i})" style="width:38px; height:38px; border-radius:8px; background:${bg}; border:2px solid ${border}; display:flex; align-items:center; justify-content:center; font-weight:900; font-size:1.15rem; color:${textCol}; cursor:pointer; transition:all 0.15s; box-shadow:${active ? '0 2px 4px rgba(59,130,246,0.3)' : 'none'};">
        ${i}
      </div>
    `;
  }

  // 點子卡 (5 個一排的雙色十格陣列圖)
  let dotsHtml = '';
  for (let i = 1; i <= 10; i++) {
    const filled = i <= c;
    dotsHtml += `
      <div style="width:32px; height:32px; border-radius:50%; background:${filled ? '#EF4444' : '#E2E8F0'}; border:2px solid ${filled ? '#B91C1C' : '#CBD5E1'}; display:inline-block; margin:3px; transition:all 0.2s;"></div>
    `;
    if (i === 5) dotsHtml += '<span style="display:inline-block; width:14px;"></span>';
  }

  wrap.innerHTML = `
    <div style="background:#FFFFFF; border:2px solid #3B82F6; border-radius:14px; padding:1.25rem; text-align:center; box-shadow:0 4px 6px rgba(0,0,0,0.03);">
      <div style="font-size:3.5rem; font-weight:900; color:#1E40AF; line-height:1; font-family:'Fredoka', sans-serif;">${c}</div>
      <div style="font-size:1.25rem; font-weight:800; color:#475569; margin-top:0.4rem;">
        國字讀作：<span style="color:#DC2626; font-size:1.45rem;">${numChinese[c]}</span>（大寫：${zhDigits[c]}）
      </div>

      <!-- 控制按鈕 -->
      <div style="display:flex; justify-content:center; gap:0.75rem; align-items:center; margin:1rem 0;">
        <button class="btn btn-outline" style="font-size:1.2rem; padding:0.3rem 1rem;" onclick="setG1U1Count(${c - 1})">➖ 減 1</button>
        <button class="btn btn-primary" style="font-size:1.2rem; padding:0.3rem 1rem;" onclick="setG1U1Count(${c + 1})">➕ 加 1</button>
        <button class="btn btn-outline" onclick="setG1U1Count(0)">歸零 (0)</button>
        <button class="btn btn-outline" onclick="setG1U1Count(10)">滿十 (10)</button>
      </div>

      <!-- 十格陣列點子卡 -->
      <div style="background:#FEF2F2; border:1px solid #FECDD3; border-radius:10px; padding:0.85rem; margin:1rem auto; max-width:440px;">
        <div style="font-size:0.92rem; font-weight:800; color:#991B1B; margin-bottom:0.4rem;">🔴 十格點子卡（5 個一組快速看出數量）：</div>
        <div style="display:flex; justify-content:center; align-items:center;">
          ${dotsHtml}
        </div>
      </div>

      <!-- 積木排排看 -->
      <div style="margin-top:1rem;">
        <div style="font-size:0.92rem; font-weight:800; color:#334155; margin-bottom:0.4rem;">🟦 點擊積木可以直接選取數量：</div>
        <div style="display:flex; justify-content:center; gap:6px; flex-wrap:wrap;">
          ${blocksHtml}
        </div>
      </div>
    </div>
  `;
}

/* =========================================================
   單元 2：比長短 (基準線對齊開關 + 方格尺測量)
   ========================================================= */
function toggleG1U2Align() {
  g1State.u2.aligned = !g1State.u2.aligned;
  renderG1U2();
}

function setG1U2Len(which, delta) {
  if (which === 'A') {
    g1State.u2.lenA = Math.max(1, Math.min(10, g1State.u2.lenA + delta));
  } else {
    g1State.u2.lenB = Math.max(1, Math.min(10, g1State.u2.lenB + delta));
  }
  renderG1U2();
}

function renderG1U2() {
  const { lenA, lenB, aligned } = g1State.u2;
  const wrap = document.getElementById('g1U2Display');
  if (!wrap) return;

  const unitPx = 36;
  const startA = aligned ? 60 : 30;
  const startB = aligned ? 60 : 90;
  const wA = lenA * unitPx;
  const wB = lenB * unitPx;

  let compareText = '';
  if (lenA > lenB) {
    compareText = `🔴 紅色鉛筆（${lenA} 格）比 🔵 藍色鉛筆（${lenB} 格）<strong>長 ${lenA - lenB} 格</strong>！`;
  } else if (lenB > lenA) {
    compareText = `🔵 藍色鉛筆（${lenB} 格）比 🔴 紅色鉛筆（${lenA} 格）<strong>長 ${lenB - lenA} 格</strong>！`;
  } else {
    compareText = `兩枝鉛筆一樣長（都是 <strong>${lenA} 格</strong>）！`;
  }

  wrap.innerHTML = `
    <div style="background:#FFFFFF; border:2px solid #10B981; border-radius:14px; padding:1.25rem; text-align:center;">
      <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:0.5rem; margin-bottom:1rem;">
        <div style="font-weight:800; color:#047857; font-size:1.1rem;">
          📏 鉛筆長度實驗室（一格 ＝ 1 個單位長）
        </div>
        <div>
          <button class="btn ${aligned ? 'btn-primary' : 'btn-outline'}" onclick="toggleG1U2Align()">
            ${aligned ? '✅ 基準線已對齊（公平比較）' : '⚠️ 基準線未對齊（容易看錯！）'}
          </button>
        </div>
      </div>

      <!-- 繪製 SVG 鉛筆對齊圖 -->
      <svg viewBox="0 0 540 180" class="g6-diagram-svg" style="background:#F8FAFC;">
        <!-- 方格底網 -->
        ${Array.from({ length: 12 }).map((_, i) => `
          <line x1="${60 + i * unitPx}" y1="20" x2="${60 + i * unitPx}" y2="160" stroke="#E2E8F0" stroke-width="1" stroke-dasharray="2"/>
          <text x="${60 + i * unitPx}" y="15" font-size="10" fill="#94A3B8" text-anchor="middle">${i}</text>
        `).join('')}

        <!-- 基準線 (紅色垂直線) -->
        <line x1="60" y1="20" x2="60" y2="160" stroke="#DC2626" stroke-width="2.5"/>
        <text x="60" y="175" font-size="11" font-weight="900" fill="#DC2626" text-anchor="middle">基準對齊線</text>

        <!-- 鉛筆 A (紅色) -->
        <g transform="translate(${startA}, 40)">
          <rect x="0" y="0" width="${wA - 15}" height="28" fill="#F87171" stroke="#DC2626" stroke-width="2" rx="3"/>
          <polygon points="${wA - 15},0 ${wA},14 ${wA - 15},28" fill="#FBBF24" stroke="#D97706" stroke-width="1.5"/>
          <text x="12" y="19" font-size="12" font-weight="bold" fill="#7F1D1D">紅色鉛筆 A (${lenA}格)</text>
        </g>

        <!-- 鉛筆 B (藍色) -->
        <g transform="translate(${startB}, 95)">
          <rect x="0" y="0" width="${wB - 15}" height="28" fill="#60A5FA" stroke="#2563EB" stroke-width="2" rx="3"/>
          <polygon points="${wB - 15},0 ${wB},14 ${wB - 15},28" fill="#FBBF24" stroke="#D97706" stroke-width="1.5"/>
          <text x="12" y="19" font-size="12" font-weight="bold" fill="#1E3A8A">藍色鉛筆 B (${lenB}格)</text>
        </g>
      </svg>

      <!-- 控制調整長度 -->
      <div style="display:flex; justify-content:center; gap:1.5rem; flex-wrap:wrap; margin-top:0.85rem;">
        <div style="background:#FEF2F2; border:1px solid #FECDD3; border-radius:8px; padding:0.5rem 0.85rem;">
          <span style="font-weight:800; color:#DC2626;">紅鉛筆 A：</span>
          <button class="btn btn-sm btn-outline" onclick="setG1U2Len('A', -1)">➖</button>
          <span style="font-weight:900; font-size:1.15rem; margin:0 0.4rem;">${lenA} 格</span>
          <button class="btn btn-sm btn-outline" onclick="setG1U2Len('A', 1)">➕</button>
        </div>
        <div style="background:#EFF6FF; border:1px solid #BFDBFE; border-radius:8px; padding:0.5rem 0.85rem;">
          <span style="font-weight:800; color:#2563EB;">藍鉛筆 B：</span>
          <button class="btn btn-sm btn-outline" onclick="setG1U2Len('B', -1)">➖</button>
          <span style="font-weight:900; font-size:1.15rem; margin:0 0.4rem;">${lenB} 格</span>
          <button class="btn btn-sm btn-outline" onclick="setG1U2Len('B', 1)">➕</button>
        </div>
      </div>

      <div style="margin-top:0.85rem; font-size:1.15rem; color:#1E293B; background:#F0FDF4; border:1px solid #BBF7D0; border-radius:8px; padding:0.75rem;">
        💡 <strong>比較結果</strong>：${compareText}
        ${!aligned ? '<div style="color:#DC2626; font-size:0.9rem; margin-top:0.25rem;">⚠️ 注意：當一端沒有對齊基準線時，不能只看誰凸在右邊就說誰比較長喔！一定要齊頭對齊！</div>' : ''}
      </div>
    </div>
  `;
}

/* =========================================================
   單元 3：排順序、比多少 (動物排隊運動會 + 序數基數)
   ========================================================= */
function selectG1U3Animal(idx) {
  g1State.u3.selectedIdx = idx;
  renderG1U3();
}

function setG1U3Cmp(which, delta) {
  if (which === 'A') g1State.u3.numA = Math.max(1, Math.min(10, g1State.u3.numA + delta));
  else g1State.u3.numB = Math.max(1, Math.min(10, g1State.u3.numB + delta));
  renderG1U3();
}

function renderG1U3() {
  const animals = [
    { name: '小熊', emoji: '🐻' },
    { name: '小兔', emoji: '🐰' },
    { name: '小貓', emoji: '🐱' },
    { name: '小狗', emoji: '🐶' },
    { name: '小獅', emoji: '🦁' },
    { name: '貓熊', emoji: '🐼' },
    { name: '小狐', emoji: '🦊' }
  ];
  const sel = g1State.u3.selectedIdx;
  const wrap = document.getElementById('g1U3Display');
  if (!wrap) return;

  // 排隊佇列
  let queueHtml = '';
  animals.forEach((a, idx) => {
    const isSel = idx === sel;
    queueHtml += `
      <div onclick="selectG1U3Animal(${idx})" style="cursor:pointer; display:flex; flex-direction:column; align-items:center; background:${isSel ? '#FEF3C7' : '#FFFFFF'}; border:2px solid ${isSel ? '#D97706' : '#CBD5E1'}; border-radius:12px; padding:0.6rem 0.5rem; width:64px; transition:all 0.15s; transform:${isSel ? 'scale(1.08)' : 'scale(1)'};">
        <span style="font-size:2rem;">${a.emoji}</span>
        <span style="font-size:0.85rem; font-weight:800; color:#334155; margin-top:0.2rem;">${a.name}</span>
        <span class="badge ${isSel ? 'badge-amber' : 'badge-blue'}" style="margin-top:0.2rem; font-size:0.75rem;">第 ${idx + 1} 個</span>
      </div>
    `;
  });

  // 比多少（胡蘿蔔與兔子）
  const { numA, numB } = g1State.u3;
  let pairHtml = '';
  const maxN = Math.max(numA, numB);
  for (let i = 0; i < maxN; i++) {
    const hasA = i < numA;
    const hasB = i < numB;
    pairHtml += `
      <div style="display:flex; flex-direction:column; align-items:center; gap:4px; padding:4px;">
        <span style="font-size:1.6rem; opacity:${hasA ? '1' : '0.15'};">🥕</span>
        <span style="height:14px; border-left:2px dashed ${hasA && hasB ? '#10B981' : '#CBD5E1'};"></span>
        <span style="font-size:1.6rem; opacity:${hasB ? '1' : '0.15'};">🐰</span>
      </div>
    `;
  }

  let cmpResult = '';
  if (numA > numB) {
    cmpResult = `🥕 胡蘿蔔（${numA} 根）比 🐰 兔子（${numB} 隻）<strong>多 ${numA - numB} 個</strong>！`;
  } else if (numB > numA) {
    cmpResult = `🐰 兔子（${numB} 隻）比 🥕 胡蘿蔔（${numA} 根）<strong>多 ${numB - numA} 個</strong>！`;
  } else {
    cmpResult = `🥕 胡蘿蔔和 🐰 兔子剛好一樣多（都是 <strong>${numA} 個</strong>）！一對一剛好分完！`;
  }

  wrap.innerHTML = `
    <div style="background:#FFFFFF; border:2px solid #F59E0B; border-radius:14px; padding:1.25rem;">
      <h5 style="color:#B45309; font-weight:800; margin-bottom:0.6rem; font-size:1.1rem;">
        🐾 動物排排隊：搞懂「第幾個（序數）」與「幾個（基數）」！
      </h5>
      <div style="font-size:0.92rem; color:#64748B; margin-bottom:0.75rem;">
        點擊下方任何一隻小動物，看看牠的順序與前後位置：
      </div>

      <div style="display:flex; justify-content:center; gap:8px; flex-wrap:wrap; margin-bottom:1rem; background:#F8FAFC; padding:0.85rem; border-radius:10px;">
        <div style="display:flex; align-items:center; font-weight:900; color:#DC2626; margin-right:4px;">➔【排頭】</div>
        ${queueHtml}
        <div style="display:flex; align-items:center; font-weight:900; color:#64748B; margin-left:4px;">【排尾】</div>
      </div>

      <div style="background:#FFFBEB; border:1px solid #FCD34D; border-radius:8px; padding:0.75rem 1rem; line-height:1.7; font-size:0.98rem; color:#78350F;">
        🎯 您選取的是 <strong>${animals[sel].emoji} ${animals[sel].name}</strong>：<br/>
        1. 從排頭往後數，牠排在<strong>第 ${sel + 1} 個</strong>。<br/>
        2. 排在牠前面的動物一共有 <strong>${sel} 隻</strong>；排在牠後面的動物一共有 <strong>${animals.length - 1 - sel} 隻</strong>。<br/>
        3. 全體隊伍一共有 <strong>${animals.length} 隻</strong>動物（基數代表全部數量，第幾個代表單一位置！）。
      </div>

      <!-- 一一對應比多少 -->
      <div style="margin-top:1.25rem; border-top:1px dashed #CBD5E1; padding-top:1rem;">
        <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; margin-bottom:0.75rem;">
          <h5 style="color:#1E3A8A; font-weight:800; margin:0;">🥕 一對一連線比多少：</h5>
          <div style="display:flex; gap:1rem;">
            <div>
              <span>🥕 胡蘿蔔：</span>
              <button class="btn btn-sm btn-outline" onclick="setG1U3Cmp('A', -1)">➖</button>
              <span style="font-weight:900; margin:0 0.3rem;">${numA}</span>
              <button class="btn btn-sm btn-outline" onclick="setG1U3Cmp('A', 1)">➕</button>
            </div>
            <div>
              <span>🐰 兔子：</span>
              <button class="btn btn-sm btn-outline" onclick="setG1U3Cmp('B', -1)">➖</button>
              <span style="font-weight:900; margin:0 0.3rem;">${numB}</span>
              <button class="btn btn-sm btn-outline" onclick="setG1U3Cmp('B', 1)">➕</button>
            </div>
          </div>
        </div>

        <div style="display:flex; justify-content:center; gap:10px; background:#F0FDF4; border:1px solid #BBF7D0; border-radius:10px; padding:0.75rem; overflow-x:auto;">
          ${pairHtml}
        </div>
        <div style="text-align:center; margin-top:0.6rem; font-weight:800; font-size:1.05rem; color:#065F46;">
          ${cmpResult}
        </div>
      </div>
    </div>
  `;
}

/* =========================================================
   單元 4：分與合 (10的分與合蘋果樹 + 雙色圓片)
   ========================================================= */
function setG1U4Total(t) {
  g1State.u4.total = t;
  g1State.u4.left = Math.floor(t / 2);
  renderG1U4();
}

function setG1U4Left(l) {
  g1State.u4.left = Math.max(0, Math.min(g1State.u4.total, l));
  renderG1U4();
}

function renderG1U4() {
  const { total, left } = g1State.u4;
  const right = total - left;
  const wrap = document.getElementById('g1U4Display');
  if (!wrap) return;

  // 蘋果生成
  let leftApples = '';
  for (let i = 0; i < left; i++) leftApples += '<span style="font-size:1.8rem; margin:2px;">🍎</span>';
  let rightApples = '';
  for (let i = 0; i < right; i++) rightApples += '<span style="font-size:1.8rem; margin:2px;">🍏</span>';

  wrap.innerHTML = `
    <div style="background:#FFFFFF; border:2px solid #EF4444; border-radius:14px; padding:1.25rem; text-align:center;">
      <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:0.5rem; margin-bottom:1rem;">
        <h5 style="color:#DC2626; font-weight:800; margin:0; font-size:1.15rem;">
          🌳 蘋果樹「分與合」：把 ${total} 分成兩堆！
        </h5>
        <div style="display:flex; gap:0.3rem;">
          ${[5, 6, 7, 8, 9, 10].map(n => `
            <button class="btn btn-sm ${total === n ? 'btn-primary' : 'btn-outline'}" onclick="setG1U4Total(${n})">${n}</button>
          `).join('')}
        </div>
      </div>

      <!-- 分與合動態圖解樹 -->
      <div style="background:#FEF2F2; border:1px solid #FECDD3; border-radius:12px; padding:1.25rem; margin-bottom:1rem;">
        <div style="font-size:2.8rem; font-weight:900; color:#DC2626; margin-bottom:0.5rem;">
          ${total}
        </div>
        <div style="font-size:1.8rem; line-height:1; color:#991B1B;">↙ ↘</div>
        <div style="display:grid; grid-template-columns:1fr 1fr; gap:1.5rem; margin-top:0.75rem;">
          <div style="background:#FFFFFF; border:2px solid #EF4444; border-radius:10px; padding:0.85rem;">
            <div style="font-size:0.95rem; font-weight:800; color:#DC2626;">左盤紅蘋果：${left} 顆</div>
            <div style="min-height:50px; display:flex; justify-content:center; align-items:center; flex-wrap:wrap;">
              ${leftApples || '<span style="color:#94A3B8;">0 顆</span>'}
            </div>
            <div style="margin-top:0.4rem;">
              <button class="btn btn-sm btn-outline" onclick="setG1U4Left(${left - 1})">➖ 拿走</button>
              <button class="btn btn-sm btn-primary" onclick="setG1U4Left(${left + 1})">➕ 放入</button>
            </div>
          </div>

          <div style="background:#FFFFFF; border:2px solid #10B981; border-radius:10px; padding:0.85rem;">
            <div style="font-size:0.95rem; font-weight:800; color:#059669;">右盤青蘋果：${right} 顆</div>
            <div style="min-height:50px; display:flex; justify-content:center; align-items:center; flex-wrap:wrap;">
              ${rightApples || '<span style="color:#94A3B8;">0 顆</span>'}
            </div>
            <div style="margin-top:0.4rem;">
              <span style="font-weight:900; color:#059669; font-size:1.1rem;">自動配對：${right}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 數學口訣與等式 -->
      <div style="font-size:1.35rem; font-weight:900; color:#1E3A8A; background:#EFF6FF; border:1px solid #BFDBFE; border-radius:8px; padding:0.75rem;">
        ${total} 可以分成 <strong>${left}</strong> 和 <strong>${right}</strong>；<br/>
        <strong>${left}</strong> 和 <strong>${right}</strong> 合起來就是 <strong>${total}</strong>！
      </div>

      <!-- 10的好朋友速記卡 -->
      ${total === 10 ? `
        <div style="margin-top:0.85rem; font-size:0.92rem; color:#78350F; background:#FFFBEB; border:1px solid #FCD34D; border-radius:8px; padding:0.6rem;">
          🎵 <strong>合十兒歌</strong>：1和9是好朋友，2和8手牽手，3和7真親密，4和6一起走，5和5湊成雙！
        </div>
      ` : ''}
    </div>
  `;
}

/* =========================================================
   單元 5：方盒、圓罐、球 (立體形體辨識與滾動堆疊)
   ========================================================= */
function selectG1U5Shape(shape) {
  g1State.u5.selectedShape = shape;
  renderG1U5();
}

function renderG1U5() {
  const shape = g1State.u5.selectedShape;
  const wrap = document.getElementById('g1U5Display');
  if (!wrap) return;

  const shapeData = {
    box: {
      title: '📦 方盒（長方體 / 正方體）',
      faces: '有 6 個平平的面',
      roll: '❌ 不能像球一樣滾動，只能平移滑動',
      stack: '✅ 接觸面平整，非常適合堆疊疊高！',
      examples: '面紙盒、積木、骰子、鞋盒、餅乾盒',
      color: '#3B82F6',
      bg: '#EFF6FF'
    },
    cylinder: {
      title: '🥫 圓罐（圓柱體）',
      faces: '上下有 2 個平平的圓形面，側面是彎曲面',
      roll: '✅ 躺著放時可以沿直線滾動',
      stack: '✅ 立著放時上下平平，可以向上堆疊！',
      examples: '易開罐、膠水罐、茶葉罐、粉筆',
      color: '#10B981',
      bg: '#ECFDF5'
    },
    sphere: {
      title: '⚽ 球（球體）',
      faces: '完全沒有平平的面，整個表面都是圓滑曲面',
      roll: '🚀 超容易向四面八方滾動！',
      stack: '❌ 容易滾落滑下，非常難以堆疊！',
      examples: '足球、籃球、乒乓球、地球儀、彈珠',
      color: '#EF4444',
      bg: '#FEF2F2'
    }
  };

  const curr = shapeData[shape];

  wrap.innerHTML = `
    <div style="background:#FFFFFF; border:2px solid #8B5CF6; border-radius:14px; padding:1.25rem;">
      <h5 style="color:#6D28D9; font-weight:800; margin-bottom:0.75rem; font-size:1.15rem; text-align:center;">
        🧱 生活中的立體形體：方盒、圓罐與球！
      </h5>

      <!-- 形體切換按鈕 -->
      <div style="display:flex; justify-content:center; gap:0.75rem; flex-wrap:wrap; margin-bottom:1.2rem;">
        <button class="btn ${shape === 'box' ? 'btn-primary' : 'btn-outline'}" onclick="selectG1U5Shape('box')">📦 方 盒</button>
        <button class="btn ${shape === 'cylinder' ? 'btn-primary' : 'btn-outline'}" onclick="selectG1U5Shape('cylinder')">🥫 圓 罐</button>
        <button class="btn ${shape === 'sphere' ? 'btn-primary' : 'btn-outline'}" onclick="selectG1U5Shape('sphere')">⚽ 球 體</button>
      </div>

      <!-- 形體特性卡片 -->
      <div style="background:${curr.bg}; border:2px solid ${curr.color}; border-radius:12px; padding:1.25rem; line-height:1.9;">
        <h4 style="font-size:1.3rem; font-weight:900; color:${curr.color}; margin:0 0 0.5rem 0;">${curr.title}</h4>
        <div>📌 <strong>面的特徵</strong>：${curr.faces}</div>
        <div>🎲 <strong>滾動特性</strong>：${curr.roll}</div>
        <div>🏗️ <strong>堆疊特性</strong>：${curr.stack}</div>
        <div style="margin-top:0.5rem; background:#FFFFFF; border-radius:8px; padding:0.6rem 0.85rem; border:1px solid #CBD5E1;">
          💡 <strong>生活中的常見例子</strong>：${curr.examples}
        </div>
      </div>
    </div>
  `;
}

/* =========================================================
   單元 6：30以內的數 (十位個位位值板 + 10元1元存錢筒)
   ========================================================= */
function setG1U6Num(val) {
  g1State.u6.num = Math.max(1, Math.min(30, val));
  renderG1U6();
}

function renderG1U6() {
  const n = g1State.u6.num;
  const tens = Math.floor(n / 10);
  const ones = n % 10;
  const wrap = document.getElementById('g1U6Display');
  if (!wrap) return;

  // 十元硬幣與一元硬幣
  let tensCoinHtml = '';
  for (let i = 0; i < tens; i++) {
    tensCoinHtml += '<div style="width:42px; height:42px; border-radius:50%; background:#FBBF24; border:3px solid #D97706; display:inline-flex; align-items:center; justify-content:center; font-weight:900; color:#78350F; margin:4px; font-size:1.1rem; box-shadow:0 2px 4px rgba(0,0,0,0.15);">10</div>';
  }
  let onesCoinHtml = '';
  for (let i = 0; i < ones; i++) {
    onesCoinHtml += '<div style="width:32px; height:32px; border-radius:50%; background:#E2E8F0; border:2px solid #94A3B8; display:inline-flex; align-items:center; justify-content:center; font-weight:900; color:#334155; margin:3px; font-size:0.95rem;">1</div>';
  }

  wrap.innerHTML = `
    <div style="background:#FFFFFF; border:2px solid #3B82F6; border-radius:14px; padding:1.25rem; text-align:center;">
      <div style="font-size:3.5rem; font-weight:900; color:#2563EB; line-height:1; font-family:'Fredoka', sans-serif;">${n}</div>
      <div style="font-size:1.2rem; font-weight:800; color:#475569; margin:0.4rem 0;">
        包含 <strong>${tens} 個十</strong> 和 <strong>${ones} 個一</strong>
      </div>

      <!-- 控制按鈕 -->
      <div style="display:flex; justify-content:center; gap:0.5rem; align-items:center; margin:0.75rem 0; flex-wrap:wrap;">
        <button class="btn btn-sm btn-outline" onclick="setG1U6Num(${n - 10})">－10</button>
        <button class="btn btn-sm btn-outline" onclick="setG1U6Num(${n - 1})">➖ 減 1</button>
        <button class="btn btn-sm btn-primary" onclick="setG1U6Num(${n + 1})">➕ 加 1</button>
        <button class="btn btn-sm btn-primary" onclick="setG1U6Num(${n + 10})">＋10</button>
        <button class="btn btn-sm btn-outline" onclick="setG1U6Num(10)">10</button>
        <button class="btn btn-sm btn-outline" onclick="setG1U6Num(20)">20</button>
        <button class="btn btn-sm btn-outline" onclick="setG1U6Num(30)">30</button>
      </div>

      <!-- 位值表與錢幣展示 -->
      <div style="display:grid; grid-template-columns:1fr 1fr; gap:1.25rem; max-width:480px; margin:1rem auto 0 auto;">
        <!-- 十位 -->
        <div style="background:#FEF3C7; border:2px solid #F59E0B; border-radius:10px; padding:0.85rem;">
          <div style="font-weight:900; font-size:1.15rem; color:#B45309; border-bottom:2px solid #F59E0B; padding-bottom:0.3rem;">
            十位（${tens} 個十 ＝ ${tens * 10}）
          </div>
          <div style="min-height:55px; display:flex; justify-content:center; align-items:center; flex-wrap:wrap; margin-top:0.5rem;">
            ${tensCoinHtml || '<span style="color:#94A3B8;">無</span>'}
          </div>
        </div>

        <!-- 個位 -->
        <div style="background:#F1F5F9; border:2px solid #94A3B8; border-radius:10px; padding:0.85rem;">
          <div style="font-weight:900; font-size:1.15rem; color:#334155; border-bottom:2px solid #94A3B8; padding-bottom:0.3rem;">
            個位（${ones} 個一 ＝ ${ones}）
          </div>
          <div style="min-height:55px; display:flex; justify-content:center; align-items:center; flex-wrap:wrap; margin-top:0.5rem;">
            ${onesCoinHtml || '<span style="color:#94A3B8;">無</span>'}
          </div>
        </div>
      </div>
    </div>
  `;
}

/* =========================================================
   單元 7：10以內的加法 (小鳥飛來合起來加法魔法機)
   ========================================================= */
function setG1U7(a, b) {
  g1State.u7.a = Math.max(0, Math.min(10, a));
  g1State.u7.b = Math.max(0, Math.min(10 - g1State.u7.a, b));
  renderG1U7();
}

function renderG1U7() {
  const { a, b } = g1State.u7;
  const sum = a + b;
  const wrap = document.getElementById('g1U7Display');
  if (!wrap) return;

  let birdsA = '';
  for (let i = 0; i < a; i++) birdsA += '<span style="font-size:1.8rem; margin:2px;">🐦</span>';
  let birdsB = '';
  for (let i = 0; i < b; i++) birdsB += '<span style="font-size:1.8rem; margin:2px;">🐥</span>';

  wrap.innerHTML = `
    <div style="background:#FFFFFF; border:2px solid #10B981; border-radius:14px; padding:1.25rem; text-align:center;">
      <h5 style="color:#047857; font-weight:800; margin-bottom:0.6rem; font-size:1.15rem;">
        ➕ 10以內的加法：合起來、又飛來！
      </h5>

      <!-- 控制項 -->
      <div style="display:flex; justify-content:center; align-items:center; gap:1rem; flex-wrap:wrap; margin-bottom:1rem;">
        <div style="background:#EFF6FF; border:1px solid #BFDBFE; border-radius:8px; padding:0.4rem 0.85rem;">
          <span style="font-weight:800; color:#1D4ED8;">第 1 數：</span>
          <button class="btn btn-sm btn-outline" onclick="setG1U7(${a - 1}, ${b})">➖</button>
          <span style="font-weight:900; font-size:1.2rem; margin:0 0.4rem;">${a}</span>
          <button class="btn btn-sm btn-outline" onclick="setG1U7(${a + 1}, ${b})">➕</button>
        </div>
        <span style="font-size:1.5rem; font-weight:900; color:#059669;">＋</span>
        <div style="background:#FEF3C7; border:1px solid #FCD34D; border-radius:8px; padding:0.4rem 0.85rem;">
          <span style="font-weight:800; color:#B45309;">第 2 數：</span>
          <button class="btn btn-sm btn-outline" onclick="setG1U7(${a}, ${b - 1})">➖</button>
          <span style="font-weight:900; font-size:1.2rem; margin:0 0.4rem;">${b}</span>
          <button class="btn btn-sm btn-outline" onclick="setG1U7(${a}, ${b + 1})">➕</button>
        </div>
      </div>

      <!-- 圖像化情境 -->
      <div style="background:#ECFDF5; border:1px solid #A7F3D0; border-radius:12px; padding:1rem; margin-bottom:1rem;">
        <div style="font-size:0.95rem; color:#065F46; font-weight:800; margin-bottom:0.5rem;">
          樹上原本有 ${a} 隻藍鳥，又飛來了 ${b} 隻黃鳥：
        </div>
        <div style="display:flex; justify-content:center; align-items:center; gap:1rem; flex-wrap:wrap;">
          <div style="background:#FFFFFF; border:1px solid #6EE7B7; border-radius:8px; padding:0.5rem 0.85rem; min-width:110px;">
            ${birdsA || '<span style="color:#94A3B8;">0 隻</span>'}
          </div>
          <span style="font-size:1.3rem; font-weight:900; color:#059669;">與</span>
          <div style="background:#FFFFFF; border:1px solid #6EE7B7; border-radius:8px; padding:0.5rem 0.85rem; min-width:110px;">
            ${birdsB || '<span style="color:#94A3B8;">0 隻</span>'}
          </div>
        </div>
      </div>

      <!-- 算式卡片 -->
      <div style="font-size:2.2rem; font-weight:900; color:#1E3A8A; background:#FFFFFF; border:2px solid #3B82F6; border-radius:12px; padding:0.75rem; letter-spacing:2px;">
        ${a} ＋ ${b} ＝ <span style="color:#DC2626; font-size:2.6rem;">${sum}</span>
      </div>
    </div>
  `;
}

/* =========================================================
   單元 8：10以內的減法 (氣球破掉減法消失機)
   ========================================================= */
function setG1U8(a, b) {
  g1State.u8.a = Math.max(1, Math.min(10, a));
  g1State.u8.b = Math.max(0, Math.min(g1State.u8.a, b));
  renderG1U8();
}

function renderG1U8() {
  const { a, b } = g1State.u8;
  const rem = a - b;
  const wrap = document.getElementById('g1U8Display');
  if (!wrap) return;

  // 氣球：未破與破掉
  let balloonsHtml = '';
  for (let i = 0; i < a; i++) {
    const isPopped = i >= rem;
    balloonsHtml += `
      <div style="display:inline-flex; flex-direction:column; align-items:center; margin:4px; position:relative;">
        <span style="font-size:2.2rem; filter:${isPopped ? 'grayscale(1) opacity(0.35)' : 'none'};">🎈</span>
        ${isPopped ? '<span style="position:absolute; top:6px; font-size:1.8rem; font-weight:900; color:#DC2626;">❌</span>' : ''}
      </div>
    `;
  }

  wrap.innerHTML = `
    <div style="background:#FFFFFF; border:2px solid #EF4444; border-radius:14px; padding:1.25rem; text-align:center;">
      <h5 style="color:#DC2626; font-weight:800; margin-bottom:0.6rem; font-size:1.15rem;">
        ➖ 10以內的減法：拿走、吃掉、破掉了！
      </h5>

      <!-- 控制項 -->
      <div style="display:flex; justify-content:center; align-items:center; gap:1rem; flex-wrap:wrap; margin-bottom:1rem;">
        <div style="background:#EFF6FF; border:1px solid #BFDBFE; border-radius:8px; padding:0.4rem 0.85rem;">
          <span style="font-weight:800; color:#1D4ED8;">原來的數量：</span>
          <button class="btn btn-sm btn-outline" onclick="setG1U8(${a - 1}, ${b})">➖</button>
          <span style="font-weight:900; font-size:1.2rem; margin:0 0.4rem;">${a}</span>
          <button class="btn btn-sm btn-outline" onclick="setG1U8(${a + 1}, ${b})">➕</button>
        </div>
        <span style="font-size:1.5rem; font-weight:900; color:#DC2626;">－</span>
        <div style="background:#FEF2F2; border:1px solid #FECDD3; border-radius:8px; padding:0.4rem 0.85rem;">
          <span style="font-weight:800; color:#DC2626;">減去的數量：</span>
          <button class="btn btn-sm btn-outline" onclick="setG1U8(${a}, ${b - 1})">➖</button>
          <span style="font-weight:900; font-size:1.2rem; margin:0 0.4rem;">${b}</span>
          <button class="btn btn-sm btn-outline" onclick="setG1U8(${a}, ${b + 1})">➕</button>
        </div>
      </div>

      <!-- 氣球圖解 -->
      <div style="background:#FEF2F2; border:1px solid #FECDD3; border-radius:12px; padding:1.25rem; margin-bottom:1rem;">
        <div style="font-size:0.95rem; color:#991B1B; font-weight:800; margin-bottom:0.4rem;">
          原本有 ${a} 顆氣球，破掉了 ${b} 顆，打 ❌ 表示被減去：
        </div>
        <div>${balloonsHtml}</div>
      </div>

      <!-- 算式卡片 -->
      <div style="font-size:2.2rem; font-weight:900; color:#1E3A8A; background:#FFFFFF; border:2px solid #3B82F6; border-radius:12px; padding:0.75rem; letter-spacing:2px;">
        ${a} － ${b} ＝ <span style="color:#059669; font-size:2.6rem;">${rem}</span>
      </div>
    </div>
  `;
}

/* =========================================================
   單元 9：幾點鐘 (旋轉時鐘教具盤：整點與半點)
   ========================================================= */
function setG1U9(hour, isHalf) {
  g1State.u9.hour = Math.max(1, Math.min(12, hour));
  g1State.u9.isHalf = isHalf;
  renderG1U9();
}

function renderG1U9() {
  const { hour, isHalf } = g1State.u9;
  const wrap = document.getElementById('g1U9Display');
  if (!wrap) return;

  // 時針與分針角度
  // 分針：整點指 12 (0度)，半點指 6 (180度)
  const minuteAngle = isHalf ? 180 : 0;
  // 時針：12 為 0 度，每小時 30 度，半點時再加 15 度
  const hourAngle = ((hour % 12) * 30) + (isHalf ? 15 : 0);

  const timeText = isHalf ? `${hour} 點半（${hour} 點 30 分）` : `${hour} 點鐘（${hour} 點整）`;

  wrap.innerHTML = `
    <div style="background:#FFFFFF; border:2px solid #3B82F6; border-radius:14px; padding:1.25rem; text-align:center;">
      <h5 style="color:#1D4ED8; font-weight:800; margin-bottom:0.6rem; font-size:1.15rem;">
        ⏰ 時鐘小達人：分清「整點」與「半點」！
      </h5>

      <!-- 時鐘鐘面 SVG -->
      <svg viewBox="0 0 240 240" style="width:220px; height:220px; margin:0.5rem auto; display:block;">
        <!-- 鐘面外框 -->
        <circle cx="120" cy="120" r="100" fill="#FFFFFF" stroke="#334155" stroke-width="6"/>
        <circle cx="120" cy="120" r="92" fill="#F8FAFC" stroke="#CBD5E1" stroke-width="1.5"/>

        <!-- 12個數字刻度 -->
        ${Array.from({ length: 12 }).map((_, i) => {
          const num = i === 0 ? 12 : i;
          const rad = (num * 30 - 90) * (Math.PI / 180);
          const x = 120 + 74 * Math.cos(rad);
          const y = 120 + 74 * Math.sin(rad) + 5;
          return `<text x="${x}" y="${y}" font-size="16" font-weight="900" fill="#1E293B" text-anchor="middle">${num}</text>`;
        }).join('')}

        <!-- 中心點 -->
        <circle cx="120" cy="120" r="6" fill="#1E40AF"/>

        <!-- 時針 (短針粗紅) -->
        <line x1="120" y1="120" x2="${120 + 48 * Math.sin(hourAngle * Math.PI / 180)}" y2="${120 - 48 * Math.cos(hourAngle * Math.PI / 180)}" stroke="#DC2626" stroke-width="6" stroke-linecap="round"/>

        <!-- 分針 (長針細藍) -->
        <line x1="120" y1="120" x2="${120 + 72 * Math.sin(minuteAngle * Math.PI / 180)}" y2="${120 - 72 * Math.cos(minuteAngle * Math.PI / 180)}" stroke="#2563EB" stroke-width="4" stroke-linecap="round"/>
      </svg>

      <!-- 時間說明 -->
      <div style="font-size:1.6rem; font-weight:900; color:#1E40AF; margin:0.5rem 0;">
        現在是：<span style="color:#DC2626;">${timeText}</span>
      </div>
      <div style="font-size:0.95rem; color:#475569; margin-bottom:1rem;">
        🔴 <strong>紅色短針（時針）</strong>看幾點；🔵 <strong>藍色長針（分針）</strong>看幾分。<br/>
        ${isHalf ? '長針指在 6 代表「半」，此時時針走在兩個數字正中間！' : '長針指在 12 代表「整點」，此時時針剛好指在數字上！'}
      </div>

      <!-- 控制項 -->
      <div style="display:flex; justify-content:center; gap:0.6rem; flex-wrap:wrap; align-items:center;">
        <button class="btn btn-sm ${!isHalf ? 'btn-primary' : 'btn-outline'}" onclick="setG1U9(${hour}, false)">整點鐘</button>
        <button class="btn btn-sm ${isHalf ? 'btn-primary' : 'btn-outline'}" onclick="setG1U9(${hour}, true)">半點鐘</button>
        <span style="border-left:1px solid #CBD5E1; height:20px; margin:0 4px;"></span>
        ${[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(h => `
          <button class="btn btn-sm ${hour === h ? 'btn-primary' : 'btn-outline'}" style="padding:0.25rem 0.5rem;" onclick="setG1U9(${h}, ${isHalf})">${h}點</button>
        `).join('')}
      </div>
    </div>
  `;
}

// 初始化 1上 模組
function initG1App() {
  renderG1U1();
}


/* ================= 1上 課本案例任務與隨機出題控制器 ================= */
function setG1U1Preset(count, story) {
  g1State.u1.count = count;
  const el = document.getElementById('g1U1TaskText');
  if (el) el.innerHTML = story;
  renderG1U1();
}
function randomG1U1Task() {
  const c = Math.floor(Math.random() * 10) + 1;
  const items = ['🍎 紅蘋果', '🍓 草莓', '🍌 香蕉', '🧁 杯子蛋糕', '🎈 彩色氣球', '🦆 玩具小鴨'];
  const item = items[Math.floor(Math.random() * items.length)];
  setG1U1Preset(c, `【隨機出題】野餐墊上有 <strong>${c}</strong> 個${item}，請在點子卡排排看，並數一數是多少！`);
}

function setG1U2Preset(lenA, lenB, aligned, story) {
  g1State.u2.lenA = lenA;
  g1State.u2.lenB = lenB;
  g1State.u2.aligned = aligned;
  const el = document.getElementById('g1U2TaskText');
  if (el) el.innerHTML = story;
  renderG1U2();
}
function randomG1U2Task() {
  const a = Math.floor(Math.random() * 7) + 3;
  let b = Math.floor(Math.random() * 7) + 3;
  if (b === a) b = (a % 9) + 2;
  const al = Math.random() > 0.3;
  setG1U2Preset(a, b, al, `【隨機挑戰】量量看！藍色彩帶長 <strong>${a}</strong> 格，紅色彩帶長 <strong>${b}</strong> 格，${al ? '起點已對齊基準線' : '⚠️ 注意：起點沒有對齊！'}，誰比較長？`);
}

function setG1U3Preset(idx, numA, numB, story) {
  g1State.u3.selectedIdx = idx;
  g1State.u3.numA = numA;
  g1State.u3.numB = numB;
  const el = document.getElementById('g1U3TaskText');
  if (el) el.innerHTML = story;
  renderG1U3();
}
function randomG1U3Task() {
  const idx = Math.floor(Math.random() * 5);
  const a = Math.floor(Math.random() * 6) + 3;
  const b = Math.floor(Math.random() * 6) + 3;
  const names = ['獅子', '大象', '小兔子', '長頸鹿', '小猴子'];
  setG1U3Preset(idx, a, b, `【隨機出題】排隊買票中！請找出第 <strong>${idx + 1}</strong> 個小動物（${names[idx]}），並用連線比比看下方水果誰比較多！`);
}

function setG1U4Preset(total, left, story) {
  g1State.u4.total = total;
  g1State.u4.left = left;
  const el = document.getElementById('g1U4TaskText');
  if (el) el.innerHTML = story;
  renderG1U4();
}
function randomG1U4Task() {
  const tot = Math.floor(Math.random() * 6) + 5; // 5~10
  const l = Math.floor(Math.random() * (tot - 1)) + 1;
  setG1U4Preset(tot, l, `【隨機出題】蘋果樹上有 <strong>${tot}</strong> 顆蘋果，掉到左邊籃子 <strong>${l}</strong> 顆，請問右邊籃子有幾顆？`);
}

function setG1U5Preset(shape, story) {
  g1State.u5.selectedShape = shape;
  const el = document.getElementById('g1U5TaskText');
  if (el) el.innerHTML = story;
  renderG1U5();
}

function setG1U6Preset(num, story) {
  g1State.u6.num = num;
  const el = document.getElementById('g1U6TaskText');
  if (el) el.innerHTML = story;
  renderG1U6();
}
function randomG1U6Task() {
  const n = Math.floor(Math.random() * 20) + 11; // 11~30
  setG1U6Preset(n, `【隨機出題】買一本筆記本要 <strong>${n}</strong> 元，請在位值板上看看需要幾個 10 元和幾個 1 元！`);
}

function setG1U7Preset(a, b, story) {
  g1State.u7.a = a;
  g1State.u7.b = b;
  const el = document.getElementById('g1U7TaskText');
  if (el) el.innerHTML = story;
  renderG1U7();
}
function randomG1U7Task() {
  const a = Math.floor(Math.random() * 5) + 1;
  const b = Math.floor(Math.random() * (10 - a)) + 1;
  setG1U7Preset(a, b, `【隨機出題】樹上原本停了 <strong>${a}</strong> 隻小鳥，又飛來 <strong>${b}</strong> 隻，現在樹上一共有幾隻小鳥？`);
}

function setG1U8Preset(a, b, story) {
  g1State.u8.a = a;
  g1State.u8.b = b;
  const el = document.getElementById('g1U8TaskText');
  if (el) el.innerHTML = story;
  renderG1U8();
}
function randomG1U8Task() {
  const a = Math.floor(Math.random() * 6) + 4; // 4~9
  const b = Math.floor(Math.random() * (a - 1)) + 1;
  setG1U8Preset(a, b, `【隨機出題】小華拿了 <strong>${a}</strong> 顆氣球，不小心飛走 <strong>${b}</strong> 顆，手裡還剩幾顆氣球？`);
}

function setG1U9Preset(hour, isHalf, story) {
  g1State.u9.hour = hour;
  g1State.u9.isHalf = isHalf;
  const el = document.getElementById('g1U9TaskText');
  if (el) el.innerHTML = story;
  renderG1U9();
}
function randomG1U9Task() {
  const h = Math.floor(Math.random() * 12) + 1;
  const isH = Math.random() > 0.5;
  setG1U9Preset(h, isH, `【隨機出題】看時鐘！現在是 <strong>${h} 點${isH ? '半' : '鐘'}</strong>，請撥動指針觀察長針與短針的正確位置！`);
}

if (typeof window !== 'undefined') {
  window.switchG1Unit = switchG1Unit;
  window.openG1UnitQuiz = openG1UnitQuiz;
  window.initG1App = initG1App;
  window.setG1U1Count = setG1U1Count;
  window.toggleG1U2Align = toggleG1U2Align;
  window.setG1U2Len = setG1U2Len;
  window.selectG1U3Animal = selectG1U3Animal;
  window.setG1U3Cmp = setG1U3Cmp;
  window.setG1U4Total = setG1U4Total;
  window.setG1U4Left = setG1U4Left;
  window.selectG1U5Shape = selectG1U5Shape;
  window.setG1U6Num = setG1U6Num;
  window.setG1U7 = setG1U7;
  window.setG1U8 = setG1U8;
  window.setG1U9 = setG1U9;
  window.setG1U1Preset = setG1U1Preset;
  window.randomG1U1Task = randomG1U1Task;
  window.setG1U2Preset = setG1U2Preset;
  window.randomG1U2Task = randomG1U2Task;
  window.setG1U3Preset = setG1U3Preset;
  window.randomG1U3Task = randomG1U3Task;
  window.setG1U4Preset = setG1U4Preset;
  window.randomG1U4Task = randomG1U4Task;
  window.setG1U5Preset = setG1U5Preset;
  window.setG1U6Preset = setG1U6Preset;
  window.randomG1U6Task = randomG1U6Task;
  window.setG1U7Preset = setG1U7Preset;
  window.randomG1U7Task = randomG1U7Task;
  window.setG1U8Preset = setG1U8Preset;
  window.randomG1U8Task = randomG1U8Task;
  window.setG1U9Preset = setG1U9Preset;
  window.randomG1U9Task = randomG1U9Task;
  window.renderG1U1 = renderG1U1;
  window.renderG1U2 = renderG1U2;
  window.renderG1U3 = renderG1U3;
  window.renderG1U4 = renderG1U4;
  window.renderG1U5 = renderG1U5;
  window.renderG1U6 = renderG1U6;
  window.renderG1U7 = renderG1U7;
  window.renderG1U8 = renderG1U8;
  window.renderG1U9 = renderG1U9;
}
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    renderG1U1, renderG1U2, renderG1U3, renderG1U4, renderG1U5,
    renderG1U6, renderG1U7, renderG1U8, renderG1U9,
    switchG1Unit, openG1UnitQuiz, initG1App
  };
}
