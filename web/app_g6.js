/* =========================================================
   木新思達 國小六年級上學期 (6上) 數學互動學習樂園 - 主互動邏輯 app_g6.js
   涵蓋 108 課綱 6上 全冊 9 大單元具體-圖像-抽象 (CPA) 高互動教具
   ========================================================= */

// 6上 全域狀態
const g6State = {
  currentUnit: 1,
  // U1: 短除法 (支援 2、3、4 個數)
  u1: { count: 3, nums: [18, 24, 36, 48] },
  // U2: 分數除法 (4大情境圖解)
  u2: { scenario: 'proper', n1: 2, d1: 1, n2: 1, d2: 3 },
  // U3: 數量關係 (植樹問題 3大情境 + 牙籤規律)
  u3: { mode: 'both', length: 80, interval: 20, squares: 5 },
  // U4: 小數除法 (4大情境直式計算)
  u4: { scenario: 1, dividend: 12, divisor: 0.4 },
  // U5: 比與比值 (生活比例應用)
  u5: { scenario: 'milktea', itemA: 3, itemB: 2, totalVal: 500 },
  // U6: 圓周長與扇形周長
  u6: { radius: 5, sectorAngle: 90 },
  // U7: 圓面積與扇形面積、同心圓
  u7: { radius: 6, sectorAngle: 90, outerR: 8, innerR: 4 },
  // U8: 速率魔法三角與交通工具
  u8: { target: 'speed', distance: 150, time: 2.5, speed: 60, vehicle: 'car' },
  // U9: 放大縮小比例尺與面積變化
  u9: { scaleFactor: 2, mapCm: 5, scaleRatio: 50000 }
};

/* 切換 6上 單元 */
function switchG6Unit(unitNum) {
  if (typeof playTone === 'function') playTone(440, 0.08);

  // 若切換至線上測驗中心 (第 10 個標籤)
  if (unitNum === 10) {
    for (let i = 1; i <= 9; i++) {
      const tab = document.getElementById(`g6UnitTab${i}`);
      const sec = document.getElementById(`g6_unit${i}`);
      if (tab) tab.classList.remove('active');
      if (sec) sec.classList.remove('active');
    }
    const tab10 = document.getElementById('g6UnitTab10');
    if (tab10) tab10.classList.add('active');
    const u10Sec = document.getElementById('unit10');
    if (u10Sec) u10Sec.classList.add('active');
    if (typeof setQuizGrade === 'function') setQuizGrade('6上');
    if (typeof renderQuizCenter === 'function') renderQuizCenter();
    return;
  }

  // 關閉測驗中心與其他年級單元
  if (typeof hideAllGradeSections === 'function') hideAllGradeSections();

  for (let i = 1; i <= 9; i++) {
    const tab = document.getElementById(`g6UnitTab${i}`);
    const sec = document.getElementById(`g6_unit${i}`);
    if (tab) tab.classList.toggle('active', i === unitNum);
    if (sec) sec.classList.toggle('active', i === unitNum);
  }
  const tab10 = document.getElementById('g6UnitTab10');
  if (tab10) tab10.classList.remove('active');

  g6State.currentUnit = unitNum;
  initG6Unit(unitNum);

  if (typeof window.MathMLRenderer !== 'undefined' && typeof window.MathMLRenderer.renderElement === 'function') {
    const sec = document.getElementById(`g6_unit${unitNum}`);
    if (sec) window.MathMLRenderer.renderElement(sec);
  }
}

function openG6UnitQuiz(unitNum) {
  if (typeof setQuizGrade === 'function') {
    setQuizGrade('6上', true);
  }
  switchG6Unit(10);
  if (typeof selectQuizUnit === 'function') {
    selectQuizUnit(unitNum);
  }
}

function initG6Unit(unitNum) {
  if (unitNum === 1) renderG6U1();
  else if (unitNum === 2) renderG6U2();
  else if (unitNum === 3) renderG6U3();
  else if (unitNum === 4) renderG6U4();
  else if (unitNum === 5) renderG6U5();
  else if (unitNum === 6) renderG6U6();
  else if (unitNum === 7) renderG6U7();
  else if (unitNum === 8) renderG6U8();
  else if (unitNum === 9) renderG6U9();
}

function initG6App() {
  initG6Unit(1);
}

/* =========================================================
   單元 1：最大公因數 (GCD) 與 最小公倍數 (LCM)
   支援 2 個數、3 個數、4 個數短除法階梯演繹
   嚴格區分：GCD（全體共同質因數）vs LCM（任兩數可約，其餘照抄）
   ========================================================= */
function setG6U1Count(count) {
  g6State.u1.count = count;
  // 更新按鈕樣式
  for (let i = 2; i <= 4; i++) {
    const btn = document.getElementById(`g6U1BtnCount${i}`);
    if (btn) {
      if (i === count) {
        btn.className = 'btn btn-primary';
      } else {
        btn.className = 'btn btn-outline';
      }
    }
    const inputWrap = document.getElementById(`g6U1InputWrap${i}`);
    if (inputWrap) {
      inputWrap.style.display = i <= count ? 'inline-flex' : 'none';
    }
  }
  // 載入推薦預設例題數值
  if (count === 2) {
    if (document.getElementById('g6U1Num1')) document.getElementById('g6U1Num1').value = 24;
    if (document.getElementById('g6U1Num2')) document.getElementById('g6U1Num2').value = 36;
  } else if (count === 3) {
    if (document.getElementById('g6U1Num1')) document.getElementById('g6U1Num1').value = 18;
    if (document.getElementById('g6U1Num2')) document.getElementById('g6U1Num2').value = 24;
    if (document.getElementById('g6U1Num3')) document.getElementById('g6U1Num3').value = 36;
  } else if (count === 4) {
    if (document.getElementById('g6U1Num1')) document.getElementById('g6U1Num1').value = 12;
    if (document.getElementById('g6U1Num2')) document.getElementById('g6U1Num2').value = 18;
    if (document.getElementById('g6U1Num3')) document.getElementById('g6U1Num3').value = 24;
    if (document.getElementById('g6U1Num4')) document.getElementById('g6U1Num4').value = 36;
  }
  renderG6U1();
}

function loadG6U1Preset(presetKey) {
  if (presetKey === '2num') {
    setG6U1Count(2);
    document.getElementById('g6U1Num1').value = 24;
    document.getElementById('g6U1Num2').value = 36;
  } else if (presetKey === '3num') {
    setG6U1Count(3);
    document.getElementById('g6U1Num1').value = 18;
    document.getElementById('g6U1Num2').value = 24;
    document.getElementById('g6U1Num3').value = 36;
  } else if (presetKey === '4num') {
    setG6U1Count(4);
    document.getElementById('g6U1Num1').value = 12;
    document.getElementById('g6U1Num2').value = 18;
    document.getElementById('g6U1Num3').value = 24;
    document.getElementById('g6U1Num4').value = 36;
  }
  renderG6U1();
}

