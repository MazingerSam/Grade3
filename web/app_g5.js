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
    if (sec) {
      sec.classList.toggle('active', i === unitNum);
      sec.style.display = (i === unitNum ? 'block' : 'none');
    }
  }
  const tab11 = document.getElementById('g5UnitTab11');
  if (tab11) tab11.classList.remove('active');

  g5State.currentUnit = unitNum;
  initG5Unit(unitNum);
  if (unitNum >= 1 && unitNum <= 10 && typeof renderUnitPracticeLab === 'function') {
    renderUnitPracticeLab(`g5_unit${unitNum}`, 'kangxuan', '5上', unitNum);
  }

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
const g5U8Presets = [
  [
    { text: '原算式：15 ＋ 25 × (12 － 8)', hint: '🔍 規則 1：括號有最高優先權，括號內 (12 － 8) 先算！' },
    { text: '第 1 步：15 ＋ 25 × 4', hint: '🔍 規則 2：先乘除後加減，先算 25 × 4！' },
    { text: '第 2 步：15 ＋ 100', hint: '🔍 規則 3：最後計算加法 15 ＋ 100！' },
    { text: '答案：115 🎉', hint: '✨ 運算順序完全正確！' }
  ],
  [
    { text: '【滿額送馬克杯】500 － (299 ＋ 49 × 2)', hint: '🔍 規則 1：括號內也有乘加時，先算括號內的乘法 49 × 2 ＝ 98！' },
    { text: '第 1 步：500 － (299 ＋ 98)', hint: '🔍 規則 2：繼續算括號內的加法 299 ＋ 98 ＝ 397！' },
    { text: '第 2 步：500 － 397', hint: '🔍 規則 3：最後算減法 500 － 397！' },
    { text: '答案：找回 103 元 🎉', hint: '✨ 消費 397 元滿 2 × 168 ＝ 336 元，可換 2 個馬克杯！' }
  ],
  [
    { text: '原算式：(180 － 60) ÷ 12 × 5', hint: '🔍 規則 1：括號內先算 (180 － 60) ＝ 120！' },
    { text: '第 1 步：120 ÷ 12 × 5', hint: '🔍 規則 2：只有乘除時「由左而右」依序算，先算 120 ÷ 12 ＝ 10！' },
    { text: '第 2 步：10 × 5', hint: '🔍 規則 3：再算 10 × 5！' },
    { text: '答案：50 🎉', hint: '✨ 注意：千萬不能先算 12 × 5 喔！' }
  ]
];

function setG5U8Preset(idx) {
  g5State.u8.presetIdx = idx;
  g5State.u8.exprStep = 0;
  renderG5U8();
}

function setG5U8Dist(k, val) {
  if (!g5State.u8.distA) { g5State.u8.distA = 12; g5State.u8.distB = 8; g5State.u8.distC = 5; }
  g5State.u8[k] = Number(val);
  renderG5U8();
}

