/* =========================================================
   木新思達 國小五年級上學期 (5上) 數學互動學習樂園 - 主互動邏輯 app_g5.js
   涵蓋 108 課綱 5上 全冊 10 大單元具體-圖像-抽象 (CPA) 高互動教具
   ========================================================= */

// 5上 全域狀態
const g5State = {
  currentUnit: 1,
  // U1: 多位小數
  u1: { intVal: 3, tenths: 4, hundredths: 5, thousandths: 6 },
  // U2: 因數彩虹
  u2: { targetNum: 24, numA: 18, numB: 24 },
  // U3: 倍數跳躍
  u3: { multipleA: 4, multipleB: 6 },
  // U4: 擴分約分披薩
  u4: { numerator: 1, denominator: 2, scale: 2 },
  // U5: 正多邊形
  u5: { sides: 5, sectorAngle: 120 },
  // U6: 異分母分數通分
  u6: { n1: 1, d1: 3, n2: 1, d2: 4, op: '+' },
  // U7: 線對稱畫布
  u7: { isDrawing: false, mode: 'vertical' },
  // U8: 整數四則階梯
  u8: { exprStep: 0 },
  // U9: 面積割補
  u9: { shape: 'parallelogram', base: 8, height: 5 },
  // U10: 3D 柱體錐體
  u10: { type: 'prism', n: 6 }
};

/* 切換 5上 單元 */
function switchG5Unit(unitNum) {
  if (typeof playTone === 'function') playTone(440, 0.08);

  // 若切換至線上測驗中心 (第 11 個標籤)
  if (unitNum === 11) {
    for (let i = 1; i <= 10; i++) {
      const tab = document.getElementById(`g5UnitTab${i}`);
      const sec = document.getElementById(`g5_unit${i}`);
      if (tab) tab.classList.remove('active');
      if (sec) sec.classList.remove('active');
    }
    const tab11 = document.getElementById('g5UnitTab11');
    if (tab11) tab11.classList.add('active');
    const u10Sec = document.getElementById('unit10');
    if (u10Sec) u10Sec.classList.add('active');
    if (typeof setQuizGrade === 'function') setQuizGrade('5上');
    if (typeof renderQuizCenter === 'function') renderQuizCenter();
    return;
  }

  // 關閉測驗中心與其他年級單元
  if (typeof hideAllGradeSections === 'function') hideAllGradeSections();

  for (let i = 1; i <= 10; i++) {
    const tab = document.getElementById(`g5UnitTab${i}`);
    const sec = document.getElementById(`g5_unit${i}`);
    if (tab) tab.classList.toggle('active', i === unitNum);
    if (sec) sec.classList.toggle('active', i === unitNum);
  }
  const tab11 = document.getElementById('g5UnitTab11');
  if (tab11) tab11.classList.remove('active');

  g5State.currentUnit = unitNum;
  initG5Unit(unitNum);

  if (typeof window.MathMLRenderer !== 'undefined' && typeof window.MathMLRenderer.renderElement === 'function') {
    const sec = document.getElementById(`g5_unit${unitNum}`);
    if (sec) window.MathMLRenderer.renderElement(sec);
  }
}

function openG5UnitQuiz(unitNum) {
  if (typeof setQuizGrade === 'function') {
    setQuizGrade('5上', true);
  }
  switchG5Unit(11);
  if (typeof selectQuizUnit === 'function') {
    selectQuizUnit(unitNum);
  }
}

function initG5Unit(unitNum) {
  if (unitNum === 1) renderG5U1();
  else if (unitNum === 2) renderG5U2();
  else if (unitNum === 3) renderG5U3();
  else if (unitNum === 4) renderG5U4();
  else if (unitNum === 5) renderG5U5();
  else if (unitNum === 6) renderG5U6();
  else if (unitNum === 7) initG5U7Canvas();
  else if (unitNum === 8) renderG5U8();
  else if (unitNum === 9) renderG5U9();
  else if (unitNum === 10) renderG5U10();
}

function initG5App() {
  initG5Unit(1);
}

/* =========================================================
   單元 1：多位小數與加減 (千分位定位板 & 直式對齊)
   ========================================================= */
function changeG5U1(place, delta) {
  g5State.u1[place] = Math.max(0, Math.min(9, g5State.u1[place] + delta));
  renderG5U1();
}

