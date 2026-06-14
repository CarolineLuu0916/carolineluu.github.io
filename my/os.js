/* ===========================================================
   OS 层：iPhone 桌面 / 应用管理 / 通知 / 通话 / 模拟生活APP
   依赖 app.js 全局（$ / $$ / I() / bunnyHeadSVG() / S / save()）
   =========================================================== */
"use strict";

/* ---------- 模拟生活数据（MY 助理的"学习素材"） ---------- */
const LIFE = {
  weatherLine: "今天晴 26° · 明天中雨 22° · 周四起连晴 25°",
  schedule: {
    pickup: { time: "15:30", from: "公司", to: "小桃幼儿园", count: 21 },
    free: "周四 14:00-16:30 日历空闲",
  },
  wechat: {
    chats: [
      { id: "kevin",  name: "Kevin",        color: "linear-gradient(135deg,#5B8DEF,#3E6ED8)", ch: "K",  unread: 0, time: "15:02",
        msgs: [
          { who: "them", text: "今晚想吃什么？我下班带回来" },
          { who: "me",   text: "随便～你定,别忘了小桃的酸奶" },
          { who: "them", text: "收到收到 🫡" },
        ] },
      { id: "teacher", name: "王老师·小桃班", color: "linear-gradient(135deg,#F2A93B,#E8842C)", ch: "王", unread: 0, time: "12:40",
        msgs: [
          { who: "them", text: "小桃今天午饭吃得很好,午睡也乖乖的~" },
          { who: "me",   text: "谢谢王老师!辛苦啦 🌷" },
        ] },
      { id: "mama",   name: "婆婆",          color: "linear-gradient(135deg,#E07A9B,#C95B80)", ch: "婆", unread: 2, time: "11:18",
        msgs: [
          { who: "them", text: "周末来家里吃饭呀,我做了酱鸭" },
          { who: "them", text: "把小桃也带来,我给她织了小毛衣" },
        ] },
      { id: "group",  name: "小桃班家长群(32)", color: "linear-gradient(135deg,#67C23A,#4DA52E)", ch: "群", unread: 5, time: "10:55",
        msgs: [ { who: "them", text: "【班级通知】本周五春游,请给孩子准备水壶和小零食~" } ] },
      { id: "shansong", name: "闪送小哥",     color: "linear-gradient(135deg,#9AA0B5,#7C8298)", ch: "闪", unread: 0, time: "昨天",
        msgs: [ { who: "them", text: "您的文件已送达前台,请注意查收" } ] },
    ],
  },
  alipay: {
    balance: "12,468.20",
    bills: [
      { name: "悦洗·精致洗车(古翠路店)", time: "上周四 14:32", amt: "-38.00", note: "洗车 · 月均 2 次" },
      { name: "特来电充电桩(前滩快充站)", time: "周一 12:18",  amt: "-46.80", note: "充电 · 常用" },
      { name: "瑞幸咖啡(陆家嘴店)",      time: "周一 14:05",  amt: "-19.90", note: "下午茶 · 每周 3-4 次" },
      { name: "盒马鲜生",               time: "周日 18:22",  amt: "-156.40", note: "" },
      { name: "工资入账",               time: "6月10日",     amt: "+28,500.00", in: true, note: "" },
      { name: "小桃幼儿园·伙食费",       time: "6月5日",      amt: "-680.00", note: "每月固定" },
    ],
  },
  dianping: {
    order: null,
    shops: [
      { name: "泡泡星球洗车·旗舰店", isNew: true, rating: 4.9, reviews: 87,  dist: "距公司 1.1km", price: 19, oldPrice: 38, desc: "精洗双人组 · 内饰除尘 · 开业5折", color: "linear-gradient(135deg,#7C6CF0,#60A5FA)", ic: "bubbles" },
      { name: "悦洗·精致洗车(古翠路店)", fav: true, rating: 4.9, reviews: 1204, dist: "距公司 1.2km", price: 38, desc: "精洗 · 你去过 6 次", color: "linear-gradient(135deg,#5BC2E7,#3E9ED8)", ic: "droplet" },
      { name: "湖畔咖啡·CAFE LAKESIDE", rating: 4.8, reviews: 932, dist: "3.4km", price: 22, desc: "充电车位 · 看湖发呆绝佳", color: "linear-gradient(135deg,#C49A6C,#A87844)", ic: "coffee" },
      { name: "苍蝇馆子·本帮菜",        rating: 4.7, reviews: 2310, dist: "800m", price: 78, desc: "红烧肉一绝 · 你收藏过", color: "linear-gradient(135deg,#E58A4E,#C9662B)", ic: "heart" },
    ],
  },
  amap: {
    places: [
      { name: "家 · 仁恒滨江园",      sub: "常用地点 · 每天",            ic: "user",   color: "linear-gradient(135deg,#00B578,#00935F)", eta: "通勤 28min" },
      { name: "公司 · 前滩中心 T2",   sub: "工作日 08:50 前到达",        ic: "doc",    color: "linear-gradient(135deg,#1677FF,#0D5BD8)", eta: "车位 B2-077" },
      { name: "小桃幼儿园",           sub: "工作日 15:30 出发 · 近30天 21 次", ic: "heart", color: "linear-gradient(135deg,#F2A93B,#E8842C)", eta: "15:55 到园" },
      { name: "前滩快充站",           sub: "常用充电 · 低谷 ¥0.68/度",   ic: "bolt",   color: "linear-gradient(135deg,#7C6CF0,#60A5FA)", eta: "380m" },
    ],
  },
  meituan: {
    orders: [
      { name: "瑞幸咖啡 · 生椰拿铁×2", sub: "周一 14:02 · 送至前滩中心 T2", amt: "¥25.8", color: "linear-gradient(135deg,#2D6CDF,#1A4FB8)", ic: "coffee" },
      { name: "鲜丰水果 · 小桃爱吃的草莓", sub: "周日 16:40 · 送至家",      amt: "¥39.9", color: "linear-gradient(135deg,#E0567B,#C23B61)", ic: "heart" },
      { name: "永和大王 · 周末早餐",     sub: "周六 08:15 · 送至家",        amt: "¥32.0", color: "linear-gradient(135deg,#F2A93B,#D98C1F)", ic: "sun" },
    ],
  },
  taobao: {
    items: [
      { name: "儿童安全座椅防磨垫 通用款", price: "¥59", sold: "已买 · 周二发货", color: "linear-gradient(135deg,#5B8DEF,#3E6ED8)", ic: "heart" },
      { name: "车载香氛 · 白茶味补充装", price: "¥39", sold: "已买 2 次",       color: "linear-gradient(135deg,#A78BFA,#7C6CF0)", ic: "leaf" },
      { name: "小桃的纱裙 · 110cm 黄色", price: "¥89", sold: "运输中 · 明日达", color: "linear-gradient(135deg,#F2A93B,#E8842C)", ic: "sparkle" },
      { name: "手持洗车水枪 高压便携",   price: "¥129", sold: "浏览过 3 次",     color: "linear-gradient(135deg,#00B578,#00935F)", ic: "bubbles" },
    ],
  },
};