function renderG6U1() {
  const count = g6State.u1.count || 2;
  const rawNums = [];
  for (let i = 1; i <= count; i++) {
    const el = document.getElementById(`g6U1Num${i}`);
    const v = parseInt(el?.value || (i === 1 ? 18 : i === 2 ? 24 : i === 3 ? 36 : 48));
    rawNums.push(Math.max(2, Math.min(999, isNaN(v) ? 12 : v)));
  }
  g6State.u1.nums = rawNums;

  // 1. 計算 GCD 的短除法 (必須全部整除)
  let curGcdNums = [...rawNums];
  const gcdSteps = [];
  const primes = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47];
  let pIdx = 0;

  while (pIdx < primes.length) {
    const p = primes[pIdx];
    const allDivisible = curGcdNums.every(n => n % p === 0);
    if (allDivisible) {
      const nextNums = curGcdNums.map(n => n / p);
      gcdSteps.push({ p, nums: [...curGcdNums], nextNums });
      curGcdNums = nextNums;
    } else {
      pIdx++;
    }
  }
  const gcdLeft = gcdSteps.map(s => s.p);
  const gcdVal = gcdLeft.reduce((acc, v) => acc * v, 1);

  // 2. 計算 LCM 的短除法 (只要有 >= 2 個數能被 p 整除即可繼續，其餘照抄)
  let curLcmNums = [...rawNums];
  const lcmSteps = [];
  pIdx = 0;

  while (pIdx < primes.length) {
    const p = primes[pIdx];
    // 檢查是否有至少 2 個數能被整除
    const divisibleCount = curLcmNums.filter(n => n % p === 0).length;
    if (divisibleCount >= 2) {
      const nextNums = curLcmNums.map(n => (n % p === 0 ? n / p : n));
      const copiedIndices = curLcmNums.map((n, idx) => (n % p !== 0 ? idx : -1)).filter(idx => idx !== -1);
      lcmSteps.push({ p, nums: [...curLcmNums], nextNums, copiedIndices });
      curLcmNums = nextNums;
    } else {
      pIdx++;
    }
  }
  const lcmLeft = lcmSteps.map(s => s.p);
  const lcmVal = lcmLeft.reduce((acc, v) => acc * v, 1) * curLcmNums.reduce((acc, v) => acc * v, 1);

  // 渲染短除法 HTML
  function buildStepTable(steps, bottomNums, isLcm = false) {
    let h = '<div style="font-family:\'Courier New\', monospace; font-size:1.15rem; line-height:1.7; display:inline-block; text-align:left;">';
    steps.forEach((s) => {
      const numItems = s.nums.map((n, idx) => {
        const isCopied = isLcm && s.copiedIndices && s.copiedIndices.includes(idx);
        return isCopied 
          ? `<span style="color:#64748B; font-weight:700;" title="無法整除，直接照抄移下">${n}</span>` 
          : `<span style="color:#0F172A; font-weight:800;">${n}</span>`;
      }).join(' , ');

      h += `
        <div style="display:flex; align-items:center;">
          <span style="color:#DC2626; font-weight:900; width:34px; text-align:right; margin-right:8px;">${s.p}</span>
          <span style="border-left:2.5px solid #334155; border-bottom:2.5px solid #334155; padding:2px 14px; display:inline-block;">
            ${numItems}
          </span>
        </div>
      `;
    });
    const bottomItems = bottomNums.map(n => `<span style="color:#2563EB; font-weight:900;">${n}</span>`).join(' , ');
    h += `
      <div style="margin-left:42px; padding:3px 14px; font-weight:900;">
        ${bottomItems}
      </div>
    </div>`;
    return h;
  }

  const outEl = document.getElementById('g6U1ShortDivDisplay');
  if (outEl) {
    const rawStr = rawNums.join(', ');
    outEl.innerHTML = `
      <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(320px, 1fr)); gap:1.25rem; text-align:left; margin-top:1rem;">
        
        <!-- GCD 卡片 -->
        <div style="background:#FFFFFF; border:2px solid #EF4444; border-radius:12px; padding:1.2rem; box-shadow:0 2px 4px rgba(0,0,0,0.04);">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.75rem;">
            <h4 style="font-size:1.15rem; font-weight:900; color:#DC2626; margin:0;">
              🔴 最大公因數 GCD (${rawStr})
            </h4>
            <span class="g6-highlight-badge badge-red">全體共同因數才能除</span>
          </div>
          <div style="text-align:center; padding:0.75rem; background:#FEF2F2; border-radius:8px; margin-bottom:0.75rem;">
            ${gcdSteps.length > 0 ? buildStepTable(gcdSteps, curGcdNums, false) : '<div style="color:#64748B;">此數組無大於 1 的共同質因數，互質！</div>'}
          </div>
          <div style="background:#FFF1F2; border:1px solid #FECDD3; border-radius:8px; padding:0.75rem; line-height:1.6; font-size:0.95rem;">
            <div>📌 <strong>左側共同質因數</strong>：${gcdLeft.length > 0 ? gcdLeft.join(' × ') : '1'}</div>
            <div style="font-size:1.3rem; font-weight:900; color:#DC2626; margin-top:0.25rem;">
              🏆 (${rawStr}) ＝ ${gcdVal}
            </div>
            <div style="color:#991B1B; font-size:0.85rem; margin-top:0.4rem;">
              ⚠️ <strong>GCD 短除法法則</strong>：必須是【所有數的公因數】才能除！只要有一數不能整除，短除法就<strong>立刻停止</strong>！最後<strong>只乘左側共同質因數</strong>。
            </div>
          </div>
        </div>

        <!-- LCM 卡片 -->
        <div style="background:#FFFFFF; border:2px solid #10B981; border-radius:12px; padding:1.2rem; box-shadow:0 2px 4px rgba(0,0,0,0.04);">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.75rem;">
            <h4 style="font-size:1.15rem; font-weight:900; color:#059669; margin:0;">
              🟢 最小公倍數 LCM [${rawStr}]
            </h4>
            <span class="g6-highlight-badge badge-green">任兩數可約・其餘照抄</span>
          </div>
          <div style="text-align:center; padding:0.75rem; background:#ECFDF5; border-radius:8px; margin-bottom:0.75rem;">
            ${lcmSteps.length > 0 ? buildStepTable(lcmSteps, curLcmNums, true) : '<div style="color:#64748B;">兩兩互質，直接全數相乘！</div>'}
          </div>
          <div style="background:#F0FDF4; border:1px solid #A7F3D0; border-radius:8px; padding:0.75rem; line-height:1.6; font-size:0.95rem;">
            <div>📌 <strong>L 型連乘</strong>：${[...lcmLeft, ...curLcmNums].join(' × ')}</div>
            <div style="font-size:1.3rem; font-weight:900; color:#059669; margin-top:0.25rem;">
              🚀 [${rawStr}] ＝ ${lcmVal}
            </div>
            <div style="color:#065F46; font-size:0.85rem; margin-top:0.4rem;">
              💡 <strong>LCM 短除法法則</strong>：只要有【任兩數】有公因數就可繼續除！不能整除的數<strong>直接抄下來移到下一層</strong>，直到所有底層數<strong>兩兩互質</strong>為止！最後<strong>左側與底層所有數全乘</strong>。
            </div>
          </div>
        </div>

      </div>
    `;
  }
}

/* =========================================================
   單元 2：分數除法 (為何使用倒數？4大情境圖解)
   1. 真分數除法 2. 同分母除法 3. 異分母除法 4. 分子不為 1 除法
   ========================================================= */
function formatFracOMML(n, d, forceFrac = false) {
  if (!forceFrac && d === 1) {
    return `<span class="math-whole">${n}</span>`;
  }
  return `<span class="math-frac" role="math" aria-label="${d}分之${n}"><span class="math-frac-num">${n}</span><span class="math-frac-bar"></span><span class="math-frac-den">${d}</span><math xmlns="http://www.w3.org/1998/Math/MathML" class="sr-only-mathml" aria-hidden="true"><mfrac><mn>${n}</mn><mn>${d}</mn></mfrac></math><m:oMath xmlns:m="http://schemas.openxmlformats.org/officeDocument/2006/math" style="display:none;" aria-hidden="true"><m:f><m:num><m:r><m:t>${n}</m:t></m:r></m:num><m:den><m:r><m:t>${d}</m:t></m:r></m:den></m:f></m:oMath></span>`;
}

function formatMixedFracOMML(whole, n, d) {
  return `<span class="math-mixed" role="math" aria-label="${whole}又${d}分之${n}"><span class="math-whole">${whole}</span><span class="math-frac"><span class="math-frac-num">${n}</span><span class="math-frac-bar"></span><span class="math-frac-den">${d}</span></span><math xmlns="http://www.w3.org/1998/Math/MathML" class="sr-only-mathml" aria-hidden="true"><mn>${whole}</mn><mfrac><mn>${n}</mn><mn>${d}</mn></mfrac></math><m:oMath xmlns:m="http://schemas.openxmlformats.org/officeDocument/2006/math" style="display:none;" aria-hidden="true"><m:r><m:t>${whole}</m:t></m:r><m:f><m:num><m:r><m:t>${n}</m:t></m:r></m:num><m:den><m:r><m:t>${d}</m:t></m:r></m:den></m:f></m:oMath></span>`;
}

function setG6U2Scenario(scen) {
  g6State.u2.scenario = scen;
  const btnIds = ['proper', 'same_den', 'diff_den', 'multi_num'];
  btnIds.forEach(id => {
    const b = document.getElementById(`g6U2Btn_${id}`);
    if (b) {
      b.className = (id === scen) ? 'btn btn-primary' : 'btn btn-outline';
    }
  });

  // 根據情境載入預設分數
  if (scen === 'proper') {
    // 2 ÷ (1/3) = 6
    if (document.getElementById('g6U2N1')) document.getElementById('g6U2N1').value = 2;
    if (document.getElementById('g6U2D1')) document.getElementById('g6U2D1').value = 1;
    if (document.getElementById('g6U2N2')) document.getElementById('g6U2N2').value = 1;
    if (document.getElementById('g6U2D2')) document.getElementById('g6U2D2').value = 3;
  } else if (scen === 'same_den') {
    // (4/5) ÷ (2/5) = 2
    if (document.getElementById('g6U2N1')) document.getElementById('g6U2N1').value = 4;
    if (document.getElementById('g6U2D1')) document.getElementById('g6U2D1').value = 5;
    if (document.getElementById('g6U2N2')) document.getElementById('g6U2N2').value = 2;
    if (document.getElementById('g6U2D2')) document.getElementById('g6U2D2').value = 5;
  } else if (scen === 'diff_den') {
    // (2/3) ÷ (1/4) = 8/3 = 2 2/3
    if (document.getElementById('g6U2N1')) document.getElementById('g6U2N1').value = 2;
    if (document.getElementById('g6U2D1')) document.getElementById('g6U2D1').value = 3;
    if (document.getElementById('g6U2N2')) document.getElementById('g6U2N2').value = 1;
    if (document.getElementById('g6U2D2')) document.getElementById('g6U2D2').value = 4;
  } else if (scen === 'multi_num') {
    // (3/4) ÷ (2/5) = 15/8 = 1 7/8
    if (document.getElementById('g6U2N1')) document.getElementById('g6U2N1').value = 3;
    if (document.getElementById('g6U2D1')) document.getElementById('g6U2D1').value = 4;
    if (document.getElementById('g6U2N2')) document.getElementById('g6U2N2').value = 2;
    if (document.getElementById('g6U2D2')) document.getElementById('g6U2D2').value = 5;
  }
  renderG6U2();
}

