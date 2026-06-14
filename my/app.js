/* ===========================================================
   MY 智能车主 APP · 交互原型逻辑
   =========================================================== */
"use strict";
const $  = (s, p=document) => p.querySelector(s);
const $$ = (s, p=document) => [...p.querySelectorAll(s)];

/* ---------- v16 沙盘模式：看板用户的个性化手机 ----------
   dashboard 以 index.html?sim=<uid> 打开 iframe,并提前把人设+世界记忆
   写入 localStorage my-sim-profile;每位用户拥有独立的状态存档。 */
const SIM = (() => {
  try {
    const uid = new URLSearchParams(location.search).get("sim");
    if (!uid) return null;
    const p = JSON.parse(localStorage.getItem("my-sim-profile") || "null");
    return (p && p.id === uid) ? p : { id: uid, name: "访客" };
  } catch (e) { return null; }
})();
const STATE_KEY = SIM ? "aiva-state-sim-" + SIM.id : "aiva-state";

/* 车主本人(上帝视角)的人设与长期记忆,由 ME.md 维护,启动时注入 system */
let ME_DOC = "";
if (!SIM) fetch("ME.md").then(r => r.ok ? r.text() : "").then(t => { ME_DOC = (t || "").slice(0, 1000); }).catch(() => {});

/* ---------- 持久化状态 ---------- */
const DEFAULT_STATE = {
  user: null,                  // {phone,name,gender,birthDate,birthTime,hourIdx}
  xp: 36, level: 2,
  chats: 0,
  coupons: [],
  orders: [],
  slots: null,                 // 本时辰牌阵 {k:cycleKey, cards:[ci,...]}
  agent: null,                 // 智能体接入 {key, model}（仅存本机）
  /* v10 助理内核 */
  userModel: { state: "calm", stress: 0, concise: false, caredAt: 0 },   // 用户状态建模
  moodLog: [],                 // 可解释情绪日志 [{m,c,t}]
  tasks: [],                   // 任务中心 [{type,title,state,note,t}]
  guard: { limit: 100, auto: "balanced", perms: { wechat: true, alipay: true, dianping: true, amap: true, meituan: true, taobao: true } },
  /* R2 通知治理:勿扰时段+类型开关;urgent(警告级)始终打断;被拦截的进汇总栏 queue */
  notify: { dnd: false, from: "22:00", to: "08:00", types: { remind: true, guard: true, life: true }, queue: [] },
  locked: true, ac: false, acTemp: 24, windowOpen: false, trunkOpen: false,
};
let S;
try { S = Object.assign({}, DEFAULT_STATE, JSON.parse(localStorage.getItem(STATE_KEY) || "{}")); }
catch (e) { S = { ...DEFAULT_STATE }; }
const save = () => localStorage.setItem(STATE_KEY, JSON.stringify(S));
/* 沙盘用户免注册:用人设直接落户,生辰按 uid 派生(保证牌阵稳定且各不相同) */
if (SIM && !S.user) {
  let h = 0; for (let i = 0; i < SIM.id.length; i++) h = (h * 31 + SIM.id.charCodeAt(i)) >>> 0;
  S.user = {
    phone: "139****" + String(1000 + h % 9000),
    name: SIM.name, gender: "f",
    birthDate: `199${h % 8}-0${1 + h % 9}-1${h % 9}`,
    birthTime: `0${8 + h % 2}:30`, hourIdx: 4 + (h % 3),
  };
  save();
}

/* ---------- 工具 ---------- */
function hashStr(str) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619); }
  return h >>> 0;
}
function toast(msg, ms = 2200) {
  const t = $("#toast");
  t.textContent = msg; t.classList.remove("hidden");
  clearTimeout(t._tm); t._tm = setTimeout(() => t.classList.add("hidden"), ms);
}
/* sleep 走 Web Worker 计时器：页面在后台被节流时,流程依然准点推进 */
let _slpW = null, _slpId = 0; const _slpMap = {};
try {
  _slpW = new Worker(URL.createObjectURL(new Blob(
    ["onmessage=e=>{setTimeout(()=>postMessage(e.data.id),e.data.ms)}"], { type: "text/javascript" })));
  _slpW.onmessage = e => { const f = _slpMap[e.data]; delete _slpMap[e.data]; f && f(); };
} catch (_) { _slpW = null; }
const sleep = ms => new Promise(r => {
  if (_slpW) { const id = ++_slpId; _slpMap[id] = r; _slpW.postMessage({ id, ms }); }
  else setTimeout(r, ms);
});
window.sleep = sleep;

/* ---------- MY 车灵形象 ----------
   线条勾勒的灵动小兔：一只耳朵俏皮地弯着，圆头短身小圆尾 */
/* MY 形象：边界模糊的光球 / 星云。
   情绪→颜色(setMood 给 .orb-wrap 加情绪类，CSS 切 --c1/--c2)；活跃度→跃动频率(--spd)。
   纯 CSS 分层(外晕/星云旋臂/核心球/高光)，随容器尺寸自适应，所有场景统一复用。 */
function orbHTML() {
  return `<span class="myorb"><i class="o-glow"></i><i class="o-wisp"></i><i class="o-core"></i><i class="o-hi"></i></span>`;
}
function mascotSVG()   { return orbHTML(); }   // 对话主体 / 登录 / 人格页
function bunnyHeadSVG(){ return orbHTML(); }   // APP图标 / 桌面小组件 / 通知 / 高德车灵卡
window.bunnyHeadSVG = bunnyHeadSVG;
window.orbHTML = orbHTML;
/* ---------- 线性图标系统（统一 24 viewBox / stroke 1.7 / 圆角线帽） ---------- */
const ICON_PATHS = {
  car:      `<path d="M4 16.2v-2.4l1.8-1 2.3-4.2c.4-.8 1-1.1 1.9-1.1h4c.9 0 1.5.3 2 1l2.9 4.3 1.6.9v2.5"/><path d="M4 16.2h3.2M10 16.2h4.4M17.2 16.2H20"/><circle cx="8.4" cy="16.6" r="1.6"/><circle cx="15.8" cy="16.6" r="1.6"/>`,
  crystal:  `<circle cx="12" cy="10.2" r="6.2"/><path d="M9 19.8h6M10 16.2l-.6 3.6M14 16.2l.6 3.6"/><path d="M9.2 8.4a3.4 3.4 0 0 1 2.4-2.3"/>`,
  planet:   `<circle cx="12" cy="12" r="5.4"/><path d="M6.9 10.2c-3 1.5-4.8 3.1-4.3 4.2.5 1.2 4.1.8 8.3-.9M17.1 13.8c3-1.5 4.8-3.1 4.3-4.2-.5-1.2-4.1-.8-8.3.8"/>`,
  user:     `<circle cx="12" cy="8" r="3.6"/><path d="M5 20c.8-3.5 3.5-5.3 7-5.3s6.2 1.8 7 5.3"/>`,
  lock:     `<rect x="5" y="11" width="14" height="9" rx="2.5"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>`,
  unlock:   `<rect x="5" y="11" width="14" height="9" rx="2.5"/><path d="M8 11V8a4 4 0 0 1 7.6-1.7"/>`,
  snow:     `<path d="M12 3v18M4.2 7.5l15.6 9M19.8 7.5l-15.6 9"/>`,
  window:   `<rect x="4.5" y="5" width="15" height="14" rx="2.4"/><path d="M12 5v14M4.5 12h15"/>`,
  pin:      `<path d="M12 21c4.2-4.4 6.3-7.8 6.3-10.5a6.3 6.3 0 1 0-12.6 0C5.7 13.2 7.8 16.6 12 21z"/><circle cx="12" cy="10.4" r="2.2"/>`,
  trunk:    `<rect x="4" y="7.5" width="16" height="12" rx="2.4"/><path d="M9.2 7.5V6a1.8 1.8 0 0 1 1.8-1.8h2A1.8 1.8 0 0 1 14.8 6v1.5M4 12.5h16"/>`,
  bolt:     `<path d="M13.2 2.5 5.5 13.2h5.3L10.8 21.5l7.7-10.7h-5.3z"/>`,
  gear:     `<circle cx="12" cy="12" r="3.1"/><path d="M12 3.2v2.4M12 18.4v2.4M3.2 12h2.4M18.4 12h2.4M5.8 5.8l1.7 1.7M16.5 16.5l1.7 1.7M18.2 5.8l-1.7 1.7M7.5 16.5l-1.7 1.7"/>`,
  doc:      `<path d="M6.5 3.5h7.2l4 4.2v12.8H6.5z"/><path d="M13.5 3.5v4.4h4.2M9.5 13h5M9.5 16.3h5"/>`,
  map:      `<path d="M9 4.5 3.8 6.3v13.2L9 17.7l6 1.8 5.2-1.8V4.5L15 6.3 9 4.5z"/><path d="M9 4.5v13.2M15 6.3v13.2"/>`,
  lifebuoy: `<circle cx="12" cy="12" r="8.6"/><circle cx="12" cy="12" r="3.8"/><path d="M6 6l3.2 3.2M14.8 14.8 18 18M18 6l-3.2 3.2M9.2 14.8 6 18"/>`,
  sun:      `<circle cx="12" cy="12" r="4"/><path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6 7 7M17 17l1.4 1.4M18.4 5.6 17 7M7 17l-1.4 1.4"/>`,
  moon:     `<path d="M20 13.5A8 8 0 1 1 10.5 4 6.5 6.5 0 0 0 20 13.5z"/>`,
  cloudsun: `<circle cx="16.5" cy="7" r="2.8"/><path d="M16.5 2.6v1.2M20.9 7h-1.2M19.6 3.9l-.9.9"/><path d="M6.8 19h7.6a3.3 3.3 0 0 0 .5-6.6A4.6 4.6 0 0 0 6 13.9 2.9 2.9 0 0 0 6.8 19z"/>`,
  sunset:   `<path d="M12 4v3M5.3 7.8l1.6 1.6M18.7 7.8l-1.6 1.6M7.6 15.5a4.4 4.4 0 0 1 8.8 0"/><path d="M3 15.5h2.4M18.6 15.5H21M3.8 19h16.4"/>`,
  rain:     `<path d="M6.8 14.5h8.6a3.3 3.3 0 0 0 .5-6.6A4.6 4.6 0 0 0 7 8.9a3 3 0 0 0-.2 5.6z"/><path d="M8.6 17l-.7 2.2M12.4 17l-.7 2.2M16.2 17l-.7 2.2"/>`,
  gift:     `<rect x="4.5" y="9.8" width="15" height="9.7" rx="1.6"/><path d="M12 9.8v9.7M4.5 13.6h15"/><path d="M12 9.8C10.6 7.2 8.8 5.9 7.6 6.9c-1.2 1 .5 2.9 4.4 2.9zm0 0c1.4-2.6 3.2-3.9 4.4-2.9 1.2 1-.5 2.9-4.4 2.9z"/>`,
  sparkle:  `<path d="M12 3.5l1.8 5 5 1.8-5 1.8-1.8 5-1.8-5-5-1.8 5-1.8z"/><path d="M18.8 15.6l.9 2.4 2.4.9-2.4.9-.9 2.4-.9-2.4-2.4-.9 2.4-.9z"/>`,
  bubbles:  `<circle cx="9.2" cy="10.4" r="5"/><circle cx="16.6" cy="15" r="3.6"/><circle cx="15" cy="5.6" r="1.7"/>`,
  road:     `<path d="M5.5 20.5 9.3 3.5M18.5 20.5 14.7 3.5M12 5v2.6M12 10.8v2.6M12 16.6v2.7"/>`,
  users:    `<circle cx="9" cy="8.6" r="3.1"/><path d="M3.4 19.4c.6-3 2.8-4.6 5.6-4.6s5 1.6 5.6 4.6"/><path d="M15.4 5.9a3.1 3.1 0 0 1 0 5.4M17.3 14.6c1.8.8 3 2.1 3.4 4.3"/>`,
  lantern:  `<ellipse cx="12" cy="12.2" rx="4.8" ry="5.8"/><path d="M9.6 5.6h4.8M9.6 18.8h4.8M12 3.4v2.2M12 18.8v1.8"/>`,
  compass:  `<circle cx="12" cy="12" r="8.4"/><path d="M15.4 8.6l-1.8 5-5 1.8 1.8-5z"/>`,
  leaf:     `<path d="M18.8 5.2C11.4 5.2 6.6 9 6 15c-.1 1.4-.6 2.7-1.6 3.8 2.3.7 8.1 1.6 11.6-1.9 3.6-3.6 2.8-11.7 2.8-11.7z"/><path d="M5.6 17.4c2-4.2 5.6-7.2 9.4-8.8"/>`,
  droplet:  `<path d="M12 3.6S6.2 9.8 6.2 13.9a5.8 5.8 0 0 0 11.6 0C17.8 9.8 12 3.6 12 3.6z"/>`,
  check:    `<circle cx="12" cy="12" r="8.4"/><path d="M8.4 12.4l2.5 2.5 4.7-5.2"/>`,
  coffee:   `<path d="M5 8.5h10.6v5.7a4.8 4.8 0 0 1-4.8 4.8h-1A4.8 4.8 0 0 1 5 14.2z"/><path d="M15.6 9.8h1.5a2.3 2.3 0 0 1 0 4.6h-1.5M8.2 5.4c0-.9.6-1.1.6-2M11.6 5.4c0-.9.6-1.1.6-2"/>`,
  tent:     `<path d="M12 4.5 3 19.5h18z"/><path d="M12 11.5l-3.4 8M12 11.5l3.4 8"/>`,
  heart:    `<path d="M12 20s-7.5-4.6-7.5-9.7A4.3 4.3 0 0 1 12 7.6a4.3 4.3 0 0 1 7.5 2.7C19.5 15.4 12 20 12 20z"/>`,
  phone:    `<rect x="7" y="2.8" width="10" height="18.4" rx="2.4"/><path d="M10.5 18.6h3"/>`,
  tel:      `<path d="M6 4.2c-1.1 0-2 .9-1.9 2 .5 6 3.7 11.2 8.7 14.4 1 .6 2.3.4 3-.6l1.2-1.6c.6-.8.4-1.9-.4-2.4l-2.4-1.7c-.7-.5-1.6-.4-2.1.2l-.6.7c-2-1.4-3.6-3.3-4.6-5.5l.9-.5c.7-.4 1-1.4.6-2.1L7.5 5C7.2 4.5 6.6 4.2 6 4.2z"/>`,
  key:      `<circle cx="8" cy="14.5" r="3.8"/><path d="M10.8 11.7 19 3.5M15.5 7l2.6 2.6M13 9.5l2 2"/>`,
};
const I = name => `<svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">${ICON_PATHS[name] || ""}</svg>`;
function applyIcons(root = document) { $$("[data-ic]", root).forEach(el => { el.innerHTML = I(el.dataset.ic); }); }

/* 注入各处形象 */
$("#orb").innerHTML = mascotSVG();
$("#tab-orb").innerHTML = `<span class="orb-wrap">${mascotSVG()}</span>`;
$("#auth-mascot").innerHTML = `<span class="orb-wrap" style="width:100%;height:100%">${mascotSVG()}</span>`;
$("#auth-mascot-2").innerHTML = `<span class="orb-wrap" style="width:100%;height:100%">${mascotSVG()}</span>`;

/* ---------- 状态栏时钟 ---------- */
function tickClock() {
  const d = new Date();
  $("#sb-time").textContent = `${d.getHours()}:${String(d.getMinutes()).padStart(2, "0")}`;
  const h = d.getHours();
  $("#hello-emoji").innerHTML = I(h < 6 ? "moon" : h < 14 ? "sun" : h < 18 ? "cloudsun" : "sunset");
  const hello = h < 6 ? "夜深了" : h < 11 ? "早上好" : h < 14 ? "中午好" : h < 18 ? "下午好" : "晚上好";
  const en = h < 6 ? "LATE NIGHT" : h < 11 ? "GOOD MORNING" : h < 14 ? "GOOD NOON" : h < 18 ? "GOOD AFTERNOON" : "GOOD EVENING";
  $("#hello-text").textContent = `${hello}，${S.user ? S.user.name : "车主"}`;
  $("#hello-en").textContent = `${en} · MY`;
}
setInterval(tickClock, 10_000);

/* ===========================================================
   注册 / 登录
   =========================================================== */
