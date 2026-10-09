// Cloudflare Pages Functions - 管理員專區：使用者白名單管理、成績與錯題總覽
// 路徑: /api/admin/users
import { queryD1 } from '../../_db.js';

export async function onRequest(context) {
  const { request, env } = context;
  const url = new URL(request.url);
  const adminEmail = (request.headers.get('x-admin-email') || url.searchParams.get('adminEmail') || '').toLowerCase().trim();

  // 驗證是否為 admin
  if (!adminEmail) {
    return new Response(JSON.stringify({ error: '未授權訪問：缺少管理員憑證' }), { status: 401 });
  }

  const check = await queryD1(
    env,
    "SELECT role FROM allowed_users WHERE lower(email) = ? AND role = 'admin' AND status = 'active'",
    [adminEmail]
  );

  const adminCheck = (check.results && check.results.length > 0) ? check.results[0] : null;

  if (!adminCheck) {
    return new Response(JSON.stringify({ error: '權限不足：您不是系統管理員' }), { status: 403 });
  }

  // GET: 查詢所有使用者、近期測驗紀錄、錯題統計
  if (request.method === 'GET') {
    const users = await queryD1(env, "SELECT * FROM allowed_users ORDER BY role DESC, created_at DESC");
    const attempts = await queryD1(env, "SELECT * FROM quiz_attempts ORDER BY created_at DESC LIMIT 50");
    const wrongSummary = await queryD1(env, `
      SELECT unit, COUNT(*) as count 
      FROM wrong_questions 
      GROUP BY unit 
      ORDER BY unit ASC
    `);

    return new Response(JSON.stringify({
      success: true,
      users: users.results || [],
      recentAttempts: attempts.results || [],
      wrongSummary: wrongSummary.results || []
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  // POST: 新增或修改使用者 (email, name, role, grade, status)
  if (request.method === 'POST') {
    const body = await request.json();
    const { email, name, role = 'student', grade = '3上', status = 'active' } = body;

    if (!email) {
      return new Response(JSON.stringify({ error: 'Email 為必填欄位' }), { status: 400 });
    }

    await queryD1(env, `
      INSERT INTO allowed_users (email, name, role, grade, status, updated_at)
      VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
      ON CONFLICT(email) DO UPDATE SET
        name = excluded.name,
        role = excluded.role,
        grade = excluded.grade,
        status = excluded.status,
        updated_at = CURRENT_TIMESTAMP
    `, [email.toLowerCase().trim(), name || '', role, grade, status]);

    return new Response(JSON.stringify({ success: true, message: `已成功更新帳號 ${email}` }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  // DELETE: 刪除使用者
  if (request.method === 'DELETE') {
    const targetEmail = (url.searchParams.get('email') || '').toLowerCase().trim();
    if (!targetEmail) {
      return new Response(JSON.stringify({ error: '請指定要刪除的 email' }), { status: 400 });
    }

    // 防止刪除自身最後的管理員
    if (targetEmail === adminEmail) {
      return new Response(JSON.stringify({ error: '不可刪除當前登入之管理員帳號' }), { status: 400 });
    }

    await queryD1(env, "DELETE FROM allowed_users WHERE lower(email) = ?", [targetEmail]);
    return new Response(JSON.stringify({ success: true, message: `已成功刪除帳號 ${targetEmail}` }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  return new Response('Method Not Allowed', { status: 405 });
}
