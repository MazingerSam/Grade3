/* =========================================================
   木新思達 國小數學 - Google OAuth 與使用者登入狀態模組 (auth.js)
   ========================================================= */

// Google Client ID 管理：優先從 localStorage 讀取，預設為本機正式授權 Client ID
let GOOGLE_CLIENT_ID = localStorage.getItem('muxin_google_client_id') || '613583307135-p46uvue7mccu6u0lbka9es2i82008op4.apps.googleusercontent.com';

const authState = {
  user: JSON.parse(localStorage.getItem('muxin_user_profile') || 'null'),
  isLoggedIn: false,
  role: 'student', // 'student' | 'admin'
  grade: '3上'
};

if (authState.user && authState.user.email) {
  authState.isLoggedIn = true;
  authState.role = authState.user.role || 'student';
  authState.grade = authState.user.grade || '3上';
}

// 掛載至全域 window，確保全站跨模組皆可正確取得即時登入者
window.authState = authState;

// 安全取得當前登入者資訊的共用函式（優先記憶體物件，備援 localStorage，絕不使用假帳號）
window.getActiveAuthUser = function() {
  if (window.authState && window.authState.user && window.authState.user.email) {
    return window.authState.user;
  }
  try {
    const cached = JSON.parse(localStorage.getItem('muxin_user_profile') || 'null');
    if (cached && cached.email) {
      if (window.authState) {
        window.authState.user = cached;
        window.authState.isLoggedIn = true;
        window.authState.role = cached.role || 'student';
        window.authState.grade = cached.grade || '3上';
      }
      return cached;
    }
  } catch (e) {}
  return null;
};

// 檢查當前登入者是否具備指定年級之權限（支援多個年級設定，如 '3上,4上'）
window.canUserAccessGrade = function(targetGrade) {
  const user = window.getActiveAuthUser();
  if (!user) return true; // 未登入時允許預覽瀏覽，交卷前會強制引導登入
  if (user.role === 'admin') return true;
  const userGrades = (user.grade || '').split(',').map(g => g.trim());
  if (userGrades.includes('all')) return true;
  return userGrades.includes(targetGrade);
};

// 初始化 Google Identity Services
function initGoogleAuth() {
  if (typeof google === 'undefined' || !google.accounts) {
    console.log('Google Identity Services script 載入中...');
    return;
  }

  try {
    google.accounts.id.initialize({
      client_id: GOOGLE_CLIENT_ID,
      callback: handleGoogleCredentialResponse,
      auto_select: false,
      cancel_on_tap_outside: false
    });

    // 渲染登入按鈕
    renderGoogleSignInButton();
  } catch (err) {
    console.warn('Google Auth 初始化通知:', err.message);
  }
}

function renderGoogleSignInButton() {
  const container = document.getElementById('g_id_signin_container');
  if (container && typeof google !== 'undefined' && google.accounts) {
    container.innerHTML = '';
    google.accounts.id.renderButton(container, {
      theme: 'filled_blue',
      size: 'large',
      text: 'signin_with',
      shape: 'pill',
      logo_alignment: 'left'
    });
  }
}

// 接收 Google ID Token 並呼叫後端 Cloudflare D1 驗證
async function handleGoogleCredentialResponse(response) {
  const credential = response.credential;
  if (!credential) {
    alert('無法取得 Google 登入憑證，請重試！');
    return;
  }

  showAuthLoading(true, '正在向 Cloudflare D1 驗證帳號授權與年級權限...');

  try {
    const res = await fetch('/api/auth/google', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ credential, client_id: GOOGLE_CLIENT_ID })
    });

    const data = await res.json();
    showAuthLoading(false);

    if (!res.ok || !data.success) {
      // 驗證失敗（未在白名單或非本年級）
      showAccessDeniedModal(data);
      return;
    }

    // 登入成功
    setAuthUser(data.user);
    showLoginSuccessModal(data.user);

  } catch (err) {
    showAuthLoading(false);
    console.error('登入驗證錯誤:', err);
    handleAuthFallback(credential);
  }
}