/* ---------- OS 内核 ---------- */
const OS = {
  current: null,          // 当前打开的 app id（null=桌面）
  badges: {},

  openApp(id) {
    const frame = $("#app-" + id);
    if (!frame) { OS.toastOS("演示版 · 此应用未模拟"); return; }
    $$(".app-frame").forEach(f => f.classList.remove("open"));
    frame.classList.add("open");
    OS.current = id;
    $("#home-pill").classList.remove("hidden");
    if (id !== "my" && MAPP_RENDER[id]) MAPP_RENDER[id]();
    if (id === "wechat") { OS.badges.wechat = 0; renderSpringboard(); }
    OS.updateStatus();
  },
  goHome() {
    $$(".app-frame").forEach(f => f.classList.remove("open"));
    OS.current = null;
    $("#home-pill").classList.add("hidden");
    OS.updateStatus();
  },
  updateStatus() {
    const sb = $("#statusbar");
    if (OS.current === "my") { if (typeof setStatusbar === "function") setStatusbar(); return; }
    const liteApps = [null, "alipay"];   // 深色/彩色顶部
    sb.classList.toggle("lite", liteApps.includes(OS.current));
  },
  badge(id, n) {
    OS.badges[id] = n;
    renderSpringboard();
  },

  /* iOS 通知横幅
     R2 通知治理:勿扰时段+类型开关(S 来自 app.js,同页共享);
     opts.urgent=警告级始终打断;opts.ntype=remind|guard|life;被拦截的进 S.notify.queue 汇总栏 */
  _notifQ: [], _notifBusy: false,
  _inDnd(from, to) {
    const d = new Date(), cur = d.getHours() * 60 + d.getMinutes();
    const p = s => { const [h, m] = String(s || "").split(":").map(Number); return (h || 0) * 60 + (m || 0); };
    const a = p(from || "22:00"), b = p(to || "08:00");
    return a <= b ? (cur >= a && cur < b) : (cur >= a || cur < b);
  },
  notify(opts) {
    try {
      const np = (typeof S !== "undefined" && S.notify) || null;
      if (np && !opts.urgent) {
        const type = opts.ntype || "guard";
        const blocked = (np.dnd && OS._inDnd(np.from, np.to)) || np.types[type] === false;
        if (blocked) {
          np.queue.push({ app: opts.app || "MY", text: String(opts.text || "").replace(/<[^>]+>/g, "").slice(0, 64), at: Date.now() });
          if (np.queue.length > 30) np.queue.shift();
          if (typeof save === "function") save();
          if (typeof renderNotifyBadge === "function") renderNotifyBadge();
          return;   // 静默收进汇总栏,不弹横幅
        }
      }
    } catch (e) {}
    OS._notifQ.push(opts); if (!OS._notifBusy) OS._nextNotif();
  },
  _nextNotif() {
    const o = OS._notifQ.shift();
    if (!o) { OS._notifBusy = false; return; }
    OS._notifBusy = true;
    const n = $("#notif");
    n.innerHTML = `
      <span class="notif-ic" style="background:${o.color || "linear-gradient(135deg,#A78BFA,#60A5FA)"}">${o.icon || ""}</span>
      <span class="notif-tx"><b>${o.app}<i>现在</i></b><p>${o.text}</p></span>`;
    n.classList.remove("hidden");
    const close = () => { n.classList.add("hidden"); setTimeout(() => OS._nextNotif(), 450); };
    n.onclick = () => { close(); o.onTap && o.onTap(); };
    clearTimeout(n._tm); n._tm = setTimeout(close, o.stay || 5200);
  },

  /* 模拟来电 / 去电 */
  call(opts) {
    const ov = $("#call-overlay");
    let ended = false, t0 = null, timer = null, lineTimers = [];
    ov.innerHTML = `
      <div class="call-ava">${opts.avatar || "代"}</div>
      <div class="call-name">${opts.name}</div>
      <div class="call-status" id="call-status">正在接通…</div>
      <div class="call-lines" id="call-lines"></div>
      <button class="call-end" id="call-end">${I("tel")}</button>
      <div class="call-tag">MY 代拨 · AI VOICE AGENT</div>`;
    ov.classList.remove("hidden");
    $("#home-pill").classList.add("hidden");
    $("#statusbar").classList.add("lite");
    const finish = () => {
      if (ended) return; ended = true;
      clearInterval(timer); lineTimers.forEach(clearTimeout);
      $("#call-status").textContent = "通话结束";
      setTimeout(() => {
        ov.classList.add("hidden");
        if (OS.current) $("#home-pill").classList.remove("hidden");
        OS.updateStatus();
        opts.onDone && opts.onDone();
      }, 650);
    };
    $("#call-end").onclick = finish;
    setTimeout(() => {
      if (ended) return;
      t0 = Date.now();
      timer = setInterval(() => {
        const s = Math.floor((Date.now() - t0) / 1000);
        const el = $("#call-status");
        if (el) el.textContent = `通话中 ${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
      }, 1000);
      (opts.lines || []).forEach((ln, i) => {
        lineTimers.push(setTimeout(() => {
          if (ended) return;
          const box = $("#call-lines");
          box.insertAdjacentHTML("beforeend", `
            <div class="call-line ${ln[0] === "my" ? "my" : ""}">
              <b>${ln[0] === "my" ? "MY（代表 Caroline）" : opts.name}</b><p>${ln[1]}</p>
            </div>`);
          box.scrollTop = box.scrollHeight;
        }, 1500 + i * 1900));
      });
      lineTimers.push(setTimeout(finish, 1500 + (opts.lines || []).length * 1900 + 1200));
    }, 1300);
  },

  /* 跨 APP 能力：供 MY 调度 */
  wechatSend(chatId, who, text, byMY) {
    const chat = LIFE.wechat.chats.find(c => c.id === chatId);
    if (!chat) return;
    chat.msgs.push({ who, text, byMY });
    chat.time = "刚刚";
    if (who === "them") {
      chat.unread = (chat.unread || 0) + 1;
      OS.badges.wechat = (OS.badges.wechat || 0) + 1;
    }
    renderSpringboard();
    if (OS.current === "wechat") MAPP_RENDER.wechat(wxView);
  },
  alipayPay(name, amt, note) {
    LIFE.alipay.bills.unshift({ name, time: "刚刚", amt: `-${amt}`, note: note || "", byMY: true, fresh: true });
    OS.notify({
      app: "支付宝", color: "linear-gradient(135deg,#1677FF,#54A0FF)", icon: I("check"),
      text: `付款成功 ¥${amt} · ${name}（MY 免密代付）`, ntype: "life",
    });
    if (OS.current === "alipay") MAPP_RENDER.alipay();
  },
  dianpingOrder(text) {
    LIFE.dianping.order = text;
    OS.notify({
      app: "大众点评", color: "linear-gradient(135deg,#FF6633,#FF8348)", icon: I("check"),
      text: "预约成功 · " + text.replace(/<[^>]+>/g, "").slice(0, 34) + "…", ntype: "life",
    });
    if (OS.current === "dianping") MAPP_RENDER.dianping();
  },
  toastOS(msg) {
    let t = $("#os-toast");
    if (!t) {
      t = document.createElement("div");
      t.id = "os-toast"; t.className = "toast hidden"; t.style.zIndex = 155;
      $(".phone").appendChild(t);
    }
    t.textContent = msg; t.classList.remove("hidden");
    clearTimeout(t._tm); t._tm = setTimeout(() => t.classList.add("hidden"), 2200);
  },
};
window.OS = OS;

/* ---------- 桌面 ---------- */
const TILE = {
  my:       { name: "MY",      color: "linear-gradient(135deg,#A78BFA,#60A5FA)", glyph: () => bunnyHeadSVG() },
  wechat:   { name: "微信",     color: "linear-gradient(135deg,#3ECC5F,#28A745)", glyph: () => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M9.5 4.5c-3.6 0-6.5 2.3-6.5 5.2 0 1.7 1 3.1 2.5 4.1l-.7 2.2 2.5-1.3c.7.2 1.4.3 2.2.3"/><path d="M10 13.7c0-2.6 2.5-4.7 5.5-4.7s5.5 2.1 5.5 4.7-2.5 4.7-5.5 4.7c-.7 0-1.3-.1-1.9-.3L11.5 19l.6-1.9c-1.3-.8-2.1-2-2.1-3.4z"/></svg>` },
  alipay:   { name: "支付宝",   color: "linear-gradient(135deg,#1677FF,#3D8BFF)", glyph: () => `<span class="tile-char">支</span>` },
  dianping: { name: "大众点评", color: "linear-gradient(135deg,#FF6633,#FF8F4D)", glyph: () => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3.5l2.5 5.3 5.8.7-4.3 4 1.1 5.7-5.1-2.8-5.1 2.8 1.1-5.7-4.3-4 5.8-.7z"/></svg>` },
  amap:     { name: "高德地图", color: "linear-gradient(135deg,#00B8FF,#0D5BD8)", glyph: () => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M20.5 3.5 10 13.9M20.5 3.5 14 20.5l-3.4-6.1L4.5 11z"/></svg>` },
  meituan:  { name: "美团外卖", color: "linear-gradient(135deg,#FFD100,#FFB800)", glyph: () => `<span class="tile-char" style="color:#222">美</span>` },
  taobao:   { name: "淘宝",     color: "linear-gradient(135deg,#FF5000,#FF7A2E)", glyph: () => `<span class="tile-char">淘</span>` },
  phone:    { name: "电话",     color: "linear-gradient(135deg,#43D673,#2BB956)", glyph: () => I("tel") },
  messages: { name: "信息",     color: "linear-gradient(135deg,#43D673,#2BB956)", glyph: () => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M12 4c-4.7 0-8.5 3-8.5 6.8 0 2.2 1.3 4.1 3.3 5.4-.1.9-.5 2-1.4 2.8 1.6-.2 2.9-.8 3.8-1.4.9.2 1.8.4 2.8.4 4.7 0 8.5-3 8.5-6.9S16.7 4 12 4z"/></svg>` },
  safari:   { name: "Safari",   color: "linear-gradient(135deg,#54A8FF,#1677FF)", glyph: () => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="8.5"/><path d="M15.5 8.5l-2 5-5 2 2-5z"/></svg>` },
  camera:   { name: "相机",     color: "linear-gradient(135deg,#8E97AD,#5F6880)", glyph: () => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><rect x="3.5" y="7" width="17" height="12" rx="2.5"/><path d="M8.5 7l1.2-2.2h4.6L15.5 7"/><circle cx="12" cy="13" r="3.4"/></svg>` },
  photos:   { name: "照片",     color: "linear-gradient(135deg,#FFFFFF,#EDEFF6)", glyph: () => `<svg viewBox="0 0 24 24" fill="none" stroke-width="1.6"><g stroke="#F2A93B"><circle cx="12" cy="7" r="3"/></g><g stroke="#E0567B"><circle cx="16.3" cy="9.5" r="3"/></g><g stroke="#A78BFA"><circle cx="16.3" cy="14.5" r="3"/></g><g stroke="#1677FF"><circle cx="12" cy="17" r="3"/></g><g stroke="#00B578"><circle cx="7.7" cy="14.5" r="3"/></g><g stroke="#43D673"><circle cx="7.7" cy="9.5" r="3"/></g></svg>` },
  settings: { name: "设置",     color: "linear-gradient(135deg,#9BA3B8,#6E7790)", glyph: () => I("gear") },
  clock:    { name: "时钟",     color: "linear-gradient(135deg,#1C2033,#0B0E1F)", glyph: () => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"><circle cx="12" cy="12" r="8.5"/><path d="M12 6.5V12l3.5 2.5"/></svg>` },
  calendar: { name: "日历",     color: "linear-gradient(135deg,#FFFFFF,#EDEFF6)", glyph: () => `<span class="tile-char" style="color:#E0567B;font-size:22px">11</span>` },
  jianying: { name: "剪映",     color: "linear-gradient(135deg,#16181F,#000)",    glyph: () => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"><path d="M5 17.5 18.5 5M5 6.5 18.5 19"/><circle cx="5.5" cy="17.5" r="2.3"/><circle cx="5.5" cy="6.5" r="2.3"/></svg>`, bdg: "536" },
  baidu:    { name: "百度",     color: "linear-gradient(135deg,#2932E1,#5A8DEE)", glyph: () => `<span class="tile-char" style="font-size:22px">du</span>`, bdg: "9" },
};
TILE.messages.bdg = "3,144";

/* 文件夹（仿真装饰：3×3 迷你图标 + 红角标 + emoji 名） */
const FOLDER_MINI = [
  "linear-gradient(135deg,#FF6B6B,#D63031)", "linear-gradient(135deg,#1677FF,#54A0FF)",
  "linear-gradient(135deg,#3ECC5F,#1B9E45)", "linear-gradient(135deg,#FFD100,#F2A93B)",
  "linear-gradient(135deg,#A78BFA,#7C5CE0)", "linear-gradient(135deg,#FF5000,#FF8348)",
  "linear-gradient(135deg,#10B5C4,#0A8493)", "linear-gradient(135deg,#EC4899,#BE3470)",
  "linear-gradient(135deg,#FFFFFF,#D9DEE9)", "linear-gradient(135deg,#16181F,#3A3F4F)",
  "linear-gradient(135deg,#00B578,#00875A)", "linear-gradient(135deg,#5A8DEE,#2932E1)",
];
const SB_FOLDERS = [
  { emoji: "💪", badge: "8",     n: 6, s: 0 },
  { emoji: "🧚", badge: "359",   n: 9, s: 3 },
  { emoji: "🛍️", badge: "1,472", n: 9, s: 5 },
  { emoji: "🐣", badge: "2",     n: 7, s: 1 },
  { emoji: "🛵", badge: "33",    n: 6, s: 7 },
  { emoji: "🗓️", badge: "500",   n: 9, s: 2 },
  { emoji: "🌞", badge: "192",   n: 8, s: 9 },
  { emoji: "🤡", badge: "25",    n: 5, s: 4 },
];
const GRID_APPS = ["wechat", "alipay", "dianping", "amap", "meituan", "taobao", "jianying", "baidu"];
const DOCK_APPS = ["phone", "messages", "my", "safari"];
const REAL_APPS = ["my", "wechat", "alipay", "dianping", "amap", "meituan", "taobao"];

function appBtn(id) {
  const t = TILE[id];
  const n = OS.badges[id] ?? t.bdg;
  const badge = n ? `<span class="sb-badge">${n}</span>` : "";
  return `
    <button class="sb-app" data-app="${id}">
      <span class="sb-tile" style="background:${t.color}">${t.glyph()}${badge}</span>
      <span class="sb-label">${t.name}</span>
    </button>`;
}
function folderBtn(f) {
  const minis = Array.from({ length: f.n }, (_, i) =>
    `<i style="background:${FOLDER_MINI[(f.s + i) % FOLDER_MINI.length]}"></i>`).join("");
  return `
    <button class="sb-app sb-folder-app">
      <span class="sb-folder">${minis}<span class="sb-badge">${f.badge}</span></span>
      <span class="sb-label">${f.emoji}</span>
    </button>`;
}
function renderSpringboard() {
  $("#sb-grid").innerHTML = SB_FOLDERS.map(folderBtn).join("") + GRID_APPS.map(appBtn).join("");
  $("#sb-dock").innerHTML = DOCK_APPS.map(appBtn).join("");
  $$("#springboard .sb-app[data-app]").forEach(b => b.onclick = () => {
    const id = b.dataset.app;
    REAL_APPS.includes(id) ? OS.openApp(id) : OS.toastOS("演示版 · 此应用未模拟");
  });
  $$("#springboard .sb-folder-app").forEach(b => b.onclick = () => OS.toastOS("演示版 · 文件夹未模拟"));
}

/* 桌面时钟小组件 */
function tickWidget() {
  const d = new Date();
  $("#sbw-time").textContent = `${d.getHours()}:${String(d.getMinutes()).padStart(2, "0")}`;
  $("#sbw-date").textContent = `${d.getMonth() + 1}月${d.getDate()}日 ${"周日周一周二周三周四周五周六".substr(d.getDay() * 2, 2)}`;
}
setInterval(tickWidget, 20_000);

/* ---------- 模拟 APP 渲染 ---------- */
let wxView = null;   // null=列表, chatId=会话

function maHead(cls, title, extra = "") {
  return `<div class="ma-head ${cls}"><button class="ma-back" data-home>‹</button><h1>${title}</h1>${extra}</div>`;
}

const MAPP_RENDER = {
  /* ----- 微信 ----- */
  wechat(view = null) {
    wxView = view;
    const f = $("#app-wechat");
    if (!wxView) {
      f.innerHTML = `<div class="ma">
        ${maHead("wx-head", `微信(${(OS.badges.wechat || 0) > 0 ? OS.badges.wechat : "3"})`)}
        <div class="ma-body" style="padding-bottom:60px">
          ${LIFE.wechat.chats.map(c => `
            <div class="wx-row" data-chat="${c.id}">
              <span class="wx-ava" style="background:${c.color}">${c.ch}${c.unread ? `<span class="sb-badge">${c.unread}</span>` : ""}</span>
              <span class="wx-meta"><b>${c.name}</b><p>${(c.msgs[c.msgs.length - 1] || {}).text || ""}</p></span>
              <span class="wx-time">${c.time}</span>
            </div>`).join("")}
        </div>
      </div>`;
    } else {
      const c = LIFE.wechat.chats.find(x => x.id === wxView);
      c.unread = 0;
      f.innerHTML = `<div class="ma wx-chat">
        ${maHead("wx-head", c.name, `<button class="ma-back" style="left:auto;right:12px" data-wxback>☰</button>`)}
        <div class="wx-chat-body" id="wx-chat-body">
          <div class="wx-sys"><i>15:50</i></div>
          ${c.msgs.map(m => `
            <div class="wx-msg ${m.who === "me" ? "me" : ""}">
              <span class="wx-ava" style="background:${m.who === "me" ? "linear-gradient(135deg,#A78BFA,#60A5FA)" : c.color}">${m.who === "me" ? "C" : c.ch}</span>
              <span class="wx-bubble">${m.text}${m.byMY ? `<span class="wx-by-my">✦ 由车灵 MY 代发</span>` : ""}</span>
            </div>`).join("")}
        </div>
        <div class="wx-input"><i>🎤</i><span>发消息…</span><i>😊</i><i>＋</i></div>
      </div>`;
      const body = $("#wx-chat-body"); body.scrollTop = body.scrollHeight;
      f.querySelector("[data-wxback]").onclick = e => { e.stopPropagation(); MAPP_RENDER.wechat(null); };
    }
    f.querySelectorAll(".wx-row").forEach(r => r.onclick = () => MAPP_RENDER.wechat(r.dataset.chat));
    f.querySelector("[data-home]").onclick = () => (wxView ? MAPP_RENDER.wechat(null) : OS.goHome());
  },

  /* ----- 支付宝 ----- */
  alipay() {
    const srv = [
      ["扫一扫", "linear-gradient(135deg,#1677FF,#54A0FF)", "camera"],
      ["付钱码", "linear-gradient(135deg,#00B578,#00935F)", "doc"],
      ["出行",   "linear-gradient(135deg,#7C6CF0,#A78BFA)", "car"],
      ["卡包",   "linear-gradient(135deg,#F2A93B,#E8842C)", "gift"],
    ];
    $("#app-alipay").innerHTML = `<div class="ma">
      ${maHead("alipay-head", "支付宝", `<div class="ma-search">🔍 搜索「洗车优惠」的人也在搜…</div>`)}
      <div class="ma-body">
        <div class="ap-balance"><span>账户余额 (元)</span><b>${LIFE.alipay.balance}</b></div>
        <div class="ap-srv">${srv.map(s => `<button><span class="ic-bub" style="background:${s[1]}">${I(TILE_IC(s[2]))}</span>${s[0]}</button>`).join("")}</div>
        <div class="ma-sec">账单 <span>本月支出 ¥3,482.10</span></div>
        ${LIFE.alipay.bills.map(b => `
          <div class="ap-bill ${b.fresh ? "fresh" : ""}">
            <span class="ap-bill-l"><b>${b.name}${b.byMY ? `<i class="ap-tag-my">MY 代付</i>` : ""}</b><span>${b.time}${b.note ? " · " + b.note : ""}</span></span>
            <span class="ap-bill-amt ${b.in ? "in" : ""}">${b.amt}</span>
          </div>`).join("")}
      </div>
    </div>`;
    bindHome("#app-alipay");
  },

  /* ----- 大众点评（首页 / 地图 / 消息 / 我的 四 tab） ----- */
  dianping(tab = "home") {
    const tabBar = `
      <div class="dp-tabs">
        <button class="dp-tab ${tab === "home" ? "on" : ""}" data-dptab="home">首页</button>
        <button class="dp-tab ${tab === "map" ? "on" : ""}" data-dptab="map">地图</button>
        <button class="dp-plus" data-dptab="plus">＋</button>
        <button class="dp-tab ${tab === "msg" ? "on" : ""}" data-dptab="msg"><span class="dp-tab-wrap">消息<span class="sb-badge">37</span></span></button>
        <button class="dp-tab ${tab === "mine" ? "on" : ""}" data-dptab="mine">我的</button>
      </div>`;

    let body = "";
    if (tab === "home") {
      const pop = LIFE.dianping.shops[0]; // 泡泡星球（剧情店）
      body = `
      <div class="dp-page home">
        <div class="dp-nav">
          <span class="dot">关注</span><span class="on">上海 ▾</span><span>附近</span><span>品质外卖</span><span>热点</span><span>周末去哪</span>
        </div>
        <div class="dp-searchrow">
          <span class="dp-coin">🪙<i>得金币</i></span>
          <div class="dp-searchbar"><i class="sc">⛶</i><b>homes上海本帮菜</b><i>📷</i><button>搜索</button></div>
        </div>
        <div class="dp-cats">
          <span><i>🍗</i>美食</span><span><i>🍹</i>休闲玩乐</span><span><i>🏨</i>酒店民宿</span><span><i>🌴</i>景点游玩</span><span><i class="tag" data-tag="周深">🐱</i>电影演出</span>
          <span><i>💆</i>医美</span><span><i>🔥</i>特价团</span><span><i>🛍️</i>商场购物</span><span><i>🎤</i>KTV</span><span><i>🧖</i>按摩足疗</span>
        </div>
        <div class="sb-dots dk"><i class="on"></i><i></i></div>
        <div class="dp-promos">
          <div class="dp-promo"><b>点评榜单<em>吃喝玩乐指南 ›</em></b><div class="dp-promo-bd"><i class="dp-ppic" style="background:#fff;color:#D32F2F;border:1.5px solid #EEE">寿司郎</i><span><b>寿司郎</b><p><em>热门榜第1名</em> 3.0km</p></span></div></div>
          <div class="dp-promo"><b>免费试<em>月中奖152万人 ›</em></b><div class="dp-promo-bd"><i class="dp-ppic" style="background:linear-gradient(160deg,#3A3A40,#1E1E24);color:#fff">旧村</i><span><b>旧村·砂锅焗海鲜双</b><p><em class="big">¥0</em><del>¥227</del> 8.8km</p></span></div></div>
        </div>
        ${LIFE.dianping.order ? `<div class="dp-order"><b>我的订单</b> · ${LIFE.dianping.order}</div>` : ""}
        <div class="dp-feed">
          <div class="dp-card">
            <div class="dp-cpic" style="background:linear-gradient(170deg,#F2EDD8,#D8CDA8)">🍋</div>
            <b>确实是上海最好喝的！！！😭😭</b>
            <p><span class="dp-author">🧑‍🌾 多加香菜好了</span><em>♡ 85</em></p>
          </div>
          <div class="dp-card">
            <div class="dp-cpic" style="background:linear-gradient(170deg,#F2D8A8,#D8B070)">👜<span class="dp-cpic-tag">New 新品</span></div>
            <b>山姆新爆品来了…</b>
            <p><span class="dp-author">👩 橘橘子酱 <i class="lv">Lv8</i></span><em>♡ 37</em></p>
          </div>
          <div class="dp-card">
            <div class="dp-cpic" style="background:${pop.color}">${I(pop.ic)}<span class="dp-cpic-tag hot">新店开业 · 5折</span></div>
            <b>${pop.name} 开业了！精洗只要¥${pop.price}</b>
            <p><span class="dp-author">⭐ ${pop.rating} · ${pop.reviews}条</span><em>${pop.dist}</em></p>
          </div>
          <div class="dp-card">
            <div class="dp-cpic" style="background:linear-gradient(170deg,#E8B8B0,#C9837A)">🥩</div>
            <b>这家本帮菜的红烧肉一绝，你收藏过</b>
            <p><span class="dp-author">🍚 苍蝇馆子</span><em>♡ 231</em></p>
          </div>
        </div>
      </div>
      ${tabBar}`;
    } else if (tab === "map") {
      body = `
      <div class="dp-map">
        <div class="am-park" style="left:2%;top:13%;width:16%;height:9%"></div>
        <div class="am-park" style="left:4%;top:66%;width:22%;height:10%"></div>
        <div class="am-road h" style="top:30%"></div>
        <div class="am-road v" style="left:38%"></div>
        <div class="am-road v thin" style="left:66%"></div>
        <div class="am-road h thin" style="top:55%"></div>
        <span class="am-rdname" style="left:18%;top:28%">巨峰路</span>
        <span class="am-rdname" style="left:2%;top:33%">杨高北路</span>
        <span class="am-rdname v" style="left:39%;top:44%">成园路</span>
        <span class="am-rdname" style="left:70%;top:53%">乐园路</span>
        <span class="am-rdname" style="left:62%;top:72%">佳桥路</span>
        <span class="am-poi grey" style="left:40%;top:16%">华高苑南区</span>
        <span class="am-poi grey" style="left:8%;top:14.5%">华宜公园</span>
        <span class="am-poi grey" style="left:52%;top:64%">如家精选酒店</span>
        <span class="am-poi grey" style="left:8%;top:67%">阳光绿地公园</span>
        <span class="am-poi grey" style="left:72%;top:78%">蔷薇绅邻</span>
        <span class="dp-pin" style="left:52%;top:20%"><i style="background:#9C27B0">🎴 4.8分</i><span>X棋牌</span></span>
        <span class="dp-pin" style="left:56%;top:32%"><i style="background:#FF6633">🍲 4.4分</i><span>老李羊羯子涮锅</span></span>
        <span class="dp-pin" style="left:46%;top:44%"><i style="background:#FF6633">🍛 4.2分</i><span>绿茶餐厅</span></span>
        <span class="dp-pin" style="left:44%;top:54%"><i style="background:#9C27B0">🛍 3.7分</i><span>金桥生活广场</span></span>
        <span class="dp-pin" style="left:10%;top:42%"><i style="background:#00875A">🌴 3.6分</i><span>金桥市民体育休闲公园</span></span>
        <span class="am-puck" style="left:42%;top:46%"><i></i></span>
        <div class="dp-map-top">
          <div class="dp-searchbar lite"><i class="sc">🔍</i><b class="ph">搜索地点、美食、景点等</b></div>
          <div class="dp-mchips"><span class="on">🔥 推荐</span><span>🍗 美食</span><span>🍹 玩乐</span><span>🌴 景点</span><span>🛍 购物</span></div>
        </div>
        <div class="dp-mfabs">
          <span>📋<i>必吃榜</i></span><span>☆<i>收藏</i></span><span>⊕</span>
        </div>
        <span class="am-scale" style="left:14px;bottom:36%">200米 ⎺⎺⎺</span>
        <div class="dp-msheet">
          <div class="dp-mshop">
            <i class="dp-mpic" style="background:linear-gradient(160deg,#3E6B4F,#27513A)">绿茶</i>
            <div class="dp-minfo">
              <b>绿茶餐厅 (上海金桥日月光店)</b>
              <p class="stars"><i>★★★★</i>☆ <em>4.2</em> 666条 <span>¥77/人</span></p>
              <p class="sub">浙菜 金桥商圈<span class="dist">110m</span></p>
              <p class="rank">榜 金桥商圈浙菜回头客榜 · 第2名</p>
            </div>
          </div>
          <div class="dp-mshop">
            <i class="dp-mpic" style="background:linear-gradient(160deg,#1E3A5C,#13253C)">渔</i>
            <div class="dp-minfo"><b>靓小渔·象山海鲜 (金桥日月光中心店)</b></div>
          </div>
        </div>
      </div>
      ${tabBar}`;
    } else if (tab === "msg") {
      const rows = [
        ...(LIFE.dianping.order ? [{ ch: "泡", bg: "linear-gradient(135deg,#7C6CF0,#60A5FA)", name: "泡泡星球洗车·旗舰店", sub: "您的预约已确认，洗车师傅恭候光临～", time: "刚刚", n: 1 }] : []),
        { ch: "🚩", bg: "linear-gradient(135deg,#FF9F2E,#FF6633)", name: "活动消息", sub: "你的抽奖资格尚未完成确认，联名款 labubu、1888…", time: "11:25", n: 15 },
        { ch: "🔔", bg: "linear-gradient(135deg,#54A8FF,#1677FF)", name: "系统消息", sub: "您近期对上海【怡泰SPA·泰疗按摩】给出好评【下…", time: "06/07", n: 22 },
        { sec: "2 周前和长期未读消息" },
        { ch: "📋", bg: "linear-gradient(135deg,#54A8FF,#2D7FE0)", name: "服务动态", sub: "排队进度提醒", time: "05/16", n: 1 },
        { ch: "薇", bg: "linear-gradient(135deg,#B06CC9,#7C3F9E)", name: "上海薇琳医疗美容医院", sub: "好的 亲亲", time: "03/18" },
        { ch: "雀", bg: "linear-gradient(135deg,#C9A23B,#8A6A1A)", name: "雀王棋牌 · 台球俱乐部", sub: "感谢您的光临，期待下次再见！", time: "2025/09/04" },
        { ch: "米", bg: "linear-gradient(135deg,#E04545,#B02020)", name: "米客新棋牌 · MIX CLUB", sub: "您好，很高兴选择米客新俱乐部，详情可点击门店联…", time: "2025/09/04", n: 1 },
        { ch: "律", bg: "linear-gradient(135deg,#3E5C8A,#27406B)", name: "上海沪华律师事务所", sub: "诚邀您评价商家的客服服务！", time: "2025/08/12" },
        { ch: "仁", bg: "linear-gradient(135deg,#C0392B,#922B21)", name: "仁华律师团队 · 法律咨询", sub: "好的，那您稍等，我们律师稍后会联系您哦", time: "2025/08/12", n: 1 },
        { ch: "✂️", bg: "linear-gradient(135deg,#888,#555)", name: "阿 Xin 发型设计工作室", sub: "[团购预约创建卡片]", time: "2025/07/26" },
      ];
      body = `
      <div class="dp-page msg">
        <div class="dp-msg-head"><h2>消息 (37) ⌂</h2><span>👤+ 添加好友</span></div>
        <div class="dp-msg-icons">
          <span><i style="background:#FFF0E0">👍</i>赞/收藏/有帮助</span>
          <span><i style="background:#FFE8EC">💬</i>评论和@</span>
          <span><i style="background:#E2F0FF">👥</i>新增粉丝</span>
        </div>
        ${rows.map(r => r.sec
          ? `<div class="dp-msg-sec">${r.sec}</div>`
          : `<div class="dp-msg-row">
              <i class="dp-msg-ava" style="background:${r.bg}">${r.ch}</i>
              <span class="dp-msg-meta"><b>${r.name}</b><p>${r.sub}</p></span>
              <span class="dp-msg-side"><em>${r.time}</em>${r.n ? `<i class="sb-badge${r.n <= 1 ? " gy" : ""}">${r.n}</i>` : ""}</span>
            </div>`).join("")}
      </div>
      ${tabBar}`;
    } else {
      body = `
      <div class="dp-page mine">
        <div class="dp-me-acts"><span>设置背景</span><span>⇪</span><span>☰</span></div>
        <div class="dp-me-top">
          <span class="dp-me-ava">🐥</span>
          <div class="dp-me-meta">
            <b>Caroline_Lu <i>⠿</i></b>
            <p>IP: 上海市 ⓘ</p>
          </div>
          <button class="dp-me-edit">编辑资料</button>
        </div>
        <p class="dp-me-bio">添加简介让大家更好地认识你 ✏️</p>
        <div class="dp-me-chips"><span class="lv">Lv5</span><span class="vip">Ⓥ VIP</span><span>🦞 23枚勋章</span><span class="blk">🐰 黑金会员</span></div>
        <div class="dp-me-stats"><b>165</b> 粉丝 <b>167</b> 关注 <b>27</b> 获赞 ···</div>
        <div class="dp-me-cards">
          <div class="dp-mc"><p>我的足迹</p><div><b>1</b><i>去过国家</i><b>17</b><i>去过城市</i></div></div>
          <div class="dp-mc"><p>打卡 ✅</p><div><b>80</b><i>累计打卡</i></div></div>
          <div class="dp-mc"><p>口味档案</p><div><b>281</b><i>累计用餐</i><b>3</b><i>好友排名</i></div></div>
        </div>
        <div class="dp-me-icons">
          <span><i>📋</i>订单</span><span><i>⭐</i>收藏</span><span><i>💬<b class="sb-badge">62</b></i>待评价</span><span><i>🎟️<b class="dot"></b></i>卡券</span><span><i>👛</i>钱包</span>
        </div>
        <div class="dp-me-tabs"><b class="on">动态</b><b>笔记</b><b>评价</b><span>🖼 相册</span><span>🔍 搜索</span></div>
        <div class="dp-me-eval"><i class="dp-ppic sm" style="background:linear-gradient(160deg,#D32F2F,#9A1A1A);color:#FFD700">M</i><span><b>麦当劳</b><p>2026-05-28 消费</p></span><button>去评价</button><em>✕</em></div>
        <div class="dp-me-feed">
          <div class="dp-card draft"><div class="dp-cpic" style="background:linear-gradient(170deg,#5C3A3A,#3E2727);font-size:14px;color:#fff;flex-direction:column;gap:5px"><b style="font-size:13px">🗳 草稿箱</b>8 条动态待发布 ›</div></div>
          <div class="dp-card"><div class="dp-cpic" style="background:linear-gradient(170deg,#E8C25B,#B8923B)">🏮</div></div>
        </div>
      </div>
      ${tabBar}`;
    }

    $("#app-dianping").innerHTML = `<div class="ma dp2-wrap">${body}</div>`;
    bindHome("#app-dianping");
    $$("#app-dianping [data-dptab]").forEach(b => b.onclick = () => {
      const t = b.dataset.dptab;
      if (t === "plus") return OS.toastOS("演示版 · 此功能未模拟");
      MAPP_RENDER.dianping(t);
    });
  },

  /* ----- 高德地图（首页地图 / 探索 / 我的 三 tab） ----- */
  amap(tab = "home") {
    OS._amapTab = tab;
    const tabBar = `
      <div class="am-tabs">
        <button class="am-tab ${tab === "home" ? "on" : ""}" data-amtab="home"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="4.5" y="4" width="15" height="13" rx="2.5"/><path d="M8 20.5h8M4.5 12h15M8.5 15h.01M15.5 15h.01"/></svg>首页</button>
        <button class="am-tab ${tab === "explore" ? "on" : ""}" data-amtab="explore"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 21s-6.5-5.4-6.5-10A6.5 6.5 0 0 1 12 4.5 6.5 6.5 0 0 1 18.5 11c0 4.6-6.5 10-6.5 10z"/><circle cx="12" cy="11" r="2.3"/></svg>探索</button>
        <button class="am-tab am-tab-ai" data-amtab="ai"><span class="am-ai-orb">AI<span class="sb-badge">32</span></span><span class="am-ai-lb">长按说话</span></button>
        <button class="am-tab" data-amtab="taxi"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M5 13.5 6.7 8a2 2 0 0 1 1.9-1.4h6.8A2 2 0 0 1 17.3 8l1.7 5.5M5 13.5h14M5 13.5v4.7M19 13.5v4.7M7.5 16.2h.01M16.5 16.2h.01"/></svg>打车</button>
        <button class="am-tab ${tab === "mine" ? "on" : ""}" data-amtab="mine"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><circle cx="12" cy="8.2" r="3.4"/><path d="M5 19.5c.8-3.4 3.6-5.2 7-5.2s6.2 1.8 7 5.2"/></svg>我的</button>
      </div>`;

    let body = "";
    if (tab === "home") {
      body = `
      <div class="am-map">
        <div class="am-river"></div>
        <div class="am-park" style="left:2%;top:4%;width:30%;height:13%"></div>
        <div class="am-park" style="left:55%;top:9%;width:24%;height:10%"></div>
        <div class="am-park" style="left:8%;top:54%;width:18%;height:12%"></div>
        <div class="am-park" style="left:66%;top:48%;width:26%;height:11%"></div>
        <div class="am-road v" style="left:24%"></div>
        <div class="am-road v" style="left:58%"></div>
        <div class="am-road v thin" style="left:80%"></div>
        <div class="am-road h thin" style="top:22%"></div>
        <div class="am-road h main" style="top:38%"></div>
        <div class="am-metro" style="top:calc(38% + 3px)"></div>
        <span class="am-metro-pill" style="left:38%;top:35%">12号线</span>
        <span class="am-mst" style="left:12%;top:36.5%">Ⓜ</span><span class="am-rdname" style="left:16%;top:40.5%">杨高北路</span>
        <span class="am-mst" style="left:88%;top:36.5%">Ⓜ</span><span class="am-rdname" style="left:76%;top:40.5%">金京路</span>
        <span class="am-rdname v" style="left:25%;top:55%">杨高北路</span>
        <span class="am-rdname v" style="left:59%;top:60%">金高路</span>
        <span class="am-rdname" style="left:46%;top:20%">巨峰路</span>
        <span class="am-rdname" style="left:40%;top:28%">源华路</span>
        <span class="am-rdname" style="left:30%;top:48%">成园路</span>
        <span class="am-poi grey" style="left:42%;top:10%">🏠 春江花悦园</span>
        <span class="am-poi grey" style="left:8%;top:28%">🏫 华高苑</span>
        <span class="am-poi pink" style="left:50%;top:47.5%">金桥日月光中心</span>
        <span class="am-poi grey" style="left:52%;top:57%">🏨 如家精选金桥金高路店</span>
        <span class="am-poi grey" style="left:62%;top:67%">乐园路</span>
        <span class="am-puck" style="left:44%;top:43%"><i></i></span>
        <span class="amap-pin" style="left:14%;top:60%"><i style="background:#00B578"><em>家</em></i><span>仁恒滨江园</span></span>
        <span class="amap-pin" style="left:72%;top:74%"><i style="background:#F2A93B"><em>园</em></i><span>小桃幼儿园</span></span>
        <button class="ma-back am-exit" data-home>‹</button>
        <div class="am-fab" style="top:56px"><b>＋</b><span>更多</span></div>
        <div class="am-fab" style="top:118px"><b>❏</b><span>图层</span></div>
        <div class="am-fab rd" style="bottom:46%"><b>◎</b></div>
        <div class="am-fab rd" style="bottom:35%"><b>↑</b><span>路线</span></div>
        <span class="am-temp">32°C</span>
        <span class="am-scale">200米 ⎺⎺⎺</span>
      </div>
      <div class="am-sheet">
        <div class="am-chips">
          <span class="am-chip"><b>街</b> 高德扫街榜</span><span class="am-chip">🍜 美食</span>
          <span class="am-chip">景点</span><span class="am-chip">酒店</span><span class="am-chip">商场</span>
        </div>
        <div class="am-search">🔍 <i>查找地点、公交、地铁</i><em>📷</em><em class="ai">🎤AI</em></div>
        <div class="am-svcs">
          <span><i style="background:#3D8BFF">✈️</i>火车票机票</span>
          <span><i style="background:#00B578">顺</i>顺风车</span>
          <span><i style="background:#27C26C">🚲</i>骑行</span>
          <span><i style="background:#1677FF">🛞</i>代驾</span>
          <span><i style="background:#00A37A">🚌</i>实时公交</span>
        </div>
        <div class="am-hw">
          <span>⌂ 设置家</span><span>⎙ 设置单位</span><span>＋ 常去地点</span>
        </div>
        <div class="am-mycard" data-open="my">
          <span class="am-my-ava">${bunnyHeadSVG()}</span>
          <span class="am-my-tx"><b>MY 车灵已接入 <i class="am-live"></i>深度同步中</b>
          <p>通勤规律已学习：工作日 15:30 → 小桃幼儿园（21次/30天）…</p></span>
        </div>
      </div>
      ${tabBar}`;
    } else if (tab === "explore") {
      body = `
      <div class="am-page">
        <div class="am-ex-head">
          <span class="am-city">上海 ▾<i>☀ 33°C</i></span>
          <div class="am-search lite">🔍 <i>在附近搜索</i></div>
        </div>
        <div class="am-ex-cats">
          <span><i style="background:#FFF3E0">🍴</i>美食</span>
          <span><i style="background:#EDE9FE">🏨</i>酒店</span>
          <span><i style="background:#E0F7EC">🏯</i>旅游</span>
          <span><i style="background:#EAF1FF">🅿️</i>停车</span>
          <span><i style="background:#FFE9EC">⛽</i>加油</span>
          <span><i style="background:#F2F4F9">🏦</i>银行</span>
        </div>
        <div class="am-feed">
          <h3>漫步绿荫小径 <em>✨ 呼吸清新自然气息</em></h3>
          <div class="am-cards">
            <div class="am-card"><div class="am-pic" style="background:linear-gradient(160deg,#9CCB86,#5B9E54)">🌳</div><b>半马苏河公园，5公里河景休闲好去处！</b><p>📍 半马苏河公园<em>557米</em></p></div>
            <div class="am-card"><div class="am-pic" style="background:linear-gradient(160deg,#F2C4CE,#C98397)">🌸</div><b>闹市中的森系仙境，免费打卡太值了！</b><p>📍 中山公园<em>3.2公里</em></p></div>
          </div>
          <h3>逛街模式开启 <em>✨ 买买买的快乐</em></h3>
          <div class="am-cards">
            <div class="am-card"><div class="am-pic" style="background:linear-gradient(160deg,#E8EBF2,#B9C0D0)">🛍️</div><b>金桥太茂一站式逛吃攻略，周末遛娃首选</b><p>📍 金桥太茂<em>800米</em></p></div>
            <div class="am-card"><div class="am-pic" style="background:linear-gradient(160deg,#BFD8F7,#7FA8DC)">🧋</div><b>新开奶茶一条街，亲测排队最短时段</b><p>📍 乐园路<em>1.1公里</em></p></div>
          </div>
        </div>
      </div>
      ${tabBar}`;
    } else {
      body = `
      <div class="am-page mine">
        <div class="am-me-head">
          <span class="am-me-ava">👤</span>
          <div class="am-me-meta">
            <b>amap_MY2026</b>
            <p>0 粉丝 · 0 关注 · 0 贡献</p>
            <span class="am-lv">可成为 Lv.1 高德达人</span>
          </div>
          <em>主页 ›</em>
        </div>
        <div class="am-foot">
          <div class="am-foot-l">
            <p>👣 足迹</p>
            <b>655.4<i>公里</i><span class="am-new">新轨迹</span></b>
            <div class="am-foot-row"><span>点亮城市<b>26</b><i class="rdot">待点亮</i></span><span>走过上海<b>42%</b></span><span>打卡点<b>21</b></span></div>
          </div>
          <span class="am-earth">🌏</span>
        </div>
        <div class="am-duo">
          <div class="am-mini"><b>语音包</b><p>林志玲语音</p><span>👩</span></div>
          <div class="am-mini"><b>车标</b><p>3D 跑车</p><span>🚙</span></div>
        </div>
        <div class="am-icons">
          <span><i>📄</i>订单</span><span><i>⭐</i>收藏</span><span><i class="rd">💬</i>待评价</span><span><i>🏪</i>店铺入驻</span><span><i>👛</i>钱包卡券</span>
        </div>
        <h3 class="am-h3">好友动态 <span class="am-new">新功能</span><em>关注朋友种草新地点 ›</em></h3>
        <div class="am-cards pad">
          <div class="am-card"><div class="am-pic" style="background:linear-gradient(160deg,#F3D9B1,#C99A5B)">🍤<span class="am-score">大咖评分 4.5</span></div><b>来491附近 现在园区的精致日料…</b><p>📍 Iberico by TRB</p></div>
          <div class="am-card"><div class="am-pic" style="background:linear-gradient(160deg,#2E2A3A,#6B5B73)">🏮<span class="am-score">大咖评分 5.0</span></div><b>新开的一家 omakase 会所感拉满</b><p>📍 涩谷隐世庭院</p></div>
        </div>
        <div class="am-duo">
          <div class="am-mini"><b>我的车</b><p>添加车牌 · 租车 · 卖车</p><span>🚗</span></div>
          <div class="am-mini"><b>借钱</b><p>最高借 30 万</p><span>💰</span></div>
        </div>
      </div>
      ${tabBar}`;
    }

    $("#app-amap").innerHTML = `<div class="ma am2">${body}</div>`;
    bindHome("#app-amap");
    $$("#app-amap [data-amtab]").forEach(b => b.onclick = () => {
      const t = b.dataset.amtab;
      if (t === "ai" || t === "taxi") return OS.toastOS("演示版 · 此功能未模拟");
      MAPP_RENDER.amap(t);
    });
    const myCard = $("#app-amap .am-mycard");
    if (myCard) myCard.onclick = () => OS.openApp("my");
  },

  /* ----- 美团外卖 ----- */
  meituan() {
    const cats = ["美食", "甜点", "超市", "水果", "买药"];
    $("#app-meituan").innerHTML = `<div class="ma">
      ${maHead("mt-head", "美团外卖", `<div class="ma-search dark">🔍 生椰拿铁 又到下午茶时间啦</div>`)}
      <div class="ma-body">
        <div class="mt-cats">${cats.map(c => `<button><span class="ic-bub">${I("heart")}</span>${c}</button>`).join("")}</div>
        <div class="ma-sec">再来一单 <span>你常点的</span></div>
        ${LIFE.meituan.orders.map(o => `
          <div class="mt-order">
            <span class="dp-pic" style="background:${o.color}">${I(o.ic)}</span>
            <span style="flex:1;min-width:0"><b>${o.name}</b><p>${o.sub}</p></span>
            <em>${o.amt}</em>
          </div>`).join("")}
      </div>
    </div>`;
    bindHome("#app-meituan");
  },

  /* ----- 淘宝（首页 / 购物车 / 我的淘宝 三 tab） ----- */
  taobao(tab = "home") {
    const tabBar = `
      <div class="tb-tabs">
        <button class="tb-tab ${tab === "home" ? "on" : ""}" data-tbtab="home">${tab === "home" ? `<span class="tb-logo">淘</span>` : `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4.5 10.5 12 4l7.5 6.5M6.5 9.5V19h11V9.5"/></svg>首页`}</button>
        <button class="tb-tab" data-tbtab="video"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="5.5" width="16" height="13" rx="3"/><path d="m10.5 9.5 4.5 2.5-4.5 2.5z"/></svg>视频</button>
        <button class="tb-tab" data-tbtab="msg"><span class="tb-tab-wrap"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M12 4.5c-4.4 0-8 2.8-8 6.3 0 2 1.2 3.8 3 4.9-.1.8-.5 1.9-1.3 2.6 1.5-.2 2.7-.8 3.5-1.3.9.2 1.8.4 2.8.4 4.4 0 8-2.8 8-6.4S16.4 4.5 12 4.5z"/></svg><span class="sb-badge">3</span></span>消息</button>
        <button class="tb-tab ${tab === "cart" ? "on" : ""}" data-tbtab="cart"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 5h2l2.2 10.5h9.6L20 8H7"/><circle cx="9.5" cy="19" r="1.4"/><circle cx="16.5" cy="19" r="1.4"/></svg>购物车</button>
        <button class="tb-tab ${tab === "mine" ? "on" : ""}" data-tbtab="mine"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><circle cx="12" cy="12" r="8.5"/><path d="M8.5 13.5c.8 1.3 2 2 3.5 2s2.7-.7 3.5-2"/></svg>我的淘宝</button>
      </div>`;

    let body = "";
    if (tab === "home") {
      body = `
      <div class="tb-page home">
        <div class="tb-nav">
          <span>关注</span><span class="on">推荐</span><span>闪购<i class="tb-wm">外卖</i></span><span>国补</span><span>穿搭</span><span>飞猪</span><span class="tb-618">618</span>
        </div>
        <div class="tb-searchbar">
          <i class="tb-scan">⛶</i><b>alo 上衣</b><i>📷</i><button>搜索</button>
        </div>
        <div class="tb-svcs">
          <span><i style="background:#3ECC5F">上门<em class="tb-corner">零食</em></i>天猫超市</span>
          <span><i style="background:#FF0F6E">U</i>试用领取</span>
          <span><i style="background:#FFB800">币<em class="tb-corner">抵钱</em></i>领淘金币</span>
          <span><i style="background:#FF2D2D">¥</i>红包签到</span>
          <span><i style="background:#2A2A33">88</i>88VIP</span>
          <span><i style="background:#3ECC5F">🌳</i>芭芭农场</span>
        </div>
        <div class="tb-banners">
          <div class="tb-bn"><b>618 淘宝直播</b><div class="tb-bn-pic" style="background:linear-gradient(160deg,#6B6B70,#3E3E45)">👕</div><p><em>¥249</em><i class="pk">休闲百搭</i></p></div>
          <div class="tb-bn"><b>618 百亿补贴</b><div class="tb-bn-pic" style="background:linear-gradient(160deg,#AFCBEF,#7FA4D8)">👚</div><p><em>¥490</em><i class="yl">⚡补贴价</i></p></div>
          <div class="tb-bn"><b>618 淘宝秒杀</b><div class="tb-bn-pic" style="background:linear-gradient(160deg,#FFE9B8,#FCD27E)">🐤</div><p><i class="rd">限时疯抢五折起</i></p></div>
        </div>
        <div class="tb-feed">
          <div class="tb-card"><div class="tb-pic2" style="background:linear-gradient(170deg,#E8C9BA,#B96F52)">👗</div><b>OfAkiv 落日油画印花连衣裙 法式吊带长裙</b><p class="tb-tagline"><i>618品类周</i>官方立减15%</p><p class="tb-price"><em>¥284</em>券后价<span>已售 200+</span></p></div>
          <div class="tb-card"><div class="tb-pic2" style="background:linear-gradient(170deg,#D6E5A3,#A8C25B)">☕</div><b>天猫【单一产区】野鸽子埃塞俄比亚耶加雪菲</b><p class="tb-tagline"><i>618品类周</i>官方立减15%</p><p class="tb-price"><em>¥73.3</em>券后价<span>已售 3万+</span></p></div>
          ${LIFE.taobao.items.map(t => `
          <div class="tb-card"><div class="tb-pic2" style="background:${t.color}">${I(t.ic)}</div><b>${t.name}</b><p class="tb-tagline"><i>618品类周</i>${t.sold}</p><p class="tb-price"><em>${t.price}</em>券后价</p></div>`).join("")}
        </div>
        <div class="tb-vipbar"><i>88VIP</i><b>领<em>1375元</em>88VIP专享消费券</b><button>领1375元</button><span>✕</span></div>
      </div>
      ${tabBar}`;
    } else if (tab === "cart") {
      body = `
      <div class="tb-page cart">
        <div class="tb-cart-head"><h2>购物车 <i>(15)</i></h2><span class="tb-ai">✨ AI省钱</span><span>🔍</span><span>管理</span></div>
        <div class="tb-filters"><span class="yl">⚡ 官方立减</span><span class="or">⬇ 降价</span><span class="fd">📁 分组</span><span class="tb-tip">帮你找更多优惠，更省钱 ✕</span></div>
        <div class="tb-vipbar flat"><i>88VIP</i><b>领<em>1375元</em>88VIP专享消费券</b><button>领1375元</button></div>

        <div class="tb-shop">
          <div class="tb-shop-h"><i class="tb-ck"></i><em class="tm">天猫</em><b>venuscome旗舰店 ›</b></div>
          <div class="tb-citem">
            <i class="tb-ck"></i>
            <div class="tb-cpic" style="background:linear-gradient(170deg,#F4F0EA,#DCD4C8)">🎽</div>
            <div class="tb-cmeta">
              <b><i class="tb-618t">618品类周</i>有内吊带背心女带胸垫 <span class="tb-x1">×1</span></b>
              <p class="tb-sku">月白;M ›</p>
              <p class="tb-tags"><span class="or">消费券</span><span class="or">官方立减12元</span><span class="or">补贴2元</span><span class="gr">退货宝</span></p>
              <p class="tb-tags"><span class="gy">大促价保</span><span class="gy">超级爆款</span><span class="gy">88VIP退货包运费</span></p>
              <p class="tb-cprice">券后 <em>¥65.9</em><del>¥79.9</del><span>比加购降2</span></p>
              <p class="tb-sum">优惠合计14 <span>明细 ›</span></p>
              <div class="tb-coupon">领消费券后享满200减25 <span>领取 ›</span></div>
            </div>
          </div>
        </div>

        <div class="tb-shop">
          <div class="tb-shop-h"><i class="tb-ck"></i><em class="tm">天猫</em><b>猫人京兆世第专卖店 ›</b></div>
          <div class="tb-citem">
            <i class="tb-ck"></i>
            <div class="tb-cpic" style="background:linear-gradient(170deg,#EDF2E4,#D3DEC2)">👙</div>
            <div class="tb-cmeta">
              <b><i class="tb-618t">618品类周</i>猫人冰丝吊带女2026 <span class="tb-x1">×1</span></b>
              <p class="tb-sku">【两件装更划算】牙白+黑色;M ›</p>
              <p class="tb-tags"><span class="or">官方立减18元</span><span class="or">礼金直降</span><span class="gr">3期免息</span></p>
              <p class="tb-tags"><span class="gr">退货宝</span><span class="gy">大促价保</span><span class="gy">先用后付</span></p>
              <p class="tb-cprice">券后 <em>¥88.95</em><del>¥119</del><span>比加购降12.05</span></p>
              <p class="tb-sum">优惠合计30.05 <span>明细 ›</span></p>
            </div>
          </div>
        </div>

        <div class="tb-shop">
          <div class="tb-shop-h"><i class="tb-ck"></i><em class="tb2">淘宝</em><b>odd haus ›</b></div>
          <div class="tb-citem">
            <i class="tb-ck"></i>
            <div class="tb-cpic dim" style="background:linear-gradient(170deg,#3E5C49,#2A4334)">🥚</div>
            <div class="tb-cmeta">
              <b>oddhaus原创设计鸡蛋托冰箱贴 小</b>
              <p class="tb-tags"><span class="gy">88VIP退货包运费</span><span class="gy">7天无理由退货</span></p>
              <p class="tb-oos">所选款式缺货，请重新选择 <span>重选 ›</span></p>
            </div>
          </div>
        </div>

        <div class="tb-settle"><i class="tb-ck"></i>全选<b>合计: <em>¥0</em></b><button>结算</button></div>
      </div>
      ${tabBar}`;
    } else {
      body = `
      <div class="tb-page mine">
        <div class="tb-me-top">
          <span class="tb-ava">👩</span>
          <div class="tb-me-meta">
            <b>Carolineluu <i>⠿</i></b>
            <p><span class="vip">88VIP</span><span class="dia">钻石会员</span><em>⌂ 关注店铺</em></p>
          </div>
          <div class="tb-me-acts"><span>◎<i>地址</i></span><span>🎧<i>专属客服</i></span><span>⚙<i>设置</i></span></div>
        </div>
        <div class="tb-save">
          <div class="tb-save-l">累计省钱<b>1.53万元</b> ›</div>
          <div class="tb-save-r"><span><b>会员中心</b><p>专享礼<em>待领取</em> ›</p></span><span><b>88VIP</b><p>领消费券 ›</p><i class="tb-vtag">¥1375<em>消费券</em></i></span></div>
        </div>
        <div class="tb-assets">
          <span><p>红包</p><b>¥49</b></span>
          <span><p>优惠券</p><b>18张</b></span>
          <span><p>淘金币抵</p><b>¥71.95</b></span>
          <span><p>天猫积分</p><b>3767</b></span>
          <span><p>借钱 ?</p><b class="sm">一键查额</b></span>
          <span class="tb-all">全部权益 ›</span>
        </div>
        <div class="tb-strip">🎟 <b>3元</b>优惠券待使用，限指定商品可用<button>去使用</button></div>

        <div class="tb-white">
          <h3>我的订单 <em>全部 ›</em></h3>
          <div class="tb-orders">
            <span><i>💳</i>待付款</span>
            <span><i>📦</i>待发货</span>
            <span><i>🚚<b class="sb-badge">4</b></i>待收货</span>
            <span><i>💬<b class="sb-badge">3</b></i>待评价</span>
            <span><i>💰</i>退款/售后</span>
          </div>
          <div class="tb-eval">🍰 待评价 <i>这款糕点吃起来健康吗?</i></div>
        </div>

        <div class="tb-white">
          <div class="tb-quad">
            <span><b>📦 快递</b><p>4 件已签收</p><i style="background:linear-gradient(160deg,#F7D9A8,#EBB35E)">🍪</i><em>去查看</em></span>
            <span><b>☆ 收藏</b><p>99+ 收藏宝贝</p><i style="background:linear-gradient(160deg,#E8EDF4,#C9D4E4)">🧴</i><em>消费券</em></span>
            <span><b>⌂ 关注店铺</b><p>最近逛过</p><i style="background:linear-gradient(160deg,#E8C9BA,#B96F52)">👗</i><em>OfAkiva</em></span>
            <span><b>🕐 足迹</b><p>看过的内容</p><i style="background:linear-gradient(160deg,#9FB3CB,#5E7799)">👖</i><em>400+人付款</em></span>
          </div>
        </div>

        <div class="tb-white">
          <h3><i class="tb-618t big">618品类周</i> 领券中心 <em>更多 ›</em></h3>
          <div class="tb-coupons">
            <span class="gold"><b>¥1375</b><p>88VIP专享</p><button class="dk">去领取</button></span>
            <span><b>¥5</b><p>服饰加补券</p><button>去使用</button></span>
            <span><b>¥200</b><p>美妆加补券</p><button>去领取</button></span>
            <span><b>¥5</b><p>手配加补券</p><button>去领取</button></span>
          </div>
        </div>
        <div class="tb-svcs mine">
          <span><i style="background:#3ECC5F">🌳</i>芭芭农场</span>
          <span><i style="background:#FF4D2D">20亿</i>领淘金币</span>
          <span><i style="background:#FF2D2D">¥</i>红包签到</span>
          <span><i style="background:#FF0F6E">U</i>试用领取</span>
          <span><i style="background:#FF7A2E">票</i>发票中心</span>
        </div>
      </div>
      ${tabBar}`;
    }

    $("#app-taobao").innerHTML = `<div class="ma tb2-wrap ${tab}">${body}</div>`;
    bindHome("#app-taobao");
    $$("#app-taobao [data-tbtab]").forEach(b => b.onclick = () => {
      const t = b.dataset.tbtab;
      if (t === "video" || t === "msg") return OS.toastOS("演示版 · 此功能未模拟");
      MAPP_RENDER.taobao(t);
    });
  },
};

function TILE_IC(n) { return n; }
function bindHome(sel) { const b = $(sel + " [data-home]"); if (b) b.onclick = () => OS.goHome(); }

/* ---------- 接娃守护：主动场景触发 ---------- */
function armPickupScenario() {
  if (!S.user || S.pickupArmed) return;
  S.pickupArmed = true; save();
  setTimeout(() => {
    OS.badge("my", 1);
    $("#sbw-tip").textContent = "⚠ 15:50 · 车还在公司,接小桃要迟了";
    OS.notify({
      app: "MY · 车灵", icon: bunnyHeadSVG(),
      text: "已经 15:50 了,SUP C 还停在公司车位(模拟时间)。按惯例 15:30 该出发去接小桃了——点我看看怎么办",
      stay: 9000, urgent: true,   // 警告级:接娃异常,无视勿扰
      onTap() {
        OS.badge("my", 0);
        OS.openApp("my");
        if (typeof startPickupScenario === "function") startPickupScenario();
      },
    });
  }, 9000);
}

/* ---------- Home pill / 初始化 ---------- */
$("#home-pill").addEventListener("click", () => OS.goHome());
$$(".sbw-my").forEach(w => w.onclick = () => OS.openApp("my"));

$("#sbw-bunny").innerHTML = bunnyHeadSVG();
renderSpringboard();
tickWidget();
OS.updateStatus();
/* 微信初始未读角标 */
OS.badge("wechat", LIFE.wechat.chats.reduce((s, c) => s + (c.unread || 0), 0));
/* 登录后布防接娃场景 */
if (S.user) armPickupScenario();
window.armPickupScenario = armPickupScenario;