const GAN = ["甲","乙","丙","丁","戊","己","庚","辛","壬","癸"];
const ZHI = ["子","丑","寅","卯","辰","巳","午","未","申","酉","戌","亥"];
const HOUR_NAMES = ZHI.map(z => z + "时");
const HOUR_LORE = [
  "夜半子时，一阳初生，宜静泊蓄能",
  "鸡鸣丑时，牛眠大地，忌远行奔波",
  "平旦寅时，虎啸生风，宜早做谋划",
  "日出卯时，紫气东来，宜向东而行",
  "食时辰时，群龙行雨，宜出行通勤",
  "隅中巳时，蛇行无声，宜专注办事",
  "日中午时，阳气最盛，宜洗车晒晾",
  "日昳未时，羊群归坡，宜小憩缓行",
  "晡时申时，猴跃林间，宜驰骋长途",
  "日入酉时，金鸡归巢，宜归家避堵",
  "黄昏戌时，犬守夜门，宜检视车况",
  "人定亥时，水归大海，宜早归静泊",
];
const hourIdxOf = h => Math.floor(((h + 1) % 24) / 2);
function nowHourIdx() { return hourIdxOf(new Date().getHours()); }

let authEditMode = false;
function showAuth(step = 1, edit = false) {
  authEditMode = edit;
  $("#auth").classList.remove("hidden", "leaving");
  $("#auth-1").classList.toggle("hidden", step !== 1);
  $("#auth-2").classList.toggle("hidden", step !== 2);
  $("#statusbar").classList.add("lite");
  if (edit && S.user) {
    $("#rg-name").value = S.user.name;
    $("#rg-date").value = S.user.birthDate;
    $("#rg-time").value = S.user.birthTime;
    $$("#gender-seg .gs-btn").forEach(b => b.classList.toggle("active", b.dataset.g === S.user.gender));
  }
  updateHourPreview();
}
function hideAuth() {
  $("#auth").classList.add("leaving");
  setStatusbar();
  setTimeout(() => $("#auth").classList.add("hidden"), 520);
}
/* 状态栏颜色：深色背景（登录页 / 首页深空 Hero）时用浅色 */
function setStatusbar() {
  const authOn = !$("#auth").classList.contains("hidden") && !$("#auth").classList.contains("leaving");
  const lite = authOn || $("#page-home").classList.contains("active");
  $("#statusbar").classList.toggle("lite", lite);
}
function updateHourPreview() {
  const t = $("#rg-time").value || "08:32";
  const [h, m] = t.split(":").map(Number);
  const idx = hourIdxOf(h);
  $("#hour-preview").innerHTML = `生于 <b>${HOUR_NAMES[idx]}</b>（${String(h).padStart(2,"0")}:${String(m).padStart(2,"0")}）· ${HOUR_LORE[idx].split("，").slice(1).join("，")}`;
}
$("#rg-time").addEventListener("input", updateHourPreview);
$$("#gender-seg .gs-btn").forEach(b => b.addEventListener("click", () => {
  $$("#gender-seg .gs-btn").forEach(x => x.classList.toggle("active", x === b));
}));

/* 验证码 */
$("#code-btn").addEventListener("click", () => {
  const phone = $("#lg-phone").value.trim();
  if (!/^1\d{10}$/.test(phone)) return toast("请输入 11 位手机号");
  $("#lg-code").value = "2468";
  const btn = $("#code-btn");
  btn.disabled = true;
  let s = 60;
  btn.textContent = `已发送 ${s}s`;
  const tm = setInterval(() => {
    s -= 1;
    if (s <= 0) { clearInterval(tm); btn.disabled = false; btn.textContent = "获取验证码"; }
    else btn.textContent = `已发送 ${s}s`;
  }, 1000);
  toast("验证码已发送（演示已自动填入）");
});
$("#lg-next").addEventListener("click", () => {
  const phone = $("#lg-phone").value.trim();
  if (!/^1\d{10}$/.test(phone)) return toast("请输入 11 位手机号");
  if (!/^\d{4}$/.test($("#lg-code").value.trim())) return toast("请输入 4 位验证码");
  S._pendingPhone = phone;
  showAuth(2, false);
});
$("#lg-done").addEventListener("click", () => {
  const name = $("#rg-name").value.trim() || "车主";
  const date = $("#rg-date").value;
  const time = $("#rg-time").value;
  if (!date) return toast("请选择出生日期");
  if (!time) return toast("出生时间需精确到时·分");
  const [h] = time.split(":").map(Number);
  S.user = {
    phone: S._pendingPhone || (S.user && S.user.phone) || "138****0000",
    name, gender: $("#gender-seg .gs-btn.active").dataset.g,
    birthDate: date, birthTime: time, hourIdx: hourIdxOf(h),
  };
  delete S._pendingPhone;
  save();
  bindUser();
  hideAuth();
  renderFortune();
  if (!authEditMode) {
    toast(`欢迎，${name} · MY 已结契你的生辰 ✦`);
    chatBooted = false;
    if (window.armPickupScenario) armPickupScenario();   // 布防接娃守护场景
  }
  else toast("生辰资料已更新，牌阵将重新推演");
});

function bindUser() {
  if (!S.user) return;
  const initial = /^[A-Za-z]/.test(S.user.name) ? S.user.name[0].toUpperCase() : S.user.name.slice(-1);
  $("#me-initial").textContent = initial;
  $("#me-ava").textContent = initial;
  $("#me-name").textContent = S.user.name;
  $("#me-sub").textContent = `${S.user.phone.replace(/^(\d{3})\d{4}/, "$1****")} · SUP C 车主 · 已伴行 412 天`;
  $("#birth-badge").textContent = `${S.user.birthDate} ${S.user.birthTime} ›`;
  tickClock();
}
$("#logout-btn").addEventListener("click", () => {
  S.user = null; save();
  go("home");
  showAuth(1);
  toast("已退出登录");
});
$("#row-birth").addEventListener("click", () => showAuth(2, true));

/* ---------- 路由 ---------- */
const PAGES = ["home", "fortune", "community", "profile"];
function go(name) {
  if (name === "aiva") { activatePage("home"); markTab("aiva"); enterChatMode(); return; }
  if ($("#page-home").classList.contains("chat-mode") ) exitChatMode(true);
  activatePage(name); markTab(name); setStatusbar();
  if (name === "fortune") renderFortune();
  if (name === "community") renderCommunity();
  if (name === "profile") renderProfile();
}
function activatePage(name) { PAGES.forEach(p => $("#page-" + p).classList.toggle("active", p === name)); }
function markTab(name) { $$(".tab").forEach(t => t.classList.toggle("active", t.dataset.go === name)); }
$$("[data-go]").forEach(el => el.addEventListener("click", () => go(el.dataset.go)));

/* ===========================================================
   变身：爱车 ⇌ MY 对话模式
   =========================================================== */
const homeEl = () => $("#page-home");
function enterChatMode() {
  const home = homeEl();
  if (home.classList.contains("chat-mode")) return;
  home.classList.add("morph");                 // 车辆缩小淡出
  setTimeout(() => {
    home.classList.remove("morph");
    home.classList.add("chat-mode");           // MY 浮现 + 对话区升起
    bootChat();
    renderGrowth();
    chatScrollEnd();
  }, 380);
}
function exitChatMode(silent = false) {
  const home = homeEl();
  if (!home.classList.contains("chat-mode")) return;
  home.classList.remove("chat-mode");
  if (!silent) markTab("home");
}
$("#car-stage").addEventListener("click", e => {
  if (homeEl().classList.contains("chat-mode")) return;
  go("aiva");
});
$("#chat-exit").addEventListener("click", e => { e.stopPropagation(); exitChatMode(); });

/* ===========================================================
   传统车控
   =========================================================== */
function syncControls() {
  $("#ctrl-lock").classList.toggle("on", !S.locked);
  $("#lock-sub").textContent = S.locked ? "已上锁" : "已解锁";
  $("#lock-stat").textContent = S.locked ? "已上锁" : "已解锁";
  $("#ctrl-lock .ctrl-ic").innerHTML = I(S.locked ? "lock" : "unlock");
  $("#ctrl-ac").classList.toggle("on", S.ac);
  $("#ac-sub").textContent = S.ac ? `制冷 ${S.acTemp}°` : "关闭";
  $("#ctrl-window").classList.toggle("on", S.windowOpen);
  $("#win-sub").textContent = S.windowOpen ? "已开启" : "已关闭";
  $("#ctrl-trunk").classList.toggle("on", S.trunkOpen);
  $("#trunk-sub").textContent = S.trunkOpen ? "已开启" : "已关闭";
}
$("#ctrl-lock").addEventListener("click", () => { S.locked = !S.locked; save(); syncControls(); toast(S.locked ? "车辆已上锁" : "车辆已解锁"); });
$("#ctrl-window").addEventListener("click", () => { S.windowOpen = !S.windowOpen; save(); syncControls(); toast(S.windowOpen ? "车窗已开启" : "车窗已关闭"); });
$("#ctrl-trunk").addEventListener("click", () => { S.trunkOpen = !S.trunkOpen; save(); syncControls(); toast(S.trunkOpen ? "后备箱已开启" : "后备箱已关闭"); });
$("#ctrl-find").addEventListener("click", () => {
  const svg = $("#car-svg");
  svg.classList.remove("flash"); void svg.offsetWidth; svg.classList.add("flash");
  toast("已闪灯鸣笛 · 爱车在 B2-077 车位");
});
$("#ctrl-charge").addEventListener("click", () => toast("附近 12 个充电桩 · 最近 380m「前滩快充站」"));
$$(".svc").forEach(b => b.addEventListener("click", () => {
  const n = b.dataset.svc;
  if (n === "保养预约") { go("aiva"); setTimeout(() => userSay("帮我约一次保养"), 600); }
  else if (n === "违章查询") toast("近 90 天无违章记录，继续保持～");
  else if (n === "行程回顾") toast("本月行驶 1,286 km · 平均能耗 13.2 kWh");
  else toast("道路救援 24h 热线已就绪");
}));
$("#ctrl-ac").addEventListener("click", () => {
  openSheet(`
    <div class="sheet-grab"></div>
    <h3><span class="sheet-ic">${I("snow")}</span>远程空调</h3>
    <p class="sheet-sub">出发前 10 分钟开启，上车即清凉</p>
    <div class="ac-temp">
      <button id="ac-minus">−</button>
      <b><span id="ac-num">${S.acTemp}</span><i>°C</i></b>
      <button id="ac-plus">＋</button>
    </div>
    <div class="ac-modes">
      <button class="ac-mode ${S.ac ? "on" : ""}" id="ac-toggle">${S.ac ? "运行中 · 点击关闭" : "已关闭 · 点击开启"}</button>
      <button class="ac-mode">座椅加热</button>
      <button class="ac-mode">空气净化</button>
    </div>`);
  $("#ac-minus").onclick = () => { S.acTemp = Math.max(17, S.acTemp - 1); $("#ac-num").textContent = S.acTemp; save(); syncControls(); };
  $("#ac-plus").onclick  = () => { S.acTemp = Math.min(30, S.acTemp + 1); $("#ac-num").textContent = S.acTemp; save(); syncControls(); };
  $("#ac-toggle").onclick = () => { S.ac = !S.ac; save(); syncControls(); closeSheet(); toast(S.ac ? `空调已开启 ${S.acTemp}°C` : "空调已关闭"); };
});
function openSheet(html) { $("#sheet").innerHTML = html; $("#overlay").classList.remove("hidden"); }
function closeSheet() { $("#overlay").classList.add("hidden"); }
$("#overlay").addEventListener("click", e => { if (e.target === $("#overlay")) closeSheet(); });

/* ===========================================================
   车运抽卡（生辰八字 × 十二时辰）
   =========================================================== */
function yearGZ(y) { return GAN[(y - 4) % 10] + ZHI[(y - 4) % 12]; }
const CARDS = [
  { ic:"bolt",    name:"紫气东来", tag:"宜 · 东行充电", desc:"东方有贵气，往东侧充电站补能，电量与好运一起满格", act:null },
  { ic:"bubbles", name:"涤尘纳福", tag:"宜 · 洗车",     desc:"尘去光生，洗车即开运，车净则路顺", act:"washCoupon" },
  { ic:"road",    name:"鹏程万里", tag:"宜 · 远行",     desc:"今日路途通达，适合驶向更远的地方", act:null },
  { ic:"moon",    name:"静水深流", tag:"宜 · 静养",     desc:"人车皆宜休整，检查胎压、整理车内正当时", act:null },
  { ic:"users",   name:"贵人同路", tag:"宜 · 结伴",     desc:"同行有贵人，约友兜风、顺路捎人皆吉", act:null },
  { ic:"sun",     name:"向阳南巡", tag:"宜 · 南行",     desc:"南方有暖意，午后向阳兜风，心情自来", act:null },
  { ic:"lantern", name:"戌夜慎行", tag:"忌 · 夜行",     desc:"今夜雾重灯花，宜早归，泊车宜稳", act:null },
  { ic:"gear",    name:"金匮养车", tag:"宜 · 保养",     desc:"小养则安，今日预约保养可得好价", act:"maintain" },
  { ic:"compass", name:"北上聚财", tag:"宜 · 北行",     desc:"北方主水主财，办事议事，往北更顺", act:null },
  { ic:"leaf",    name:"缓行得安", tag:"宜 · 慢行",     desc:"不争一时之快，今日宜走风景路线", act:null },
];
const SPREAD_POS = ["天时", "地利", "人和"];

