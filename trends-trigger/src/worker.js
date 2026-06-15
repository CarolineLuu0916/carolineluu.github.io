/* AI Trends 触发器 Worker
 *
 * 两个入口都只做一件事：调 GitHub API 触发 daily-update.yml 工作流（workflow_dispatch）。
 *   - scheduled(): Cloudflare 定时器每天稳定触发 → 真正的「每天自动更新」
 *   - fetch():     网页「一键更新」按钮 POST 过来时触发 → 「网页一键」
 *
 * GitHub 令牌（GH_PAT）只存在 Worker secret 里，绝不进前端。
 * 工作流脚本本身有「今天已有日报就跳过」的去重，所以即使被重复触发也几乎零成本；
 * 且本仓库是 public，GitHub Actions 分钟数免费 —— 滥用影响可忽略（要更严可后续加 Turnstile/冷却）。
 */

const OWNER = "CarolineLuu0916";
const REPO = "carolineluu.github.io";
const WORKFLOW = "daily-update.yml";
const SECTIONS = new Set(["daily", "repos", "wiki", "models", "timeline", "skills"]);

// 允许从这些来源的网页按钮调用（CORS）。其它来源浏览器会拦下。
const ALLOW_ORIGINS = [
  "https://carolineluu0916.github.io", // GitHub Pages 线上
  "http://localhost:8766",             // 本地预览 ai-trends
  "http://localhost:4321",             // 本地预览 portfolio
  "http://127.0.0.1:8766",
  "http://127.0.0.1:4321",
];

async function dispatch(env, section) {
  if (!env.GH_PAT) throw new Error("缺少 GH_PAT secret");
  const sec = SECTIONS.has(section) ? section : "daily";
  const res = await fetch(
    `https://api.github.com/repos/${OWNER}/${REPO}/actions/workflows/${WORKFLOW}/dispatches`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${env.GH_PAT}`,
        Accept: "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28",
        "User-Agent": "ai-trends-trigger",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ref: "main", inputs: { section: sec } }), // 在 main 分支上触发指定板块
    }
  );
  if (res.status !== 204) {
    throw new Error(`GitHub API ${res.status}: ${await res.text()}`);
  }
  return sec;
}

function corsHeaders(origin) {
  const allow = ALLOW_ORIGINS.includes(origin) ? origin : ALLOW_ORIGINS[0];
  return {
    "Access-Control-Allow-Origin": allow,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Vary": "Origin",
  };
}

export default {
  // 定时触发：Cloudflare 每天按 cron 调用（只跑日报）
  async scheduled(event, env, ctx) {
    ctx.waitUntil(dispatch(env, "daily"));
  },

  // 网页按钮触发
  async fetch(request, env) {
    const origin = request.headers.get("Origin") || "";
    const cors = corsHeaders(origin);

    if (request.method === "OPTIONS") {
      return new Response(null, { headers: cors });
    }
    if (request.method !== "POST") {
      return new Response("AI Trends trigger is alive. POST here to fire a daily-report update.", {
        status: 200,
        headers: { ...cors, "Content-Type": "text/plain; charset=utf-8" },
      });
    }
    let section = "daily";
    try {
      const body = await request.json();
      if (body && body.section) section = String(body.section);
    } catch { /* 无 body 则默认 daily */ }
    try {
      const sec = await dispatch(env, section);
      return Response.json({ ok: true, section: sec }, { headers: cors });
    } catch (e) {
      return Response.json({ ok: false, error: String(e && e.message || e) }, { status: 502, headers: cors });
    }
  },
};
