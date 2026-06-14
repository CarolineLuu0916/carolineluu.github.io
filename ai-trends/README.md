# AI Trends

AI Agent 行业观察站 — curated by **Caroline Lu**

纯静态网站（零依赖、零构建），双击 `index.html` 即可打开，可部署到 GitHub Pages / Vercel / 任意静态托管。

## 站点结构

| 版块 | 内容 | 数据文件 |
|------|------|----------|
| 今日简报 | 每日行业日报：要闻 + 「意味着什么」解读 + 风向标，支持翻看历史 | `js/data-reports.js` |
| 百科 | AI Agent 知识点速查，支持搜索/提问，含产品视角与最新动态 | `js/data-wiki.js` |
| 项目库 | GitHub 高星项目精选，9 大分区，真实 star 数据 | `js/data-repos.js` |
| 模型图鉴 | 主流/非主流模型对比：定位、优缺点、价格、按场景速查 | `js/data-models.js` |
| 时间线 | 2017→2026 大事件进化节点，分五幕 | `js/data-timeline.js` |
| 关于 | 作者与站点机制 | `js/app.js` 内 |

样式：`css/style.css`（主题/通用组件）+ `css/sections.css`（各版块）。

## 每日更新机制

内容与代码完全分离，**更新只动 `js/data-*.js`**。在本目录打开 Claude Code，说：

> 请更新 AI Trends 网站：联网调研最近 24 小时的 AI Agent 行业动态，按 README 中的更新规范重写 js/data-reports.js（新增今日日报）、刷新 js/data-repos.js 的 star 数据，并把有变化的知识点同步进 js/data-wiki.js 的 fresh 字段。

### 更新规范（给 Claude 的约定）

1. **日报** `data-reports.js`
   - 在数组**头部**插入新一天的报告，`vol` 编号递增；保留历史。
   - 每条要闻必须有 `what`（发生了什么）和 `why`（意味着什么，产品经理视角）。
   - `region` 标签：海外(gl) / 中国(cn) / 开源(os) / 生态(eco)。
   - 信息须经多源交叉验证，禁止编造；拿不准的写明「待确认」。
2. **项目库** `data-repos.js`
   - star 数用 GitHub API 或页面抓取的真实值，更新 `updated` 字段。
   - 新项目入选标准：与 Agent 直接相关 + 生产可用或学习价值高 + 社区活跃；写明 `review`（入选理由）和 `fit`（适合谁）。
   - 抓取走本地 Clash 代理：`HTTPS_PROXY=http://127.0.0.1:7897`。
3. **百科** `data-wiki.js`
   - 行业有新动态时更新对应词条的 `fresh` 字段和顶部 `updated` 日期。
   - 出现新的重要概念时新增词条（含 `pm` 产品视角）。
4. **模型图鉴** `data-models.js`
   - 新模型发布或大版本更新时新增/修订条目；价格、上下文、基准分数须有出处。
   - 优缺点用「使用视角」写（不是营销稿）；过气模型移除或在 cons 注明。
   - 顶部 `picks`（按场景速查）随格局变化同步调整。
5. **时间线** `data-timeline.js`
   - 只收「进化节点」级别的大事件，宁缺毋滥。
6. 更新任何文件后，把 `index.html` 里静态资源的 `?v=` 版本号改成当天日期，避免浏览器缓存。

## 备注

- 网络：本机通过 Clash 混合端口 7897 代理访问 GitHub；Claude Code 的 API 代理已固化在 `~/.claude/settings.json`。
- 设计语言：纸面编辑部风（米白纸色 + 墨色 + 克莱因蓝），衬线标题 + 无衬线正文，入场动画基于 IntersectionObserver。
