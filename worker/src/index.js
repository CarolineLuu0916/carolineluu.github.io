/**
 * MY App — World API Worker
 *
 * 公开端点（无需 token）：
 *   GET  /api/world          → 当前世界状态（第几天、版本号）
 *   GET  /api/versions       → 版本发布历史
 *   GET  /api/reviews?day=N  → 某天的用户评价
 *
 * 私有端点（需 Authorization: Bearer <token>，仅 Caroline 使用）：
 *   POST /api/auth           → {password} → {token}
 *   POST /api/agent/chat     → {message}  → {reply}（有持久记忆）
 *   GET  /api/agent/memory   → 全部对话历史
 *   POST /api/world/endday   → 结束今天：生成用户评价 + 世界日 +1
 *   POST /api/world/meeting  → 生成团队会议纪要
 *   POST /api/world/release  → {v, changelog, minutes} → 发版，更新全局版本号
 *
 * Worker Secrets（在 wrangler secret put 里设置，不写代码里）：
 *   WORLD_PASSWORD   锁屏密码（明文，单用户）
 *   JWT_SECRET       签 token 用的随机长字符串
 *   AGENT_API_KEY    DeepSeek / 任意 OpenAI 兼容模型的 API key
 *
 * Worker Variables（在 wrangler.toml 或 dashboard 里设置）：
 *   AGENT_BASE_URL   默认 https://api.deepseek.com
 *   AGENT_MODEL      默认 deepseek-chat
 */

const TOKEN_TTL    = 30 * 24 * 3600 * 1000; // 30天
const MEMORY_LIMIT = 40;                      // 载入最近 40 轮对话给 LLM
const DEFAULT_BASE = 'https://api.deepseek.com';
const DEFAULT_MODEL = 'deepseek-chat';

/* ── CORS ──────────────────────────────────────────────────────────── */
const ALLOWED_ORIGINS = [
  'https://carolineluu0916.github.io',
  'http://localhost:8123',
  'http://127.0.0.1:8123',
];

function corsHeaders(origin) {
  const o = ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];
  return {
    'Access-Control-Allow-Origin': o,
    'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type,Authorization',
    'Access-Control-Max-Age': '86400',
  };
}

function json(data, status = 200, origin = '') {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json', ...corsHeaders(origin) },
  });
}

/* ── HMAC-SHA256 token（无需外部库）──────────────────────────────── */
async function makeToken(secret) {
  const payload = { exp: Date.now() + TOKEN_TTL };
  const data    = btoa(JSON.stringify(payload));
  const key     = await crypto.subtle.importKey(
    'raw', new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']
  );
  const sig = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(data));
  return `${data}.${btoa(String.fromCharCode(...new Uint8Array(sig)))}`;
}

async function verifyToken(token, secret) {
  if (!token) return false;
  const [data, sigB64] = token.split('.');
  if (!data || !sigB64) return false;
  try {
    const key = await crypto.subtle.importKey(
      'raw', new TextEncoder().encode(secret),
      { name: 'HMAC', hash: 'SHA-256' }, false, ['verify']
    );
    const sig   = Uint8Array.from(atob(sigB64), c => c.charCodeAt(0));
    const valid = await crypto.subtle.verify('HMAC', key, sig, new TextEncoder().encode(data));
    if (!valid) return false;
    const { exp } = JSON.parse(atob(data));
    return Date.now() < exp;
  } catch { return false; }
}

function getBearerToken(request) {
  const auth = request.headers.get('Authorization') || '';
  return auth.startsWith('Bearer ') ? auth.slice(7) : '';
}

/* ── LLM 调用（OpenAI 兼容接口）────────────────────────────────── */
async function llmCall(messages, env, opts = {}) {
  const base  = env.AGENT_BASE_URL  || DEFAULT_BASE;
  const model = env.AGENT_MODEL     || DEFAULT_MODEL;
  const res = await fetch(`${base}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${env.AGENT_API_KEY}`,
    },
    body: JSON.stringify({
      model,
      messages,
      max_tokens:  opts.maxTokens  ?? 1024,
      temperature: opts.temperature ?? 0.7,
    }),
  });
  if (!res.ok) throw new Error(`LLM ${res.status}: ${await res.text()}`);
  return (await res.json()).choices[0].message.content;
}