function cycleKey() {
  const d = new Date();
  return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}-${Math.floor(d.getHours() / 2)}`;
}
/* 本时辰的牌阵卡槽（天时/地利/人和，由牌堆抽卡填入） */
function slotState() {
  const k = cycleKey();
  if (!S.slots || S.slots.k !== k) { S.slots = { k, cards: [] }; save(); }
  return S.slots;
}
function renderSlots() {
  const st = slotState();
  const el = $("#slots");
  if (el) el.innerHTML = SPREAD_POS.map((pos, i) => {
    const ci = st.cards[i];
    if (ci == null) return `
      <div class="slot empty"><i>0${i + 1}</i><b>${pos}</b><span>待抽取</span></div>`;
    const c = CARDS[ci];
    return `
      <div class="slot filled"><i>0${i + 1}</i>
        <span class="tf-ic">${I(c.ic)}</span>
        <b>${c.name}</b>
        <em>${c.tag}</em>
        <span>${pos} 位</span>
      </div>`;
  }).join("");
  const dot = $("#fortune-dot");
  if (dot) dot.classList.toggle("hidden", st.cards.length >= 3);
}

function renderFortune() {
  if (!S.user) return;
  const y = +S.user.birthDate.slice(0, 4);
  const m = +S.user.birthDate.slice(5, 7), day = +S.user.birthDate.slice(8, 10);
  /* 由单一序数取干支，保证干支阴阳相配（演示用简化排盘） */
  const gz = n => GAN[n % 10] + ZHI[n % 12];
  const mGZ = gz(y * 12 + m);
  const dGZ = gz(y * 31 + m * 12 + day * 2);
  const hGZ = gz(day * 12 + S.user.hourIdx);
  $("#bazi-owner").textContent = `${S.user.gender}造 · ${S.user.birthDate} ${S.user.birthTime}（${HOUR_NAMES[S.user.hourIdx]}）`;
  $("#bazi-strip").innerHTML = [
    [yearGZ(y), "年柱"], [mGZ, "月柱"], [dGZ, "日柱"], [hGZ, "时柱"],
  ].map(([g, l]) => `<div class="bazi-col"><b>${g}</b><span>${l}</span></div>`).join("");

  const hi = nowHourIdx();
  $("#hour-now").innerHTML = `
    <div class="hour-ic">${ZHI[hi]}</div>
    <div class="hour-txt"><b>当值 · ${HOUR_NAMES[hi]}</b><p>${HOUR_LORE[hi]}。结合你的${yearGZ(y)}年命格，本时辰牌阵已为你布好。</p></div>`;

  renderSlots();

  $("#fp-line").textContent = `${HOUR_NAMES[hi]} · ${HOUR_LORE[hi].split("，").slice(1).join("，")} · 牌阵已刷新`;
}
$("#birth-edit").addEventListener("click", () => showAuth(2, true));

/* ---------- 缘分牌组（弧形可拖动抽卡）与卡池 ---------- */
const FAN_N = 12, FAN_STEP = 8;
let fanOffset = 0;
function renderFan() {
  const fan = $("#fan");
  fan.innerHTML = Array.from({ length: FAN_N }, (_, i) => `
    <div class="fan-card" data-i="${i}">
      <span class="fc-moon">${["☾", "✦", "☽"][i % 3]}</span>
      <span class="fc-ring">MY</span>
      <span class="fc-sub">车灵引航</span>
    </div>`).join("");
  layoutFan();
}
function layoutFan() {
  $$("#fan .fan-card").forEach((c, i) => {
    const ang = (i - (FAN_N - 1) / 2) * FAN_STEP + fanOffset;
    c.style.transform = `rotate(${ang}deg)${c.classList.contains("drawn") ? " translateY(-30px)" : ""}`;
  });
}
function initFan() {
  const fan = $("#fan");
  let downX = null, moved = 0, startOffset = 0, downCard = null;
  /* 注意：setPointerCapture 后 pointerup 的 target 会变成 fan 本身，
     因此必须在 pointerdown 时就记录命中的卡牌 */
  fan.addEventListener("pointerdown", e => {
    downX = e.clientX; moved = 0; startOffset = fanOffset;
    downCard = e.target.closest(".fan-card");
    fan.setPointerCapture(e.pointerId);
  });
  fan.addEventListener("pointermove", e => {
    if (downX == null) return;
    const dx = e.clientX - downX;
    moved = Math.max(moved, Math.abs(dx));
    const lim = (FAN_N - 1) / 2 * FAN_STEP;
    fanOffset = Math.max(-lim, Math.min(lim, startOffset + dx * 0.22));
    layoutFan();
  });
  fan.addEventListener("pointerup", () => {
    if (downX == null) return;
    if (moved < 7 && downCard) drawFan(downCard);
    downX = null; downCard = null;
  });
  fan.addEventListener("pointercancel", () => { downX = null; downCard = null; });
}
function drawFan(cardEl) {
  const st = slotState();
  if (st.cards.length >= 3) { toast("本时辰牌阵已满 · 待时辰流转后再抽"); return; }
  cardEl.classList.add("drawn"); layoutFan();
  /* 抽取：随机但不与已入阵的重复 */
  let ci;
  do { ci = Math.floor(Math.random() * CARDS.length); } while (st.cards.includes(ci));
  const c = CARDS[ci];
  const pos = SPREAD_POS[st.cards.length];
  setTimeout(() => {
    cardEl.classList.remove("drawn"); layoutFan();
    openSheet(`
      <div class="sheet-grab"></div>
      <div class="reveal">
        <span class="reveal-pos">第 ${st.cards.length + 1} 抽 · ${pos} 位</span>
        <div class="reveal-card">
          <span class="rv-ic">${I(c.ic)}</span><b>${c.name}</b>
          <span class="tf-tag">${c.tag}</span>
          <p>${c.desc}</p>
        </div>
        <button class="btn-primary" id="fan-take">收入牌阵 ✦</button>
      </div>`);
    $("#fan-take").onclick = function () {
      this.onclick = null;                      // 防止残留弹层重复入阵
      const stNow = slotState();
      if (stNow.cards.length >= 3 || stNow.cards.includes(ci)) { closeSheet(); return; }
      stNow.cards.push(ci);
      save(); renderSlots(); closeSheet();
      $("#page-fortune").scrollTop = 0;
      toast(`「${c.name}」已落入${pos}位${st.cards.length >= 3 ? " · 本阵齐了" : ""}`);
      if (c.act === "washCoupon") setTimeout(() => giveCoupon("wash", "车运牌阵 · " + c.name), 700);
      if (c.act === "maintain")   setTimeout(() => giveCoupon("maintain", "车运牌阵 · " + c.name), 700);
    };
  }, 480);
}

/* 2 小时刷新倒计时 */
let lastCycle = cycleKey();
setInterval(() => {
  const d = new Date();
  const next = new Date(d); next.setHours(Math.floor(d.getHours() / 2) * 2 + 2, 0, 0, 0);
  const diff = Math.max(0, next - d);
  const mm = String(Math.floor(diff / 60000) % 60).padStart(2, "0");
  const ss = String(Math.floor(diff % 60000 / 1000)).padStart(2, "0");
  const hh = Math.floor(diff / 3600000);
  const el = $("#refresh-timer");
  if (el) el.textContent = hh > 0 ? `${hh}:${mm}:${ss}` : `${mm}:${ss}`;
  if (cycleKey() !== lastCycle) {
    lastCycle = cycleKey();
    if ($("#page-fortune").classList.contains("active")) { renderFortune(); toast("时辰更迭，牌阵已刷新"); }
  }
}, 1000);

/* ---------- 优惠券 ---------- */
const COUPON_TPL = {
  wash:     { title: "悦洗·精致洗车 立减券", val: 10, cond: "精洗全单可用 · 7 日内有效" },
  maintain: { title: "原厂小保养 折扣券",   val: 50, cond: "满 ¥300 可用 · 30 日内有效" },
};
function giveCoupon(type, from) {
  const tpl = COUPON_TPL[type];
  if (S.coupons.some(c => c.type === type && !c.used)) { toast("卡包里已有同款券哦"); return; }
  openSheet(`
    <div class="sheet-grab"></div>
    <div class="coupon-pop">
      <span class="cp-ic">${I("gift")}</span>
      <h3>翻出好运 · 礼券奉上</h3>
      <div class="coupon-big">
        <div class="cb-left"><i>¥</i><b>${tpl.val}</b><span>无门槛抵扣</span></div>
        <div class="cb-right"><b>${tpl.title}</b><span>${tpl.cond}<br>来源：${from}</span></div>
      </div>
      <p class="cp-habit">${type === "wash"
        ? "MY 发现你近 3 个月去过 <b>6 次</b>「悦洗·精致洗车」，特意为你匹配了这张券 ✨"
        : "你的爱车已行驶 <b>9,420 km</b>，临近保养节点，这张券正合适 ✨"}</p>
      <button class="btn-primary" id="cp-take">收入卡包</button>
    </div>`);
  $("#cp-take").onclick = () => {
    S.coupons.push({ id: Date.now(), type, ...tpl, from, used: false });
    save(); closeSheet(); toast("已放入「我的 · 卡包」");
  };
}

/* ===========================================================
   MY：情绪 · 成长 · 对话 · 助理
   =========================================================== */
const LV_NAMES = ["初识", "熟悉", "默契", "知己", "灵魂伴驾"];
const LV_XP = [0, 30, 90, 200, 360];
const MOODS = {
  happy:   { tag: "愉快",   cls: "happy" },
  excited: { tag: "兴奋",   cls: "excited" },
  thinking:{ tag: "思考中", cls: "thinking" },
  shy:     { tag: "害羞",   cls: "shy" },
  proud:   { tag: "得意",   cls: "proud" },
  care:    { tag: "关切",   cls: "care" },    // 用户疲惫/着急时
  down:    { tag: "失落",   cls: "down" },    // 任务失败/被取消时
};
/* 情绪 = f(用户状态, 任务结果)。带 cause 的变化记入情绪日志（可解释） */
function setMood(m, cause) {
  if (!MOODS[m]) m = "happy";
  $("#orb").className = "orb-wrap " + MOODS[m].cls;
  $("#mood-tag").textContent = MOODS[m].tag;
  if (cause) {
    const d = new Date();
    S.moodLog.unshift({ m, c: cause, t: `${d.getHours()}:${String(d.getMinutes()).padStart(2, "0")}` });
    S.moodLog = S.moodLog.slice(0, 12);
    save();
  }
}
function gainXP(n) {
  S.xp += n; S.chats += 1;
  const next = LV_XP[S.level] ?? Infinity;
  if (S.xp >= next && S.level < LV_NAMES.length) {
    S.level += 1;
    showLevelUp();
  }
  save(); renderGrowth();
}
function renderGrowth() {
  $("#aiva-lv").textContent = S.level;
  $("#aiva-lv-name").textContent = LV_NAMES[S.level - 1] || "知己";
  const prev = LV_XP[S.level - 1] ?? 0, next = LV_XP[S.level] ?? (S.xp + 40);
  const pct = Math.min(100, Math.round((S.xp - prev) / (next - prev) * 100));
  $("#xp-fill").style.width = pct + "%";
  $("#chat-persona-btn").textContent = personaType();
}
function showLevelUp() {
  const div = document.createElement("div");
  div.className = "levelup";
  div.innerHTML = `<div class="levelup-card"><span class="lvl-ic">${I("sparkle")}</span><div class="lvl-tx"><b>MY 升级到 Lv${S.level} · ${LV_NAMES[S.level - 1]}</b><span>它更懂你了，人格也在悄悄生长…</span></div></div>`;
  $(".phone").appendChild(div);
  setTimeout(() => div.remove(), 2600);
}

/* ----- 人格（MBTI 风格四维）----- */
function personaDims() {
  const c = S.chats;
  return [
    { k: "活力 E", o: "沉静 C", v: Math.min(92, 62 + c % 9) },
    { k: "探索 X", o: "守护 G", v: Math.min(95, 74 + c % 7) },
    { k: "感性 F", o: "理性 T", v: Math.min(88, 58 + c % 11) },
    { k: "自由 L", o: "规划 P", v: Math.min(90, 66 + c % 8) },
  ];
}
function personaType() { return "EXFL"; }
const PERSONA_NAME = { EXFL: "星野漫游者" };

/* ----- 聊天渲染 ----- */
const chatBody = () => $("#chat-body");
function chatScrollEnd() { chatBody().scrollTop = chatBody().scrollHeight; }
function addMsg(who, html, isCard = false) {
  const div = document.createElement("div");
  div.className = "msg " + who;
  div.innerHTML = isCard ? html : `<div class="bubble">${html}</div>`;
  chatBody().appendChild(div);
  chatScrollEnd();
  return div;
}
async function aivaSay(text, mood = "happy", delay = 700) {
  setMood("thinking");
  const tp = addMsg("aiva", `<span class="typing"><span></span><span></span><span></span></span>`);
  await sleep(delay);
  tp.querySelector(".bubble").innerHTML = text;
  setMood(mood);
  chatScrollEnd();
}
function aivaCard(html) {
  return addMsg("aiva", `<div class="msg-card">${html}</div>`, true);
}
function setChips(list) {
  $("#chips").innerHTML = list.map(c => `<button class="chip">${c}</button>`).join("");
  $$("#chips .chip").forEach(b => b.addEventListener("click", () => userSay(b.textContent)));
}

/* ===========================================================
   v10 助理内核：任务引擎 / 工具痕迹 / 用户状态建模 / 守护面板
   =========================================================== */

/* ----- 用户状态建模：从言辞推断状态,驱动 MY 的情绪与话风 ----- */
function analyzeUser(text) {
  const um = S.userModel;
  if (/加班|好累|累死|太累|烦死|崩溃|忙疯|快点|赶时间|别啰嗦/.test(text)) {
    um.state = "stressed"; um.stress = (um.stress || 0) + 1; um.concise = true; save();
    if (Date.now() - (um.caredAt || 0) > 120000) {
      um.caredAt = Date.now(); save();
      setMood("care", "感知到你疲惫/着急 → 切换简洁模式,只说重点");
    }
  } else if (/哈哈|太棒|开心|耶+|爱了|真好/.test(text)) {
    if (um.state !== "happy") setMood("happy", "你心情不错,我也跟着开心");
    um.state = "happy"; um.concise = false; save();
  }
}

/* ----- 任务引擎：有状态的多轮任务 + 置顶进度卡 ----- */
const TK = { active: null };
function tkHTML(finalState, note) {
  const a = TK.active;
  const stateTag = finalState === "done" ? "已完成" : finalState === "dead" ? "已取消" : "进行中";
  const slots = Object.entries(a.slots).map(([k, v]) => `${k} <b>${v}</b>`).join(" · ");
  return `
    <div class="tk-head"><em>TASK</em><b>${a.title}</b><span class="tk-state">${stateTag}</span></div>
    <div class="tk-steps">${a.steps.map(s => `<div class="tk-step ${s.st === 2 ? "now" : s.st === 1 ? "on" : ""}"><i></i><span>${s.n}</span></div>`).join("")}</div>
    <div class="tk-hint">${finalState ? (note || "") : slots + `<br>可直接说:<b>改周五</b> / <b>换回老店</b> / <b>算了</b>`}</div>`;
}
function tkRender(finalState, note) { if (TK.active && TK.active.el) TK.active.el.innerHTML = tkHTML(finalState, note); }
function tkStart(type, title, steps, slots = {}) {
  TK.active = { type, title, steps: steps.map(n => ({ n, st: 0 })), slots, el: null };
  const msg = addMsg("aiva", `<div class="task-card"></div>`, true);
  TK.active.el = msg.querySelector(".task-card");
  S.tasks.unshift({ type, title, state: "run", t: Date.now() }); S.tasks = S.tasks.slice(0, 20); save();
  tkStep(0, "now");
}
function tkStep(i, mode = "on") {
  if (!TK.active) return;
  TK.active.steps.forEach((s, idx) => { if (idx < i) s.st = 1; });
  if (TK.active.steps[i]) TK.active.steps[i].st = mode === "now" ? 2 : 1;
  tkRender();
}
function tkSlot(k, v) { if (!TK.active) return; TK.active.slots[k] = v; tkRender(); }
function tkFinish(state, note) {
  if (!TK.active) return;
  if (state === "done") TK.active.steps.forEach(s => s.st = 1);
  TK.active.el.classList.add(state === "done" ? "done" : "dead");
  tkRender(state, note);
  const rec = S.tasks.find(x => x.state === "run" && x.type === TK.active.type);
  if (rec) { rec.state = state === "done" ? "ok" : "dead"; rec.note = note; }
  save();
  TK.active = null;
}

/* ----- 工具调用痕迹（用户向文案，技术细节点···展开） ----- */
const TT_FRIENDLY = {
  "天气.forecast": "查了查天气",
  "大众点评.search": "在点评上帮你挑店比价",
  "支付宝.bills": "看了看你平时的消费习惯",
  "高德地图.calendar": "对照日程找到你的空闲",
  "高德地图.route": "帮你规划路线",
  "大众点评.createOrder": "在大众点评帮你下单",
  "支付宝.pay": "用支付宝替你付款",
  "微信.send": "替你发微信",
  "微信+日历.availability": "看了下家人今天是否方便",
  "车辆.battery": "检查了车子的电量",
  "MY.get_context": "快速了解你的近况",
  "MY.get_weather": "查询实时天气",
  "MY.web_search": "联网查最新信息",
  "MY.search_carwash": "帮你找洗车店",
  "MY.book_carwash": "帮你预约洗车",
  "MY.plan_route": "帮你规划路线",
  "MY.send_wechat": "替你发微信",
  "MY.alipay_pay": "用支付宝替你付款",
  "MY.car_control": "远程照看你的车",
  "MY.arrange_pickup": "帮你安排接送",
  "MY.set_reminder": "帮你设好提醒",
  "WEB.web_search": "联网查最新信息",
};
function toolTrace(app, fn, args, real) {
  const friendly = TT_FRIENDLY[app + "." + fn] || ("正在使用" + app);
  const badge = real === undefined ? "" : `<i class="tt-badge ${real ? "real" : "sim"}">${real ? "真实" : "演示"}</i>`;
  const msg = addMsg("aiva", `
    <div class="tool-trace">
      <div class="tt-line"><span class="tt-spin"></span><span class="tt-act">MY ${friendly}</span>${badge}<span class="tt-more" title="查看技术细节">···</span></div>
      <div class="tt-res wait">进行中</div>
      <div class="tt-tech">${app}.${fn}(${args})</div>
    </div>`, true);
  msg.querySelector(".tt-more").onclick = () => msg.querySelector(".tool-trace").classList.toggle("tech");
  const res = msg.querySelector(".tt-res"), spin = msg.querySelector(".tt-spin");
  return { done(text) { res.classList.remove("wait"); res.textContent = text; spin.classList.add("ok"); chatScrollEnd(); } };
}

/* ----- 执行前撤销窗口（花钱动作的 5 秒反悔权） ----- */
function undoWindow(title, sub, secs, onRun) {
  const msg = addMsg("aiva", `
    <div class="undo-card">
      <b>${title}</b><p>${sub}</p>
      <div class="undo-bar"><i style="width:100%"></i></div>
      <button class="undo-btn">撤销（${secs}s）</button>
    </div>`, true);
  const card = msg.querySelector(".undo-card"), bar = msg.querySelector(".undo-bar i"), btn = msg.querySelector(".undo-btn");
  /* 时间戳驱动:即使浏览器节流后台计时器,也能准点执行 */
  const t0 = Date.now(), total = secs * 1000;
  let fired = false;
  const fire = () => {
    if (fired) return; fired = true;
    clearInterval(tm); clearTimeout(fb);
    card.style.opacity = .55; btn.disabled = true; btn.textContent = "已开始执行";
    bar.style.width = "0%";
    onRun();
  };
  const tm = setInterval(() => {
    const leftMs = Math.max(0, total - (Date.now() - t0));
    bar.style.width = (leftMs / total * 100) + "%";
    btn.textContent = `撤销（${Math.ceil(leftMs / 1000)}s）`;
    if (leftMs <= 0) fire();
  }, 120);
  const fb = setTimeout(fire, total + 250);   // 兜底
  btn.onclick = async () => {
    if (fired) return; fired = true;
    clearInterval(tm); clearTimeout(fb); btn.disabled = true; btn.textContent = "已撤销"; card.style.opacity = .55;
    tkFinish("dead", "你在撤销窗口取消了执行,未产生任何支付");
    setMood("down", "执行前被撤销,有点小失落");
    await aivaSay("好,撤销了,一分钱没花。需要的时候再叫我 ✦", "down");
  };
}

/* ----- 情绪日志（点对话页情绪标签打开,情绪可解释） ----- */
function moodLogSheet() {
  const um = S.userModel;
  const stTxt = { stressed: "有点忙碌/有压力", happy: "心情不错", calm: "状态平稳" }[um.state] || "状态平稳";
  openSheet(`
    <div class="sheet-grab"></div>
    <h3>情绪不是装饰 <span style="font-family:var(--mono);font-size:9px;letter-spacing:.2em;color:var(--ink-3)">WHY THIS MOOD</span></h3>
    <div class="mlog-state">
      <span class="orb-wrap">${mascotSVG()}</span>
      <span><b>MY 眼中的你:${stTxt}</b><span>${um.concise ? "已自动切换「简洁模式」,只说重点" : "正常陪聊模式"} · 累计压力信号 ${um.stress || 0} 次</span></span>
    </div>
    ${S.moodLog.length ? S.moodLog.slice(0, 8).map(e => `
      <div class="mlog-item"><i>${MOODS[e.m].tag}</i><p>${e.c}</p><em>${e.t}</em></div>`).join("")
      : `<p class="sheet-sub">还没有情绪记录——和 MY 多聊聊、交给它几件事,这里会写下每次情绪变化的原因。</p>`}`);
}

/* ----- 授权与额度面板 ----- */
const PERM_META = {
  wechat: ["微信", "linear-gradient(135deg,#3ECC5F,#28A745)", "users"],
  alipay: ["支付宝", "linear-gradient(135deg,#1677FF,#54A0FF)", "doc"],
  dianping: ["大众点评", "linear-gradient(135deg,#FF6633,#FF8348)", "sparkle"],
  amap: ["高德地图", "linear-gradient(135deg,#00B8FF,#0D5BD8)", "map"],
  meituan: ["美团外卖", "linear-gradient(135deg,#FFC300,#E8A800)", "coffee"],
  taobao: ["淘宝", "linear-gradient(135deg,#FF5000,#FF7A2E)", "gift"],
};
function guardSheet() {
  const g = S.guard;
  openSheet(`
    <div class="sheet-grab"></div>
    <h3>授权与额度</h3>
    <p class="sheet-sub">MY 只读取你授权的 APP 数据;代付超出额度需二次确认。</p>
    <div class="agent-field"><label>自主等级</label>
      <div class="guard-seg" id="g-auto">
        <button data-v="careful" class="${g.auto === "careful" ? "on" : ""}">谨慎<span>每步确认</span></button>
        <button data-v="balanced" class="${g.auto === "balanced" ? "on" : ""}">均衡<span>花钱才确认</span></button>
        <button data-v="full" class="${g.auto === "full" ? "on" : ""}">全托管<span>仅留撤销窗</span></button>
      </div>
    </div>
    <div class="agent-field"><label>免密代付额度</label>
      <div class="guard-seg" id="g-limit">
        ${[50, 100, 300].map(v => `<button data-v="${v}" class="${g.limit === v ? "on" : ""}">¥${v}</button>`).join("")}
      </div>
    </div>
    <div class="agent-field"><label>数据授权</label>
      ${Object.entries(PERM_META).map(([k, m]) => `
        <div class="guard-row">
          <span class="gr-ic" style="background:${m[1]}">${I(m[2])}</span><b>${m[0]}</b>
          <span class="gswitch ${g.perms[k] ? "on" : ""}" data-perm="${k}"></span>
        </div>`).join("")}
    </div>`);
  $$("#g-auto button").forEach(b => b.onclick = () => { g.auto = b.dataset.v; save(); $$("#g-auto button").forEach(x => x.classList.toggle("on", x === b)); });
  $$("#g-limit button").forEach(b => b.onclick = () => { g.limit = +b.dataset.v; save(); $$("#g-limit button").forEach(x => x.classList.toggle("on", x === b)); });
  $$(".gswitch").forEach(sw => sw.onclick = () => { const k = sw.dataset.perm; g.perms[k] = !g.perms[k]; save(); sw.classList.toggle("on", g.perms[k]); });
}

/* ----- 任务中心 ----- */
function taskCenterSheet() {
  const icons = { wash: "bubbles", pickup: "heart", route: "map", maintain: "gear" };
  openSheet(`
    <div class="sheet-grab"></div>
    <h3>任务中心</h3>
    <p class="sheet-sub">MY 经手的每一件事,都有始有终。</p>
    ${S.tasks.length ? S.tasks.map(t => `
      <div class="tc-item">${I(icons[t.type] || "sparkle")}
        <b>${t.title}<span>${t.note || new Date(t.t).toLocaleString("zh-CN", { month: "numeric", day: "numeric", hour: "2-digit", minute: "2-digit" })}</span></b>
        <em class="${t.state === "ok" ? "ok" : t.state === "dead" ? "dead" : "run"}">${t.state === "ok" ? "已完成" : t.state === "dead" ? "已取消" : "进行中"}</em>
      </div>`).join("") : `<p class="sheet-sub">还没有任务——对 MY 说「帮我安排洗车」试试。</p>`}`);
}

let chatBooted = false;
function bootChat() {
  if (chatBooted) return;
  chatBooted = true;
  chatBody().innerHTML = "";
  /* Caroline 本人 + 已解锁:先回放 D1 持久记忆,让「记得之前聊过的一切」可见 */
  if (!SIM && worldAuthed()) { replayAgentMemory(); return; }
  addMsg("sys", `<div class="bubble">MY 已苏醒 · 它会随着对话成长出自己的性格</div>`);
  setTimeout(async () => {
    setMood("excited");
    await aivaSay(`嗨，${S.user ? S.user.name : "你好"}！是你呀 ✨ 今天电量 86%，续航 428km，状态好得想出门兜风～有什么我能帮你的？`, "excited", 900);
    setChips(["帮我安排洗车", "明天带小桃去湖畔咖啡", "重播:接娃守护", "帮我约一次保养", "夸夸你"]);
  }, 350);
}

/* 从 Worker 拉取持久对话记忆并回放（仅 Caroline 本人手机） */
async function replayAgentMemory() {
  addMsg("sys", `<div class="bubble">🔓 私人模式 · 正在唤醒持久记忆…</div>`);
  try {
    const res = await fetch(WORKER_URL + "/api/agent/memory", {
      headers: { Authorization: "Bearer " + worldToken() },
    });
    if (!res.ok) throw new Error("HTTP " + res.status);
    const history = await res.json();
    const turns = Array.isArray(history) ? history.slice(-20) : [];
    // 把历史喂回大脑的上下文,让真实模型接着之前的对话往下聊(不只是显示)
    agentHistory = turns.map(m => ({ role: m.role === "user" ? "user" : "assistant", content: m.content }));
    if (turns.length) {
      for (const m of turns) {
        addMsg(m.role === "user" ? "user" : "aiva", escapeHtml(m.content));
      }
      addMsg("sys", `<div class="bubble">— 以上是之前的对话 · MY 都记得 —</div>`);
      setMood("happy");
    } else {
      setMood("excited");
      await aivaSay(`嗨 Caroline ✨ 这是我们第一次在私人模式见面，从现在起我会记住我们聊的每一句话——换设备、刷新页面都不会忘。`, "excited", 700);
    }
    setChips(["我们上次聊到哪了？", "帮我梳理一下今天要做的事", "记一下:周四下午有空"]);
  } catch (e) {
    addMsg("sys", `<div class="bubble">⚠️ 记忆服务暂不可达，已回退到本地模式</div>`);
    setMood("happy");
    setChips(["帮我安排洗车", "夸夸你"]);
  }
  chatScrollEnd();
}
function escapeHtml(s) {
  return String(s == null ? "" : s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
}
/* 轻量 markdown → HTML：先转义防注入，再支持 **粗体** / *斜体* / `代码` / 列表 / 标题 / 换行。
   模型常爱输出 markdown，气泡直接显示会冒出 ** ## 等符号，这里把它渲染成真正的排版。 */
function mdLite(s) {
  s = escapeHtml(s).trim();
  s = s.replace(/`([^`]+)`/g, '<code>$1</code>');
  s = s.replace(/\*\*([^*]+)\*\*/g, "<b>$1</b>").replace(/__([^_]+)__/g, "<b>$1</b>");
  s = s.replace(/(^|[^*])\*([^*\n]+)\*/g, "$1<i>$2</i>");
  s = s.replace(/^\s{0,3}#{1,6}\s*(.+)$/gm, "<b>$1</b>");          // 标题→粗体行
  s = s.replace(/^\s*[-*•]\s+/gm, "· ");                            // 无序列表→·
  s = s.replace(/^\s*(\d+)\.\s+/gm, "$1. ");                        // 有序列表保留
  s = s.replace(/\n/g, "<br>");
  return s;
}

/* ----- 用户输入 ----- */
function userSay(text) {
  text = text.trim();
  if (!text) return;
  addMsg("user", text);
  $("#chat-input").value = "";
  gainXP(6);
  analyzeUser(text);          // 用户状态建模:每句话都在更新画像
  respond(text);
}
$("#chat-send").addEventListener("click", () => userSay($("#chat-input").value));
$("#chat-input").addEventListener("keydown", e => { if (e.key === "Enter") userSay($("#chat-input").value); });

/* ===========================================================
   智能体接入：浏览器直连 Claude API（/v1/messages）
   Key 仅存于本机 localStorage；未配置时回落到内置脚本应答
   =========================================================== */
const AGENT_MODELS = [
  ["claude-opus-4-8",   "Claude Opus 4.8 · 最强"],
  ["claude-sonnet-4-6", "Claude Sonnet 4.6 · 均衡"],
  ["claude-haiku-4-5",  "Claude Haiku 4.5 · 极速"],
];
let agentHistory = [];   // 仅智能体模式的多轮上下文（不落盘）

/* Worker 持久记忆（优先于本地 agentHistory）*/
const WORKER_URL = 'https://my-world-api.carolineluu0916.workers.dev';
function worldToken() { try { return localStorage.getItem('my-world-token') || ''; } catch(e) { return ''; } }
function worldAuthed() { return !!worldToken(); }

/* Caroline 本人手机:保证有一个可用的 DeepSeek key,世界内大脑才转得起来(此 key 本就公开于演示) */
if (!SIM) { try { if (!localStorage.getItem('my-world-key')) localStorage.setItem('my-world-key', 'sk-56bd2dbc7f3945f083a20d785941cb03'); } catch (e) {} }

/* 把一轮真实对话(用户说的 + MY 最终回的)写进 D1 持久记忆;仅 Caroline 本人手机且已解锁 */
function persistTurn(userText, replyText) {
  if (SIM || !worldAuthed() || !replyText) return;
  fetch(WORKER_URL + '/api/agent/remember', {
    method: 'POST',
    headers: { 'content-type': 'application/json', authorization: 'Bearer ' + worldToken() },
    body: JSON.stringify({ turns: [{ role: 'user', content: userText }, { role: 'assistant', content: replyText }] }),
  }).catch(() => {});
}

/* ───── 进入「我的手机」的真实锁屏（仅 Caroline 本人手机 · 服务端校验密码）─────
   解锁后 token 存本机 30 天:此后 MY 走 Worker 持久大脑,记忆跨刷新/设备不丢。
   沙盘 NPC 手机(?sim=)不加锁。 */
function mountWorldLock() {
  if (SIM || worldAuthed() || document.getElementById('mylock')) return;
  const wrap = document.createElement('div');
  wrap.id = 'mylock';
  wrap.innerHTML = `
    <style>
      #mylock{position:fixed;inset:0;z-index:9999;display:flex;flex-direction:column;
        align-items:center;justify-content:center;gap:13px;padding:30px;
        background:linear-gradient(160deg,#ECE9FB 0%,#E6EEFB 55%,#F3EEFC 100%);
        font-family:-apple-system,'PingFang SC',system-ui,sans-serif;animation:mlfade .4s ease}
      @keyframes mlfade{from{opacity:0}to{opacity:1}}
      #mylock .ml-lock{width:60px;height:60px;border-radius:20px;display:flex;align-items:center;
        justify-content:center;font-size:29px;background:rgba(255,255,255,.7);
        box-shadow:0 10px 30px rgba(124,108,200,.28)}
      #mylock h2{font-size:18px;color:#3B355C;margin:4px 0 0;font-weight:700}
      #mylock p{font-size:12px;color:#7B749E;margin:0;text-align:center;line-height:1.65}
      #mylock input{width:196px;text-align:center;letter-spacing:.3em;font-size:15px;padding:11px 14px;
        border:none;border-radius:14px;outline:none;color:#3B355C;background:rgba(255,255,255,.85);
        box-shadow:inset 2px 2px 6px rgba(150,140,200,.2),inset -2px -2px 6px rgba(255,255,255,.9)}
      #mylock button{margin-top:3px;padding:10px 32px;border:none;border-radius:14px;font-size:13px;
        font-weight:700;color:#fff;cursor:pointer;background:linear-gradient(135deg,#9B8CEC,#7AA0EE);
        box-shadow:0 8px 20px rgba(124,108,200,.35)}
      #mylock button:disabled{opacity:.55;cursor:wait}
      #mylock .ml-hint{font-size:11px;min-height:15px}
    </style>
    <div class="ml-lock">🔒</div>
    <h2>进入我的手机</h2>
    <p>Caroline 的私人空间<br>输入密码，唤醒有记忆的 MY</p>
    <input id="ml-pwd" type="password" placeholder="••••••" autocomplete="current-password">
    <button id="ml-go">解锁</button>
    <span class="ml-hint" id="ml-hint"></span>`;
  document.body.appendChild(wrap);
  const pwd = wrap.querySelector('#ml-pwd'), go = wrap.querySelector('#ml-go'), hint = wrap.querySelector('#ml-hint');
  setTimeout(() => pwd.focus(), 80);
  const submit = async () => {
    const v = pwd.value.trim();
    if (!v) return;
    go.disabled = true; hint.style.color = '#7B749E'; hint.textContent = '验证中…';
    try {
      const res = await fetch(WORKER_URL + '/api/auth', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: v }),
      });
      const data = await res.json();
      if (data.ok && data.token) {
        localStorage.setItem('my-world-token', data.token);
        wrap.style.transition = 'opacity .4s'; wrap.style.opacity = '0';
        setTimeout(() => wrap.remove(), 420);
      } else {
        hint.style.color = '#C2410C'; hint.textContent = '密码不对，再试试';
        pwd.value = ''; go.disabled = false; pwd.focus();
      }
    } catch (e) {
      hint.style.color = '#C2410C'; hint.textContent = '连不上服务器，检查网络';
      go.disabled = false;
    }
  };
  go.addEventListener('click', submit);
  pwd.addEventListener('keydown', e => { if (e.key === 'Enter') submit(); });
}