function renderG5U8() {
  if (typeof g5State.u8.presetIdx === 'undefined') g5State.u8.presetIdx = 0;
  if (!g5State.u8.distA) { g5State.u8.distA = 12; g5State.u8.distB = 8; g5State.u8.distC = 5; }
  const steps = g5U8Presets[g5State.u8.presetIdx] || g5U8Presets[0];
  const step = g5State.u8.exprStep % steps.length;
  const s = steps[step];
  const displayEl = document.getElementById('g5U8ExprDisplay');
  const hintEl = document.getElementById('g5U8HintDisplay');
  if (displayEl) displayEl.textContent = s.text;
  if (hintEl) hintEl.textContent = s.hint;

  // 分配律互動面積模型
  const a = g5State.u8.distA, b = g5State.u8.distB, c = g5State.u8.distC;
  const distEl = document.getElementById('g5U8DistDisplay');
  if (distEl) {
    const wA = Math.max(50, a * 8);
    const wB = Math.max(40, b * 8);
    const hC = Math.max(45, c * 8);
    distEl.innerHTML = `
      <div style="display:flex; gap:0.4rem; justify-content:center; flex-wrap:wrap; margin-bottom:0.75rem;">
        <button class="btn btn-outline" style="font-size:0.82rem; padding:3px 10px;" onclick="setG5U8Preset(0)">例題1：基本括號與乘加</button>
        <button class="btn btn-outline" style="font-size:0.82rem; padding:3px 10px;" onclick="setG5U8Preset(1)">例題2：滿額送馬克杯</button>
        <button class="btn btn-outline" style="font-size:0.82rem; padding:3px 10px;" onclick="setG5U8Preset(2)">例題3：乘除由左而右</button>
      </div>
      <div style="display:flex; gap:0.75rem; justify-content:center; align-items:center; flex-wrap:wrap; margin-bottom:0.6rem;">
        <label style="font-weight:800; font-size:0.9rem;">長 A：<input type="range" min="2" max="20" value="${a}" oninput="setG5U8Dist('distA', this.value)" style="width:80px; vertical-align:middle;"/> ${a}</label>
        <label style="font-weight:800; font-size:0.9rem;">長 B：<input type="range" min="2" max="20" value="${b}" oninput="setG5U8Dist('distB', this.value)" style="width:80px; vertical-align:middle;"/> ${b}</label>
        <label style="font-weight:800; font-size:0.9rem;">寬 C：<input type="range" min="2" max="12" value="${c}" oninput="setG5U8Dist('distC', this.value)" style="width:80px; vertical-align:middle;"/> ${c}</label>
      </div>
      <div style="display:inline-flex; align-items:center; justify-content:center; margin:0.4rem 0;">
        <div style="width:${wA}px; height:${hC}px; background:#DBEAFE; border:2px solid #2563EB; display:flex; align-items:center; justify-content:center; font-weight:900; color:#1E40AF; font-size:0.9rem;">${a}×${c}＝${a*c}</div>
        <div style="width:${wB}px; height:${hC}px; background:#DCFCE7; border:2px solid #16A34A; border-left:none; display:flex; align-items:center; justify-content:center; font-weight:900; color:#15803D; font-size:0.9rem;">${b}×${c}＝${b*c}</div>
      </div>
      <div style="font-weight:900; color:#2563EB; font-size:1.1rem; margin-top:0.4rem;">
        (${a} ＋ ${b}) × ${c} ＝ ${a} × ${c} ＋ ${b} × ${c} ＝ ${a * c} ＋ ${b * c} ＝ <strong>${(a + b) * c}</strong>
      </div>
    `;
  }
}

function nextG5U8Step() {
  const steps = g5U8Presets[g5State.u8.presetIdx || 0] || g5U8Presets[0];
  g5State.u8.exprStep = (g5State.u8.exprStep + 1) % steps.length;
  renderG5U8();
}

function resetG5U8Step() {
  g5State.u8.exprStep = 0;
  renderG5U8();
}

/* =========================================================
   單元 9：面積割補拼湊 (平行四邊形/三角形/梯形 + 互動滑桿)
   ========================================================= */
function setG5U9Shape(shape) {
  g5State.u9.shape = shape;
  renderG5U9();
}

function setG5U9Dim(key, val) {
  g5State.u9[key] = Number(val);
  renderG5U9();
}