function generateG6U2Diagram(n1, d1, n2, d2) {
  function getGcd(a, b) {
    a = Math.abs(a);
    b = Math.abs(b);
    while (b) {
      let t = b;
      b = a % b;
      a = t;
    }
    return a || 1;
  }

  function getLcm(a, b) {
    if (a === 0 || b === 0) return 1;
    return Math.abs((a * b) / getGcd(a, b));
  }

  const L = getLcm(d1, d2);
  const N1 = n1 * (L / d1);
  const N2 = n2 * (L / d2);
  const resN = n1 * d2;
  const resD = d1 * n2;
  const g = getGcd(resN, resD);
  const simpN = resN / g;
  const simpD = resD / g;

  const palette = [
    { fill: '#DBEAFE', stroke: '#2563EB', text: '#1E40AF', name: '藍' },
    { fill: '#DCFCE7', stroke: '#16A34A', text: '#15803D', name: '綠' },
    { fill: '#FEF08A', stroke: '#CA8A04', text: '#854D0E', name: '黃' },
    { fill: '#F3E8FF', stroke: '#9333EA', text: '#6B21A8', name: '紫' },
    { fill: '#FFEDD5', stroke: '#EA580C', text: '#9A3412', name: '橙' },
    { fill: '#CFFAFE', stroke: '#0891B2', text: '#0E7490', name: '青' },
    { fill: '#FCE7F3', stroke: '#DB2777', text: '#9D174D', name: '粉' },
    { fill: '#E0E7FF', stroke: '#4F46E5', text: '#3730A3', name: '靛' }
  ];

  // 情況 1: 整數除以單位分數 (d1 === 1 && n2 === 1)
  if (d1 === 1 && n2 === 1) {
    const barsCount = Math.min(n1, 5);
    const totalParts = n1 * d2;
    const barW = 480;
    const barH = 34;
    const segW = barW / d2;
    const startX = 30;
    const startY = 32;
    const gapY = 48;
    const svgH = startY + barsCount * gapY + 54;

    let barsSvg = '';
    for (let b = 0; b < barsCount; b++) {
      const y = startY + b * gapY;
      barsSvg += `<text x="${startX}" y="${y - 8}" font-size="13" font-weight="800" fill="#334155">第 ${b + 1} 條完整單位：包含 ${d2} 個 (1/${d2})</text>`;
      barsSvg += `<rect x="${startX}" y="${y}" width="${barW}" height="${barH}" fill="#EFF6FF" stroke="#3B82F6" stroke-width="2" rx="4"/>`;
      for (let s = 1; s < d2; s++) {
        const lineX = startX + s * segW;
        barsSvg += `<line x1="${lineX}" y1="${y}" x2="${lineX}" y2="${y + barH}" stroke="#3B82F6" stroke-width="1.5" stroke-dasharray="3"/>`;
      }
      for (let s = 0; s < d2; s++) {
        const textX = startX + s * segW + segW / 2;
        if (segW >= 22) {
          barsSvg += `<text x="${textX}" y="${y + 22}" font-size="${segW < 36 ? 11 : 13}" font-weight="bold" fill="#1D4ED8" text-anchor="middle">1/${d2}</text>`;
        }
      }
    }

    if (n1 > 5) {
      barsSvg += `<text x="${startX + barW / 2}" y="${startY + barsCount * gapY + 8}" font-size="12" fill="#64748B" text-anchor="middle">（其餘 ${n1 - 5} 條長條依此類推，全數包含在內）</text>`;
    }

    const footY = svgH - 18;
    barsSvg += `
      <text x="270" y="${footY}" font-size="14" font-weight="900" fill="#DC2626" text-anchor="middle">
        總份數 ＝ ${n1} 條 × ${d2} 份/條 ＝ ${totalParts} 份！➔ 算式：${n1} ÷ (1/${d2}) ＝ ${n1} × ${d2} ＝ ${totalParts}
      </text>
    `;

    return `
      <div style="background:#FFFFFF; border:1px solid #CBD5E1; border-radius:10px; padding:1rem; margin-bottom:1rem; text-align:center;">
        <h5 style="color:#1E3A8A; font-weight:800; margin-bottom:0.4rem; font-size:1.05rem;">
          📊 動態幾何圖解：整數除以單位分數（每 1 條切成 ${d2} 份，共 ${n1} 條）
        </h5>
        <div style="color:#475569; font-size:0.95rem; margin-bottom:0.6rem; line-height:1.8;">
          每一條都包含 ${d2} 個 ${formatFracOMML(1, d2)}，所以「<strong>÷ ${formatFracOMML(1, d2)} 等於 × ${d2}</strong>」！
        </div>
        <svg viewBox="0 0 540 ${svgH}" class="g6-diagram-svg">
          ${barsSvg}
        </svg>
      </div>
    `;
  }

  // 情況 2: 同分母分數除法 (d1 === d2)
  if (d1 === d2) {
    const d = d1;
    const maxCells = Math.min(Math.max(d, n1), 24);
    const fullGroups = Math.floor(n1 / n2);
    const rem = n1 % n2;
    const barW = 480;
    const cellW = Math.min(60, barW / maxCells);
    const actualW = cellW * maxCells;
    const startX = (540 - actualW) / 2;
    const startY = 40;
    const cellH = 46;

    let cellsSvg = '';
    for (let i = 0; i < maxCells; i++) {
      const x = startX + i * cellW;
      let fill = '#F8FAFC';
      let stroke = '#CBD5E1';
      let strokeWidth = 1.5;
      let dash = 'stroke-dasharray="3"';
      let textColor = '#94A3B8';
      let label = `1/${d}`;

      if (i < n1) {
        dash = '';
        strokeWidth = 2;
        if (i < fullGroups * n2) {
          const gIdx = Math.floor(i / n2) % palette.length;
          fill = palette[gIdx].fill;
          stroke = palette[gIdx].stroke;
          textColor = palette[gIdx].text;
        } else {
          fill = '#FEE2E2';
          stroke = '#EF4444';
          textColor = '#B91C1C';
        }
      }

      cellsSvg += `<rect x="${x}" y="${startY}" width="${cellW}" height="${cellH}" fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}" ${dash}/>`;
      if (cellW >= 22) {
        cellsSvg += `<text x="${x + cellW / 2}" y="${startY + cellH / 2 + 5}" font-size="${cellW < 35 ? 10 : 12}" font-weight="bold" fill="${textColor}" text-anchor="middle">${label}</text>`;
      }
    }

    let groupLabelsSvg = '';
    for (let gIdx = 0; gIdx < fullGroups && (gIdx + 1) * n2 <= maxCells; gIdx++) {
      const gx = startX + gIdx * n2 * cellW;
      const gw = n2 * cellW;
      const pColor = palette[gIdx % palette.length].text;
      groupLabelsSvg += `
        <line x1="${gx + 2}" y1="${startY - 6}" x2="${gx + gw - 2}" y2="${startY - 6}" stroke="${pColor}" stroke-width="2"/>
        <text x="${gx + gw / 2}" y="${startY - 12}" font-size="12" font-weight="800" fill="${pColor}" text-anchor="middle">第 ${gIdx + 1} 份 (${n2}/${d})</text>
      `;
    }
    if (rem > 0 && fullGroups * n2 + rem <= maxCells) {
      const rx = startX + fullGroups * n2 * cellW;
      const rw = rem * cellW;
      groupLabelsSvg += `
        <line x1="${rx + 2}" y1="${startY - 6}" x2="${rx + rw - 2}" y2="${startY - 6}" stroke="#EF4444" stroke-width="2"/>
        <text x="${rx + rw / 2}" y="${startY - 12}" font-size="11" font-weight="800" fill="#B91C1C" text-anchor="middle">剩 ${rem} 格 (${rem}/${n2}份)</text>
      `;
    }

    const footY = startY + cellH + 34;
    const svgH = footY + 25;

    return `
      <div style="background:#FFFFFF; border:1px solid #CBD5E1; border-radius:10px; padding:1rem; margin-bottom:1rem; text-align:center;">
        <h5 style="color:#1E3A8A; font-weight:800; margin-bottom:0.4rem; font-size:1.05rem;">
          📊 動態幾何圖解：同分母分數除法（基準單位相同，直接以分子相除）
        </h5>
        <div style="color:#475569; font-size:0.95rem; margin-bottom:0.6rem; line-height:1.8;">
          分母都是 ${d}，共有 ${n1} 個 ${formatFracOMML(1, d)}，每份需要 ${n2} 個 ${formatFracOMML(1, d)}
        </div>
        <svg viewBox="0 0 540 ${svgH}" class="g6-diagram-svg">
          ${groupLabelsSvg}
          ${cellsSvg}
          <text x="270" y="${footY}" font-size="14" font-weight="900" fill="#1E3A8A" text-anchor="middle">
            分子相除：${n1} ÷ ${n2} ＝ ${simpD === 1 ? simpN : `${simpN}/${simpD}`} ＝ (${n1}/${d}) ÷ (${n2}/${d})
          </text>
        </svg>
      </div>
    `;
  }

  // 情況 3 & 4: 異分母除法或分子不為 1 除法 (通分等分網格 + 兩步拆解乘倒數)
  const fullGroups = Math.floor(N1 / N2);
  const rem = N1 % N2;
  const maxDisplay = Math.min(Math.max(L, N1), 32);
  const cellW = Math.min(42, 480 / maxDisplay);
  const actualW = cellW * maxDisplay;
  const startX = (540 - actualW) / 2;
  const startY = 44;
  const cellH = 40;

  let gridSvg = '';
  for (let i = 0; i < maxDisplay; i++) {
    const x = startX + i * cellW;
    let fill = '#F8FAFC';
    let stroke = '#CBD5E1';
    let strokeWidth = 1.2;
    let dash = 'stroke-dasharray="3"';
    let textColor = '#94A3B8';

    if (i < N1) {
      dash = '';
      strokeWidth = 2;
      if (i < fullGroups * N2) {
        const gIdx = Math.floor(i / N2) % palette.length;
        fill = palette[gIdx].fill;
        stroke = palette[gIdx].stroke;
        textColor = palette[gIdx].text;
      } else {
        fill = '#FEE2E2';
        stroke = '#EF4444';
        textColor = '#B91C1C';
      }
    }

    gridSvg += `<rect x="${x}" y="${startY}" width="${cellW}" height="${cellH}" fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}" ${dash}/>`;
    if (cellW >= 18 && maxDisplay <= 24) {
      gridSvg += `<text x="${x + cellW / 2}" y="${startY + cellH / 2 + 4}" font-size="${cellW < 28 ? 9 : 11}" font-weight="bold" fill="${textColor}" text-anchor="middle">1/${L}</text>`;
    }
  }

  let groupLabelsSvg = '';
  for (let gIdx = 0; gIdx < fullGroups && (gIdx + 1) * N2 <= maxDisplay; gIdx++) {
    const gx = startX + gIdx * N2 * cellW;
    const gw = N2 * cellW;
    const pColor = palette[gIdx % palette.length].text;
    groupLabelsSvg += `
      <line x1="${gx + 2}" y1="${startY - 6}" x2="${gx + gw - 2}" y2="${startY - 6}" stroke="${pColor}" stroke-width="2"/>
      <text x="${gx + gw / 2}" y="${startY - 12}" font-size="11" font-weight="800" fill="${pColor}" text-anchor="middle">第 ${gIdx + 1} 份 (${N2}格)</text>
    `;
  }
  if (rem > 0 && fullGroups * N2 + rem <= maxDisplay) {
    const rx = startX + fullGroups * N2 * cellW;
    const rw = rem * cellW;
    groupLabelsSvg += `
      <line x1="${rx + 2}" y1="${startY - 6}" x2="${rx + rw - 2}" y2="${startY - 6}" stroke="#EF4444" stroke-width="2"/>
      <text x="${rx + rw / 2}" y="${startY - 12}" font-size="10" font-weight="800" fill="#B91C1C" text-anchor="middle">剩 ${rem} 格 (${rem}/${N2}份)</text>
    `;
  }

  const footY = startY + cellH + 34;
  const svgH = footY + 25;

  return `
    <div style="background:#FFFFFF; border:1px solid #CBD5E1; border-radius:10px; padding:1rem; margin-bottom:1rem; text-align:center;">
      <h5 style="color:#1E3A8A; font-weight:800; margin-bottom:0.4rem; font-size:1.05rem;">
        📊 動態幾何圖解：通分等分網格（公分母 ${L}，每格為 1/${L}）
      </h5>
      <div style="color:#475569; font-size:0.95rem; margin-bottom:0.6rem; line-height:1.9;">
        被除數 ${formatFracOMML(n1, d1, true)} ＝ <strong>${formatFracOMML(N1, L, true)}</strong>（共有 <strong>${N1}</strong> 格），除數 ${formatFracOMML(n2, d2, true)} ＝ <strong>${formatFracOMML(N2, L, true)}</strong>（每份需要 <strong>${N2}</strong> 格）
      </div>
      <svg viewBox="0 0 540 ${svgH}" class="g6-diagram-svg">
        ${groupLabelsSvg}
        ${gridSvg}
        <text x="270" y="${footY}" font-size="14" font-weight="900" fill="#1E3A8A" text-anchor="middle">
          ${N1} 格 ÷ 每份 ${N2} 格 ＝ ${N1}/${N2} ＝ ${simpD === 1 ? simpN : `${simpN}/${simpD}`} 份！
        </text>
      </svg>
      
      <!-- 兩步拆解顛倒相乘教學卡 -->
      <div style="background:#F8FAFC; border:1px dashed #94A3B8; border-radius:8px; padding:0.85rem 1.1rem; text-align:left; line-height:1.85; font-size:0.95rem; margin-top:0.75rem;">
        <div style="font-weight:800; color:#1E3A8A; margin-bottom:0.35rem; font-size:1rem;">
          💡 為什麼除以 ${formatFracOMML(n2, d2, true)} 等於乘以倒數 ${formatFracOMML(d2, n2, true)}？（嚴密幾何與代數推導）
        </div>
        <div>1️⃣ <strong>第 1 步（除以單位分數 1/${d2}）</strong>：求包含多少個 1/${d2} ➔ 放大 ${d2} 倍：(${n1}/${d1}) × ${d2} ＝ <strong>${n1 * d2}/${d1}</strong> 個 1/${d2} 單位。</div>
        <div>2️⃣ <strong>第 2 步（除以除數分子 ${n2}）</strong>：每份需要 ${n2} 個 1/${d2}，再平分除以 ${n2} ➔ (${n1 * d2}/${d1}) ÷ ${n2} ＝ <strong>(${n1 * d2}) / (${d1 * n2}) ＝ ${resN}/${resD}</strong>！</div>
        <div style="color:#DC2626; font-weight:800; margin-top:0.35rem;">
          🎯 綜合結論：先 × ${d2}，再 ÷ ${n2}，等價於直接「<strong>× ${formatFracOMML(d2, n2, true)}</strong>」！這就是<strong>顛倒相乘（乘以倒數）</strong>的數學本質！
        </div>
      </div>
    </div>
  `;
}

