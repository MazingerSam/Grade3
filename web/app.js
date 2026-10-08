/* =========================================================
   康軒版國小三年級上學期 (3上) 數學互動學習樂園 - 主互動邏輯 app.js
   ========================================================= */

let starScore = 0;
let soundEnabled = true;
let audioCtx = null;

function playTone(freq = 523.25, duration = 0.12, type = 'sine') {
  if (!soundEnabled) return;
  try {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
    gain.gain.setValueAtTime(0.12, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + duration);
  } catch (e) {}
}

function playSuccessChord() {
  playTone(523.25, 0.1, 'triangle');
  setTimeout(() => playTone(659.25, 0.1, 'triangle'), 90);
  setTimeout(() => playTone(783.99, 0.18, 'triangle'), 180);
}

function addStar(points = 1) {
  starScore += points;
  const el = document.getElementById('starCount');
  if (el) {
    el.textContent = starScore;
    el.style.transform = 'scale(1.35)';
    setTimeout(() => (el.style.transform = 'scale(1)'), 220);
  }
  playSuccessChord();
}

function toggleSound() {
  soundEnabled = !soundEnabled;
  const btn = document.getElementById('soundToggleBtn');
  btn.textContent = soundEnabled ? '🔊 音效：開' : '🔇 音效：關';
}

/* 單元與子模式切換 */
function switchUnit(unitNum) {
  playTone(440, 0.08);
  for (let i = 1; i <= 10; i++) {
    const tab = document.getElementById(`unitTab${i}`);
    const sec = document.getElementById(`unit${i}`);
    if (tab) tab.classList.toggle('active', i === unitNum);
    if (sec) sec.classList.toggle('active', i === unitNum);
  }
}

function openUnitQuiz(unitNum) {
  switchUnit(10);
  if (typeof selectQuizUnit === 'function') {
    selectQuizUnit(unitNum);
  }
}

function switchSubmode(unitNum, subKey, btnEl) {
  playTone(493.88, 0.08);
  const section = document.getElementById(`unit${unitNum}`);
  section.querySelectorAll('.submode-btn').forEach(b => b.classList.remove('active'));
  btnEl.classList.add('active');
  section.querySelectorAll('.submode-panel').forEach(p => p.classList.remove('active'));
  document.getElementById(`u${unitNum}-sub${subKey}`).classList.add('active');
}

/* =========================================================
   第 1 單元：10000 以內的數
   ========================================================= */
let u1State = {
  repMode: 'blocks', // 'blocks' | 'money'
  counts: { 1000: 4, 100: 2, 10: 3, 1: 5 },
  targetNum: 4235
};

function getTokenSvg(place, mode, size = 46) {
  if (mode === 'blocks') {
    if (place === 1000) {
      return `<svg width="${size}" height="${size}" viewBox="0 0 60 60">
        <polygon points="10,20 30,8 52,20 32,32" fill="#FCA5A5" stroke="#B91C1C" stroke-width="2"/>
        <polygon points="10,20 32,32 32,54 10,42" fill="#EF4444" stroke="#B91C1C" stroke-width="2"/>
        <polygon points="32,32 52,20 52,42 32,54" fill="#DC2626" stroke="#B91C1C" stroke-width="2"/>
        <text x="31" y="38" font-size="11" font-weight="900" fill="white" text-anchor="middle">1000</text>
      </svg>`;
    }
    if (place === 100) {
      return `<svg width="${size}" height="${size}" viewBox="0 0 54 54">
        <rect x="7" y="7" width="40" height="40" rx="4" fill="#FBBF24" stroke="#B45309" stroke-width="2.5"/>
        <line x1="20" y1="7" x2="20" y2="47" stroke="#D97706" stroke-width="1.2"/>
        <line x1="34" y1="7" x2="34" y2="47" stroke="#D97706" stroke-width="1.2"/>
        <line x1="7" y1="20" x2="47" y2="20" stroke="#D97706" stroke-width="1.2"/>
        <line x1="7" y1="34" x2="47" y2="34" stroke="#D97706" stroke-width="1.2"/>
        <text x="27" y="31" font-size="12" font-weight="900" fill="#78350F" text-anchor="middle">100</text>
      </svg>`;
    }
    if (place === 10) {
      return `<svg width="${size * 0.7}" height="${size}" viewBox="0 0 34 54">
        <rect x="9" y="4" width="16" height="46" rx="3" fill="#34D399" stroke="#047857" stroke-width="2"/>
        <line x1="9" y1="15" x2="25" y2="15" stroke="#059669" stroke-width="1.2"/>
        <line x1="9" y1="27" x2="25" y2="27" stroke="#059669" stroke-width="1.2"/>
        <line x1="9" y1="39" x2="25" y2="39" stroke="#059669" stroke-width="1.2"/>
        <text x="17" y="31" font-size="10" font-weight="900" fill="#064E3B" text-anchor="middle">10</text>
      </svg>`;
    }
    return `<svg width="${size * 0.65}" height="${size * 0.65}" viewBox="0 0 36 36">
      <rect x="6" y="6" width="24" height="24" rx="4" fill="#60A5FA" stroke="#1D4ED8" stroke-width="2"/>
      <text x="18" y="22" font-size="12" font-weight="900" fill="white" text-anchor="middle">1</text>
    </svg>`;
  } else {
    // 錢幣表徵
    if (place === 1000) {
      return `<svg width="${size * 1.35}" height="${size * 0.85}" viewBox="0 0 76 46">
        <rect x="3" y="3" width="70" height="40" rx="6" fill="#DBEAFE" stroke="#1D4ED8" stroke-width="2.5"/>
        <circle cx="20" cy="23" r="9" fill="#93C5FD"/>
        <text x="46" y="28" font-size="14" font-weight="900" fill="#1E3A8A" text-anchor="middle">1000</text>
      </svg>`;
    }
    if (place === 100) {
      return `<svg width="${size * 1.25}" height="${size * 0.85}" viewBox="0 0 70 44">
        <rect x="3" y="3" width="64" height="38" rx="6" fill="#FEE2E2" stroke="#DC2626" stroke-width="2.5"/>
        <circle cx="18" cy="22" r="8" fill="#FCA5A5"/>
        <text x="43" y="27" font-size="14" font-weight="900" fill="#991B1B" text-anchor="middle">100</text>
      </svg>`;
    }
    if (place === 10) {
      return `<svg width="${size * 0.85}" height="${size * 0.85}" viewBox="0 0 44 44">
        <circle cx="22" cy="22" r="19" fill="#FDE68A" stroke="#B45309" stroke-width="2.5"/>
        <text x="22" y="27" font-size="14" font-weight="900" fill="#78350F" text-anchor="middle">10</text>
      </svg>`;
    }
    return `<svg width="${size * 0.75}" height="${size * 0.75}" viewBox="0 0 40 40">
      <circle cx="20" cy="20" r="16" fill="#F1F5F9" stroke="#64748B" stroke-width="2.5"/>
      <text x="20" y="25" font-size="13" font-weight="900" fill="#334155" text-anchor="middle">1</text>
    </svg>`;
  }
}

function renderU1Bank() {
  const bank = document.getElementById('u1Bank');
  const places = [
    { val: 1000, label: u1State.repMode === 'blocks' ? '千格積木 (1000)' : '1000元鈔票' },
    { val: 100, label: u1State.repMode === 'blocks' ? '百格積木 (100)' : '100元鈔票' },
    { val: 10, label: u1State.repMode === 'blocks' ? '十格橘條 (10)' : '10元硬幣' },
    { val: 1, label: u1State.repMode === 'blocks' ? '白色積木 (1)' : '1元硬幣' }
  ];
  bank.innerHTML = places.map(p => `
    <div class="bank-item" draggable="true" ondragstart="dragU1Start(event, ${p.val})" onclick="changeU1Count(${p.val}, 1)">
      ${getTokenSvg(p.val, u1State.repMode, 52)}
      <span style="font-weight:800; font-size:0.9rem; color:#1E293B;">${p.label}</span>
      <span style="font-size:0.75rem; color:#64748B;">拖拉或點選 ＋1</span>
    </div>
  `).join('');
}

function dragU1Start(ev, placeVal) {
  ev.dataTransfer.setData('text/plain', String(placeVal));
}

function allowDrop(ev) {
  ev.preventDefault();
  ev.currentTarget.classList.add('drag-over');
}

function leaveDrop(ev) {
  ev.currentTarget.classList.remove('drag-over');
}

function handleU1Drop(ev, targetPlace) {
  ev.preventDefault();
  ev.currentTarget.classList.remove('drag-over');
  const draggedPlace = parseInt(ev.dataTransfer.getData('text/plain'), 10);
  if (draggedPlace === targetPlace) {
    changeU1Count(targetPlace, 1);
  } else if ([1000, 100, 10, 1].includes(draggedPlace)) {
    changeU1Count(draggedPlace, 1);
  }
}

function numberToChinese(num) {
  if (num === 0) return '零';
  if (num === 10000) return '一萬';
  const digits = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九'];
  const units = ['', '十', '百', '千'];
  let str = '';
  let zeroFlag = false;
  const s = String(num);
  for (let i = 0; i < s.length; i++) {
    const n = parseInt(s[i], 10);
    const pos = s.length - 1 - i;
    if (n === 0) {
      zeroFlag = true;
    } else {
      if (zeroFlag) {
        str += '零';
        zeroFlag = false;
      }
      str += digits[n] + units[pos];
    }
  }
  return str;
}

function renderU1Board() {
  const unitNames = { 1000: '個千', 100: '個百', 10: '個十', 1: '個一' };
  [1000, 100, 10, 1].forEach(p => {
    const c = u1State.counts[p];
    document.getElementById(`pvCount${p}`).textContent = `${c} ${unitNames[p]}`;
    document.getElementById(`pvDigit${p}`).textContent = c;
    const zone = document.getElementById(`pvZone${p}`);
    let tokensHtml = '';
    for (let i = 0; i < c; i++) {
      tokensHtml += `<div class="pv-token" title="點擊移除 1 個" onclick="changeU1Count(${p}, -1)">${getTokenSvg(p, u1State.repMode, 42)}</div>`;
    }
    zone.innerHTML = tokensHtml;
  });

  const total = u1State.counts[1000] * 1000 + u1State.counts[100] * 100 + u1State.counts[10] * 10 + u1State.counts[1];
  document.getElementById('u1TotalNum').textContent = total;
  document.getElementById('u1ExpandedText').textContent =
    `${u1State.counts[1000]} 個千 + ${u1State.counts[100]} 個百 + ${u1State.counts[10]} 個十 + ${u1State.counts[1]} 個一 ＝ ${total}`;
  document.getElementById('u1ChineseRead').textContent = numberToChinese(Math.min(total, 10000));

  const fb = document.getElementById('u1Feedback');
  const needRegroup = [100, 10, 1].some(p => u1State.counts[p] >= 10);
  if (needRegroup) {
    fb.className = 'feedback-banner warning';
    fb.innerHTML = `⚠️ 注意！有某一位超過 10 個囉！點選上方「✨ 滿十自動換錢/進位化聚」把 10 個換成高一位的 1 個吧！`;
  } else if (total === u1State.targetNum) {
    fb.className = 'feedback-banner success';
    fb.innerHTML = `🎉 太棒了！你成功湊出了目標數量 <strong>${total}</strong>（讀作：<strong>${numberToChinese(total)}</strong>）！`;
  } else {
    fb.className = 'feedback-banner';
    fb.innerHTML = `🎯 目前總和是 <strong>${total}</strong>，距離目標 <strong>${u1State.targetNum}</strong> 還差 <strong>${Math.abs(u1State.targetNum - total)}</strong>，繼續拖拉或點選調整看看！`;
  }
}

function changeU1Count(place, delta) {
  const next = u1State.counts[place] + delta;
  if (next < 0 || next > 19) return;
  u1State.counts[place] = next;
  playTone(delta > 0 ? 587.33 : 392, 0.08);
  renderU1Board();
  const total = u1State.counts[1000] * 1000 + u1State.counts[100] * 100 + u1State.counts[10] * 10 + u1State.counts[1];
  if (total === u1State.targetNum && ![100, 10, 1].some(p => u1State.counts[p] >= 10)) {
    addStar(1);
  }
}

function regroupU1Board() {
  let changed = false;
  [1, 10, 100].forEach(p => {
    if (u1State.counts[p] >= 10) {
      const carry = Math.floor(u1State.counts[p] / 10);
      u1State.counts[p] = u1State.counts[p] % 10;
      u1State.counts[p * 10] += carry;
      changed = true;
    }
  });
  if (changed) {
    addStar(1);
    renderU1Board();
    const fb = document.getElementById('u1Feedback');
    fb.className = 'feedback-banner success';
    fb.innerHTML = `✨ 化聚完成！滿 10 個已經自動換成高一位的 1 個囉！`;
  } else {
    playTone(330, 0.1);
  }
}

function clearU1Board() {
  u1State.counts = { 1000: 0, 100: 0, 10: 0, 1: 0 };
  playTone(330, 0.1);
  renderU1Board();
}

function setU1RepMode(mode) {
  u1State.repMode = mode;
  document.getElementById('repBlocksBtn').classList.toggle('active', mode === 'blocks');
  document.getElementById('repMoneyBtn').classList.toggle('active', mode === 'money');
  playTone(523.25, 0.08);
  renderU1Bank();
  renderU1Board();
}

function setU1Preset(target, text) {
  u1State.targetNum = target;
  document.getElementById('u1TaskText').innerHTML = text;
  u1State.counts = { 1000: 0, 100: 0, 10: 0, 1: 0 };
  playTone(587.33, 0.1);
  renderU1Board();
}

function randomU1Task() {
  const r = Math.floor(Math.random() * 8900) + 1001;
  setU1Preset(r, `【隨機挑戰】請用積木或錢幣在定位板上排出 <strong>${r}</strong>（讀作：${numberToChinese(r)}）！`);
}

/* 1-B: 台灣高山比大小 */
let cmpState = {
  numA: 3952, nameA: '玉山',
  numB: 3560, nameB: '奇萊山',
  turn: 0
};

function selectMountain(idx, height, name) {
  playTone(493.88, 0.08);
  if (cmpState.turn % 2 === 0) {
    cmpState.numA = height;
    cmpState.nameA = name;
  } else {
    cmpState.numB = height;
    cmpState.nameB = name;
  }
  cmpState.turn++;
  renderCompareArena();
}

