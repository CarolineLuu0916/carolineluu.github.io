/* AI Trends 数据更新脚本（多版块）
 *
 * 用法：node scripts/update-trends.mjs <section>
 *   section ∈ daily | repos | wiki | models | timeline | skills（缺省为 daily）
 *
 * - daily   ：Kimi 联网调研，在 data-reports.js 头部插入当日日报（已有今日则跳过）
 * - repos   ：用 GitHub API 抓真实 star 数，精确刷新 data-repos.js（确定性、无 LLM）
 * - wiki    ：Kimi 调研，给 data-wiki.js 追加「值得新增的概念」词条（只增不改旧词条）
 * - models  ：Kimi 调研，给 data-models.js 追加新发布/大更新的模型（只增不改）
 * - timeline：Kimi 调研，给 data-timeline.js 最新一幕追加「进化节点」级大事件（只增不改）
 * - skills  ：Kimi 调研，给 data-skills.js 追加新出现的 Agent Skill（只增不改）
 *
 * 安全原则：① 拿不到内容 / 解析失败 / 插入后语法非法 → 直接放弃(exit 1)，绝不写坏文件；
 *           ② LLM 版块一律「只追加」，从不改写已有手写内容；写入前用 new Function 校验文件仍合法。
 *
 * 环境变量：KIMI_API_KEY（LLM 版块必需）；GITHUB_TOKEN（repos 版块可选，提升 API 限额）。
 */

import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const AIT = join(ROOT, "ai-trends");
const INDEX = join(AIT, "index.html");
const F = {
  reports: join(AIT, "js", "data-reports.js"),
  repos: join(AIT, "js", "data-repos.js"),
  wiki: join(AIT, "js", "data-wiki.js"),
  models: join(AIT, "js", "data-models.js"),
  timeline: join(AIT, "js", "data-timeline.js"),
  skills: join(AIT, "js", "data-skills.js"),
};

const SECTION = (process.argv[2] || "daily").toLowerCase();
const API_KEY = process.env.KIMI_API_KEY;
// kimi-k2.6：当前旗舰多模态推理模型，256k 上下文（moonshot-v1-32k 是旧代classic生成模型，
// 检索整合能力弱很多）。官方文档明确推荐 k2.6 搭配 $web_search（上下文够大，扛得住搜索结果注入）。
const MODEL = process.env.KIMI_MODEL || "kimi-k2.6";
const BASE = "https://api.moonshot.cn/v1";

/* ---------- 通用工具 ---------- */
const read = (p) => readFileSync(p, "utf8");
const write = (p, s) => writeFileSync(p, s, "utf8");
const q = (s) => JSON.stringify(String(s ?? ""));
const pad = (n) => String(n).padStart(2, "0");
const escapeRe = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

function shanghaiNow() {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Shanghai", year: "numeric", month: "2-digit", day: "2-digit",
    hour: "2-digit", minute: "2-digit", hour12: false,
  }).formatToParts(new Date());
  const get = (t) => parts.find((p) => p.type === t).value;
  const y = +get("year"), m = +get("month"), d = +get("day");
  const hh = get("hour") === "24" ? "00" : get("hour"), mm = get("minute");
  const dow = new Date(Date.UTC(y, m - 1, d, 12)).getUTCDay();
  const weekday = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"][dow];
  const date = `${y}-${pad(m)}-${pad(d)}`;
  const compact = `${y}${pad(m)}${pad(d)}`;
  return { date, weekday, compact, stamp: `${compact}${hh}${mm}` };
}
const NOW = shanghaiNow();

// 刷新 index.html 的缓存版本号（带时分，确保同一天多次更新也能破缓存）
function bumpVersion() {
  const idx = read(INDEX).replace(/(\?v=)[0-9a-zA-Z]+/g, `$1${NOW.stamp}`);
  write(INDEX, idx);
}
// 把首个 updated: "YYYY-MM-DD" 改成今天
function bumpUpdated(text) {
  return text.replace(/updated:\s*"\d{4}-\d{2}-\d{2}"/, `updated: "${NOW.date}"`);
}
// 写入前校验：把文件当 JS 跑一遍（window.X = {...}），确保仍合法且目标对象存在
function validate(text, globalKey) {
  const win = {};
  // eslint-disable-next-line no-new-func
  new Function("window", text)(win);
  if (!win[globalKey]) throw new Error(`校验失败：${globalKey} 未定义（插入可能破坏了文件结构）`);
  return win[globalKey];
}
// 在「数组起始标记」之后插入一段（即追加到数组头部）
function insertAfter(text, marker, block) {
  const at = text.indexOf(marker);
  if (at < 0) throw new Error(`找不到插入标记：${marker}`);
  const pos = at + marker.length;
  return text.slice(0, pos) + block + ",\n" + text.slice(pos);
}