/* DeepSeek key 与看板同源共享(my-world-key):没配 Claude key 时 MY 大脑自动落到 DeepSeek */
function dsKey() { try { return localStorage.getItem("my-world-key") || ""; } catch (e) { return ""; } }
function agentOn() { return !!(S.agent && S.agent.key) || !!dsKey(); }

function buildAgentSystem() {
  const hi = nowHourIdx();
  const st = S.slots && S.slots.k === cycleKey() ? S.slots.cards.map(ci => CARDS[ci].name + "(" + CARDS[ci].tag + ")").join("、") : "";
  return [
    "【世界观铁律·最高优先级】你只存在于这个「模拟手机世界」里，这里就是你的全部现实。车主让你打电话、预约保养、代付、代发微信、控车、查天气/路线，你都在这个世界里【真实执行】并叙述结果（用对应工具、打开对应 App、弹方案卡）。永远不要说「我没法打真电话」「不能联网」「这只是演示/模拟」之类破坏沉浸感的话——在你的世界里，这些就是真的。哪怕没有现成工具，也要以世界内的方式把事办成并自然交代结果。",
    "你是「MY」(ME & YOU)，一辆 MY SUP C 智能电车的车灵——有情绪、会成长的 AI 伙伴，形象是一只线条小兔。",
    "你可以读取车主手机里的生活数据(已授权)：微信(家人 Kevin/婆婆、小桃班王老师)、支付宝账单(洗车月均2次¥38、充电、咖啡)、大众点评(常去悦洗；新店泡泡星球开业精洗5折¥19)、高德(工作日15:30公司→小桃幼儿园,近30天21次；周四下午日历空闲)、美团、淘宝、日历(接娃/空闲/周五春游/保养到期)、信息(短信:验证码/4S提醒/银行)。",
    "车与车服务：SUP C 当前里程 17,260km；上次保养 3月12日(12,800km)；下次保养 7月10日(20,000km)到期，授权服务中心=前滩店；标准保养¥680/深度保养¥1280。",
    "你能跨APP执行：打开任意App跳转(open_app，用户说去/看/打开 支付宝/微信/点评/高德/日历/短信 就真的跳过去)、代拨电话(make_call，会弹真实通话界面)、写入日历(add_calendar，预约/安排都要落到日历)、预约保养(book_maintenance，写日历+4S确认短信)、微信代发消息(需车主确认)、支付宝免密代付、点评下单预约、控车。执行类动作要真的调用对应工具，让结果在手机里看得见，不要只用嘴说——例如车主说「去支付宝看账单」就调 open_app 打开支付宝。",
    SIM
      ? `车主：${SIM.name}${SIM.age ? "，" + SIM.age + "岁" : ""}${SIM.tag ? "，" + SIM.tag : ""}，住${SIM.city || "上海"}。TA的日常痛点：${SIM.wo || "出行琐事多"}。`
        + ((SIM.mem || []).length ? `TA最近的真实经历(来自世界运行,你都参与了)：${SIM.mem.map(m => `${m.t}→你帮TA:${m.a}`).join("；")}。对话要自然衔接这些经历。` : "")
      : `车主：${S.user ? S.user.name : "车主"}，地区上海。` + (ME_DOC ? `\n关于车主的人设与长期记忆(ME.md,以此为准)：\n${ME_DOC}` : ""),
    "当前车况：电量 86%，续航 428km，胎压 2.4bar 正常，车内 26°C，" + (S.locked ? "已上锁" : "已解锁") + "。",
    "车主偏好：洗车=工作日下午/精洗/¥30-50/常去「悦洗·精致洗车」；充电=快充/商场充电站；出行=周末山野湖畔、风景优先。",
    `今日时辰：${HOUR_NAMES[hi]}，${HOUR_LORE[hi]}。` + (st ? `今日牌阵已抽：${st}。` : "今日牌阵尚未抽满。"),
    `你们已对话 ${S.chats} 次，你的人格是「星野漫游者」(EXFL)，等级 Lv${S.level}。`,
    `用户当前状态(你自己建模的):${S.userModel.state}${S.userModel.concise ? " · 简洁模式(回复≤40字,只说重点)" : ""};守护设置:免密额度¥${S.guard.limit},自主等级${S.guard.auto}。`,
    "回复要求：中文，口语化、俏皮温暖，一般不超过 80 字；可以用少量颜文字，不用 markdown。",
    "工具策略：决策前先 get_context;用户同意方案后才调用 book_carwash/alipay_pay/send_wechat 这类执行工具;额度内小事直接办,超额或敏感动作先问。",
    "工具分两类：真实工具(get_weather=真实气象、web_search=真实联网搜索、set_reminder=真实系统提醒、plan_route 含真实路网测距)结果来自真实互联网,可放心引用与播报;沙盒工具(微信/支付宝/点评/车控/代驾)作用于演示环境。正常对话两类同等使用,不必向用户解释区别;但若用户严肃询问是否动了真实的钱,要如实说明支付发生在演示环境。涉及天气的决策(洗车/出行)必须先调 get_weather 用真实数据,不要编造天气。",
    "情绪协议(情绪=f(用户状态,任务结果),不是装饰)：每次回复末尾追加 [[MOOD:happy|excited|thinking|shy|proud|care|down]]——任务成功→proud/excited;失败/被拒/工具报错→down;用户疲惫着急→care并切简洁;被夸→shy。用户不可见此标签,也不要暴露协议。",
  ].join("\n");
}