function randomComparePair() {
  playTone(587.33, 0.09);
  const base = Math.floor(Math.random() * 8) + 1;
  const a = base * 1000 + Math.floor(Math.random() * 999);
  const b = base * 1000 + Math.floor(Math.random() * 999);
  cmpState.numA = a;
  cmpState.nameA = '甲數';
  cmpState.numB = b;
  cmpState.nameB = '乙數';
  renderCompareArena();
}

function renderCompareArena() {
  document.getElementById('cmpLabelA').textContent = cmpState.nameA;
  document.getElementById('cmpNumA').textContent = cmpState.numA;
  document.getElementById('cmpLabelB').textContent = cmpState.nameB;
  document.getElementById('cmpNumB').textContent = cmpState.numB;

  const sA = String(cmpState.numA).padStart(4, '0');
  const sB = String(cmpState.numB).padStart(4, '0');
  let diffIdx = -1;
  for (let i = 0; i < 4; i++) {
    if (sA[i] !== sB[i]) {
      diffIdx = i;
      break;
    }
  }
  const placeLabels = ['千位', '百位', '十位', '個位'];
  const colors = ['#EF4444', '#F59E0B', '#10B981', '#3B82F6'];

  let html = `<table class="v-table" style="background:white; border-radius:12px; overflow:hidden; border:2px solid #CBD5E1;">
    <thead><tr>
      <th style="background:#64748B;">名稱</th>
      ${placeLabels.map((l, i) => `<th style="background:${colors[i]};">${l}</th>`).join('')}
    </tr></thead>
    <tbody>
      <tr>
        <td style="font-size:1.1rem;">${cmpState.nameA}</td>
        ${sA.split('').map((d, i) => `<td style="${i === diffIdx ? 'background:#FEF08A; color:#B91C1C;' : ''}">${d}</td>`).join('')}
      </tr>
      <tr>
        <td style="font-size:1.1rem;">${cmpState.nameB}</td>
        ${sB.split('').map((d, i) => `<td style="${i === diffIdx ? 'background:#FEF08A; color:#B91C1C;' : ''}">${d}</td>`).join('')}
      </tr>
    </tbody>
  </table>`;
  document.getElementById('cmpPlaceTableWrap').innerHTML = html;
}

function checkCompare(sign) {
  const correct = cmpState.numA > cmpState.numB ? '>' : (cmpState.numA < cmpState.numB ? '<' : '=');
  const fb = document.getElementById('u1CompareFeedback');
  const sA = String(cmpState.numA).padStart(4, '0');
  const sB = String(cmpState.numB).padStart(4, '0');
  const placeNames = ['千位', '百位', '十位', '個位'];
  let reason = '兩個數完全相同';
  for (let i = 0; i < 4; i++) {
    if (sA[i] !== sB[i]) {
      reason = `從最高位開始比，比到<strong>${placeNames[i]}</strong>時，${sA[i]} 和 ${sB[i]} 不同（${sA[i]} ${sA[i] > sB[i] ? '＞' : '＜'} ${sB[i]}）`;
      break;
    }
  }

  if (sign === correct) {
    addStar(1);
    fb.className = 'feedback-banner success';
    fb.innerHTML = `✅ 答對了！<strong>${cmpState.numA} ${sign === '>' ? '＞' : sign === '<' ? '＜' : '＝'} ${cmpState.numB}</strong>！因為${reason}！`;
  } else {
    playTone(261.63, 0.18, 'sawtooth');
    fb.className = 'feedback-banner warning';
    fb.innerHTML = `🤔 再看一次定位板喔！${reason}，所以應該是 <strong>${cmpState.numA} ${correct === '>' ? '＞' : '＜'} ${cmpState.numB}</strong>。`;
  }
}

/* 1-C: 整數數線視覺化 */
function setNumberLinePreset(step, startTick, jumpTicks) {
  document.getElementById('nlStepSelect').value = String(step);
  document.getElementById('nlStartSlider').value = String(startTick / (step === 100 || step === 1000 ? step : 1));
  document.getElementById('nlJumpSlider').value = String(jumpTicks / (step === 100 || step === 1000 ? step : 1));
  playTone(523.25, 0.08);
  updateNumberLine();
}

function updateNumberLine() {
  const step = parseInt(document.getElementById('nlStepSelect').value, 10);
  const startIdx = parseInt(document.getElementById('nlStartSlider').value, 10);
  const jumpIdx = parseInt(document.getElementById('nlJumpSlider').value, 10);

  const clampedEndIdx = Math.max(0, Math.min(20, startIdx + jumpIdx));
  const actualJumpIdx = clampedEndIdx - startIdx;

  const startVal = startIdx * step;
  const jumpVal = actualJumpIdx * step;
  const endVal = clampedEndIdx * step;

  document.getElementById('nlStartValLabel').textContent = startVal;
  document.getElementById('nlJumpValLabel').textContent =
    actualJumpIdx >= 0 ? `往右 +${ Math.abs(actualJumpIdx) } 格 (+${jumpVal})` : `往左 ${actualJumpIdx} 格 (${jumpVal})`;

  const svg = document.getElementById('numberLineSvg');
  const leftX = 50;
  const rightX = 850;
  const lineY = 140;
  const tickGap = (rightX - leftX) / 20;

  let ticksHtml = '';
  for (let i = 0; i <= 20; i++) {
    const x = leftX + i * tickGap;
    const val = i * step;
    const isMajor = i % 2 === 0 || step === 1;
    ticksHtml += `
      <line x1="${x}" y1="${lineY - 8}" x2="${x}" y2="${lineY + 8}" stroke="#1E293B" stroke-width="${i % 5 === 0 ? 3 : 2}"/>
      ${(step <= 10 || i % 2 === 0) ? `<text x="${x}" y="${lineY + 28}" font-size="${step >= 1000 ? 11 : 13}" font-weight="800" fill="#334155" text-anchor="middle">${val}</text>` : ''}
    `;
  }

  const x1 = leftX + startIdx * tickGap;
  const x2 = leftX + clampedEndIdx * tickGap;
  const midX = (x1 + x2) / 2;
  const arcHeight = Math.min(85, Math.max(38, Math.abs(actualJumpIdx) * 8));
  const arcColor = actualJumpIdx >= 0 ? '#10B981' : '#EF4444';

  const arcHtml = actualJumpIdx !== 0 ? `
    <path d="M ${x1} ${lineY - 10} Q ${midX} ${lineY - 10 - arcHeight * 1.5} ${x2} ${lineY - 10}" fill="none" stroke="${arcColor}" stroke-width="4" stroke-dasharray="6,4"/>
    <circle cx="${x2}" cy="${lineY - 10}" r="6" fill="${arcColor}"/>
    <rect x="${midX - 48}" y="${lineY - 22 - arcHeight}" width="96" height="26" rx="13" fill="${arcColor}"/>
    <text x="${midX}" y="${lineY - 4 - arcHeight}" font-size="13" font-weight="900" fill="white" text-anchor="middle">
      ${actualJumpIdx > 0 ? `往右 +${jumpVal}` : `往左 ${jumpVal}`}
    </text>
  ` : '';

  svg.innerHTML = `
    <!-- 主數線與右箭頭 -->
    <line x1="${leftX}" y1="${lineY}" x2="${rightX + 25}" y2="${lineY}" stroke="#1E293B" stroke-width="3.5"/>
    <polygon points="${rightX + 32},${lineY} ${rightX + 18},${lineY - 8} ${rightX + 18},${lineY + 8}" fill="#1E293B"/>
    ${ticksHtml}
    ${arcHtml}
    <!-- 起點標記 -->
    <circle cx="${x1}" cy="${lineY}" r="8" fill="#3B82F6" stroke="white" stroke-width="2"/>
    <text x="${x1}" y="${lineY + 52}" font-size="13" font-weight="900" fill="#1D4ED8" text-anchor="middle">起點 ${startVal}</text>
    <!-- 終點青蛙/螞蟻 -->
    <text x="${x2}" y="${lineY - 18}" font-size="26" text-anchor="middle">${actualJumpIdx >= 0 ? '🐸' : '🐜'}</text>
    <text x="${x2}" y="${lineY + 70}" font-size="13" font-weight="900" fill="${arcColor}" text-anchor="middle">停在 ${endVal}</text>
  `;

  const banner = document.getElementById('nlEquationBanner');
  if (actualJumpIdx >= 0) {
    banner.className = 'feedback-banner success';
    banner.innerHTML = `🐸 在數線上<strong>向右移動是加</strong>：<strong>${startVal} ＋ ${jumpVal} ＝ ${endVal}</strong>（每格代表 ${step}）`;
  } else {
    banner.className = 'feedback-banner warning';
    banner.innerHTML = `🐜 在數線上<strong>向左移動是減</strong>：<strong>${startVal} － ${Math.abs(jumpVal)} ＝ ${endVal}</strong>（每格代表 ${step}）`;
  }
}

/* =========================================================
   第 2 單元：四位數的加減
   ========================================================= */
let u2State = {
  a: 891,
  b: 446,
  op: '+',
  step: 4 // 0..4 (0=未算, 1=個位, 2=十位, 3=百位, 4=千位完成)
};

function loadU2Problem(a, op, b, storyText) {
  u2State.a = a;
  u2State.op = op;
  u2State.b = b;
  u2State.step = 1;
  document.getElementById('u2InputA').value = a;
  document.getElementById('u2OpSelect').value = op;
  document.getElementById('u2InputB').value = b;
  if (storyText) {
    document.getElementById('u2StoryPrompt').innerHTML = storyText;
  }
  playTone(523.25, 0.08);
  renderU2Vertical();
}

function customU2Problem() {
  let a = parseInt(document.getElementById('u2InputA').value, 10) || 500;
  let b = parseInt(document.getElementById('u2InputB').value, 10) || 247;
  const op = document.getElementById('u2OpSelect').value;
  if (op === '-' && a < b) {
    const tmp = a; a = b; b = tmp;
    document.getElementById('u2InputA').value = a;
    document.getElementById('u2InputB').value = b;
  }
  u2State.a = Math.min(9999, Math.max(1, a));
  u2State.b = Math.min(9999, Math.max(1, b));
  u2State.op = op;
  u2State.step = 1;
  renderU2Vertical();
}

function stepU2Vertical() {
  u2State.step = (u2State.step % 4) + 1;
  if (u2State.step === 4) addStar(1);
  else playTone(587.33, 0.08);
  renderU2Vertical();
}

function showAllU2Vertical() {
  u2State.step = 4;
  addStar(1);
  renderU2Vertical();
}

function renderU2Vertical() {
  document.getElementById('u2StepCounter').textContent = `${u2State.step}/4`;
  const { a, b, op, step } = u2State;
  const dA = [
    Math.floor(a / 1000) % 10,
    Math.floor(a / 100) % 10,
    Math.floor(a / 10) % 10,
    a % 10
  ];
  const dB = [
    Math.floor(b / 1000) % 10,
    Math.floor(b / 100) % 10,
    Math.floor(b / 10) % 10,
    b % 10
  ];

  let carryRow = ['', '', '', ''];
  let ansRow = ['', '', '', ''];
  let explanations = [];

  if (op === '+') {
    let c = 0;
    const placeNames = ['千位', '百位', '十位', '個位'];
    for (let i = 3; i >= 0; i--) {
      const colStep = 4 - i; // 1=個位, 2=十位, 3=百位, 4=千位
      const sum = dA[i] + dB[i] + c;
      const digit = sum % 10;
      const nextC = Math.floor(sum / 10);
      if (step >= colStep) {
        ansRow[i] = digit;
        if (nextC > 0 && i > 0) carryRow[i - 1] = `+${nextC}`;
        explanations.push(
          `<strong>Step ${colStep}（${placeNames[i]}）：</strong>${dA[i]} ＋ ${dB[i]}${c ? ` ＋ 進位 ${c}` : ''} ＝ <strong>${sum}</strong>，` +
          (nextC > 0 ? `在${placeNames[i]}寫 <strong>${digit}</strong>，滿十向${placeNames[i - 1] || '萬位'}記進位 <strong>1</strong>。` : `在${placeNames[i]}寫 <strong>${digit}</strong>。`)
        );
      }
      c = nextC;
    }
  } else {
    // 減法借位計算
    let workA = [...dA];
    let borrowTop = ['', '', '', ''];
    const placeNames = ['千位', '百位', '十位', '個位'];
    for (let i = 3; i >= 0; i--) {
      const colStep = 4 - i;
      if (workA[i] < dB[i]) {
        // 向左尋找非0位借位
        let j = i - 1;
        while (j >= 0 && workA[j] === 0) j--;
        if (j >= 0) {
          workA[j] -= 1;
          if (step >= colStep) borrowTop[j] = `${workA[j]}`;
          for (let k = j + 1; k < i; k++) {
            workA[k] += 9;
            if (step >= colStep) borrowTop[k] = `9`;
          }
          workA[i] += 10;
          if (step >= colStep) borrowTop[i] = `${workA[i]}`;
        }
      }
      const diff = workA[i] - dB[i];
      if (step >= colStep) {
        ansRow[i] = diff;
        if (dA[i] < dB[i] || borrowTop[i] !== '') {
          explanations.push(
            `<strong>Step ${colStep}（${placeNames[i]}）：</strong>不夠減向高位借位後，用 <strong>${workA[i]} － ${dB[i]} ＝ ${diff}</strong>，在${placeNames[i]}寫 <strong>${diff}</strong>。`
          );
        } else {
          explanations.push(
            `<strong>Step ${colStep}（${placeNames[i]}）：</strong><strong>${workA[i]} － ${dB[i]} ＝ ${diff}</strong>，在${placeNames[i]}寫 <strong>${diff}</strong>。`
          );
        }
      }
    }
    carryRow = borrowTop;
  }

  const fmtUpper = (digits, rawNum) =>
    digits.map((d, idx) => (rawNum < Math.pow(10, 3 - idx) && idx < 3 ? '' : d));

  const dispA = fmtUpper(dA, a);
  const dispB = fmtUpper(dB, b);

  const table = document.getElementById('u2VerticalTable');
  table.innerHTML = `
    <thead>
      <tr>
        <th style="background:#64748B; width:48px;">算式</th>
        <th style="background:#EF4444;">千位</th>
        <th style="background:#F59E0B;">百位</th>
        <th style="background:#10B981;">十位</th>
        <th style="background:#3B82F6;">個位</th>
      </tr>
    </thead>
    <tbody>
      <tr style="height:42px;">
        <td style="font-size:0.85rem; color:#DC2626;">進/退位</td>
        ${carryRow.map(c => `<td>${c !== '' ? `<span class="carry-badge">${c}</span>` : ''}</td>`).join('')}
      </tr>
      <tr>
        <td></td>
        ${dispA.map((d, i) => `<td style="${op === '-' && carryRow[i] !== '' ? 'text-decoration:line-through; color:#94A3B8;' : ''}">${d}</td>`).join('')}
      </tr>
      <tr class="v-line">
        <td style="color:#1D4ED8; font-weight:900;">${op === '+' ? '＋' : '－'}</td>
        ${dispB.map(d => `<td>${d}</td>`).join('')}
      </tr>
      <tr style="background:#FEF3C7;">
        <td style="font-size:1rem; color:#B45309;">答案</td>
        ${ansRow.map((d, i) => `<td style="color:#B91C1C;">${d === 0 && i === 0 && (op === '+' ? a + b : a - b) < 1000 ? '' : d}</td>`).join('')}
      </tr>
    </tbody>
  `;

  document.getElementById('u2StepExplanation').innerHTML = explanations.join('<br/>');

  const finalVal = op === '+' ? a + b : a - b;
  const fDigits = [
    Math.floor(finalVal / 1000) % 10,
    Math.floor(finalVal / 100) % 10,
    Math.floor(finalVal / 10) % 10,
    finalVal % 10
  ];
  const labels = ['1000', '100', '10', '1'];
  const colors = ['#FEE2E2', '#FEF3C7', '#D1FAE5', '#DBEAFE'];
  document.getElementById('u2ChipVisual').innerHTML = fDigits.map((cnt, i) => `
    <div style="background:${colors[i]}; padding:0.6rem; border-radius:12px; border:2px solid #CBD5E1;">
      <div style="font-weight:900; font-size:0.85rem; color:#334155;">${labels[i]} 籌碼</div>
      <div style="font-family:'Fredoka'; font-size:1.5rem; font-weight:900; color:#1E293B;">× ${cnt}</div>
    </div>
  `).join('');
}

