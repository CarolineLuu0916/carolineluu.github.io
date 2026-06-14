/* AI Trends — AI Agent 大事件进化时间线 */
window.AIT_TIMELINE = [
  {
    era: "PRELUDE", period: "2017 – 2022", title: "前传 · 地基",
    theme: "Transformer 架构与规模法则铺好了路，ChatGPT 点燃了火。",
    events: [
      { date: "2017.06", title: "Transformer 架构诞生", tag: "技术",
        desc: "Google 论文《Attention Is All You Need》发布。此后所有主流大模型都建立在这个架构上。" },
      { date: "2020.06", title: "GPT-3 发布", tag: "模型",
        desc: "1750 亿参数证明「规模出智能」：不用专门训练就能按提示完成各种任务，In-context Learning 登场。" },
      { date: "2022.11", title: "ChatGPT 上线", tag: "产品",
        desc: "5 天百万用户、2 个月破亿。AI 第一次成为大众产品，全行业的故事从这里讲起。" }
    ]
  },
  {
    era: "ACT I", period: "2023", title: "萌芽 · Agent 概念元年",
    theme: "GPT-4 给了大脑，Function Calling 给了手脚，AutoGPT 给了想象力。",
    events: [
      { date: "2023.03", title: "GPT-4 发布", tag: "模型",
        desc: "推理能力跨代提升，让「模型自主完成复杂任务」第一次变得可信。" },
      { date: "2023.03", title: "AutoGPT 引爆 Agent 概念", tag: "开源",
        desc: "「给 AI 一个目标让它自己跑」的疯狂实验，数周内冲上 GitHub 历史增速榜。虽然实用性有限，但 Agent 叙事自此成立。" },
      { date: "2023.04", title: "斯坦福「AI 小镇」", tag: "研究",
        desc: "25 个生成式智能体在虚拟小镇里社交、办派对。Generative Agents 论文成为多 Agent 研究的奠基之作。" },
      { date: "2023.06", title: "OpenAI 推出 Function Calling", tag: "技术",
        desc: "模型可以按格式调用外部函数——Agent 从「会说」到「会做」的技术拐点。" },
      { date: "2023.11", title: "GPTs 与 Assistants API", tag: "产品",
        desc: "OpenAI 首届开发者大会推出可定制 GPT 和 Agent 化 API，「人人都能做 Agent」的第一次平台尝试。" }
    ]
  },
  {
    era: "ACT II", period: "2024", title: "探索 · 从聊天到干活",
    theme: "Devin 卖出第一份「AI 工程师」简历，Computer Use 打开操作系统，MCP 埋下生态种子。",
    events: [
      { date: "2024.03", title: "Devin 亮相", tag: "产品",
        desc: "Cognition 发布「首位 AI 软件工程师」，演示完整接活写码上线。争议很大，但把编程 Agent 推上了商业舞台。" },
      { date: "2024.06", title: "Claude 3.5 Sonnet + Artifacts", tag: "模型",
        desc: "编码能力登顶 + 实时预览交互，Anthropic 开始在开发者群体中建立统治力。" },
      { date: "2024.09", title: "OpenAI o1：推理模型登场", tag: "模型",
        desc: "「先思考再回答」的范式开启推理时代，为 Agent 的复杂规划提供了大脑升级。" },
      { date: "2024.10", title: "Anthropic 发布 Computer Use", tag: "技术",
        desc: "Claude 学会看屏幕、动鼠标——AI 第一次能操作为人类设计的软件界面。" },
      { date: "2024.11", title: "MCP 协议开源", tag: "协议",
        desc: "Anthropic 开源模型上下文协议。当时少有人在意，一年后它成了整个 Agent 生态的「USB-C」。" }
    ]
  },
  {
    era: "ACT III", period: "2025", title: "爆发 · Agent 落地元年",
    theme: "DeepSeek 掀翻成本逻辑，Manus 点燃通用 Agent，编程 Agent 率先商业化，协议层完成标准化。",
    events: [
      { date: "2025.01", title: "DeepSeek-R1 震撼全球", tag: "中国",
        desc: "开源推理模型以极低成本对标 o1，引发美股巨震。开源权重从「备胎」变成「主角」，中国队正式领跑开源。" },
      { date: "2025.01", title: "OpenAI Operator 与 Deep Research", tag: "产品",
        desc: "浏览器操作 Agent 和深度调研 Agent 相继上线，OpenAI 给「Agent 产品长什么样」打了样。" },
      { date: "2025.03", title: "Manus 一夜爆红", tag: "中国",
        desc: "中国团队的通用 Agent 邀请码一码难求。无论后续争议如何，它让「通用 Agent」第一次出圈到大众。" },
      { date: "2025.04", title: "OpenAI、Google 接入 MCP；Google 发布 A2A", tag: "协议",
        desc: "竞争对手集体拥抱 Anthropic 的协议，MCP 成为事实标准；A2A 补上 Agent 互联的另一半。" },
      { date: "2025.05", title: "Claude Code 正式版：Agentic Coding 元年", tag: "产品",
        desc: "终端编程 Agent 成为开发者日常，与 Cursor 等共同把「编程」变成第一个被 Agent 重塑的职业。" },
      { date: "2025.08", title: "GPT-5 发布", tag: "模型",
        desc: "统一推理与对话路由。同期 Kimi K2、GLM、Qwen 开源轮番上新，中外旗舰进入贴身竞争。" }
    ]
  },
  {
    era: "ACT IV", period: "2026", title: "纵深 · 个人 Agent 与生产化",
    theme: "OpenClaw 证明个人 Agent 的需求真实存在，企业 Agent 开始按岗位上岗，开源与闭源的差距缩到半年。",
    events: [
      { date: "2026.01", title: "OpenClaw 现象", tag: "开源",
        desc: "本地优先个人助理数周内从 9K 星暴涨，全年破 37 万星。「数据在自己手里的数字员工」成为 2026 最强产品叙事。" },
      { date: "2026.04", title: "Kimi K2.6 与 GLM-5.1 开源", tag: "中国",
        desc: "K2.6 主打 Agent Swarm（单次调度 300 子代理）；GLM-5.1 采用 MIT 协议。国产开源全面转向 Agent 原生。" },
      { date: "2026.05", title: "旗舰三连：Qwen 3.7 Max、Opus 4.8、GPT-5.5", tag: "模型",
        desc: "1M 上下文成旗舰标配，价格集体下探。DeepSeek V4 Pro 以 1/34 价格逼近旗舰，性能溢价时代结束。" },
      { date: "2026.06", title: "微软 Scout 与 Claude Fable 5", tag: "产品",
        desc: "微软基于 OpenClaw 推出个人助理 Scout；Anthropic 新旗舰 Fable 5 直接登陆编程工具。个人 Agent 的平台之争正式开打。" }
    ]
  }
];
