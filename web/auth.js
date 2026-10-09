/* =========================================================
   木新思達 國小數學 - Google OAuth 與使用者登入狀態模組 (auth.js)
   ========================================================= */

// Google Client ID 管理：優先從 localStorage 讀取，亦可由管理員自訂設定
let GOOGLE_CLIENT_ID = localStorage.getItem('muxin_google_client_id') || '436573759325-v0k5a5e3m1b0s1k61f3k80g2l3m4n5o6.apps.googleusercontent.com';

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
    // 開發或展示環境備援機制 (如果尚未配置 Google Client ID，允許模擬體驗)
    handleAuthFallback(credential);
  }
}

// 設定已登入使用者
function setAuthUser(user) {
  authState.user = user;
  authState.isLoggedIn = true;
  authState.role = user.role || 'student';
  authState.grade = user.grade || '3上';

  localStorage.setItem('muxin_user_profile', JSON.stringify(user));
  if (user.name) {
    localStorage.setItem('kx_g3_name', user.name);
    if (typeof quizState !== 'undefined') {
      quizState.studentName = user.name;
    }
  }

  updateAuthUI();
}

// 登出
function logoutUser() {
  if (confirm('確定要登出 Google 帳號嗎？')) {
    localStorage.removeItem('muxin_user_profile');
    authState.user = null;
    authState.isLoggedIn = false;
    authState.role = 'student';
    authState.grade = '3上';

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
        userGradeBadge.textContent = `🎓 ${authState.user.grade || '3上'}`;
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

  listWrap.innerHTML = '<div style="padding:1rem; text-align:center;">載入 Cloudflare D1 授權名單中...</div>';

  try {
    const res = await fetch(`/api/admin/users?adminEmail=${encodeURIComponent(authState.user.email)}`, {
      headers: { 'x-admin-email': authState.user.email }
    });
    const data = await res.json();
    if (!res.ok || !data.success) {
      listWrap.innerHTML = `<div style="color:red; padding:1rem;">載入失敗：${data.error || '無權限'}</div>`;
      return;
    }

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
          ${data.users.map(u => `
            <tr style="border-bottom:1px solid #F1F5F9;">
              <td style="padding:0.6rem; font-weight:700;">${u.email}</td>
              <td style="padding:0.6rem;">${u.name || '-'}</td>
              <td style="padding:0.6rem;">
                <span style="padding:0.2rem 0.5rem; border-radius:999px; font-size:0.75rem; font-weight:700; background:${u.role === 'admin' ? '#EDE9FE; color:#6D28D9' : '#E0F2FE; color:#0369A1'}">
                  ${u.role === 'admin' ? '👑 管理員' : '🎓 學生'}
                </span>
              </td>
              <td style="padding:0.6rem; font-weight:700; color:#3B82F6;">${u.grade}</td>
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

    // 錯題統計總覽
    if (statsWrap) {
      statsWrap.innerHTML = `
        <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(130px, 1fr)); gap:0.75rem;">
          ${[1,2,3,4,5,6,7,8,9].map(u => {
            const found = data.wrongSummary.find(ws => ws.unit === u);
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

  } catch (err) {
    listWrap.innerHTML = `<div style="color:red; padding:1rem;">載入失敗：${err.message}</div>`;
  }
}

// 管理員新增/指派帳號
async function handleAddUserSubmit(e) {
  e.preventDefault();
  const email = document.getElementById('newAdminUserEmail').value.trim();
  const name = document.getElementById('newAdminUserName').value.trim();
  const role = document.getElementById('newAdminUserRole').value;
  const grade = document.getElementById('newAdminUserGrade').value;

  if (!email) return alert('請填寫 Gmail 帳號');

  try {
    const res = await fetch(`/api/admin/users?adminEmail=${encodeURIComponent(authState.user.email)}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-admin-email': authState.user.email
      },
      body: JSON.stringify({ email, name, role, grade, status: 'active' })
    });
    const d = await res.json();
    if (d.success) {
      alert(`已成功授權帳號 ${email}（年級：${grade}）！`);
      document.getElementById('newAdminUserEmail').value = '';
      document.getElementById('newAdminUserName').value = '';
      loadAdminData();
    } else {
      alert(`新增失敗：${d.error}`);
    }
  } catch (err) {
    alert(`系統發生錯誤：${err.message}`);
  }
}

async function deleteUserFromD1(email) {
  if (!confirm(`確定要刪除帳號 ${email} 的授權嗎？刪除後該帳號將無法登入！`)) return;
  try {
    const res = await fetch(`/api/admin/users?adminEmail=${encodeURIComponent(authState.user.email)}&email=${encodeURIComponent(email)}`, {
      method: 'DELETE',
      headers: { 'x-admin-email': authState.user.email }
    });
    const d = await res.json();
    if (d.success) {
      alert(`已成功刪除 ${email}`);
      loadAdminData();
    } else {
      alert(`刪除失敗：${d.error}`);
    }
  } catch (err) {
    alert(`系統錯誤：${err.message}`);
  }
}

// 快速體驗登入（供開發者測試或尚未填入正式 Google Client ID 時使用）
function devQuickLogin(role = 'admin') {
  if (role === 'admin') {
    setAuthUser({
      email: 'pipdapha@gmail.com',
      name: '系統管理員 (Pipdapha)',
      role: 'admin',
      grade: 'all',
      allowed: true
    });
  } else {
    setAuthUser({
      email: 'student.grade3@gmail.com',
      name: '小明同學',
      role: 'student',
      grade: '3上',
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