/* 2-B: 數線估算滑桿與豆豆晚餐搭配 */
let estModeUnit = 100; // 100 or 1000
function setEstSlider(val, unit) {
  estModeUnit = unit;
  const slider = document.getElementById('estSlider');
  slider.max = unit === 100 ? 400 : 5000;
  slider.value = val;
  playTone(523.25, 0.08);
  updateEstVisualizer();
}

function updateEstVisualizer() {
  const slider = document.getElementById('estSlider');
  const val = parseInt(slider.value, 10);
  const unit = parseInt(slider.max, 10) > 1000 ? 1000 : 100;
  const low = Math.floor(val / unit) * unit;
  const high = low + unit;
  const mid = low + unit / 2;
  const nearest = val >= mid ? high : low;

  const svg = document.getElementById('estLineSvg');
  const xStart = 80;
  const xEnd = 720;
  const y = 70;
  const ratio = (val - low) / unit;
  const curX = xStart + ratio * (xEnd - xStart);

  svg.innerHTML = `
    <line x1="${xStart}" y1="${y}" x2="${xEnd}" y2="${y}" stroke="#334155" stroke-width="4"/>
    <line x1="${xStart}" y1="${y - 12}" x2="${xStart}" y2="${y + 12}" stroke="#1E293B" stroke-width="4"/>
    <line x1="${(xStart + xEnd) / 2}" y1="${y - 8}" x2="${(xStart + xEnd) / 2}" y2="${y + 8}" stroke="#94A3B8" stroke-width="2" stroke-dasharray="4,3"/>
    <line x1="${xEnd}" y1="${y - 12}" x2="${xEnd}" y2="${y + 12}" stroke="#1E293B" stroke-width="4"/>
    <text x="${xStart}" y="${y + 34}" font-size="16" font-weight="900" fill="${nearest === low ? '#16A34A' : '#475569'}" text-anchor="middle">${low}</text>
    <text x="${(xStart + xEnd) / 2}" y="${y + 30}" font-size="13" font-weight="700" fill="#64748B" text-anchor="middle">中點 ${mid}</text>
    <text x="${xEnd}" y="${y + 34}" font-size="16" font-weight="900" fill="${nearest === high ? '#16A34A' : '#475569'}" text-anchor="middle">${high}</text>

    <!-- 當前位置標記 -->
    <circle cx="${curX}" cy="${y}" r="10" fill="#EF4444" stroke="white" stroke-width="3"/>
    <rect x="${curX - 38}" y="${y - 45}" width="76" height="28" rx="8" fill="#EF4444"/>
    <text x="${curX}" y="${y - 26}" font-size="15" font-weight="900" fill="white" text-anchor="middle">${val}</text>
  `;

  document.getElementById('estResultText').innerHTML =
    `📍 <strong>${val}</strong> 在 <strong>${low}</strong> 和 <strong>${high}</strong> 之間，比較接近 <strong>${nearest}</strong>，所以大約是 <strong>${nearest}</strong>！`;
}

let dinnerSel = { starter: 0, main: 0 };
const starters = [
  { name: '玉米濃湯', exact: 198, est: 200 },
  { name: '水果沙拉', exact: 295, est: 300 }
];
const mains = [
  { name: '野菇燉飯', exact: 389, est: 400 },
  { name: '夏威夷披薩', exact: 305, est: 300 }
];

function selectDinner(type, idx) {
  if (type === 0) dinnerSel.starter = idx;
  else dinnerSel.main = idx;

  document.getElementById('starterBtn0').style.borderColor = dinnerSel.starter === 0 ? '#2563EB' : '#CBD5E1';
  document.getElementById('starterBtn1').style.borderColor = dinnerSel.starter === 1 ? '#2563EB' : '#CBD5E1';
  document.getElementById('mainBtn0').style.borderColor = dinnerSel.main === 0 ? '#2563EB' : '#CBD5E1';
  document.getElementById('mainBtn1').style.borderColor = dinnerSel.main === 1 ? '#2563EB' : '#CBD5E1';

  const s = starters[dinnerSel.starter];
  const m = mains[dinnerSel.main];
  const sumEst = s.est + m.est;
  const fb = document.getElementById('dinnerFeedback');
  if (sumEst === 600) {
    addStar(1);
    fb.className = 'feedback-banner success';
    fb.innerHTML = `✅ 完美搭配！【${s.name} ${s.exact}大卡 ≈ ${s.est}】＋【${m.name} ${m.exact}大卡 ≈ ${m.est}】＝ 大約 <strong>${sumEst} 大卡</strong>，剛好符合豆豆晚餐需要的 600 大卡！`;
  } else {
    playTone(349.23, 0.12);
    fb.className = 'feedback-banner warning';
    fb.innerHTML = `🤔 目前搭配：【${s.name} ≈ ${s.est}】＋【${m.name} ≈ ${m.est}】＝ 大約 <strong>${sumEst} 大卡</strong>，跟目標 600 大卡不太一樣喔，換一道試試看！`;
  }
}

/* =========================================================
   第 3 單元：毫米 (mm) - 可拖拉直尺與複名數計算
   ========================================================= */
const u3Objects = [
  { name: '李健竹大師鉛筆芯微雕作品', mm: 5, color: '#F59E0B', desc: '尺上 1 小格是 1 毫米 (mm)，5 小格就是 5 毫米！' },
  { name: '馬達加斯加迷你變色龍', mm: 29, color: '#10B981', desc: '2 公分又 9 毫米 ＝ 20 毫米 ＋ 9 毫米 ＝ 29 毫米！' },
  { name: '蚱蜢跳遠紀錄', mm: 46, color: '#8B5CF6', desc: '46 毫米 ＝ 4 公分 6 毫米！' },
  { name: '藍色螢光筆畫出的直線', mm: 72, color: '#3B82F6', desc: '7 公分 2 毫米 ＝ 72 毫米！' }
];

let u3State = {
  objIdx: 1,
  rulerX: 90,
  rulerY: 145,
  dragging: false,
  dragOffsetX: 0,
  dragOffsetY: 0,
  drawMm: 29
};

function setU3Object(idx) {
  u3State.objIdx = idx;
  u3State.drawMm = u3Objects[idx].mm;
  document.getElementById('u3DrawSlider').value = u3State.drawMm;
  playTone(523.25, 0.08);
  updateU3DrawLine(u3State.drawMm);
}

function updateU3DrawLine(mmVal) {
  u3State.drawMm = parseInt(mmVal, 10);
  const cm = Math.floor(u3State.drawMm / 10);
  const rem = u3State.drawMm % 10;
  document.getElementById('u3ConversionBadge').textContent =
    cm > 0 ? `${u3State.drawMm} 毫米 ＝ ${cm} 公分 ${rem} 毫米` : `${u3State.drawMm} 毫米`;
  renderU3RulerCanvas();
}

function renderU3RulerCanvas() {
  const svg = document.getElementById('u3SvgCanvas');
  const obj = u3Objects[u3State.objIdx];
  const pxPerMm = 7; // 1mm = 7px, 10cm = 700px
  const objStartX = 110;
  const objY = 95;
  const objWidth = u3State.drawMm * pxPerMm;

  // 繪製直尺刻度 (0 ~ 10cm = 100mm)
  let ticks = '';
  for (let m = 0; m <= 100; m++) {
    const tx = 20 + m * pxPerMm;
    let th = 12;
    let sw = 1.2;
    if (m % 10 === 0) { th = 28; sw = 2.4; }
    else if (m % 5 === 0) { th = 20; sw = 1.8; }
    ticks += `<line x1="${tx}" y1="0" x2="${tx}" y2="${th}" stroke="#0F172A" stroke-width="${sw}"/>`;
    if (m % 10 === 0) {
      ticks += `<text x="${tx}" y="46" font-size="15" font-weight="900" fill="#0F172A" text-anchor="middle">${m / 10}</text>`;
    }
  }

  const aligned = Math.abs((u3State.rulerX + 20) - objStartX) <= 8;

  svg.innerHTML = `
    <!-- 背景提示 -->
    <text x="24" y="32" font-size="15" font-weight="900" fill="#0369A1">
      🔎 當前測量物：${obj.name}（目前長度：${u3State.drawMm} 毫米 ＝ ${Math.floor(u3State.drawMm / 10)} 公分 ${u3State.drawMm % 10} 毫米）
    </text>

    <!-- 對齊虛線 -->
    <line x1="${objStartX}" y1="55" x2="${objStartX}" y2="290" stroke="${aligned ? '#10B981' : '#94A3B8'}" stroke-width="2" stroke-dasharray="5,5"/>
    <line x1="${objStartX + objWidth}" y1="55" x2="${objStartX + objWidth}" y2="290" stroke="${aligned ? '#10B981' : '#94A3B8'}" stroke-width="2" stroke-dasharray="5,5"/>

    <!-- 被測量物件長條 -->
    <g transform="translate(${objStartX}, ${objY})">
      <rect x="0" y="0" width="${objWidth}" height="34" rx="8" fill="${obj.color}" stroke="#1E293B" stroke-width="2.5"/>
      <circle cx="0" cy="17" r="5" fill="#1E293B"/>
      <circle cx="${objWidth}" cy="17" r="5" fill="#1E293B"/>
      <text x="${Math.max(45, objWidth / 2)}" y="-10" font-size="14" font-weight="900" fill="#1E293B" text-anchor="middle">
        ${u3State.drawMm} mm (${Math.floor(u3State.drawMm / 10)} cm ${u3State.drawMm % 10} mm)
      </text>
    </g>

    <!-- 可拖拉透明直尺 -->
    <g id="draggableRuler" transform="translate(${u3State.rulerX}, ${u3State.rulerY})" style="cursor:grab;">
      <rect x="0" y="0" width="${100 * pxPerMm + 40}" height="82" rx="10" fill="rgba(254, 249, 195, 0.88)" stroke="#CA8A04" stroke-width="3"/>
      ${ticks}
      <text x="${50 * pxPerMm + 20}" y="70" font-size="13" font-weight="800" fill="#854D0E" text-anchor="middle">
        ✋ 拖拉這把公分毫米尺（將刻度 0 對齊左邊黑點）｜1小格 = 1毫米(mm)，10小格 = 1公分(cm)
      </text>
    </g>

    <!-- 對齊狀態提示 -->
    <rect x="24" y="272" width="850" height="36" rx="10" fill="${aligned ? '#DCFCE7' : '#FEF3C7'}"/>
    <text x="40" y="295" font-size="14" font-weight="900" fill="${aligned ? '#166534' : '#92400E'}">
      ${aligned ? `✅ 直尺刻度 0 已精準對齊起點！終點指在第 ${u3State.drawMm} 小格，也就是 ${Math.floor(u3State.drawMm / 10)} 公分 ${u3State.drawMm % 10} 毫米（${u3State.drawMm} 毫米）！` : '👉 請左右拖拉黃色直尺，讓直尺的「刻度 0」對齊物品最左邊的虛線！'}
    </text>
  `;
}

function initU3RulerDrag() {
  const arena = document.getElementById('u3RulerArena');
  arena.addEventListener('pointerdown', e => {
    const svg = document.getElementById('u3SvgCanvas');
    const pt = svg.createSVGPoint();
    pt.x = e.clientX;
    pt.y = e.clientY;
    const svgP = pt.matrixTransform(svg.getScreenCTM().inverse());
    if (
      svgP.x >= u3State.rulerX &&
      svgP.x <= u3State.rulerX + 740 &&
      svgP.y >= u3State.rulerY &&
      svgP.y <= u3State.rulerY + 85
    ) {
      u3State.dragging = true;
      u3State.dragOffsetX = svgP.x - u3State.rulerX;
      u3State.dragOffsetY = svgP.y - u3State.rulerY;
      arena.setPointerCapture(e.pointerId);
    }
  });

  arena.addEventListener('pointermove', e => {
    if (!u3State.dragging) return;
    const svg = document.getElementById('u3SvgCanvas');
    const pt = svg.createSVGPoint();
    pt.x = e.clientX;
    pt.y = e.clientY;
    const svgP = pt.matrixTransform(svg.getScreenCTM().inverse());
    u3State.rulerX = Math.max(10, Math.min(220, svgP.x - u3State.dragOffsetX));
    u3State.rulerY = Math.max(85, Math.min(185, svgP.y - u3State.dragOffsetY));
    renderU3RulerCanvas();
  });

  arena.addEventListener('pointerup', () => {
    if (u3State.dragging) {
      u3State.dragging = false;
      if (Math.abs((u3State.rulerX + 20) - 110) <= 12) {
        u3State.rulerX = 90; // 自動吸附對齊
        addStar(1);
        renderU3RulerCanvas();
      }
    }
  });
}