function renderG6U2() {
  const n1 = Math.max(1, parseInt(document.getElementById('g6U2N1')?.value || 2));
  const d1 = Math.max(1, parseInt(document.getElementById('g6U2D1')?.value || 1));
  const n2 = Math.max(1, parseInt(document.getElementById('g6U2N2')?.value || 1));
  const d2 = Math.max(1, parseInt(document.getElementById('g6U2D2')?.value || 3));

  // 顛倒相乘: (n1/d1) ÷ (n2/d2) = (n1/d1) × (d2/n2)
  const resN = n1 * d2;
  const resD = d1 * n2;

  function getGcd(x, y) { return y === 0 ? x : getGcd(y, x % y); }
  const g = getGcd(resN, resD);
  const simpN = resN / g;
  const simpD = resD / g;

  let mixedHtml = '';
  if (simpD === 1) {
    mixedHtml = `<span class="math-whole" style="font-size:1.6rem; color:#2563EB;">${simpN}</span>`;
  } else if (simpN > simpD) {
    const whole = Math.floor(simpN / simpD);
    const rem = simpN % simpD;
    if (rem === 0) {
      mixedHtml = `<span class="math-whole" style="font-size:1.6rem; color:#2563EB;">${whole}</span>`;
    } else {
      mixedHtml = `<span style="font-size:1.4rem; color:#2563EB;">${formatMixedFracOMML(whole, rem, simpD)}</span>`;
    }
  } else {
    mixedHtml = `<span style="font-size:1.4rem; color:#2563EB;">${formatFracOMML(simpN, simpD)}</span>`;
  }

  // 動態依據當前數值產出幾何圖像模型
  const diagramHtml = generateG6U2Diagram(n1, d1, n2, d2);

  const outEl = document.getElementById('g6U2ResultWrap');
  if (outEl) {
    outEl.innerHTML = `
      ${diagramHtml}
      <div style="font-size:1.35rem; font-weight:800; line-height:2.6; color:#1E293B; background:#FFFFFF; border:2px solid #3B82F6; border-radius:12px; padding:1.1rem; margin-top:0.75rem;">
        ${formatFracOMML(n1, d1, true)}
        &nbsp;÷&nbsp;
        ${formatFracOMML(n2, d2, true)}
        &nbsp;＝&nbsp;
        ${formatFracOMML(n1, d1, true)}
        &nbsp;×&nbsp;
        <span style="color:#DC2626;">${formatFracOMML(d2, n2, true)}</span>
        &nbsp;＝&nbsp;
        ${formatFracOMML(resN, resD, true)}
        &nbsp;＝&nbsp;
        ${mixedHtml}
      </div>
      <div style="font-size:0.95rem; color:#475569; margin-top:0.6rem;">
        💡 <strong>除法倒數黃金法則</strong>：把除以分數轉化為乘以倒數（除號變乘號，除數分子分母對調）。
      </div>
    `;
    if (window.MathMLRenderer) window.MathMLRenderer.renderElement(outEl);
  }
}

/* =========================================================
   單元 3：數量關係 (植樹問題 3大情境圖形 & 牙籤規律)
   ========================================================= */
function setG6U3Mode(mode) {
  g6State.u3.mode = mode;
  ['both', 'one', 'none', 'circle'].forEach(m => {
    const b = document.getElementById(`g6U3Btn_${m}`);
    if (b) b.className = (m === mode) ? 'btn btn-primary' : 'btn btn-outline';
  });
  renderG6U3();
}