function renderG5U1() {
  const { intVal, tenths, hundredths, thousandths } = g5State.u1;
  const numStr = `${intVal}.${tenths}${hundredths}${thousandths}`;
  
  const valEl = document.getElementById('g5U1ValDisplay');
  if (valEl) valEl.textContent = numStr;

  const intEl = document.getElementById('g5U1IntText');
  const tEl = document.getElementById('g5U1TenthsText');
  const hEl = document.getElementById('g5U1HundredthsText');
  const thEl = document.getElementById('g5U1ThousandthsText');
  if (intEl) intEl.textContent = intVal;
  if (tEl) tEl.textContent = tenths;
  if (hEl) hEl.textContent = hundredths;
  if (thEl) thEl.textContent = thousandths;

  // 讀法
  const readEl = document.getElementById('g5U1ReadDisplay');
  if (readEl) {
    const cMap = ['零','一','二','三','四','五','六','七','八','九'];
    readEl.textContent = `${cMap[intVal]}點${cMap[tenths]}${cMap[hundredths]}${cMap[thousandths]}`;
  }

  // 累加組合說明
  const compEl = document.getElementById('g5U1CompDisplay');
  if (compEl) {
    compEl.innerHTML = `由 <strong>${intVal}</strong> 個 1、<strong>${tenths}</strong> 個 0.1、<strong>${hundredths}</strong> 個 0.01 和 <strong>${thousandths}</strong> 個 0.001 合成！`;
  }
}

function calcG5U1Vertical() {
  const n1 = parseFloat(document.getElementById('g5U1Add1').value) || 0;
  const n2 = parseFloat(document.getElementById('g5U1Add2').value) || 0;
  const op = document.getElementById('g5U1Op').value;
  const res = (op === '+') ? (n1 + n2) : (n1 - n2);
  const resFixed = Math.round(res * 1000) / 1000;

  const outEl = document.getElementById('g5U1VertResult');
  if (outEl) {
    outEl.innerHTML = `
      <div style="font-family:monospace; font-size:1.4rem; text-align:right; width:180px; margin:0 auto; line-height:1.4;">
        <div>&nbsp;&nbsp;${n1.toFixed(3)}</div>
        <div style="border-bottom:2px solid #334155;">${op} ${n2.toFixed(3)}</div>
        <div style="color:#2563EB; font-weight:900;">&nbsp;&nbsp;${resFixed.toFixed(3)}</div>
      </div>
      <div style="font-size:0.88rem; color:#475569; margin-top:0.5rem; text-align:center;">
        💡 小數點垂直對齊紅線，不足位補 0，計算精確無誤！
      </div>
    `;
  }
}

/* =========================================================
   單元 2：因數與公因數 (因數彩虹 & 金幣分裝)
   ========================================================= */
function renderG5U2() {
  const num = parseInt(document.getElementById('g5U2TargetNum')?.value || g5State.u2.targetNum);
  g5State.u2.targetNum = num;

  const factors = [];
  for (let i = 1; i <= num; i++) {
    if (num % i === 0) factors.push(i);
  }

  const listEl = document.getElementById('g5U2FactorsList');
  if (listEl) {
    listEl.innerHTML = factors.map(f => `
      <span style="display:inline-block; padding:4px 12px; background:#EFF6FF; color:#1D4ED8; border:2px solid #93C5FD; border-radius:99px; font-weight:900; margin:4px;">${f}</span>
    `).join('');
  }

  // 彩虹配對 SVG
  const rainbowSvg = document.getElementById('g5U2RainbowSvg');
  if (rainbowSvg) {
    let svgContent = '';
    const n = factors.length;
    const w = 480;
    const step = w / (n + 1);
    
    // 繪製半圓彩虹弧線
    const colors = ['#EF4444', '#F59E0B', '#10B981', '#3B82F6', '#8B5CF6', '#EC4899'];
    for (let i = 0; i < Math.floor(n / 2); i++) {
      const x1 = (i + 1) * step;
      const x2 = (n - i) * step;
      const r = (x2 - x1) / 2;
      const c = colors[i % colors.length];
      svgContent += `<path d="M ${x1} 70 A ${r} ${r * 0.7} 0 0 1 ${x2} 70" fill="none" stroke="${c}" stroke-width="3" stroke-dasharray="4,2"/>`;
    }

    // 繪製數字點
    factors.forEach((f, idx) => {
      const x = (idx + 1) * step;
      svgContent += `
        <circle cx="${x}" cy="70" r="14" fill="#3B82F6" />
        <text x="${x}" y="74" font-size="12" font-weight="900" fill="white" text-anchor="middle">${f}</text>
      `;
    });

    rainbowSvg.innerHTML = svgContent;
  }

  // 公因數與最大公因數計算
  calcG5U2Common();
}