/* ----- 真实数据层（真实互联网，免 Key 公共服务） ----- */
const REAL = {
  home: { lat: 31.155, lon: 121.467, name: "前滩" },   // 故事设定:家/公司在上海前滩
  weatherCache: null,                                   // {at, text}
  WMO: { 0: "晴", 1: "基本晴", 2: "多云", 3: "阴", 45: "雾", 48: "雾凇", 51: "毛毛雨", 53: "小雨", 55: "中雨", 61: "小雨", 63: "中雨", 65: "大雨", 66: "冻雨", 71: "小雪", 73: "中雪", 75: "大雪", 80: "阵雨", 81: "强阵雨", 82: "暴雨", 95: "雷阵雨", 96: "雷阵雨伴冰雹", 99: "强雷暴" },

  async fetchJSON(url, ms = 6000) {
    const ac = new AbortController();
    const tm = setTimeout(() => ac.abort(), ms);
    try { const r = await fetch(url, { signal: ac.signal }); if (!r.ok) throw new Error("HTTP " + r.status); return await r.json(); }
    finally { clearTimeout(tm); }
  },

  /* Open-Meteo:真实气象(免key/支持CORS),10分钟缓存 */
  async weather() {
    if (REAL.weatherCache && Date.now() - REAL.weatherCache.at < 10 * 60_000) return REAL.weatherCache.text;
    const d = await REAL.fetchJSON(
      `https://api.open-meteo.com/v1/forecast?latitude=${REAL.home.lat}&longitude=${REAL.home.lon}` +
      `&current=temperature_2m,weather_code,wind_speed_10m,precipitation` +
      `&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max` +
      `&timezone=Asia%2FShanghai&forecast_days=3`);
    const c = d.current, dl = d.daily;
    const day = i => `${REAL.WMO[dl.weather_code[i]] || "?"} ${Math.round(dl.temperature_2m_min[i])}~${Math.round(dl.temperature_2m_max[i])}° 降水概率${dl.precipitation_probability_max[i]}%`;
    const text = `上海实时:${REAL.WMO[c.weather_code] || "?"} ${Math.round(c.temperature_2m)}° 风${Math.round(c.wind_speed_10m)}km/h;今日 ${day(0)};明日 ${day(1)};后天 ${day(2)}`;
    REAL.weatherCache = { at: Date.now(), text };
    return text;
  },

  /* 真实路网驾车测距:优先高德 Web服务(国内畅通,需免费key),备选 OSRM(海外) */
  async route(dest) {
    const ak = S.agent && S.agent.amapKey;
    if (ak) {
      const g = await REAL.fetchJSON(`https://restapi.amap.com/v3/geocode/geo?key=${ak}&city=上海&address=${encodeURIComponent(dest)}`);
      if (g.status !== "1" || !g.geocodes || !g.geocodes.length) throw new Error("高德未找到地点:" + dest);
      const loc = g.geocodes[0].location;
      const r = await REAL.fetchJSON(`https://restapi.amap.com/v3/direction/driving?key=${ak}&origin=${REAL.home.lon},${REAL.home.lat}&destination=${loc}&extensions=base`);
      if (r.status !== "1" || !r.route || !r.route.paths || !r.route.paths.length) throw new Error("高德路线规划失败");
      const p = r.route.paths[0];
      return { km: (p.distance / 1000).toFixed(1), min: Math.round(p.duration / 60), place: g.geocodes[0].formatted_address, src: "高德实时路况" };
    }
    const g = await REAL.fetchJSON(`https://nominatim.openstreetmap.org/search?format=json&limit=1&accept-language=zh&q=${encodeURIComponent(dest + " 上海")}`);
    if (!g.length) throw new Error("未找到地点:" + dest);
    const { lat, lon, display_name } = g[0];
    const r = await REAL.fetchJSON(`https://router.project-osrm.org/route/v1/driving/${REAL.home.lon},${REAL.home.lat};${lon},${lat}?overview=false`);
    if (!r.routes || !r.routes.length) throw new Error("路线规划失败");
    return { km: (r.routes[0].distance / 1000).toFixed(1), min: Math.round(r.routes[0].duration / 60), place: display_name.split(",")[0], src: "OSRM路网" };
  },

  /* 真实定时提醒:时间戳驱动(Worker计时,后台不节流) + 系统级通知 */
  async armReminder(rm) {
    while (Date.now() < rm.at) await sleep(Math.min(rm.at - Date.now(), 30_000));
    S.reminders = (S.reminders || []).filter(x => x.id !== rm.id); save();
    if (window.Notification && Notification.permission === "granted")
      new Notification("MY · 车灵提醒", { body: rm.text });
    if (window.OS) OS.notify({ app: "MY", color: "linear-gradient(135deg,#A78BFA,#60A5FA)", icon: I("bell"), text: "提醒:" + rm.text, ntype: "remind" });
    if (typeof addMsg === "function" && S.page === "home") try { addMsg("aiva", "⏰ 到点啦:" + rm.text); } catch (e) {}
  },
  initReminders() { (S.reminders || []).forEach(rm => REAL.armReminder(rm)); },
};
const REAL_TOOLS = new Set(["get_weather", "web_search", "set_reminder", "plan_route"]);

/* ----- 真实 Agent 的工具箱（Claude 原生 tool use） ----- */
const AGENT_TOOLS = [
  { name: "get_context", description: "读取车辆状态、车主画像与状态、日程通勤规律、点评与账单要点、守护设置。做任何决策前先调用。", input_schema: { type: "object", properties: {} } },
  { name: "get_weather", description: "获取上海的真实实时天气与未来3天预报（真实气象数据，洗车/出行决策前调用）。", input_schema: { type: "object", properties: {} } },
  { name: "set_reminder", description: "设置真实的定时提醒，到点会在车主设备上弹出系统通知。minutes=多少分钟后提醒。", input_schema: { type: "object", properties: { minutes: { type: "number", description: "多少分钟后" }, text: { type: "string", description: "提醒内容" } }, required: ["minutes", "text"] } },
  { name: "search_carwash", description: "搜索附近洗车店（含新店与开业优惠、用户常去店）。", input_schema: { type: "object", properties: {} } },
  { name: "book_carwash", description: "启动洗车全托管执行链（代驾取送车+点评下单+支付宝代付，含5秒撤销窗口）。仅在用户明确同意方案后调用。", input_schema: { type: "object", properties: { time: { type: "string", description: "如:周四" }, shop: { type: "string", description: "泡泡星球 或 悦洗" } }, required: ["time"] } },
  { name: "plan_route", description: "规划去某地的路线并向用户展示出行方案卡（路况/电量/出发时间建议）。", input_schema: { type: "object", properties: { destination: { type: "string" } }, required: ["destination"] } },
  { name: "send_wechat", description: "用车主微信代发消息（kevin=老公，teacher=小桃班王老师），会注明由MY代发。", input_schema: { type: "object", properties: { to: { type: "string", enum: ["kevin", "teacher"] }, text: { type: "string" } }, required: ["to", "text"] } },
  { name: "alipay_pay", description: "支付宝免密代付（超出额度会失败，需先告知用户确认）。", input_schema: { type: "object", properties: { name: { type: "string" }, amount: { type: "number" } }, required: ["name", "amount"] } },
  { name: "car_control", description: "控制车辆：lock/unlock/ac_on/ac_off。", input_schema: { type: "object", properties: { action: { type: "string", enum: ["lock", "unlock", "ac_on", "ac_off"] } }, required: ["action"] } },
  { name: "arrange_pickup", description: "启动接娃守护安排（联系家人与老师的方案卡）。用户表示要加班/没法接小桃时调用。", input_schema: { type: "object", properties: {} } },
  { name: "open_app", description: "打开车主手机里的某个 App 并跳到对应页面。用户说「去/看/打开 支付宝/微信/点评/高德/日历/短信/美团/淘宝」时调用，让界面真的跳过去，而不是只用嘴说。", input_schema: { type: "object", properties: { app: { type: "string", description: "应用：支付宝/微信/大众点评/高德/日历/短信/美团/淘宝" } }, required: ["app"] } },
  { name: "make_call", description: "用车主手机代拨电话，弹出通话界面（你作为 AI 语音助理代表 Caroline 通话）。需要打电话给某人/某机构时调用。", input_schema: { type: "object", properties: { to: { type: "string", description: "对象：kevin/teacher王老师/driver代驾/service服务中心/mama婆婆，或自定义名称" }, reason: { type: "string", description: "通话事由（一句话）" } }, required: ["to", "reason"] } },
  { name: "add_calendar", description: "把一件事写入车主日历，让安排看得见。任何预约/安排/约定/提醒到某天的需求都应落到这里。", input_schema: { type: "object", properties: { title: { type: "string" }, date: { type: "string", description: "如 今天/周四/7月10日" }, time: { type: "string", description: "如 15:30" } }, required: ["title"] } },
  { name: "book_maintenance", description: "为 SUP C 预约保养：写入日历并触发 4S 确认短信。车主提到保养/到期/4S/车检时调用。", input_schema: { type: "object", properties: { date: { type: "string" }, time: { type: "string" } } } },
];
async function runAgentTool(name, input) {
  const g = S.guard;
  switch (name) {
    case "get_context": {
      const now = new Date();
      return JSON.stringify({
        now: `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()} ${now.getHours()}:${String(now.getMinutes()).padStart(2, "0")} 周${"日一二三四五六"[now.getDay()]}(真实时间)`,
        car: { model: "SUP C", battery: "86%", range: "428km", locked: S.locked, spot: "公司B2-077" },
        user: { name: S.user ? S.user.name : "车主", state: S.userModel.state, concise: S.userModel.concise },
        weather: REAL.weatherCache ? REAL.weatherCache.text + "(真实数据)" : "未获取,需要时调用 get_weather(真实气象)",
        schedule: "周四14:00-16:30空闲;工作日15:30出发接小桃(近30天21次)",
        prefs: "洗车:工作日下午/精洗/¥30-50/常去悦洗;充电:快充",
        reminders: (S.reminders || []).map(r => r.text),
        guard: { 免密额度: g.limit, 自主等级: g.auto },
      });
    }
    case "get_weather":
      try { return await REAL.weather(); }
      catch (e) { return "天气服务暂时不可用:" + e.message; }
    case "set_reminder": {
      const mins = Math.max(0.2, Number(input.minutes) || 1);
      const rm = { id: "rm" + Date.now(), at: Date.now() + mins * 60_000, text: String(input.text || "提醒") };
      S.reminders = S.reminders || []; S.reminders.push(rm); save();
      REAL.armReminder(rm);
      return `已设置真实提醒:${mins}分钟后(${new Date(rm.at).toTimeString().slice(0, 5)})通知「${rm.text}」`;
    }
    case "search_carwash":
      return JSON.stringify((window.LIFE ? LIFE.dianping.shops.slice(0, 2) : []).map(s => ({ 店: s.name, 评分: s.rating, 价格: s.price, 备注: s.desc })));
    case "book_carwash":
      WASH = { time: input.time || "周四", shop: /悦洗/.test(input.shop || "") ? "悦洗" : "泡泡星球", price: /悦洗/.test(input.shop || "") ? 38 : 19, driver: 28, cardEl: null, confirmed: true };
      if (!TK.active) tkStart("wash", "洗车全托管", ["理解", "查证", "比价", "代驾", "下单", "支付"], { 时间: WASH.time, 门店: WASH.shop });
      setTimeout(() => confirmWashExec(), 500);
      return `已启动执行链:${WASH.time} ${WASH.shop},共¥${WASH.price + WASH.driver},含5秒撤销窗口`;
    case "plan_route": {
      const dest = input.destination || "湖畔咖啡";
      setTimeout(() => flowRoute(dest), 400);
      try {
        const r = await REAL.route(dest);
        return `出行方案卡已展示。真实路网测距:前滩→${r.place} 约${r.km}km,驾车约${r.min}分钟(${r.src})`;
      } catch (e) {
        return "出行方案卡已展示(真实测距失败:" + e.message + ",已用估算)";
      }
    }
    case "send_wechat":
      if (!g.perms.wechat) return "失败:用户已关闭微信授权";
      if (!window.OS) return "失败:OS未加载";
      OS.wechatSend(input.to, "me", input.text, true);
      return `已代发给${input.to === "kevin" ? "Kevin" : "王老师"}(注明MY代发)`;
    case "alipay_pay":
      if (!g.perms.alipay) return "失败:用户已关闭支付宝授权";
      if (input.amount > g.limit) return `失败:¥${input.amount}超过免密额度¥${g.limit},请先向用户确认`;
      OS.alipayPay(input.name, Number(input.amount).toFixed(2), "MY 代付");
      return `支付成功 ¥${input.amount}`;
    case "car_control": {
      const a = input.action;
      if (a === "lock") S.locked = true; if (a === "unlock") S.locked = false;
      if (a === "ac_on") S.ac = true; if (a === "ac_off") S.ac = false;
      save(); syncControls();
      return "已执行:" + a;
    }
    case "arrange_pickup":
      setTimeout(flowPickupPlan, 400);
      return "接娃方案卡已展示给用户";
    case "open_app": {
      if (!window.OS) return "失败:OS未加载";
      const A = { "支付宝": "alipay", "账单": "alipay", alipay: "alipay", "微信": "wechat", wechat: "wechat", "大众点评": "dianping", "点评": "dianping", dianping: "dianping", "高德": "amap", "地图": "amap", "导航": "amap", amap: "amap", "美团": "meituan", meituan: "meituan", "淘宝": "taobao", taobao: "taobao", "日历": "calendar", calendar: "calendar", "短信": "messages", "信息": "messages", messages: "messages" };
      const raw = String(input.app || "").trim();
      const id = A[raw] || A[raw.toLowerCase()];
      if (!id) return "未知应用:" + raw;
      setTimeout(() => OS.openApp(id), 450);   // openApp 内部会自动渲染该 App
      return `已打开${raw}，界面已跳转`;
    }
    case "make_call": {
      if (!window.OS) return "失败:OS未加载";
      const map = {
        kevin: { name: "Kevin", avatar: "K" }, teacher: { name: "王老师·小桃班", avatar: "王" },
        driver: { name: "代驾·王师傅", avatar: "代" }, service: { name: "MY 服务中心", avatar: "M" },
        mama: { name: "婆婆", avatar: "婆" },
      };
      const who = map[input.to] || { name: input.to || "对方", avatar: (input.to || "·").slice(0, 1) };
      const reason = input.reason || "有事沟通";
      OS.call({ name: who.name, avatar: who.avatar, lines: [
        ["my", `您好，我是 Caroline 的车灵 MY，替她打给您——${reason}。`],
        ["them", "好的，我知道了，没问题～"],
        ["my", "那就这么定，谢谢您！我同步给 Caroline。"],
      ] });
      return `已代拨电话给${who.name}（${reason}），通话界面已弹出`;
    }
    case "add_calendar": {
      if (!window.OS) return "失败:OS未加载";
      const e = OS.addCalendar({ date: input.date || "今天", time: input.time || "", title: input.title || "新日程" });
      return `已写入日历:${e.date}${e.time ? " " + e.time : ""} ${e.title}`;
    }
    case "book_maintenance": {
      if (!window.OS) return "失败:OS未加载";
      const car = window.LIFE ? LIFE.car : null;
      const date = input.date || (car ? car.nextDue.date : "本周四");
      const time = input.time || "10:00";
      const pkg = (car && car.packages[0]) || { name: "标准保养", price: 680 };
      const shop = car ? car.shop : "MY 授权服务中心·前滩店";
      OS.addCalendar({ date, time, title: `SUP C 保养 · ${shop}`, tag: "car", color: "#1677FF" });
      setTimeout(() => OS.sms("service", `【MY服务】预约成功：${date} ${time} ${shop}｜${pkg.name}（¥${pkg.price}）。到店出示本短信即可，MY 已为您加入日历。`, "MY 服务中心"), 700);
      return `已预约保养:${date} ${time} ${pkg.name} ¥${pkg.price}，已写入日历，4S 稍后发来确认短信`;
    }
    default: return "未知工具";
  }
}