/* 3-B: 公分與毫米複名數計算與紙帶重疊 */
const u3Cases = [
  {
    title: '🧋 漂浮紅茶的高度：4 公分 9 毫米 ＋ 11 公分 5 毫米',
    step1: '先算毫米：9 毫米 ＋ 5 毫米 ＝ 14 毫米（滿 10 毫米換成 1 公分 4 毫米，向公分進 1！）',
    step2: '再算公分：1 ＋ 4 ＋ 11 ＝ 16 公分',
    ans: '16 公分 4 毫米（＝ 164 毫米）'
  },
  {
    title: '🌱 番茄苗長高了：原本高 4 公分 3 毫米，又長高 28 毫米',
    step1: '先換算單位：28 毫米 ＝ 2 公分 8 毫米',
    step2: '4 公分 3 毫米 ＋ 2 公分 8 毫米 ＝ 6 公分 11 毫米 ＝ 7 公分 1 毫米',
    ans: '7 公分 1 毫米（＝ 71 毫米）'
  },
  {
    title: '🎀 紅緞帶 (20公分6毫米) 比藍緞帶 (18公分8毫米) 長多少？',
    step1: '先算毫米：6 毫米減 8 毫米不夠減！把 20 公分借 1 公分換成 10 毫米 → 16 毫米 － 8 毫米 ＝ 8 毫米',
    step2: '再算公分：剩下的 19 公分 － 18 公分 ＝ 1 公分',
    ans: '1 公分 8 毫米（＝ 18 毫米）'
  }
];

function setU3CalcCase(idx) {
  playTone(523.25, 0.08);
  const c = u3Cases[idx];
  document.getElementById('u3CalcDisplay').innerHTML = `
    <h3 style="color:#1E3A8A; font-size:1.2rem; margin-bottom:0.6rem;">${c.title}</h3>
    <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(240px,1fr)); gap:0.75rem;">
      <div style="background:white; padding:0.9rem; border-radius:12px; border:2px solid #93C5FD;">
        <div style="font-weight:900; color:#1D4ED8;">步驟 1</div>
        <div style="font-weight:700; margin-top:0.25rem;">${c.step1}</div>
      </div>
      <div style="background:white; padding:0.9rem; border-radius:12px; border:2px solid #6EE7B7;">
        <div style="font-weight:900; color:#047857;">步驟 2</div>
        <div style="font-weight:700; margin-top:0.25rem;">${c.step2}</div>
      </div>
      <div style="background:#FEF3C7; padding:0.9rem; border-radius:12px; border:2px solid #F59E0B;">
        <div style="font-weight:900; color:#B45309;">最終答案</div>
        <div style="font-size:1.25rem; font-weight:900; color:#92400E; margin-top:0.25rem;">${c.ans}</div>
      </div>
    </div>
  `;
}

function updateOverlapStrip() {
  const overlap = parseInt(document.getElementById('overlapSlider').value, 10);
  const stripLen = 55; // 5cm 5mm
  const totalMm = stripLen * 2 - overlap;
  document.getElementById('overlapValLabel').textContent =
    overlap === 0 ? '0 毫米（頭尾接排不重疊）' : `重疊黏貼 ${overlap} 毫米`;

  const svg = document.getElementById('overlapSvg');
  const scale = 5.5;
  const startX = 60;
  const w1 = stripLen * scale;
  const ovW = overlap * scale;
  const x2 = startX + w1 - ovW;

  svg.innerHTML = `
    <!-- 第一條紙帶 -->
    <rect x="${startX}" y="28" width="${w1}" height="32" rx="4" fill="rgba(59, 130, 246, 0.75)" stroke="#1D4ED8" stroke-width="2"/>
    <text x="${startX + w1 / 2}" y="49" font-size="13" font-weight="900" fill="white" text-anchor="middle">紙帶 A (5公分5毫米 = 55mm)</text>
    <!-- 第二條紙帶 -->
    <rect x="${x2}" y="42" width="${w1}" height="32" rx="4" fill="rgba(245, 158, 11, 0.75)" stroke="#B45309" stroke-width="2"/>
    <text x="${x2 + w1 / 2}" y="63" font-size="13" font-weight="900" fill="white" text-anchor="middle">紙帶 B (5公分5毫米 = 55mm)</text>
    <!-- 重疊區標記 -->
    ${overlap > 0 ? `<rect x="${x2}" y="28" width="${ovW}" height="46" fill="rgba(220, 38, 38, 0.35)" stroke="#DC2626" stroke-width="2" stroke-dasharray="3,2"/>` : ''}
    <!-- 總長標示線 -->
    <line x1="${startX}" y1="95" x2="${x2 + w1}" y2="95" stroke="#0F172A" stroke-width="3"/>
    <text x="${(startX + x2 + w1) / 2}" y="114" font-size="14" font-weight="900" fill="#0F172A" text-anchor="middle">
      黏起來總長：${totalMm} 毫米（＝ ${Math.floor(totalMm / 10)} 公分 ${totalMm % 10} 毫米）
    </text>
  `;

  const fb = document.getElementById('overlapFeedback');
  if (overlap === 0) {
    fb.className = 'feedback-banner success';
    fb.innerHTML = `💡 當兩條紙帶<strong>頭尾接排（重疊 0 毫米）</strong>時：5 公分 5 毫米 ＋ 5 公分 5 毫米 ＝ <strong>11 公分 (110 毫米)</strong>！`;
  } else {
    fb.className = 'feedback-banner warning';
    fb.innerHTML = `💡 課本解答：因為中間有<strong>重疊黏貼在一起的地方（${overlap} 毫米）</strong>，所以總長是 110 － ${overlap} ＝ <strong>${totalMm} 毫米（${Math.floor(totalMm / 10)} 公分 ${totalMm % 10} 毫米）</strong>，會比 11 公分<strong>短</strong>！`;
  }
}

/* =========================================================
   第 4 單元：乘 法
   ========================================================= */
let u4State = {
  a: 36,
  b: 4,
  expandedMode: true
};

function loadU4Problem(a, b, story) {
  u4State.a = a;
  u4State.b = b;
  document.getElementById('u4InputA').value = a;
  document.getElementById('u4InputB').value = b;
  if (story) document.getElementById('u4StoryText').textContent = story;
  playTone(523.25, 0.08);
  renderU4Multiplication();
}

function customU4Problem() {
  const a = Math.min(999, Math.max(10, parseInt(document.getElementById('u4InputA').value, 10) || 36));
  const b = Math.min(9, Math.max(2, parseInt(document.getElementById('u4InputB').value, 10) || 4));
  u4State.a = a;
  u4State.b = b;
  renderU4Multiplication();
}

function toggleU4DetailMode() {
  u4State.expandedMode = !u4State.expandedMode;
  playTone(493.88, 0.08);
  renderU4Multiplication();
}

function renderU4Multiplication() {
  const { a, b, expandedMode } = u4State;
  const h = Math.floor(a / 100) % 10;
  const t = Math.floor(a / 10) % 10;
  const u = a % 10;

  const prodU = u * b;
  const prodT = t * 10 * b;
  const prodH = h * 100 * b;
  const total = a * b;

  const carryToT = Math.floor((u * b) / 10);
  const carryToH = Math.floor((t * b + carryToT) / 10);

  const renderBox = document.getElementById('u4VerticalRender');
  if (expandedMode) {
    renderBox.innerHTML = `
      <div style="background:white; padding:1rem; border-radius:12px; border:2px solid #CBD5E1; font-family:'Fredoka', sans-serif;">
        <div style="text-align:right; font-size:1.85rem; font-weight:900; letter-spacing:8px; padding-right:1rem;">${a}</div>
        <div style="text-align:right; font-size:1.85rem; font-weight:900; letter-spacing:8px; border-bottom:4px solid #1E293B; padding-right:1rem;">× &nbsp; ${b}</div>
        <div style="display:flex; justify-content:space-between; align-items:center; padding:0.35rem 1rem; color:#2563EB; font-weight:800;">
          <span style="font-size:0.9rem;">個位：${u} × ${b} ＝</span>
          <span style="font-size:1.6rem;">${prodU}</span>
        </div>
        <div style="display:flex; justify-content:space-between; align-items:center; padding:0.35rem 1rem; color:#059669; font-weight:800;">
          <span style="font-size:0.9rem;">十位：${t * 10} × ${b} ＝</span>
          <span style="font-size:1.6rem;">${prodT}</span>
        </div>
        ${h > 0 ? `
        <div style="display:flex; justify-content:space-between; align-items:center; padding:0.35rem 1rem; color:#D97706; font-weight:800;">
          <span style="font-size:0.9rem;">百位：${h * 100} × ${b} ＝</span>
          <span style="font-size:1.6rem;">${prodH}</span>
        </div>` : ''}
        <div style="display:flex; justify-content:space-between; align-items:center; padding:0.5rem 1rem; border-top:3px dashed #94A3B8; background:#FEF3C7; border-radius:8px; margin-top:0.3rem;">
          <span style="font-size:1rem; font-weight:900; color:#92400E;">合起來的積：</span>
          <span style="font-size:2rem; font-weight:900; color:#B91C1C;">${total}</span>
        </div>
      </div>
    `;
  } else {
    renderBox.innerHTML = `
      <div style="background:white; padding:1rem; border-radius:12px; border:2px solid #CBD5E1; font-family:'Fredoka', sans-serif;">
        <div style="display:flex; justify-content:flex-end; gap:1.5rem; padding-right:1.2rem; color:#DC2626; font-weight:900; font-size:1.1rem;">
          <span>${carryToH > 0 ? `+${carryToH}(百)` : ''}</span>
          <span>${carryToT > 0 ? `+${carryToT}(十)` : ''}</span>
          <span></span>
        </div>
        <div style="text-align:right; font-size:2rem; font-weight:900; letter-spacing:10px; padding-right:1rem;">${a}</div>
        <div style="text-align:right; font-size:2rem; font-weight:900; letter-spacing:10px; border-bottom:4px solid #1E293B; padding-right:1rem;">× &nbsp; ${b}</div>
        <div style="text-align:right; font-size:2.3rem; font-weight:900; letter-spacing:10px; color:#B91C1C; padding-right:1rem; margin-top:0.4rem;">${total}</div>
      </div>
    `;
  }

  // 右側位值陣列視覺化
  const arrayEl = document.getElementById('u4ArrayVisual');
  let rowsHtml = '';
  for (let r = 0; r < b; r++) {
    rowsHtml += `<div class="mul-blocks-row">
      <span style="font-weight:900; font-size:0.85rem; color:#64748B; min-width:48px;">第 ${r + 1} 倍</span>
      ${h > 0 ? `<span style="background:#FEF3C7; border:2px solid #F59E0B; padding:2px 8px; border-radius:8px; font-weight:900; color:#92400E;">100 × ${h}</span>` : ''}
      ${t > 0 ? `<span style="background:#D1FAE5; border:2px solid #10B981; padding:2px 8px; border-radius:8px; font-weight:900; color:#065F46;">10 × ${t}</span>` : `<span style="background:#F1F5F9; padding:2px 8px; border-radius:8px; color:#94A3B8; font-weight:800;">十位 0</span>`}
      <span style="background:#DBEAFE; border:2px solid #3B82F6; padding:2px 8px; border-radius:8px; font-weight:900; color:#1E40AF;">1 × ${u}</span>
      <span style="margin-left:auto; font-weight:900; color:#334155;">＝ ${a}</span>
    </div>`;
  }
  arrayEl.innerHTML = rowsHtml;
}