function calcG5U2Common() {
  const nA = parseInt(document.getElementById('g5U2NumA')?.value || 18);
  const nB = parseInt(document.getElementById('g5U2NumB')?.value || 24);

  const fA = []; for (let i = 1; i <= nA; i++) if (nA % i === 0) fA.push(i);
  const fB = []; for (let i = 1; i <= nB; i++) if (nB % i === 0) fB.push(i);
  const common = fA.filter(x => fB.includes(x));
  const gcd = Math.max(...common);

  const resEl = document.getElementById('g5U2CommonResult');
  if (resEl) {
    resEl.innerHTML = `
      <div style="margin-top:0.5rem; line-height:1.6;">
        <div><strong>${nA}</strong> 的因數：${fA.join('、')}</div>
        <div><strong>${nB}</strong> 的因數：${fB.join('、')}</div>
        <div style="color:#059669; font-weight:800; margin-top:0.3rem;">
          ✨ 共同的公因數：【 ${common.join('、')} 】
        </div>
        <div style="color:#DC2626; font-size:1.15rem; font-weight:900; margin-top:0.3rem;">
          🏆 最大公因數 (GCD)：${gcd}
        </div>
      </div>
    `;
  }
}

/* =========================================================
   單元 3：倍數與公倍數 (百數表點燈 & 相遇數線)
   ========================================================= */
function renderG5U3() {
  const mA = parseInt(document.getElementById('g5U3MulA')?.value || g5State.u3.multipleA);
  const mB = parseInt(document.getElementById('g5U3MulB')?.value || g5State.u3.multipleB);
  g5State.u3.multipleA = mA;
  g5State.u3.multipleB = mB;

  const gridEl = document.getElementById('g5U3HundredGrid');
  if (gridEl) {
    let cells = '';
    for (let i = 1; i <= 100; i++) {
      const isA = (i % mA === 0);
      const isB = (i % mB === 0);
      let bg = '#F8FAFC';
      let border = '#E2E8F0';
      let color = '#475569';
      let badge = '';

      if (isA && isB) {
        bg = '#FDF2F8';
        border = '#EC4899';
        color = '#BE185D';
        badge = '⭐';
      } else if (isA) {
        bg = '#EFF6FF';
        border = '#3B82F6';
        color = '#1D4ED8';
      } else if (isB) {
        bg = '#ECFDF5';
        border = '#10B981';
        color = '#047857';
      }

      cells += `
        <div style="background:${bg}; border:2px solid ${border}; border-radius:6px; padding:4px 0; text-align:center; font-weight:800; font-size:0.85rem; color:${color}; position:relative;">
          ${i} ${badge}
        </div>
      `;
    }
    gridEl.innerHTML = cells;
  }

  // 最小公倍數 (LCM)
  let lcm = 1;
  while ((lcm % mA !== 0) || (lcm % mB !== 0)) {
    lcm++;
  }
  const lcmEl = document.getElementById('g5U3LcmDisplay');
  if (lcmEl) {
    lcmEl.innerHTML = `
      <span style="color:#2563EB;">【${mA}】的倍數</span> 與 
      <span style="color:#059669;">【${mB}】的倍數</span> 
      在 <strong>${lcm}</strong> 第一次相遇！最小公倍數 (LCM) ＝ <strong>${lcm}</strong>
    `;
  }
}

/* =========================================================
   單元 4：擴分、約分與通分 (等值切披薩 & 通分天平)
   ========================================================= */