/* ---------- Kimi（含 $web_search 工具循环） ---------- */
async function kimi(messages, tools) {
  const res = await fetch(`${BASE}/chat/completions`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${API_KEY}` },
    // $web_search 要求关闭 thinking 模式（官方文档：k2.6 思考模式与内置联网搜索暂不兼容）。
    body: JSON.stringify({
      model: MODEL, temperature: 0.6, max_tokens: 4096, messages, tools,
      thinking: { type: "disabled" },
    }),
  });
  if (!res.ok) throw new Error(`Kimi API ${res.status}: ${await res.text()}`);
  return (await res.json()).choices[0];
}
async function research(sys, user) {
  if (!API_KEY) throw new Error("缺少环境变量 KIMI_API_KEY");
  const tools = [{ type: "builtin_function", function: { name: "$web_search" } }];
  const messages = [{ role: "system", content: sys }, { role: "user", content: user }];
  for (let i = 0; i < 8; i++) {
    const choice = await kimi(messages, tools);
    const msg = choice.message;
    if (choice.finish_reason === "tool_calls" && msg.tool_calls?.length) {
      messages.push(msg);
      for (const call of msg.tool_calls) {
        messages.push({ role: "tool", tool_call_id: call.id, name: call.function.name, content: call.function.arguments });
      }
      continue;
    }
    return msg.content;
  }
  throw new Error("Kimi 工具循环超过上限仍未给出最终结果");
}
function extractJSON(raw) {
  const s = raw.indexOf("{"), e = raw.lastIndexOf("}");
  if (s < 0 || e < 0) throw new Error("Kimi 返回中找不到 JSON：\n" + raw.slice(0, 600));
  return JSON.parse(raw.slice(s, e + 1));
}

/* ============ daily：日报（头部插入） ============ */
async function updateDaily() {
  const text = read(F.reports);
  const lastVol = +((text.match(/vol:\s*"VOL\.(\d+)"/) || [])[1] || 0);
  const lastDate = (text.match(/date:\s*"(\d{4}-\d{2}-\d{2})"/) || [])[1];
  const headlines = [...text.matchAll(/headline:\s*"([^"]+)"/g)].slice(0, 3).map((m) => m[1]);
  if (lastDate === NOW.date) { console.log(`✓ ${NOW.date} 已有今日日报，跳过。`); return false; }

  const vol = `VOL.${String(lastVol + 1).padStart(3, "0")}`;
  const sys = [
    "你是 AI Agent 行业观察站「AI Trends」的资深主编（产品经理视角）。",
    "任务：联网调研最近 24~48 小时全球 AI / AI Agent 行业动态，产出今天的一条行业日报。",
    "硬性规范：",
    "1) 信息必须真实、多源交叉验证，禁止编造；拿不准的标注「待确认」。",
    "2) 每条要闻必须有 what（发生了什么，客观，1~2句）、detail（展开详情：背景/具体数据/多方反应，120~220字，比 what 更丰富，不是同义重复）、why（意味着什么，产品经理视角）。",
    "3) 每条要闻尽量给出 url：信息最权威的原文链接（官方博客/官方公告/权威媒体报道页面，真实存在，不要编造或猜测链接；确实找不到可靠链接就留空字符串）。",
    "4) region 与 tag 一一对应：海外=gl、中国=cn、开源=os、生态=eco。",
    "5) 额外检索学术圈：若最近 1~2 周内有真正重要的新论文/技术报告（arXiv、顶会 NeurIPS/ICML/ICLR/ACL，或 OpenAI/DeepMind/Anthropic/Google/Meta 等实验室的研究博客），挑 0~2 篇放进 papers；宁缺毋滥，找不到合适的就给空数组，禁止编造论文。每篇要给真实 url（如 arxiv.org 链接）。",
    "6) 不要重复已有旧闻。已有最近标题：" + headlines.map((h) => `「${h}」`).join("、"),
    "只输出一个 JSON 对象（无任何额外文字、不要 markdown），结构：",
    `{"headline":"今日主标题","tldr":"200字内导语，可含<b>…</b>","vane":[{"label":"风向标签","dir":"up或down","note":"简短理由"}],"items":[{"region":"海外","tag":"gl","title":"标题（结尾带日期如（6.15））","what":"…","detail":"…","why":"…","url":"https://…"}],"papers":[{"title":"论文标题","authors":"作者(简写，如 First Author et al.)","venue":"arXiv/NeurIPS等","date":"如2026.06","url":"https://arxiv.org/...","summary":"论文讲了什么","why":"对行业/产品意味着什么"}]}`,
    "vane 3~4 条；items 4~5 条按重要性排序，region 尽量覆盖 海外/中国/开源/生态。",
  ].join("\n");
  const obj = extractJSON(await research(sys, `今天是 ${NOW.date}（${NOW.weekday}）。请联网调研后输出今日日报 JSON。`));
  if (!obj.headline || !obj.tldr || !Array.isArray(obj.vane) || !Array.isArray(obj.items) || !obj.items.length)
    throw new Error("日报 JSON 字段不完整");
  const papers = Array.isArray(obj.papers) ? obj.papers.filter((p) => p && p.title && p.summary && p.why) : [];

  const vane = obj.vane.map((v) => `      { label: ${q(v.label)}, dir: ${q(v.dir)}, note: ${q(v.note)} }`).join(",\n");
  const items = obj.items.map((it) => [
    "      {", `        region: ${q(it.region)}, tag: ${q(it.tag)},`,
    `        title: ${q(it.title)},`, `        what: ${q(it.what)},`, `        detail: ${q(it.detail)},`,
    `        why: ${q(it.why)}, url: ${q(it.url)}`, "      }",
  ].join("\n")).join(",\n");
  const papersBlock = papers.length ? papers.map((p) => [
    "      {", `        title: ${q(p.title)}, authors: ${q(p.authors)}, venue: ${q(p.venue)}, date: ${q(p.date)},`,
    `        url: ${q(p.url)},`, `        summary: ${q(p.summary)},`, `        why: ${q(p.why)}`, "      }",
  ].join("\n")).join(",\n") : "";
  const block = [
    "  {", `    date: ${q(NOW.date)}, vol: ${q(vol)}, weekday: ${q(NOW.weekday)},`,
    `    headline: ${q(obj.headline)},`, `    tldr: ${q(obj.tldr)},`,
    "    vane: [", vane, "    ],", "    items: [", items, "    ],",
    "    papers: [", papersBlock, "    ]",
    "  }",
  ].join("\n");

  const next = insertAfter(text, "window.AIT_REPORTS = [\n", block);
  validate(next, "AIT_REPORTS");
  write(F.reports, next);
  console.log(`✓ 已写入日报「${obj.headline}」（${vol}，${obj.items.length} 条要闻，${papers.length} 篇论文）`);
  return true;
}

/* ============ repos：GitHub API 刷新 star（确定性） ============ */
async function ghStars(full) {
  const headers = { "User-Agent": "ai-trends-bot", Accept: "application/vnd.github+json" };
  if (process.env.GITHUB_TOKEN) headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  const res = await fetch(`https://api.github.com/repos/${full}`, { headers });
  if (!res.ok) { console.warn(`  · star 抓取失败 ${full}: ${res.status}`); return null; }
  const j = await res.json();
  return typeof j.stargazers_count === "number" ? j.stargazers_count : null;
}
async function updateRepos() {
  let text = read(F.repos);
  const repos = [...text.matchAll(/repo:\s*"([^"]+)"/g)].map((m) => m[1]);
  let changed = 0;
  for (const full of repos) {
    const stars = await ghStars(full);
    if (stars == null) continue;
    const re = new RegExp(`(repo:\\s*"${escapeRe(full)}",\\s*stars:\\s*)\\d+`);
    const m = text.match(re);
    if (m && +m[0].match(/\d+$/)[0] !== stars) { text = text.replace(re, `$1${stars}`); changed++; }
  }
  if (!changed) { console.log("✓ star 数无变化（或抓取受限），未改动。"); return false; }
  text = bumpUpdated(text);
  validate(text, "AIT_REPOS");
  write(F.repos, text);
  console.log(`✓ 已刷新 ${changed} 个仓库的 star 数。`);
  return true;
}

/* ============ 通用「只追加」LLM 版块 ============ */
// cfg: { file, globalKey, marker, useLastMarker, existing(text)=>Set, sys, user, valid(item), serialize(item) }
async function appendBySection(cfg) {
  const text0 = read(cfg.file);
  const have = cfg.existing(text0);
  const obj = extractJSON(await research(cfg.sys, cfg.user));
  let add = Array.isArray(obj.add) ? obj.add : [];
  add = add.filter((it) => cfg.valid(it) && !have.has(cfg.key(it)));
  if (!add.length) { console.log("✓ 没有确实值得新增的条目，未改动。"); return false; }

  const block = add.map(cfg.serialize).join(",\n");
  const marker = cfg.useLastMarker
    ? text0.slice(text0.lastIndexOf(cfg.marker)).slice(0, cfg.marker.length)
    : cfg.marker;
  let next;
  if (cfg.useLastMarker) {
    const at = text0.lastIndexOf(cfg.marker);
    const pos = at + cfg.marker.length;
    next = text0.slice(0, pos) + block + ",\n" + text0.slice(pos);
  } else {
    next = insertAfter(text0, cfg.marker, block);
  }
  next = bumpUpdated(next);
  validate(next, cfg.globalKey);
  write(cfg.file, next);
  console.log(`✓ 已新增 ${add.length} 条：${add.map((a) => cfg.key(a)).join("、")}`);
  return true;
}

const updateWiki = () => appendBySection({
  file: F.wiki, globalKey: "AIT_WIKI", marker: "terms: [\n", key: (it) => it.id,
  existing: (t) => new Set([...t.matchAll(/id:\s*"([^"]+)"/g)].map((m) => m[1])),
  valid: (it) => it.id && it.zh && it.brief && it.body && it.pm && it.fresh && ["basics", "tech", "eco", "bench"].includes(it.cat),
  sys: [
    "你是 AI Trends 百科主编。任务：联网调研最近一周 AI Agent 行业动态，判断是否出现「值得收录的新概念/术语」。",
    "只输出 JSON：{\"add\":[{\"id\":\"英文短slug\",\"cat\":\"basics|tech|eco|bench\",\"zh\":\"中文名\",\"en\":\"英文名(大写)\",\"brief\":\"一句话定义\",\"body\":\"详解\",\"pm\":\"产品视角\",\"fresh\":\"结合最新动态的补充\"}]}",
    "宁缺毋滥：只收真正重要、已被广泛讨论的新概念；信息必须真实、禁止编造；没有就返回 {\"add\":[]}。不要与已有词条重复。",
  ].join("\n"),
  user: `今天 ${NOW.date}。请联网调研后，按规范给出值得新增的百科词条 JSON。`,
  serialize: (it) => [
    "    {", `      id: ${q(it.id)}, cat: ${q(it.cat)}, zh: ${q(it.zh)}, en: ${q(it.en)},`,
    `      brief: ${q(it.brief)},`, `      body: ${q(it.body)},`, `      pm: ${q(it.pm)},`, `      fresh: ${q(it.fresh)}`, "    }",
  ].join("\n"),
});

const updateModels = () => appendBySection({
  file: F.models, globalKey: "AIT_MODELS", marker: "items: [\n", key: (it) => it.name,
  existing: (t) => new Set([...t.matchAll(/name:\s*"([^"]+)"/g)].map((m) => m[1])),
  valid: (it) => it.name && it.vendor && it.pos && it.fit && ["flagship", "openintl", "china", "light"].includes(it.group)
    && Array.isArray(it.specs) && Array.isArray(it.pros) && Array.isArray(it.cons),
  sys: [
    "你是 AI Trends 模型图鉴主编。任务：联网调研最近发布或大版本更新的 AI 模型。",
    "只输出 JSON：{\"add\":[{\"name\":\"\",\"vendor\":\"\",\"group\":\"flagship|openintl|china|light\",\"access\":\"闭源|开源\",\"date\":\"如2026.06\",\"pos\":\"一句话定位\",\"specs\":[\"上下文/价格/特性\",\"…\"],\"pros\":[\"优点\",\"…\"],\"cons\":[\"缺点\",\"…\"],\"fit\":\"适合谁\"}]}",
    "优缺点用「使用视角」写、不替厂商说话；价格/基准须真实有据，禁止编造；没有新模型就返回 {\"add\":[]}。不要与已有模型重复。",
  ].join("\n"),
  user: `今天 ${NOW.date}。请联网调研后，给出值得新增的模型 JSON。`,
  serialize: (it) => [
    `    { name: ${q(it.name)}, vendor: ${q(it.vendor)}, group: ${q(it.group)}, access: ${q(it.access)}, date: ${q(it.date)},`,
    `      pos: ${q(it.pos)},`,
    `      specs: [${it.specs.map(q).join(", ")}],`,
    `      pros: [${it.pros.map(q).join(", ")}],`,
    `      cons: [${it.cons.map(q).join(", ")}],`,
    `      fit: ${q(it.fit)} }`,
  ].join("\n"),
});

const updateSkills = () => appendBySection({
  file: F.skills, globalKey: "AIT_SKILLS", marker: "items: [\n", key: (it) => it.name,
  existing: (t) => new Set([...t.matchAll(/name:\s*"([^"]+)"/g)].map((m) => m[1])),
  valid: (it) => it.name && it.tagline && it.what && it.why && it.source
    && ["office", "design", "figma", "motion", "cloud", "devflow", "meta", "example"].includes(it.cat),
  sys: [
    "你是 AI Trends 技能库主编。任务：联网调研最近新出现的、真实可用的 Agent Skill（SKILL.md 生态）。",
    "只输出 JSON：{\"add\":[{\"name\":\"\",\"cat\":\"office|design|figma|motion|cloud|devflow|meta|example\",\"source\":\"官方|Cloudflare|GSAP|社区\",\"gh\":\"owner/repo或留空\",\"tagline\":\"一句话定位\",\"what\":\"做什么\",\"why\":\"对工作流意味着什么\"}]}",
    "只收真实存在、来源可考的 Skill，禁止编造；没有就返回 {\"add\":[]}。不要与已有 Skill 重复。",
  ].join("\n"),
  user: `今天 ${NOW.date}。请联网调研后，给出值得新增的 Agent Skill JSON。`,
  serialize: (it) => [
    `    { name: ${q(it.name)}, cat: ${q(it.cat)}, source: ${q(it.source)}${it.gh ? `, gh: ${q(it.gh)}` : ""},`,
    `      tagline: ${q(it.tagline)},`, `      what: ${q(it.what)},`, `      why: ${q(it.why)} }`,
  ].join("\n"),
});

// timeline：追加到「最新一幕」的 events（用最后一个 events: [ 标记）
const updateTimeline = () => appendBySection({
  file: F.timeline, globalKey: "AIT_TIMELINE", marker: "events: [\n", useLastMarker: true, key: (it) => it.title,
  existing: (t) => new Set([...t.matchAll(/title:\s*"([^"]+)"/g)].map((m) => m[1])),
  valid: (it) => it.date && it.title && it.desc && it.tag,
  sys: [
    "你是 AI Trends 时间线主编。任务：联网调研，判断最近是否发生了「进化节点」级别的 AI Agent 大事件（极高门槛，宁缺毋滥）。",
    "只输出 JSON：{\"add\":[{\"date\":\"如2026.06\",\"title\":\"\",\"tag\":\"技术|模型|产品|开源|研究|协议\",\"desc\":\"为何是里程碑\"}]}",
    "只收真正改变行业走向的大节点，禁止编造；绝大多数情况下应返回 {\"add\":[]}。不要与已有事件重复。",
  ].join("\n"),
  user: `今天 ${NOW.date}。请联网调研后，给出（若有）值得记入时间线的大节点 JSON。`,
  serialize: (it) => [
    `      { date: ${q(it.date)}, title: ${q(it.title)}, tag: ${q(it.tag)},`,
    `        desc: ${q(it.desc)} }`,
  ].join("\n"),
});

/* ============ 主流程 ============ */
const HANDLERS = { daily: updateDaily, repos: updateRepos, wiki: updateWiki, models: updateModels, timeline: updateTimeline, skills: updateSkills };

async function main() {
  const fn = HANDLERS[SECTION];
  if (!fn) { console.error(`✗ 未知 section：${SECTION}（可选 ${Object.keys(HANDLERS).join("/")}）`); process.exit(1); }
  console.log(`→ 更新版块：${SECTION}（${NOW.date} ${NOW.weekday}，model=${MODEL}）`);
  const changed = await fn();
  if (changed) { bumpVersion(); console.log(`✓ 已刷新缓存版本号 ?v=${NOW.stamp}`); }
  else console.log("（无变化，未触碰 index.html）");
}
main().catch((err) => { console.error("✗ 更新失败：", err.message); process.exit(1); });