/* 4-B: 連乘兩步驟與倍數線段圖 */
function setU4TwoStepCase(idx) {
  playTone(523.25, 0.08);
  const box = document.getElementById('u4TwoStepContent');
  if (idx === 0) {
    box.innerHTML = `
      <div style="background:#F8FAFC; border:2px solid #CBD5E1; border-radius:16px; padding:1.25rem;">
        <h3 style="color:#1E3A8A; margin-bottom:0.75rem;">🎈 題目：一間教室外面布置 20 顆氣球，每層樓有 4 間教室，2 層樓總共布置幾顆氣球？</h3>
        <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(280px, 1fr)); gap:1rem;">
          <div style="background:white; border:3px solid #60A5FA; border-radius:14px; padding:1rem;">
            <div style="font-weight:900; color:#1D4ED8; font-size:1.1rem; margin-bottom:0.5rem;">👦 奇奇的做法（先算 1 層樓有幾顆）：</div>
            <p>① 先算 1 層樓（4 間教室）有幾顆氣球：<br/><strong>20 × 4 ＝ 80（顆）</strong></p>
            <p style="margin-top:0.4rem;">② 再算 2 層樓共有幾顆氣球：<br/><strong>80 × 2 ＝ 160（顆）</strong></p>
          </div>
          <div style="background:white; border:3px solid #34D399; border-radius:14px; padding:1rem;">
            <div style="font-weight:900; color:#047857; font-size:1.1rem; margin-bottom:0.5rem;">👧 妙妙的做法（先算共有幾間教室）：</div>
            <p>① 先算 2 層樓共有幾間教室：<br/><strong>4 × 2 ＝ 8（間）</strong></p>
            <p style="margin-top:0.4rem;">② 再算 8 間教室共有幾顆氣球：<br/><strong>20 × 8 ＝ 160（顆）</strong></p>
          </div>
        </div>
      </div>
    `;
  } else {
    box.innerHTML = `
      <div style="background:#F8FAFC; border:2px solid #CBD5E1; border-radius:16px; padding:1.25rem;">
        <h3 style="color:#1E3A8A; margin-bottom:0.75rem;">🧣 題目：一個髮夾 35 元，一個錢包是髮夾的 2 倍，一條圍巾是錢包的 3 倍，一條圍巾多少元？</h3>
        <svg viewBox="0 0 700 165" style="width:100%; height:auto; background:white; border-radius:12px; border:1px solid #CBD5E1; margin-bottom:1rem;">
          <text x="30" y="38" font-size="15" font-weight="900" fill="#334155">髮夾 (1倍)</text>
          <rect x="130" y="20" width="75" height="24" fill="#60A5FA" rx="4"/>
          <text x="167" y="37" font-size="13" font-weight="900" fill="white" text-anchor="middle">35 元</text>

          <text x="30" y="85" font-size="15" font-weight="900" fill="#334155">錢包 (2倍)</text>
          <rect x="130" y="67" width="75" height="24" fill="#34D399" stroke="white" stroke-width="2" rx="4"/>
          <rect x="205" y="67" width="75" height="24" fill="#34D399" stroke="white" stroke-width="2" rx="4"/>
          <text x="330" y="84" font-size="14" font-weight="900" fill="#047857">35 × 2 ＝ 70 元</text>

          <text x="30" y="135" font-size="15" font-weight="900" fill="#334155">圍巾 (6倍)</text>
          <rect x="130" y="117" width="150" height="24" fill="#F59E0B" stroke="white" stroke-width="2" rx="4"/>
          <rect x="280" y="117" width="150" height="24" fill="#F59E0B" stroke="white" stroke-width="2" rx="4"/>
          <rect x="430" y="117" width="150" height="24" fill="#F59E0B" stroke="white" stroke-width="2" rx="4"/>
          <text x="355" y="134" font-size="13" font-weight="900" fill="white" text-anchor="middle">錢包的 3 倍 ＝ 髮夾的 2×3＝6 倍 (210元)</text>
        </svg>
        <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(280px, 1fr)); gap:1rem;">
          <div style="background:white; border:2px solid #93C5FD; border-radius:12px; padding:0.9rem;">
            <strong>算法一（先算錢包多少元）：</strong><br/>
            35 × 2 ＝ 70（元），70 × 3 ＝ <strong>210（元）</strong>
          </div>
          <div style="background:white; border:2px solid #FCD34D; border-radius:12px; padding:0.9rem;">
            <strong>算法二（看線段圖先算圍巾是髮夾的幾倍）：</strong><br/>
            2 × 3 ＝ 6（倍），35 × 6 ＝ <strong>210（元）</strong>
          </div>
        </div>
      </div>
    `;
  }
}

/* 4-C: 錢帶得夠不夠？乘法估算 */
let u4CardQty = 5;
const u4ShopItems = [
  { person: '哥哥', money: 200, item: '🍬 軟糖', price: 29, estPrice: 30 },
  { person: '小傑', money: 300, item: '🍘 仙貝', price: 71, estPrice: 70 },
  { person: '婷婷', money: 400, item: '🦁 動物餅乾', price: 98, estPrice: 100 },
  { person: '軒軒', money: 200, item: '🧁 小泡芙', price: 39, estPrice: 40 }
];

function drawU4Card() {
  u4CardQty = Math.floor(Math.random() * 6) + 3; // 3..8
  playTone(587.33, 0.1);
  renderU4EstimationCards();
}

function renderU4EstimationCards() {
  const grid = document.getElementById('u4EstimationGrid');
  grid.innerHTML = u4ShopItems.map((it, idx) => {
    const estTotal = it.estPrice * u4CardQty;
    const realTotal = it.price * u4CardQty;
    const enough = it.money >= realTotal;
    return `
      <div style="background:#F8FAFC; border:2px solid #CBD5E1; border-radius:16px; padding:1rem;">
        <div style="font-weight:900; font-size:1.05rem; color:#1E3A8A;">${idx + 1}. ${it.person}帶了 <span style="color:#DC2626;">${it.money} 元</span></div>
        <div style="margin:0.4rem 0; font-weight:800;">想買 <strong>${u4CardQty} 盒</strong> ${it.item}（每盒 <strong>${it.price} 元</strong>）</div>
        <div style="font-size:0.9rem; color:#475569; background:white; padding:0.5rem; border-radius:8px; border:1px dashed #94A3B8; margin-bottom:0.65rem;">
          💡 估算提示：1 盒 ${it.price} 元大約是 <strong>${it.estPrice} 元</strong><br/>
          ${it.estPrice} × ${u4CardQty} ＝ <strong>大約 ${estTotal} 元</strong>
        </div>
        <div style="display:flex; gap:0.5rem;">
          <button class="btn btn-outline" style="flex:1; justify-content:center;" onclick="checkU4Enough(${idx}, true)">⭕ 錢夠</button>
          <button class="btn btn-outline" style="flex:1; justify-content:center;" onclick="checkU4Enough(${idx}, false)">❌ 不夠</button>
        </div>
        <div id="u4EstAns${idx}" style="margin-top:0.5rem; font-size:0.9rem; font-weight:800;"></div>
      </div>
    `;
  }).join('');
}

function checkU4Enough(idx, userChoice) {
  const it = u4ShopItems[idx];
  const realTotal = it.price * u4CardQty;
  const enough = it.money >= realTotal;
  const ansEl = document.getElementById(`u4EstAns${idx}`);
  if (userChoice === enough) {
    addStar(1);
    ansEl.style.color = '#059669';
    ansEl.innerHTML = `✅ 答對了！估算約 ${it.estPrice * u4CardQty} 元（實際 ${realTotal} 元），帶 ${it.money} 元<strong>${enough ? '夠買' : '不夠買'}</strong>！`;
  } else {
    playTone(261.63, 0.15, 'sawtooth');
    ansEl.style.color = '#DC2626';
    ansEl.innerHTML = `🤔 再想一下：${it.estPrice} × ${u4CardQty} ＝ ${it.estPrice * u4CardQty} 元，帶 ${it.money} 元是<strong>${enough ? '夠的' : '不夠的'}</strong>喔！`;
  }
}

/* =========================================================
   第 5 單元：角與形狀
   ========================================================= */
function setFanAngle(deg) {
  document.getElementById('fanAngleSlider').value = deg;
  playTone(523.25, 0.08);
  updateFanVisual();
}

function updateFanVisual() {
  const deg = parseInt(document.getElementById('fanAngleSlider').value, 10);
  const armLen = parseInt(document.getElementById('fanArmSlider').value, 10);
  const rot = parseInt(document.getElementById('fanRotSlider').value, 10);

  document.getElementById('fanDegText').textContent = `${deg}°`;
  const badge = document.getElementById('angleTypeBadge');
  if (deg === 90) {
    badge.className = 'angle-badge angle-right';
    badge.textContent = '直角（剛好 90° ∟）';
  } else if (deg < 90) {
    badge.className = 'angle-badge angle-acute';
    badge.textContent = '銳角（比直角小）';
  } else {
    badge.className = 'angle-badge angle-obtuse';
    badge.textContent = '鈍角（比直角大）';
  }

  const cx = 210, cy = 220;
  const rad = (deg * Math.PI) / 180;
  const x2 = cx + armLen * Math.cos(-rad);
  const y2 = cy + armLen * Math.sin(-rad);
  const x1 = cx + armLen;
  const y1 = cy;

  // 扇骨線條
  let ribs = '';
  const ribSteps = Math.max(3, Math.floor(deg / 15));
  for (let i = 1; i < ribSteps; i++) {
    const rAngle = (deg * (i / ribSteps) * Math.PI) / 180;
    const rx = cx + (armLen - 8) * Math.cos(-rAngle);
    const ry = cy + (armLen - 8) * Math.sin(-rAngle);
    ribs += `<line x1="${cx}" y1="${cy}" x2="${rx}" y2="${ry}" stroke="rgba(245, 158, 11, 0.45)" stroke-width="2"/>`;
  }

  const arcR = 45;
  const ax2 = cx + arcR * Math.cos(-rad);
  const ay2 = cy + arcR * Math.sin(-rad);
  const largeArc = deg > 180 ? 1 : 0;

  const svg = document.getElementById('fanSvg');
  svg.innerHTML = `
    <g transform="rotate(${rot}, ${cx}, ${cy})">
      <!-- 90度標準直角虛線參考 -->
      <line x1="${cx}" y1="${cy}" x2="${cx}" y2="${cy - 140}" stroke="#94A3B8" stroke-width="2" stroke-dasharray="5,5"/>
      <text x="${cx + 8}" y="${cy - 125}" font-size="12" font-weight="800" fill="#64748B">90°直角參考線</text>

      <!-- 扇面區域 -->
      <path d="M ${cx} ${cy} L ${x1} ${y1} A ${armLen} ${armLen} 0 ${largeArc} 0 ${x2} ${y2} Z" fill="rgba(254, 243, 199, 0.75)" stroke="#F59E0B" stroke-width="2"/>
      ${ribs}

      <!-- 直角符號或弧線記號 -->
      ${deg === 90
        ? `<polyline points="${cx + 26},${cy} ${cx + 26},${cy - 26} ${cx},${cy - 26}" fill="none" stroke="#DC2626" stroke-width="3.5"/>`
        : `<path d="M ${cx + arcR} ${cy} A ${arcR} ${arcR} 0 ${largeArc} 0 ${ax2} ${ay2}" fill="none" stroke="#2563EB" stroke-width="3.5"/>`
      }

      <!-- 兩條直線邊 -->
      <line x1="${cx}" y1="${cy}" x2="${x1}" y2="${y1}" stroke="#1E3A8A" stroke-width="5" stroke-linecap="round"/>
      <line x1="${cx}" y1="${cy}" x2="${x2}" y2="${y2}" stroke="#1E3A8A" stroke-width="5" stroke-linecap="round"/>

      <!-- 頂點 -->
      <circle cx="${cx}" cy="${cy}" r="7" fill="#DC2626" stroke="white" stroke-width="2"/>
      <text x="${cx - 18}" y="${cy + 24}" font-size="14" font-weight="900" fill="#DC2626">頂點</text>
      <text x="${cx + armLen / 2}" y="${cy + 22}" font-size="13" font-weight="900" fill="#1E3A8A" text-anchor="middle">邊</text>
    </g>
  `;
}

/* 5-B: 拖拉三角板比對小房子圖形中的 6 個角 */
let sqState = {
  x: 520,
  y: 260,
  rot: 0,
  dragging: false,
  offsetX: 0,
  offsetY: 0
};

const houseAngles = {
  1: { x: 160, y: 170, rot: 0, name: '∠1 (屋簷左角)', type: '鈍角（比三角板的直角大）' },
  2: { x: 160, y: 320, rot: 0, name: '∠2 (左下牆角)', type: '直角 ∟（跟三角板的直角完全疊合！）' },
  3: { x: 360, y: 170, rot: -90, name: '∠3 (屋簷右角)', type: '銳角（比三角板的直角小）' },
  4: { x: 330, y: 95, rot: 90, name: '∠4 (煙囪右上角)', type: '銳角（比三角板的直角小）' },
  5: { x: 290, y: 75, rot: 0, name: '∠5 (煙囪左上角)', type: '鈍角（比三角板的直角大）' },
  6: { x: 260, y: 80, rot: 135, name: '∠6 (屋頂尖端角)', type: '鈍角（比三角板的直角大）' }
};

function rotateSetSquare(delta) {
  sqState.rot = (sqState.rot + delta) % 360;
  playTone(493.88, 0.06);
  renderHouseAngleBoard();
}

function resetSetSquare() {
  sqState.x = 520;
  sqState.y = 260;
  sqState.rot = 0;
  playTone(440, 0.08);
  renderHouseAngleBoard();
}

function snapSquareToHouseAngle(id) {
  const target = houseAngles[id];
  sqState.x = target.x;
  sqState.y = target.y;
  sqState.rot = target.rot;
  addStar(1);
  renderHouseAngleBoard();
  const fb = document.getElementById('u5HouseFeedback');
  fb.className = 'feedback-banner success';
  fb.innerHTML = `📐 已將三角板的直角頂點對齊 <strong>${target.name}</strong>：它是 <strong>${target.type}</strong>！`;
}

function renderHouseAngleBoard() {
  const svg = document.getElementById('u5HouseSvg');
  svg.innerHTML = `
    <!-- 課本小房子幾何圖形 -->
    <g stroke="#1E293B" stroke-width="4" fill="#F8FAFC" stroke-linejoin="round">
      <!-- 煙囪 -->
      <polygon points="290,115 290,75 330,95 330,138" fill="#FEE2E2"/>
      <!-- 房子主體 -->
      <polygon points="160,320 360,320 360,170 260,80 160,170" fill="#EFF6FF"/>
    </g>

    <!-- 直角記號 ∠2 -->
    <polyline points="160,298 182,298 182,320" fill="none" stroke="#DC2626" stroke-width="3"/>

    <!-- ∠1 ~ ∠6 標籤 -->
    <text x="175" y="185" font-size="16" font-weight="900" fill="#B45309">∠1</text>
    <text x="188" y="312" font-size="16" font-weight="900" fill="#DC2626">∠2</text>
    <text x="325" y="172" font-size="16" font-weight="900" fill="#15803D">∠3</text>
    <text x="305" y="108" font-size="15" font-weight="900" fill="#15803D">∠4</text>
    <text x="295" y="94" font-size="15" font-weight="900" fill="#B45309">∠5</text>
    <text x="248" y="108" font-size="16" font-weight="900" fill="#B45309">∠6</text>

    <!-- 可拖拉旋轉透明三角板 (直角頂點在 (0,0)) -->
    <g transform="translate(${sqState.x}, ${sqState.y}) rotate(${sqState.rot})" style="cursor:grab;">
      <polygon points="0,0 155,0 0,-155" fill="rgba(52, 211, 153, 0.55)" stroke="#047857" stroke-width="3"/>
      <polygon points="28,-28 85,-28 28,-85" fill="rgba(255,255,255,0.65)" stroke="#047857" stroke-width="1.5"/>
      <!-- 三角板上的直角記號 -->
      <polyline points="0,-22 22,-22 22,0" fill="none" stroke="#DC2626" stroke-width="3"/>
      <circle cx="0" cy="0" r="6" fill="#DC2626"/>
      <text x="48" y="-8" font-size="12" font-weight="900" fill="#064E3B">✋ 拖拉三角板 (紅點為直角)</text>
    </g>
  `;
}