function renderG5U4() {
  const scale = parseInt(document.getElementById('g5U4ScaleSlider')?.value || 2);
  const n = 1;
  const d = 2;
  const scaledN = n * scale;
  const scaledD = d * scale;

  const formulaEl = document.getElementById('g5U4ScaleFormula');
  if (formulaEl) {
    formulaEl.innerHTML = `
      <span class="math-frac"><span class="math-num">${n}</span><span class="math-frac-bar"></span><span class="math-den">${d}</span></span>
      &nbsp;＝&nbsp;
      <span class="math-frac"><span class="math-num">${n} × ${scale}</span><span class="math-frac-bar"></span><span class="math-den">${d} × ${scale}</span></span>
      &nbsp;＝&nbsp;
      <span class="math-frac" style="color:#2563EB;"><span class="math-num">${scaledN}</span><span class="math-frac-bar"></span><span class="math-den">${scaledD}</span></span>
    `;
  }

  // 披薩 SVG
  const pizzaSvg = document.getElementById('g5U4PizzaSvg');
  if (pizzaSvg) {
    let slices = '';
    const cx = 100, cy = 100, r = 85;
    for (let i = 0; i < scaledD; i++) {
      const a1 = (i * 360 / scaledD) * Math.PI / 180;
      const a2 = ((i + 1) * 360 / scaledD) * Math.PI / 180;
      const x1 = cx + r * Math.cos(a1);
      const y1 = cy + r * Math.sin(a1);
      const x2 = cx + r * Math.cos(a2);
      const y2 = cy + r * Math.sin(a2);
      const isSelected = (i < scaledN);
      const fill = isSelected ? '#FBBF24' : '#F1F5F9';
      const stroke = '#D97706';
      slices += `<path d="M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 0 1 ${x2} ${y2} Z" fill="${fill}" stroke="${stroke}" stroke-width="2"/>`;
    }
    pizzaSvg.innerHTML = slices;
  }
}

function compareG5U4Fractions() {
  const n1 = parseInt(document.getElementById('g5U4CmpN1')?.value || 3);
  const d1 = parseInt(document.getElementById('g5U4CmpD1')?.value || 4);
  const n2 = parseInt(document.getElementById('g5U4CmpN2')?.value || 5);
  const d2 = parseInt(document.getElementById('g5U4CmpD2')?.value || 6);

  // 找最小公倍數通分
  let commonD = 1;
  while ((commonD % d1 !== 0) || (commonD % d2 !== 0)) commonD++;

  const newN1 = n1 * (commonD / d1);
  const newN2 = n2 * (commonD / d2);
  let sym = '＝';
  if (newN1 > newN2) sym = '＞';
  else if (newN1 < newN2) sym = '＜';

  const resEl = document.getElementById('g5U4CmpResult');
  if (resEl) {
    resEl.innerHTML = `
      <div style="font-size:1.15rem; font-weight:800; line-height:1.8;">
        <div>通分公分母：<strong>${commonD}</strong></div>
        <div>
          <span class="math-frac"><span class="math-num">${n1}</span><span class="math-frac-bar"></span><span class="math-den">${d1}</span></span>
          ＝ <span class="math-frac"><span class="math-num">${newN1}</span><span class="math-frac-bar"></span><span class="math-den">${commonD}</span></span>
        </div>
        <div>
          <span class="math-frac"><span class="math-num">${n2}</span><span class="math-frac-bar"></span><span class="math-den">${d2}</span></span>
          ＝ <span class="math-frac"><span class="math-num">${newN2}</span><span class="math-frac-bar"></span><span class="math-den">${commonD}</span></span>
        </div>
        <div style="font-size:1.35rem; color:#DC2626; margin-top:0.4rem;">
          比較結果：${n1}/${d1} <strong>${sym}</strong> ${n2}/${d2}
        </div>
      </div>
    `;
    if (window.MathMLRenderer) window.MathMLRenderer.renderElement(resEl);
  }
}

/* =========================================================
   單元 5：多邊形與扇形 (正多邊形內角和 & 扇形圓心角)
   ========================================================= */