function renderG6U3() {
  const mode = g6State.u3.mode || 'both';
  const len = parseInt(document.getElementById('g6U3Len')?.value || 80);
  const interval = parseInt(document.getElementById('g6U3Interval')?.value || 20);
  const intervals = Math.max(1, Math.floor(len / interval));

  let trees = 0, formula = '', desc = '';
  if (mode === 'both') {
    trees = intervals + 1;
    formula = `棵數 ＝ 間隔數 ＋ 1 ＝ ${intervals} ＋ 1 ＝ ${trees} 棵`;
    desc = '兩端都種樹：頭尾都有樹，所以樹的數量比間隔多 1！';
  } else if (mode === 'one') {
    trees = intervals;
    formula = `棵數 ＝ 間隔數 ＝ ${trees} 棵`;
    desc = '只種一端（或一端有大門）：一棵樹對應一個間隔，樹與間隔剛好一樣多！';
  } else if (mode === 'none') {
    trees = Math.max(0, intervals - 1);
    formula = `棵數 ＝ 間隔數 － 1 ＝ ${intervals} － 1 ＝ ${trees} 棵`;
    desc = '兩端都不種（頭尾已有路燈或牆）：頭尾都不算，所以樹的數量比間隔少 1！';
  } else {
    trees = intervals;
    formula = `環形封閉池塘：棵數 ＝ 間隔數 ＝ ${trees} 棵`;
    desc = '封閉圓形道路：首尾相接形成封閉迴路，每棵樹剛好對應一個間隔！';
  }

  // 繪製 SVG 植樹直觀圖
  let svgTreeHtml = '';
  if (mode === 'circle') {
    // 圓形池塘
    svgTreeHtml = `
      <svg viewBox="0 0 400 240" class="g6-diagram-svg">
        <circle cx="200" cy="120" r="80" fill="#E0F2FE" stroke="#0284C7" stroke-width="4"/>
        <text x="200" y="125" font-size="14" font-weight="bold" fill="#0369A1" text-anchor="middle">封閉池塘 (${len}m)</text>
    `;
    for (let i = 0; i < trees; i++) {
      const angle = (i * 2 * Math.PI) / trees - Math.PI / 2;
      const tx = 200 + 80 * Math.cos(angle);
      const ty = 120 + 80 * Math.sin(angle);
      svgTreeHtml += `<text x="${tx}" y="${ty + 6}" font-size="20" text-anchor="middle">🌲</text>`;
    }
    svgTreeHtml += `</svg>`;
  } else {
    // 直線道路
    const svgW = 540;
    const startX = 40, endX = 500;
    const stepX = (endX - startX) / intervals;

    svgTreeHtml = `
      <svg viewBox="0 0 ${svgW} 160" class="g6-diagram-svg">
        <!-- 灰色柏油路面 -->
        <rect x="${startX - 10}" y="70" width="${endX - startX + 20}" height="28" fill="#64748B" rx="4"/>
        <line x1="${startX}" y1="84" x2="${endX}" y2="84" stroke="#F8FAFC" stroke-width="2" stroke-dasharray="8 6"/>

        <!-- 標示全長箭頭 -->
        <line x1="${startX}" y1="35" x2="${endX}" y2="35" stroke="#1E40AF" stroke-width="2"/>
        <polyline points="${startX + 6},30 ${startX},35 ${startX + 6},40" fill="none" stroke="#1E40AF" stroke-width="2"/>
        <polyline points="${endX - 6},30 ${endX},35 ${endX - 6},40" fill="none" stroke="#1E40AF" stroke-width="2"/>
        <text x="${(startX + endX) / 2}" y="28" font-size="14" font-weight="900" fill="#1E40AF" text-anchor="middle">全長 ${len} 公尺</text>
    `;

    // 繪製間隔標示
    for (let i = 0; i < intervals; i++) {
      const segX = startX + i * stepX + stepX / 2;
      svgTreeHtml += `
        <text x="${segX}" y="125" font-size="12" font-weight="bold" fill="#475569" text-anchor="middle">第${i+1}間隔</text>
        <line x1="${startX + i * stepX + 4}" y1="135" x2="${startX + (i + 1) * stepX - 4}" y2="135" stroke="#94A3B8" stroke-width="1.5"/>
      `;
    }

    // 繪製端點與樹木
    for (let i = 0; i <= intervals; i++) {
      const curX = startX + i * stepX;
      let symbol = '🌲';
      let symLabel = '樹';
      if (i === 0) {
        if (mode === 'none') { symbol = '🏮'; symLabel = '路燈'; }
      } else if (i === intervals) {
        if (mode === 'one') { symbol = '🚪'; symLabel = '大門'; }
        else if (mode === 'none') { symbol = '🏮'; symLabel = '路燈'; }
      }

      svgTreeHtml += `
        <text x="${curX}" y="65" font-size="22" text-anchor="middle">${symbol}</text>
        <text x="${curX}" y="108" font-size="11" font-weight="800" fill="#334155" text-anchor="middle">${symLabel}</text>
      `;
    }
    svgTreeHtml += `</svg>`;
  }

  const resEl = document.getElementById('g6U3TreeResult');
  if (resEl) {
    resEl.innerHTML = `
      ${svgTreeHtml}
      <div style="font-size:1.15rem; font-weight:800; color:#047857; margin-top:0.5rem;">
        🛣️ 全長 ${len}m，每隔 ${interval}m ➔ 間隔數 ＝ ${len} ÷ ${interval} ＝ <strong>${intervals}</strong> 個間隔
      </div>
      <div style="font-size:1.35rem; font-weight:900; color:#DC2626; margin:0.4rem 0;">
        🌲 計算結果：<strong>${formula}</strong>
      </div>
      <div style="font-size:0.95rem; color:#475569; background:#EFF6FF; border-left:4px solid #3B82F6; padding:0.6rem 0.8rem; border-radius:4px;">
        💡 <strong>觀念解析</strong>：${desc}
      </div>
    `;
  }

  // 牙籤正方形
  const sqCount = parseInt(document.getElementById('g6U3SqSlider')?.value || 5);
  const matchCount = 1 + 3 * sqCount;

  // 繪製連續正方形牙籤 SVG
  let matchSvg = `
    <svg viewBox="0 0 540 85" class="g6-diagram-svg" style="max-width:500px; height:85px;">
  `;
  const sqSize = 32;
  const startSqX = Math.max(10, (540 - sqCount * sqSize) / 2);
  for (let i = 0; i < sqCount; i++) {
    const sx = startSqX + i * sqSize;
    // 頂邊
    matchSvg += `<line x1="${sx}" y1="20" x2="${sx+sqSize}" y2="20" stroke="#D97706" stroke-width="3" stroke-linecap="round"/>`;
    // 底邊
    matchSvg += `<line x1="${sx}" y1="60" x2="${sx+sqSize}" y2="60" stroke="#D97706" stroke-width="3" stroke-linecap="round"/>`;
    // 右邊
    matchSvg += `<line x1="${sx+sqSize}" y1="20" x2="${sx+sqSize}" y2="60" stroke="#D97706" stroke-width="3" stroke-linecap="round"/>`;
    // 若為第 1 個，畫左邊
    if (i === 0) {
      matchSvg += `<line x1="${sx}" y1="20" x2="${sx}" y2="60" stroke="#DC2626" stroke-width="3.5" stroke-linecap="round"/>`;
    }
  }
  matchSvg += `</svg>`;

  const sqEl = document.getElementById('g6U3MatchResult');
  if (sqEl) {
    sqEl.innerHTML = `
      ${matchSvg}
      <div style="font-size:1.15rem; font-weight:800; color:#1E3A8A;">
        排 <strong>${sqCount}</strong> 個正方形需要：1 (最左邊紅色基準) ＋ 3 × ${sqCount} ＝ <strong style="color:#DC2626; font-size:1.4rem;">${matchCount}</strong> 根牙籤！
      </div>
      <div style="font-size:0.88rem; color:#64748B; margin-top:0.3rem;">
        規律說明：第 1 個需要 4 根，之後每多接 1 個正方形只需多加 3 根 ➔ 公式：4 ＋ 3(n － 1) ＝ <strong>1 ＋ 3n</strong>。
      </div>
    `;
  }
}

/* =========================================================
   單元 4：小數除法 (4大狀況直式計算與移位規範)
   1. 整數除以小數 (12 ÷ 0.4)
   2. 小數除以整數 (4.8 ÷ 3)
   3. 小數除以小數 (7.5 ÷ 1.5)
   4. 大小數除以 0 點幾小數 (15.6 ÷ 0.03)
   ========================================================= */
function setG6U4Scenario(scenNum) {
  g6State.u4.scenario = scenNum;
  for (let i = 1; i <= 4; i++) {
    const b = document.getElementById(`g6U4Btn_${i}`);
    if (b) b.className = (i === scenNum) ? 'btn btn-primary' : 'btn btn-outline';
  }
  if (scenNum === 1) {
    // 整數除以小數
    document.getElementById('g6U4Dividend').value = 12;
    document.getElementById('g6U4Divisor').value = 0.4;
  } else if (scenNum === 2) {
    // 小數除以整數
    document.getElementById('g6U4Dividend').value = 4.8;
    document.getElementById('g6U4Divisor').value = 3;
  } else if (scenNum === 3) {
    // 小數除以小數
    document.getElementById('g6U4Dividend').value = 7.5;
    document.getElementById('g6U4Divisor').value = 1.5;
  } else if (scenNum === 4) {
    // 大小數除以 0 點幾小數
    document.getElementById('g6U4Dividend').value = 15.6;
    document.getElementById('g6U4Divisor').value = 0.03;
  }
  renderG6U4();
}

function renderG6U4() {
  const d1 = parseFloat(document.getElementById('g6U4Dividend')?.value || 12);
  const d2 = parseFloat(document.getElementById('g6U4Divisor')?.value || 0.4);

  // 移位分析
  const d2Str = d2.toString();
  const d2DecCount = d2Str.includes('.') ? d2Str.split('.')[1].length : 0;
  const shiftMultiplier = Math.pow(10, d2DecCount);

  const intDivisor = Math.round(d2 * shiftMultiplier);
  const newDividend = Math.round(d1 * shiftMultiplier * 1000) / 1000;

  // 計算商與餘數
  const quotient = Math.floor(newDividend / intDivisor);
  const remainder = Math.round((d1 - quotient * d2) * 10000) / 10000;
  const exactRes = Math.round((d1 / d2) * 10000) / 10000;

  const outEl = document.getElementById('g6U4ResultWrap');
  if (outEl) {
    outEl.innerHTML = `
      <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(280px, 1fr)); gap:1.25rem; align-items:start; margin-top:1rem;">
        
        <!-- 直式視覺盒 -->
        <div style="background:#FFFFFF; border:2px solid #3B82F6; border-radius:12px; padding:1.25rem; text-align:center;">
          <h4 style="color:#1E40AF; font-weight:800; margin-bottom:0.75rem;">📋 直式計算對齊圖解</h4>
          <div style="font-family:'Consolas', monospace; font-size:1.35rem; line-height:1.6; display:inline-block; text-align:right; background:#F8FAFC; border:1px solid #CBD5E1; border-radius:8px; padding:1rem 1.5rem;">
            <!-- 商 -->
            <div style="color:#DC2626; font-weight:900; border-bottom:2px solid #334155; padding-bottom:3px;">
              ${quotient}
            </div>
            <!-- 除號與被除數 -->
            <div style="display:flex; justify-content:flex-end; align-items:center;">
              <span style="color:#64748B; font-size:0.95rem; margin-right:4px;">${d2DecCount > 0 ? `<strike>${d2}</strike> ➔` : ''}</span>
              <span style="font-weight:900; color:#0F172A; margin-right:8px;">${intDivisor}</span>
              <span style="border-left:2px solid #334155; padding-left:10px; font-weight:900; color:#1E3A8A;">
                ${d2DecCount > 0 ? `<strike>${d1}</strike> ➔ ${newDividend}` : d1}
              </span>
            </div>
            <!-- 運算過程減數 -->
            <div style="border-bottom:2px solid #334155; color:#475569;">
              － ${quotient * intDivisor}
            </div>
            <!-- 餘數 -->
            <div style="color:#059669; font-weight:900; margin-top:2px;">
              餘數：${remainder}
            </div>
          </div>
          <div style="font-size:0.85rem; color:#64748B; margin-top:0.6rem;">
            ⚠️ 綠色餘數小數點必須垂直對齊<strong>【原來的被除數】</strong>小數點！
          </div>
        </div>

        <!-- 運算規則拆解步驟 -->
        <div style="background:#F0FDF4; border:1px solid #86EFAC; border-radius:12px; padding:1.2rem; text-align:left; line-height:1.8;">
          <div style="font-size:1.2rem; font-weight:900; color:#15803D; margin-bottom:0.5rem;">
            ${d1} ÷ ${d2} ＝ <strong style="color:#DC2626;">${quotient}</strong> ... 餘 <strong style="color:#059669;">${remainder}</strong>
            ${remainder === 0 ? `（整除，商 ＝ ${exactRes}）` : ''}
          </div>
          <div style="font-size:0.95rem; color:#166534;">
            <div>1. 🧲 <strong>除數變整數</strong>：除數 ${d2} 向右移 <strong>${d2DecCount}</strong> 位 ➔ 變成整數 <strong>${intDivisor}</strong>。</div>
            <div>2. 🧲 <strong>被除數同步移位</strong>：被除數 ${d1} 同步向右移 <strong>${d2DecCount}</strong> 位（位數不足補 0）➔ 變成 <strong>${newDividend}</strong>。</div>
            <div>3. 🎯 <strong>商的小數點</strong>：商的小數點必須對齊<strong>【移動後的新小數點】</strong>！</div>
            <div>4. ⚠️ <strong>餘數的小數點</strong>：餘數的小數點必須垂直對齊<strong>【原被除數的小數點】</strong>！</div>
            <hr style="margin:0.5rem 0; border:none; border-top:1px dashed #86EFAC;"/>
            <div style="color:#047857; font-weight:800;">
              ✔️ 驗算公式：除數 × 商 ＋ 餘數 ＝ ${d2} × ${quotient} ＋ ${remainder} ＝ ${Math.round((d2 * quotient + remainder) * 1000) / 1000} ＝ 被除數 ✔️
            </div>
          </div>
        </div>

      </div>
    `;
  }
}