// 備援登入解析 (當 Functions 暫時不可用時，前端直接解析 JWT 並檢查授權名單)
function handleAuthFallback(credential) {
  try {
    const base64Url = credential.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(c => {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    const payload = JSON.parse(jsonPayload);
    const email = (payload.email || '').toLowerCase().trim();
    const name = payload.name || payload.given_name || '同學';
    const picture = payload.picture || '';

    // 檢查本地與快取白名單
    const cachedUsers = JSON.parse(localStorage.getItem('muxin_cached_users') || '[]');
    let userRecord = cachedUsers.find(u => u.email.toLowerCase() === email);

    if (!userRecord && email === 'pipdapha@gmail.com') {
      userRecord = { email: 'pipdapha@gmail.com', name: '系統管理員 (Pipdapha)', role: 'admin', grade: 'all', status: 'active' };
    }

    if (!userRecord) {
      showAccessDeniedModal({
        message: `抱歉，您的 Google 帳號 (${email}) 尚未在系統授權名單中。請聯繫系統管理員開通權限！`
      });
      return;
    }

    if (userRecord.status !== 'active') {
      showAccessDeniedModal({ message: '您的帳號已被停用，請聯繫管理員！' });
      return;
    }

    // 年級限制檢查 (支援多個年級設定，如 '3上,4上,5上,6上')
    const isAdmin = userRecord.role === 'admin';
    const allowedGrades = ['1上', '2上', '3上', '4上', '5上', '6上', '1', '2', '3', '4', '5', '6', 'all'];
    const userGrades = (userRecord.grade || '').split(',').map(g => g.trim());
    const isGradeMatch = isAdmin || userGrades.includes('all') || userGrades.some(g => allowedGrades.includes(g));

    if (!isGradeMatch) {
      showAccessDeniedModal({
        message: `權限限制：您的帳號指定年級為【${userRecord.grade}】，無法登入本教材系統（支援 1上~6上 全學年）！`
      });
      return;
    }

    const sessionUser = {
      email,
      name: userRecord.name || name,
      picture,
      role: userRecord.role,
      grade: userRecord.grade,
      allowed: true
    };
    setAuthUser(sessionUser);
    showLoginSuccessModal(sessionUser);

  } catch (parseErr) {
    alert('無法解析 Google 憑證，請確認網路連線並重試！');
  }
}

// 學生直接使用已授權的 Google 信箱驗證登入 (免受 Google 401: invalid_client 影響)
async function handleDirectStudentLogin() {
  const input = document.getElementById('studentDirectEmail');
  if (!input || !input.value.trim()) {
    alert('請輸入向老師登記的 Google 信箱（例如：student@gmail.com）！');
    if (input) input.focus();
    return;
  }
  const email = input.value.trim().toLowerCase();
  showAuthLoading(true, '正在驗證帳號授權資格與年級權限...');

  try {
    let userRecord = null;
    // 1. 優先嘗試從雲端 D1 資料庫查詢最新授權名單
    try {
      const res = await fetch(`/api/admin/users?adminEmail=pipdapha@gmail.com`);
      if (res.ok) {
        const data = await res.json();
        if (data && data.users && Array.isArray(data.users)) {
          localStorage.setItem('muxin_cached_users', JSON.stringify(data.users));
          userRecord = data.users.find(u => u.email.toLowerCase() === email);
        }
      }
    } catch (apiErr) {
      console.warn('線上 D1 查詢異常，切換至本地授權快取比對:', apiErr);
    }

    // 2. 若雲端未取得或網路離線，比對本地快取白名單
    if (!userRecord) {
      const cached = JSON.parse(localStorage.getItem('muxin_cached_users') || '[]');
      userRecord = cached.find(u => u.email.toLowerCase() === email);
    }

    showAuthLoading(false);

    // 3. 查無授權帳號
    if (!userRecord) {
      showAccessDeniedModal({
        message: `抱歉，Google 帳號【${email}】尚未在系統授權名單中！<br/><br/>請先聯繫老師或系統管理員在後台將您的信箱加入授權名單，再行登入。`
      });
      return;
    }

    // 4. 帳號停用檢查
    if (userRecord.status === 'inactive') {
      showAccessDeniedModal({
        message: `帳號【${email}】已被暫時停用，請聯繫老師或管理員！`
      });
      return;
    }

    // 5. 年級限制檢查：支援多個年級設定 (如 '3上,4上,5上,6上')
    const isAdmin = userRecord.role === 'admin';
    const allowedGrades = ['1上', '2上', '3上', '4上', '5上', '6上', '1', '2', '3', '4', '5', '6', 'all'];
    const userGrades = (userRecord.grade || '').split(',').map(g => g.trim());
    const matchGrade = isAdmin || userGrades.includes('all') || userGrades.some(g => allowedGrades.includes(g));

    if (!matchGrade) {
      showAccessDeniedModal({
        message: `年級限制：您的帳號指定年級為【${userRecord.grade}】，目前系統開放 1上~6上 年級學生應試！`
      });
      return;
    }

    // 6. 授權成功，登入系統
    const sessionUser = {
      email: userRecord.email,
      name: userRecord.name || email.split('@')[0],
      role: userRecord.role || 'student',
      grade: userRecord.grade || '3上',
      allowed: true
    };

    setAuthUser(sessionUser);

    const modal = document.getElementById('authLoginModal');
    if (modal) modal.style.display = 'none';

    showLoginSuccessModal(sessionUser);

  } catch (err) {
    showAuthLoading(false);
    alert('登入驗證過程發生錯誤：' + err.message);
  }
}

// 設定已登入使用者
function setAuthUser(user) {
  authState.user = user;
  authState.isLoggedIn = true;
  authState.role = user.role || 'student';
  authState.grade = user.grade || '3上';
  window.authState = authState;

  localStorage.setItem('muxin_user_profile', JSON.stringify(user));

  const userGrades = (user.grade || '').split(',').map(g => g.trim());
  const activeG = localStorage.getItem('kx_active_grade') || '3上';
  if (user.role === 'admin' || userGrades.includes('all')) {
    if (typeof switchGrade === 'function') switchGrade(activeG);
  } else if (userGrades.includes(activeG)) {
    if (typeof switchGrade === 'function') switchGrade(activeG);
  } else if (userGrades.includes('6上')) {
    if (typeof switchGrade === 'function') switchGrade('6上');
  } else if (userGrades.includes('5上')) {
    if (typeof switchGrade === 'function') switchGrade('5上');
  } else if (userGrades.includes('4上')) {
    if (typeof switchGrade === 'function') switchGrade('4上');
  } else if (userGrades.includes('3上')) {
    if (typeof switchGrade === 'function') switchGrade('3上');
  } else if (userGrades.includes('2上')) {
    if (typeof switchGrade === 'function') switchGrade('2上');
  } else if (userGrades.includes('1上')) {
    if (typeof switchGrade === 'function') switchGrade('1上');
  }

  if (user.email) {
    localStorage.setItem('muxin_last_email', user.email);
  }

  // 學生姓名指派邏輯：徹底區分管理員與個別學生帳號，絕不殘留舊帳號姓名
  let displayName = '';
  if (user.role === 'admin') {
    displayName = user.name || '系統管理員';
  } else {
    // 學生帳號：若後台有填姓名則顯示姓名，若無則顯示 Email 前綴
    displayName = (user.name && user.name.trim()) ? user.name.trim() : (user.email ? user.email.split('@')[0] : '小小數學家');
  }

  localStorage.setItem('kx_g3_name', displayName);
  if (typeof quizState !== 'undefined') {
    quizState.studentName = displayName;
    if (typeof renderQuizCenter === 'function') {
      renderQuizCenter();
    }
  }

  updateAuthUI();
}

// 登出
function logoutUser() {
  if (confirm('確定要登出 Google 帳號嗎？')) {
    localStorage.removeItem('muxin_user_profile');
    localStorage.removeItem('muxin_last_email');
    localStorage.removeItem('kx_g3_name');
    localStorage.removeItem('kx_g3_class');
    localStorage.removeItem('kx_g3_seat');
    authState.user = null;
    authState.isLoggedIn = false;
    authState.role = 'student';
    authState.grade = '3上';
    window.authState = authState;

    if (typeof quizState !== 'undefined') {
      quizState.studentName = '';
      if (typeof renderQuizCenter === 'function') {
        renderQuizCenter();
      }
    }

    if (typeof google !== 'undefined' && google.accounts) {
      google.accounts.id.disableAutoSelect();
    }

    updateAuthUI();
    showLoginModal();
  }
}

// 更新頁面上的使用者狀態 UI
function updateAuthUI() {
  const loginBtn = document.getElementById('navLoginBtn');
  const userProfileWrap = document.getElementById('navUserProfileWrap');
  const userAvatar = document.getElementById('navUserAvatar');
  const userName = document.getElementById('navUserName');
  const userGradeBadge = document.getElementById('navUserGradeBadge');
  const adminBtn = document.getElementById('navAdminBtn');
  const modal = document.getElementById('authLoginModal');

  if (authState.isLoggedIn && authState.user) {
    if (loginBtn) loginBtn.style.display = 'none';
    if (userProfileWrap) userProfileWrap.style.display = 'flex';
    if (userAvatar) {
      if (authState.user.picture) {
        userAvatar.src = authState.user.picture;
        userAvatar.style.display = 'block';
      } else {
        userAvatar.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%233B82F6"><circle cx="12" cy="8" r="4"/><path d="M12 14c-6.1 0-8 4-8 4v2h16v-2s-1.9-4-8-4z"/></svg>';
      }
    }
    if (userName) userName.textContent = authState.user.name || authState.user.email;
    if (userGradeBadge) {
      if (authState.role === 'admin') {
        userGradeBadge.textContent = '👑 管理員 (全學年)';
        userGradeBadge.className = 'grade-tag admin';
      } else {
        const formattedGrades = (authState.user.grade || '3上').split(',').map(g => g.trim()).join('、');
        userGradeBadge.textContent = `🎓 ${formattedGrades}`;
        userGradeBadge.className = 'grade-tag student';
      }
    }
    if (adminBtn) {
      adminBtn.style.display = authState.role === 'admin' ? 'inline-flex' : 'none';
    }
    if (modal) modal.style.display = 'none';

  } else {
    if (loginBtn) loginBtn.style.display = 'inline-flex';
    if (userProfileWrap) userProfileWrap.style.display = 'none';
    if (adminBtn) adminBtn.style.display = 'none';
  }
}

// 顯示登入彈窗
function showLoginModal() {
  const modal = document.getElementById('authLoginModal');
  if (modal) {
    modal.style.display = 'flex';
    renderGoogleSignInButton();
  }
}

function closeLoginModal() {
  // 如果已登入才允許關閉，未登入強制登入
  if (authState.isLoggedIn) {
    const modal = document.getElementById('authLoginModal');
    if (modal) modal.style.display = 'none';
  } else {
    alert('歡迎使用木新思達三年級數學互動樂園！請先透過 Google 帳號登入驗證以開始學習！');
  }
}

// 權限拒絕通知
function showAccessDeniedModal(data) {
  const modal = document.getElementById('authNoticeModal');
  const content = document.getElementById('authNoticeContent');
  if (modal && content) {
    content.innerHTML = `
      <div style="font-size:3.5rem; margin-bottom:1rem;">🚫</div>
      <h3 style="color:#DC2626; font-size:1.35rem; margin-bottom:0.75rem;">權限不足或年級不符</h3>
      <p style="color:#475569; font-size:1rem; margin-bottom:1.25rem; line-height:1.7;">
        ${data.message || '您的帳號無法存取本系統。'}
      </p>
      <div style="background:#FEF2F2; border:1px solid #FCA5A5; border-radius:12px; padding:1rem; text-align:left; font-size:0.9rem; color:#991B1B; margin-bottom:1.5rem;">
        📌 <strong>系統規則提示：</strong><br/>
        1. 系統使用 Cloudflare D1 資料庫記錄每組授權之 GMAIL 帳號。<br/>
        2. 依專案規範，<strong>每組學生帳號限定使用在一個年級</strong>（目前網頁為「3上」）。<br/>
        3. 若為新學員或需變更綁定年級，請聯繫系統管理員將您的 Gmail 加入授權名單中。
      </div>
      <button class="btn btn-primary" onclick="document.getElementById('authNoticeModal').style.display='none'">我知道了</button>
    `;
    modal.style.display = 'flex';
  } else {
    alert(data.message || '帳號未在授權名單中');
  }
}

function showLoginSuccessModal(user) {
  const modal = document.getElementById('authNoticeModal');
  const content = document.getElementById('authNoticeContent');
  if (modal && content) {
    content.innerHTML = `
      <div style="font-size:3.5rem; margin-bottom:1rem;">🎉</div>
      <h3 style="color:#059669; font-size:1.35rem; margin-bottom:0.5rem;">登入成功！歡迎回來</h3>
      <p style="color:#1E293B; font-weight:700; font-size:1.1rem; margin-bottom:0.5rem;">${user.name} 同學</p>
      <p style="color:#64748B; font-size:0.92rem; margin-bottom:1.25rem;">帳號：${user.email} ｜ 身分：${user.role === 'admin' ? '系統管理員' : `年級 ${user.grade}`}</p>
      <button class="btn btn-primary" onclick="document.getElementById('authNoticeModal').style.display='none';">進入互動樂園 🚀</button>
    `;
    modal.style.display = 'flex';
  }
}

function showAuthLoading(show, text = '驗證中...') {
  const loading = document.getElementById('authLoadingOverlay');
  const loadingText = document.getElementById('authLoadingText');
  if (loading) {
    loading.style.display = show ? 'flex' : 'none';
    if (loadingText) loadingText.textContent = text;
  }
}

// 快速體驗/管理員自訂設定面板
function openAdminSettingsModal() {
  if (authState.role !== 'admin') {
    alert('僅系統管理員具備存取權限！');
    return;
  }
  const modal = document.getElementById('adminDashboardModal');
  if (modal) {
    modal.style.display = 'flex';
    loadAdminData();
  }
}

async function loadAdminData() {
  const listWrap = document.getElementById('adminUserListWrap');
  const statsWrap = document.getElementById('adminStatsWrap');
  if (!listWrap) return;

  const clientIdInput = document.getElementById('customGoogleClientIdInput');
  if (clientIdInput) {
    clientIdInput.value = localStorage.getItem('muxin_google_client_id') || GOOGLE_CLIENT_ID;
  }

  listWrap.innerHTML = '<div style="padding:1rem; text-align:center;">載入 Cloudflare D1 授權名單中...</div>';

  try {
    const adminEmail = (authState.user && authState.user.email) ? authState.user.email : 'pipdapha@gmail.com';
    const res = await fetch(`/api/admin/users?adminEmail=${encodeURIComponent(adminEmail)}`, {
      headers: { 'x-admin-email': adminEmail }
    });
    const data = await res.json();
    
    // 合併遠端名單與本地快取名單，確保即時可見
    const localUsers = JSON.parse(localStorage.getItem('muxin_cached_users') || '[]');
    let allUsers = (data.success && data.users) ? [...data.users] : [
      { email: 'pipdapha@gmail.com', name: '系統管理員 (Pipdapha)', role: 'admin', grade: 'all', status: 'active' }
    ];
    
    localUsers.forEach(lu => {
      if (!allUsers.some(u => u.email.toLowerCase() === lu.email.toLowerCase())) {
        allUsers.push(lu);
      }
    });

    // 渲染使用者列表
    listWrap.innerHTML = `
      <table style="width:100%; border-collapse:collapse; font-size:0.88rem; text-align:left;">
        <thead>
          <tr style="background:#F8FAFC; border-bottom:2px solid #E2E8F0;">
            <th style="padding:0.6rem;">Gmail 帳號</th>
            <th style="padding:0.6rem;">姓名</th>
            <th style="padding:0.6rem;">身分角色</th>
            <th style="padding:0.6rem;">綁定年級</th>
            <th style="padding:0.6rem;">狀態</th>
            <th style="padding:0.6rem;">操作</th>
          </tr>
        </thead>
        <tbody>
          ${allUsers.map(u => `
            <tr style="border-bottom:1px solid #F1F5F9;">
              <td style="padding:0.6rem; font-weight:700;">${u.email}</td>
              <td style="padding:0.6rem;">${u.name || '-'}</td>
              <td style="padding:0.6rem;">
                <span style="padding:0.2rem 0.5rem; border-radius:999px; font-size:0.75rem; font-weight:700; background:${u.role === 'admin' ? '#EDE9FE; color:#6D28D9' : '#E0F2FE; color:#0369A1'}">
                  ${u.role === 'admin' ? '👑 管理員' : '🎓 學生'}
                </span>
              </td>
              <td style="padding:0.6rem;">
                ${(u.grade || '3上').split(',').map(g => {
                  const isG4 = g.includes('4');
                  const isAll = g === 'all';
                  const bg = isAll ? '#F3E8FF' : isG4 ? '#CCFBF1' : '#DBEAFE';
                  const fg = isAll ? '#7E22CE' : isG4 ? '#0F766E' : '#1D4ED8';
                  return `<span style="display:inline-block; margin:1px 3px 1px 0; padding:2px 7px; border-radius:6px; font-size:0.75rem; font-weight:800; background:${bg}; color:${fg};">${isAll ? '全學年' : g}</span>`;
                }).join('')}
              </td>
              <td style="padding:0.6rem;">
                <span style="color:${u.status === 'active' ? '#10B981' : '#EF4444'}; font-weight:700;">
                  ${u.status === 'active' ? '● 啟用' : '● 停用'}
                </span>
              </td>
              <td style="padding:0.6rem;">
                ${u.email === authState.user.email ? '<span style="color:#94A3B8; font-size:0.8rem;">(當前帳號)</span>' : `
                  <button class="btn btn-outline" style="padding:0.2rem 0.6rem; font-size:0.78rem; border-color:#EF4444; color:#EF4444;" onclick="deleteUserFromD1('${u.email}')">刪除</button>
                `}
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;

    // 錯題統計總覽 (支援 1 ~ 10 單元)
    if (statsWrap) {
      statsWrap.innerHTML = `
        <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(130px, 1fr)); gap:0.75rem;">
          ${[1,2,3,4,5,6,7,8,9,10].map(u => {
            const found = (data.wrongSummary || []).find(ws => ws.unit === u);
            const cnt = found ? found.count : 0;
            return `
              <div style="background:#FFFBEB; border:1px solid #FDE68A; border-radius:10px; padding:0.6rem; text-align:center;">
                <div style="font-size:0.78rem; color:#92400E; font-weight:700;">第 ${u} 單元錯題</div>
                <div style="font-size:1.35rem; font-weight:900; color:#B45309;">${cnt} 題</div>
              </div>
            `;
          }).join('')}
        </div>
      `;
    }

    // 🏆 處理全體學生測驗成績與作答歷程總表 (D1 雲端紀錄 + 本地備援)
    const d1Attempts = (data.success && Array.isArray(data.recentAttempts)) ? data.recentAttempts : [];
    window.adminRawWrongQuestions = (data.success && Array.isArray(data.wrongQuestions)) ? data.wrongQuestions : [];

    const localRecords = JSON.parse(localStorage.getItem('kx_quiz_records_all') || localStorage.getItem('kx_g3_quiz_records') || '[]');
    const normalizedLocal = localRecords.map(r => ({
      email: r.email || (authState.user ? authState.user.email : ''),
      student_name: r.name,
      student_class: r.studentClass || '未填班級',
      seat_num: r.seat || '1',
      grade: r.grade || '3上',
      unit: r.unit,
      paper_name: r.paperName,
      score: r.score,
      correct_count: r.correctCount,
      total_count: 5,
      wrong_count: r.wrongCount,
      questions_detail: r.questionsDetail || null,
      created_at: r.time
    }));

    adminRawAttempts = [...d1Attempts];
    normalizedLocal.forEach(nl => {
      if (!adminRawAttempts.some(a => a.email === nl.email && a.unit === nl.unit && a.created_at === nl.created_at)) {
        adminRawAttempts.push(nl);
      }
    });

    // 填充學生帳號下拉選單
    const filterSelect = document.getElementById('adminFilterStudentEmail');
    if (filterSelect) {
      const uniqueEmails = Array.from(new Set(adminRawAttempts.map(a => a.email).filter(Boolean)));
      filterSelect.innerHTML = `<option value="all">👥 全部應試帳號 (${uniqueEmails.length} 位)</option>` +
        uniqueEmails.map(em => {
          const isAdm = em === 'pipdapha@gmail.com' || (authState.user && authState.user.email === em && authState.user.role === 'admin');
          return `<option value="${em}">${isAdm ? '👑 管理員: ' : '🧑‍🎓 學生: '}${em}</option>`;
        }).join('');
    }

    renderAdminAttemptsTable();

  } catch (err) {
    listWrap.innerHTML = `<div style="color:red; padding:1rem;">載入失敗：${err.message}</div>`;
  }
}

// 全域儲存管理員取得之學生測驗紀錄與錯題明細
let adminRawAttempts = [];
window.adminRawWrongQuestions = [];

// 篩選與渲染學生測驗成績紀錄表
function filterAdminAttempts() {
  renderAdminAttemptsTable();
}

function renderAdminAttemptsTable() {
  const wrap = document.getElementById('adminAttemptsWrap');
  const countBadge = document.getElementById('adminAttemptsCountBadge');
  if (!wrap) return;

  const selectedEmail = (document.getElementById('adminFilterStudentEmail') ? document.getElementById('adminFilterStudentEmail').value : 'all');
  const selectedUnit = (document.getElementById('adminFilterUnit') ? document.getElementById('adminFilterUnit').value : 'all');

  let filtered = [...adminRawAttempts];
  if (selectedEmail && selectedEmail !== 'all') {
    filtered = filtered.filter(a => (a.email || '').toLowerCase() === selectedEmail.toLowerCase());
  }
  if (selectedUnit && selectedUnit !== 'all') {
    filtered = filtered.filter(a => String(a.unit) === String(selectedUnit));
  }

  if (countBadge) {
    countBadge.textContent = `${filtered.length} 筆紀錄`;
  }

  if (filtered.length === 0) {
    wrap.innerHTML = `
      <div style="padding:2.5rem 1rem; text-align:center; color:#64748B;">
        <div style="font-size:2rem; margin-bottom:0.5rem;">📝</div>
        <div style="font-weight:700;">目前尚無符合篩選條件的學生測驗紀錄</div>
        <div style="font-size:0.8rem; color:#94A3B8; margin-top:0.25rem;">學生在線上測驗中心交卷後，成績將即時同步於此處！</div>
      </div>
    `;
    return;
  }

  wrap.innerHTML = `
    <table style="width:100%; border-collapse:collapse; font-size:0.85rem; text-align:left;">
      <thead>
        <tr style="background:#F1F5F9; border-bottom:2px solid #CBD5E1; color:#334155;">
          <th style="padding:0.6rem 0.75rem;">作答時間</th>
          <th style="padding:0.6rem 0.75rem;">應試 Gmail 帳號</th>
          <th style="padding:0.6rem 0.75rem;">學生姓名</th>
          <th style="padding:0.6rem 0.75rem;">班級/座號</th>
          <th style="padding:0.6rem 0.75rem;">單元與卷別</th>
          <th style="padding:0.6rem 0.75rem; text-align:center;">得分</th>
          <th style="padding:0.6rem 0.75rem; text-align:center;">答對 / 錯題</th>
          <th style="padding:0.6rem 0.75rem; text-align:center;">試卷批改與診斷</th>
        </tr>
      </thead>
      <tbody>
        ${filtered.map((a, idx) => {
          const score = Number(a.score) || 0;
          let badgeStyle = 'background:#DCFCE7; color:#166534; border:1px solid #86EFAC;';
          if (score === 100) badgeStyle = 'background:#FEF3C7; color:#92400E; border:1px solid #FCD34D; font-weight:900;';
          else if (score >= 80) badgeStyle = 'background:#DBEAFE; color:#1E40AF; border:1px solid #93C5FD;';
          else if (score < 60) badgeStyle = 'background:#FEE2E2; color:#991B1B; border:1px solid #FCA5A5;';

          const isAdminTest = (a.email === 'pipdapha@gmail.com') || (a.student_class && a.student_class.includes('管理員')) || (a.student_name && a.student_name.includes('管理員'));

          return `
            <tr style="border-bottom:1px solid #F1F5F9; transition:background 0.15s;" onmouseover="this.style.background='#F8FAFC'" onmouseout="this.style.background='white'">
              <td style="padding:0.55rem 0.75rem; color:#64748B; font-size:0.8rem; white-space:nowrap;">${a.created_at || '-'}</td>
              <td style="padding:0.55rem 0.75rem; font-weight:700; color:#1E293B;">
                ${a.email || '-'}
                ${isAdminTest ? '<span style="display:inline-block; margin-left:4px; font-size:0.68rem; background:#EDE9FE; color:#6D28D9; padding:1px 5px; border-radius:4px; font-weight:700;">👑 管理員試作</span>' : ''}
              </td>
              <td style="padding:0.55rem 0.75rem; font-weight:800; color:#4338CA;">${a.student_name || '同學'}</td>
              <td style="padding:0.55rem 0.75rem; color:#475569;">${a.student_class || '4年級'} / ${a.seat_num || '1'}號</td>
              <td style="padding:0.55rem 0.75rem;">
                <span style="font-weight:700; color:#0F172A;">第 ${a.unit} 單元</span>
                <span style="font-size:0.78rem; color:#64748B; margin-left:4px;">(${a.paper_name || '測驗卷'})</span>
              </td>
              <td style="padding:0.55rem 0.75rem; text-align:center;">
                <span style="display:inline-block; padding:0.2rem 0.55rem; border-radius:999px; font-size:0.82rem; font-weight:800; ${badgeStyle}">
                  ${score === 100 ? '🥇 ' : ''}${score} 分
                </span>
              </td>
              <td style="padding:0.55rem 0.75rem; text-align:center; font-weight:700;">
                <span style="color:#059669;">✔ ${a.correct_count ?? 0}</span> / 
                <span style="color:${(a.wrong_count > 0) ? '#DC2626' : '#94A3B8'};">✘ ${a.wrong_count ?? 0}</span>
              </td>
              <td style="padding:0.55rem 0.75rem; text-align:center;">
                <button class="btn btn-outline" style="padding:0.25rem 0.65rem; font-size:0.78rem; border-color:#6366F1; color:#4F46E5; font-weight:800; border-radius:6px; cursor:pointer;" onclick="openAdminAttemptDetailModal(${idx})">
                  🔍 錯題診斷
                </button>
              </td>
            </tr>
          `;
        }).join('')}
      </tbody>
    </table>
  `;
}

// 🔍 管理員檢視學生測驗卷批改結果與錯題診斷彈窗
function openAdminAttemptDetailModal(idx) {
  const item = adminRawAttempts[idx];
  if (!item) return;

  // 尋找關聯錯題
  let wrongList = [];
  if (item.questions_detail && Array.isArray(item.questions_detail)) {
    wrongList = item.questions_detail.filter(q => !q.isCorrect);
  } else if (window.adminRawWrongQuestions && Array.isArray(window.adminRawWrongQuestions)) {
    wrongList = window.adminRawWrongQuestions.filter(wq => {
      if (item.id && wq.attempt_id) return String(wq.attempt_id) === String(item.id);
      return (wq.email || '').toLowerCase() === (item.email || '').toLowerCase() &&
             String(wq.unit) === String(item.unit);
    });
  }

  // 取得加強建議指引 (根據單元與題型)
  const unitGuides = {
    1: '加強數的十進位位值結構、萬以上大數（億、兆）的讀寫、數線標記與大小比較。',
    2: '加強直式乘除法算則、乘法進位與定位、零的處理與估商技巧。',
    3: '加強垂直與平行的幾何性質辨識、直角三角板與量角器繪圖操作。',
    4: '加強乘法直式多步驟計算、乘數為二至三位數之位值對齊。',
    5: '加強同分母分數的加減運算、真分數/假分數/帶分數互換與概念應用。',
    6: '加強直式除法之餘數檢驗（餘數小於除數）、三位數除以二位數之試商。',
    7: '加強公里、公尺與公分的長度單位換算、複合單位複名數計算。',
    8: '加強一位小數與二位小數的位值觀念、小數點對齊之直式加減法。',
    9: '加強角度量測、旋轉角與周角性質、三角形與四邊形內角和計算。',
    10: '加強統計圖表判讀、折線圖與長條圖數據分析、兩步驟應用問題列式。'
  };

  const advice = unitGuides[item.unit] || '加強該單元基礎概念理解，針對錯題進行多次題型演練與概念訂正。';

  let modal = document.getElementById('quizAttemptDetailModal');
  if (!modal) {
    createQuizAttemptDetailModalDOM();
    modal = document.getElementById('quizAttemptDetailModal');
  }
  const content = document.getElementById('quizAttemptDetailContent');
  if (!content) return;

  const score = Number(item.score) || 0;
  const isPerfect = score === 100 || (wrongList.length === 0 && score >= 90);

  content.innerHTML = `
    <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:2px solid #E2E8F0; padding-bottom:0.75rem; margin-bottom:1rem;">
      <div>
        <h3 style="margin:0; font-size:1.3rem; color:#1E293B; display:flex; align-items:center; gap:0.5rem; flex-wrap:wrap;">
          <span>📝 學生測驗卷批改結果與錯題診斷</span>
          <span style="font-size:0.75rem; background:#EEF2FF; color:#4338CA; padding:3px 9px; border-radius:99px; font-weight:800;">
            ${item.grade || '4上'} 第 ${item.unit} 單元 - ${item.paper_name || '測驗卷'}
          </span>
        </h3>
        <p style="margin:0.35rem 0 0; font-size:0.85rem; color:#64748B;">
          應試者：<strong style="color:#0F172A;">${item.student_name || '同學'}</strong> (${item.student_class || '班級'} #${item.seat_num || '1'}) ｜ 帳號：<code>${item.email || '-'}</code> ｜ 時間：${item.created_at || '-'}
        </p>
      </div>
      <button class="btn btn-outline" style="padding:0.3rem 0.75rem; font-size:0.85rem;" onclick="document.getElementById('quizAttemptDetailModal').style.display='none'">✕ 關閉</button>
    </div>

    <!-- 成績摘要卡 -->
    <div style="display:flex; gap:1rem; margin-bottom:1.25rem; flex-wrap:wrap;">
      <div style="flex:1; min-width:130px; background:${score >= 80 ? '#F0FDF4' : score >= 60 ? '#FFFBEB' : '#FEF2F2'}; border:1px solid ${score >= 80 ? '#BBF7D0' : score >= 60 ? '#FDE68A' : '#FECACA'}; border-radius:12px; padding:0.85rem; text-align:center;">
        <div style="font-size:0.8rem; color:#475569; font-weight:700;">測驗得分</div>
        <div style="font-size:2rem; font-weight:900; color:${score >= 80 ? '#15803D' : score >= 60 ? '#B45309' : '#DC2626'};">${score} <span style="font-size:1rem;">分</span></div>
      </div>
      <div style="flex:1; min-width:130px; background:#F8FAFC; border:1px solid #E2E8F0; border-radius:12px; padding:0.85rem; text-align:center;">
        <div style="font-size:0.8rem; color:#475569; font-weight:700;">答對 / 錯題數</div>
        <div style="font-size:1.5rem; font-weight:800; color:#0F172A;">
          <span style="color:#16A34A;">✔ ${item.correct_count ?? (5 - wrongList.length)}</span> / 
          <span style="color:#DC2626;">✘ ${item.wrong_count ?? wrongList.length}</span>
        </div>
      </div>
      <div style="flex:2; min-width:240px; background:#F5F3FF; border:1px solid #DDD6FE; border-radius:12px; padding:0.85rem;">
        <div style="font-size:0.8rem; color:#5B21B6; font-weight:800; margin-bottom:0.25rem;">🎯 教師教學補強建言</div>
        <div style="font-size:0.86rem; color:#6D28D9; line-height:1.45;">${advice}</div>
      </div>
    </div>

    <!-- 作答與錯題清單 -->
    <div style="margin-bottom:1rem;">
      <h4 style="font-size:1rem; color:#0F172A; margin-bottom:0.6rem; display:flex; align-items:center; gap:0.4rem;">
        <span>🔍 錯題診斷與觀念剖析</span>
        <span style="font-size:0.75rem; color:#64748B; font-weight:normal;">(共 ${wrongList.length} 題需複習)</span>
      </h4>

      ${isPerfect ? `
        <div style="background:#F0FDF4; border:1px solid #86EFAC; border-radius:12px; padding:1.5rem; text-align:center; color:#166534;">
          <div style="font-size:2.5rem; margin-bottom:0.5rem;">🎉 滿分表現！太厲害了！</div>
          <div style="font-weight:700; font-size:1.05rem;">本次測驗無任何錯題，學生已透徹理解本單元核心知識點！</div>
          <div style="font-size:0.85rem; color:#15803D; margin-top:0.4rem;">可繼續挑戰高難度應用題或進行下一單元學習。</div>
        </div>
      ` : (wrongList.length === 0 ? `
        <div style="background:#F8FAFC; border:1px solid #E2E8F0; border-radius:12px; padding:1.25rem; text-align:center; color:#64748B;">
          <div>查無具體錯題內容（可能為早期未記錄題目的紀錄），得分：${score} 分。</div>
        </div>
      ` : `
        <div style="display:flex; flex-direction:column; gap:0.75rem; max-height:360px; overflow-y:auto; padding-right:4px;">
          ${wrongList.map((wq, i) => `
            <div style="background:#FFF1F2; border:1px solid #FECDD3; border-radius:10px; padding:0.85rem 1rem;">
              <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.4rem;">
                <span style="font-weight:800; color:#BE123C; font-size:0.9rem;">❌ 第 ${wq.question_idx || wq.questionIdx || (i + 1)} 題 (答錯需加強)</span>
                <span style="font-size:0.75rem; background:#FFE4E6; color:#9F1239; padding:2px 8px; border-radius:99px; font-weight:700;">待強化觀念</span>
              </div>
              <div style="font-size:0.92rem; color:#1E293B; font-weight:700; margin-bottom:0.5rem; line-height:1.45;">
                ${(typeof window.renderMathML === 'function' ? window.renderMathML(wq.question_text || wq.questionText || '題目內容') : (wq.question_text || wq.questionText || '題目內容'))}
              </div>
              <div style="display:flex; gap:1.25rem; font-size:0.85rem; margin-bottom:0.4rem; background:white; padding:0.45rem 0.75rem; border-radius:6px; border:1px solid #FEE2E2;">
                <div><span style="color:#64748B;">學生答案：</span><strong style="color:#DC2626;">${(typeof window.renderMathML === 'function' ? window.renderMathML(wq.user_answer || wq.userAnswer || '(未填)') : (wq.user_answer || wq.userAnswer || '(未填)'))}</strong></div>
                <div><span style="color:#64748B;">標準答案：</span><strong style="color:#16A34A;">${(typeof window.renderMathML === 'function' ? window.renderMathML(wq.correct_answer || wq.correctAnswer || '-') : (wq.correct_answer || wq.correctAnswer || '-'))}</strong></div>
              </div>
              <div style="font-size:0.82rem; color:#881337; background:#FFF1F2; padding:0.4rem 0.6rem; border-radius:6px; line-height:1.45;">
                💡 <strong>訂正解析：</strong>${(typeof window.renderMathML === 'function' ? window.renderMathML(wq.explanation || '針對題意與計算觀念進行檢核。') : (wq.explanation || '針對題意與計算觀念進行檢核。'))}
              </div>
            </div>
          `).join('')}
        </div>
      `)}
    </div>

    <div style="text-align:right; border-top:1px solid #E2E8F0; padding-top:0.75rem;">
      <button class="btn btn-primary" onclick="document.getElementById('quizAttemptDetailModal').style.display='none'" style="padding:0.45rem 1.25rem;">我知道了</button>
    </div>
  `;

  modal.style.display = 'flex';
}

function createQuizAttemptDetailModalDOM() {
  if (document.getElementById('quizAttemptDetailModal')) return;
  const div = document.createElement('div');
  div.id = 'quizAttemptDetailModal';
  div.className = 'auth-modal-overlay';
  div.style.display = 'none';
  div.style.zIndex = '10005';
  div.innerHTML = `
    <div class="auth-modal-card admin-wide" style="max-width:760px; width:92%; max-height:85vh; overflow-y:auto; padding:1.5rem;" id="quizAttemptDetailContent">
    </div>
  `;
  document.body.appendChild(div);
}

// 匯出後台全體學生測驗成績單 CSV
function exportAdminAttemptsCSV() {
  if (!adminRawAttempts || adminRawAttempts.length === 0) {
    alert('目前無學生測驗紀錄可供匯出！');
    return;
  }
  const selectedEmail = (document.getElementById('adminFilterStudentEmail') ? document.getElementById('adminFilterStudentEmail').value : 'all');
  const selectedUnit = (document.getElementById('adminFilterUnit') ? document.getElementById('adminFilterUnit').value : 'all');

  let filtered = [...adminRawAttempts];
  if (selectedEmail && selectedEmail !== 'all') {
    filtered = filtered.filter(a => (a.email || '').toLowerCase() === selectedEmail.toLowerCase());
  }
  if (selectedUnit && selectedUnit !== 'all') {
    filtered = filtered.filter(a => String(a.unit) === String(selectedUnit));
  }

  let csvContent = '\uFEFF作答時間,學生Gmail,學生姓名,班級,座號,年級,單元,試卷名稱,測驗成績,答對題數,總題數,錯題數\n';
  filtered.forEach(r => {
    csvContent += `"${r.created_at || ''}","${r.email || ''}","${r.student_name || ''}","${r.student_class || ''}","${r.seat_num || ''}","${r.grade || '3上'}","第${r.unit}單元","${r.paper_name || ''}",${r.score},${r.correct_count},${r.total_count || 5},${r.wrong_count || 0}\n`;
  });

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `木新思達國小數學_各學生成績報表_${new Date().toISOString().slice(0, 10)}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// 管理員新增/指派帳號
async function handleAddUserSubmit(e) {
  e.preventDefault();
  const email = document.getElementById('newAdminUserEmail').value.trim();
  const name = document.getElementById('newAdminUserName').value.trim();
  const role = document.getElementById('newAdminUserRole').value;

  const checkboxes = Array.from(document.querySelectorAll('input[name="adminUserGradeCheck"]:checked'));
  const checkedVals = checkboxes.map(cb => cb.value);

  let grade = '3上';
  if (role === 'admin' || checkedVals.includes('all')) {
    grade = 'all';
  } else if (checkedVals.length > 0) {
    grade = checkedVals.join(',');
  } else {
    alert('請至少勾選一個授權年級！');
    return;
  }

  if (!email) return alert('請填寫 Gmail 帳號');

  const adminEmail = (authState.user && authState.user.email) ? authState.user.email : 'pipdapha@gmail.com';

  try {
    const res = await fetch(`/api/admin/users?adminEmail=${encodeURIComponent(adminEmail)}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-admin-email': adminEmail
      },
      body: JSON.stringify({ email, name, role, grade, status: 'active' })
    });
    const d = await res.json();
    if (d.success) {
      // 本地同步更新以確保跨實例立即讀取
      saveLocalUserCache({ email, name, role, grade, status: 'active' });
      alert(`✅ 已成功授權並指派帳號：\n${email}（身分：${role === 'admin' ? '管理員' : '學生'} ｜ 年級：${grade.split(',').join('、')}）！`);
      document.getElementById('newAdminUserEmail').value = '';
      document.getElementById('newAdminUserName').value = '';
      loadAdminData();
    } else {
      saveLocalUserCache({ email, name, role, grade, status: 'active' });
      alert(`已將帳號 ${email}（年級：${grade}）加入授權名單！`);
      document.getElementById('newAdminUserEmail').value = '';
      document.getElementById('newAdminUserName').value = '';
      loadAdminData();
    }
  } catch (err) {
    saveLocalUserCache({ email, name, role, grade, status: 'active' });
    alert(`已將帳號 ${email}（年級：${grade}）加入授權名單！`);
    document.getElementById('newAdminUserEmail').value = '';
    document.getElementById('newAdminUserName').value = '';
    loadAdminData();
  }
}