function renderG5U9() {
  const shape = g5State.u9.shape;
  const b = g5State.u9.base || 10;
  const h = g5State.u9.height || 6;
  const topB = g5State.u9.topBase || 6;
  const wrap = document.getElementById('g5U9CanvasWrap');
  if (!wrap) return;

  const controlsHtml = `
    <div style="display:flex; gap:1rem; justify-content:center; align-items:center; flex-wrap:wrap; margin-bottom:0.85rem; background:#FFFFFF; padding:0.6rem 1rem; border-radius:10px; border:1px solid #E2E8F0;">
      ${shape === 'trapezoid' ? `
        <label style="font-weight:800; color:#047857; font-size:0.92rem;">上底：<strong>${topB}</strong> cm
          <input type="range" min="2" max="16" value="${topB}" oninput="setG5U9Dim('topBase', this.value)" style="width:90px; vertical-align:middle;" />
        </label>
      ` : ''}
      <label style="font-weight:800; color:#1E40AF; font-size:0.92rem;">${shape === 'trapezoid' ? '下底' : '底'}：<strong>${b}</strong> cm
        <input type="range" min="4" max="20" value="${b}" oninput="setG5U9Dim('base', this.value)" style="width:100px; vertical-align:middle;" />
      </label>
      <label style="font-weight:800; color:#DC2626; font-size:0.92rem;">高：<strong>${h}</strong> cm
        <input type="range" min="3" max="15" value="${h}" oninput="setG5U9Dim('height', this.value)" style="width:100px; vertical-align:middle;" />
      </label>
      <button class="btn btn-outline" style="font-size:0.82rem; padding:3px 10px;" onclick="g5State.u9.base=12;g5State.u9.height=8;g5State.u9.topBase=6;renderG5U9()">📐 載入三浦摺疊(底12×高8)</button>
    </div>
  `;

  if (shape === 'parallelogram') {
    wrap.innerHTML = controlsHtml + `
      <div style="font-size:1.15rem; font-weight:800; color:#1E3A8A; margin-bottom:0.5rem;">
        🟩 平行四邊形面積 ＝ 底 × 高 ＝ ${b} × ${h} ＝ <strong style="color:#DC2626; font-size:1.35rem;">${b * h}</strong> cm²
      </div>
      <svg width="360" height="155" viewBox="0 0 360 155" style="max-width:100%;">
        <polygon points="40,120 ${40 + b*10},120 ${75 + b*10},${120 - h*6} 75,${120 - h*6}" fill="#DBEAFE" stroke="#1D4ED8" stroke-width="2.5"/>
        <line x1="75" y1="${120 - h*6}" x2="75" y2="120" stroke="#DC2626" stroke-width="2" stroke-dasharray="4,2"/>
        <text x="80" y="${120 - h*3}" font-size="13" font-weight="900" fill="#DC2626">高 ${h}cm</text>
        <text x="${40 + b*5}" y="140" font-size="13" font-weight="900" fill="#1E40AF" text-anchor="middle">底 ${b}cm</text>
        <text x="275" y="75" font-size="11" font-weight="700" fill="#047857">✂️ 沿高剪下平移拼成長方形</text>
      </svg>
    `;
  } else if (shape === 'triangle') {
    wrap.innerHTML = controlsHtml + `
      <div style="font-size:1.15rem; font-weight:800; color:#1E3A8A; margin-bottom:0.5rem;">
        🔺 三角形面積 ＝ 底 × 高 ÷ 2 ＝ ${b} × ${h} ÷ 2 ＝ <strong style="color:#DC2626; font-size:1.35rem;">${(b * h) / 2}</strong> cm²
      </div>
      <svg width="360" height="155" viewBox="0 0 360 155" style="max-width:100%;">
        <polygon points="40,120 ${40 + b*10},120 ${40 + b*5},${120 - h*6}" fill="#FEF3C7" stroke="#D97706" stroke-width="2.5"/>
        <line x1="${40 + b*5}" y1="${120 - h*6}" x2="${40 + b*5}" y2="120" stroke="#DC2626" stroke-width="2" stroke-dasharray="4,2"/>
        <text x="${45 + b*5}" y="${120 - h*3}" font-size="13" font-weight="900" fill="#DC2626">高 ${h}cm</text>
        <text x="${40 + b*5}" y="140" font-size="13" font-weight="900" fill="#B45309" text-anchor="middle">底 ${b}cm</text>
        <polygon points="${40 + b*10},120 ${40 + b*15},${120 - h*6} ${40 + b*5},${120 - h*6}" fill="none" stroke="#D97706" stroke-width="1.5" stroke-dasharray="4,2"/>
        <text x="260" y="55" font-size="11" font-weight="700" fill="#B45309">🔄 2個全等三角形拼成平行四邊形</text>
      </svg>
    `;
  } else {
    wrap.innerHTML = controlsHtml + `
      <div style="font-size:1.15rem; font-weight:800; color:#1E3A8A; margin-bottom:0.5rem;">
        📐 梯形面積 ＝ (上底 ＋ 下底) × 高 ÷ 2 ＝ (${topB} ＋ ${b}) × ${h} ÷ 2 ＝ <strong style="color:#DC2626; font-size:1.35rem;">${((topB + b) * h) / 2}</strong> cm²
      </div>
      <svg width="360" height="155" viewBox="0 0 360 155" style="max-width:100%;">
        <polygon points="40,120 ${40 + b*8},120 ${60 + topB*8},${120 - h*6} 60,${120 - h*6}" fill="#ECFDF5" stroke="#059669" stroke-width="2.5"/>
        <text x="${60 + topB*4}" y="${112 - h*6}" font-size="12" font-weight="900" fill="#047857" text-anchor="middle">上底 ${topB}cm</text>
        <text x="${40 + b*4}" y="140" font-size="12" font-weight="900" fill="#047857" text-anchor="middle">下底 ${b}cm</text>
        <line x1="60" y1="${120 - h*6}" x2="60" y2="120" stroke="#DC2626" stroke-width="2" stroke-dasharray="4,2"/>
        <text x="65" y="${120 - h*3}" font-size="12" font-weight="900" fill="#DC2626">高 ${h}cm</text>
      </svg>
    `;
  }
}