/* =========================================================
   單元 5：比與比值 (前項・後項・基準量・比較量・生活應用)
   ========================================================= */
function setG6U5Scenario(scen) {
  g6State.u5.scenario = scen;
  ['milktea', 'paint', 'cake'].forEach(s => {
    const b = document.getElementById(`g6U5Btn_${s}`);
    if (b) b.className = (s === scen) ? 'btn btn-primary' : 'btn btn-outline';
  });

  if (scen === 'milktea') {
    document.getElementById('g6U5NumA').value = 3;
    document.getElementById('g6U5NumB').value = 2;
    document.getElementById('g6U5Total').value = 500;
  } else if (scen === 'paint') {
    document.getElementById('g6U5NumA').value = 2;
    document.getElementById('g6U5NumB').value = 1;
    document.getElementById('g6U5Total').value = 300;
  } else if (scen === 'cake') {
    document.getElementById('g6U5NumA').value = 5;
    document.getElementById('g6U5NumB').value = 3;
    document.getElementById('g6U5Total').value = 400;
  }
  renderG6U5();
}

function renderG6U5() {
  const a = parseInt(document.getElementById('g6U5NumA')?.value || 3);
  const b = parseInt(document.getElementById('g6U5NumB')?.value || 2);
  const total = parseInt(document.getElementById('g6U5Total')?.value || 500);

  function getGcd(x, y) { return y === 0 ? x : getGcd(y, x % y); }
  const g = getGcd(a, b);
  const sa = a / g;
  const sb = b / g;
  const ratioVal = Math.round((a / b) * 1000) / 1000;

  // 總份數分配
  const totalParts = a + b;
  const partVal = total / totalParts;
  const amountA = Math.round(partVal * a * 10) / 10;
  const amountB = Math.round(partVal * b * 10) / 10;

  const scen = g6State.u5.scenario || 'milktea';
  let nameA = '紅茶', nameB = '鮮奶', unitStr = 'mL';
  if (scen === 'paint') { nameA = '黃色顏料'; nameB = '藍色顏料'; unitStr = 'mL'; }
  else if (scen === 'cake') { nameA = '低筋麵粉'; nameB = '細砂糖'; unitStr = 'g'; }

  // 繪製比例長條圖 SVG
  const barW = 460;
  const partAW = (a / totalParts) * barW;
  const partBW = (b / totalParts) * barW;

  const ratioSvg = `
    <svg viewBox="0 0 520 120" class="g6-diagram-svg">
      <rect x="30" y="25" width="${partAW}" height="45" fill="#F87171" stroke="#DC2626" stroke-width="2" rx="4"/>
      <rect x="${30 + partAW}" y="25" width="${partBW}" height="45" fill="#60A5FA" stroke="#2563EB" stroke-width="2" rx="4"/>
      
      <text x="${30 + partAW / 2}" y="53" font-size="14" font-weight="900" fill="#FFFFFF" text-anchor="middle">
        前項 ${nameA}：${a} 份 (${amountA} ${unitStr})
      </text>
      <text x="${30 + partAW + partBW / 2}" y="53" font-size="14" font-weight="900" fill="#FFFFFF" text-anchor="middle">
        後項 ${nameB}：${b} 份 (${amountB} ${unitStr})
      </text>

      <text x="260" y="100" font-size="14" font-weight="900" fill="#1E3A8A" text-anchor="middle">
        總量 ${total} ${unitStr} ＝ 共 ${totalParts} 等份 ➔ 1份 ＝ ${Math.round(partVal*10)/10} ${unitStr}
      </text>
    </svg>
  `;

  const outEl = document.getElementById('g6U5RatioResult');
  if (outEl) {
    outEl.innerHTML = `
      ${ratioSvg}
      <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(260px, 1fr)); gap:1rem; margin-top:1rem; text-align:left;">
        <div style="background:#FFFFFF; border:1px solid #CBD5E1; border-radius:8px; padding:1rem;">
          <h5 style="color:#1E40AF; font-weight:800; margin-bottom:0.4rem;">🔑 基準量與比較量觀念</h5>
          <ul style="padding-left:1.2rem; font-size:0.95rem; line-height:1.7; color:#334155; margin:0;">
            <li><strong>前項 (A)</strong>：${nameA} ＝ <strong>比較量</strong>（被拿來比較的量）</li>
            <li><strong>後項 (B)</strong>：${nameB} ＝ <strong>基準量</strong>（當作標準的 1 倍基準，相當於分母，<strong>不可為 0</strong>！）</li>
            <li><strong>比值</strong>：比較量 ÷ 基準量 ＝ ${a} ÷ ${b} ＝ <strong style="color:#DC2626;">${sa}/${sb}</strong> (約 ${ratioVal})</li>
            <li><strong>最簡整數比</strong>：同除以 GCD(${g}) ➔ <strong style="color:#2563EB;">${sa} : ${sb}</strong></li>
          </ul>
        </div>
        <div style="background:#F0FDF4; border:1px solid #86EFAC; border-radius:8px; padding:1rem;">
          <h5 style="color:#15803D; font-weight:800; margin-bottom:0.4rem;">🥤 生活比例應用配方計算</h5>
          <div style="font-size:0.95rem; line-height:1.8; color:#166534;">
            <div>📌 製作總量 <strong>${total} ${unitStr}</strong> 配方：</div>
            <div>• ${nameA}（占 ${a}/${totalParts}）：${total} × (${a}/${totalParts}) ＝ <strong style="color:#DC2626; font-size:1.15rem;">${amountA}</strong> ${unitStr}</div>
            <div>• ${nameB}（占 ${b}/${totalParts}）：${total} × (${b}/${totalParts}) ＝ <strong style="color:#2563EB; font-size:1.15rem;">${amountB}</strong> ${unitStr}</div>
            <div style="font-weight:800; color:#047857; margin-top:0.3rem;">兩者相加：${amountA} ＋ ${amountB} ＝ ${total} ${unitStr} ✔️</div>
          </div>
        </div>
      </div>
    `;
    if (window.MathMLRenderer) window.MathMLRenderer.renderElement(outEl);
  }
}

/* =========================================================
   單元 6：圓周長與扇形周長 (圓心・半徑・直徑・弧長・扇形周長)
   ========================================================= */