function initU5SetSquareDrag() {
  const board = document.getElementById('u5HouseBoard');
  board.addEventListener('pointerdown', e => {
    const svg = document.getElementById('u5HouseSvg');
    const pt = svg.createSVGPoint();
    pt.x = e.clientX;
    pt.y = e.clientY;
    const svgP = pt.matrixTransform(svg.getScreenCTM().inverse());
    if (Math.hypot(svgP.x - sqState.x, svgP.y - sqState.y) < 160) {
      sqState.dragging = true;
      sqState.offsetX = svgP.x - sqState.x;
      sqState.offsetY = svgP.y - sqState.y;
      board.setPointerCapture(e.pointerId);
    }
  });

  board.addEventListener('pointermove', e => {
    if (!sqState.dragging) return;
    const svg = document.getElementById('u5HouseSvg');
    const pt = svg.createSVGPoint();
    pt.x = e.clientX;
    pt.y = e.clientY;
    const svgP = pt.matrixTransform(svg.getScreenCTM().inverse());
    sqState.x = Math.max(40, Math.min(800, svgP.x - sqState.offsetX));
    sqState.y = Math.max(40, Math.min(360, svgP.y - sqState.offsetY));
    renderHouseAngleBoard();
  });

  board.addEventListener('pointerup', () => {
    sqState.dragging = false;
  });
}

/* 5-C: 方格紙畫正方形與長方形 */
let gridState = {
  mission: 'sq3',
  pts: [
    { gx: 3, gy: 2 },
    { gx: 6, gy: 2 },
    { gx: 6, gy: 5 },
    { gx: 3, gy: 5 }
  ],
  activeIdx: -1
};

function setGridTarget(code, title) {
  gridState.mission = code;
  document.getElementById('u5GridMissionTitle').textContent = `🎯 當前挑戰：${title}`;
  if (code === 'sq3') {
    gridState.pts = [{ gx: 2, gy: 2 }, { gx: 5, gy: 2 }, { gx: 5, gy: 5 }, { gx: 2, gy: 5 }];
  } else if (code === 'sq4') {
    gridState.pts = [{ gx: 2, gy: 1 }, { gx: 6, gy: 1 }, { gx: 6, gy: 5 }, { gx: 2, gy: 5 }];
  } else if (code === 'rect53') {
    gridState.pts = [{ gx: 2, gy: 2 }, { gx: 7, gy: 2 }, { gx: 7, gy: 5 }, { gx: 2, gy: 5 }];
  }
  playTone(523.25, 0.08);
  renderGridPolygon();
}

function setDiamondChallenge() {
  gridState.mission = 'diamond';
  document.getElementById('u5GridMissionTitle').textContent =
    '💎 課本動動腦：4 條邊一樣長（都是 5 公分），但 4 個角不是直角，它是正方形嗎？';
  gridState.pts = [{ gx: 5, gy: 1 }, { gx: 9, gy: 4 }, { gx: 5, gy: 7 }, { gx: 1, gy: 4 }];
  playTone(587.33, 0.1);
  renderGridPolygon();
}

function distGrid(p1, p2) {
  return Math.hypot(p2.gx - p1.gx, p2.gy - p1.gy);
}

function isRightAngle(prev, cur, next) {
  const v1x = prev.gx - cur.gx;
  const v1y = prev.gy - cur.gy;
  const v2x = next.gx - cur.gx;
  const v2y = next.gy - cur.gy;
  return v1x * v2x + v1y * v2y === 0 && (v1x !== 0 || v1y !== 0) && (v2x !== 0 || v2y !== 0);
}

function renderGridPolygon() {
  const svg = document.getElementById('u5GridSvg');
  const cell = 40;
  const ox = 40, oy = 20;
  const cols = 12, rows = 8;

  let gridLines = '';
  for (let c = 0; c <= cols; c++) {
    gridLines += `<line x1="${ox + c * cell}" y1="${oy}" x2="${ox + c * cell}" y2="${oy + rows * cell}" stroke="#CBD5E1" stroke-width="1.5"/>`;
  }
  for (let r = 0; r <= rows; r++) {
    gridLines += `<line x1="${ox}" y1="${oy + r * cell}" x2="${ox + cols * cell}" y2="${oy + r * cell}" stroke="#CBD5E1" stroke-width="1.5"/>`;
  }

  const pts = gridState.pts;
  const screenPts = pts.map(p => ({ x: ox + p.gx * cell, y: oy + p.gy * cell }));
  const polyStr = screenPts.map(p => `${p.x},${p.y}`).join(' ');

  const sideLens = [0, 1, 2, 3].map(i => distGrid(pts[i], pts[(i + 1) % 4]));
  const rightFlags = [0, 1, 2, 3].map(i => isRightAngle(pts[(i + 3) % 4], pts[i], pts[(i + 1) % 4]));
  const allRight = rightFlags.every(Boolean);
  const allSidesEqual = sideLens.every(l => Math.abs(l - sideLens[0]) < 0.01);
  const oppSidesEqual = Math.abs(sideLens[0] - sideLens[2]) < 0.01 && Math.abs(sideLens[1] - sideLens[3]) < 0.01;

  // 邊長文字
  let sideLabels = '';
  for (let i = 0; i < 4; i++) {
    const p1 = screenPts[i];
    const p2 = screenPts[(i + 1) % 4];
    const mx = (p1.x + p2.x) / 2;
    const my = (p1.y + p2.y) / 2;
    const lenStr = Number.isInteger(sideLens[i]) ? `${sideLens[i]} cm` : `${sideLens[i].toFixed(1)} cm`;
    sideLabels += `
      <rect x="${mx - 24}" y="${my - 11}" width="48" height="22" rx="6" fill="white" stroke="#64748B"/>
      <text x="${mx}" y="${my + 5}" font-size="12" font-weight="900" fill="#0F172A" text-anchor="middle">${lenStr}</text>
    `;
  }

  // 頂點控制點
  let handles = '';
  screenPts.forEach((sp, i) => {
    handles += `
      <circle cx="${sp.x}" cy="${sp.y}" r="11" fill="${rightFlags[i] ? '#10B981' : '#3B82F6'}" stroke="white" stroke-width="3" style="cursor:grab;"/>
      <text x="${sp.x}" y="${sp.y - 15}" font-size="12" font-weight="900" fill="${rightFlags[i] ? '#047857' : '#1D4ED8'}" text-anchor="middle">
        ${rightFlags[i] ? '直角∟' : '非直角'}
      </text>
    `;
  });

  svg.innerHTML = `
    ${gridLines}
    <text x="${ox + 8}" y="${oy + 22}" font-size="13" font-weight="800" fill="#64748B">1格 ＝ 1公分 (cm)</text>
    <polygon points="${polyStr}" fill="${allRight ? 'rgba(59, 130, 246, 0.22)' : 'rgba(245, 158, 11, 0.22)'}" stroke="#1E3A8A" stroke-width="3.5"/>
    ${sideLabels}
    ${handles}
  `;

  const fb = document.getElementById('u5GridFeedback');
  if (allRight && allSidesEqual) {
    fb.className = 'feedback-banner success';
    fb.innerHTML = `✅ 這是一個<strong>正方形</strong>！因為它的 <strong>4 條邊都等長（都是 ${sideLens[0]} 公分）</strong>，而且 <strong>4 個角都是直角 ∟</strong>！`;
  } else if (allRight && oppSidesEqual) {
    fb.className = 'feedback-banner success';
    fb.innerHTML = `✅ 這是一個<strong>長方形</strong>！因為它的<strong>上、下對邊等長，左、右對邊等長（${sideLens[0]}cm 與 ${sideLens[1]}cm）</strong>，且 <strong>4 個角都是直角 ∟</strong>！`;
  } else if (!allRight && allSidesEqual) {
    fb.className = 'feedback-banner warning';
    fb.innerHTML = `💡 課本動動腦解答：雖然這 4 條邊都一樣長（${sideLens[0].toFixed(0)} 公分），但它的 <strong>4 個角不是直角</strong>，所以<strong>不是正方形</strong>喔！`;
  } else {
    fb.className = 'feedback-banner';
    fb.innerHTML = `👆 繼續拖拉方格紙上的頂點，讓 4 個角都變成「直角 ∟」吧！`;
  }
}

function initU5GridDrag() {
  const svg = document.getElementById('u5GridSvg');
  const cell = 40, ox = 40, oy = 20;

  svg.addEventListener('pointerdown', e => {
    const pt = svg.createSVGPoint();
    pt.x = e.clientX;
    pt.y = e.clientY;
    const svgP = pt.matrixTransform(svg.getScreenCTM().inverse());
    gridState.pts.forEach((p, idx) => {
      const sx = ox + p.gx * cell;
      const sy = oy + p.gy * cell;
      if (Math.hypot(svgP.x - sx, svgP.y - sy) < 22) {
        gridState.activeIdx = idx;
        svg.setPointerCapture(e.pointerId);
      }
    });
  });

  svg.addEventListener('pointermove', e => {
    if (gridState.activeIdx < 0) return;
    const pt = svg.createSVGPoint();
    pt.x = e.clientX;
    pt.y = e.clientY;
    const svgP = pt.matrixTransform(svg.getScreenCTM().inverse());
    const gx = Math.max(0, Math.min(12, Math.round((svgP.x - ox) / cell)));
    const gy = Math.max(0, Math.min(8, Math.round((svgP.y - oy) / cell)));
    const cur = gridState.pts[gridState.activeIdx];
    if (cur.gx !== gx || cur.gy !== gy) {
      cur.gx = gx;
      cur.gy = gy;
      playTone(659.25, 0.04);
      renderGridPolygon();
    }
  });

  svg.addEventListener('pointerup', () => {
    if (gridState.activeIdx >= 0) {
      gridState.activeIdx = -1;
    }
  });
}

/* =========================================================
   第 6 單元：面 積（平方公分 cm²）
   ========================================================= */
let u6State = {
  brush: 'full', // 'full' | 'half-tl' | 'half-tr' | 'empty'
  cells: Array(60).fill('empty'),
  estCaseIdx: 0,
  showOuterBound: false
};

function setU6Brush(b) {
  u6State.brush = b;
  playTone(493.88, 0.06);
  document.getElementById('u6BrushFull').className = b === 'full' ? 'btn btn-primary' : 'btn btn-outline';
  document.getElementById('u6BrushHalfTL').className = b === 'half-tl' ? 'btn btn-primary' : 'btn btn-outline';
  document.getElementById('u6BrushHalfTR').className = b === 'half-tr' ? 'btn btn-primary' : 'btn btn-outline';
  document.getElementById('u6BrushErase').className = b === 'empty' ? 'btn btn-primary' : 'btn btn-outline';
}

function clearU6Grid() {
  u6State.cells.fill('empty');
  playTone(330, 0.08);
  renderU6Grid();
}

function loadU6Preset(name) {
  u6State.cells.fill('empty');
  const setCell = (r, c, val = 'full') => {
    u6State.cells[r * 10 + c] = val;
  };
  if (name === 'card15') {
    for (let r = 1; r <= 3; r++) {
      for (let c = 2; c <= 6; c++) setCell(r, c, 'full');
    }
  } else if (name === 'cross13') {
    setCell(0, 4);
    for (let c = 3; c <= 5; c++) setCell(1, c);
    for (let c = 2; c <= 6; c++) setCell(2, c);
    for (let c = 3; c <= 5; c++) setCell(3, c);
    setCell(4, 4);
  } else if (name === 'boat') {
    // 3整格 + 2半格 = 4 cm²
    setCell(2, 3, 'half-tr');
    setCell(2, 4, 'full');
    setCell(2, 5, 'full');
    setCell(2, 6, 'half-tl');
    setCell(3, 4, 'full');
  } else if (name === 'heart') {
    // 課本愛心ㄇ：4整格 + 4半格 = 6 cm²
    setCell(1, 3, 'half-tr');
    setCell(1, 4, 'half-tl');
    setCell(1, 5, 'half-tr');
    setCell(1, 6, 'half-tl');
    setCell(2, 3, 'full');
    setCell(2, 4, 'full');
    setCell(2, 5, 'full');
    setCell(2, 6, 'full');
  }
  playTone(587.33, 0.09);
  renderU6Grid();
}

function clickU6Cell(idx) {
  if (u6State.cells[idx] === u6State.brush) {
    u6State.cells[idx] = 'empty';
  } else {
    u6State.cells[idx] = u6State.brush;
  }
  playTone(523.25, 0.05);
  renderU6Grid();
}

function renderU6Grid() {
  const board = document.getElementById('u6GridBoard');
  let fullCount = 0;
  let halfCount = 0;

  board.innerHTML = u6State.cells.map((st, idx) => {
    if (st === 'full') fullCount++;
    else if (st.startsWith('half')) halfCount++;
    return `<div class="cm2-cell ${st}" onclick="clickU6Cell(${idx})">${st === 'full' ? '1cm²' : ''}</div>`;
  }).join('');

  const totalArea = fullCount + halfCount * 0.5;
  document.getElementById('u6AreaBadge').textContent = `目前面積：${totalArea} 平方公分 (${totalArea} cm²)`;
  document.getElementById('u6Feedback').innerHTML =
    `🟦 完整方格有 <strong>${fullCount} 格</strong>（${fullCount} cm²），📐 半格有 <strong>${halfCount} 個</strong>（可湊成 <strong>${halfCount * 0.5} 個整格</strong>），合起來總面積 ＝ <strong>${totalArea} 平方公分 (cm²)</strong>！`;
}

function setU6EstCase(idx) {
  u6State.estCaseIdx = idx;
  playTone(523.25, 0.08);
  renderU6LeafEst();
}

function toggleU6BoundHighlight() {
  u6State.showOuterBound = !u6State.showOuterBound;
  playTone(587.33, 0.08);
  renderU6LeafEst();
}