/* =========================================================
   單元 10：柱體、錐體和球 (3D 幾何特徵計算器 + 球體截面探索)
   ========================================================= */
function setG5U10Type(type, n) {
  g5State.u10.type = type;
  g5State.u10.n = Number(n);
  renderG5U10();
}

function renderG5U10() {
  const { type, n } = g5State.u10;
  let name = '', faces = 0, vertices = 0, edges = 0, baseShape = '', sideShape = '';

  if (type === 'prism') {
    name = `${n} 角柱`;
    faces = n + 2;
    vertices = 2 * n;
    edges = 3 * n;
    baseShape = `2 個全等且互相平行的「正 ${n} 邊形」底面`;
    sideShape = `${n} 個「長方形」側面（側面皆與底面垂直）`;
  } else if (type === 'pyramid') {
    name = `${n} 角錐`;
    faces = n + 1;
    vertices = n + 1;
    edges = 2 * n;
    baseShape = `1 個「${n} 邊形」底面`;
    sideShape = `${n} 個「三角形」側面（交會於頂端 1 個頂點）`;
  } else if (type === 'cylinder') {
    name = '圓 柱';
    faces = 3;
    vertices = 0;
    edges = 2;
    baseShape = '上下 2 個全等且互相平行的「圓形」底面';
    sideShape = '側面展開後是 1 個「長方形」（長＝底面圓周長，寬＝柱高）';
  } else if (type === 'cone') {
    name = '圓 錐';
    faces = 2;
    vertices = 1;
    edges = 1;
    baseShape = '1 個「圓形」底面';
    sideShape = '側面展開後是 1 個「扇形」';
  } else if (type === 'sphere') {
    name = '球 體';
    faces = 1;
    vertices = 0;
    edges = 0;
    baseShape = '把球切開後，切面永遠是「圓形」；通過「球心」切開的圓面積最大！';
    sideShape = '球的直徑 ＝ 球半徑 × 2（如直徑20cm玩具球裝入43×39×32紙箱可裝2×1×1＝2層）';
  }

  const resEl = document.getElementById('g5U10CalcResult');
  if (resEl) {
    resEl.innerHTML = `
      <div style="background:#F8FAFC; border:2px solid #CBD5E1; border-radius:12px; padding:1rem; line-height:1.8;">
        <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:0.5rem;">
          <h3 style="font-size:1.35rem; color:#1E3A8A; margin:0;">🧊 形體名稱：<strong>${name}</strong></h3>
          ${(type === 'prism' || type === 'pyramid') ? `
            <label style="font-weight:800; color:#334155; font-size:0.92rem;">調整底面邊數 (n＝${n})：
              <input type="range" min="3" max="12" value="${n}" oninput="setG5U10Type('${type}', this.value)" style="width:110px; vertical-align:middle;" />
            </label>
          ` : ''}
        </div>
        <div style="font-size:1.05rem; display:grid; grid-template-columns:repeat(auto-fit, minmax(130px, 1fr)); gap:0.5rem; margin-top:0.65rem;">
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
        <div style="margin-top:0.65rem; background:#FFFFFF; border:1px solid #E2E8F0; border-radius:8px; padding:0.6rem 0.85rem; font-size:0.92rem; color:#334155;">
          <div>📌 <strong>底面與截面特徵</strong>：${baseShape}</div>
          <div>📌 <strong>側面與展開特徵</strong>：${sideShape}</div>
        </div>
        ${type === 'prism' ? `<div style="font-size:0.88rem; color:#1D4ED8; font-weight:800; margin-top:0.5rem;">💡 角柱公式：面數 ＝ n＋2 (${n}+2=${faces})，頂點數 ＝ 2×n (${vertices})，邊數 ＝ 3×n (${edges})</div>` : ''}
        ${type === 'pyramid' ? `<div style="font-size:0.88rem; color:#B45309; font-weight:800; margin-top:0.5rem;">💡 角錐公式：面數 ＝ n＋1 (${n}+1=${faces})，頂點數 ＝ n＋1 (${vertices})，邊數 ＝ 2×n (${edges})</div>` : ''}
      </div>
    `;
  }
}

if (typeof window !== 'undefined') {
  window.switchG5Unit = switchG5Unit;
  window.openG5UnitQuiz = openG5UnitQuiz;
  window.initG5App = initG5App;
}