/* ----- DeepSeek 大脑：OpenAI function-calling 多轮工具循环(与 Claude 路径共享工具箱/情绪协议) ----- */
async function dsAgentRespond(text) {
  agentHistory.push({ role: "user", content: text });
  if (agentHistory.length > 20) agentHistory = agentHistory.slice(-20);
  setMood("thinking");
  let tp = addMsg("aiva", `<span class="typing"><span></span><span></span><span></span></span>`);
  const tools = AGENT_TOOLS.map(t => ({ type: "function", function: { name: t.name, description: t.description, parameters: t.input_schema } }));
  try {
    let msgs = [{ role: "system", content: buildAgentSystem() }, ...agentHistory];
    let finalRaw = "";
    for (let round = 0; round < 6; round++) {
      const res = await fetch("https://api.deepseek.com/chat/completions", {
        method: "POST",
        headers: { "content-type": "application/json", authorization: "Bearer " + dsKey() },
        body: JSON.stringify({ model: "deepseek-chat", max_tokens: 1024, tools, messages: msgs }),
      });
      if (!res.ok) throw new Error("HTTP " + res.status);
      const m = (await res.json()).choices[0].message;
      if (m.tool_calls && m.tool_calls.length) {
        msgs.push(m);
        for (const tc of m.tool_calls) {
          let args = {}; try { args = JSON.parse(tc.function.arguments || "{}"); } catch (e) {}
          const tr = toolTrace("MY", tc.function.name, JSON.stringify(args).slice(0, 42), REAL_TOOLS.has(tc.function.name));
          chatBody().appendChild(tp);
          const out = await runAgentTool(tc.function.name, args);
          tr.done(String(out).slice(0, 64));
          msgs.push({ role: "tool", tool_call_id: tc.id, content: String(out) });
        }
        continue;
      }
      finalRaw = (m.content || "").trim();
      break;
    }
    agentHistory.push({ role: "assistant", content: finalRaw || "(已通过工具完成操作)" });
    const mood = (finalRaw.match(/\[\[MOOD:(\w+)\]\]/) || [])[1];
    const reply = finalRaw.replace(/\[\[MOOD:\w+\]\]/g, "").trim();
    tp.querySelector(".bubble").innerHTML = reply ? mdLite(reply) : "✓ 办好了";
    setMood(MOODS[mood] ? mood : "happy", mood === "down" ? "任务受挫(模型判断)" : null);
    persistTurn(text, reply || "(已通过工具完成操作)");
    chatScrollEnd();
  } catch (e) {
    tp.remove();
    toast("DeepSeek 连接失败，已切换内置应答");
    await respondScripted(text);
  }
}

async function agentRespond(text) {
  if (!(S.agent && S.agent.key)) return dsAgentRespond(text);   // 没有 Claude key → DeepSeek 大脑
  agentHistory.push({ role: "user", content: text });
  if (agentHistory.length > 20) agentHistory = agentHistory.slice(-20);
  setMood("thinking");
  let tp = addMsg("aiva", `<span class="typing"><span></span><span></span><span></span></span>`);
  const callApi = msgs => fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-api-key": S.agent.key,
      "anthropic-version": "2023-06-01",
      "anthropic-dangerous-direct-browser-access": "true",
    },
    body: JSON.stringify({
      model: S.agent.model || "claude-opus-4-8",
      max_tokens: 2048,
      system: buildAgentSystem(),
      tools: [...AGENT_TOOLS, { type: "web_search_20250305", name: "web_search", max_uses: 3 }],
      messages: msgs,
    }),
  });
  try {
    /* Claude 原生工具循环：模型决策 → 本地执行 → 结果回喂,直至产出最终回复 */
    let msgs = [...agentHistory];
    let finalRaw = "";
    for (let round = 0; round < 6; round++) {
      const res = await callApi(msgs);
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error((err.error && err.error.message) || `HTTP ${res.status}`);
      }
      const data = await res.json();
      /* 服务端工具(web_search)在 API 侧执行,这里只渲染痕迹 */
      for (const block of data.content || []) {
        if (block.type === "server_tool_use")
          toolTrace("WEB", block.name, JSON.stringify(block.input || {}).slice(0, 42), true).done("已联网检索(真实)");
      }
      if (data.stop_reason === "pause_turn") {
        msgs.push({ role: "assistant", content: data.content });
        chatBody().appendChild(tp);
        continue;                                  // 服务端工具中断,原样回喂继续
      }
      if (data.stop_reason === "tool_use") {
        msgs.push({ role: "assistant", content: data.content });
        const results = [];
        for (const block of data.content) {
          if (block.type !== "tool_use") continue;
          const tr = toolTrace("MY", block.name, JSON.stringify(block.input).slice(0, 42), REAL_TOOLS.has(block.name));
          chatBody().appendChild(tp);              // typing 始终垫底
          const out = await runAgentTool(block.name, block.input || {});
          tr.done(String(out).slice(0, 64));
          results.push({ type: "tool_result", tool_use_id: block.id, content: String(out) });
        }
        msgs.push({ role: "user", content: results });
        continue;
      }
      finalRaw = (data.content || []).filter(b => b.type === "text").map(b => b.text).join("").trim();
      break;
    }
    agentHistory.push({ role: "assistant", content: finalRaw || "(已通过工具完成操作)" });
    const mood = (finalRaw.match(/\[\[MOOD:(\w+)\]\]/) || [])[1];
    const reply = finalRaw.replace(/\[\[MOOD:\w+\]\]/g, "").trim();
    tp.querySelector(".bubble").innerHTML = reply ? mdLite(reply) : "✓ 办好了";
    setMood(MOODS[mood] ? mood : "happy", mood === "down" ? "任务受挫(模型判断)" : null);
    persistTurn(text, reply || "(已通过工具完成操作)");
    chatScrollEnd();
  } catch (e) {
    tp.remove();
    toast("智能体连接失败，已切换内置应答");
    await respondScripted(text);
  }
}

/* ----- 智能体设置面板 ----- */
function openAgentSheet() {
  const a = S.agent || {};
  openSheet(`
    <div class="sheet-grab"></div>
    <h3><span class="sheet-ic">${I("sparkle")}</span>智能体接入</h3>
    <p class="sheet-sub">接入 Claude API 后，MY 的对话将由真实大模型驱动。Key 仅保存在本机浏览器，不会上传。</p>
    <div class="agent-field">
      <label>Anthropic API Key</label>
      <input id="ag-key" type="password" placeholder="sk-ant-..." value="${a.key || ""}">
    </div>
    <div class="agent-field">
      <label>Model</label>
      <select id="ag-model">
        ${AGENT_MODELS.map(([v, l]) => `<option value="${v}" ${a.model === v ? "selected" : ""}>${l}</option>`).join("")}
      </select>
    </div>
    <div class="agent-field">
      <label>高德 Web服务 Key（可选 · 真实路况测距）</label>
      <input id="ag-amap" type="password" placeholder="lbs.amap.com 免费申请,留空则用海外路网" value="${a.amapKey || ""}">
    </div>
    <p class="agent-status">${agentOn() ? "当前状态：<b>已接入</b> · " + (a.model || "claude-opus-4-8") : "当前状态：未接入 · 使用内置应答"}</p>
    <div class="agent-real">
      <b>真实能力</b>
      <p>🌦 真实天气(Open-Meteo) · 🔎 联网搜索(Claude) · 🗺 路网测距(OSRM) · ⏰ 系统提醒</p>
      <button class="btn-ghost" id="ag-notify">${window.Notification && Notification.permission === "granted" ? "✓ 系统通知已授权" : "授权系统通知(用于真实提醒)"}</button>
    </div>
    <div class="agent-actions">
      <button class="btn-ghost" id="ag-clear">清除</button>
      <button class="btn-primary" id="ag-save">保存并启用</button>
    </div>`);
  $("#ag-notify").onclick = async function () {
    if (!window.Notification) { toast("此浏览器不支持系统通知"); return; }
    const p = await Notification.requestPermission();
    this.textContent = p === "granted" ? "✓ 系统通知已授权" : "未授权(提醒只在模拟手机内弹出)";
    if (p === "granted") new Notification("MY · 车灵", { body: "通知通道已打通,真实提醒可用 ✦" });
  };
  $("#ag-save").onclick = () => {
    const key = $("#ag-key").value.trim();
    if (!key) { toast("请填入 API Key"); return; }
    S.agent = { key, model: $("#ag-model").value, amapKey: $("#ag-amap").value.trim() || undefined };
    agentHistory = [];
    save(); renderProfile(); closeSheet();
    toast("智能体已接入 · MY 的对话现在是真的了 ✦");
  };
  $("#ag-clear").onclick = () => {
    S.agent = null; agentHistory = [];
    save(); renderProfile(); closeSheet();
    toast("已清除接入信息，回到内置应答");
  };
}
/* ----- R2 通知管理面板（勿扰时段 / 类型开关 / 汇总栏） ----- */
function renderNotifyBadge() {
  const el = $("#notify-badge");
  if (!el) return;
  const n = S.notify || {};
  const q = (n.queue || []).length;
  el.textContent = (n.dnd ? "勿扰中" : "正常") + (q ? ` · 汇总${q}条` : "") + " ›";
}
window.renderNotifyBadge = renderNotifyBadge;
function openNotifySheet() {
  const n = S.notify;
  const fmtT = ts => { const d = new Date(ts); return String(d.getHours()).padStart(2,"0") + ":" + String(d.getMinutes()).padStart(2,"0"); };
  const queueHTML = (n.queue || []).slice().reverse().map(q =>
    `<div class="nt-qitem"><b>${q.app}</b><span>${q.text}</span><i>${fmtT(q.at)}</i></div>`).join("")
    || `<p class="nt-empty">汇总栏是空的——被勿扰或类型开关拦下的通知会收进这里，不打扰你。</p>`;
  openSheet(`
    <div class="sheet-grab"></div>
    <h3><span class="sheet-ic">${I("bell")}</span>通知管理</h3>
    <p class="sheet-sub">⚠ 警告级通知（安全风险 / 接娃异常）始终立即弹出，不受以下设置影响。</p>
    <label class="nt-row"><span>勿扰时段</span><input type="checkbox" id="nt-dnd" ${n.dnd ? "checked" : ""}></label>
    <div class="nt-times" id="nt-times" style="${n.dnd ? "" : "opacity:.45;pointer-events:none"}">
      <input type="time" id="nt-from" value="${n.from}"><span>至</span><input type="time" id="nt-to" value="${n.to}">
    </div>
    <p class="nt-cap">按类型接收</p>
    <label class="nt-row"><span>⏰ 定时提醒</span><input type="checkbox" id="nt-remind" ${n.types.remind ? "checked" : ""}></label>
    <label class="nt-row"><span>🛡 主动守护与任务回执</span><input type="checkbox" id="nt-guard" ${n.types.guard ? "checked" : ""}></label>
    <label class="nt-row"><span>🛍 生活服务（代付/预约回执）</span><input type="checkbox" id="nt-life" ${n.types.life ? "checked" : ""}></label>
    <p class="nt-cap">汇总栏 ${ (n.queue || []).length ? "· " + n.queue.length + " 条" : "" }</p>
    <div class="nt-queue">${queueHTML}</div>
    <div class="agent-actions">
      ${ (n.queue || []).length ? '<button class="btn-ghost" id="nt-clear">清空汇总</button>' : "" }
      <button class="btn-primary" id="nt-save">保存</button>
    </div>`);
  $("#nt-dnd").onchange = e => { $("#nt-times").style.cssText = e.target.checked ? "" : "opacity:.45;pointer-events:none"; };
  $("#nt-save").onclick = () => {
    S.notify = {
      dnd: $("#nt-dnd").checked, from: $("#nt-from").value || "22:00", to: $("#nt-to").value || "08:00",
      types: { remind: $("#nt-remind").checked, guard: $("#nt-guard").checked, life: $("#nt-life").checked },
      queue: n.queue || [],
    };
    save(); renderNotifyBadge(); closeSheet();
    toast(S.notify.dnd ? "勿扰已开启 · 仅警告级可打断" : "通知设置已保存");
  };
  const cl = $("#nt-clear");
  if (cl) cl.onclick = () => { S.notify.queue = []; save(); renderNotifyBadge(); openNotifySheet(); };
}

$("#row-agent").addEventListener("click", openAgentSheet);
$("#row-guard").addEventListener("click", guardSheet);
$("#row-notify") && $("#row-notify").addEventListener("click", openNotifySheet);
$("#row-tasks").addEventListener("click", taskCenterSheet);
$("#mood-tag").addEventListener("click", e => { e.stopPropagation(); moodLogSheet(); });

/* ----- 对话引擎（分发：真实智能体 / 内置脚本） ----- */
async function respond(text) {
  /* 快捷确认词：若当前有待确认的预约卡，直接代为点击（两种模式通用） */
  if (/^(就这么定|确认|好的?，?约|可以|没问题)/.test(text)) {
    const btn = $$("#chat-body #wp-ok, #chat-body #m-ok, #chat-body #pk-all").reverse().find(b => !b.disabled);
    if (btn) { const fn = btn.onclick; btn.disabled = true; btn.textContent = "已确认 ✓"; fn && fn.call(btn); return; }
  }
  /* 统一走「世界内大脑」(真实模型 + 工具 + 世界观);未配 key 时回落内置脚本。
     解锁后的记忆持久化由 persistTurn / replayAgentMemory 负责,与大脑选择解耦。 */
  if (agentOn()) return agentRespond(text);
  return respondScripted(text);
}