function renderG6U6() {
  const r = parseFloat(document.getElementById('g6U6Radius')?.value || 5);
  const deg = parseInt(document.getElementById('g6U6Angle')?.value || 90);
  const d = r * 2;
  const circleC = Math.round(d * 3.14 * 100) / 100;
  const fractionCircle = deg / 360;
  const arcLen = Math.round(circleC * fractionCircle * 100) / 100;
  const sectorPerimeter = Math.round((arcLen + 2 * r) * 100) / 100;

  // 繪製扇形各部位解剖圖 SVG
  const rad = (deg * Math.PI) / 180;
  const cx = 130, cy = 130, R = 90;
  const xEnd = cx + R * Math.cos(rad);
  const yEnd = cy - R * Math.sin(rad);
  const largeArcFlag = deg > 180 ? 1 : 0;
  const pathD = `M ${cx} ${cy} L ${cx + R} ${cy} A ${R} ${R} 0 ${largeArcFlag} 0 ${xEnd} ${yEnd} Z`;

  const sectorSvg = `
    <svg viewBox="0 0 540 220" class="g6-diagram-svg">
      <!-- 扇形本體 -->
      <path d="${pathD}" fill="#FEF3C7" stroke="#F59E0B" stroke-width="2"/>
      
      <!-- 弧長 (紅色粗線) -->
      <path d="M ${cx + R} ${cy} A ${R} ${R} 0 ${largeArcFlag} 0 ${xEnd} ${yEnd}" fill="none" stroke="#DC2626" stroke-width="4"/>
      
      <!-- 兩條半徑 (藍色粗線) -->
      <line x1="${cx}" y1="${cy}" x2="${cx + R}" y2="${cy}" stroke="#2563EB" stroke-width="3"/>
      <line x1="${cx}" y1="${cy}" x2="${xEnd}" y2="${yEnd}" stroke="#2563EB" stroke-width="3"/>

      <!-- 圓心點 -->
      <circle cx="${cx}" cy="${cy}" r="5" fill="#1E3A8A"/>
      <text x="${cx - 14}" y="${cy + 6}" font-size="14" font-weight="900" fill="#1E3A8A">圓心 O</text>

      <!-- 標示文字 -->
      <text x="${cx + R / 2}" y="${cy + 18}" font-size="13" font-weight="bold" fill="#2563EB">半徑 (r=${r})</text>
      <text x="${cx + R * 0.7}" y="${cy - 30}" font-size="14" font-weight="900" fill="#DC2626">外側弧長 (${arcLen} cm)</text>
      <text x="${cx + 25}" y="${cy - 12}" font-size="13" font-weight="bold" fill="#D97706">${deg}°</text>

      <!-- 右側解讀區 -->
      <g transform="translate(260, 25)">
        <text x="0" y="20" font-size="15" font-weight="900" fill="#1E3A8A">🎯 扇形周長三大組成：</text>
        <text x="0" y="48" font-size="13" fill="#DC2626" font-weight="bold">1. 紅色弧長 ＝ 直徑 × 3.14 × (${deg}/360) ＝ ${arcLen} cm</text>
        <text x="0" y="74" font-size="13" fill="#2563EB" font-weight="bold">2. 第一條半徑 ＝ ${r} cm</text>
        <text x="0" y="100" font-size="13" fill="#2563EB" font-weight="bold">3. 第二條半徑 ＝ ${r} cm</text>
        <line x1="0" y1="115" x2="260" y2="115" stroke="#CBD5E1" stroke-width="1.5"/>
        <text x="0" y="140" font-size="16" font-weight="900" fill="#047857">✨ 扇形周長 ＝ 弧長 ＋ 2 × 半徑</text>
        <text x="0" y="165" font-size="18" font-weight="900" fill="#DC2626">＝ ${arcLen} ＋ ${r} ＋ ${r} ＝ ${sectorPerimeter} cm</text>
      </g>
    </svg>
  `;

  const outEl = document.getElementById('g6U6ResultWrap');
  if (outEl) {
    outEl.innerHTML = `
      ${sectorSvg}
      <div style="background:#FFFBEB; border:2px solid #FCD34D; border-radius:8px; padding:0.85rem; margin-top:0.75rem; text-align:left; color:#78350F; line-height:1.7;">
        ⚠️ <strong>考試大魔王提醒</strong>：很多同學算出弧長 ${arcLen} cm 就以為是答案，<strong>絕對不能忘記加上封閉扇形的兩條半徑</strong>！<br/>
        公式口訣：<strong>扇形周長 ＝ 弧長 ＋ 半徑 × 2</strong>！
      </div>
    `;
  }
}

/* =========================================================
   單元 7：圓面積與扇形面積 (割拼極限長方形・同心圓環・例題)
   ========================================================= */
function renderG6U7() {
  const r = parseFloat(document.getElementById('g6U7Radius')?.value || 6);
  const deg = parseInt(document.getElementById('g6U7Angle')?.value || 90);
  const circleArea = Math.round(r * r * 3.14 * 100) / 100;
  const fractionCircle = deg / 360;
  const sectorArea = Math.round(circleArea * fractionCircle * 100) / 100;

  // 同心圓
  const outerR = parseFloat(document.getElementById('g6U7OuterR')?.value || 8);
  const innerR = parseFloat(document.getElementById('g6U7InnerR')?.value || 4);
  const ringArea = Math.round((outerR * outerR - innerR * innerR) * 3.14 * 100) / 100;

  // 繪製圓割拼成長方形推導 SVG
  const derSvg = `
    <svg viewBox="0 0 540 160" class="g6-diagram-svg">
      <!-- 圓割拼長方形 -->
      <g transform="translate(40, 20)">
        <circle cx="50" cy="50" r="45" fill="#BFDBFE" stroke="#2563EB" stroke-width="2"/>
        <line x1="50" y1="50" x2="95" y2="50" stroke="#DC2626" stroke-width="2"/>
        <text x="70" y="44" font-size="12" font-weight="bold" fill="#DC2626">r</text>
        <text x="50" y="115" font-size="13" font-weight="bold" fill="#1E3A8A" text-anchor="middle">切成無限細扇形</text>
      </g>
      <text x="175" y="75" font-size="28" fill="#3B82F6" text-anchor="middle">➔</text>
      <!-- 近似長方形 -->
      <g transform="translate(210, 30)">
        <rect x="0" y="0" width="280" height="45" fill="#BBF7D0" stroke="#059669" stroke-width="2" rx="4"/>
        <!-- 波浪交錯示意 -->
        <line x1="0" y1="0" x2="280" y2="0" stroke="#047857" stroke-width="3" stroke-dasharray="8 4"/>
        <text x="140" y="-8" font-size="13" font-weight="900" fill="#047857" text-anchor="middle">長 ＝ 圓周長的一半 (r × 3.14)</text>
        <text x="-12" y="28" font-size="13" font-weight="900" fill="#DC2626" text-anchor="middle">寬 r</text>
        <text x="140" y="28" font-size="14" font-weight="900" fill="#065F46" text-anchor="middle">面積 ＝ 長 × 寬 ＝ (r × 3.14) × r</text>
      </g>
      <text x="270" y="145" font-size="15" font-weight="900" fill="#DC2626" text-anchor="middle">
        🏆 圓面積公式 ＝ 半徑 × 半徑 × 3.14 (r² × π)！
      </text>
    </svg>
  `;

  const outEl = document.getElementById('g6U7ResultWrap');
  if (outEl) {
    outEl.innerHTML = `
      ${derSvg}
      <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(280px, 1fr)); gap:1rem; margin-top:1rem; text-align:left;">
        
        <!-- 扇形計算卡 -->
        <div style="background:#FFFFFF; border:1px solid #CBD5E1; border-radius:10px; padding:1rem;">
          <h5 style="color:#1E3A8A; font-weight:800; margin-bottom:0.4rem;">🍕 扇形面積計算 (圓心角 ${deg}°)</h5>
          <div style="line-height:1.7; font-size:0.95rem;">
            <div>1. 整圓面積：${r} × ${r} × 3.14 ＝ <strong>${circleArea}</strong> cm²</div>
            <div>2. 圓心角比例：${deg}° / 360° ＝ <strong>${fractionCircle === 0.25 ? '1/4' : fractionCircle === 0.5 ? '1/2' : fractionCircle} 圓</strong></div>
            <div style="font-size:1.25rem; font-weight:900; color:#059669; margin-top:0.3rem;">
              扇形面積 ＝ ${circleArea} × (${deg}/360) ＝ <strong>${sectorArea}</strong> cm²
            </div>
          </div>
        </div>

        <!-- 同心圓環計算卡 -->
        <div style="background:#F0FDF4; border:1px solid #86EFAC; border-radius:10px; padding:1rem;">
          <h5 style="color:#15803D; font-weight:800; margin-bottom:0.4rem;">🍩 同心圓 (圓環) 面積</h5>
          <div style="line-height:1.7; font-size:0.95rem;">
            <div>大圓半徑 R ＝ ${outerR} cm，小圓半徑 r ＝ ${innerR} cm</div>
            <div>圓環面積 ＝ 大圓面積 － 小圓面積</div>
            <div>＝ (${outerR}² － ${innerR}²) × 3.14 ＝ (${outerR * outerR - innerR * innerR}) × 3.14</div>
            <div style="font-size:1.25rem; font-weight:900; color:#DC2626; margin-top:0.3rem;">
              圓環面積 ＝ <strong>${ringArea}</strong> cm²
            </div>
          </div>
        </div>

      </div>
    `;
  }
}

/* =========================================================
   單元 8：認識速率 (發明歷史・交通工具時速・速率魔法三角)
   ========================================================= */
function setG6U8Target(target) {
  g6State.u8.target = target;
  ['speed', 'dist', 'time'].forEach(t => {
    const b = document.getElementById(`g6U8Btn_${t}`);
    if (b) b.className = (t === target) ? 'btn btn-primary' : 'btn btn-outline';
  });
  renderG6U8();
}

function selectG6U8Vehicle(vKey) {
  g6State.u8.vehicle = vKey;
  const speeds = {
    walk: { speed: 4, label: '步行', icon: '🚶' },
    bike: { speed: 15, label: '自行車', icon: '🚲' },
    car: { speed: 60, label: '市區汽車', icon: '🚗' },
    hightrain: { speed: 300, label: '台灣高鐵', icon: '🚄' },
    plane: { speed: 900, label: '民航噴射客機', icon: '✈️' }
  };
  const v = speeds[vKey];
  if (v) {
    document.getElementById('g6U8Speed').value = v.speed;
    renderG6U8();
  }
}