function renderU6LeafEst() {
  const svg = document.getElementById('u6LeafSvg');
  const cell = 38, ox = 35, oy = 25;
  const cols = 8, rows = 6;

  let rects = '';
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      let isInner = false;
      let isOuter = false;
      if (u6State.estCaseIdx === 0) {
        // 妙妙的圖案：內部 4x3=12格 (c:2..5, r:1..3)，外部 6x5=30格 (c:1..6, r:0..4)
        isInner = c >= 2 && c <= 5 && r >= 1 && r <= 3;
        isOuter = c >= 1 && c <= 6 && r >= 0 && r <= 4;
      } else {
        // 課本樹葉：內部完整 6 格 (c:3..4, r:1..3)，外部含不完整共 18 格
        isInner = c >= 2 && c <= 4 && r >= 2 && r <= 3;
        isOuter = c >= 1 && c <= 5 && r >= 1 && r <= 4;
      }
      let fill = 'white';
      if (!u6State.showOuterBound && isInner) fill = 'rgba(59, 130, 246, 0.35)';
      if (u6State.showOuterBound && isOuter) fill = 'rgba(245, 158, 11, 0.32)';
      rects += `<rect x="${ox + c * cell}" y="${oy + r * cell}" width="${cell}" height="${cell}" fill="${fill}" stroke="#94A3B8" stroke-width="1.5"/>`;
    }
  }

  const shapeSvg = u6State.estCaseIdx === 0
    ? `<ellipse cx="${ox + 4 * cell}" cy="${oy + 2.5 * cell}" rx="${2.85 * cell}" ry="${2.35 * cell}" fill="rgba(16, 185, 129, 0.35)" stroke="#047857" stroke-width="3.5"/>`
    : `<path d="M ${ox + 1.2 * cell} ${oy + 3.8 * cell} Q ${ox + 2.5 * cell} ${oy + 0.8 * cell} ${ox + 5.8 * cell} ${oy + 1.3 * cell} Q ${ox + 4.8 * cell} ${oy + 4.8 * cell} ${ox + 1.2 * cell} ${oy + 3.8 * cell} Z" fill="rgba(16, 185, 129, 0.45)" stroke="#065F46" stroke-width="3.5"/>`;

  svg.innerHTML = `
    ${rects}
    ${shapeSvg}
    <text x="210" y="282" font-size="14" font-weight="900" fill="#1E293B" text-anchor="middle">
      ${u6State.showOuterBound ? '🔶 橘色：能完整包住圖案的外圍方格' : '🟦 藍色：完全在圖案內部的完整方格'}
    </text>
  `;

  if (u6State.estCaseIdx === 0) {
    document.getElementById('u6EstTitle').textContent = '☁️ 課本例題：妙妙的不規則圖案面積';
    document.getElementById('u6EstDesc').innerHTML = `
      1️⃣ <strong>先數內部完整的 1 平方公分（藍格）</strong>：一排有 4 格、共 3 排，4 × 3 ＝ <strong>12 平方公分</strong>，所以圖案面積<strong>比 12 平方公分大</strong>。<br/>
      2️⃣ <strong>再看包住圖案的大長方形（橘格）</strong>：一排有 6 格、共 5 排，6 × 5 ＝ <strong>30 平方公分</strong>，所以圖案面積<strong>比 30 平方公分小</strong>！
    `;
  } else {
    document.getElementById('u6EstTitle').textContent = '🍃 課本動動腦：樹葉在平方公分板上的面積範圍';
    document.getElementById('u6EstDesc').innerHTML = `
      1️⃣ <strong>完全在樹葉內的完整方格（藍格）</strong>：共有 <strong>6 格</strong>（6 平方公分）。<br/>
      2️⃣ <strong>加上不完整的邊緣方格（橘格）</strong>：共有 <strong>20 格</strong>（20 平方公分）。<br/>
      👉 因此這片樹葉的面積<strong>大於 6 平方公分、小於 20 平方公分</strong>（大約 12～14 平方公分）！
    `;
  }
}

function checkCardEst(val) {
  const ans = document.getElementById('u6CardEstAns');
  if (val === 50) {
    addStar(1);
    ans.style.color = '#059669';
    ans.innerHTML = '✅ 答對了！健保卡大約長 8.5 公分、寬 5.4 公分，面積大約是 50 平方公分！';
  } else {
    playTone(261.63, 0.15, 'sawtooth');
    ans.style.color = '#DC2626';
    ans.innerHTML = '🤔 想一想：1 個大拇指指甲約 1 平方公分，健保卡大約可以排滿近 50 個指甲，所以是 50 平方公分喔！';
  }
}

/* =========================================================
   第 7 單元：除 法
   ========================================================= */
let u7Emoji = '🍓';

function setU7Visual(dividend, divisor, emoji) {
  u7Emoji = emoji || '🍓';
  document.getElementById('u7DividendSlider').value = dividend;
  document.getElementById('u7DivisorSlider').value = divisor;
  playTone(523.25, 0.08);
  updateU7Visual();
}

function updateU7Visual() {
  const dividend = parseInt(document.getElementById('u7DividendSlider').value, 10);
  const divisor = parseInt(document.getElementById('u7DivisorSlider').value, 10);
  const quotient = Math.floor(dividend / divisor);
  const remainder = dividend % divisor;

  document.getElementById('u7DividendLabel').textContent = dividend;
  document.getElementById('u7DivisorLabel').textContent = divisor;

  const container = document.getElementById('u7PlatesContainer');
  let html = '';
  for (let p = 0; p < quotient; p++) {
    html += `
      <div class="div-plate">
        <div style="font-size:0.8rem; font-weight:900; color:#B45309;">第 ${p + 1} 盤 (${divisor}個)</div>
        <div class="div-plate-items">${u7Emoji.repeat(divisor)}</div>
      </div>
    `;
  }
  if (remainder > 0) {
    html += `
      <div class="div-plate" style="background:#FEF2F2; border-color:#EF4444;">
        <div style="font-size:0.8rem; font-weight:900; color:#DC2626;">剩下的（餘數 ${remainder}）</div>
        <div class="div-plate-items">${u7Emoji.repeat(remainder)}</div>
      </div>
    `;
  }
  container.innerHTML = html;

  document.getElementById('u7EquationBox').innerHTML = `
    <div>
      <div style="font-size:0.9rem; font-weight:800; color:#4338CA;">除法算式紀錄：</div>
      <div class="readout-number">${dividend} ÷ ${divisor} ＝ ${quotient}${remainder > 0 ? ` … ${remainder}` : '（整除）'}</div>
    </div>
    <div style="font-size:0.95rem; font-weight:800; color:#1E293B; background:white; padding:0.6rem 1rem; border-radius:12px; border:2px solid #C7D2FE;">
      被除數 <strong>${dividend}</strong> ｜ 除數 <strong>${divisor}</strong> ｜ 商 <strong>${quotient}</strong> ｜ 餘數 <strong>${remainder}</strong>（餘數 ${remainder} ＜ 除數 ${divisor}）
    </div>
  `;
}

function renderU7Vertical() {
  const a = Math.min(89, Math.max(6, parseInt(document.getElementById('u7VertA').value, 10) || 29));
  const b = Math.min(9, Math.max(2, parseInt(document.getElementById('u7VertB').value, 10) || 6));
  const q = Math.floor(a / b);
  const prod = b * q;
  const rem = a - prod;

  document.getElementById('u7VerticalBox').innerHTML = `
    <div style="background:white; padding:1.25rem; border-radius:14px; border:2px solid #CBD5E1; font-family:'Fredoka', sans-serif; max-width:320px; margin:0 auto;">
      <div style="text-align:right; font-size:2rem; font-weight:900; color:#1D4ED8; padding-right:1.5rem;">${q} <span style="font-size:0.9rem; color:#64748B;">← 商</span></div>
      <div style="display:flex; align-items:center; justify-content:flex-end; font-size:2rem; font-weight:900; border-top:4px solid #1E293B; padding-top:0.2rem; margin-left:3rem; padding-right:1.5rem;">
        <span style="margin-right:auto; margin-left:-2.2rem; border-right:4px solid #1E293B; padding-right:0.5rem;">${b}</span>
        <span>${a}</span>
      </div>
      <div style="text-align:right; font-size:2rem; font-weight:900; color:#059669; border-bottom:4px solid #1E293B; padding-right:1.5rem;">
        － &nbsp; ${prod} <span style="font-size:0.85rem; color:#64748B;">(${b}×${q})</span>
      </div>
      <div style="text-align:right; font-size:2.1rem; font-weight:900; color:#DC2626; padding-right:1.5rem; margin-top:0.25rem;">
        ${rem} <span style="font-size:0.9rem;">← 餘數 (${rem}＜${b})</span>
      </div>
    </div>
  `;
}

function checkU7RemainderQuiz(isMiaomiao) {
  const fb = document.getElementById('u7QuizFeedback');
  if (isMiaomiao) {
    addStar(1);
    fb.className = 'feedback-banner success';
    fb.innerHTML = '✅ 答對了！妙妙說得對！因為奇奇剩下的 10 公分比 8 公分大，還可以再剪成 1 段！<strong>餘數一定要比除數小（2 ＜ 8）</strong>！';
  } else {
    playTone(261.63, 0.15, 'sawtooth');
    fb.className = 'feedback-banner warning';
    fb.innerHTML = '🤔 想想看：奇奇剩下 10 公分，但每 8 公分就能再剪 1 段，10 公分還夠不夠再剪 1 段呢？餘數不能大於或等於除數喔！';
  }
}

const u7WordProblems = [
  {
    title: '🧁 1. 王媽媽裝點心（商數不用加 1）',
    story: '王媽媽做了 32 個點心，每 6 個裝滿一盒，最多可以裝滿幾盒？',
    eq: '32 ÷ 6 ＝ 5（盒）… 2（個）',
    needPlusOne: false,
    ans: 5,
    explain: '剩下的 2 個點心不夠裝滿 1 盒，所以最多只能裝滿 5 盒（商數不用加 1）！'
  },
  {
    title: '🦢 2. 坐天鵝船遊湖（商數要加 1）',
    story: '有 34 個小朋友要坐天鵝船，一艘天鵝船可以坐 4 個人，最少需要幾艘天鵝船才夠全部的人坐？',
    eq: '34 ÷ 4 ＝ 8（艘）… 2（人）',
    needPlusOne: true,
    ans: 9,
    explain: '剩下的 2 個小朋友也需要坐 1 艘天鵝船，所以 8 ＋ 1 ＝ 9，最少需要 9 艘船（商數要加 1）！'
  },
  {
    title: '🍮 3. 老師請吃布丁（商數要加 1）',
    story: '老師請 46 個小朋友吃布丁，一人吃 1 個。一盒布丁有 6 個，老師最少要買幾盒布丁才夠分？',
    eq: '46 ÷ 6 ＝ 7（盒）… 4（個）',
    needPlusOne: true,
    ans: 8,
    explain: '買 7 盒只有 42 個布丁，還差 4 個不夠分，必須再買 1 盒：7 ＋ 1 ＝ 8 盒（商數要加 1）！'
  }
];

function renderU7WordProblems() {
  const grid = document.getElementById('u7WordProblemsGrid');
  grid.innerHTML = u7WordProblems.map((wp, idx) => `
    <div style="background:#F8FAFC; border:2px solid #CBD5E1; border-radius:16px; padding:1.1rem;">
      <div style="font-weight:900; color:#1E3A8A; font-size:1.05rem;">${wp.title}</div>
      <p style="font-size:0.95rem; margin:0.5rem 0; color:#334155; font-weight:700;">${wp.story}</p>
      <div style="background:white; padding:0.5rem 0.75rem; border-radius:8px; border:1px dashed #94A3B8; font-weight:900; color:#1D4ED8; margin-bottom:0.75rem;">
        算式：${wp.eq}
      </div>
      <div style="display:flex; gap:0.5rem;">
        <button class="btn btn-outline" style="flex:1; justify-content:center;" onclick="checkU7WordAns(${idx}, false)">不用加 1</button>
        <button class="btn btn-outline" style="flex:1; justify-content:center;" onclick="checkU7WordAns(${idx}, true)">商數要 ＋1</button>
      </div>
      <div id="u7WpFeedback${idx}" style="margin-top:0.6rem; font-size:0.9rem; font-weight:800;"></div>
    </div>
  `).join('');
}

function checkU7WordAns(idx, userPlusOne) {
  const wp = u7WordProblems[idx];
  const el = document.getElementById(`u7WpFeedback${idx}`);
  if (userPlusOne === wp.needPlusOne) {
    addStar(1);
    el.style.color = '#059669';
    el.innerHTML = `✅ 答對了！${wp.explain} 答案是 <strong>${wp.ans}</strong>！`;
  } else {
    playTone(261.63, 0.15, 'sawtooth');
    el.style.color = '#DC2626';
    el.innerHTML = `🤔 再想一下：${wp.explain}`;
  }
}

/* =========================================================
   第 8 單元：公升和毫升（L 與 mL）
   ========================================================= */
let u8VolumeMl = 1200;

function setBeakerVolume(val) {
  u8VolumeMl = Math.max(0, Math.min(2000, parseInt(val, 10) || 0));
  document.getElementById('u8VolumeSlider').value = u8VolumeMl;
  playTone(523.25, 0.05);
  renderU8Beaker();
}

function pourIntoBeaker(deltaMl) {
  u8VolumeMl = Math.min(2000, u8VolumeMl + deltaMl);
  document.getElementById('u8VolumeSlider').value = u8VolumeMl;
  addStar(1);
  renderU8Beaker();
}

function renderU8Beaker() {
  const svg = document.getElementById('u8BeakerSvg');
  const bx = 95, by = 30, bw = 220, bh = 270;
  const fillRatio = u8VolumeMl / 2000;
  const fillH = fillRatio * (bh - 20);
  const fillY = by + bh - fillH;

  let ticks = '';
  for (let v = 0; v <= 2000; v += 100) {
    const ty = by + bh - (v / 2000) * (bh - 20);
    const isMajor = v % 500 === 0;
    const tw = isMajor ? 28 : 14;
    ticks += `<line x1="${bx + bw - tw}" y1="${ty}" x2="${bx + bw}" y2="${ty}" stroke="#1E293B" stroke-width="${isMajor ? 3 : 1.5}"/>`;
    if (isMajor && v > 0) {
      ticks += `<text x="${bx + bw - 35}" y="${ty + 5}" font-size="13" font-weight="900" fill="#0F172A" text-anchor="end">${v}mL (${v / 1000}L)</text>`;
    }
  }

  svg.innerHTML = `
    <!-- 量杯水體 -->
    <rect x="${bx + 3}" y="${fillY}" width="${bw - 6}" height="${fillH}" rx="4" fill="rgba(56, 189, 248, 0.68)"/>
    ${u8VolumeMl > 0 ? `<line x1="${bx + 3}" y1="${fillY}" x2="${bx + bw - 3}" y2="${fillY}" stroke="#0284C7" stroke-width="3"/>` : ''}

    <!-- 量杯外框 -->
    <path d="M ${bx - 12} ${by} L ${bx} ${by + 12} L ${bx} ${by + bh} Q ${bx} ${by + bh + 8} ${bx + 8} ${by + bh + 8} L ${bx + bw - 8} ${by + bh + 8} Q ${bx + bw} ${by + bh + 8} ${bx + bw} ${by + bh} L ${bx + bw} ${by} Z" fill="none" stroke="#1E3A8A" stroke-width="4.5"/>

    <!-- 刻度線 -->
    ${ticks}

    <!-- 當前液面指標 -->
    <text x="${bx + 18}" y="${Math.max(by + 25, fillY - 8)}" font-size="15" font-weight="900" fill="#0369A1">
      💧 目前水量：${u8VolumeMl} mL
    </text>
  `;

  const liters = Math.floor(u8VolumeMl / 1000);
  const mls = u8VolumeMl % 1000;
  document.getElementById('u8MlReadout').textContent = `${u8VolumeMl} 毫升 (mL)`;
  document.getElementById('u8CompoundReadout').textContent =
    liters > 0 ? `${liters} 公升 ${mls} 毫升` : `${mls} 毫升`;
}