function renderG5U5() {
  const sides = parseInt(document.getElementById('g5U5SidesSlider')?.value || 5);
  g5State.u5.sides = sides;

  const totalDeg = (sides - 2) * 180;
  const eachDeg = Math.round((totalDeg / sides) * 10) / 10;
  const diagCount = sides * (sides - 3) / 2;

  const infoEl = document.getElementById('g5U5PolygonInfo');
  if (infoEl) {
    infoEl.innerHTML = `
      <div style="line-height:1.7;">
        <div>🔷 幾何圖形：<strong>正 ${sides} 邊形</strong></div>
        <div>📐 三角形分割數：${sides} － 2 ＝ <strong>${sides - 2}</strong> 個三角形</div>
        <div>🔥 內角和：(${sides} － 2) × 180° ＝ <strong style="color:#2563EB;">${totalDeg}°</strong></div>
        <div>⭐ 每個內角：${totalDeg}° ÷ ${sides} ＝ <strong style="color:#059669;">${eachDeg}°</strong></div>
        <div>✨ 對角線總數：${sides} × (${sides} － 3) ÷ 2 ＝ <strong>${diagCount}</strong> 條</div>
      </div>
    `;
  }

  // 繪製多邊形 SVG
  const polySvg = document.getElementById('g5U5PolySvg');
  if (polySvg) {
    const cx = 110, cy = 110, r = 80;
    const pts = [];
    for (let i = 0; i < sides; i++) {
      const a = (i * 2 * Math.PI / sides) - Math.PI / 2;
      pts.push(`${cx + r * Math.cos(a)},${cy + r * Math.sin(a)}`);
    }
    let diags = '';
    for (let i = 0; i < sides; i++) {
      for (let j = i + 2; j < sides; j++) {
        if (i === 0 && j === sides - 1) continue;
        const [x1, y1] = pts[i].split(',');
        const [x2, y2] = pts[j].split(',');
        diags += `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="#CBD5E1" stroke-width="1.5" stroke-dasharray="3,2"/>`;
      }
    }
    polySvg.innerHTML = `
      ${diags}
      <polygon points="${pts.join(' ')}" fill="#DBEAFE" stroke="#1D4ED8" stroke-width="3"/>
    `;
  }

  // 扇形
  renderG5U5Sector();
}

function renderG5U5Sector() {
  const deg = parseInt(document.getElementById('g5U5AngleSlider')?.value || 120);
  const frac = deg / 360;
  const fracText = (deg === 90) ? '1/4' : (deg === 180) ? '1/2' : (deg === 120) ? '1/3' : (deg === 72) ? '1/5' : `${deg}/360`;

  const infoEl = document.getElementById('g5U5SectorInfo');
  if (infoEl) {
    infoEl.innerHTML = `圓心角 <strong>${deg}°</strong>，是圓的 <strong>${fracText}</strong> 圓！`;
  }

  const svg = document.getElementById('g5U5SectorSvg');
  if (svg) {
    const cx = 100, cy = 100, r = 80;
    const a1 = -Math.PI / 2;
    const a2 = a1 + (deg * Math.PI / 180);
    const x2 = cx + r * Math.cos(a2);
    const y2 = cy + r * Math.sin(a2);
    const large = (deg > 180) ? 1 : 0;
    svg.innerHTML = `
      <circle cx="${cx}" cy="${cy}" r="${r}" fill="#F1F5F9" stroke="#94A3B8" stroke-width="1.5"/>
      <path d="M ${cx} ${cy} L ${cx} ${cy - r} A ${r} ${r} 0 ${large} 1 ${x2} ${y2} Z" fill="#FDE68A" stroke="#B45309" stroke-width="2.5"/>
      <circle cx="${cx}" cy="${cy}" r="4" fill="#B45309" />
    `;
  }
}

/* =========================================================
   單元 6：異分母分數加減 (通分水杯拼合機)
   ========================================================= */
function renderG5U6() {
  const n1 = parseInt(document.getElementById('g5U6N1')?.value || 1);
  const d1 = parseInt(document.getElementById('g5U6D1')?.value || 3);
  const n2 = parseInt(document.getElementById('g5U6N2')?.value || 1);
  const d2 = parseInt(document.getElementById('g5U6D2')?.value || 4);
  const op = document.getElementById('g5U6Op')?.value || '+';

  let commonD = 1;
  while ((commonD % d1 !== 0) || (commonD % d2 !== 0)) commonD++;
  const tn1 = n1 * (commonD / d1);
  const tn2 = n2 * (commonD / d2);
  const resN = (op === '+') ? (tn1 + tn2) : (tn1 - tn2);

  const outEl = document.getElementById('g5U6ResultWrap');
  if (outEl) {
    outEl.innerHTML = `
      <div style="font-size:1.25rem; font-weight:800; line-height:2;">
        <span class="math-frac"><span class="math-num">${n1}</span><span class="math-frac-bar"></span><span class="math-den">${d1}</span></span>
        &nbsp;${op}&nbsp;
        <span class="math-frac"><span class="math-num">${n2}</span><span class="math-frac-bar"></span><span class="math-den">${d2}</span></span>
        &nbsp;＝&nbsp;
        <span class="math-frac"><span class="math-num">${tn1}</span><span class="math-frac-bar"></span><span class="math-den">${commonD}</span></span>
        &nbsp;${op}&nbsp;
        <span class="math-frac"><span class="math-num">${tn2}</span><span class="math-frac-bar"></span><span class="math-den">${commonD}</span></span>
        &nbsp;＝&nbsp;
        <span class="math-frac" style="color:#2563EB; font-size:1.35rem;"><span class="math-num">${resN}</span><span class="math-frac-bar"></span><span class="math-den">${commonD}</span></span>
      </div>
      <div style="margin-top:0.6rem; color:#475569; font-size:0.9rem;">
        💡 步驟拆解：兩數分母不同，先找 [${d1}, ${d2}] ＝ ${commonD} 進行通分，再計算分子！
      </div>
    `;
    if (window.MathMLRenderer) window.MathMLRenderer.renderElement(outEl);
  }
}

