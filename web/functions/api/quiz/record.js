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

    // 1. 寫入 quiz_attempts 主紀錄
    const wrongCount = wrongQuestions.length;
    const insertAttempt = await queryD1(env, `
      INSERT INTO quiz_attempts (
        email, student_name, student_class, seat_num, grade,
        unit, paper_idx, paper_name, score, correct_count,
        total_count, wrong_count, time_spent_sec
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
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
          email.toLowerCase(),
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