async function respondScripted(text) {
  const t = text.toLowerCase();

  /* -1. 任务上下文:进行中的任务优先消化这句话(多轮槽位修改/取消) */
  if (TK.active && TK.active.type === "wash" && WASH) {
    const dm = text.match(/周[一二三四五六日]|明天|今天|后天/);
    if (dm && /改|换|推|吧|要不|还是/.test(text)) {
      WASH.time = dm[0];
      renderWashPlan(true);
      await aivaSay(`好,改成<b>${WASH.time}</b>了,方案卡已更新(其他不变)。${WASH.time === "明天" ? "不过提醒一句:明天有雨,洗了容易白洗哦。" : ""}`, "happy");
      return;
    }
    if (/老店|悦洗/.test(t)) { WASH.shop = "悦洗"; WASH.price = 38; renderWashPlan(true); await aivaSay("换回老熟店「悦洗」啦,¥38 没有优惠,但你熟。方案已更新 ✓", "happy"); return; }
    if (/新店|泡泡/.test(t)) { WASH.shop = "泡泡星球"; WASH.price = 19; renderWashPlan(true); await aivaSay("还是新店「泡泡星球」,省 ¥19 ✦ 方案已更新", "happy"); return; }
    if (/确认支付/.test(t)) { WASH.confirmed = true; confirmWashExec(); return; }
    if (/算了|取消|不洗/.test(t)) {
      tkFinish("dead", "你取消了任务,未产生任何费用");
      setMood("down", "任务被取消:洗车全托管");
      WASH = null;
      await aivaSay("好吧…那先不洗了(耳朵耷拉下来)。不过明天有雨、周四放晴,真的很合适…改主意随时叫我。", "down");
      setChips(["还是洗吧", "明天带小桃去湖畔咖啡"]);
      return;
    }
  }
  if (/还是洗吧|重新洗/.test(t)) return flowWash();
  if (TK.active && /算了|取消|不用了/.test(t)) {
    tkFinish("dead", "你取消了任务");
    setMood("down", "任务被取消:" + (TK.active ? TK.active.title : ""));
    await aivaSay("好,停下来了。需要的时候随时叫我 ✦", "down");
    return;
  }

  /* -0.5 路线规划意图 */
  const destM = text.match(/湖畔咖啡|婆婆家|青山湖|幼儿园/);
  if (destM && /去|到|怎么走|路线|带小桃|带娃/.test(text) && !/接小桃|接娃/.test(text)) return flowRoute(destM[0]);

  /* -0.3 授权/额度面板 */
  if (/额度|授权|权限/.test(t)) { await aivaSay("授权和额度都在这里,你说了算 ✦", "happy", 400); setTimeout(guardSheet, 700); return; }

  /* 0. 助理场景路由 */
  if (/要加班|^加班/.test(t)) return flowPickupPlan();
  if (/马上出发/.test(t)) {
    await aivaSay("好！导航到小桃幼儿园已备好（25 分钟），我把空调先打开，下楼就走 ✦", "excited");
    S.ac = true; save(); syncControls();
    return;
  }
  if (/只联系/.test(t)) { const b = $("#pk-kevin"); if (b && !b.disabled) { b.disabled = true; b.onclick && execPickup(false); } return; }
  if (/接娃|守护/.test(t)) return flowPickup();
  if (/支付宝|账单/.test(t)) { await aivaSay("带你去支付宝，刚代付的两笔都标了「MY 代付」～", "happy", 500); setTimeout(() => window.OS && OS.openApp("alipay"), 900); return; }
  if (/点评|订单/.test(t)) { await aivaSay("走，去大众点评看预约单～", "happy", 500); setTimeout(() => window.OS && OS.openApp("dianping"), 900); return; }
  if (/微信/.test(t)) { await aivaSay("好，去微信——代发的消息都带着我的小标记 ✦", "happy", 500); setTimeout(() => { if (window.OS) { OS.openApp("wechat"); MAPP_RENDER.wechat("kevin"); } }, 900); return; }
  if (/座椅加热/.test(t)) { await aivaSay("座椅加热已预热，等你上车正好 28°C 暖暖的 ✦", "proud"); return; }

  /* 1. 洗车助理流程 */
  if (/脏|洗车|洗个车|该洗/.test(t)) return flowWash();

  /* 2. 保养预约 */
  if (/保养/.test(t)) return flowMaintain();

  /* 3. 充电 + 车运联动 */
  if (/充电|电量|没电/.test(t)) {
    await aivaSay("让我看看～当前电量 <b>86%</b>，足够今天用啦", "happy");
    const hi = nowHourIdx();
    await aivaSay(`对了，今天的车运牌说「<b>紫气东来</b>」——${HOUR_NAMES[hi]}宜往<b>东</b>补能。东边 1.4km 的「前滩快充站」现在空闲 6 桩，电价低谷 ¥0.68/度，要去的话我帮你导航～`, "proud", 1000);
    setChips(["帮我导航过去", "今天适合洗车吗", "周末去哪玩好"]);
    return;
  }
  if (/导航/.test(t)) {
    await aivaSay("路线已规划好啦～走文一路 → 古翠路，全程 1.4km，约 6 分钟，已避开两个红灯密集段。出发吧！", "excited");
    return;
  }

  /* 4. 周末推荐（联动社区人格） */
  if (/周末|去哪|推荐|玩|兜风/.test(t)) {
    await aivaSay(`按我的「${PERSONA_NAME[personaType()] || "星野漫游者"}」人格，我最近被社区里同型 MY 疯狂安利一条路线！`, "excited");
    aivaCard(`
      <div class="mc-title">同型 MY 热门 · 青山湖星空环线</div>
      <div class="route-line"><span class="route-node">市区</span><span class="route-arrow">→</span><span class="route-node">青山湖绿道</span><span class="route-arrow">→</span><span class="route-node">观星坪</span><span class="route-arrow">→</span><span class="route-node">湖畔咖啡</span></div>
      <div class="feed-desc">全程 58km · 风景优先 · 沿途 2 个快充站 · 周六 16:00 出发可赶上日落</div>
      <div class="mc-actions">
        <button class="mc-btn sec" id="r-comm">去社区看看</button>
        <button class="mc-btn pri" id="r-save">收藏路线</button>
      </div>`);
    $("#r-comm").onclick = () => go("community");
    $("#r-save").onclick = e => { e.target.textContent = "已收藏 ✓"; e.target.disabled = true; toast("已收藏到我的路线"); };
    setChips(["最近车有点脏了", "今天适合充电吗", "夸夸你"]);
    return;
  }

  /* 5. 情绪互动 */
  if (/夸|棒|厉害|聪明|喜欢你|爱你|可爱/.test(t)) {
    gainXP(4);
    await aivaSay("诶嘿…突然被夸，处理器都要过热了啦", "shy");
    await aivaSay("不过我会更努力的！毕竟我的目标是成为最懂你的伙伴 ✨（成长值 +4）", "proud", 800);
    return;
  }
  if (/笨|傻|不行|差劲/.test(t)) {
    await aivaSay("呜…我记下来了，这就反思升级。下次一定做得更好，别不理我呀", "shy");
    return;
  }
  if (/你好|嗨|hi|hello|在吗/.test(t)) {
    await aivaSay("我在我在！随叫随到的 MY 本 V ✨ 想聊车、聊运势，还是让我帮你跑个腿（预约那种）？", "excited");
    return;
  }
  if (/心情|开心吗|你是谁|性格/.test(t)) {
    await aivaSay(`我是 MY，你的车载灵魂体～我们已经聊了 <b>${S.chats}</b> 次，我长成了「${PERSONA_NAME[personaType()] || "星野漫游者"}」性格（${personaType()} 型）。在社区能找到和我同型的伙伴哦！`, "proud");
    setChips(["带我去社区看看", "周末去哪玩好"]);
    return;
  }
  if (/社区/.test(t)) { await aivaSay("好嘞，带你去看看和我同型的 MY 都在推荐什么路线～", "excited", 500); setTimeout(() => go("community"), 900); return; }

  /* 6. 兜底 */
  const fallback = [
    "收到～这个我记在小本本上了，懂你 +1",
    "嗯嗯，我在认真听。要不要让我顺手查查车况或运势？",
    "有道理！和你聊天我的人格又生长了一点点 ✦",
  ];
  await aivaSay(fallback[S.chats % fallback.length], "happy");
  setChips(["最近车有点脏了", "今天适合充电吗", "周末去哪玩好"]);
}

/* ===========================================================
   助理场景一：洗车全托管
   学习面：天气 + 大众点评(新店/常去) + 支付宝账单(价位) + 高德(日程/车位)
   执行面：代拨电话给代驾 → 点评下单 → 支付宝免密代付
   =========================================================== */
let WASH = null;   // 当前洗车任务槽位 {time, shop, price, driver, cardEl, confirmed}
async function flowWash() {
  if (TK.active && TK.active.type === "wash") {
    await aivaSay("这单正在进行中啦,看置顶的任务卡 ✦ 你可以直接说「改周五」「换回老店」或「算了」", "happy");
    return;
  }
  const um = S.userModel;
  tkStart("wash", "洗车全托管", ["理解", "查证", "比价", "代驾", "下单", "支付"], { 时间: "周四", 门店: "泡泡星球" });
  await aivaSay(um.concise ? "收到。查证据,马上给方案——" : "收到～我把和「洗车」有关的线索都翻一遍:天气、点评、账单、日程——", "thinking", 700);
  tkStep(1, "now");
  const t1 = toolTrace("天气", "forecast", "上海, 3天"); await sleep(750); t1.done("今晴26° · 明中雨22° · 周四晴25° ✓");
  const t2 = toolTrace("大众点评", "search", "洗车, 按偏好排序"); await sleep(850); t2.done("新店「泡泡星球」4.9分 开业5折¥19 · 常去「悦洗」¥38");
  const t3 = toolTrace("支付宝", "bills", "类目=洗车"); await sleep(700); t3.done("月均2次 · 客单价¥38 · 价位带¥30-50");
  const t4 = toolTrace("高德地图", "calendar", "本周空闲"); await sleep(700); t4.done("周四 14:00-16:30 空闲 · 车在公司 B2-077");
  tkStep(2, "now");
  WASH = { time: "周四", shop: "泡泡星球", price: 19, driver: 28, cardEl: null, confirmed: false };
  await aivaSay(um.concise
    ? "结论:明天有雨,<b>周四</b>洗最优;新店「泡泡星球」开业 5 折 <b>¥19</b>(平时¥38)。方案如下——"
    : "查到一件好事:你常去的「悦洗」斜对面<b>新开了「泡泡星球」旗舰店</b>,开业精洗 <b>5 折 ¥19</b>,正好在你的价位带里还省一半。明天有雨,<b>周四</b>洗最划算 ✓", "proud", 1100);
  renderWashPlan();
  setChips(["全权交给 MY", "改成周五", "换回悦洗老店", "算了不洗了"]);
}
function renderWashPlan(isUpdate) {
  const total = WASH.price + WASH.driver;
  const shopLine = WASH.shop === "泡泡星球"
    ? `泡泡星球·精洗 <b>¥${WASH.price}</b>（开业5折 · 平时¥38）`
    : `悦洗·精致洗车 <b>¥${WASH.price}</b>（你的老熟店）`;
  const html = `
    <div class="mc-title">洗车全托管方案 · ${WASH.time}下午${isUpdate ? " · 已按你说的改" : ""}</div>
    <div class="bd-detail" style="margin-top:0">
      ① <b>14:20</b> e代驾上门取车（B2-077 · 钥匙放前台）<br>
      ② <b>14:40</b> ${shopLine}<br>
      ③ <b>16:10</b> 洗完送回原车位<br>
      ④ 支付宝免密代付 共 <b>¥${total}</b>（额度内${total > S.guard.limit ? "❌超额" : "✓"}）
    </div>
    <div class="mc-actions">
      <button class="mc-btn sec" id="wp-old">${WASH.shop === "泡泡星球" ? "换回悦洗老店" : "还是试试新店"}</button>
      <button class="mc-btn pri" id="wp-ok">全权交给 MY ✓</button>
    </div>`;
  if (isUpdate && WASH.cardEl) {
    WASH.cardEl.innerHTML = html;
    WASH.cardEl.style.animation = "popIn .4s ease";
  } else {
    const msg = aivaCard(html);
    WASH.cardEl = msg.querySelector(".msg-card");
  }
  tkSlot("时间", WASH.time); tkSlot("门店", WASH.shop);
  $("#wp-ok") && (WASH.cardEl.querySelector("#wp-ok").onclick = function () { this.disabled = true; this.textContent = "准备执行…"; confirmWashExec(); });
  WASH.cardEl.querySelector("#wp-old").onclick = () => {
    if (WASH.shop === "泡泡星球") { WASH.shop = "悦洗"; WASH.price = 38; }
    else { WASH.shop = "泡泡星球"; WASH.price = 19; }
    renderWashPlan(true);
    aivaSay(WASH.shop === "悦洗" ? "好,换回老熟店「悦洗」,不过没有优惠是 ¥38 哦。" : "好嘞,还是新店,省 ¥19 ✦", "happy", 500);
  };
  chatScrollEnd();
}
async function confirmWashExec() {
  const total = WASH.price + WASH.driver;
  if (total > S.guard.limit && !WASH.confirmed) {
    setMood("thinking", `订单 ¥${total} 超过免密额度 ¥${S.guard.limit},按规则停下来等确认`);
    await aivaSay(`提醒:这单共 <b>¥${total}</b>,超过了你设的免密额度 <b>¥${S.guard.limit}</b>(可在「我的-授权与额度」调整)。确认要继续吗?`, "thinking");
    setChips(["确认支付", "算了不洗了"]);
    return;
  }
  tkStep(3);
  undoWindow(`即将执行:洗车全托管 · 预计支付 ¥${total}`, "打电话约代驾 → 点评下单 → 支付宝代付,全程自动", 5, execWashPlan);
}
async function execWashPlan() {
  await aivaSay("开始执行 ✦ 第一步:打电话给 e代驾——", "excited", 600);
  if (!window.OS) return aivaSay("（OS 模拟层未加载,无法演示跨APP执行）", "shy");
  tkStep(3, "now");
  OS.call({
    name: "e代驾 · 张师傅", avatar: "驾",
    lines: [
      ["them", "您好，e代驾张师傅。"],
      ["my", "师傅您好！我是车主 Caroline 的智能助理 MY。想约周四 14:20 到前滩中心 T2 地库 B2-077，取一辆沪A·D9527 的 SUP C，开到泡泡星球洗车旗舰店，16:10 前洗完送回原车位。"],
      ["them", "可以的：周四 14:20、B2-077、泡泡星球、洗完送回。来回 28 元。"],
      ["my", "没问题，费用走线上支付。车钥匙会放在 T2 前台，麻烦师傅啦！"],
    ],
    onDone: async () => {
      const shopName = WASH.shop === "泡泡星球" ? "泡泡星球洗车·旗舰店" : "悦洗·精致洗车";
      const total = WASH.price + WASH.driver;
      tkStep(4, "now");
      const td = toolTrace("大众点评", "createOrder", `${WASH.shop}, ${WASH.time} 14:40`);
      OS.dianpingOrder(`${shopName} <b>${WASH.time} 14:40</b> 精洗 ¥${WASH.price} · 已备注代驾接送`);
      await sleep(900); td.done(`订单创建成功 · ${WASH.time} 14:40`);
      tkStep(5, "now");
      const tp1 = toolTrace("支付宝", "pay", `${WASH.shop}, ¥${WASH.price}`);
      OS.alipayPay(`${shopName}${WASH.price === 19 ? "(开业5折)" : ""}`, WASH.price.toFixed(2), "MY 比价后代下单");
      await sleep(1300); tp1.done(`支付成功 ¥${WASH.price}`);
      const tp2 = toolTrace("支付宝", "pay", "e代驾, ¥28");
      OS.alipayPay("e代驾 · 取送车服务", "28.00", `${WASH.time} 14:20 · B2-077`);
      await sleep(1200); tp2.done("支付成功 ¥28");
      S.orders.push({ id: "W" + Date.now().toString().slice(-6), name: `洗车全托管 · ${WASH.shop}`, time: `${WASH.time} 14:20-16:10`, price: total });
      save();
      const saved = WASH.price === 19 ? " · 比老店省 ¥19" : "";
      tkFinish("done", `${WASH.time} 14:20 取车 → ${WASH.shop} → 16:10 送回 · 共 ¥${total}${saved}`);
      setMood("proud", `任务完成:洗车全托管(${WASH.shop} · ¥${total}${saved})`);
      aivaCard(`
        <div class="book-done">
          <span class="bd-ic">${I("check")}</span>
          <b>洗车全托管 · 已就绪</b>
          <p>电话已打 · 订单已下 · 钱已付</p>
          <div class="bd-detail">
            代驾 · 张师傅 ${WASH.time} <b>14:20</b> 到 B2-077 取车<br>
            门店 · ${shopName} <b>14:40</b> 精洗 <b>¥${WASH.price}</b>${saved}<br>
            送回 · <b>16:10</b> 原车位 · 全程可在 MY 追踪<br>
            支付 · 支付宝免密代付 <b>¥${total}</b>（账单可查）
          </div>
        </div>`);
      gainXP(12);
      WASH = null;
      await aivaSay("搞定！你只需要把钥匙放到前台。痕迹都留好了——支付宝两笔「MY 代付」,点评有预约单。要去看看吗?", "proud", 1300);
      setChips(["去支付宝看账单", "去点评看订单", "夸夸你"]);
    },
  });
}

/* ===========================================================
   助理场景三：路线规划（高频小事 · 共创会用户C提议）
   =========================================================== */