/* =========================================================
   單元 7：線對稱圖形 (鏡射對稱互動畫布)
   ========================================================= */
let g5U7Ctx = null;
function initG5U7Canvas() {
  const canvas = document.getElementById('g5U7Canvas');
  if (!canvas) return;
  g5U7Ctx = canvas.getContext('2d');
  clearG5U7Canvas();

  let isDown = false;
  let lastX = 0, lastY = 0;

  canvas.onmousedown = (e) => {
    isDown = true;
    const rect = canvas.getBoundingClientRect();
    lastX = e.clientX - rect.left;
    lastY = e.clientY - rect.top;
  };

  window.addEventListener('mouseup', () => { isDown = false; });

  canvas.onmousemove = (e) => {
    if (!isDown) return;
    const rect = canvas.getBoundingClientRect();
    const curX = e.clientX - rect.left;
    const curY = e.clientY - rect.top;

    drawSymmetricLine(lastX, lastY, curX, curY);
    lastX = curX;
    lastY = curY;
  };
}

function drawSymmetricLine(x1, y1, x2, y2) {
  if (!g5U7Ctx) return;
  const canvas = document.getElementById('g5U7Canvas');
  const midX = canvas.width / 2;

  g5U7Ctx.lineWidth = 3;
  g5U7Ctx.lineCap = 'round';

  // 原軌跡 (藍色)
  g5U7Ctx.strokeStyle = '#2563EB';
  g5U7Ctx.beginPath();
  g5U7Ctx.moveTo(x1, y1);
  g5U7Ctx.lineTo(x2, y2);
  g5U7Ctx.stroke();

  // 鏡射軌跡 (紅色)
  const symX1 = 2 * midX - x1;
  const symX2 = 2 * midX - x2;
  g5U7Ctx.strokeStyle = '#EF4444';
  g5U7Ctx.beginPath();
  g5U7Ctx.moveTo(symX1, y1);
  g5U7Ctx.lineTo(symX2, y2);
  g5U7Ctx.stroke();
}

function clearG5U7Canvas() {
  const canvas = document.getElementById('g5U7Canvas');
  if (!canvas || !g5U7Ctx) return;
  g5U7Ctx.clearRect(0, 0, canvas.width, canvas.height);

  // 繪製對稱軸虛線
  const midX = canvas.width / 2;
  g5U7Ctx.strokeStyle = '#94A3B8';
  g5U7Ctx.lineWidth = 2;
  g5U7Ctx.setLineDash([6, 6]);
  g5U7Ctx.beginPath();
  g5U7Ctx.moveTo(midX, 0);
  g5U7Ctx.lineTo(midX, canvas.height);
  g5U7Ctx.stroke();
  g5U7Ctx.setLineDash([]);
}

/* =========================================================
   單元 8：整數四則運算 (優先順序階梯圖 & 分配律)
   ========================================================= */
const g5U8Steps = [
  { text: '原算式：15 ＋ 25 × (12 － 8)', hint: '🔍 規則：括號有最高優先權，括號內先算！' },
  { text: '第 1 步：15 ＋ 25 × 4', hint: '🔍 規則：先乘除後加減，先算 25 × 4！' },
  { text: '第 2 步：15 ＋ 100', hint: '🔍 規則：最後計算加法！' },
  { text: '答案：115 🎉', hint: '✨ 運算順序完全正確！' }
];

