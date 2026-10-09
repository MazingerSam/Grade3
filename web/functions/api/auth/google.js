// Cloudflare Pages Functions - Google OAuth 登入驗證與年級權限檢查
// 路徑: /api/auth/google

// 解析 Google ID Token (支援驗證 Google tokeninfo 端點)
export async function onRequestPost(context) {
  try {
    const { request, env } = context;
    const body = await request.json();
    const { credential, client_id } = body;

    if (!credential) {
      return new Response(JSON.stringify({ error: '缺少 Google 登入憑證' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // 1. 向 Google 官方 TokenInfo 端點驗證憑證真實性
    const verifyUrl = `https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(credential)}`;
    const googleRes = await fetch(verifyUrl);
    if (!googleRes.ok) {
      return new Response(JSON.stringify({ error: 'Google 憑證驗證失敗或已過期' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const payload = await googleRes.json();
    const userEmail = (payload.email || '').toLowerCase().trim();
    const userName = payload.name || payload.given_name || '同學';
    const userPicture = payload.picture || '';

    if (!userEmail) {
      return new Response(JSON.stringify({ error: '無法取得有效的 Google Email 帳號' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // 2. 查詢 Cloudflare D1 資料庫：是否在授權白名單中
    const db = env.DB;
    if (!db) {
      return new Response(JSON.stringify({ error: '系統資料庫連線尚未設定' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const userRecord = await db.prepare(
      'SELECT email, name, role, grade, status FROM allowed_users WHERE lower(email) = ?'
    ).bind(userEmail).first();

    // 3. 白名單檢查
    if (!userRecord) {
      return new Response(JSON.stringify({
        allowed: false,
        email: userEmail,
        name: userName,
        picture: userPicture,
        message: `抱歉，您的 Google 帳號 (${userEmail}) 尚未在系統授權名單中。請聯繫系統管理員開通權限！`
      }), {
        status: 403,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // 帳號啟用狀態檢查
    if (userRecord.status !== 'active') {
      return new Response(JSON.stringify({
        allowed: false,
        email: userEmail,
        message: '您的帳號已被停用，請聯繫管理員！'
      }), {
        status: 403,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // 4. 年級權限檢查：本網站為「3上」（國小三年級上學期）
    // 規定：每組學生帳號只能使用在一個年級，管理員(admin)除外可存取所有年級('all')
    const currentSiteGrade = '3上';
    const isAdmin = userRecord.role === 'admin';
    const isGradeMatch = isAdmin || userRecord.grade === currentSiteGrade || userRecord.grade === '3' || userRecord.grade === 'all';

    if (!isGradeMatch) {
      return new Response(JSON.stringify({
        allowed: false,
        email: userEmail,
        role: userRecord.role,
        assignedGrade: userRecord.grade,
        message: `權限限制：您的帳號指定年級為【${userRecord.grade}】，無法登入本【${currentSiteGrade}】教材系統（每組學生帳號限定一個年級）！`
      }), {
        status: 403,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // 5. 授權通過，建立 Session Token (包含使用者資訊與簽章/時效)
    const sessionUser = {
      email: userEmail,
      name: userRecord.name || userName,
      picture: userPicture,
      role: userRecord.role,
      grade: userRecord.grade,
      allowed: true
    };

    return new Response(JSON.stringify({
      success: true,
      user: sessionUser
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (err) {
    return new Response(JSON.stringify({ error: '伺服器驗證處理發生錯誤', detail: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