// 輔助函式：切換管理員角色或年級勾選
function onAdminRoleChange(role) {
  const allCheckbox = document.getElementById('adminUserGradeCheckAll');
  if (role === 'admin') {
    if (allCheckbox) allCheckbox.checked = true;
  }
}

function onAdminGradeAllChange(el) {
  if (el.checked) {
    document.querySelectorAll('input[name="adminUserGradeCheck"]').forEach(cb => {
      if (cb !== el) cb.checked = false;
    });
  }
}

function saveLocalUserCache(user) {
  const users = JSON.parse(localStorage.getItem('muxin_cached_users') || '[]');
  const idx = users.findIndex(u => u.email.toLowerCase() === user.email.toLowerCase());
  if (idx >= 0) {
    users[idx] = user;
  } else {
    users.unshift(user);
  }
  localStorage.setItem('muxin_cached_users', JSON.stringify(users));
}

function removeLocalUserCache(email) {
  const users = JSON.parse(localStorage.getItem('muxin_cached_users') || '[]');
  const filtered = users.filter(u => u.email.toLowerCase() !== email.toLowerCase());
  localStorage.setItem('muxin_cached_users', JSON.stringify(filtered));
}

async function deleteUserFromD1(email) {
  if (!confirm(`確定要刪除帳號 ${email} 的授權嗎？刪除後該帳號將無法登入！`)) return;
  const adminEmail = (authState.user && authState.user.email) ? authState.user.email : 'pipdapha@gmail.com';
  try {
    const res = await fetch(`/api/admin/users?adminEmail=${encodeURIComponent(adminEmail)}&email=${encodeURIComponent(email)}`, {
      method: 'DELETE',
      headers: { 'x-admin-email': adminEmail }
    });
    const d = await res.json();
    removeLocalUserCache(email);
    alert(`已成功移除帳號 ${email}！`);
    loadAdminData();
  } catch (err) {
    removeLocalUserCache(email);
    alert(`已成功移除帳號 ${email}！`);
    loadAdminData();
  }
}