function renderG5U8() {
  const step = g5State.u8.exprStep;
  const s = g5U8Steps[step];
  const displayEl = document.getElementById('g5U8ExprDisplay');
  const hintEl = document.getElementById('g5U8HintDisplay');
  if (displayEl) displayEl.textContent = s.text;
  if (hintEl) hintEl.textContent = s.hint;

  // 分配律演示
  const a = 12, b = 8, c = 5;
  const distEl = document.getElementById('g5U8DistDisplay');
  if (distEl) {
    distEl.innerHTML = `
      <div>長方形長 (A＋B) ＝ ${a} ＋ ${b} ＝ ${a + b}，寬 C ＝ ${c}</div>
      <div style="font-weight:900; color:#2563EB; font-size:1.15rem; margin-top:0.4rem;">
        (${a} ＋ ${b}) × ${c} ＝ ${a} × ${c} ＋ ${b} × ${c} ＝ ${a * c} ＋ ${b * c} ＝ ${(a + b) * c}
      </div>
    `;
  }
}

function nextG5U8Step() {
  g5State.u8.exprStep = (g5State.u8.exprStep + 1) % g5U8Steps.length;
  renderG5U8();
}

function resetG5U8Step() {
  g5State.u8.exprStep = 0;
  renderG5U8();
}

/* =========================================================
   單元 9：面積割補拼湊 (平行四邊形/三角形/梯形)
   ========================================================= */
function setG5U9Shape(shape) {
  g5State.u9.shape = shape;
  renderG5U9();
}

function renderG5U9() {
  const shape = g5State.u9.shape;
  const b = g5State.u9.base;
  const h = g5State.u9.height;
  const wrap = document.getElementById('g5U9CanvasWrap');
  if (!wrap) return;

  if (shape === 'parallelogram') {
    wrap.innerHTML = `
      <div style="font-size:1.1rem; font-weight:800; color:#1E3A8A; margin-bottom:0.5rem;">
        🟩 平行四邊形面積 ＝ 底 × 高 ＝ ${b} × ${h} ＝ <strong>${b * h}</strong> cm²
      </div>
      <svg width="340" height="150" viewBox="0 0 340 150">
        <polygon points="40,110 160,110 200,30 80,30" fill="#DBEAFE" stroke="#1D4ED8" stroke-width="2.5"/>
        <line x1="80" y1="30" x2="80" y2="110" stroke="#DC2626" stroke-width="2" stroke-dasharray="4,2"/>
        <text x="85" y="75" font-size="12" font-weight="900" fill="#DC2626">高 ${h}</text>
        <text x="100" y="125" font-size="12" font-weight="900" fill="#1E40AF">底 ${b}</text>
        <path d="M 160 110 L 200 30 L 200 110 Z" fill="#FEE2E2" stroke="#DC2626" stroke-width="1.5" stroke-dasharray="3,2"/>
        <text x="210" y="75" font-size="11" fill="#DC2626">剪下平移拼成長方形 ➔</text>
      </svg>
    `;
  } else if (shape === 'triangle') {
    wrap.innerHTML = `
      <div style="font-size:1.1rem; font-weight:800; color:#1E3A8A; margin-bottom:0.5rem;">
        🔺 三角形面積 ＝ 底 × 高 ÷ 2 ＝ ${b} × ${h} ÷ 2 ＝ <strong>${b * h / 2}</strong> cm²
      </div>
      <svg width="340" height="150" viewBox="0 0 340 150">
        <polygon points="40,110 180,110 110,30" fill="#FEF3C7" stroke="#D97706" stroke-width="2.5"/>
        <line x1="110" y1="30" x2="110" y2="110" stroke="#DC2626" stroke-width="2" stroke-dasharray="4,2"/>
        <text x="115" y="75" font-size="12" font-weight="900" fill="#DC2626">高 ${h}</text>
        <text x="100" y="125" font-size="12" font-weight="900" fill="#B45309">底 ${b}</text>
        <polygon points="180,110 250,30 110,30" fill="none" stroke="#D97706" stroke-width="1.5" stroke-dasharray="4,2"/>
        <text x="170" y="65" font-size="11" fill="#B45309">旋轉 180° 複製拼合</text>
      </svg>
    `;
  } else {
    // 梯形
    const topB = 4;
    wrap.innerHTML = `
      <div style="font-size:1.1rem; font-weight:800; color:#1E3A8A; margin-bottom:0.5rem;">
        📐 梯形面積 ＝ (上底 ＋ 下底) × 高 ÷ 2 ＝ (${topB} ＋ ${b}) × ${h} ÷ 2 ＝ <strong>${(topB + b) * h / 2}</strong> cm²
      </div>
      <svg width="340" height="150" viewBox="0 0 340 150">
        <polygon points="40,110 180,110 140,30 60,30" fill="#ECFDF5" stroke="#059669" stroke-width="2.5"/>
        <text x="95" y="24" font-size="12" font-weight="900" fill="#047857">上底 ${topB}</text>
        <text x="100" y="125" font-size="12" font-weight="900" fill="#047857">下底 ${b}</text>
        <line x1="60" y1="30" x2="60" y2="110" stroke="#DC2626" stroke-width="2" stroke-dasharray="4,2"/>
        <text x="65" y="75" font-size="12" font-weight="900" fill="#DC2626">高 ${h}</text>
      </svg>
    `;
  }
}