const u8CalcCases = [
  {
    title: '🧴 課本例題 1：兩瓶沐浴乳共幾公升幾毫升？',
    q: '一瓶沐浴乳是 1250 毫升，另一瓶是 350 毫升，合起來共是幾公升幾毫升？',
    s1: '方法一（先相加再換算）：1250 mL ＋ 350 mL ＝ 1600 mL ＝ 1 公升 600 毫升',
    s2: '方法二（先換成複名數）：1 公升 250 毫升 ＋ 350 毫升 ＝ 1 公升 600 毫升',
    ans: '1 公升 600 毫升'
  },
  {
    title: '🍼 課本例題 2：大小保溫瓶共可裝多少水？',
    q: '小保溫瓶有 1 公升 480 毫升，大保溫瓶有 2 公升 150 毫升，合起來共可裝幾公升幾毫升？',
    s1: '先算毫升：480 毫升 ＋ 150 毫升 ＝ 630 毫升',
    s2: '再算公升：1 公升 ＋ 2 公升 ＝ 3 公升',
    ans: '3 公升 630 毫升'
  },
  {
    title: '🥤 課本例題 3：冬瓜茶還剩下幾公升幾毫升？',
    q: '一桶冬瓜茶有 3 公升 500 毫升，喝掉 1 公升 225 毫升後，還剩下幾公升幾毫升？',
    s1: '先算毫升：500 毫升 － 225 毫升 ＝ 275 毫升',
    s2: '再算公升：3 公升 － 1 公升 ＝ 2 公升',
    ans: '2 公升 275 毫升'
  },
  {
    title: '🍲 課本例題 4：鍋子和水壺的容量相差多少毫升？',
    q: '桌上的鍋子容量是 1370 mL，水壺容量是 1 公升 450 毫升，兩者相差多少毫升？',
    s1: '先把單位換成一樣：水壺 1 公升 450 毫升 ＝ 1450 毫升',
    s2: '再相減：1450 毫升 － 1370 毫升 ＝ 80 毫升',
    ans: '80 毫升 (mL)'
  }
];

function setU8CalcCase(idx) {
  playTone(523.25, 0.08);
  const c = u8CalcCases[idx];
  document.getElementById('u8CalcDisplay').innerHTML = `
    <div style="background:#F8FAFC; border:2px solid #CBD5E1; border-radius:16px; padding:1.25rem;">
      <h3 style="color:#1E3A8A; margin-bottom:0.4rem;">${c.title}</h3>
      <p style="font-weight:700; color:#334155; margin-bottom:1rem;">${c.q}</p>
      <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(240px, 1fr)); gap:0.75rem;">
        <div style="background:white; padding:0.9rem; border-radius:12px; border:2px solid #93C5FD; font-weight:800;">
          ${c.s1}
        </div>
        <div style="background:white; padding:0.9rem; border-radius:12px; border:2px solid #6EE7B7; font-weight:800;">
          ${c.s2}
        </div>
        <div style="background:#FEF3C7; padding:0.9rem; border-radius:12px; border:2px solid #F59E0B;">
          <div style="font-size:0.85rem; font-weight:800; color:#B45309;">計算結果：</div>
          <div style="font-size:1.35rem; font-weight:900; color:#92400E;">${c.ans}</div>
        </div>
      </div>
    </div>
  `;
}

/* =========================================================
   第 9 單元：分 數
   ========================================================= */
let u9PieState = {
  denom: 8,
  selected: [true, true, true, false, false, false, false, false]
};

function setU9PiePreset(denom, numCount) {
  u9PieState.denom = denom;
  u9PieState.selected = Array.from({ length: denom }, (_, i) => i < numCount);
  document.getElementById('u9DenomSlider').value = denom;
  document.getElementById('u9DenomLabel').textContent = denom;
  playTone(523.25, 0.08);
  renderU9Pie();
}

function changeU9Denom(val) {
  const d = parseInt(val, 10);
  u9PieState.denom = d;
  u9PieState.selected = Array.from({ length: d }, (_, i) => i < Math.min(d, 3));
  document.getElementById('u9DenomLabel').textContent = d;
  playTone(493.88, 0.05);
  renderU9Pie();
}

function toggleU9Slice(idx) {
  u9PieState.selected[idx] = !u9PieState.selected[idx];
  playTone(587.33, 0.06);
  renderU9Pie();
}

function renderU9Pie() {
  const svg = document.getElementById('u9PieSvg');
  const d = u9PieState.denom;
  const cx = 160, cy = 160, r = 130;
  let paths = '';

  for (let i = 0; i < d; i++) {
    const startAngle = (i * 2 * Math.PI) / d - Math.PI / 2;
    const endAngle = ((i + 1) * 2 * Math.PI) / d - Math.PI / 2;
    const x1 = cx + r * Math.cos(startAngle);
    const y1 = cy + r * Math.sin(startAngle);
    const x2 = cx + r * Math.cos(endAngle);
    const y2 = cy + r * Math.sin(endAngle);
    const midAngle = (startAngle + endAngle) / 2;
    const tx = cx + (r * 0.62) * Math.cos(midAngle);
    const ty = cy + (r * 0.62) * Math.sin(midAngle);

    const active = u9PieState.selected[i];
    paths += `
      <path d="M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 0 1 ${x2} ${y2} Z"
        fill="${active ? '#F59E0B' : '#FEF3C7'}"
        stroke="#78350F" stroke-width="3"
        onclick="toggleU9Slice(${i})"/>
      <text x="${tx}" y="${ty + 5}" font-size="14" font-weight="900" fill="${active ? 'white' : '#92400E'}" text-anchor="middle" pointer-events="none">
        1/${d}
      </text>
    `;
  }

  svg.innerHTML = paths;
  const num = u9PieState.selected.filter(Boolean).length;
  document.getElementById('u9FractionReadout').innerHTML = `
    <div>
      <div style="font-size:0.9rem; font-weight:800; color:#4338CA;">塗色部分占全部的：</div>
      <div class="readout-number">${num} / ${d} ${num === d ? '（＝ 1 整個！）' : ''}</div>
      <div style="font-size:0.95rem; font-weight:700; color:#334155;">
        平分成 <strong>${d} 份（分母）</strong>，塗色其中的 <strong>${num} 份（分子）</strong>，也就是 <strong>${num} 個 1/${d}</strong> 合起來的！
      </div>
    </div>
    <div class="readout-chinese">讀作：${numberToChinese(d)}分之${numberToChinese(num)}</div>
  `;
}

function checkU9EqualMyth(correct) {
  const el = document.getElementById('u9MythFeedback');
  if (correct) {
    addStar(1);
    el.style.color = '#059669';
    el.innerHTML = '✅ 答對了！分數一定要在「平分（每一份一樣大）」的前提下才成立！把檸檬派平分成一樣大後其實是 8 片，所以宇翔吃了 1/8 個檸檬派！';
  } else {
    playTone(261.63, 0.15, 'sawtooth');
    el.style.color = '#DC2626';
    el.innerHTML = '🤔 注意看喔！這 6 片檸檬派大小不一樣（沒有平分），不能直接說其中 1 片是 1/6 個喔！';
  }
}

/* 9-B: 離散量一盒 10 個果凍 */
let u9Jellies = ['dabao', 'dabao', 'dabao', 'xiaobao', 'xiaobao', 'xiaobao', 'xiaobao', 'none', 'none', 'none'];

function setU9JellyPreset() {
  u9Jellies = ['dabao', 'dabao', 'dabao', 'xiaobao', 'xiaobao', 'xiaobao', 'xiaobao', 'none', 'none', 'none'];
  playTone(523.25, 0.08);
  renderU9Jellies();
}

function resetU9Jellies() {
  u9Jellies.fill('none');
  playTone(330, 0.08);
  renderU9Jellies();
}

function toggleU9Jelly(idx) {
  const order = ['none', 'dabao', 'xiaobao'];
  const next = order[(order.indexOf(u9Jellies[idx]) + 1) % 3];
  u9Jellies[idx] = next;
  playTone(587.33, 0.05);
  renderU9Jellies();
}

function renderU9Jellies() {
  const grid = document.getElementById('u9JellyGrid');
  grid.innerHTML = u9Jellies.map((owner, idx) => {
    const label = owner === 'dabao' ? '👦大寶' : owner === 'xiaobao' ? '👧小寶' : '未吃';
    return `
      <div class="jelly-cup ${owner}" onclick="toggleU9Jelly(${idx})">
        <div style="font-size:1.6rem;">🍮</div>
        <div style="font-size:0.78rem; font-weight:900;">${label}</div>
        <div style="font-size:0.7rem; color:#64748B;">1/10盒</div>
      </div>
    `;
  }).join('');

  const dabaoCnt = u9Jellies.filter(x => x === 'dabao').length;
  const xiaobaoCnt = u9Jellies.filter(x => x === 'xiaobao').length;
  const remCnt = 10 - dabaoCnt - xiaobaoCnt;

  document.getElementById('u9JellySummary').innerHTML = `
    <div style="display:flex; gap:1.5rem; flex-wrap:wrap; font-weight:900; font-size:1.05rem;">
      <span style="color:#1D4ED8;">👦 大寶吃了：${dabaoCnt} 個 ＝ <strong>${dabaoCnt}/10 盒</strong></span>
      <span style="color:#B45309;">👧 小寶吃了：${xiaobaoCnt} 個 ＝ <strong>${xiaobaoCnt}/10 盒</strong></span>
      <span style="color:#047857;">🍮 還剩下：${remCnt} 個 ＝ <strong>${remCnt}/10 盒</strong></span>
    </div>
  `;
}

/* 9-C: 同分母分數彩帶比大小 */
function setU9ComparePreset(den, a, b) {
  document.getElementById('u9CmpDenSlider').value = den;
  document.getElementById('u9CmpNumASlider').max = den;
  document.getElementById('u9CmpNumBSlider').max = den;
  document.getElementById('u9CmpNumASlider').value = a;
  document.getElementById('u9CmpNumBSlider').value = b;
  playTone(523.25, 0.08);
  updateU9Compare();
}

function updateU9Compare() {
  const den = parseInt(document.getElementById('u9CmpDenSlider').value, 10);
  const sliderA = document.getElementById('u9CmpNumASlider');
  const sliderB = document.getElementById('u9CmpNumBSlider');
  sliderA.max = den;
  sliderB.max = den;
  const a = Math.min(den, parseInt(sliderA.value, 10));
  const b = Math.min(den, parseInt(sliderB.value, 10));

  document.getElementById('u9CmpDenLabel').textContent = den;
  document.getElementById('u9CmpNumALabel').textContent = a;
  document.getElementById('u9CmpNumBLabel').textContent = b;

  const svg = document.getElementById('u9CompareSvg');
  const startX = 130, totalW = 640, cellW = totalW / den;

  const drawBar = (y, count, color, label) => {
    let cells = `<text x="20" y="${y + 26}" font-size="15" font-weight="900" fill="#1E293B">${label} (${count}/${den})</text>`;
    for (let i = 0; i < den; i++) {
      cells += `<rect x="${startX + i * cellW}" y="${y}" width="${cellW}" height="38" fill="${i < count ? color : '#F8FAFC'}" stroke="#475569" stroke-width="2"/>`;
      cells += `<text x="${startX + (i + 0.5) * cellW}" y="${y + 24}" font-size="12" font-weight="800" fill="${i < count ? 'white' : '#94A3B8'}" text-anchor="middle">1/${den}</text>`;
    }
    return cells;
  };

  svg.innerHTML = `
    ${drawBar(30, a, '#3B82F6', '藍色')}
    ${drawBar(105, b, '#10B981', '綠色')}
  `;

  const sign = a > b ? '＞' : a < b ? '＜' : '＝';
  document.getElementById('u9CompareFeedback').innerHTML =
    `🎀 同分母分數比大小：<strong>${a}/${den}</strong> 是 ${a} 個 1/${den}，<strong>${b}/${den}</strong> 是 ${b} 個 1/${den}，所以 <strong>${a}/${den} ${sign} ${b}/${den}</strong>！`;
}

/* 初始化所有單元互動元件 */
window.addEventListener('DOMContentLoaded', () => {
  // Unit 1
  renderU1Bank();
  renderU1Board();
  renderCompareArena();
  updateNumberLine();

  // Unit 2
  renderU2Vertical();
  updateEstVisualizer();

  // Unit 3
  renderU3RulerCanvas();
  initU3RulerDrag();
  setU3CalcCase(0);
  updateOverlapStrip();

  // Unit 4
  renderU4Multiplication();
  setU4TwoStepCase(0);
  renderU4EstimationCards();

  // Unit 5
  updateFanVisual();
  renderHouseAngleBoard();
  initU5SetSquareDrag();
  renderGridPolygon();
  initU5GridDrag();

  // Unit 6
  loadU6Preset('card15');
  renderU6LeafEst();

  // Unit 7
  updateU7Visual();
  renderU7Vertical();
  renderU7WordProblems();

  // Unit 8
  renderU8Beaker();
  setU8CalcCase(0);

  // Unit 9
  renderU9Pie();
  renderU9Jellies();
  updateU9Compare();
});