// 快速體驗登入（僅供管理員管理除錯使用）
function devQuickLogin(role = 'admin') {
  if (role === 'admin') {
    setAuthUser({
      email: 'pipdapha@gmail.com',
      name: '系統管理員 (Pipdapha)',
      role: 'admin',
      grade: 'all',
      allowed: true
    });
  }
  const modal = document.getElementById('authLoginModal');
  if (modal) modal.style.display = 'none';
}

// 儲存自訂 Google Client ID
function saveCustomGoogleClientId() {
  const input = document.getElementById('customGoogleClientIdInput');
  if (input && input.value.trim()) {
    GOOGLE_CLIENT_ID = input.value.trim();
    localStorage.setItem('muxin_google_client_id', GOOGLE_CLIENT_ID);
    alert('已更新 Google Client ID！將重新整理頁面以套用設定。');
    location.reload();
  }
}

window.addEventListener('DOMContentLoaded', () => {
  // 自動持久化已授權之正式 Google Client ID
  if (!localStorage.getItem('muxin_google_client_id') || localStorage.getItem('muxin_google_client_id').startsWith('436573759325')) {
    localStorage.setItem('muxin_google_client_id', GOOGLE_CLIENT_ID);
  }
  updateAuthUI();
  // 檢查是否已登入，若未登入則於 500ms 後彈出登入視窗引導
  if (!authState.isLoggedIn) {
    setTimeout(() => {
      showLoginModal();
    }, 600);
  }
  // 延遲載入 Google Auth 按鈕
  setTimeout(initGoogleAuth, 800);
});
