// Cloudflare Pages Functions - 測驗成績與錯題儲存 API
// 路徑: /api/quiz/record

export async function onRequestPost(context) {
  try {
    const { request, env } = context;
    const db = env.DB;
    if (!db) {
      return new Response(JSON.stringify({ error: '資料庫連線失敗' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

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

    // 1. 寫入 quiz_attempts 主紀錄
    const wrongCount = wrongQuestions.length;
    const insertAttempt = await db.prepare(`
      INSERT INTO quiz_attempts (
        email, student_name, student_class, seat_num, grade,
        unit, paper_idx, paper_name, score, correct_count,
        total_count, wrong_count, time_spent_sec
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
      email.toLowerCase(),
      studentName || '',
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
    ).run();

    const attemptId = insertAttempt.meta.last_row_id;

    // 2. 批次寫入錯題詳細紀錄 (供日後補救與評估增加練習)
    if (wrongQuestions.length > 0 && attemptId) {
      const stmt = db.prepare(`
        INSERT INTO wrong_questions (
          attempt_id, email, grade, unit, paper_idx,
          question_idx, question_text, user_answer, correct_answer, explanation
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);

      const batchQueries = wrongQuestions.map(wq => {
        return stmt.bind(
          attemptId,
          email.toLowerCase(),
          grade,
          unit,
          paperIdx,
          wq.questionIdx ?? 0,
          wq.questionText || '',
          String(wq.userAnswer || ''),
          String(wq.correctAnswer || ''),
          wq.explanation || ''
        );
      });

      await db.batch(batchQueries);
    }

    return new Response(JSON.stringify({
      success: true,
      attemptId,
      wrongCount,
      message: '測驗成績與錯題紀錄已成功同步至 D1 資料庫！'
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
    const db = env.DB;
    const url = new URL(request.url);
    const email = (url.searchParams.get('email') || '').toLowerCase().trim();

    if (!email) {
      return new Response(JSON.stringify({ error: '請提供 email 參數' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // 取得最近 30 次測驗紀錄
    const attempts = await db.prepare(`
      SELECT * FROM quiz_attempts 
      WHERE lower(email) = ? 
      ORDER BY created_at DESC 
      LIMIT 30
    `).bind(email).all();

    // 取得待複習的錯題 (以單元聚合)
    const wrongList = await db.prepare(`
      SELECT * FROM wrong_questions 
      WHERE lower(email) = ? AND review_status = 'pending'
      ORDER BY created_at DESC 
      LIMIT 50
    `).bind(email).all();

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