/* =========================================================
   單元 10：柱體、錐體和球 (3D 幾何特徵計算器)
   ========================================================= */
function setG5U10Type(type, n) {
  g5State.u10.type = type;
  g5State.u10.n = n;
  renderG5U10();
}

function renderG5U10() {
  const { type, n } = g5State.u10;
  let name = '', faces = 0, vertices = 0, edges = 0;

  if (type === 'prism') {
    name = `${n} 角柱`;
    faces = n + 2;
    vertices = 2 * n;
    edges = 3 * n;
  } else if (type === 'pyramid') {
    name = `${n} 角錐`;
    faces = n + 1;
    vertices = n + 1;
    edges = 2 * n;
  } else if (type === 'cylinder') {
    name = '圓 柱';
    faces = 3;
    vertices = 0;
    edges = 2;
  } else if (type === 'cone') {
    name = '圓 錐';
    faces = 2;
    vertices = 1;
    edges = 1;
  } else if (type === 'sphere') {
    name = '球 體';
    faces = 1;
    vertices = 0;
    edges = 0;
  }

  const resEl = document.getElementById('g5U10CalcResult');
  if (resEl) {
    resEl.innerHTML = `
      <div style="background:#F8FAFC; border:2px solid #CBD5E1; border-radius:12px; padding:1rem; line-height:1.8;">
        <h3 style="font-size:1.35rem; color:#1E3A8A; margin-bottom:0.4rem;">🧊 形體名稱：<strong>${name}</strong></h3>
        <div style="font-size:1.05rem; display:grid; grid-template-columns:repeat(auto-fit, minmax(130px, 1fr)); gap:0.5rem; margin-top:0.5rem;">
          <div style="background:#EFF6FF; padding:0.5rem; border-radius:8px; border:1px solid #93C5FD; text-align:center;">
            面數 (F)：<strong style="color:#1D4ED8; font-size:1.3rem;">${faces}</strong>
          </div>
          <div style="background:#ECFDF5; padding:0.5rem; border-radius:8px; border:1px solid #6EE7B7; text-align:center;">
            頂點數 (V)：<strong style="color:#047857; font-size:1.3rem;">${vertices}</strong>
          </div>
          <div style="background:#FEF3C7; padding:0.5rem; border-radius:8px; border:1px solid #FCD34D; text-align:center;">
            邊數 (E)：<strong style="color:#B45309; font-size:1.3rem;">${edges}</strong>
          </div>
        </div>
        ${type === 'prism' ? `<div style="font-size:0.88rem; color:#64748B; margin-top:0.6rem;">💡 角柱公式：面數 ＝ n ＋ 2，頂點數 ＝ 2n，邊數 ＝ 3n</div>` : ''}
        ${type === 'pyramid' ? `<div style="font-size:0.88rem; color:#64748B; margin-top:0.6rem;">💡 角錐公式：面數 ＝ n ＋ 1，頂點數 ＝ n ＋ 1，邊數 ＝ 2n</div>` : ''}
      </div>
    `;
  }
}

if (typeof window !== 'undefined') {
  window.switchG5Unit = switchG5Unit;
  window.openG5UnitQuiz = openG5UnitQuiz;
  window.initG5App = initG5App;
}