function renderG6U8() {
  const target = g6State.u8.target || 'speed';
  const dist = parseFloat(document.getElementById('g6U8Dist')?.value || 150);
  const time = parseFloat(document.getElementById('g6U8Time')?.value || 2.5);
  const speed = parseFloat(document.getElementById('g6U8Speed')?.value || 60);

  const outEl = document.getElementById('g6U8ResultWrap');
  if (!outEl) return;

  // 單位換算
  const mPerMin = Math.round((speed * 1000 / 60) * 10) / 10;
  const mPerSec = Math.round((speed / 3.6) * 10) / 10;

  // 繪製速率魔法三角 SVG
  const triangleSvg = `
    <svg viewBox="0 0 320 200" class="g6-diagram-svg" style="max-width:320px;">
      <!-- 大三角形 -->
      <polygon points="160,20 30,180 290,180" fill="#F8FAFC" stroke="#1E3A8A" stroke-width="3"/>
      <!-- 水平分割線 -->
      <line x1="75" y1="120" x2="245" y2="120" stroke="#1E3A8A" stroke-width="2.5"/>
      <!-- 垂直分割線 -->
      <line x1="160" y1="120" x2="160" y2="180" stroke="#1E3A8A" stroke-width="2.5"/>

      <!-- 頂部 距離 D -->
      <text x="160" y="85" font-size="22" font-weight="900" fill="${target==='dist'?'#DC2626':'#1E3A8A'}" text-anchor="middle">
        距離 (D)
      </text>
      <!-- 底部左 速率 S -->
      <text x="110" y="158" font-size="20" font-weight="900" fill="${target==='speed'?'#DC2626':'#2563EB'}" text-anchor="middle">
        速率 (S)
      </text>
      <!-- 乘號 -->
      <text x="160" y="158" font-size="20" font-weight="900" fill="#64748B" text-anchor="middle">×</text>
      <!-- 底部右 時間 T -->
      <text x="210" y="158" font-size="20" font-weight="900" fill="${target==='time'?'#DC2626':'#059669'}" text-anchor="middle">
        時間 (T)
      </text>
    </svg>
  `;

  let resultFormula = '';
  if (target === 'speed') {
    const s = Math.round((dist / time) * 100) / 100;
    resultFormula = `
      <div style="font-size:1.35rem; font-weight:900; color:#2563EB;">
        🚀 速率 ＝ 距離 ÷ 時間 ＝ ${dist} ÷ ${time} ＝ <strong>${s}</strong> km/h
      </div>
      <div style="font-size:0.95rem; color:#475569; margin-top:0.3rem;">
        單位換算：時速 ${s} km/h ＝ 分速 <strong>${Math.round((s*1000/60)*10)/10}</strong> m/min ＝ 秒速 <strong>${Math.round((s/3.6)*10)/10}</strong> m/s
      </div>
    `;
  } else if (target === 'dist') {
    const d = Math.round((speed * time) * 100) / 100;
    resultFormula = `
      <div style="font-size:1.35rem; font-weight:900; color:#059669;">
        🛣️ 距離 ＝ 速率 × 時間 ＝ ${speed} × ${time} ＝ <strong>${d}</strong> km
      </div>
    `;
  } else {
    const t = Math.round((dist / speed) * 100) / 100;
    resultFormula = `
      <div style="font-size:1.35rem; font-weight:900; color:#DC2626;">
        ⏱️ 時間 ＝ 距離 ÷ 速率 ＝ ${dist} ÷ ${speed} ＝ <strong>${t}</strong> 小時
      </div>
    `;
  }

  outEl.innerHTML = `
    <div style="display:flex; gap:1.5rem; flex-wrap:wrap; align-items:center; justify-content:center;">
      <div>${triangleSvg}</div>
      <div style="text-align:left; background:#FFFFFF; border:2px solid #CBD5E1; border-radius:12px; padding:1.2rem; min-width:280px;">
        ${resultFormula}
        <div style="background:#F1F5F9; border-radius:8px; padding:0.6rem 0.8rem; margin-top:0.75rem; font-size:0.88rem; line-height:1.6;">
          💡 <strong>魔法三角口訣</strong>：手指遮住想求的量！<br/>
          • 遮住距離 ➔ 速率 × 時間<br/>
          • 遮住速率 ➔ 距離 ÷ 時間<br/>
          • 遮住時間 ➔ 距離 ÷ 速率
        </div>
      </div>
    </div>
  `;
}

/* =========================================================
   單元 9：放大圖、縮圖與比例尺 (長度k倍 vs 面積k²倍・地圖比例尺)
   ========================================================= */
function renderG6U9() {
  const k = parseInt(document.getElementById('g6U9ScaleSlider')?.value || 2);
  const baseW = 3, baseH = 2;
  const newW = baseW * k;
  const newH = baseH * k;
  const baseArea = baseW * baseH;
  const newArea = newW * newH;
  const areaRatio = k * k;

  // 地圖比例尺換算
  const mapCm = parseFloat(document.getElementById('g6U9MapCm')?.value || 5);
  const scaleRatio = parseInt(document.getElementById('g6U9MapRatio')?.value || 50000);
  const actualCm = mapCm * scaleRatio;
  const actualM = actualCm / 100;
  const actualKm = actualCm / 100000;

  // 繪製幾何網格面積放大對照 SVG
  const cell = 18;
  const svgW = 540;
  const gridSvg = `
    <svg viewBox="0 0 ${svgW} 180" class="g6-diagram-svg">
      <!-- 原圖 (3x2) -->
      <g transform="translate(40, 40)">
        <text x="0" y="-12" font-size="13" font-weight="900" fill="#1E40AF">原圖 (長 3, 寬 2)</text>
        <rect x="0" y="0" width="${baseW * cell}" height="${baseH * cell}" fill="#93C5FD" stroke="#1D4ED8" stroke-width="2"/>
        <text x="${baseW * cell / 2}" y="${baseH * cell / 2 + 5}" font-size="12" font-weight="bold" fill="#1E3A8A" text-anchor="middle">
          ${baseArea}格
        </text>
      </g>

      <text x="145" y="75" font-size="24" fill="#64748B" text-anchor="middle">➔</text>

      <!-- 放大圖 (3k x 2k) -->
      <g transform="translate(190, 20)">
        <text x="0" y="-8" font-size="13" font-weight="900" fill="#DC2626">放大 ${k} 倍新圖 (長 ${newW}, 寬 ${newH})</text>
        <rect x="0" y="0" width="${newW * cell}" height="${newH * cell}" fill="#FECACA" stroke="#DC2626" stroke-width="2"/>
        <!-- 畫出原圖小塊在裡面的分佈 -->
        <g stroke="#EF4444" stroke-width="1" stroke-dasharray="2">
    `;
  let innerGrid = '';
  for (let r = 0; r < k; r++) {
    for (let c = 0; c < k; c++) {
      innerGrid += `
        <rect x="${c * baseW * cell}" y="${r * baseH * cell}" width="${baseW * cell}" height="${baseH * cell}" fill="none"/>
      `;
    }
  }
  const closeSvg = `
        </g>
        <text x="${newW * cell / 2}" y="${newH * cell / 2 + 6}" font-size="14" font-weight="900" fill="#991B1B" text-anchor="middle">
          ${newArea} 格 (${areaRatio} 個原圖)
        </text>
      </g>
      <text x="270" y="165" font-size="14" font-weight="900" fill="#DC2626" text-anchor="middle">
        長度放大 ${k} 倍 ➔ 面積變成 ${k} × ${k} ＝ ${areaRatio} 倍！ (角度不變)
      </text>
    </svg>
  `;

  const outEl = document.getElementById('g6U9ScaleResult');
  if (outEl) {
    outEl.innerHTML = `
      ${gridSvg + innerGrid + closeSvg}
      <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(280px, 1fr)); gap:1rem; margin-top:1rem; text-align:left;">
        <div style="background:#FFFFFF; border:1px solid #CBD5E1; border-radius:8px; padding:1rem;">
          <h5 style="color:#1E40AF; font-weight:800; margin-bottom:0.4rem;">📐 幾何放大縮小核心規律</h5>
          <ul style="padding-left:1.2rem; font-size:0.95rem; line-height:1.7; color:#334155; margin:0;">
            <li>邊長放大：<strong>${k}</strong> 倍（長 ${baseW} ➔ ${newW}，寬 ${baseH} ➔ ${newH}）</li>
            <li>周長放大：<strong>${k}</strong> 倍</li>
            <li>🔥 <strong>面積放大：${k}² ＝ <span style="color:#DC2626; font-size:1.15rem; font-weight:900;">${areaRatio}</span> 倍！</strong>（原 ${baseArea} cm² ➔ ${newArea} cm²）</li>
            <li>⭐ <strong>對應角大小：保持不變！</strong></li>
          </ul>
        </div>
        <div style="background:#F0FDF4; border:1px solid #86EFAC; border-radius:8px; padding:1rem;">
          <h5 style="color:#15803D; font-weight:800; margin-bottom:0.4rem;">🗺️ 地圖比例尺長度換算</h5>
          <div style="font-size:0.95rem; line-height:1.7; color:#166534;">
            <div>地圖上量出：<strong>${mapCm} cm</strong> ，比例尺 <strong>1 : ${scaleRatio}</strong></div>
            <div>實際長度 ＝ 圖上長度 × 比例尺分母</div>
            <div>＝ ${mapCm} × ${scaleRatio} ＝ ${actualCm.toLocaleString()} cm</div>
            <div style="font-size:1.2rem; font-weight:900; color:#DC2626; margin-top:0.25rem;">
              ＝ ${actualM.toLocaleString()} 公尺 ＝ ${actualKm} 公里！
            </div>
          </div>
        </div>
      </div>
    `;
  }
}

if (typeof window !== 'undefined') {
  window.switchG6Unit = switchG6Unit;
  window.openG6UnitQuiz = openG6UnitQuiz;
  window.initG6App = initG6App;
  window.setG6U1Count = setG6U1Count;
  window.loadG6U1Preset = loadG6U1Preset;
  window.renderG6U1 = renderG6U1;
  window.setG6U2Scenario = setG6U2Scenario;
  window.renderG6U2 = renderG6U2;
  window.setG6U3Mode = setG6U3Mode;
  window.renderG6U3 = renderG6U3;
  window.setG6U4Scenario = setG6U4Scenario;
  window.renderG6U4 = renderG6U4;
  window.setG6U5Scenario = setG6U5Scenario;
  window.renderG6U5 = renderG6U5;
  window.renderG6U6 = renderG6U6;
  window.renderG6U7 = renderG6U7;
  window.setG6U8Target = setG6U8Target;
  window.selectG6U8Vehicle = selectG6U8Vehicle;
  window.renderG6U8 = renderG6U8;
  window.renderG6U9 = renderG6U9;
}
