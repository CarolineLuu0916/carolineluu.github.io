/* ============ AI Trends — app ============ */
(function () {
  "use strict";
  const $ = (s, el) => (el || document).querySelector(s);
  const $$ = (s, el) => Array.from((el || document).querySelectorAll(s));
  const view = $("#view");
  const fmt = n => n.toLocaleString("en-US");
  const REPORTS = window.AIT_REPORTS, WIKI = window.AIT_WIKI,
        REPOS = window.AIT_REPOS, TL = window.AIT_TIMELINE,
        MODELS = window.AIT_MODELS, SKILLS = window.AIT_SKILLS;

  /* ---------- 顶部日期 ---------- */
  const today = REPORTS[0].date.replace(/-/g, ".");
  $("#navDate").textContent = today + " · " + REPORTS[0].weekday;
  $("#footerDate").textContent = "DATA AS OF " + REPORTS[0].date + " · BUILT WITH CLAUDE CODE";

  /* ---------- 快讯条 ---------- */
  (function ticker() {
    const items = [];
    REPORTS[0].items.forEach(it => items.push(`<b>${it.region}</b>　${it.title}`));
    const top = REPOS.items.slice().sort((a, b) => b.stars - a.stars).slice(0, 4);
    top.forEach(r => items.push(`<b>GitHub</b>　${r.name} ★${fmt(r.stars)}`));
    const html = items.map(t => `<span class="ticker-item">${t}</span><span class="ticker-sep">◆</span>`).join("");
    $("#tickerTrack").innerHTML = html + html; // 双份做无缝循环
  })();

  /* ---------- 入场动画 ---------- */
  let io;
  function observeReveals() {
    if (io) io.disconnect();
    io = new IntersectionObserver(es => es.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add("on"); io.unobserve(e.target); }
    }), { threshold: .08 });
    $$(".rv").forEach((el, i) => {
      el.style.transitionDelay = Math.min(i % 9, 6) * 60 + "ms";
      io.observe(el);
    });
  }

  /* ---------- 星数滚动 ---------- */
  function animateStars() {
    const sio = new IntersectionObserver(es => es.forEach(e => {
      if (!e.isIntersecting) return;
      sio.unobserve(e.target);
      const el = e.target, target = +el.dataset.n, t0 = performance.now(), dur = 1100;
      (function tick(t) {
        const p = Math.min((t - t0) / dur, 1), ease = 1 - Math.pow(1 - p, 3);
        el.textContent = fmt(Math.round(target * ease));
        if (p < 1) requestAnimationFrame(tick);
      })(t0);
    }), { threshold: .4 });
    $$("[data-n]").forEach(el => sio.observe(el));
  }

  /* ---------- 弹窗 ---------- */
  const mask = $("#modalMask");
  function openModal(html) { $("#modalBody").innerHTML = html; mask.hidden = false; document.body.style.overflow = "hidden"; }
  function closeModal() { mask.hidden = true; document.body.style.overflow = ""; }
  $("#modalClose").onclick = closeModal;
  mask.addEventListener("click", e => { if (e.target === mask) closeModal(); });
  document.addEventListener("keydown", e => { if (e.key === "Escape") closeModal(); });

  /* ============ 一键更新（各版块通用） ============ */
  // 网页按钮 POST 到触发器 Worker → 由它带 section 去触发 GitHub 工作流，后端调研/抓取后自动改数据文件并提交。
  // GitHub 令牌只在 Worker 服务端，不进前端。Worker 名字需为 ai-trends-trigger，URL 才对得上。
  const TRIGGER_URL = "https://ai-trends-trigger.carolineluu0916.workers.dev";
  async function triggerUpdate(section, btn) {
    const old = btn.textContent;
    btn.disabled = true; btn.textContent = "⟳ 已触发，后台更新中…";
    try {
      const res = await fetch(TRIGGER_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ section }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.ok) {
        btn.textContent = "✓ 已触发，约 1–2 分钟后刷新本页查看";
      } else {
        btn.textContent = "✗ 触发失败，详情见控制台";
        console.error("[trigger] 失败", section, res.status, data);
      }
    } catch (e) {
      btn.textContent = "✗ 连不上后端（需开 Clash 全局）";
      console.error("[trigger]", section, e);
    }
    setTimeout(() => { btn.disabled = false; btn.textContent = old; }, 6000);
  }
  function renderDaily(idx) {
    idx = idx || 0;
    const r = REPORTS[idx];
    const opts = REPORTS.map((x, i) =>
      `<option value="${i}" ${i === idx ? "selected" : ""}>${x.date.replace(/-/g, ".")} ${x.weekday} · ${x.vol}</option>`).join("");
    const archive = `
      <span class="daily-archive">
        <button class="daily-pager" data-step="1" ${idx >= REPORTS.length - 1 ? "disabled" : ""} title="上一期（更早）" aria-label="上一期">‹</button>
        <select class="daily-select" id="dailySelect" title="跳转往期">${opts}</select>
        <button class="daily-pager" data-step="-1" ${idx <= 0 ? "disabled" : ""} title="下一期（更新）" aria-label="下一期">›</button>
        <span class="daily-archive-cnt">共 ${REPORTS.length} 期</span>
      </span>`;
    const vanes = r.vane.map(v => {
      const sym = v.dir === "up" ? "↗" : v.dir === "down" ? "↘" : "→";
      return `<div class="vane ${v.dir} rv"><span class="dir">${sym}</span><span>${v.label}</span><span class="note">${v.note}</span></div>`;
    }).join("");
    const news = r.items.map(it => `
      <div class="news-item rv">
        <div class="news-region"><span class="tag ${it.tag}">${it.region}</span></div>
        <div class="card news-card">
          <div class="news-title">${it.title}</div>
          <div class="news-what">${it.what}</div>
          ${it.detail ? `
          <div class="news-detail-toggle"><span class="arrow">▾</span>展开详情</div>
          <div class="news-detail"><div class="news-detail-in"><div class="news-detail-text">${it.detail}</div></div></div>` : ""}
          <div class="news-why"><b>意味着什么</b>${it.why}</div>
          ${it.url ? `<a class="news-src" href="${it.url}" target="_blank" rel="noopener noreferrer">原文 ↗</a>` : ""}
        </div>
      </div>`).join("");
    const papers = (r.papers || []).map(p => `
      <div class="card paper-card rv">
        <div class="paper-title">${p.title}</div>
        <div class="paper-meta">${[p.authors, p.venue, p.date].filter(Boolean).join(" · ")}</div>
        <div class="paper-summary">${p.summary}</div>
        <div class="paper-why"><b>意味着什么</b>${p.why}</div>
        ${p.url ? `<a class="news-src" href="${p.url}" target="_blank" rel="noopener noreferrer">论文原文 ↗</a>` : ""}
      </div>`).join("");
    view.innerHTML = `
      <section class="page daily-hero">
        <div class="daily-kicker rv">
          <span class="eyebrow" style="margin:0">DAILY BRIEFING · ${r.vol}</span>
          <span class="daily-vol">${r.date.replace(/-/g, ".")} ${r.weekday}</span>
          ${archive}
        </div>
        <div class="sec-actions rv"><button class="btn ghost" id="updDaily" title="触发后端立即调研并生成今日日报">⟳ 立即拉取今日日报</button></div>
        <h1 class="daily-headline rv">${r.headline}</h1>
        <p class="daily-tldr rv">${r.tldr}</p>
        <div class="vane-row">${vanes}</div>
        <div class="h-rule rv"><span class="t">今日要闻</span><span class="n">${r.items.length} ITEMS · 每日更新</span></div>
        <div class="news-list">${news}</div>
        ${papers ? `
        <div class="h-rule rv"><span class="t">学术速递</span><span class="n">${(r.papers || []).length} PAPERS · 宁缺毋滥</span></div>
        <div class="paper-list">${papers}</div>` : ""}
      </section>`;
    const sel = $("#dailySelect");
    if (sel) sel.onchange = () => renderDaily(+sel.value);
    $$(".news-detail-toggle").forEach(t => t.onclick = () => t.closest(".news-card").classList.toggle("open"));
    $$(".daily-pager").forEach(b => b.onclick = () => {
      if (b.disabled) return;
      renderDaily(Math.max(0, Math.min(REPORTS.length - 1, idx + (+b.dataset.step))));
    });
    $("#updDaily").onclick = () => triggerUpdate("daily", $("#updDaily"));
    afterRender();
  }

  /* ============ 百科 ============ */
  let wikiCat = "all", wikiQ = "";
  function renderWiki() {
    const cats = [{ id: "all", label: "全部" }].concat(WIKI.cats);
    view.innerHTML = `
      <section class="page">
        <div class="eyebrow rv">ENCYCLOPEDIA · 更新于 ${WIKI.updated}</div>
        <h1 class="page-title rv">AI Agent 百科</h1>
        <p class="page-sub rv">为重返行业准备的速查手册：每个词条都附「产品视角」和结合最新动态的补充。可搜索、可提问。</p>
        <div class="wiki-tools rv">
          <div class="wiki-search">
            <span class="ic">⌕</span>
            <input id="wikiInput" placeholder="搜索或提问，如：MCP 是什么？RAG 还有必要吗？" autocomplete="off">
          </div>
          <button class="btn" id="askBtn">问一问</button>
          <button class="btn ghost" id="updBtn">↻ 更新百科</button>
        </div>
        <div class="wiki-cats rv">${cats.map(c =>
          `<button class="chip ${wikiCat === c.id ? "on" : ""}" data-wc="${c.id}">${c.label}
           <span class="cnt">${c.id === "all" ? WIKI.terms.length : WIKI.terms.filter(t => t.cat === c.id).length}</span></button>`).join("")}
        </div>
        <div id="askOut" class="ask-answer" hidden></div>
        <div class="wiki-grid" id="wikiGrid"></div>
      </section>`;
    drawTerms();
    $$("[data-wc]").forEach(b => b.onclick = () => { wikiCat = b.dataset.wc; renderWiki(); });
    const input = $("#wikiInput");
    input.value = wikiQ;
    input.oninput = () => { wikiQ = input.value.trim(); drawTerms(); };
    input.onkeydown = e => { if (e.key === "Enter") ask(); };
    $("#askBtn").onclick = ask;
    $("#updBtn").onclick = () => triggerUpdate("wiki", $("#updBtn"));
    afterRender();
  }
  function termMatches(t, q) {
    if (!q) return true;
    const hay = (t.zh + t.en + t.brief + t.body + t.pm + t.fresh).toLowerCase();
    return q.toLowerCase().split(/\s+/).every(w => hay.includes(w));
  }
  function drawTerms() {
    const list = WIKI.terms.filter(t => (wikiCat === "all" || t.cat === wikiCat) && termMatches(t, wikiQ));
    const catName = id => (WIKI.cats.find(c => c.id === id) || {}).label || "";
    $("#wikiGrid").innerHTML = list.length ? list.map(t => `
      <div class="card term rv" data-tid="${t.id}">
        <div class="term-head">
          <span class="term-zh">${t.zh}</span><span class="term-en">${t.en}</span>
          <span class="term-arrow">▾</span>
        </div>
        <div class="term-brief">${t.brief}</div>
        <div class="term-more"><div class="term-more-in">
          <div class="term-body">${t.body}</div>
          <div class="term-pm"><b>产品视角</b> · ${t.pm}</div>
          <div class="term-fresh"><span class="dot">●</span><span><b>最新动态</b> ${t.fresh}</span></div>
        </div></div>
      </div>`).join("")
      : `<p style="color:var(--ink-3);grid-column:1/-1;padding:30px 0">没有找到相关词条，试试「问一问」？</p>`;
    $$(".term").forEach(el => el.onclick = () => el.classList.toggle("open"));
    observeReveals();
  }
  function ask() {
    const q = ($("#wikiInput").value || "").trim();
    const out = $("#askOut");
    if (!q) { out.hidden = true; return; }
    const scored = WIKI.terms.map(t => {
      let s = 0; const ql = q.toLowerCase();
      if (t.zh.toLowerCase().includes(ql) || t.en.toLowerCase().includes(ql)) s += 10;
      ql.split(/[\s,，?？的是什么吗还有]+/).filter(w => w.length > 1).forEach(w => {
        if ((t.zh + t.en).toLowerCase().includes(w)) s += 5;
        if ((t.brief + t.body).toLowerCase().includes(w)) s += 2;
        if ((t.pm + t.fresh).toLowerCase().includes(w)) s += 1;
      });
      return { t, s };
    }).filter(x => x.s > 0).sort((a, b) => b.s - a.s).slice(0, 2);
    out.hidden = false;
    if (!scored.length) {
      out.innerHTML = `<div class="card"><div class="q">Q · ${q}</div>
        <div class="a">百科里暂时没有能直接回答这个问题的词条。建议把它抛给 Claude / Kimi 等助手，或点击「↻ 更新百科」让 Claude Code 调研后把答案沉淀成新词条。</div></div>`;
    } else {
      out.innerHTML = `<div class="card"><div class="q">Q · ${q}</div>` +
        scored.map(x => `<div class="a" style="margin-bottom:10px"><b>${x.t.zh}（${x.t.en}）</b> — ${x.t.brief} ${x.t.pm}</div>`).join("") +
        `<div class="a" style="font-size:13px;color:var(--ink-3)">已为你定位到最相关的 ${scored.length} 个词条，下方卡片可展开看完整解释。</div></div>`;
      // 高亮并展开匹配词条
      wikiQ = ""; drawTerms();
      scored.forEach(x => { const el = $(`[data-tid="${x.t.id}"]`); if (el) el.classList.add("open"); });
      const first = $(`[data-tid="${scored[0].t.id}"]`);
      if (first) setTimeout(() => first.scrollIntoView({ behavior: "smooth", block: "center" }), 150);
    }
  }

  /* ============ 项目库（开源项目 + Agent Skills 双模） ============ */
  let repoMode = "repos";   // repos | skills
  let repoCat = "all";      // 开源项目分类
  let skillCat = "all";     // Skill 分类
  function renderRepos() {
    const modebar = `
      <div class="repo-modebar rv">
        <div class="repo-seg">
          <button class="seg-btn ${repoMode === "repos" ? "on" : ""}" data-rm="repos">💎 开源项目 <span class="seg-cnt">${REPOS.items.length}</span></button>
          <button class="seg-btn ${repoMode === "skills" ? "on" : ""}" data-rm="skills">🧩 Agent Skills <span class="seg-cnt">${SKILLS.items.length}</span></button>
        </div>
        <button class="btn ghost" id="updData">↻ ${repoMode === "repos" ? "刷新 star 数据" : "更新技能库"}</button>
      </div>`;
    view.innerHTML = repoMode === "repos" ? reposMarkup(modebar) : skillsMarkup(modebar);
    $$("[data-rm]").forEach(b => b.onclick = () => { repoMode = b.dataset.rm; renderRepos(); });
    $("#updData").onclick = () => triggerUpdate(repoMode === "repos" ? "repos" : "skills", $("#updData"));
    if (repoMode === "repos") {
      drawRepos();
      $$("[data-rc]").forEach(b => b.onclick = () => { repoCat = b.dataset.rc; renderRepos(); });
    } else {
      drawSkills();
      $$("[data-sc]").forEach(b => b.onclick = () => { skillCat = b.dataset.sc; renderRepos(); });
    }
    afterRender();
  }
  function reposMarkup(seg) {
    const chips = [`<button class="chip ${repoCat === "all" ? "on" : ""}" data-rc="all">全部 <span class="cnt">${REPOS.items.length}</span></button>`]
      .concat(REPOS.cats.map(c =>
        `<button class="chip ${repoCat === c.id ? "on" : ""}" data-rc="${c.id}">${c.icon} ${c.label}
         <span class="cnt">${REPOS.items.filter(r => r.cat === c.id).length}</span></button>`)).join("");
    return `
      <section class="page">
        <div class="eyebrow rv">CURATED LIBRARY · 数据更新于 ${REPOS.updated}</div>
        <h1 class="page-title rv">项目库</h1>
        <p class="page-sub rv">两类「值得花时间了解」的东西：能跑的<b>开源项目</b>，和能调用的 <b>Agent Skill</b>（可复用专长）。各自分门别类，都写明定位与适用人群。</p>
        ${seg}
        <div class="repo-toolbar rv">${chips}</div>
        <div class="repo-meta-line" id="repoCount"></div>
        <div class="repo-grid" id="repoGrid"></div>
      </section>`;
  }
  function drawRepos() {
    const cat = REPOS.cats.find(c => c.id === repoCat);
    const list = REPOS.items.filter(r => repoCat === "all" || r.cat === repoCat)
      .sort((a, b) => b.stars - a.stars);
    $("#repoCount").textContent = (cat ? cat.icon + " " + cat.label + " — " + cat.blurb : "全部分类 · 按 STAR 数排序") + " · " + list.length + " 个项目";
    const catLabel = id => { const c = REPOS.cats.find(x => x.id === id); return c ? c.icon + " " + c.label : ""; };
    $("#repoGrid").innerHTML = list.map(r => `
      <div class="card repo-card rv">
        <div class="repo-top">
          <span class="repo-name">${r.name}</span>
          <span class="repo-stars"><span class="star">★</span><span data-n="${r.stars}">0</span></span>
        </div>
        <div class="repo-cat-tag">${catLabel(r.cat)} · ${r.repo}</div>
        <div class="repo-tagline">${r.tagline}</div>
        <div class="repo-review">${r.review}</div>
        <div class="repo-fit"><b>适合：</b>${r.fit}</div>
        <a class="repo-link" href="https://github.com/${r.repo}" target="_blank" rel="noopener">github.com/${r.repo} ↗</a>
      </div>`).join("");
    observeReveals(); animateStars();
  }

  /* ---------- Agent Skills ---------- */
  const skillSrcTag = s => s === "Cloudflare" ? "eco" : s === "GSAP" ? "cn" : s === "社区" ? "os" : "gl";
  function skillsMarkup(seg) {
    const chips = [`<button class="chip ${skillCat === "all" ? "on" : ""}" data-sc="all">全部 <span class="cnt">${SKILLS.items.length}</span></button>`]
      .concat(SKILLS.cats.map(c =>
        `<button class="chip ${skillCat === c.id ? "on" : ""}" data-sc="${c.id}">${c.icon} ${c.label}
         <span class="cnt">${SKILLS.items.filter(s => s.cat === c.id).length}</span></button>`)).join("");
    return `
      <section class="page">
        <div class="eyebrow rv">AGENT SKILLS · 整理于 ${SKILLS.updated}</div>
        <h1 class="page-title rv">Skill 技能库</h1>
        <p class="page-sub rv">${SKILLS.intro}</p>
        ${seg}
        <div class="repo-toolbar rv">${chips}</div>
        <div class="repo-meta-line" id="skillCount"></div>
        <div class="repo-grid" id="skillGrid"></div>
      </section>`;
  }
  function drawSkills() {
    const cat = SKILLS.cats.find(c => c.id === skillCat);
    const list = SKILLS.items.filter(s => skillCat === "all" || s.cat === skillCat);
    $("#skillCount").textContent = (cat ? cat.icon + " " + cat.label + " — " + cat.blurb : "全部分类 · 按主题排列") + " · " + list.length + " 个 Skill";
    const catLabel = id => { const c = SKILLS.cats.find(x => x.id === id); return c ? c.icon + " " + c.label : ""; };
    $("#skillGrid").innerHTML = list.map(s => `
      <div class="card repo-card rv">
        <div class="repo-top">
          <span class="repo-name">${s.name}</span>
          <span class="tag ${skillSrcTag(s.source)}">${s.source}</span>
        </div>
        <div class="repo-cat-tag">${catLabel(s.cat)}${s.gh ? " · " + s.gh : ""}</div>
        <div class="repo-tagline">${s.tagline}</div>
        <div class="repo-review">${s.what}</div>
        <div class="repo-fit"><b>意味着什么：</b>${s.why}</div>
        ${s.gh ? `<a class="repo-link" href="https://github.com/${s.gh}" target="_blank" rel="noopener">github.com/${s.gh} ↗</a>` : ``}
      </div>`).join("");
    observeReveals();
  }

  /* ============ 模型图鉴 ============ */
  let modelGroup = "all";
  function renderModels() {
    const chips = [`<button class="chip ${modelGroup === "all" ? "on" : ""}" data-mg="all">全部 <span class="cnt">${MODELS.items.length}</span></button>`]
      .concat(MODELS.groups.map(g =>
        `<button class="chip ${modelGroup === g.id ? "on" : ""}" data-mg="${g.id}">${g.icon} ${g.label}
         <span class="cnt">${MODELS.items.filter(m => m.group === g.id).length}</span></button>`)).join("");
    const picks = MODELS.picks.map(p => `
      <div class="card pick-card rv">
        <div class="pick-scene">${p.scene}</div>
        <div class="pick-rec">${p.rec}</div>
        <div class="pick-alt">${p.alt}</div>
      </div>`).join("");
    view.innerHTML = `
      <section class="page">
        <div class="eyebrow rv">MODEL ATLAS · 数据截至 ${MODELS.updated}</div>
        <h1 class="page-title rv">模型图鉴</h1>
        <p class="page-sub rv">主流与值得关注的「非主流」模型一页看全：定位、优缺点、价格与适用场景。${MODELS.note}</p>
        <div class="sec-actions rv"><button class="btn ghost" id="updModels">↻ 更新模型图鉴</button></div>
        <div class="h-rule rv"><span class="t">按场景速查</span><span class="n">QUICK PICKS</span></div>
        <div class="pick-grid">${picks}</div>
        <div class="h-rule rv"><span class="t">全部模型</span><span class="n">${MODELS.items.length} MODELS</span></div>
        <div class="repo-toolbar rv">${chips}</div>
        <div class="model-grid" id="modelGrid"></div>
      </section>`;
    drawModels();
    $$("[data-mg]").forEach(b => b.onclick = () => { modelGroup = b.dataset.mg; renderModels(); });
    $("#updModels").onclick = () => triggerUpdate("models", $("#updModels"));
    afterRender();
  }
  function drawModels() {
    const list = MODELS.items.filter(m => modelGroup === "all" || m.group === modelGroup);
    const groupLabel = id => { const g = MODELS.groups.find(x => x.id === id); return g ? g.icon + " " + g.label : ""; };
    const accTag = a => a.includes("开源") ? "os" : "gl";
    $("#modelGrid").innerHTML = list.map(m => `
      <div class="card model-card rv">
        <div class="model-top">
          <span class="model-name">${m.name}</span>
          <span class="tag ${accTag(m.access)}">${m.access}</span>
        </div>
        <div class="model-meta">${m.vendor} · ${m.date} · ${groupLabel(m.group)}</div>
        <div class="model-pos">${m.pos}</div>
        <div class="model-specs">${m.specs.map(s => `<span class="spec">${s}</span>`).join("")}</div>
        <div class="model-pc">
          <ul class="pc pros">${m.pros.map(x => `<li>${x}</li>`).join("")}</ul>
          <ul class="pc cons">${m.cons.map(x => `<li>${x}</li>`).join("")}</ul>
        </div>
        <div class="repo-fit"><b>适合：</b>${m.fit}</div>
      </div>`).join("");
    observeReveals();
  }

  /* ============ 时间线 ============ */
  function renderTimeline() {
    const eras = TL.map(e => `
      <div class="tl-era">
        <div class="tl-era-head rv">
          <span class="tl-era-label">${e.era} · ${e.period}</span>
          <div class="tl-era-title">${e.title}</div>
          <div class="tl-era-theme">${e.theme}</div>
        </div>
        ${e.events.map(ev => `
          <div class="tl-event rv">
            <div class="tl-date">${ev.date}</div>
            <div class="tl-title">${ev.title}<span class="tag ${ev.tag === "中国" ? "cn" : ev.tag === "开源" ? "os" : ev.tag === "协议" ? "eco" : "gl"}">${ev.tag}</span></div>
            <div class="tl-desc">${ev.desc}</div>
          </div>`).join("")}
      </div>`).join("");
    view.innerHTML = `
      <section class="page">
        <div class="eyebrow rv">EVOLUTION · 2017 → 2026</div>
        <h1 class="page-title rv">大事件进化时间线</h1>
        <p class="page-sub rv">从 Transformer 到个人 Agent 平台之争——理解现在的最快方式，是看清我们是怎么走到这里的。</p>
        <div class="sec-actions rv"><button class="btn ghost" id="updTimeline">↻ 补充时间线</button></div>
        <div class="tl-wrap">
          <div class="tl-spine"><div class="tl-spine-fill" id="spineFill"></div></div>
          ${eras}
        </div>
      </section>`;
    $("#updTimeline").onclick = () => triggerUpdate("timeline", $("#updTimeline"));
    afterRender();
    const wrap = $(".tl-wrap"), fill = $("#spineFill");
    function onScroll() {
      const rect = wrap.getBoundingClientRect();
      const vh = window.innerHeight;
      const p = Math.max(0, Math.min(1, (vh * .7 - rect.top) / rect.height));
      fill.style.height = p * 100 + "%";
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  /* ============ 关于 ============ */
  function renderAbout() {
    view.innerHTML = `
      <section class="page">
        <div class="eyebrow rv">ABOUT</div>
        <h1 class="page-title rv">关于 AI Trends</h1>
        <div class="about-grid">
          <div class="card about-card rv">
            <h3>写给正在重返战场的自己</h3>
            <p>我是 <b>Caroline Lu</b>，一名 AI 产品经理。脱产一段时间后回头看，这个行业又翻了一页：Agent 从论文走进了产线，开源追平了闭源，连「编程」本身都被重写了。</p>
            <p>这个站点是我的<b>重返工具箱</b>：用百科补概念，用项目库看生态，用日报追风向，用时间线建立坐标系。它也是一个产品实验——整个网站由 Claude Code 调研、设计并构建，每日更新只需要一句指令。</p>
            <p>如果你也在追赶这个行业，希望它同样对你有用。</p>
            <div class="about-sign">Caroline Lu</div>
          </div>
          <div class="card about-card rv">
            <h3>站点机制</h3>
            <ul class="mech-list">
              <li><span class="mech-num">01</span><span><b>数据驱动</b> — 全部内容在 js/data-*.js 五个文件，正文与数据彻底分离</span></li>
              <li><span class="mech-num">02</span><span><b>真实数据</b> — GitHub 星数实时抓取（走本地代理），新闻经多源交叉验证</span></li>
              <li><span class="mech-num">03</span><span><b>每日更新</b> — 对 Claude Code 说一句话，自动调研并重写数据文件</span></li>
              <li><span class="mech-num">04</span><span><b>收录有门槛</b> — 项目库只收「值得花时间」的项目，每个都写明入选理由</span></li>
              <li><span class="mech-num">05</span><span><b>零依赖</b> — 纯 HTML/CSS/JS，双击即开，可部署到任何静态托管</span></li>
            </ul>
          </div>
        </div>
      </section>`;
    afterRender();
  }

  /* ============ 路由 ============ */
  const routes = { daily: () => renderDaily(0), wiki: renderWiki, repos: renderRepos, models: renderModels, timeline: renderTimeline, about: renderAbout };
  function navigate() {
    const key = (location.hash.replace(/^#\//, "") || "daily").split("?")[0];
    const fn = routes[key] || routes.daily;
    $$(".nav-links a").forEach(a => a.classList.toggle("active", a.dataset.route === (routes[key] ? key : "daily")));
    moveInk();
    view.style.opacity = 0; view.style.transform = "translateY(10px)";
    setTimeout(() => {
      fn();
      view.style.transition = "opacity .5s var(--ease), transform .5s var(--ease)";
      view.style.opacity = 1; view.style.transform = "none";
      window.scrollTo({ top: 0 });
    }, 120);
  }
  function moveInk() {
    const act = $(".nav-links a.active"), ink = $("#navInk");
    if (!act) return;
    ink.style.left = act.offsetLeft + "px";
    ink.style.width = act.offsetWidth + "px";
  }
  function afterRender() { observeReveals(); animateStars(); }
  window.addEventListener("hashchange", navigate);
  window.addEventListener("resize", moveInk);

  /* ---------- 回顶 ---------- */
  const toTop = $("#toTop");
  window.addEventListener("scroll", () => toTop.classList.toggle("show", window.scrollY > 600), { passive: true });
  toTop.onclick = () => window.scrollTo({ top: 0, behavior: "smooth" });

  navigate();
})();
