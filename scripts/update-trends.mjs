/* AI Trends 每日自动更新脚本
 *
 * 作用：调用 Kimi（自带联网搜索）调研最近 24 小时 AI Agent 行业动态，
 *       按 ai-trends/README.md 的更新规范，在 data-reports.js 头部插入一条新日报，
 *       并刷新 index.html 的 ?v= 缓存版本号。历史日报原样保留。
 *
 * 运行环境：Node 18+（用到全局 fetch）。由 .github/workflows/daily-update.yml 每天定时触发。
 * 必需环境变量：KIMI_API_KEY
 * 可选环境变量：KIMI_MODEL（默认 kimi-k2-0711-preview）
 *
 * 设计原则：拿不到新内容 / 解析失败 → 报错退出(exit 1)，绝不写入垃圾；
 *           今天已有日报 → 跳过(exit 0)，不重复插入。
 */

import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const REPORTS = join(ROOT, "ai-trends", "js", "data-reports.js");
const INDEX = join(ROOT, "ai-trends", "index.html");

const API_KEY = process.env.KIMI_API_KEY;
const MODEL = process.env.KIMI_MODEL || "moonshot-v1-32k";
const BASE = "https://api.moonshot.cn/v1";

if (!API_KEY) {
  console.error("✗ 缺少环境变量 KIMI_API_KEY");
  process.exit(1);
}

/* ---------- 时间：以 Asia/Shanghai 为准 ---------- */
function shanghaiToday() {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Shanghai", year: "numeric", month: "2-digit", day: "2-digit",
  }).formatToParts(new Date());
  const get = (t) => parts.find((p) => p.type === t).value;
  const y = +get("year"), m = +get("month"), d = +get("day");
  const dow = new Date(Date.UTC(y, m - 1, d, 12)).getUTCDay();
  const weekday = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"][dow];
  const date = `${y}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
  const compact = `${y}${String(m).padStart(2, "0")}${String(d).padStart(2, "0")}`;
  return { date, weekday, compact };
}

/* ---------- 读现有日报，取最新 vol / date / headline ---------- */
function readState() {
  const text = readFileSync(REPORTS, "utf8");
  const vol = (text.match(/vol:\s*"VOL\.(\d+)"/) || [])[1];
  const date = (text.match(/date:\s*"(\d{4}-\d{2}-\d{2})"/) || [])[1];
  const headlines = [...text.matchAll(/headline:\s*"([^"]+)"/g)].slice(0, 3).map((m) => m[1]);
  return { text, lastVol: vol ? +vol : 0, lastDate: date, headlines };
}

/* ---------- 调 Kimi（含 $web_search 工具循环） ---------- */
async function kimi(messages, tools) {
  const res = await fetch(`${BASE}/chat/completions`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${API_KEY}` },
    body: JSON.stringify({ model: MODEL, temperature: 0.3, max_tokens: 4096, messages, tools }),
  });
  if (!res.ok) throw new Error(`Kimi API ${res.status}: ${await res.text()}`);
  return (await res.json()).choices[0];
}

async function research(state, today) {
  const tools = [{ type: "builtin_function", function: { name: "$web_search" } }];
  const sys = [
    "你是 AI Agent 行业观察站「AI Trends」的资深主编（产品经理视角）。",
    "任务：联网调研最近 24~48 小时全球 AI / AI Agent 行业动态，产出今天的一条行业日报。",
    "硬性规范：",
    "1) 信息必须真实、多源交叉验证，禁止编造；拿不准的在文中标注「待确认」。",
    "2) 每条要闻必须有 what（发生了什么，客观）和 why（意味着什么，产品经理视角的洞察）。",
    "3) region 取值与 tag 一一对应：海外=gl、中国=cn、开源=os、生态=eco。",
    "4) 不要重复网站已有的旧闻。已有最近标题：" + state.headlines.map((h) => `「${h}」`).join("、"),
    "",
    "只输出一个 JSON 对象（不要任何额外文字、不要 markdown 代码块），结构严格如下：",
    `{
  "headline": "今日主标题（一句话点出本日主线，可用「」强调）",
  "tldr": "200字内导语，可含 <b>…</b> 标签强调关键词",
  "vane": [ {"label":"风向标签","dir":"up 或 down","note":"简短理由"}, … 共3~4条 ],
  "items": [
    {"region":"海外","tag":"gl","title":"要闻标题（结尾带日期，如（6.13））","what":"发生了什么","why":"对产品/行业意味着什么"},
    … 共4~5条，按重要性排序，region 尽量覆盖 海外/中国/开源/生态
  ]
}`,
  ].join("\n");

  const messages = [
    { role: "system", content: sys },
    { role: "user", content: `今天是 ${today.date}（${today.weekday}）。请联网调研后输出今日日报 JSON。` },
  ];

  // 工具循环：Kimi 决定调用 $web_search 时，把 arguments 原样回传，由 Kimi 服务端执行搜索
  for (let i = 0; i < 8; i++) {
    const choice = await kimi(messages, tools);
    const msg = choice.message;
    if (choice.finish_reason === "tool_calls" && msg.tool_calls?.length) {
      messages.push(msg);
      for (const call of msg.tool_calls) {
        messages.push({
          role: "tool",
          tool_call_id: call.id,
          name: call.function.name,
          content: call.function.arguments, // $web_search：原样回传参数
        });
      }
      continue;
    }
    return msg.content; // 最终回答
  }
  throw new Error("Kimi 工具循环超过上限仍未给出最终结果");
}