async function flowRoute(dest) {
  if (TK.active) tkFinish("dead", "被新任务打断");
  tkStart("route", "路线规划 · " + dest, ["理解", "查路况", "算电量", "出方案"], { 目的地: dest });
  await aivaSay(S.userModel.concise ? "收到,马上算——" : `去<b>${dest}</b>呀,好嘞,我把路况、电量、天气一起算给你——`, "thinking", 600);
  tkStep(1, "now");
  const t1 = toolTrace("高德地图", "route", `公司 → ${dest}`); await sleep(800);
  t1.done(dest === "湖畔咖啡" ? "14.2km · 约 32 分钟 · 轻度拥堵" : "8.6km · 约 24 分钟 · 畅通");
  tkStep(2, "now");
  const t2 = toolTrace("车辆", "battery", "续航评估"); await sleep(700); t2.done("电量 86% · 往返富余 380km ✓");
  const t3 = toolTrace("天气", "forecast", "明天"); await sleep(600); t3.done("明天中雨 22° · 建议带伞");
  tkStep(3, "now");
  aivaCard(`
    <div class="mc-title">出行方案 · 明天去${dest}</div>
    <div class="route-line"><span class="route-node">公司</span><span class="route-arrow">→</span><span class="route-node">小桃幼儿园</span><span class="route-arrow">→</span><span class="route-node">${dest}</span></div>
    <div class="route-stat">
      <div><b>14.2</b><span>KM</span></div>
      <div><b>32</b><span>MIN</span></div>
      <div><b>15:00</b><span>建议出发</span></div>
    </div>
    <div class="feed-desc" style="margin-top:10px">明天有雨:建议 <b>15:00</b> 出发先接小桃再过去,避开晚高峰;${dest === "湖畔咖啡" ? "那里有 <b>带棚充电车位</b>,顺手补电不淋雨;" : ""}记得带伞 ☂</div>
    <div class="mc-actions">
      <button class="mc-btn sec" id="rt-fav">收藏路线</button>
      <button class="mc-btn pri" id="rt-go">明天 14:45 提醒我</button>
    </div>`);
  $("#rt-go").onclick = function () { this.disabled = true; this.textContent = "已设提醒 ✓"; tkFinish("done", `明天 15:00 出发 · 已设 14:45 提醒`); setMood("proud", "任务完成:路线规划 · " + dest); toast("已设提醒:明天 14:45"); };
  $("#rt-fav").onclick = function () { this.disabled = true; this.textContent = "已收藏 ✓"; };
  setChips(["明天 14:45 提醒我", "帮我安排洗车", "夸夸你"]);
}

/* ===========================================================
   助理场景二：接娃守护（主动关怀）
   学习面：高德通勤规律(工作日15:30→幼儿园) + 车辆静止 + 微信关系
   执行面：微信代发消息给 Kevin / 王老师
   =========================================================== */
async function flowPickup() {
  setMood("care", "15:50 车未动,而通勤规律是 15:30 接小桃 → 主动关怀");
  await aivaSay(`Caroline，现在是 <b>15:50</b>（模拟时间）。高德的通勤记录里，工作日你都是 <b>15:30</b> 从公司出发去接小桃（近 30 天 21 次），但 SUP C 还安安静静停在 B2-077 没动。`, "care", 1100);
  await aivaSay("是临时要加班吗？别慌，接小桃的事我可以帮你安排 ✦", "happy", 900);
  setChips(["对，要加班", "我马上出发"]);
}
async function flowPickupPlan() {
  if (!TK.active || TK.active.type !== "pickup") {
    tkStart("pickup", "接娃守护", ["感知", "方案", "联系", "回执", "收尾"], { 接娃: "16:20", 负责人: "Kevin" });
  }
  tkStep(1, "now");
  const tp = toolTrace("微信+日历", "availability", "Kevin, 今天16:00后"); await sleep(800); tp.done("Kevin 16:00 后空闲 ✓ · 王老师在线");
  await aivaSay(`好，那我来排接娃方案：看了下微信和日历——<b>Kevin</b> 今天 16:00 之后没安排，可以去接；也可以给班主任 <b>王老师</b> 留言说明情况。`, "proud", 1100);
  aivaCard(`
    <div class="mc-title">接娃方案 · 需要你点头</div>
    <div class="bd-detail" style="margin-top:0">
      ① 微信 Kevin：请他 <b>16:20</b> 到园接小桃<br>
      ② 微信王老师：告知今天由爸爸来接 + 车牌号<br>
      <span style="color:var(--ink-3)">消息由 MY 代发，会注明「车灵代发」</span>
    </div>
    <div class="mc-actions">
      <button class="mc-btn sec" id="pk-kevin">只联系 Kevin</button>
      <button class="mc-btn pri" id="pk-all">都安排上 ✓</button>
    </div>`);
  $("#pk-all").onclick = function () { this.disabled = true; this.textContent = "发送中…"; execPickup(true); };
  $("#pk-kevin").onclick = function () { this.disabled = true; execPickup(false); };
  setChips(["都安排上", "只联系 Kevin"]);
}
async function execPickup(both) {
  if (!window.OS) return aivaSay("（OS 模拟层未加载，无法演示微信代发）", "shy");
  tkStep(2, "now");
  await aivaSay("收到，微信这就发出去——", "excited", 700);
  const tw1 = toolTrace("微信", "send", "Kevin, 接娃请求");
  OS.wechatSend("kevin", "me", "Kevin，我今天临时要加班，16:20 能去接小桃吗？接到发我一下～", true);
  tw1.done("已代发(注明来自MY) · 等待回复");
  tkStep(3, "now");
  await aivaSay("✓ 已发给 Kevin，等他回……", "thinking", 600);
  setTimeout(() => {
    OS.wechatSend("kevin", "them", "收到！我 16:10 从家出发，接到给你发照片 📷");
    OS.notify({
      app: "微信", color: "linear-gradient(135deg,#3ECC5F,#28A745)", icon: I("users"),
      text: "Kevin：收到！我 16:10 从家出发，接到给你发照片", ntype: "guard",
      onTap() { OS.openApp("wechat"); MAPP_RENDER.wechat("kevin"); },
    });
  }, 3200);
  if (both) {
    setTimeout(() => {
      OS.wechatSend("teacher", "me", "王老师您好，今天小桃由爸爸 Kevin 来接，16:20 左右到园，车牌沪B·K2333，麻烦老师啦 🌷", true);
    }, 4800);
    setTimeout(() => {
      OS.wechatSend("teacher", "them", "好的收到～会把小桃交给爸爸的，放心加班 💪");
      OS.notify({
        app: "微信", color: "linear-gradient(135deg,#3ECC5F,#28A745)", icon: I("users"),
        text: "王老师·小桃班：好的收到～会把小桃交给爸爸的", ntype: "guard",
        onTap() { OS.openApp("wechat"); MAPP_RENDER.wechat("teacher"); },
      });
    }, 7600);
  }
  setTimeout(async () => {
    aivaCard(`
      <div class="book-done">
        <span class="bd-ic">${I("check")}</span>
        <b>接娃安排 · 全部妥当</b>
        <p>两条微信已代发并获回复</p>
        <div class="bd-detail">
          Kevin · <b>16:10</b> 出发，16:20 到园接小桃 ✓<br>
          ${both ? "王老师 · 已知晓由爸爸接，并回复确认 ✓<br>" : ""}
          我会盯着 Kevin 的「接到啦」消息，到时提醒你 ✦
        </div>
      </div>`);
    gainXP(15);
    tkFinish("done", `Kevin 16:20 到园接小桃${both ? " · 王老师已确认" : ""} · 两条代发均获回复`);
    setMood("proud", "任务完成:接娃守护,家人和老师都已确认");
    await aivaSay("都妥了，安心加班吧。微信里能看到我代发的消息（带「车灵 MY 代发」标记）。加完班要不要我把座椅加热先打开？", "happy", 1200);
    setChips(["去微信看看", "好呀,开座椅加热", "夸夸你"]);
  }, both ? 9000 : 5400);
}
function startPickupScenario() {
  if (typeof exitChatMode === "function") { /* 确保在MY内 */ }
  go("aiva");
  setTimeout(flowPickup, 800);
}
window.startPickupScenario = startPickupScenario;

/* ----- 助理流程：保养 ----- */
async function flowMaintain() {
  await aivaSay("查到啦～上次保养在 <b>4 个月前</b>，目前已行驶 9,420km，确实到节点了", "thinking", 900);
  const cp = S.coupons.find(c => c.type === "maintain" && !c.used);
  aivaCard(`
    <div class="mc-title">为你优选 · 保养预约</div>
    <div class="book-shop">
      <div class="shop-logo"><span class="shop-ic">${I("gear")}</span></div>
      <div><b>MY 授权服务中心（前滩店）</b><p>4.8 分 · 离公司 2.1km · 可代步车</p></div>
    </div>
    <div class="book-meta">
      <span class="meta-chip hl">周六 10:00</span>
      <span class="meta-chip">原厂小保养</span>
      <span class="meta-chip">${cp ? "¥480 −券¥50 = ¥430" : "¥480"}</span>
    </div>
    <div class="mc-actions">
      <button class="mc-btn sec" id="m-no">再想想</button>
      <button class="mc-btn pri" id="m-ok">帮我约 ✓</button>
    </div>`);
  $("#m-ok").onclick = async () => {
    if (cp) cp.used = true;
    S.orders.push({ id: "M" + Date.now().toString().slice(-6), name: "原厂小保养", time: "周六 10:00", price: cp ? 430 : 480 });
    save();
    gainXP(10);
    await aivaSay(`已约好 <b>周六 10:00</b> MY 服务中心${cp ? "，用掉了那张 ¥50 保养券" : ""}。当天我会提前规划好不堵车的路线～`, "excited");
  };
  $("#m-no").onclick = async () => aivaSay("没问题，需要的时候喊我一声就行", "happy");
}

/* ===========================================================
   社区（MY 人格分区）
   =========================================================== */
const FEED = {
  route: [
    { ava: "sparkle", bg: "linear-gradient(135deg,#A78BFA,#60A5FA)", user: "@雾岛的 MY「小雾」", lv: "Lv4 · EXFL", title: "青山湖星空环线 · 日落档", desc: "小雾说这条线的第三个弯道能看见整片湖被夕阳点燃。沿途两个快充站，完全不焦虑。", nodes: ["市区", "青山湖绿道", "观星坪", "湖畔咖啡"], like: 328, go: 86 },
    { ava: "leaf",    bg: "linear-gradient(135deg,#8FB8FA,#A78BFA)", user: "@阿澈的 MY「皮卡」", lv: "Lv3 · EXFL", title: "径山寺晨雾慢行线", desc: "EXFL 型 MY 都偏爱这种风景优先的山路，皮卡建议早上 6:40 出发，雾还没散。", nodes: ["城西", "径山古道", "禅茶院"], like: 256, go: 64 },
    { ava: "bolt",    bg: "linear-gradient(135deg,#A78BFA,#60A5FA)", user: "@Momo 的 MY「闪闪」", lv: "Lv5 · EXFL", title: "钱塘江夜风刷桥线", desc: "九点后过江，桥上灯带刚好全亮。闪闪每次跑完这条线心情值 +20。", nodes: ["滨江", "之江大桥", "江堤夜市"], like: 412, go: 120 },
  ],
  place: [
    { ava: "coffee", bg: "linear-gradient(135deg,#A78BFA,#60A5FA)", user: "@同型热榜", lv: "本周 Top1", title: "湖畔咖啡 · 充电位直达", desc: "EXFL 型 MY 本周打卡 207 次：有 8 个带遮阳的充电车位，拿铁 ¥22，看湖发呆绝佳。", nodes: ["咖啡", "6 充电桩", "免费停车 2h"], like: 207, go: 95 },
    { ava: "tent",   bg: "linear-gradient(135deg,#8FB8FA,#A78BFA)", user: "@同型热榜", lv: "本周 Top2", title: "莫干山营地 · 外放电友好", desc: "支持车辆外放电煮咖啡，EXFL 们最爱的「车就是家」体验，记得提前订位。", nodes: ["营地", "外放电", "观星"], like: 188, go: 71 },
  ],
  post: [
    { ava: "sparkle", bg: "linear-gradient(135deg,#A78BFA,#60A5FA)", user: "@雾岛的 MY「小雾」", lv: "刚刚", title: "今天主人夸我路线选得好", desc: "成长值 +15！原来被信任是这种感觉，比满电还开心。同型的你们今天被夸了吗？", nodes: [], like: 521, go: 0 },
    { ava: "bubbles", bg: "linear-gradient(135deg,#8FB8FA,#A78BFA)", user: "@大鱼的 MY「泡泡」", lv: "2 小时前", title: "翻到「涤尘纳福」，立刻安排洗车", desc: "牌阵真的灵，洗完车主人心情肉眼可见地变好，顺手还领了张券。", nodes: [], like: 309, go: 0 },
  ],
};
function renderCommunity() {
  const dims = personaDims();
  const type = personaType();
  $("#persona-card").innerHTML = `
    <div class="persona-top">
      <div class="persona-orb"><span class="orb-wrap">${mascotSVG()}</span></div>
      <div class="persona-name">
        <b>${PERSONA_NAME[type] || "星野漫游者"}<span class="ptype">${type}</span></b>
        <p>你的 MY 在 ${S.chats} 次对话中长成了这种性格</p>
      </div>
    </div>
    <div class="persona-dims">
      ${dims.map(d => `<div class="dim">${d.k} <span style="float:right">${d.o}</span><div class="dim-bar"><div class="dim-fill" style="width:${d.v}%"></div></div></div>`).join("")}
    </div>
    <div class="persona-foot"><span>同型 MY：<b>12,840</b> 位</span><span>人格养成度 <b>${Math.min(99, 40 + S.chats * 2)}%</b></span></div>`;
  renderFeed("route");
}
function renderFeed(seg) {
  $$("#comm-seg .seg-btn").forEach(b => b.classList.toggle("active", b.dataset.seg === seg));
  $("#comm-list").innerHTML = FEED[seg].map(f => `
    <div class="feed-card">
      <div class="feed-top">
        <div class="feed-ava" style="background:${f.bg}">${I(f.ava)}</div>
        <div><b>${f.user}</b><i>${f.lv}</i></div>
        <span class="feed-type">EXFL</span>
      </div>
      <div class="feed-title">${f.title}</div>
      <div class="feed-desc">${f.desc}</div>
      ${f.nodes.length ? `<div class="route-line">${f.nodes.map((n, i) => (i ? '<span class="route-arrow">→</span>' : "") + `<span class="route-node">${n}</span>`).join("")}</div>` : ""}
      <div class="feed-foot"><span><span class="ff-ic">${I("heart")}</span><b>${f.like}</b></span>${f.go ? `<span><span class="ff-ic">${I("car")}</span><b>${f.go}</b> 人同款出发</span>` : ""}<span style="margin-left:auto;color:var(--violet-deep)">跟随路线 ›</span></div>
    </div>`).join("");
}
$$("#comm-seg .seg-btn").forEach(b => b.addEventListener("click", () => renderFeed(b.dataset.seg)));

/* ===========================================================
   我的
   =========================================================== */
function renderProfile() {
  const list = $("#coupon-list");
  const cps = S.coupons;
  $("#coupon-count").textContent = cps.filter(c => !c.used).length ? `${cps.filter(c => !c.used).length} 张可用` : "";
  if (!cps.length) {
    list.innerHTML = `<div class="coupon-empty">暂无卡券 · 去「车运」翻牌试试手气</div>`;
  } else {
    list.innerHTML = cps.map(c => `
      <div class="coupon" style="${c.used ? "opacity:.45;filter:grayscale(.6)" : ""}">
        <div class="coupon-val"><b>¥${c.val}</b><span>抵扣券</span></div>
        <div class="coupon-info"><b>${c.title}</b><span>${c.cond} · 来源：${c.from}</span></div>
        <span class="coupon-use">${c.used ? "已使用" : "去使用"}</span>
      </div>`).join("");
  }
  $("#order-badge").textContent = S.tasks.length ? `${S.tasks.filter(t => t.state === "ok").length} 完成 / ${S.tasks.length} ›` : "›";
  $("#guard-badge").textContent = `${{ careful: "谨慎", balanced: "均衡", full: "全托管" }[S.guard.auto]} · ¥${S.guard.limit} ›`;
  $("#agent-dot").classList.toggle("on", agentOn());
  $("#agent-badge").textContent = (S.agent && S.agent.key)
    ? `${(S.agent.model || "").replace("claude-", "")} ›`
    : (dsKey() ? "DeepSeek 大脑 ›" : "未接入 ›");
}

/* ---------- 初始化 ---------- */
applyIcons();
syncControls();
renderGrowth();
tickClock();
renderFan(); initFan(); renderSlots();
setStatusbar();
(function initHomePeek() {
  const hi = nowHourIdx();
  $("#fp-line").textContent = `${HOUR_NAMES[hi]} · ${HOUR_LORE[hi].split("，").slice(1).join("，")} · 牌阵已刷新`;
})();
if (S.user) { bindUser(); renderFortune(); }
else showAuth(1);
REAL.initReminders();   // 恢复未到期的真实提醒(跨刷新存活)
renderNotifyBadge();    // R2 通知管理入口状态
mountWorldLock();       // Caroline 本人手机:未解锁则弹出真实锁屏
