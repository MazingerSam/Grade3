// Cloudflare Pages Functions - 測驗成績與錯題儲存 API
// 路徑: /api/quiz/record
import { queryD1 } from '../../_db.js';

export async function onRequestPost(context) {
  try {
    const { request, env } = context;
    const body = await request.json();
    const {
      email,
      studentName,
      studentClass,
      seatNum,
      grade = '3上',
      unit,
      paperIdx,
      paperName,
      score,
      correctCount,
      totalCount = 5,
      timeSpentSec = 0,
      wrongQuestions = [] // 錯題清單
    } = body;

    if (!email) {
      return new Response(JSON.stringify({ error: '使用者 Email 未提供' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const cleanEmail = email.toLowerCase().trim();

    // 0. 嚴格權限檢查：驗證帳號是否在 allowed_users 白名單中且狀態為 active
    const authCheck = await queryD1(env, `
      SELECT email, name, role, grade, status 
      FROM allowed_users 
      WHERE lower(email) = ?
    `, [cleanEmail]);

    if (!authCheck.results || authCheck.results.length === 0) {
      return new Response(JSON.stringify({
        error: '此帳號不在授權白名單中或已被管理員移除，拒絕記錄測驗成績！',
        unauthorized: true
      }), {
        status: 403,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const userRecord = authCheck.results[0];
    if (userRecord.status !== 'active') {
      return new Response(JSON.stringify({
        error: '此帳號已被停用，無法記錄測驗成績！',
        forbidden: true
      }), {
        status: 403,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // 0.1 年級權限核對：除了管理員與全學年帳號外，驗證帳號是否具備該年級權限 (支援 '3上,4上' 多年級設定)
    const userGrades = (userRecord.grade || '').split(',').map(g => g.trim());
    const hasGradePerm = (userRecord.role === 'admin') || userGrades.includes('all') || userGrades.includes(grade);
    if (!hasGradePerm) {
      return new Response(JSON.stringify({
        error: `年級權限不符：您的帳號授權年級為【${userRecord.grade}】，無法登記【${grade}】的測驗成績！`,
        forbidden: true
      }), {
        status: 403,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // 若為管理員試作且無特別填寫姓名，標註為管理員
    let effectiveStudentName = studentName || '';
    if (userRecord.role === 'admin' && (!effectiveStudentName || effectiveStudentName === '小小數學家')) {
      effectiveStudentName = (userRecord.name || '系統管理員') + ' (試作)';
    }

    // 1. 寫入 quiz_attempts 主紀錄
    const wrongCount = wrongQuestions.length;
    const insertAttempt = await queryD1(env, `
      INSERT INTO quiz_attempts (
        email, student_name, student_class, seat_num, grade,
        unit, paper_idx, paper_name, score, correct_count,
        total_count, wrong_count, time_spent_sec
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      cleanEmail,
      effectiveStudentName,
      studentClass || '',
      seatNum || '',
      grade,
      unit,
      paperIdx,
      paperName || '',
      score,
      correctCount,
      totalCount,
      wrongCount,
      timeSpentSec
    ]);

    const attemptId = (insertAttempt.meta && insertAttempt.meta.last_row_id) ? insertAttempt.meta.last_row_id : 1;

    // 2. 寫入錯題詳細紀錄 (供日後補救與評估增加練習)
    if (wrongQuestions.length > 0) {
      for (const wq of wrongQuestions) {
        await queryD1(env, `
          INSERT INTO wrong_questions (
            attempt_id, email, grade, unit, paper_idx,
            question_idx, question_text, user_answer, correct_answer, explanation
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [
          attemptId,
          cleanEmail,
          grade,
          unit,
          paperIdx,
          wq.questionIdx ?? 0,
          wq.questionText || '',
          String(wq.userAnswer || ''),
          String(wq.correctAnswer || ''),
          wq.explanation || ''
        ]);
      }
    }

    return new Response(JSON.stringify({
      success: true,
      attemptId,
      wrongCount,
      message: '測驗成績與錯題紀錄已成功同步！'
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (err) {
    return new Response(JSON.stringify({ error: '儲存測驗記錄失敗', detail: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

// 取得個人歷史成績與錯題統計清單
export async function onRequestGet(context) {
  try {
    const { request, env } = context;
    const url = new URL(request.url);
    const email = (url.searchParams.get('email') || '').toLowerCase().trim();

    if (!email) {
      return new Response(JSON.stringify({ error: '請提供 email 參數' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // 取得最近 30 次測驗紀錄
    const attempts = await queryD1(env, `
      SELECT * FROM quiz_attempts 
      WHERE lower(email) = ? 
      ORDER BY created_at DESC 
      LIMIT 30
    `, [email]);

    // 取得待複習的錯題 (以單元聚合)
    const wrongList = await queryD1(env, `
      SELECT * FROM wrong_questions 
      WHERE lower(email) = ? AND review_status = 'pending'
      ORDER BY created_at DESC 
      LIMIT 50
    `, [email]);

    return new Response(JSON.stringify({
      success: true,
      attempts: attempts.results || [],
      wrongQuestions: wrongList.results || []
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (err) {
    return new Response(JSON.stringify({ error: '讀取紀錄失敗', detail: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