/* ---------- 把 Kimi 返回的文本解析成报告对象 ---------- */
function parseReport(raw) {
  const start = raw.indexOf("{");
  const end = raw.lastIndexOf("}");
  if (start < 0 || end < 0) throw new Error("Kimi 返回中找不到 JSON:\n" + raw);
  const obj = JSON.parse(raw.slice(start, end + 1));
  if (!obj.headline || !obj.tldr || !Array.isArray(obj.vane) || !Array.isArray(obj.items) || !obj.items.length) {
    throw new Error("Kimi 返回的 JSON 字段不完整:\n" + JSON.stringify(obj, null, 2));
  }
  return obj;
}

/* ---------- 序列化成与现有文件完全一致的 JS 字面量块 ---------- */
function serialize(report, meta) {
  const q = (s) => JSON.stringify(String(s ?? ""));
  const vane = report.vane
    .map((v) => `      { label: ${q(v.label)}, dir: ${q(v.dir)}, note: ${q(v.note)} }`)
    .join(",\n");
  const items = report.items
    .map((it) =>
      [
        "      {",
        `        region: ${q(it.region)}, tag: ${q(it.tag)},`,
        `        title: ${q(it.title)},`,
        `        what: ${q(it.what)},`,
        `        why: ${q(it.why)}`,
        "      }",
      ].join("\n"))
    .join(",\n");
  return [
    "  {",
    `    date: ${q(meta.date)}, vol: ${q(meta.vol)}, weekday: ${q(meta.weekday)},`,
    `    headline: ${q(report.headline)},`,
    `    tldr: ${q(report.tldr)},`,
    "    vane: [",
    vane,
    "    ],",
    "    items: [",
    items,
    "    ]",
    "  }",
  ].join("\n");
}

/* ---------- 主流程 ---------- */
async function main() {
  const today = shanghaiToday();
  const state = readState();

  if (state.lastDate === today.date) {
    console.log(`✓ ${today.date} 已有今日日报，跳过。`);
    return;
  }

  const vol = `VOL.${String(state.lastVol + 1).padStart(3, "0")}`;
  console.log(`→ 调研中… 目标：${today.date} ${vol}（${MODEL}）`);

  const raw = await research(state, today);
  const report = parseReport(raw);
  console.log(`→ 已生成日报：「${report.headline}」 要闻 ${report.items.length} 条`);

  const block = serialize(report, { date: today.date, vol, weekday: today.weekday });

  // 插入到数组头部（紧跟 "window.AIT_REPORTS = [" 之后），历史保留
  const marker = "window.AIT_REPORTS = [\n";
  if (!state.text.includes(marker)) throw new Error("data-reports.js 结构异常，找不到数组起始标记");
  const next = state.text.replace(marker, marker + block + ",\n");
  writeFileSync(REPORTS, next, "utf8");
  console.log(`✓ 已写入 ${REPORTS}`);

  // 刷新 index.html 缓存版本号
  const idx = readFileSync(INDEX, "utf8").replace(/(\?v=)[0-9a-zA-Z]+/g, `$1${today.compact}`);
  writeFileSync(INDEX, idx, "utf8");
  console.log(`✓ 已刷新缓存版本号 ?v=${today.compact}`);
}

main().catch((err) => {
  console.error("✗ 更新失败：", err.message);
  process.exit(1);
});