/* ── 主处理器 ───────────────────────────────────────────────────── */
export default {
  async fetch(request, env) {
    const origin = request.headers.get('Origin') || '';
    const { pathname: path, searchParams } = new URL(request.url);

    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: corsHeaders(origin) });
    }

    try {

      /* ── 公开端点 ─────────────────────────────────────────────── */

      // POST /api/auth
      if (path === '/api/auth' && request.method === 'POST') {
        const { password } = await request.json().catch(() => ({}));
        if (!password || password !== env.WORLD_PASSWORD) {
          return json({ ok: false, error: '密码错误' }, 401, origin);
        }
        const token = await makeToken(env.JWT_SECRET);
        return json({ ok: true, token }, 200, origin);
      }

      // GET /api/world
      if (path === '/api/world' && request.method === 'GET') {
        const w = await env.DB.prepare('SELECT * FROM world WHERE id = 1').first();
        return json(w ?? { day: 1, version: 'v1.0' }, 200, origin);
      }

      // GET /api/versions
      if (path === '/api/versions' && request.method === 'GET') {
        const { results } = await env.DB.prepare(
          'SELECT * FROM versions ORDER BY released_at DESC LIMIT 20'
        ).all();
        return json(results, 200, origin);
      }

      // GET /api/reviews?day=N
      if (path === '/api/reviews' && request.method === 'GET') {
        const day = searchParams.get('day');
        const stmt = day
          ? env.DB.prepare('SELECT * FROM reviews WHERE day = ? ORDER BY id ASC').bind(+day)
          : env.DB.prepare('SELECT * FROM reviews ORDER BY day DESC, id ASC LIMIT 100');
        const { results } = await stmt.all();
        return json(results, 200, origin);
      }

      /* ── 鉴权检查（以下端点均需 token）───────────────────────── */
      const authed = await verifyToken(getBearerToken(request), env.JWT_SECRET);
      if (!authed) return json({ ok: false, error: '未授权' }, 401, origin);

      /* ── 私有端点 ─────────────────────────────────────────────── */

      // GET /api/agent/memory
      if (path === '/api/agent/memory' && request.method === 'GET') {
        const { results } = await env.DB.prepare(
          'SELECT role, content, created_at FROM agent_memory ORDER BY id ASC'
        ).all();
        return json(results, 200, origin);
      }

      // POST /api/agent/remember —— 只存不调模型(前端用「世界内大脑」对话,把每轮结果写回 D1)
      if (path === '/api/agent/remember' && request.method === 'POST') {
        const { turns } = await request.json().catch(() => ({}));
        const rows = Array.isArray(turns) ? turns.filter(t => t && t.role && t.content) : [];
        if (!rows.length) return json({ ok: false, error: 'turns 为空' }, 400, origin);
        const now = new Date().toISOString();
        await env.DB.batch(rows.map(t =>
          env.DB.prepare('INSERT INTO agent_memory (role, content, created_at) VALUES (?, ?, ?)')
            .bind(t.role, String(t.content).slice(0, 4000), now)
        ));
        return json({ ok: true, saved: rows.length }, 200, origin);
      }

      // POST /api/agent/chat
      if (path === '/api/agent/chat' && request.method === 'POST') {
        const { message } = await request.json().catch(() => ({}));
        if (!message?.trim()) return json({ ok: false, error: '消息不能为空' }, 400, origin);

        // 读取最近 N 轮记忆（倒序取后反转=时间正序）
        const { results: history } = await env.DB.prepare(
          'SELECT role, content FROM agent_memory ORDER BY id DESC LIMIT ?'
        ).bind(MEMORY_LIMIT).all();

        const sysPrompt = `你是 Caroline 手机里的私人 AI 助理，你陪伴她记录生活、整理思绪、处理信息。
她是一名 AI 产品设计师，正在打造个人作品集，手边有 DeepSeek、Kimi、MiniMax 三个模型可用。
你有持续的记忆——你记得我们之前聊过的一切，不会因为页面刷新或换设备而遗忘。
回复简洁温暖，中文为主，必要时可用英文术语。不要每次都重复介绍自己。`;

        const messages = [
          { role: 'system', content: sysPrompt },
          ...history.reverse(),
          { role: 'user', content: message },
        ];

        const reply = await llmCall(messages, env, { maxTokens: 800 });
        const now   = new Date().toISOString();

        await env.DB.batch([
          env.DB.prepare('INSERT INTO agent_memory (role, content, created_at) VALUES (?, ?, ?)')
            .bind('user', message, now),
          env.DB.prepare('INSERT INTO agent_memory (role, content, created_at) VALUES (?, ?, ?)')
            .bind('assistant', reply, now),
        ]);

        return json({ ok: true, reply }, 200, origin);
      }

      // POST /api/world/endday
      if (path === '/api/world/endday' && request.method === 'POST') {
        const w   = await env.DB.prepare('SELECT * FROM world WHERE id = 1').first();
        const day = w?.day ?? 1;

        // LLM 生成当天用户评价
        let reviews = [];
        try {
          const raw = await llmCall([
            { role: 'system', content: `你是虚拟 AI 车主 APP「MY」的用户评价生成器。生成第${day}天结束时的真实用户评价（4条），JSON 数组格式（只输出数组，无其他文字）：[{"stars":1-5,"content":"评价内容（30-60字）","keep":true 或 false}]。keep=true 表示用户会继续使用。星级要有分布，有正有负。` },
            { role: 'user', content: `生成第${day}天评价。` },
          ], env, { temperature: 0.9 });
          const s = raw.indexOf('['), e = raw.lastIndexOf(']');
          if (s >= 0 && e >= 0) reviews = JSON.parse(raw.slice(s, e + 1));
        } catch (err) {
          console.error('[endday] 评价生成失败:', err.message);
        }

        const now      = new Date().toISOString();
        const nextDay  = day + 1;
        const stmts    = reviews.map(r =>
          env.DB.prepare(
            'INSERT INTO reviews (day, stars, content, keep, created_at) VALUES (?, ?, ?, ?, ?)'
          ).bind(day, r.stars, r.content, r.keep ? 1 : 0, now)
        );
        stmts.push(
          env.DB.prepare('UPDATE world SET day = ?, updated_at = ? WHERE id = 1')
            .bind(nextDay, now)
        );
        await env.DB.batch(stmts);

        return json({ ok: true, day: nextDay, reviews }, 200, origin);
      }

      // POST /api/world/meeting
      if (path === '/api/world/meeting' && request.method === 'POST') {
        const w = await env.DB.prepare('SELECT * FROM world WHERE id = 1').first();
        const day = w?.day ?? 1;

        const { results: recentReviews } = await env.DB.prepare(
          'SELECT day, stars, keep, content FROM reviews ORDER BY day DESC LIMIT 60'
        ).all();

        const reviewText = recentReviews
          .map(r => `第${r.day}天 ⭐${r.stars} ${r.keep ? '留存' : '流失'}：${r.content}`)
          .join('\n');

        const minutes = await llmCall([
          { role: 'system', content: '你是「MY」APP 开发团队的首席产品经理，正主持阶段性产品复盘会议。请生成正式会议纪要（200字内），包含：① 数据摘要（留存率、平均星级） ② 核心用户反馈 ③ 下一版本 3 条改进方向。语气专业，结尾加一句鼓励团队的话。' },
          { role: 'user', content: `当前世界日：第${day}天\n近期评价：\n${reviewText}` },
        ], env, { maxTokens: 600 });

        return json({ ok: true, day, minutes }, 200, origin);
      }

      // POST /api/world/release
      if (path === '/api/world/release' && request.method === 'POST') {
        const { v, changelog, minutes } = await request.json().catch(() => ({}));
        if (!v?.trim()) return json({ ok: false, error: '缺少版本号' }, 400, origin);

        const now = new Date().toISOString();
        const w   = await env.DB.prepare('SELECT day FROM world WHERE id = 1').first();

        await env.DB.batch([
          env.DB.prepare(
            'INSERT INTO versions (v, day, changelog, minutes, released_at) VALUES (?, ?, ?, ?, ?)'
          ).bind(v, w?.day ?? 1, changelog ?? '', minutes ?? '', now),
          env.DB.prepare('UPDATE world SET version = ?, updated_at = ? WHERE id = 1')
            .bind(v, now),
        ]);

        return json({ ok: true, v }, 200, origin);
      }

      return json({ error: 'Not Found' }, 404, origin);

    } catch (err) {
      console.error('[worker error]', err.message);
      return json({ ok: false, error: err.message }, 500, origin);
    }
  },
};
